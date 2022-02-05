var deleteNoteTitle = 'Delete Note Confirmation';
var deleteNoteQuip = 'Are you sure you want to permentently DELETE this Note?';
var delYesOption = 'Yes, Delete It';
var cancelDelOption = 'Cancel';
var deleteError = 'An Error was encountered, and the Note could not be deleted at this time.';


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
            if (Notifi.isDismissed(delNoteNotification)) {
                delNoteNotification = Notifi.addNotification({
                    color: 'inverse',
                    title: deleteNoteTitle,
                    text: deleteNoteQuip,
                    icon: '<i class="fa fa-sign-out fa-lg"></i>',
                    button: '<input type="hidden" value="' + nid + '" /><a href="" class="btn btn-success btn-notifi noteDelete btn-close-notification">' + delYesOption + '</a> <span id="cancel-signout" class="btn btn-warning btn-notifi btn-close-notification">' + cancelDelOption + '</span>',
                    timeout: null
                });
            }

            $('.noteDelete').click(function (e) {
                e.preventDefault();

                var noteid = $(this).closest("p").find("input").val();

                // Start the API
                var post_data = {
                    'noteid': noteid
                };
                $.post('./api.php?notes', post_data, function (data) {
                    if (data == '1') {
                        // All is good!
                        setTimeout(function () {
                            location.reload();
                        }, 250);
                    } else {
                        // Unknown error
                        Notifi.addNotification({
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

//new Note();