$('#username').blur(function () {
    var username = $("#username").val();

    if (username != '') {
        post_data = {
            'username': username,
            'requestType': 'usercheck'
        };
        $.post('./api.php?signin', post_data, function (data) {
            if (data == '1') {
                // Duplicate Username found
                Notifi.addNotification({
                    color: 'warning',
                    text: "This username already exists, please try another username",
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 12000
                });

                $("#username").val('');
            }
        });
    }
});

$('#username').blur(function () {
    var useremail = $("#username").val();

    if (useremail != '') {
        // Start the API
        post_data = {
            'useremail': useremail,
            'requestType': 'emailcheck'
        };
        $.post('./api.php?signin', post_data, function (data) {
            if (data == '1') {
                // Duplicate Email found
                        Notifi.addNotification({
                            color: 'warning',
                            text: "This email address already exists, please try another email address",
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });

                        // Reset the form fields
                $("#username").val('');
                    }
                });
            }
        });

$('#signin').click(function (e) {
    e.preventDefault();

    var username = $("#lusername").val();
    var password = $("#lpassword").val();

    if (username == '') {
        Notifi.addNotification({
            color: 'danger',
            text: username,
            icon: '<i class="fa fa-warning"></i>',
            timeout: 10000
        });
        $("#lusername").focus();
        return false;
            }

            if (password == '') {
                Notifi.addNotification({
                    color: 'danger',
                    text: passReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#lpassword").focus();
                return false;
            }

            post_data = {
                'username': username,
                'password': password,
                'requestType': 'signin'
            };
            $.post('./api.php?signin', post_data, function (resdata) {
                var datacheck = $.parseJSON(resdata).length;
                if (datacheck === 0) {
                    // Unknown error
                    Notifi.addNotification({
                        color: 'warning',
                        text: "There was an unexpected error, please try again",
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    $("#lusername, #lpassword").val('');
                } else {
                    $.each($.parseJSON(resdata), function (idx, obj) {
                        if (obj[0] != '') {
                            // All is good!
                            Notifi.addNotification({
                                color: 'success',
                                text: "Yay, sucess!",
                                icon: '<i class="fa fa-check"></i>',
                                timeout: 10000
                            });

                            $("#lusername, #lpassword").val('');

                            window.setTimeout(function () {
                                location.href = "api.php";
                            }, 1500);
                        } else {
                            Notifi.addNotification({
                                color: 'danger',
                                text: "There was an error signing you in, please try again",
                                icon: '<i class="fa fa-warning"></i>',
                                timeout: 12000
                            });
                        }
                    });
                }
            });
        });

$('#signup').click(function (e) {
    e.preventDefault();

    var username = $("#username").val();
    var useremail = $("#email").val();
    var password = $("#newpass").val();

    if (username == '') {
        Notifi.addNotification({
            color: 'danger',
            text: "Username cannot be empty",
            icon: '<i class="fa fa-warning"></i>',
            timeout: 10000
        });
        $("#username").focus();
                    return false;
                }

                if (useremail == '') {
                    Notifi.addNotification({
                        color: 'danger',
                        text: "Email address cannot be empty",
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 10000
                    });
                    $("#newemail").focus();
                    return false;
                }

                if (password == '') {
                    Notifi.addNotification({
                        color: 'danger',
                        text: "Password cannot be empty",
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
                $.post('./api.php?signin', post_data, function (data) {
                    if (data == '1') {
                        // All is good!
                        Notifi.addNotification({
                            color: 'success',
                            text: "Yay, success!",
                            icon: '<i class="fa fa-check"></i>',
                            timeout: 10000
                        });

                        $("#username, #newemail, #newpass").val('');
                    } else {
                        // Unknown error
                        Notifi.addNotification({
                            color: 'danger',
                            text: "Unkown error, please try again",
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });
                    }
                });
        });

$('#reset').click(function (e) {
    e.preventDefault();

    var useremail = $("#accountEmail").val();

    if (useremail == '') {
        Notifi.addNotification({
            color: 'danger',
            text: "Email cannot be empty",
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
            $.post('./api.php?signin', post_data, function (data) {
                if (data == '1') {
                    // All is good!
                    Notifi.addNotification({
                        color: 'success',
                        text: "Yay, success!",
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 10000
                    });

                    $("#accountEmail").val('');
                } else if (data == '0') {
                    Notifi.addNotification({
                        color: 'danger',
                        text: "This account could not be found",
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    $("#accountEmail").val('');
                } else {
                    Notifi.addNotification({
                        color: 'danger',
                        text: "Unexpected error please try again",
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    $("#accountEmail").val('');
                }
            });
        });