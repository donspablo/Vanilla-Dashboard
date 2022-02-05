var taskReqText = 'The New Task will need a Title.';
var taskDateAssigned = 'The Task needs the Date Assigned.';
var taskDateDue = 'The Task needs the Date Due.';
var taskDescText = 'The Task Description is required.';
var newTaskSaved = 'The New Task has been successfully created.';
var errorText = 'Looks like an unexpected error was encountered, and the New Task could not be created at this time.';


class newTask {
    constructor() {
        $('#newTask').click(function (e) {
            e.preventDefault();

            var taskTitle = $("#taskTitle").val();
            var dateAssigned = $("#dateAssigned").val();
            var dateDue = $("#dateDue").val();
            var taskType = $("#taskType").val();
            var taskRef = $("#taskRef").val();
            var taskDesc = $("#taskDesc").val();

            if (taskTitle == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: taskReqText,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#taskTitle").focus();
                return false;
            }

            if (dateAssigned == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: taskDateAssigned,
                    icon: '<i class="fa fa-warning"></i>'
                });
                $("#dateAssigned").focus();
                return false;
            }

            if (dateDue == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: taskDateDue,
                    icon: '<i class="fa fa-warning"></i>'
                });
                $("#dateDue").focus();
                return false;
            }

            if (taskDesc == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: taskDescText,
                    icon: '<i class="fa fa-warning"></i>'
                });
                $("#taskDesc").focus();
                return false;
            }

            // Start the API
            var post_data = {
                'taskTitle': taskTitle,
                'dateAssigned': dateAssigned,
                'dateDue': dateDue,
                'taskType': taskType,
                'taskRef': taskRef,
                'taskDesc': taskDesc
            };
            $.post('./api.php?newtask', post_data, function (data) {
                if (data == '1') {
                    // All is good!
                    Notifi.addNotification({
                        color: 'success',
                        text: newTaskSaved,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 12000
                    });
                    $("#taskTitle, #dateAssigned, #dateDue, #taskType, #taskRef, #taskDesc").val('');
                } else {
                    // Unknown error
                    Notifi.addNotification({
                        color: 'danger',
                        text: errorText,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });
                }
            });

        });
    }
}

//new newTask();