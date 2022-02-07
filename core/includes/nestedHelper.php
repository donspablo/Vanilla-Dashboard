<?php


namespace coreDb\Classes;


use coreDb\Exceptions\invalidArgumentException;


class nestedHelper
{


    public static function getNestedValue(string $fieldName, array $data)
    {
        $fieldName = trim($fieldName);
        if (empty($fieldName)) {
            throw new invalidArgumentException('fieldName is not allowed to be empty');
        }

        foreach (explode('.', $fieldName) as $i) {

            if (!isset($data[$i])) {
                return null;
            }

            $data = $data[$i];
        }
        return $data;
    }


    public static function nestedFieldExists(string $fieldName, array $data)
    {
        $fieldName = trim($fieldName);
        if (empty($fieldName)) {
            throw new invalidArgumentException('fieldName is not allowed to be empty');
        }


        foreach (explode('.', $fieldName) as $i) {

            if (!is_array($data) || !array_key_exists($i, $data)) {
                return false;
            }

            $data = $data[$i];
        }
        return true;
    }

    public static function updateNestedValue(string $fieldName, array &$data, $newValue)
    {
        $fieldNameArray = explode(".", $fieldName);
        $value = $newValue;
        if (count($fieldNameArray) > 1) {
            $data = self::_updateNestedValueHelper($fieldNameArray, $data, $newValue, count($fieldNameArray));
            return;
        }
        $data[$fieldNameArray[0]] = $value;
    }

    private static function _updateNestedValueHelper(array $keysArray, $data, $newValue, int $originalKeySize)
    {
        if (empty($keysArray)) {
            return $newValue;
        }
        $currentKey = $keysArray[0];
        $result = (is_array($data)) ? $data : [];
        if (!is_array($data) || !array_key_exists($currentKey, $data)) {
            $result[$currentKey] = self::_updateNestedValueHelper(array_slice($keysArray, 1), $data, $newValue, $originalKeySize);
            if (count($keysArray) !== $originalKeySize) {
                return $result;
            }
        }
        $result[$currentKey] = self::_updateNestedValueHelper(array_slice($keysArray, 1), $data[$currentKey], $newValue, $originalKeySize);
        return $result;
    }

    public static function createNestedArray(string $fieldName, $fieldValue): array
    {
        $temp = [];
        $fieldNameArray = explode('.', $fieldName);
        $fieldNameArrayReverse = array_reverse($fieldNameArray);
        foreach ($fieldNameArrayReverse as $index => $i) {
            if ($index === 0) {
                $temp = array($i => $fieldValue);
            } else {
                $temp = array($i => $temp);
            }
        }

        return $temp;
    }

    public static function removeNestedField(array &$document, string $fieldToRemove)
    {
        if (array_key_exists($fieldToRemove, $document)) {
            unset($document[$fieldToRemove]);
            return;
        }

        $temp = &$document;
        $fieldNameArray = explode('.', $fieldToRemove);
        $fieldNameArrayCount = count($fieldNameArray);
        foreach ($fieldNameArray as $index => $i) {

            if (($fieldNameArrayCount - 1) === $index) {
                if (is_array($temp) && array_key_exists($i, $temp)) {
                    unset($temp[$i]);
                }
                break;
            }
            if (!is_array($temp) || !array_key_exists($i, $temp)) {
                break;
            }
            $temp = &$temp[$i];
        }
    }
}