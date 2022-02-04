<?php


namespace vandash\services;

use vandash\includes\Functions;
use vandash\includes\txtDB;

class newtask
{
    public function __construct()
    {
        $db = new txtDB();
        $db->datadir = $_ENV['APP_DIR'] . '/data/tasks/';


        $randomHash = uniqid(rand());
        $randHash = substr($randomHash, 0, 8);

        $uid = $_SESSION['st']['userId'];
        $uname = $_SESSION['st']['userName'];

        $newtask[USER_ID] = $uid;
        $newtask[TASK_ID] = $uname . '-' . $randHash;
        $newtask[TASK_TITLE] = htmlspecialchars($_POST['taskTitle']);
        $newtask[TASK_DATE] = htmlspecialchars($_POST['dateAssigned']);
        $newtask[DATE_DUE] = htmlspecialchars($_POST['dateDue']);
        $newtask[TASK_TYPE] = encodeIt($_POST['taskType']);
        $newtask[REFERENCE] = encodeIt($_POST['taskRef']);
        $newtask[PERC_COMPLETE] = '0';
        $newtask[DATE_COMPLTED] = null;
        $newtask[TASK_DESC] = null;
        $newtask[TASK_NOTES] = null;
        $newtask[TASK_STATUS] = null;
        $newtask[UPDATE_DATE] = date('Y-m-d H:i:s');

        $taskdata[USER_ID] = $uid;
        $taskdata[TASK_ID] = $uname . '-' . $randHash;
        $taskdata[TASK_TITLE] = null;
        $taskdata[TASK_DATE] = null;
        $taskdata[DATE_DUE] = null;
        $taskdata[TASK_TYPE] = null;
        $taskdata[REFERENCE] = null;
        $taskdata[PERC_COMPLETE] = null;
        $taskdata[DATE_COMPLTED] = null;
        $taskdata[TASK_DESC] = encodeIt($_POST['taskDesc']);
        $taskdata[TASK_NOTES] = null;
        $taskdata[TASK_STATUS] = null;
        $taskdata[UPDATE_DATE] = date('Y-m-d H:i:s');

        $taskFile = $uname . '-' . $randHash;

        $new_task = $db->insert(
            'tasks.txt',
            $newtask
        );

        $task_data = $db->insert(
            $taskFile . '.txt',
            $taskdata
        );

        $checkFile = $_ENV['APP_DIR'] . '/data/tasks/' . $taskFile . '.txt';

        if (file_exists($checkFile)) echo '1'; else echo '0';
    }
}

if (isset($_GET['newtask'])) new newtask();