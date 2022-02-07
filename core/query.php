<?php

namespace coreDb;

use coreDb\Classes\cacheHandler;
use coreDb\Classes\documentFinder;
use coreDb\Classes\documentUpdater;
use coreDb\Exceptions\invalidArgumentException;


class query
{

    const DELETE_RETURN_BOOL = 1;
    const DELETE_RETURN_RESULTS = 2;
    const DELETE_RETURN_COUNT = 3;

    const SEARCH_ALGORITHM = [
        "hits" => 1,
        "hits_prioritize" => 2,
        "prioritize" => 3,
        "prioritize_position" => 4,
    ];


    protected $cacheHandler;


    protected $documentFinder;


    protected $documentUpdater;


    public function __construct(queryBuilder $queryBuilder)
    {
        $store = $queryBuilder->_getStore();
        $primaryKey = $store->getPrimaryKey();

        $this->cacheHandler = new cacheHandler($store->getStorePath(), $queryBuilder);
        $this->documentFinder = new documentFinder($store->getStorePath(), $queryBuilder->_getConditionProperties(), $primaryKey);
        $this->documentUpdater = new documentUpdater($store->getStorePath(), $primaryKey);
    }


    public function fetch(): array
    {
        return $this->getResults();
    }

    private function getResults(bool $getOneDocument = false): array
    {

        $results = $this->getCacheHandler()->getCacheContent($getOneDocument);

        if ($results !== null) {
            return $results;
        }

        $results = $this->documentFinder->findDocuments($getOneDocument, true);

        if ($getOneDocument === true && count($results) > 0) {
            list($item) = $results;
            $results = $item;
        }

        $this->getCacheHandler()->setCacheContent($results);

        return $results;
    }

    private function getCacheHandler(): cacheHandler
    {
        return $this->cacheHandler;
    }

    public function exists(): bool
    {

        return !empty($this->first());
    }

    public function first(): array
    {
        return $this->getResults(true);
    }

    public function update(array $updatable, bool $returnUpdatedDocuments = false)
    {

        if (empty($updatable)) {
            throw new invalidArgumentException("You have to define what you want to update.");
        }

        $results = $this->documentFinder->findDocuments(false, false);

        $this->getCacheHandler()->deleteAllWithNoLifetime();

        return $this->documentUpdater->updateResults($results, $updatable, $returnUpdatedDocuments);
    }

    public function delete(int $returnOption = self::DELETE_RETURN_BOOL)
    {
        $results = $this->documentFinder->findDocuments(false, false);

        $this->getCacheHandler()->deleteAllWithNoLifetime();

        return $this->documentUpdater->deleteResults($results, $returnOption);
    }

    public function removeFields(array $fieldsToRemove)
    {
        if (empty($fieldsToRemove)) {
            throw new invalidArgumentException("You have to define what fields you want to remove.");
        }
        $results = $this->documentFinder->findDocuments(false, false);

        $this->getCacheHandler()->deleteAllWithNoLifetime();

        return $this->documentUpdater->removeFields($results, $fieldsToRemove);
    }

    public function getCache(): cache
    {
        return $this->getCacheHandler()->getCache();
    }
}