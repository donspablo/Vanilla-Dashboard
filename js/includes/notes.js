class notes {
    constructor() {
        $('#notes').dataTable({
            "order": [1, 'desc'],
            "pageLength": 25
        });

        $('.deleteNote').click(function (e) {
            e.preventDefault();

            var nid = $(this).closest("td").find("input").val();

            var delNoteNotification = null;
            if (Meowsa.isDismissed(delNoteNotification)) {
                delNoteNotification = Meowsa.addNotification({
                    color: 'inverse',
                    title: deleteNoteTitle,
                    text: deleteNoteQuip,
                    icon: '<i class="fa fa-sign-out fa-lg"></i>',
                    button: '<input type="hidden" value="' + nid + '" /><a href="" class="btn btn-success btn-meowsa noteDelete btn-close-notification">' + delYesOption + '</a> <span id="cancel-signout" class="btn btn-warning btn-meowsa btn-close-notification">' + cancelDelOption + '</span>',
                    timeout: null
                });
            }

            $('.noteDelete').click(function (e) {
                e.preventDefault();

                var noteid = $(this).closest("p").find("input").val();

                // Start the API
                post_data = {
                    'noteid': noteid
                };
                $.post('api/notes.php', post_data, function (data) {
                    if (data == '1') {
                        // All is good!
                        setTimeout(function () {
                            location.reload();
                        }, 250);
                    } else {
                        // Unknown error
                        Meowsa.addNotification({
                            color: 'danger',
                            text: deleteError,
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });
                    }
                });
            });
        });
    }
}