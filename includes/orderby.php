<?php

namespace vandash\includes;
class orderby
{
    public $field;
    public $orderType;
    public $compareAs;

    public function __construct($field, $orderType, $compareAs)
    {
        $this->field = $field;
        $this->orderType = $orderType;
        $this->compareAs = $compareAs;
    }
}
