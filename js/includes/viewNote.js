class viewNote {
    constructor() {
        $('#pageBottom').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: $(document).height() - $(window).height()
            }, 500);
        });

        $('#pageTop').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 500);
        });

        $('#noteSave, #saveNote').click(function (e) {
            e.preventDefault();

            var noteTitle = $("#noteTitle").val();
            var notesText = $("#notesText").val();
            var nid = $("#nid").val();
            var updatDate = $("#updatDate").val();

            if (noteTitle == '') {
                Meowsa.addNotification({
                    color: 'warning',
                    text: noteTitleReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#noteTitle").focus();
                return false;
            }

            if (notesText == '') {
                Meowsa.addNotification({
                    color: 'warning',
                    text: noteReq,
                    icon: '<i class="fa fa-warning"></i>'
                });
                $("#notesText").focus();
                return false;
            }

            post_data = {
                'noteTitle': noteTitle,
                'notesText': notesText,
                'noteId': nid,
                'updatDate': updatDate
            };
            $.post('api/viewnote.php', post_data, function (data) {
                if (data == '1') {
                    Meowsa.addNotification({
                        color: 'success',
                        text: noteSavedText,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 12000
                    });

                    $(".autosize").each(function () {
                        resizeTextArea($(this));
                    });

                    $('html,body').animate({
                        scrollTop: 0
                    }, 100);
                } else {
                    Meowsa.addNotification({
                        color: 'danger',
                        text: noteError,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    $('html,body').animate({
                        scrollTop: 0
                    }, 100);
                }
            });

        });
    }
}