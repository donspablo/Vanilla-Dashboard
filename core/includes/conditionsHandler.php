<?php


namespace coreDb\Classes;


use coreDb\Exceptions\invalidArgumentException;
use DateTime;
use Exception;
use Throwable;


class conditionsHandler
{


    public static function handleWhereConditions(array $element, array $data): bool
    {
        if (empty($element)) {
            throw new invalidArgumentException("Malformed where statement! Where statements can not contain empty arrays.");
        }
        if (array_keys($element) !== range(0, (count($element) - 1))) {
            throw new invalidArgumentException("Malformed where statement! Associative arrays are not allowed.");
        }

        if (is_string($element[0]) && is_string($element[1])) {
            if (count($element) !== 3) {
                throw new invalidArgumentException("Where conditions have to be [fieldName, condition, value]");
            }

            $fieldName = $element[0];
            $condition = strtolower(trim($element[1]));
            $fieldValue = ($condition === 'exists')
                ? nestedHelper::nestedFieldExists($fieldName, $data)
                : nestedHelper::getNestedValue($fieldName, $data);

            return self::verifyCondition($condition, $fieldValue, $element[2]);
        }


        $results = [];
        foreach ($element as $value) {
            if (is_array($value)) {
                $results[] = self::handleWhereConditions($value, $data);
            } else if (is_string($value)) {
                $results[] = $value;
            } else if ($value instanceof \Closure) {
                $result = $value($data);
                if (!is_bool($result)) {
                    $resultType = gettype($result);
                    $errorMsg = "The closure in the where condition needs to return a boolean. Got: $resultType";
                    throw new invalidArgumentException($errorMsg);
                }
                $results[] = $result;
            } else {
                $value = (!is_object($value) && !is_array($value) && !is_null($value)) ? $value : gettype($value);
                throw new invalidArgumentException("Invalid nested where statement element! Expected condition or operation, got: \"$value\"");
            }
        }


        $returnValue = array_shift($results);

        if (is_bool($returnValue) === false) {
            throw new invalidArgumentException("Malformed where statement! First part of the statement have to be a condition.");
        }


        $orResults = [];


        while (!empty($results) || !empty($orResults)) {

            if (empty($results)) {
                if ($returnValue === true) {

                    break;
                }

                $nextResult = array_shift($orResults);
                $returnValue = $returnValue || $nextResult;
                continue;
            }

            $operationOrNextResult = array_shift($results);

            if (is_string($operationOrNextResult)) {
                $operation = $operationOrNextResult;

                if (empty($results)) {
                    throw new invalidArgumentException("Malformed where statement! Last part of a condition can not be a operation.");
                }
                $nextResult = array_shift($results);

                if (!is_bool($nextResult)) {
                    throw new invalidArgumentException("Malformed where statement! Two operations in a row are not allowed.");
                }
            } else if (is_bool($operationOrNextResult)) {
                $operation = "AND";
                $nextResult = $operationOrNextResult;
            } else {
                throw new invalidArgumentException("Malformed where statement! A where statement have to contain just operations and conditions.");
            }

            if (!in_array(strtolower($operation), ["and", "or"])) {
                $operation = (!is_object($operation) && !is_array($operation) && !is_null($operation)) ? $operation : gettype($operation);
                throw new invalidArgumentException("Expected 'and' or 'or' operator got \"$operation\"");
            }


            if (strtolower($operation) === "or") {
                $orResults[] = $returnValue;
                $returnValue = $nextResult;
                continue;
            }

            $returnValue = $returnValue && $nextResult;

        }

        return $returnValue;
    }

