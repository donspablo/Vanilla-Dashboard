<?php

namespace VanillaDash\Services;

if (!isset($_SESSION)) session_start();

use VanillaDash\Includes\Functions;
use VanillaDash\Includes\TxtDB;

class NewNote
{
    public function __construct()
    {
        $db = new TxtDB();
        $db->datadir = '../data/notes/';

        $randomHash = uniqid(rand());
        $randHash = substr($randomHash, 0, 8);

        $uid = $_SESSION['st']['userId'];
        $uname = $_SESSION['st']['userName'];

        $newnote[USER_ID] = $uid;
        $newnote[NOTE_ID] = $uname . '-' . $randHash;
        $newnote[NOTE_TITLE] = htmlspecialchars($_POST['noteTitle']);
        $newnote[NOTE_DATE] = date('Y-m-d H:i:s');
        $newnote[NOTE_TEXT] = null;
        $newnote[UPDATE_DATE] = date('Y-m-d H:i:s');

        $notedata[USER_ID] = $uid;
        $notedata[NOTE_ID] = $uname . '-' . $randHash;
        $notedata[NOTE_TITLE] = null;
        $notedata[NOTE_DATE] = null;
        $notedata[NOTE_TEXT] = encodeIt($_POST['notesText']);
        $notedata[UPDATE_DATE] = date('Y-m-d H:i:s');

        $noteFile = $uname . '-' . $randHash;

        $new_task = $db->insert(
            'notes.txt',
            $newnote
        );

        $task_data = $db->insert(
            $noteFile . '.txt',
            $notedata
        );

        $checkFile = '../data/notes/' . $noteFile . '.txt';
        if (file_exists($checkFile)) echo '1'; else echo '0';
    }
}