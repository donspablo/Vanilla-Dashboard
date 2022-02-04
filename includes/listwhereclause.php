<?php

namespace vandash\includes;
class listwhereclause extends aaawhereclause
{
    public $field;
    public $list;
    public $compareAs;

    public function __construct($field, $list, $compare_type)
    {
        $this->list = $list;
        $this->field = (int)$field;
        $this->compareAs = $compare_type;
    }

    public function testRow($tablerow, $rowSchema = null)
    {
        $func = $this->compareAs;

        foreach ($this->list as $item) {
            if ($func($tablerow[$this->field], $item) == 0) return true;
        }

        return false;
    }
}