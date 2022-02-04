class newNote {
    constructor() {
        $('#newNote').click(function (e) {
            e.preventDefault();

            // Start the API
            post_data = {
                'noteTitle': noteTitle,
                'notesText': notesText
            };
            $.post('api/newnote.php', post_data, function (data) {
                if (data == '1') {
                    // All is good!
                    Meowsa.addNotification({
                        color: 'success',
                        text: newNoteText,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 12000
                    });
                    $("#noteTitle, #notesText").val('');
                } else {
                    // Unknown error
                    Meowsa.addNotification({
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
