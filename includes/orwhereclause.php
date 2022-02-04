<?php

namespace vandash\includes;

class orwhereclause extends aacompositewhereclause
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
