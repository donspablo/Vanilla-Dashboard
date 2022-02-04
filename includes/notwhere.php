<?php

namespace vandash\includes;

class notwhere extends aaawhereclause
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