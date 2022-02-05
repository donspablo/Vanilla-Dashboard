<?php

namespace vandash\includes;


use vandash\includes\txtDB_utils;


$comparison_type_for_col_type = [
    'INT_COL'    => $_ENV['INTEGER_COMPARISON'],
    'DATE_COL'   => $_ENV['INTEGER_COMPARISON'],
    'STRING_COL' => $_ENV['STRING_COMPARISON'],
    'FLOAT_COL'  => $_ENV['NUMERIC_COMPARISON'],
];

function get_comparison_type_for_col_type($coltype)
{
    global $comparison_type_for_col_type;

    return $comparison_type_for_col_type[$coltype];
}

class txtDB
{
    public $tables;
    public $schemata;
    public $datadir;

    public function __construct()
    {
        $this->schemata = [];
    }

    public function selectUnique($tablename, $idField, $id)
    {
        $result = $this->selectWhere($tablename, new SimpleWhereClause($idField, '=', $id));
        return (count($result) > 0) ? $result[0] : [];
    }

    public function selectWhere($tablename, $whereClause, $limit = -1, $orderBy = null)
    {
        if (!isset($this->tables[$tablename])) {
            $this->loadTable($tablename);
        }

        $table = $this->selectAll($tablename);

        $schema = $this->getSchema($tablename);
        if ($orderBy !== null) {
            usort($table, $this->getOrderByFunction($orderBy, $schema));
        }

        $results = [];
        $count = 0;

        if ($limit == -1) {
            $limit = [0, -1];
        } elseif (!is_array($limit)) {
            $limit = [0, $limit];
        }

        foreach ($table as $row) {
            if ($whereClause === null || $whereClause->testRow($row, $schema)) {
                if ($count >= $limit[0]) {
                    $results[] = $row;
                }
                $count++;
                if (($count >= $limit[1]) && ($limit[1] != -1)) {
                    break;
                }
            }
        }

        return $results;
    }


    public function loadTable($tablename)
    {
        $filedata = @file($this->datadir . $tablename);
        $table = [];
        if (is_array($filedata)) {
            foreach ($filedata as $line) {
                $line = rtrim($line, "\n");
                $table[] = explode("\t", $line);
            }
        }
        $this->tables[$tablename] = $table;
    }


    public function selectAll($tablename)
    {
        if (!isset($this->tables[$tablename])) {
            $this->loadTable($tablename);
        }

        return $this->tables[$tablename];
    }


    public function getSchema($filename)
    {
        foreach ($this->schemata as $rowSchemaPair) {
            $fileregex = $rowSchemaPair[0];
            if (preg_match($fileregex, $filename)) {
                return $rowSchemaPair[1];
            }
        }
    }


    public function getOrderByFunction($orderBy, $rowSchema = null)
    {
        $orderer = new Orderer($orderBy, $rowSchema);

        return [&$orderer, 'compare'];
    }


    public function insertWithAutoId($tablename, $idField, $newRow)
    {
        $lockfp = $this->getLock($tablename);
        $rows = $this->selectWhere(
            $tablename,
            null,
            1,
            new OrderBy($idField, DESCENDING, $_ENV['INTEGER_COMPARISON'])
        );
        $newId = ($rows) ? $rows[0][$idField] + 1 : 1;
        $newRow[$idField] = $newId;
        $this->tables[$tablename][] = $newRow;
        $this->writeTable($tablename);
        $this->releaseLock($lockfp);

        return $newId;
    }

    public function getLock($tablename)
    {
        ignore_user_abort(true);
        $fp = fopen($this->datadir . $tablename . '.lock', 'w');
        if (!flock($fp, LOCK_EX)) {
            // log error?
        }
        $this->loadTable($tablename);

        return $fp;
    }

    public function writeTable($tablename)
    {
        $output = '';

        foreach ($this->tables[$tablename] as $row) {
            $keys = array_keys($row);
            rsort($keys, SORT_NUMERIC);
            $max = $keys[0];
            for ($i = 0; $i <= $max; $i++) {
                if ($i > 0) {
                    $output .= "\t";
                }
                $data = (!isset($row[$i]) ? '' : $row[$i]);
                $output .= str_replace(["\t", "\r", "\n"], [''], $data);
            }
            $output .= "\n";
        }
        $fp = @fopen($this->datadir . $tablename, 'w');
        fwrite($fp, $output, strlen($output));
        fclose($fp);
    }

    public function releaseLock($lockfp)
    {
        flock($lockfp, LOCK_UN);
        ignore_user_abort(false);
    }

    public function insert($tablename, $newRow)
    {
        $lockfp = $this->getLock($tablename);
        $this->tables[$tablename][] = $newRow;
        $this->writeTable($tablename);
        $this->releaseLock($lockfp);
    }

    public function updateRowById($tablename, $idField, $updatedRow)
    {
        $this->updateSetWhere(
            $tablename,
            $updatedRow,
            new SimpleWhereClause($idField, '=', $updatedRow[$idField])
        );
    }

    public function updateSetWhere($tablename, $newFields, $whereClause)
    {
        $schema = $this->getSchema($tablename);
        $lockfp = $this->getLock($tablename);
        for ($i = 0; $i < count($this->tables[$tablename]); $i++) {
            if ($whereClause === null || $whereClause->testRow($this->tables[$tablename][$i], $schema)) {
                foreach ($newFields as $k => $v) {
                    $this->tables[$tablename][$i][$k] = $v;
                }
            }
        }
        $this->writeTable($tablename);
        $this->releaseLock($lockfp);
        $this->loadTable($tablename);
    }

    public function deleteAll($tablename)
    {
        $this->deleteWhere($tablename, null);
    }

    public function deleteWhere($tablename, $whereClause)
    {
        $schema = $this->getSchema($tablename);
        $lockfp = $this->getLock($tablename);
        for ($i = count($this->tables[$tablename]) - 1; $i >= 0; $i--) {
            if ($whereClause === null || $whereClause->testRow($this->tables[$tablename][$i], $schema)) {
                unset($this->tables[$tablename][$i]);
            }
        }
        $this->writeTable($tablename);
        $this->releaseLock($lockfp);
        $this->loadTable($tablename);
    }

    public function addSchema($fileregex, $rowSchema)
    {
        array_push($this->schemata, [$fileregex, $rowSchema]);
    }


    public function intcmp($a, $b)
    {
        return (int)$a - (int)$b;
    }

    public function numcmp($a, $b)
    {
        return (float)$a - (float)$b;
    }
}





