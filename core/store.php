<?php

namespace coreDb;

use Exception;
use coreDb\Classes\IoHelper;
use coreDb\Classes\NestedHelper;
use coreDb\Exceptions\IdNotAllowedException;
use coreDb\Exceptions\InvalidArgumentException;
use coreDb\Exceptions\InvalidConfigurationException;
use coreDb\Exceptions\IOException;
use coreDb\Exceptions\JsonException;

// To provide usage without composer, we need to require all files.
if (false === class_exists("\Composer\Autoload\ClassLoader")) {
    foreach (glob(__DIR__ . '/errors/*.php') as $exception) {
        require_once $exception;
    }
    foreach (glob(__DIR__ . '/includes/*.php') as $traits) {
        require_once $traits;
    }
    foreach (glob(__DIR__ . '/*.php') as $class) {
        if (strpos($class, 'coreDb.php') !== false || strpos($class, 'store.php') !== false) {
            continue;
        }
        require_once $class;
    }
}

class store
{

    const dataDirectory = "data/";
    protected $root = __DIR__;
    protected $storeName = "";
    protected $storePath = "";
    protected $databasePath = "";
    protected $useCache = true;
    protected $defaultCacheLifetime;
    protected $primaryKey = "_id";
    protected $timeout = 120;
    protected $searchOptions = [
        "minLength" => 2,
        "scoreKey" => "searchScore",
        "mode" => "or",
        "algorithm" => Query::SEARCH_ALGORITHM["hits"]
    ];

    public function changeStore(string $storeName, string $databasePath = null, array $configuration = []): store
    {
        if (empty($databasePath)) {
            $databasePath = $this->getDatabasePath();
        }
        $this->__construct($storeName, $databasePath, $configuration);
        return $this;
    }

    public function getDatabasePath(): string
    {
        return $this->databasePath;
    }

    public function __construct(string $storeName, string $databasePath, array $configuration = [])
    {
        $storeName = trim($storeName);
        if (empty($storeName)) {
            throw new InvalidArgumentException('store name can not be empty');
        }
        $this->storeName = $storeName;

        $databasePath = trim($databasePath);
        if (empty($databasePath)) {
            throw new InvalidArgumentException('data directory can not be empty');
        }

        IoHelper::normalizeDirectory($databasePath);
        $this->databasePath = $databasePath;

        $this->setConfiguration($configuration);


        $this->createDatabasePath();
        $this->createStore();
    }

    private function setConfiguration(array $configuration)
    {
        if (array_key_exists("auto_cache", $configuration)) {
            $autoCache = $configuration["auto_cache"];
            if (!is_bool($configuration["auto_cache"])) {
                throw new InvalidConfigurationException("auto_cache has to be boolean");
            }

            $this->useCache = $autoCache;
        }

        if (array_key_exists("cache_lifetime", $configuration)) {
            $defaultCacheLifetime = $configuration["cache_lifetime"];
            if (!is_int($defaultCacheLifetime) && !is_null($defaultCacheLifetime)) {
                throw new InvalidConfigurationException("cache_lifetime has to be null or int");
            }

            $this->defaultCacheLifetime = $defaultCacheLifetime;
        }


        if (array_key_exists("timeout", $configuration)) {
            $this->timeout = $configuration["timeout"];
        }
        if ($this->timeout !== false) {
            set_time_limit($this->timeout);
        }

        if (array_key_exists("primary_key", $configuration)) {
            $primaryKey = $configuration["primary_key"];
            if (!is_string($primaryKey)) {
                throw new InvalidConfigurationException("primary key has to be a string");
            }
            $this->primaryKey = $primaryKey;
        }

        if (array_key_exists("search", $configuration)) {
            $searchConfig = $configuration["search"];

            if (array_key_exists("min_length", $searchConfig)) {
                $searchMinLength = $searchConfig["min_length"];
                if (!is_int($searchMinLength) || $searchMinLength <= 0) {
                    throw new InvalidConfigurationException("min length for searching has to be an int >= 0");
                }
                $this->searchOptions["minLength"] = $searchMinLength;
            }

            if (array_key_exists("mode", $searchConfig)) {
                $searchMode = $searchConfig["mode"];
                if (!is_string($searchMode) || !in_array(strtolower(trim($searchMode)), ["and", "or"])) {
                    throw new InvalidConfigurationException("search mode can just be \"and\" or \"or\"");
                }
                $this->searchOptions["mode"] = strtolower(trim($searchMode));
            }

            if (array_key_exists("score_key", $searchConfig)) {
                $searchScoreKey = $searchConfig["score_key"];
                if ((!is_string($searchScoreKey) && !is_null($searchScoreKey))) {
                    throw new InvalidConfigurationException("search score key for search has to be a not empty string or null");
                }
                $this->searchOptions["scoreKey"] = $searchScoreKey;
            }

            if (array_key_exists("algorithm", $searchConfig)) {
                $searchAlgorithm = $searchConfig["algorithm"];
                if (!in_array($searchAlgorithm, Query::SEARCH_ALGORITHM, true)) {
                    $searchAlgorithm = implode(', ', $searchAlgorithm);
                    throw new InvalidConfigurationException("The search algorithm has to be one of the following integer values ($searchAlgorithm)");
                }
                $this->searchOptions["algorithm"] = $searchAlgorithm;
            }
        }
    }

