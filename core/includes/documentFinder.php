<?php


namespace CoreDB\Classes;


use CoreDB\query;
use CoreDB\Store;
use Exception;


class documentFinder
{
    protected $storePath;
    protected $queryBuilderProperties;
    protected $primaryKey;

    public function __construct(string $storePath, array $queryBuilderProperties, string $primaryKey)
    {
        $this->storePath = $storePath;
        $this->queryBuilderProperties = $queryBuilderProperties;
        $this->primaryKey = $primaryKey;
    }


    public function findDocuments(bool $getOneDocument, bool $reduceAndJoinPossible): array
    {
        $queryBuilderProperties = $this->queryBuilderProperties;
        $dataPath = $this->getDataPath();
        $primaryKey = $this->primaryKey;

        $found = [];

        ioHelper::checkRead($dataPath);

        $conditions = $queryBuilderProperties["whereConditions"];
        $distinctFields = $queryBuilderProperties["distinctFields"];
        $nestedWhereConditions = $queryBuilderProperties["nestedWhere"];
        $listOfJoins = $queryBuilderProperties["listOfJoins"];
        $search = $queryBuilderProperties["search"];
        $searchOptions = $queryBuilderProperties["searchOptions"];
        $groupBy = $queryBuilderProperties["groupBy"];
        $havingConditions = $queryBuilderProperties["havingConditions"];
        $fieldsToSelect = $queryBuilderProperties["fieldsToSelect"];
        $orderBy = $queryBuilderProperties["orderBy"];
        $skip = $queryBuilderProperties["skip"];
        $limit = $queryBuilderProperties["limit"];
        $fieldsToExclude = $queryBuilderProperties["fieldsToExclude"];

        unset($queryBuilderProperties);

        if ($handle = opendir($dataPath)) {

            while (false !== ($entry = readdir($handle))) {

                if ($entry === "." || $entry === "..") {
                    continue;
                }

                $documentPath = $dataPath . $entry;

                try {
                    $data = ioHelper::getFileContent($documentPath);
                } catch (Exception $exception) {
                    continue;
                }
                $data = @json_decode($data, true);
                if (!is_array($data)) {
                    continue;
                }

                $storePassed = true;


                if (!empty($conditions)) {

                    $storePassed = conditionsHandler::handleWhereConditions($conditions, $data);
                }


                $storePassed = conditionsHandler::handleNestedWhere($data, $storePassed, $nestedWhereConditions);

                if ($storePassed === true && count($distinctFields) > 0) {
                    $storePassed = conditionsHandler::handleDistinct($found, $data, $distinctFields);
                }

                if ($storePassed === true) {
                    $found[] = $data;


                    if ($getOneDocument === true) {
                        break;
                    }
                }
            }
            closedir($handle);
        }


        if ($reduceAndJoinPossible === true) {
            documentReducer::joinData($found, $listOfJoins);
        }

        if (count($found) > 0) {
            self::performSearch($found, $search, $searchOptions);
        }

        if ($reduceAndJoinPossible === true && !empty($groupBy) && count($found) > 0) {

            documentReducer::handleGroupBy(
                $found,
                $groupBy,
                $fieldsToSelect
            );
        }

        if ($reduceAndJoinPossible === true && empty($groupBy) && count($found) > 0) {

            documentReducer::selectFields($found, $primaryKey, $fieldsToSelect);
        }

        if (count($found) > 0) {
            self::handleHaving($found, $havingConditions);
        }

        if ($reduceAndJoinPossible === true && count($found) > 0) {

            documentReducer::excludeFields($found, $fieldsToExclude);
        }

        if (count($found) > 0) {

            self::sort($found, $orderBy);
        }


        if (count($found) > 0) {

            self::skip($found, $skip);
        }

        if (count($found) > 0) {

            self::limit($found, $limit);
        }

        return $found;
    }


    private function getDataPath(): string
    {
        return $this->storePath . Store::dataDirectory;
    }

