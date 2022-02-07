<?php

namespace CoreDB;

use Closure;
use CoreDB\Exceptions\invalidArgumentException;

class queryBuilder
{


    protected $store;

    protected $cache;

    protected $whereConditions = [];

    protected $skip = 0;
    protected $limit = 0;
    protected $orderBy = [];
    protected $nestedWhere = [];
    protected $search = [];
    protected $searchOptions = [
        "minLength" => 2,
        "scoreKey" => "searchScore",
        "mode" => "or",
        "algorithm" => query::SEARCH_ALGORITHM["hits"]
    ];

    protected $fieldsToSelect = [];
    protected $fieldsToExclude = [];
    protected $groupBy = [];
    protected $havingConditions = [];

    protected $listOfJoins = [];
    protected $distinctFields = [];

    protected $useCache;
    protected $regenerateCache = false;
    protected $cacheLifetime;


    protected $propertiesNotUsedInConditionsArray = [
        "propertiesNotUsedInConditionsArray",
        "propertiesNotUsedForCacheToken",
        "store",
        "cache",
    ];

    protected $propertiesNotUsedForCacheToken = [
        "useCache",
        "regenerateCache",
        "cacheLifetime"
    ];


    public function __construct(Store $store)
    {
        $this->store = $store;
        $this->useCache = $store->_getUseCache();
        $this->cacheLifetime = $store->_getDefaultCacheLifetime();
        $this->searchOptions = $store->_getSearchOptions();
    }


    public function select(array $fieldNames): queryBuilder
    {
        foreach ($fieldNames as $key => $fieldName) {
            if (is_string($key)) {
                $this->fieldsToSelect[$key] = $fieldName;
            } else {
                $this->fieldsToSelect[] = $fieldName;
            }
        }
        return $this;
    }


    public function except(array $fieldNames): queryBuilder
    {
        $errorMsg = "If except is used an array containing strings with fieldNames has to be given";
        foreach ($fieldNames as $fieldName) {
            if (empty($fieldName)) {
                continue;
            }
            if (!is_string($fieldName)) {
                throw new invalidArgumentException($errorMsg);
            }
            $this->fieldsToExclude[] = $fieldName;
        }
        return $this;
    }


    public function where(array $conditions): queryBuilder
    {
        if (empty($conditions)) {
            throw new invalidArgumentException("You need to specify a where clause");
        }

        $this->whereConditions[] = $conditions;

        return $this;
    }


    public function orWhere(array $conditions): queryBuilder
    {

        if (empty($conditions)) {
            throw new invalidArgumentException("You need to specify a where clause");
        }

        $this->whereConditions[] = "or";
        $this->whereConditions[] = $conditions;

        return $this;
    }


    public function skip($skip = 0): queryBuilder
    {
        if ((!is_string($skip) || !is_numeric($skip)) && !is_int($skip)) {
            throw new invalidArgumentException("Skip has to be an integer or a numeric string");
        }

        if (!is_int($skip)) {
            $skip = (int)$skip;
        }

        if ($skip < 0) {
            throw new invalidArgumentException("Skip has to be an integer >= 0");
        }

        $this->skip = $skip;

        return $this;
    }


    public function limit($limit = 0): queryBuilder
    {

        if ((!is_string($limit) || !is_numeric($limit)) && !is_int($limit)) {
            throw new invalidArgumentException("Limit has to be an integer or a numeric string");
        }

        if (!is_int($limit)) {
            $limit = (int)$limit;
        }

        if ($limit <= 0) {
            throw new invalidArgumentException("Limit has to be an integer > 0");
        }

        $this->limit = $limit;

        return $this;
    }


    public function orderBy(array $criteria): queryBuilder
    {
        foreach ($criteria as $fieldName => $order) {

            if (!is_string($order)) {
                throw new invalidArgumentException('Order has to be a string! Please use "asc" or "desc" only.');
            }

            $order = strtolower($order);

            if (!is_string($fieldName)) {
                throw new invalidArgumentException("Field name has to be a string");
            }

            if (!in_array($order, ['asc', 'desc'])) {
                throw new invalidArgumentException('Please use "asc" or "desc" only.');
            }

            $this->orderBy[] = [
                'fieldName' => $fieldName,
                'order' => $order
            ];
        }

        return $this;
    }


