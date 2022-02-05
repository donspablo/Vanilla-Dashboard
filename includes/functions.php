<?php

namespace vandash\includes;


class functions
{
    public function __construct()
    {
    }

    static function dateFormat($v)
    {
        $theDate = date('F d, Y', strtotime($v));

        return $theDate;                                // March 07, 2016
    }

    static function shortMonthFormat($v)
    {
        $theDate = date('M d, Y', strtotime($v));

        return $theDate;                                // Mar 07, 2016
    }

    static function shortMonthTimeFormat($v)
    {
        $theDate = date('M d, Y  H:i', strtotime($v));

        return $theDate;                                // Mar 07, 2016 09:30
    }

    static function dbDateFormat($v)
    {
        $theDate = date('Y-m-d', strtotime($v));

        return $theDate;                                // 2016-03-07
    }

    static function ellipsis($text, $max = '', $append = '&hellip;')
    {
        if (strlen($text) <= $max) {
            return $text;
        }

        $replacements = [
            '|<br /><br />|' => ' ',
            '|&nbsp;|' => ' ',
            '|&rsquo;|' => '\'',
            '|&lsquo;|' => '\'',
            '|&ldquo;|' => '"',
            '|&rdquo;|' => '"',
        ];

        $patterns = array_keys($replacements);
        $replacements = array_values($replacements);

        $text = preg_replace($patterns, $replacements, $text);

        $text = strip_tags($text);

        $out = substr($text, 0, $max);
        if (strpos($text, ' ') === false) {
            return $out . $append;
        }

        return preg_replace('/(\W)&(\W)/', '$1&amp;$2', (preg_replace('/\W+$/', ' ', preg_replace('/\w+$/', '', $out)))) . $append;
    }

    static function encodeIt($value)
    {
        return password_hash($value, PASSWORD_DEFAULT);
    }


    static function alphaNum($val)
    {
        $val = trim($val);
        $val = html_entity_decode($val);
        $val = strip_tags($val);
        $val = preg_replace('~[^ a-zA-Z0-9_.]~', ' ', $val);
        $val = preg_replace('~ ~', '-', $val);
        $val = preg_replace('~-+~', '-', $val);

        return $val;
    }
}