<?php

namespace VanillaDash\Services;
if (!isset($_SESSION)) session_start();

use VanillaDash\Includes\Functions;
use VanillaDash\Includes\TxtDB;

class Profile
{
    public function __construct()
    {
        $db = new TxtDB();
        $db->datadir = '../data/';


        $uid = $_SESSION['st']['userId'];
        $userEmail = htmlspecialchars($_POST['userEmail']);
        $password = (isset($_POST['password1']) && $_POST['password1'] != '') ? encodeIt($_POST['password1']) : $password = $_POST['old'];
        $nowstamp = $_POST['now'];
        $now = date('Y-m-d H:i:s');

        $db->updateSetWhere(
            'users.txt', [
            PASSWORD => $password,
            USER_EMAIL => $userEmail,
        ],
            new SimpleWhereClause(
                USER_ID, '=', $uid
            )
        );

        $checkDate = strtotime($now);

        if ($checkDate > $nowstamp) echo '1'; else echo '0';
    }
}