<?php


namespace CoreDB\Classes;


use CoreDB\cache;
use CoreDB\queryBuilder;


class cacheHandler
{

    protected $cache;

    protected $cacheTokenArray;
    protected $regenerateCache;
    protected $useCache;


    public function __construct(string $storePath, queryBuilder $queryBuilder)
    {
        $this->cacheTokenArray = $queryBuilder->_getCacheTokenArray();

        $queryBuilderProperties = $queryBuilder->_getConditionProperties();
        $this->useCache = $queryBuilderProperties["useCache"];
        $this->regenerateCache = $queryBuilderProperties["regenerateCache"];

        $this->cache = new cache($storePath, $this->_getCacheTokenArray(), $queryBuilderProperties["cacheLifetime"]);
    }

    public function &_getCacheTokenArray(): array
    {
        return $this->cacheTokenArray;
    }

    public function getCacheContent($getOneDocument)
    {
        if ($this->getUseCache() !== true) {
            return null;
        }

        $this->updateCacheTokenArray(['oneDocument' => $getOneDocument]);

        if ($this->regenerateCache === true) {
            $this->getCache()->delete();
        }

        $cacheResults = $this->getCache()->get();
        if (is_array($cacheResults)) {
            return $cacheResults;
        }

        return null;
    }

    private function getUseCache(): bool
    {
        return $this->useCache;
    }

    private function updateCacheTokenArray(array $tokenUpdate)
    {
        if (empty($tokenUpdate)) {
            return;
        }
        $cacheTokenArray = $this->_getCacheTokenArray();
        foreach ($tokenUpdate as $key => $value) {
            $cacheTokenArray[$key] = $value;
        }
        $this->cacheTokenArray = $cacheTokenArray;
    }

    public function getCache(): cache
    {
        return $this->cache;
    }

    public function setCacheContent(array $results)
    {
        if ($this->getUseCache() === true) {
            $this->getCache()->set($results);
        }
    }

    public function deleteAllWithNoLifetime(): bool
    {
        return $this->getCache()->deleteAllWithNoLifetime();
    }

}