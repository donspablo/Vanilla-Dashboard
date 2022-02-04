<?php

namespace vandash\services;

use vandash\includes\Functions;
use vandash\includes\txtDB;

class newnote
{
    public function __construct()
    {
        $db = new txtDB();
        $db->datadir = $_ENV['APP_DIR'] . '/data/notes/';

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

        $checkFile = $_ENV['APP_DIR'] . '/data/notes/' . $noteFile . '.txt';
        if (file_exists($checkFile)) echo '1'; else echo '0';
    }
}

if (isset($_GET['newnote'])) new newnote();