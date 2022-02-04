<?php

namespace vandash\services;

class ping
{

    private $db;

    public function __construct()
    {
        $this->db = new vandash\includes\txtDB();
        $this->db->datadir = $_ENV['APP_DIR'] . '/data/';

        $token = (isset($_GET['token']) && preg_match('/^[0-9a-f]{8}$/', $_GET['token'])) ? $_GET['token'] : false;

        if (!$token) {
            $token = sprintf('%08x', crc32(microtime()));
        }

        $quadrant = ceil(date_create()->format('s') / 15); // between 1-4
        $previousQuadrant = $quadrant - 1 < 1 ? 4 : $quadrant - 1;
        $key = 'pinger_' . $quadrant;
        $previousKey = 'pinger_' . $previousQuadrant;

        $current = $this->fetch($key);
        $previous = $this->fetch($previousKey);

        if (!is_array($current)) {
            $current = array();
        }

        if (!is_array($previous)) {
            $previous = array();
        }

        if (count($current) < 250 && !in_array($token, $current)) {
            $current[] = $token;
            $this->store($key, $current, 31);
        }


        $output = array(
            'userCount' => count($current) > 250 ? '250+' : count(array_unique(array_merge($current, $previous))),
            'token' => $token,
        );

        header('Content-Type: application/json');
        print json_encode($output);
        exit;
    }

    function fetch($key)
    {

        return json_encode($this->db->selectWhere('ping.txt', $key));

    }

    function store($key, $current, $ttl)
    {

        return $this->db->insert('ping.txt', ["key" => $key, "current" => $current, "ttl" => $ttl]);

    }
}

if (isset($_GET['ping'])) new ping();