<?php

namespace VanillaDash\Services;

if (!isset($_SESSION)) session_start();

use VanillaDash\Includes\Functions;
use VanillaDash\Includes\TxtDB;

class ViewTask
{
    public function __construct()
    {
        $db = new TxtDB();
        $db->datadir = '../data/tasks/';

        $mode = $_POST['requestType'];
        switch ($mode) {
            case 'updateData':
                updateData($db);
                break;
            case 'checkStatus':
                checkStatus(
                    $db,
                    $_POST['taskId']
                );
                break;
        }

    }


    function updateData($db)
    {
        $taskTitle = htmlspecialchars($_POST['taskTitle']);
        $dateAssigned = htmlspecialchars($_POST['dateAssigned']);
        $dateDue = htmlspecialchars($_POST['dateDue']);
        $taskType = encodeIt($_POST['taskType']);
        $dateComp = htmlspecialchars($_POST['dateComp']);
        $taskStatus = encodeIt($_POST['taskStatus']);
        $taskRef = encodeIt($_POST['taskRef']);
        $taskDesc = encodeIt($_POST['taskDesc']);
        $taskNotes = encodeIt($_POST['taskNotes']);
        $taskId = htmlspecialchars($_POST['taskId']);
        $updatDate = htmlspecialchars($_POST['updatDate']);
        $now = date('Y-m-d H:i:s');

        $db->updateSetWhere(
            'tasks.txt', [
            TASK_TITLE => $taskTitle,
            TASK_DATE => $dateAssigned,
            DATE_DUE => $dateDue,
            TASK_TYPE => $taskType,
            REFERENCE => $taskRef,
            DATE_COMPLTED => $dateComp,
            TASK_STATUS => $taskStatus,
            UPDATE_DATE => $now,
        ],
            new SimpleWhereClause(
                TASK_ID, '=', $taskId
            )
        );

        $db->updateSetWhere(
            $taskId . '.txt', [
            TASK_DESC => $taskDesc,
            TASK_NOTES => $taskNotes,
            TASK_STATUS => $taskStatus,
            UPDATE_DATE => $now,
        ],
            new SimpleWhereClause(
                TASK_ID, '=', $taskId
            )
        );

        $checkDate = strtotime($now);

        if ($checkDate > $updatDate) echo '1'; else   echo '0';
    }

    function checkStatus($db, $taskId)
    {

        $taskdata = $db->selectWhere(
            'tasks.txt',
            new SimpleWhereClause(TASK_ID, '=', $taskId)
        );

        echo json_encode($taskdata);
    }
}