class signIn {
    constructor() {
        $('#newusername').blur(function () {
            var username = $("#newusername").val();

            if (username != '') {
                post_data = {
                    'username': username,
                    'requestType': 'usercheck'
                };
                $.post('api/signin.php', post_data, function (data) {
                    if (data == '1') {
                        // Duplicate Username found
                        Meowsa.addNotification({
                            color: 'warning',
                            text: dupUsername1 + ' "' + username + '". ' + dupUsername2,
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });

                        $("#newusername").val('');
                    }
                });
            }
        });

        $('#newemail').blur(function () {
            var useremail = $("#newemail").val();

            if (useremail != '') {
                // Start the API
                post_data = {
                    'useremail': useremail,
                    'requestType': 'emailcheck'
                };
                $.post('api/signin.php', post_data, function (data) {
                    if (data == '1') {
                        // Duplicate Email found
                        Meowsa.addNotification({
                            color: 'warning',
                            text: dupEmail,
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });

                        // Reset the form fields
                        $("#newemail").val('');
                    }
                });
            }
        });

        $('#signin-btn').click(function (e) {
            e.preventDefault();

            var username = $("#username").val();
            var password = $("#password").val();

            if (username == '') {
                Meowsa.addNotification({
                    color: 'danger',
                    text: usernameReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#username").focus();
                return false;
            }

            if (password == '') {
                Meowsa.addNotification({
                    color: 'danger',
                    text: passReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#password").focus();
                return false;
            }

            post_data = {
                'username': username,
                'password': password,
                'requestType': 'signin'
            };
            $.post('api/signin.php', post_data, function (resdata) {
                var datacheck = $.parseJSON(resdata).length;
                if (datacheck === 0) {
                    // Unknown error
                    Meowsa.addNotification({
                        color: 'warning',
                        text: invalidSignin,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    $("#username, #password").val('');
                } else {
                    $.each($.parseJSON(resdata), function (idx, obj) {
                        if (obj[0] != '') {
                            // All is good!
                            Meowsa.addNotification({
                                color: 'success',
                                text: signinSuccess,
                                icon: '<i class="fa fa-check"></i>',
                                timeout: 10000
                            });

                            $("#username, #password").val('');

                            window.setTimeout(function () {
                                location.href = "api.php";
                            }, 1500);
                        } else {
                            Meowsa.addNotification({
                                color: 'danger',
                                text: signinError,
                                icon: '<i class="fa fa-warning"></i>',
                                timeout: 12000
                            });
                        }
                    });
                }
            });
        });

        $('#signup-btn').click(function (e) {
            e.preventDefault();

            var username = $("#newusername").val();
            var useremail = $("#newemail").val();
            var password = $("#newpass").val();
            var newacc = $("#newacc").val();

            if (newacc == '') {
                if (username == '') {
                    Meowsa.addNotification({
                        color: 'danger',
                        text: newusernameReq,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 10000
                    });
                    $("#newusername").focus();
                    return false;
                }

                if (useremail == '') {
                    Meowsa.addNotification({
                        color: 'danger',
                        text: validEmailReq,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 10000
                    });
                    $("#newemail").focus();
                    return false;
                }

                if (password == '') {
                    Meowsa.addNotification({
                        color: 'danger',
                        text: newpassReq,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 10000
                    });
                    $("#newpass").focus();
                    return false;
                }

                post_data = {
                    'username': username,
                    'useremail': useremail,
                    'password': password,
                    'requestType': 'signup'
                };
                $.post('api/signin.php', post_data, function (data) {
                    if (data == '1') {
                        // All is good!
                        Meowsa.addNotification({
                            color: 'success',
                            text: newAccCreated,
                            icon: '<i class="fa fa-check"></i>',
                            timeout: 10000
                        });

                        $("#newusername, #newemail, #newpass").val('');
                    } else {
                        // Unknown error
                        Meowsa.addNotification({
                            color: 'danger',
                            text: newAccError,
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });
                    }
                });
            } else {
                $("#newusername, #newemail, #newpass").val('');
                return false;
            }
        });

        $('#resetPass').click(function (e) {
            e.preventDefault();

            var useremail = $("#accountEmail").val();

            if (useremail == '') {
                Meowsa.addNotification({
                    color: 'danger',
                    text: accountEmailReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#newemail").focus();
                return false;
            }

            post_data = {
                'useremail': useremail,
                'requestType': 'resetpass'
            };
            $.post('api/signin.php', post_data, function (data) {
                if (data == '1') {
                    // All is good!
                    Meowsa.addNotification({
                        color: 'success',
                        text: passResetSuccess,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 10000
                    });

                    $("#accountEmail").val('');
                } else if (data == '0') {
                    Meowsa.addNotification({
                        color: 'danger',
                        text: noAccError,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    $("#accountEmail").val('');
                } else {
                    Meowsa.addNotification({
                        color: 'danger',
                        text: resetPassError,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    $("#accountEmail").val('');
                }
            });
        });
    }
}