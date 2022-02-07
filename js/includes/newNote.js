class newNote {
    constructor() {
        $('#newNote').click(function (e) {
            e.preventDefault();


            var post_data = {
                'noteTitle': noteTitle,
                'notesText': notesText
            };
            $.post('./api.php?newnote', post_data, function (data) {
                if (data == '1') {

                    Notifi.addNotification({
                        color: 'success',
                        text: newNoteText,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 12000
                    });
                    $("#noteTitle, #notesText").val('');
                } else {

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

