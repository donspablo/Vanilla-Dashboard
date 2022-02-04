<?php

namespace VanillaDash\Services;

if (!isset($_SESSION)) session_start();

use VanillaDash\Includes\Functions;
use VanillaDash\Includes\TxtDB;

class ViewNote
{
    public function __construct()
    {
        $db = new TxtDB();
        $db->datadir = '../data/notes/';


        $noteTitle = htmlspecialchars($_POST['noteTitle']);
        $notesText = encodeIt($_POST['notesText']);
        $noteId = htmlspecialchars($_POST['noteId']);
        $updatDate = htmlspecialchars($_POST['updatDate']);
        $now = date('Y-m-d H:i:s');

        $db->updateSetWhere(
            'notes.txt', [
            NOTE_TITLE => $noteTitle,
            UPDATE_DATE => $now,
        ],
            new SimpleWhereClause(
                NOTE_ID, '=', $noteId
            )
        );

        $db->updateSetWhere(
            $noteId . '.txt', [
            NOTE_TEXT => $notesText,
            UPDATE_DATE => $now,
        ],
            new SimpleWhereClause(
                NOTE_ID, '=', $noteId
            )
        );

        $checkDate = strtotime($now);

        if ($checkDate > $updatDate) echo '1'; else  echo '0';
    }
}