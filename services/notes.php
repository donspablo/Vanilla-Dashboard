<?php

namespace VanillaDash\Services;
if (!isset($_SESSION)) session_start();

use VanillaDash\Includes\Functions;
use VanillaDash\Includes\TxtDB;

class Notes
{
    public function __construct()
    {
        $db = new TxtDB();
        $db->datadir = '../data/notes/';

        $noteid = htmlspecialchars($_POST['noteid']);

        $db->deleteWhere('notes.txt', new AndWhereClause(new SimpleWhereClause(NOTE_ID, '=', $noteid, STRING_COMPARISON)));

        unlink('../data/notes/' . $noteid . '.txt');
        unlink('../data/notes/' . $noteid . '.txt.lock');

        $checkFile = '../data/notes/' . $noteid . '.txt';

        if (file_exists($checkFile)) echo '0'; else  echo '1';
    }
}