    public static function verifyCondition(string $condition, $fieldValue, $value): bool
    {

        if ($value instanceof DateTime) {


            if (empty($fieldValue)) {
                return false;
            }
            $value = $value->getTimestamp();
            $fieldValue = self::convertValueToTimeStamp($fieldValue);
        }

        $condition = strtolower(trim($condition));
        switch ($condition) {
            case "=":
            case "===":
                return ($fieldValue === $value);
            case "==":
                return ($fieldValue == $value);
            case "<>":
                return ($fieldValue != $value);
            case "!==":
            case "!=":
                return ($fieldValue !== $value);
            case ">":
                return ($fieldValue > $value);
            case ">=":
                return ($fieldValue >= $value);
            case "<":
                return ($fieldValue < $value);
            case "<=":
                return ($fieldValue <= $value);
            case "not like":
            case "like":

                if (!is_string($value)) {
                    throw new invalidArgumentException("When using \"LIKE\" or \"NOT LIKE\" the value has to be a string.");
                }


                $charactersToEscape = [".", "\\", "+", "*", "?", "$", "(", ")", "{", "}", "=", "!", "<", ">", "|", ":", "#"];
                foreach ($charactersToEscape as $characterToEscape) {
                    $value = str_replace($characterToEscape, "\\" . $characterToEscape, $value);
                }

                $value = str_replace(array('%', '_'), array('.*', '.{1}'), $value);
                $pattern = "/^" . $value . "$/i";
                $result = (preg_match($pattern, $fieldValue) === 1);
                return ($condition === "not like") ? !$result : $result;

            case "not in":
            case "in":
                if (!is_array($value)) {
                    $value = (!is_object($value) && !is_array($value) && !is_null($value)) ? $value : gettype($value);
                    throw new invalidArgumentException("When using \"in\" and \"not in\" you have to check against an array. Got: $value");
                }
                if (!empty($value)) {
                    (list($firstElement) = $value);
                    if ($firstElement instanceof DateTime) {


                        if (empty($fieldValue)) {
                            return false;
                        }

                        foreach ($value as $key => $item) {
                            if (!($item instanceof DateTime)) {
                                throw new invalidArgumentException("If one DateTime object is given in an \"IN\" or \"NOT IN\" comparison, every element has to be a DateTime object!");
                            }
                            $value[$key] = $item->getTimestamp();
                        }

                        $fieldValue = self::convertValueToTimeStamp($fieldValue);
                    }
                }
                $result = in_array($fieldValue, $value, true);
                return ($condition === "not in") ? !$result : $result;
            case "not between":
            case "between":

                if (!is_array($value) || ($valueLength = count($value)) !== 2) {
                    $value = (!is_object($value) && !is_array($value) && !is_null($value)) ? $value : gettype($value);
                    if (isset($valueLength)) {
                        $value .= " | Length: $valueLength";
                    }
                    throw new invalidArgumentException("When using \"between\" you have to check against an array with a length of 2. Got: $value");
                }

                list($startValue, $endValue) = $value;

                $result = (
                    self::verifyCondition(">=", $fieldValue, $startValue)
                    && self::verifyCondition("<=", $fieldValue, $endValue)
                );

                return ($condition === "not between") ? !$result : $result;
            case "not contains":
            case "contains":

                if (!is_array($fieldValue)) {
                    return ($condition === "not contains");
                }

                $fieldValues = [];

                if ($value instanceof DateTime) {

                    $value = $value->getTimestamp();

                    foreach ($fieldValue as $item) {


                        if (empty($item)) {
                            continue;
                        }
                        try {
                            $fieldValues[] = self::convertValueToTimeStamp($item);
                        } catch (Exception $exception) {
                        }
                    }
                }

                if (!empty($fieldValues)) {
                    $result = in_array($value, $fieldValues, true);
                } else {
                    $result = in_array($value, $fieldValue, true);
                }

                return ($condition === "not contains") ? !$result : $result;
            case 'exists':
                return $fieldValue === $value;
            default:
                throw new invalidArgumentException("Condition \"$condition\" is not allowed.");
        }
    }

    private static function convertValueToTimeStamp($value): int
    {
        $value = (is_string($value)) ? trim($value) : $value;
        try {
            return (new DateTime($value))->getTimestamp();
        } catch (Exception $exception) {
            $value = (!is_object($value) && !is_array($value))
                ? $value
                : gettype($value);
            throw new invalidArgumentException(
                "DateTime object given as value to check against. "
                . "Could not convert value into DateTime. "
                . "Value: $value"
            );
        }
    }

    public static function handleDistinct(array $results, array $currentDocument, array $distinctFields): bool
    {

        foreach ($results as $result) {
            foreach ($distinctFields as $field) {
                try {
                    $storePassed = (nestedHelper::getNestedValue($field, $result) !== nestedHelper::getNestedValue($field, $currentDocument));
                } catch (Throwable $th) {
                    continue;
                }
                if ($storePassed === false) {
                    return false;
                }
            }
        }

        return true;
    }

    public static function handleNestedWhere(array $data, bool $storePassed, array $nestedWhereConditions): bool
    {


        if (empty($nestedWhereConditions)) {
            return $storePassed;
        }


        $outerMostOperation = (array_keys($nestedWhereConditions))[0];
        $nestedConditions = $nestedWhereConditions[$outerMostOperation];


        $outerMostOperation = (is_string($outerMostOperation)) ? strtolower($outerMostOperation) : "and";


        if ($outerMostOperation === "or" && $storePassed === true) {
            return true;
        }

        return self::_nestedWhereHelper($nestedConditions, $data);
    }

    private static function _nestedWhereHelper(array $element, array $data): bool
    {


        if (array_keys($element) === range(0, (count($element) - 1)) && is_string($element[0])) {
            if (count($element) !== 3) {
                throw new invalidArgumentException("Where conditions have to be [fieldName, condition, value]");
            }

            $fieldValue = nestedHelper::getNestedValue($element[0], $data);

            return self::verifyCondition($element[1], $fieldValue, $element[2]);
        }


        $results = [];
        foreach ($element as $value) {
            if (is_array($value)) {
                $results[] = self::_nestedWhereHelper($value, $data);
            } else if (is_string($value)) {
                $results[] = $value;
            } else {
                $value = (!is_object($value) && !is_array($value)) ? $value : gettype($value);
                throw new invalidArgumentException("Invalid nested where statement element! Expected condition or operation, got: \"$value\"");
            }
        }

        if (count($results) < 3) {
            throw new invalidArgumentException("Malformed nested where statement! A condition consists of at least 3 elements.");
        }


        $returnValue = array_shift($results);


        while (!empty($results)) {
            $operation = array_shift($results);
            $nextResult = array_shift($results);

            if (((count($results) % 2) !== 0)) {
                throw new invalidArgumentException("Malformed nested where statement!");
            }

            if (!is_string($operation) || !in_array(strtolower($operation), ["and", "or"])) {
                $operation = (!is_object($operation) && !is_array($operation)) ? $operation : gettype($operation);
                throw new invalidArgumentException("Expected 'and' or 'or' operator got \"$operation\"");
            }

            if (strtolower($operation) === "and") {
                $returnValue = $returnValue && $nextResult;
            } else {
                $returnValue = $returnValue || $nextResult;
            }
        }

        return $returnValue;
    }
}