    private function createDatabasePath()
    {
        $databasePath = $this->getDatabasePath();
        IoHelper::createFolder($databasePath);
    }

    private function createStore()
    {
        $storeName = $this->getStoreName();

        IoHelper::normalizeDirectory($storeName);

        $this->storePath = $this->getDatabasePath() . $storeName;
        $storePath = $this->getStorePath();
        IoHelper::createFolder($storePath);


        $cacheDirectory = $storePath . 'cache';
        IoHelper::createFolder($cacheDirectory);


        IoHelper::createFolder($storePath . self::dataDirectory);


        $counterFile = $storePath . '_cnt.sdb';
        if (!file_exists($counterFile)) {
            IoHelper::writeContentToFile($counterFile, '0');
        }
    }

    public function getStoreName(): string
    {
        return $this->storeName;
    }

    public function getStorePath(): string
    {
        return $this->storePath;
    }

    public function insert(array $data): array
    {

        if (empty($data)) {
            throw new InvalidArgumentException('No data found to insert in the store');
        }

        $data = $this->writeNewDocumentToStore($data);

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();

        return $data;
    }

    private function writeNewDocumentToStore(array $storeData): array
    {
        $primaryKey = $this->getPrimaryKey();

        if (isset($storeData[$primaryKey])) {
            throw new IdNotAllowedException(
                "The \"$primaryKey\" index is reserved by coreDb, please delete the $primaryKey key and try again"
            );
        }
        $id = $this->increaseCounterAndGetNextId();

        $storeData[$primaryKey] = $id;

        $storableJSON = @json_encode($storeData);
        if ($storableJSON === false) {
            throw new JsonException('Unable to encode the data array, 
        please provide a valid PHP associative array');
        }

        $filePath = $this->getDataPath() . "$id.json";

        IoHelper::writeContentToFile($filePath, $storableJSON);

        return $storeData;
    }

    public function getPrimaryKey(): string
    {
        return $this->primaryKey;
    }

    private function increaseCounterAndGetNextId(): int
    {
        $counterPath = $this->getStorePath() . '_cnt.sdb';

        if (!file_exists($counterPath)) {
            throw new IOException("File $counterPath does not exist.");
        }

        $dataPath = $this->getDataPath();

        return (int)IoHelper::updateFileContent($counterPath, function ($counter) use ($dataPath) {
            $newCounter = ((int)$counter) + 1;

            while (file_exists($dataPath . "$newCounter.json") === true) {
                $newCounter++;
            }
            return (string)$newCounter;
        });
    }

    private function getDataPath(): string
    {
        return $this->getStorePath() . self::dataDirectory;
    }

    public function createQueryBuilder(): QueryBuilder
    {
        return new QueryBuilder($this);
    }

    public function insertMany(array $data): array
    {

        if (empty($data)) {
            throw new InvalidArgumentException('No data found to insert in the store');
        }


        $results = [];
        foreach ($data as $document) {
            $results[] = $this->writeNewDocumentToStore($document);
        }

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();
        return $results;
    }

    public function deleteStore(): bool
    {
        $storePath = $this->getStorePath();
        return IoHelper::deleteFolder($storePath);
    }

    public function getLastInsertedId(): int
    {
        $counterPath = $this->getStorePath() . '_cnt.sdb';

        return (int)IoHelper::getFileContent($counterPath);
    }

    public function findAll(array $orderBy = null, int $limit = null, int $offset = null): array
    {
        $qb = $this->createQueryBuilder();
        if (!is_null($orderBy)) {
            $qb->orderBy($orderBy);
        }
        if (!is_null($limit)) {
            $qb->limit($limit);
        }
        if (!is_null($offset)) {
            $qb->skip($offset);
        }
        return $qb->getQuery()->fetch();
    }

    public function findBy(array $criteria, array $orderBy = null, int $limit = null, int $offset = null): array
    {
        $qb = $this->createQueryBuilder();

        $qb->where($criteria);

        if ($orderBy !== null) {
            $qb->orderBy($orderBy);
        }
        if ($limit !== null) {
            $qb->limit($limit);
        }
        if ($offset !== null) {
            $qb->skip($offset);
        }

        return $qb->getQuery()->fetch();
    }

    public function findOneBy(array $criteria)
    {
        $qb = $this->createQueryBuilder();

        $qb->where($criteria);

        $result = $qb->getQuery()->first();

        return (!empty($result)) ? $result : null;

    }

    public function updateOrInsert(array $data, bool $autoGenerateIdOnInsert = true): array
    {
        $primaryKey = $this->getPrimaryKey();

        if (empty($data)) {
            throw new InvalidArgumentException("No document to update or insert.");
        }


        if (!array_key_exists($primaryKey, $data)) {


            $data[$primaryKey] = $this->increaseCounterAndGetNextId();
        } else {
            $data[$primaryKey] = $this->checkAndStripId($data[$primaryKey]);
            if ($autoGenerateIdOnInsert && $this->findById($data[$primaryKey]) === null) {
                $data[$primaryKey] = $this->increaseCounterAndGetNextId();
            }
        }


        $storePath = $this->getDataPath() . "$data[$primaryKey].json";
        IoHelper::writeContentToFile($storePath, json_encode($data));

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();

        return $data;
    }

    private function checkAndStripId($id): int
    {
        if (!is_string($id) && !is_int($id)) {
            throw new InvalidArgumentException("The id of the document has to be an integer or string");
        }

        if (is_string($id)) {
            $id = IoHelper::secureStringForFileAccess($id);
        }

        if (!is_numeric($id)) {
            throw new InvalidArgumentException("The id of the document has to be numeric");
        }

        return (int)$id;
    }

    public function findById($id)
    {

        $id = $this->checkAndStripId($id);

        $filePath = $this->getDataPath() . "$id.json";

        try {
            $content = IoHelper::getFileContent($filePath);
        } catch (Exception $exception) {
            return null;
        }

        return @json_decode($content, true);
    }

    public function updateOrInsertMany(array $data, bool $autoGenerateIdOnInsert = true): array
    {
        $primaryKey = $this->getPrimaryKey();

        if (empty($data)) {
            throw new InvalidArgumentException("No documents to update or insert.");
        }


        foreach ($data as $key => $document) {
            if (!is_array($document)) {
                throw new InvalidArgumentException('Documents have to be an arrays.');
            }
            if (!array_key_exists($primaryKey, $document)) {


                $document[$primaryKey] = $this->increaseCounterAndGetNextId();
            } else {
                $document[$primaryKey] = $this->checkAndStripId($document[$primaryKey]);
                if ($autoGenerateIdOnInsert && $this->findById($document[$primaryKey]) === null) {
                    $document[$primaryKey] = $this->increaseCounterAndGetNextId();
                }
            }

            $data[$key] = $document;
        }


        foreach ($data as $document) {

            $storePath = $this->getDataPath() . "$document[$primaryKey].json";
            IoHelper::writeContentToFile($storePath, json_encode($document));
        }

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();

        return $data;
    }

    public function update(array $updatable): bool
    {
        $primaryKey = $this->getPrimaryKey();

        if (empty($updatable)) {
            throw new InvalidArgumentException("No documents to update.");
        }


        if (array_keys($updatable) !== range(0, (count($updatable) - 1))) {
            $updatable = [$updatable];
        }


        foreach ($updatable as $key => $document) {
            if (!is_array($document)) {
                throw new InvalidArgumentException('Documents have to be an arrays.');
            }
            if (!array_key_exists($primaryKey, $document)) {
                throw new InvalidArgumentException("Documents have to have the primary key \"$primaryKey\".");
            }

            $document[$primaryKey] = $this->checkAndStripId($document[$primaryKey]);

            $updatable[$key] = $document;

            $storePath = $this->getDataPath() . "$document[$primaryKey].json";

            if (!file_exists($storePath)) {
                return false;
            }
        }


        foreach ($updatable as $document) {

            $storePath = $this->getDataPath() . "$document[$primaryKey].json";
            IoHelper::writeContentToFile($storePath, json_encode($document));
        }

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();

        return true;
    }

    public function updateById($id, array $updatable)
    {

        $id = $this->checkAndStripId($id);

        $filePath = $this->getDataPath() . "$id.json";

        $primaryKey = $this->getPrimaryKey();

        if (array_key_exists($primaryKey, $updatable)) {
            throw new InvalidArgumentException("You can not update the primary key \"$primaryKey\" of documents.");
        }

        if (!file_exists($filePath)) {
            return false;
        }

        $content = IoHelper::updateFileContent($filePath, function ($content) use ($filePath, $updatable) {
            $content = @json_decode($content, true);
            if (!is_array($content)) {
                throw new JsonException("Could not decode content of \"$filePath\" with json_decode.");
            }
            foreach ($updatable as $key => $value) {
                NestedHelper::updateNestedValue($key, $content, $value);
            }
            return json_encode($content);
        });

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();

        return json_decode($content, true);
    }

    public function deleteBy(array $criteria, int $returnOption = Query::DELETE_RETURN_BOOL)
    {

        $query = $this->createQueryBuilder()->where($criteria)->getQuery();

        $query->getCache()->deleteAllWithNoLifetime();

        return $query->delete($returnOption);
    }

    public function deleteById($id): bool
    {

        $id = $this->checkAndStripId($id);

        $filePath = $this->getDataPath() . "$id.json";

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();

        return (!file_exists($filePath) || true === @unlink($filePath));
    }

    public function removeFieldsById($id, array $fieldsToRemove)
    {
        $id = $this->checkAndStripId($id);
        $filePath = $this->getDataPath() . "$id.json";
        $primaryKey = $this->getPrimaryKey();

        if (in_array($primaryKey, $fieldsToRemove, false)) {
            throw new InvalidArgumentException("You can not remove the primary key \"$primaryKey\" of documents.");
        }
        if (!file_exists($filePath)) {
            return false;
        }

        $content = IoHelper::updateFileContent($filePath, function ($content) use ($filePath, $fieldsToRemove) {
            $content = @json_decode($content, true);
            if (!is_array($content)) {
                throw new JsonException("Could not decode content of \"$filePath\" with json_decode.");
            }
            foreach ($fieldsToRemove as $fieldToRemove) {
                NestedHelper::removeNestedField($content, $fieldToRemove);
            }
            return $content;
        });

        $this->createQueryBuilder()->getQuery()->getCache()->deleteAllWithNoLifetime();

        return json_decode($content, true);
    }

    public function search(array $fields, string $query, array $orderBy = null, int $limit = null, int $offset = null): array
    {

        $qb = $this->createQueryBuilder();

        $qb->search($fields, $query);

        if ($orderBy !== null) {
            $qb->orderBy($orderBy);
        }

        if ($limit !== null) {
            $qb->limit($limit);
        }

        if ($offset !== null) {
            $qb->skip($offset);
        }

        return $qb->getQuery()->fetch();
    }

    public function count(): int
    {
        if ($this->_getUseCache() === true) {
            $cacheTokenArray = ["count" => true];
            $cache = new Cache($this->getStorePath(), $cacheTokenArray, null);
            $cacheValue = $cache->get();
            if (is_array($cacheValue) && array_key_exists("count", $cacheValue)) {
                return $cacheValue["count"];
            }
        }
        $value = [
            "count" => IoHelper::countFolderContent($this->getDataPath())
        ];
        if (isset($cache)) {
            $cache->set($value);
        }
        return $value["count"];
    }

    public function _getUseCache(): bool
    {
        return $this->useCache;
    }

    public function _getSearchOptions(): array
    {
        return $this->searchOptions;
    }

    public function _getDefaultCacheLifetime()
    {
        return $this->defaultCacheLifetime;
    }

    public function getDataDirectory(): string
    {

        return $this->databasePath;
    }

}
