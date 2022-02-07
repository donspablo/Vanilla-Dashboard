<?php


$comparison_type_for_col_type = [
    'INT_COL' => $_ENV['INTEGER_COMPARISON'],
    'DATE_COL' => $_ENV['INTEGER_COMPARISON'],
    'STRING_COL' => $_ENV['STRING_COMPARISON'],
    'FLOAT_COL' => $_ENV['NUMERIC_COMPARISON'],
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
        $result = $this->selectWhere($tablename, new \SimpleWhereClause($idField, '=', $id));
        if (count($result) > 0) {
            return $result[0];
        } else {
            return [];
        }
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
            print_r(whereClause);
            if ($whereClause === null || $this->tables[$tablename]->where($whereClause)->getQuery()->fetch()) {
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
        $this->tables[$tablename] = new \coreDb\Store($tablename, $_ENV['DBDIR']);
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
        $rows = $this->selectWhere(
            $tablename,
            null,
            1,
            new OrderBy($idField, $_ENV['DESCENDING'], $_ENV['INTEGER_COMPARISON'])
        );
        if ($rows) {
            $newId = $rows[0][$idField] + 1;
        } else {
            $newId = 1;
        }
        $newRow[$idField] = $newId;

        $table = new \coreDb\Store($tablename, $_ENV['DBDIR']);
        $table.$this->insert($newRow);
        $this->loadTable($tablename);

        return $newId;
    }

    public function getLock($tablename)
    {
        ignore_user_abort(true);
        $fp = fopen($this->datadir . $tablename . '.lock', 'w');
        if (!flock($fp, LOCK_EX)) {

        }
        $this->loadTable($tablename);

        return $fp;
    }


    public function releaseLock($lockfp)
    {
        flock($lockfp, LOCK_UN);
        ignore_user_abort(false);
    }

    public function insert($tablename, $newRow)
    {
        $table = new \coreDb\Store($tablename, $_ENV['DBDIR']);
        $table->insert($newRow);
    }

    public function updateRowById($tablename, $idField, $updatedRow)
    {
        $this->updateSetWhere(
            $tablename,
            $updatedRow,
            new \SimpleWhereClause($idField, '=', $updatedRow[$idField])
        );
    }

    public function updateSetWhere($tablename, $newFields, $whereClause)
    {
        $table = new \coreDb\Store($tablename, $_ENV['DBDIR']);
        $table->inser($newFields);
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
        $table = new \coreDb\Store($tablename, $_ENV['DBDIR']);
        $table->createQueryBuilder()
        ->where($whereClause)
            ->getQuery()
            ->delete(Query::DELETE_RETURN_COUNT);
        $this->loadTable($tablename);
    }

    public function addSchema($fileregex, $rowSchema)
    {
        array_push($this->schemata, [$fileregex, $rowSchema]);
    }
}


function intcmp($a, $b)
{
    return (int)$a - (int)$b;
}


function numcmp($a, $b)
{
    return (float)$a - (float)$b;
}


class WhereClause
{

    public function testRow($row, $rowSchema = null)
    {
    }
}


class NotWhere extends WhereClause
{
    public $clause;


    public function __construct($whereclause)
    {
        $this->clause = $whereclause;
    }

    public function testRow($row, $rowSchema = null)
    {
        return !$this->clause->testRow($row, $rowSchema);
    }
}


class SimpleWhereClause extends WhereClause
{
    public $field;
    public $operator;
    public $value;
    public $compare_type;


    public function __construct($field, $operator, $value, $compare_type = null)
    {
        $compare_type = ($compare_type) ? $compare_type : $_ENV['DEFAULT_COMPARISON'];
        $this->field = $field;
        $this->operator = $operator;
        $this->value = $value;
        $this->compare_type = $compare_type;
    }

