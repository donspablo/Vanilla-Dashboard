<?php

namespace coreDb;

use Closure;
use coreDb\Exceptions\invalidArgumentException;

if (false === class_exists("\Composer\Autoload\ClassLoader")) {
    require_once __DIR__ . '/store.php';
}


class coreDb
{


    protected $queryBuilder;


    protected $store;

    private $shouldKeepConditions = false;


    public function __construct(string $storeName, string $dataDir, array $configuration = [])
    {
        $this->init($storeName, $dataDir, $configuration);
    }


    public function init(string $storeName, string $dataDir, array $conf = [])
    {
        $this->setStore(new Store($storeName, $dataDir, $conf));
        $this->setQueryBuilder($this->getStore()->createQueryBuilder());
    }

    private function setStore(Store $store)
    {
        $this->store = $store;
    }

    private function setQueryBuilder(queryBuilder $queryBuilder)
    {
        $this->queryBuilder = $queryBuilder;
    }

    public function getStore(): Store
    {
        return $this->store;
    }

    public static function store(string $storeName, string $dataDir, array $configuration = []): coreDb
    {
        return new coreDb($storeName, $dataDir, $configuration);
    }

    public function fetch(): array
    {
        return $this->getQuery()->fetch();
    }

    public function getQuery(): query
    {
        $query = $this->getQueryBuilder()->getQuery();
        $this->resetQueryBuilder();
        return $query;
    }

    public function getQueryBuilder(): queryBuilder
    {
        return $this->queryBuilder;
    }

    private function resetQueryBuilder()
    {
        if ($this->shouldKeepConditions === true) {
            return;
        }
        $this->setQueryBuilder($this->getStore()->createQueryBuilder());
    }

    public function exists(): bool
    {
        return $this->getQuery()->exists();
    }

    public function first(): array
    {
        return $this->getQuery()->first();
    }

    public function insert(array $storeData): array
    {
        return $this->getStore()->insert($storeData);
    }

    public function insertMany(array $storeData): array
    {
        return $this->getStore()->insertMany($storeData);
    }

    public function update(array $updatable): bool
    {
        return $this->getQuery()->update($updatable);
    }

    public function delete(int $returnOption = query::DELETE_RETURN_BOOL)
    {
        return $this->getQuery()->delete($returnOption);
    }

    public function deleteStore(): bool
    {
        return $this->getStore()->deleteStore();
    }

    public function getCacheToken(): string
    {
        return $this->getQueryBuilder()->getQuery()->getCache()->getToken();
    }

    public function select(array $fieldNames): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->select($fieldNames));
        return $this;
    }

    public function except(array $fieldNames): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->except($fieldNames));
        return $this;
    }

    public function where(...$conditions): coreDb
    {
        foreach ($conditions as $key => $arg) {
            if ($key > 0) {
                throw new invalidArgumentException("Allowed: (string fieldName, string condition, mixed value) OR (array(array(string fieldName, string condition, mixed value)[, array(...)]))");
            }
            if (is_array($arg)) {

                $this->setQueryBuilder($this->getQueryBuilder()->where($arg));
                break;
            }
            if (count($conditions) === 3) {

                $this->setQueryBuilder($this->getQueryBuilder()->where($conditions));
                break;
            }
        }

        return $this;
    }

    public function in(string $fieldName, array $values = []): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->in($fieldName, $values));
        return $this;
    }

    public function notIn(string $fieldName, array $values = []): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->notIn($fieldName, $values));
        return $this;
    }

    public function orWhere(...$conditions): coreDb
    {
        foreach ($conditions as $key => $arg) {
            if ($key > 0) {
                throw new invalidArgumentException("Allowed: (string fieldName, string condition, mixed value) OR array(array(string fieldName, string condition, mixed value) [, array(...)])");
            }
            if (is_array($arg)) {

                $this->setQueryBuilder($this->getQueryBuilder()->orWhere($arg));
                break;
            }
            if (count($conditions) === 3) {

                $this->setQueryBuilder($this->getQueryBuilder()->orWhere($conditions));
                break;
            }
        }

        return $this;
    }

    public function skip(int $skip = 0): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->skip($skip));
        return $this;
    }

    public function limit(int $limit = 0): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->limit($limit));
        return $this;
    }

    public function orderBy(string $order, string $orderBy = '_id'): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->orderBy([$orderBy => $order]));
        return $this;
    }

    public function search($field, string $keyword): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->search($field, $keyword));
        return $this;
    }

    public function join(Closure $joinedStore, string $dataPropertyName): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->join($joinedStore, $dataPropertyName));
        return $this;
    }

    public function makeCache(): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->regenerateCache());
        return $this;
    }

    public function disableCache(): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->disableCache());
        return $this;
    }

    public function useCache(int $lifetime = null): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->useCache($lifetime));
        return $this;
    }

    public function deleteCache(): coreDb
    {
        $this->getQueryBuilder()->getQuery()->getCache()->delete();
        return $this;
    }

    public function deleteAllCache(): coreDb
    {
        $this->getQueryBuilder()->getQuery()->getCache()->deleteAll();
        return $this;
    }

    public function keepConditions(): coreDb
    {
        $this->shouldKeepConditions = true;
        return $this;
    }

    public function distinct($fields = []): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->distinct($fields));
        return $this;
    }

    public function getCache(): cache
    {

        return $this->getQueryBuilder()->getQuery()->getCache();
    }

    public function findAll(): array
    {
        return $this->getStore()->findAll();
    }


    public function findById(int $id)
    {
        return $this->getStore()->findById($id);
    }


    public function findBy(array $criteria, array $orderBy = null, int $limit = null, int $offset = null): array
    {
        return $this->getStore()->findBy($criteria, $orderBy, $limit, $offset);
    }


    public function findOneBy(array $criteria)
    {
        return $this->getStore()->findOneBy($criteria);
    }


    public function updateBy(array $updatable): bool
    {
        return $this->getStore()->update($updatable);
    }


    public function deleteBy($criteria, $returnOption = query::DELETE_RETURN_BOOL)
    {
        return $this->getStore()->deleteBy($criteria, $returnOption);
    }


    public function deleteById($id): bool
    {
        return $this->getStore()->deleteById($id);
    }


    public function nestedWhere(array $conditions): coreDb
    {
        $this->setQueryBuilder($this->getQueryBuilder()->nestedWhere($conditions));
        return $this;
    }

}
