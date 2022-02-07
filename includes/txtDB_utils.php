<?php

class Column
{
    public function Column($index, $type)
    {
        $this->index = $index;
        $this->type = $type;
    }
}

class JoinColumn
{
    public function JoinColumn($index, $tablename, $columnname)
    {
        $this->index = $index;
        $this->tablename = $tablename;
        $this->columnname = $columnname;
    }
}

class TableUtils
{

    public function resolveJoins(&$tables)
    {
        foreach ($tables as $tablename => $discard) {
            $tabledef = &$tables[$tablename];
            foreach ($tabledef as $colname => $discard) {
                $coldef = &$tabledef[$colname];
                if (is_a($coldef, 'JoinColumn') || is_subclass_of($coldef, 'JoinColumn')) {
                    self::resolveColumnJoin($coldef, $tables);
                }
            }
        }
    }


    public function resolveColumnJoin(&$columndef, &$tables)
    {
        $columndef->type = $tables[$columndef->tablename][$columndef->columnname]->type;
    }

    public function createDefines(&$tables)
    {
        foreach ($tables as $tablename => $discard) {
            $tabledef = &$tables[$tablename];
            foreach ($tabledef as $colname => $discard) {
                $coldef = &$tabledef[$colname];
                define(strtoupper($tablename) . '_' . $colname, $coldef->index);
            }
        }
    }


    public function createRowSchema(&$tabledef)
    {
        $row_schema = [];
        foreach ($tabledef as $colname => $coldef) {
            $row_schema[$coldef->index] = $coldef->type;
        }

        return $row_schema;
    }
}