    public function testRow($tablerow, $rowSchema = null)
    {
        if ($this->field < 0) {
            return true;
        }

        $cmpfunc = $this->compare_type;
        if ($cmpfunc == $_ENV['DEFAULT_COMPARISON']) {
            if ($rowSchema !== null) {
                $cmpfunc = get_comparison_type_for_col_type($rowSchema[$this->field]);
            } else {
                $cmpfunc = $_ENV['STRING_COMPARISON'];
            }
        }

        if ($this->field >= count($tablerow)) {
            $dbval = '';
        } else {
            $dbval = $tablerow[$this->field];
        }
        $cmp = $cmpfunc($dbval, $this->value);
        if ($this->operator == '=') {
            return $cmp == 0;
        } elseif ($this->operator == '!=') {
            return $cmp != 0;
        } elseif ($this->operator == '>') {
            return $cmp > 0;
        } elseif ($this->operator == '<') {
            return $cmp < 0;
        } elseif ($this->operator == '<=') {
            return $cmp <= 0;
        } elseif ($this->operator == '>=') {
            return $cmp >= 0;
        }

        return false;
    }
}


class ListWhereClause extends WhereClause
{
    public $field;
    public $list;
    public $compareAs;


    public function __construct($field, $list, $compare_type = null)
    {
        $compare_type = ($compare_type) ? $compare_type :  $_ENV['DEFAULT_COMPARISON'];
        $this->list = $list;
        $this->field = (int)$field;
        $this->compareAs = $compare_type;
    }

    public function testRow($tablerow, $rowSchema = null)
    {
        $func = $this->compareAs;
        if ($func == $_ENV['DEFAULT_COMPARISON']) {
            if ($rowSchema) {
                $func = get_comparison_type_for_col_type($rowSchema[$this->field]);
            } else {
                $func = $_ENV['STRING_COMPARISON'];
            }
        }

        foreach ($this->list as $item) {
            if ($func($tablerow[$this->field], $item) == 0) {
                return true;
            }
        }

        return false;
    }
}


class CompositeWhereClause extends WhereClause
{
    public $clauses = [];


    public function add($whereClause)
    {
        $this->clauses[] = $whereClause;
    }
}


class OrWhereClause extends CompositeWhereClause
{
    public function __construct()
    {
        $this->clauses = func_get_args();
    }

    public function testRow($tablerow, $rowSchema = null)
    {
        foreach ($this->clauses as $clause) {
            if ($clause->testRow($tablerow, $rowSchema)) {
                return true;
            }
        }

        return false;
    }
}


class AndWhereClause extends CompositeWhereClause
{
    public function __construct()
    {
        $this->clauses = func_get_args();
    }

    public function testRow($tablerow, $rowSchema = null)
    {

        foreach ($this->clauses as $clause) {
            if (!$clause->testRow($tablerow, $rowSchema)) {
                return false;
            }
        }

        return true;
    }
}


class OrderBy
{
    public $field;
    public $orderType;
    public $compareAs;


    public function __construct($field, $orderType, $compareAs = null)
    {
        $compareAs = ($compareAs) ? $compareAs : $_ENV['DEFAULT_COMPARISON'];
        $this->field = $field;
        $this->orderType = $orderType;
        $this->compareAs = $compareAs;
    }
}


class Orderer
{
    public $orderByList;


    public function __construct($orderBy, $rowSchema = null)
    {
        if (!is_array($orderBy)) {
            $orderBy = [$orderBy];
        }
        if ($rowSchema) {
            foreach ($orderBy as $index => $discard) {
                $item = &$orderBy[$index];
                if ($item->compareAs == $_ENV['DEFAULT_COMPARISON']) {
                    $item->compareAs = get_comparison_type_for_col_type($rowSchema[$item->field]);
                }
            }
        }
        $this->orderByList = $orderBy;
    }


    public function compare($row1, $row2)
    {
        return $this->compare_priv($row1, $row2, 0);
    }


    public function compare_priv($row1, $row2, $index)
    {
        $orderBy = $this->orderByList[$index];
        $cmpfunc = $orderBy->compareAs;
        if ($cmpfunc == $_ENV['DEFAULT_COMPARISON']) {
            $cmpfunc = $_ENV['STRING_COMPARISON'];
        }
        $cmp = $orderBy->orderType * $cmpfunc($row1[$orderBy->field], $row2[$orderBy->field]);
        if ($cmp == 0) {
            if ($index == (count($this->orderByList) - 1)) {
                return 0;
            } else {
                return $this->compare_priv($row1, $row2, $index + 1);
            }
        } else {
            return $cmp;
        }
    }
}
