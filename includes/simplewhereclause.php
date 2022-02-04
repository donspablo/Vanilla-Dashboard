<?php

namespace vandash\includes;
class simplewhereclause extends aaawhereclause
{
    public $field;
    public $operator;
    public $value;
    public $compare_type;

    public function __construct($field, $operator, $value, $compare_type)
    {
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


        $dbval = ($this->field >= count($tablerow)) ? '' : $tablerow[$this->field];

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

