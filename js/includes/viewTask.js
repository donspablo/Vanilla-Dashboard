class viewTask {
    constructor() {
        //this.loadStatus() if bla bla
        $('#taskSave, #saveTask').click(function (e) {
            e.preventDefault();

            var taskTitle = $("#taskTitle").val();
            var dateAssigned = $("#dateAssigned").val();
            var dateDue = $("#dateDue").val();
            var taskType = $("#taskType").val();
            var dateComp = $("#dateComp").val();
            var taskStatus = $("#taskStatus").val();
            var taskRef = $("#taskRef").val();
            var taskDesc = $("#taskDesc").val();
            var taskNotes = $("#taskNotes").val();
            var tid = $("#tid").val();
            var updatDate = $("#updatDate").val();

            if (taskTitle == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: taskTitleReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#taskTitle").focus();
                return false;
            }

            if (dateAssigned == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: assignedDateReq,
                    icon: '<i class="fa fa-warning"></i>'
                });
                $("#dateAssigned").focus();
                return false;
            }

            if (dateDue == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: dueDateReq,
                    icon: '<i class="fa fa-warning"></i>'
                });
                $("#dateDue").focus();
                return false;
            }

            if (taskDesc == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: taskDescReq,
                    icon: '<i class="fa fa-warning"></i>'
                });
                $("#taskDesc").focus();
                return false;
            }

            post_data = {
                'requestType': 'updateData',
                'taskTitle': taskTitle,
                'dateAssigned': dateAssigned,
                'dateDue': dateDue,
                'taskType': taskType,
                'dateComp': dateComp,
                'taskStatus': taskStatus,
                'taskRef': taskRef,
                'taskDesc': taskDesc,
                'taskNotes': taskNotes,
                'taskId': tid,
                'updatDate': updatDate
            };
            $.post('./api.php?viewtask', post_data, function (data) {
                if (data == '1') {
                    Notifi.addNotification({
                        color: 'success',
                        text: taskUpdatedMsg,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 12000
                    });

                    loadStatus();

                    $(".autosize").each(function () {
                        resizeTextArea($(this));
                    });

                    $('html,body').animate({
                        scrollTop: 0
                    }, 100);
                } else {
                    Notifi.addNotification({
                        color: 'danger',
                        text: updateError,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    loadStatus();

                    $('html,body').animate({
                        scrollTop: 0
                    }, 100);
                }
            });

        });
    }

    loadStatus() {
        var tid = $("#tid").val();
        var msgDiv = $("#msgDiv");

        post_data = {
            'requestType': 'checkStatus',
            'taskId': tid
        };
        $.post('./api.php?viewtask', post_data, function (resdata) {
            $.each($.parseJSON(resdata), function (idx, obj) {
                var compDate = formatDate(new Date(obj[8]), "M d, y");

                if (obj[8] != '') {
                    msgDiv.html('<div class="alertMsg success"><div class="msgIcon pull-left"><i class="fa fa-check"></i></div>' + taskCompOnText + ' ' + compDate + '</div>');
                }
                if (obj[8] == '') {
                    msgDiv.html('');
                }
            });
        });
    }
}