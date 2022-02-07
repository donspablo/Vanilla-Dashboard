<?php


namespace CoreDB\Classes;


use CoreDB\Exceptions\invalidArgumentException;
use CoreDB\Exceptions\iOException;
use CoreDB\query;
use CoreDB\Store;


class documentUpdater
{

    protected $storePath;
    protected $primaryKey;

    public function __construct(string $storePath, string $primaryKey)
    {
        $this->storePath = $storePath;
        $this->primaryKey = $primaryKey;
    }


    public function updateResults(array $results, array $updatable, bool $returnUpdatedDocuments)
    {
        if (count($results) === 0) {
            return false;
        }

        $primaryKey = $this->primaryKey;
        $dataPath = $this->getDataPath();

        foreach ($results as $key => $data) {
            $primaryKeyValue = ioHelper::secureStringForFileAccess($data[$primaryKey]);
            $data[$primaryKey] = (int)$primaryKeyValue;
            $results[$key] = $data;

            $filePath = $dataPath . $primaryKeyValue . '.json';
            if (!file_exists($filePath)) {
                return false;
            }
        }

        foreach ($results as $key => $data) {
            $filePath = $dataPath . $data[$primaryKey] . '.json';
            foreach ($updatable as $fieldName => $value) {

                if ($fieldName !== $primaryKey) {
                    nestedHelper::updateNestedValue($fieldName, $data, $value);
                }
            }
            ioHelper::writeContentToFile($filePath, json_encode($data));
            $results[$key] = $data;
        }
        return ($returnUpdatedDocuments === true) ? $results : true;
    }

    private function getDataPath(): string
    {
        return $this->storePath . Store::dataDirectory;
    }

    public function deleteResults(array $results, int $returnOption)
    {
        $primaryKey = $this->primaryKey;
        $dataPath = $this->getDataPath();
        switch ($returnOption) {
            case query::DELETE_RETURN_BOOL:
                $returnValue = !empty($results);
                break;
            case query::DELETE_RETURN_COUNT:
                $returnValue = count($results);
                break;
            case query::DELETE_RETURN_RESULTS:
                $returnValue = $results;
                break;
            default:
                throw new invalidArgumentException("Return option \"$returnOption\" is not supported");
        }

        if (empty($results)) {
            return $returnValue;
        }


        foreach ($results as $key => $data) {
            $primaryKeyValue = ioHelper::secureStringForFileAccess($data[$primaryKey]);
            $filePath = $dataPath . $primaryKeyValue . '.json';
            if (false === ioHelper::deleteFile($filePath)) {
                throw new iOException(
                    'Unable to delete document! 
            Already deleted documents: ' . $key . '. 
            Location: "' . $filePath . '"'
                );
            }
        }
        return $returnValue;
    }

    public function removeFields(array &$results, array $fieldsToRemove)
    {
        $primaryKey = $this->primaryKey;
        $dataPath = $this->getDataPath();


        foreach ($results as $key => $data) {
            $primaryKeyValue = ioHelper::secureStringForFileAccess($data[$primaryKey]);
            $data[$primaryKey] = $primaryKeyValue;
            $results[$key] = $data;

            $filePath = $dataPath . $primaryKeyValue . '.json';
            if (!file_exists($filePath)) {
                return false;
            }
        }

        foreach ($results as &$document) {
            foreach ($fieldsToRemove as $fieldToRemove) {
                if ($fieldToRemove !== $primaryKey) {
                    nestedHelper::removeNestedField($document, $fieldToRemove);
                }
            }
            $filePath = $dataPath . $document[$primaryKey] . '.json';
            ioHelper::writeContentToFile($filePath, json_encode($document));
        }
        return $results;
    }

}