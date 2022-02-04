class signOut {
    constructor() {
        var signoutNotification = null;
        $('#signout').click(function (e) {
            e.preventDefault();
            if (Meowsa.isDismissed(signoutNotification)) {
                signoutNotification = Meowsa.addNotification({
                    color: 'default',
                    title: accountSignOutTitle,
                    text: accountSignOutText,
                    icon: '<i class="fa fa-sign-out fa-lg"></i>',
                    button: '<a href="api.php?action=signout" class="btn btn-success btn-meowsa">' + yesOption + '</a> <span id="cancel-signout" class="btn btn-warning btn-meowsa btn-close-notification">' + cancelOption + '</span>',
                    timeout: null
                });
            }
        });
    }
}