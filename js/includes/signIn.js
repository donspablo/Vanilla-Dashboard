var dupUsername1 = 'Whoops, Looks like there is all ready an account registered with the Username';
var dupUsername2 = 'Please select something different.';
var usernameQuip = 'Usernames can contain upper and lower case letters, numbers and dashes only. Duplicate usernames are not allowed.';
var dupEmail = 'Whoops, Looks like there is all ready an account registered with that Email Address.';
var usernameReq = 'Your Account Username is required.';
var passReq = 'Your Account Password is required.';
var invalidSignin = 'Whoops, Invalid Sign In. Please check your Username and/or Password and try again.';
var signinSuccess = 'Cheer! Sign In Successfull';
var signinError = 'Uh oh, Looks like an unexpected error was encountered, and you were not Signed In.';
var newusernameReq = 'Your New Account will need a Username.';
var validEmailReq = 'Your New Account will need a valid Email Address.';
var newpassReq = 'Your New Account will need a Password.';
var newAccCreated = 'Your New Account has been successfully created.';
var newAccError = 'Looks like an unexpected error was encountered, and your New Account was unable to be created.';
var accountEmailReq = 'Your Account Email Address is required.';
var passResetSuccess = 'Your Account Password has been reset, and an email has been sent with the new password.';
var noAccError = 'Hmmm, An Account with that Email Address could not be found.';
var resetPassError = 'Looks like an unexpected error was encountered, and your Account Password could not be reset.';

class signIn {

    constructor() {

        $('#newusername').blur(function () {
            var username = $("#newusername").val();

            if (username != '') {
                var post_data = {
                    'username': username,
                    'requestType': 'usercheck'
                };
                $.post('./api.php?signin', post_data, function (data) {
                    if (data == '1') {
                        // Duplicate Username found
                        Notifi.addNotification({
                            color: 'warning',
                            text: dupUsername1 + ' "' + username + '". ' + dupUsername2,
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });

                        // Reset the form fields
                        $("#newusername").val('');
                    }
                });
            }
        });

        $('#newusername').focus(function () {
            if (focused === 0) {
                Notifi.addNotification({
                    color: 'info',
                    text: usernameQuip,
                    icon: '<i class="fa fa-info-circle"></i>',
                    timeout: 8000
                });
                focused++;
            }
        });

        $('#newemail').blur(function () {
            var useremail = $("#newemail").val();

            if (useremail != '') {
                // Start the AJAX
                var post_data = {
                    'useremail': useremail,
                    'requestType': 'emailcheck'
                };
                $.post('./api.php?signin', post_data, function (data) {
                    if (data == '1') {
                        // Duplicate Email found
                        Notifi.addNotification({
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
                Notifi.addNotification({
                    color: 'danger',
                    text: usernameReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#username").focus();
                return false;
            }

            if (password == '') {
                Notifi.addNotification({
                    color: 'danger',
                    text: passReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#password").focus();
                return false;
            }

            
            Login();


            // Start the AJAX
            var  post_data = {
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
                        text: invalidSignin,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    // Reset the form fields
                    $("#username, #password").val('');
                } else {
                    $.each($.parseJSON(resdata), function (idx, obj) {
                        if (obj[0] != '') {
                            // All is good!
                            Notifi.addNotification({
                                color: 'success',
                                text: signinSuccess,
                                icon: '<i class="fa fa-check"></i>',
                                timeout: 10000
                            }); fields

                            // Reset the form
                            $("#username, #password").val('');

                            // Redirect after 1.5 Seconds
                            window.setTimeout($('html').addClass('login'),5000);
                        } else {
                            // Unknown error
                            Notifi.addNotification({
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
                if (username == '') {
                    Notifi.addNotification({
                        color: 'danger',
                        text: newusernameReq,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 10000
                    });
                    $("#newusername").focus();
                    return false;
                }

                if (useremail == '') {
                    Notifi.addNotification({
                        color: 'danger',
                        text: validEmailReq,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 10000
                    });
                    $("#newemail").focus();
                    return false;
                }

                if (password == '') {
                    Notifi.addNotification({
                        color: 'danger',
                        text: newpassReq,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 10000
                    });
                    $("#newpass").focus();
                    return false;
                }

                
            Login();


                // Start the AJAX
                var post_data = {
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
                            text: newAccCreated,
                            icon: '<i class="fa fa-check"></i>',
                            timeout: 10000
                        });

                        // Reset the form fields
                        $("#newusername, #newemail, #newpass").val('');
                    } else {
                        // Unknown error
                        Notifi.addNotification({
                            color: 'danger',
                            text: newAccError,
                            icon: '<i class="fa fa-warning"></i>',
                            timeout: 12000
                        });
                    }
                });
        });

        $('#resetPass').click(function (e) {
            e.preventDefault();

            var useremail = $("#accountEmail").val();

            if (useremail == '') {
                Notifi.addNotification({
                    color: 'danger',
                    text: accountEmailReq,
                    icon: '<i class="fa fa-warning"></i>',
                    timeout: 10000
                });
                $("#newemail").focus();
                return false;
            }

            // Start the AJAX
            var   post_data = {
                'useremail': useremail,
                'requestType': 'resetpass'
            };
            $.post('./api.php?signin', post_data, function (data) {
                if (data == '1') {
                    // All is good!
                    Notifi.addNotification({
                        color: 'success',
                        text: passResetSuccess,
                        icon: '<i class="fa fa-check"></i>',
                        timeout: 10000
                    });

                    // Reset the form fields
                    $("#accountEmail").val('');
                } else if (data == '0') {
                    // Unknown error
                    Notifi.addNotification({
                        color: 'danger',
                        text: noAccError,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    // Reset the form fields
                    $("#accountEmail").val('');
                } else {
                    // Unknown error
                    Notifi.addNotification({
                        color: 'danger',
                        text: resetPassError,
                        icon: '<i class="fa fa-warning"></i>',
                        timeout: 12000
                    });

                    // Reset the form fields
                    $("#accountEmail").val('');
                }
            });
        });
    }
}

new signIn();