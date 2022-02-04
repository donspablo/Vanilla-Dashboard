<?php

namespace vandash\services;

use vandash\includes\Functions;
use vandash\includes\txtDB;

class tasks
{
    public function __construct()
    {
        $db = new txtDB();
        $db->datadir = $_ENV['APP_DIR'] . '/data/tasks/';

        $taskid = htmlspecialchars($_POST['taskid']);

        define('USER_ID', 0);
        define('TASK_ID', 1);
        define('TASK_TITLE', 2);
        define('TASK_DATE', 3);
        define('DATE_DUE', 4);
        define('TASK_TYPE', 5);
        define('REFERENCE', 6);
        define('PERC_COMPLETE', 7);
        define('DATE_COMPLTED', 8);
        define('TASK_DESC', 9);
        define('TASK_NOTES', 10);
        define('TASK_STATUS', 11);
        define('UPDATE_DATE', 12);

        $db->deleteWhere('tasks.txt', new AndWhereClause(new SimpleWhereClause(TASK_ID, '=', $taskid, STRING_COMPARISON)));

        unlink('../data/tasks/' . $taskid . '.txt');
        unlink('../data/tasks/' . $taskid . '.txt.lock');

        $checkFile = $_ENV['APP_DIR'] . '/data/tasks/' . $taskid . '.txt';

        if (file_exists($checkFile)) echo '0'; else  echo '1';
    }
}

if (isset($_GET['tasks'])) new tasks();