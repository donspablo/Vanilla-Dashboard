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

        if ($func == $_ENV['DEFAULT_COMPARISON']) {
            if ($rowSchema) {
                $func = get_comparison_type_for_col_type($rowSchema[$this->field]);
            } else {
                $func = $_ENV['STRING_COMPARISON'];
            }
        }


        foreach ($this->list as $item) {
            if ($func($tablerow[$this->field], $item) == 0) return true;
        }

        return false;
    }
}