    public function search($fields, string $query, array $options = []): queryBuilder
    {
        if (!is_array($fields) && !is_string($fields)) {
            throw new invalidArgumentException("Fields to search through have to be either a string or an array.");
        }

        if (!is_array($fields)) {
            $fields = (array)$fields;
        }

        if (empty($fields)) {
            throw new invalidArgumentException('Cant perform search due to no field name was provided');
        }

        if (count($fields) > 100) {
            trigger_error('Searching through more than 100 fields is not recommended and can be resource heavy.', E_USER_WARNING);
        }

        if (!empty($query)) {
            $this->search = [
                'fields' => $fields,
                'query' => $query
            ];
            if (!empty($options)) {
                if (array_key_exists("minLength", $options) && is_int($options["minLength"]) && $options["minLength"] > 0) {
                    $this->searchOptions["minLength"] = $options["minLength"];
                }
                if (array_key_exists("mode", $options) && is_string($options["mode"])) {
                    $searchMode = strtolower(trim($options["mode"]));
                    if (in_array($searchMode, ["and", "or"])) {
                        $this->searchOptions["mode"] = $searchMode;
                    }
                }
                if (array_key_exists("scoreKey", $options) && (is_string($options["scoreKey"]) || is_null($options["scoreKey"]))) {
                    $this->searchOptions["scoreKey"] = $options["scoreKey"];
                }
                if (array_key_exists("algorithm", $options) && in_array($options["algorithm"], query::SEARCH_ALGORITHM, true)) {
                    $this->searchOptions["algorithm"] = $options["algorithm"];
                }
            }
        }
        return $this;
    }


    public function join(Closure $joinFunction, string $propertyName): queryBuilder
    {
        $this->listOfJoins[] = [
            'propertyName' => $propertyName,
            'joinFunction' => $joinFunction
        ];
        return $this;
    }


    public function distinct($fields = []): queryBuilder
    {
        $fieldType = gettype($fields);
        if ($fieldType === 'array') {
            if ($fields === array_values($fields)) {

                $this->distinctFields = array_merge($this->distinctFields, $fields);
            } else {
                throw new invalidArgumentException(
                    'Field value in distinct() method can not be an associative array, 
          please provide a string or a list of string as a non-associative array.'
                );
            }
        } else if ($fieldType === 'string' && !empty($fields)) {
            $this->distinctFields[] = trim($fields);
        } else {
            throw new invalidArgumentException(
                'Field value in distinct() is invalid.'
            );
        }
        return $this;
    }


    public function useCache(int $lifetime = null): queryBuilder
    {
        $this->useCache = true;
        if ((!is_int($lifetime) || $lifetime < 0) && !is_null($lifetime)) {
            throw new invalidArgumentException("lifetime has to be int >= 0 or null");
        }
        $this->cacheLifetime = $lifetime;
        return $this;
    }


    public function disableCache(): queryBuilder
    {
        $this->useCache = false;
        return $this;
    }


    public function regenerateCache(): queryBuilder
    {
        $this->regenerateCache = true;
        return $this;
    }


    public function getQuery(): query
    {
        return new query($this);
    }


    public function groupBy(array $groupByFields, string $countKeyName = null, bool $allowEmpty = false): queryBuilder
    {
        $this->groupBy = [
            "groupByFields" => $groupByFields,
            "countKeyName" => $countKeyName,
            "allowEmpty" => $allowEmpty
        ];
        return $this;
    }


    public function having(array $criteria): queryBuilder
    {
        if (empty($criteria)) {
            throw new invalidArgumentException("You need to specify a having clause");
        }
        $this->havingConditions = $criteria;
        return $this;
    }


    public function _getCacheTokenArray(): array
    {
        $properties = [];
        $conditionsArray = $this->_getConditionProperties();

        foreach ($conditionsArray as $propertyName => $propertyValue) {
            if (!in_array($propertyName, $this->propertiesNotUsedForCacheToken, true)) {
                $properties[$propertyName] = $propertyValue;
            }
        }

        return $properties;
    }


    public function _getConditionProperties(): array
    {
        $allProperties = get_object_vars($this);
        $properties = [];

        foreach ($allProperties as $propertyName => $propertyValue) {
            if (!in_array($propertyName, $this->propertiesNotUsedInConditionsArray, true)) {
                $properties[$propertyName] = $propertyValue;
            }
        }

        return $properties;
    }


    public function _getStore(): Store
    {
        return $this->store;
    }


    public function in(string $fieldName, array $values = []): queryBuilder
    {
        if (empty($fieldName)) {
            throw new invalidArgumentException('Field name for in clause can not be empty.');
        }


        $this->whereConditions[] = [$fieldName, "in", $values];
        return $this;
    }


    public function notIn(string $fieldName, array $values = []): queryBuilder
    {
        if (empty($fieldName)) {
            throw new invalidArgumentException('Field name for notIn clause can not be empty.');
        }


        $this->whereConditions[] = [$fieldName, "not in", $values];
        return $this;
    }


    public function nestedWhere(array $conditions): queryBuilder
    {

        if (empty($conditions)) {
            throw new invalidArgumentException("You need to specify nested where clauses");
        }

        if (count($conditions) > 1) {
            throw new invalidArgumentException("You are not allowed to specify multiple elements at the first depth!");
        }

        $outerMostOperation = (array_keys($conditions))[0];
        $outerMostOperation = (is_string($outerMostOperation)) ? strtolower($outerMostOperation) : $outerMostOperation;

        $allowedOuterMostOperations = [0, "and", "or"];

        if (!in_array($outerMostOperation, $allowedOuterMostOperations, true)) {
            throw new invalidArgumentException("Outer most operation has to one of the following: ( 0 / and / or ) ");
        }

        $this->nestedWhere = $conditions;

        return $this;
    }

}
