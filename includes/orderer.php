<?php

namespace vandash\includes;
class orderer
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