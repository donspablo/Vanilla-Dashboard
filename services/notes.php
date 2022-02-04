<?php

namespace vandash\services;

use vandash\includes\Functions;
use vandash\includes\txtDB;

class notes
{
    public function __construct()
    {
        $db = new txtDB();
        $db->datadir = $_ENV['APP_DIR'] . '/data/notes/';

        $noteid = htmlspecialchars($_POST['noteid']);

        $db->deleteWhere('notes.txt', new AndWhereClause(new SimpleWhereClause(NOTE_ID, '=', $noteid, STRING_COMPARISON)));

        unlink('../data/notes/' . $noteid . '.txt');
        unlink('../data/notes/' . $noteid . '.txt.lock');

        $checkFile = $_ENV['APP_DIR'] . '/data/notes/' . $noteid . '.txt';

        if (file_exists($checkFile)) echo '0'; else  echo '1';
    }
}

if (isset($_GET['notes'])) new notes();