    private static function performSearch(array &$found, array $search, array $searchOptions)
    {
        if (empty($search)) {
            return;
        }
        $minLength = $searchOptions["minLength"];
        $searchScoreKey = $searchOptions["scoreKey"];
        $searchMode = $searchOptions["mode"];
        $searchAlgorithm = $searchOptions["algorithm"];

        $scoreMultiplier = 64;
        $encoding = "UTF-8";

        $fields = $search["fields"];
        $query = $search["query"];
        $lowerQuery = mb_strtolower($query, $encoding);
        $exactQuery = preg_quote($query, "/");

        $fieldsLength = count($fields);

        $highestScore = $scoreMultiplier ** $fieldsLength;


        $searchWords = preg_replace('/(\s)/u', ',', $query);
        $searchWords = explode(",", $searchWords);

        $prioritizeAlgorithm = (in_array($searchAlgorithm, [
            query::SEARCH_ALGORITHM["prioritize"],
            query::SEARCH_ALGORITHM["prioritize_position"]
        ], true));

        $positionAlgorithm = ($searchAlgorithm === query::SEARCH_ALGORITHM["prioritize_position"]);


        $temp = [];
        foreach ($searchWords as $searchWord) {
            if (strlen($searchWord) >= $minLength) {
                $temp[] = $searchWord;
            }
        }
        $searchWords = $temp;
        unset($temp);
        $searchWords = array_map(static function ($value) {
            return preg_quote($value, "/");
        }, $searchWords);


        if ($searchMode === "and") {
            $preg = "";
            foreach ($searchWords as $searchWord) {
                $preg .= "(?=.*" . $searchWord . ")";
            }
            $preg = '/^' . $preg . '.*/im';
            $pregOr = '!(' . implode('|', $searchWords) . ')!i';
        } else {
            $preg = '!(' . implode('|', $searchWords) . ')!i';
        }


        foreach ($found as $foundKey => &$document) {
            $searchHits = 0;
            $searchScore = 0;
            foreach ($fields as $key => $field) {
                if ($prioritizeAlgorithm) {
                    $score = $highestScore / ($scoreMultiplier ** $key);
                } else {
                    $score = $scoreMultiplier;
                }
                $value = nestedHelper::getNestedValue($field, $document);

                if (!is_string($value) || $value === "") {
                    continue;
                }

                $lowerValue = mb_strtolower($value, $encoding);

                if ($lowerQuery === $lowerValue) {

                    $searchHits++;
                    $searchScore += 16 * $score;
                } elseif ($positionAlgorithm && mb_strpos($lowerValue, $lowerQuery, 0, $encoding) === 0) {

                    $searchHits++;
                    $searchScore += 8 * $score;
                } elseif ($matches = preg_match_all('!' . $exactQuery . '!i', $value)) {

                    $searchHits += $matches;

                    $searchScore += $matches * 2 * $score;
                    if ($searchAlgorithm === query::SEARCH_ALGORITHM["hits_prioritize"]) {
                        $searchScore += $matches * ($fieldsLength - $key);
                    }
                }

                $matchesArray = [];

                $matches = ($searchMode === "and") ? preg_match($preg, $value) : preg_match_all($preg, $value, $matchesArray, PREG_OFFSET_CAPTURE);

                if ($matches) {

                    $searchHits += $matches;
                    $searchScore += $matches * $score;
                    if ($searchAlgorithm === query::SEARCH_ALGORITHM["hits_prioritize"]) {
                        $searchScore += $matches * ($fieldsLength - $key);
                    }

                    if ($searchMode === "and" && isset($pregOr) && ($matches = preg_match_all($pregOr, $value, $matchesArray, PREG_OFFSET_CAPTURE))) {
                        $searchHits += $matches;
                        $searchScore += $matches * $score;
                    }
                }


                if ($positionAlgorithm && $matches && !empty($matchesArray)) {
                    $hitPosition = $matchesArray[0][0][1];
                    if (!is_int($hitPosition) || !($hitPosition > 0)) {
                        $hitPosition = 1;
                    }
                    $searchScore += ($score / $highestScore) * ($hitPosition / ($hitPosition * $hitPosition));
                }
            }

            if ($searchHits > 0) {
                if (!is_null($searchScoreKey)) {
                    $document[$searchScoreKey] = $searchScore;
                }
            } else {
                unset($found[$foundKey]);
            }
        }
    }

    private static function handleHaving(array &$found, array $havingConditions)
    {
        if (empty($havingConditions)) {
            return;
        }

        foreach ($found as $key => $document) {
            if (false === conditionsHandler::handleWhereConditions($havingConditions, $document)) {
                unset($found[$key]);
            }
        }
    }

    private static function sort(array &$found, array $orderBy)
    {
        if (!empty($orderBy)) {

            $resultSortArray = [];

            foreach ($orderBy as $orderByClause) {

                $order = $orderByClause['order'];
                $fieldName = $orderByClause['fieldName'];

                $arrayColumn = [];

                foreach ($found as $value) {
                    $arrayColumn[] = nestedHelper::getNestedValue($fieldName, $value);
                }

                $resultSortArray[] = $arrayColumn;


                $resultSortArray[] = ($order === 'asc') ? SORT_ASC : SORT_DESC;

            }

            if (!empty($resultSortArray)) {
                $resultSortArray[] = &$found;
                array_multisort(...$resultSortArray);
            }
            unset($resultSortArray);
        }
    }

    private static function skip(array &$found, $skip)
    {
        if (empty($skip) || $skip <= 0) {
            return;
        }
        $found = array_slice($found, $skip);
    }

    private static function limit(array &$found, $limit)
    {
        if (empty($limit) || $limit <= 0) {
            return;
        }
        $found = array_slice($found, 0, $limit);
    }

}