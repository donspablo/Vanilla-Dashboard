class profile {
    constructor() {
        $('#updProfile').click(function (e) {
            e.preventDefault();

            var userEmail = $("#userEmail").val();
            var password1 = $("#password1").val();
            var password2 = $("#password2").val();
            var old = $("#old").val();
            var now = $("#now").val();

            if (userEmail == '') {
                Notifi.addNotification({
                    color: 'warning',
                    text: validEmailReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#userEmail").focus();
                return false;
            }

            if (password1 != password2) {
                Notifi.addNotification({
                    color: 'warning',
                    text: passNoMatch,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#password1, #password2").val('')
                return false;
            }

            post_data = {
                'userEmail': userEmail,
                'password1': password1,
                'password2': password2,
                'old': old,
                'now': now
            };
            $.post('./api.php?profile', post_data, function (data) {
                if (data == '1') {
                    Notifi.addNotification({
                        color: 'success',
                        text: accUpdated,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 12000
                    });
                    $("#password1, #password2").val('')
                } else {
                    Notifi.addNotification({
                        color: 'danger',
                        text: errorText,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });
                    $("#password1, #password2").val('')
                }
            });

        });

    }
}