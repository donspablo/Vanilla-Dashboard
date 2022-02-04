<?php

namespace vandash\includes;
class aacompositewhereclause extends aaawhereclause
{
    public $clauses = [];

    public function add($whereClause)
    {
        $this->clauses[] = $whereClause;
    }
}
