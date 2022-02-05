<?php

namespace vandash\services;


use vandash\includes\functions;
use vandash\includes\txtDB;
use vandash\includes\aacompositewhereclause;
use vandash\includes\simplewhereclause;

class signin
{
    public function __construct()
    {
        $db = new txtDB();
        $db->datadir = $_ENV['APP_DIR'] . '/data/';

        $mode = $_POST['requestType'];
        switch ($mode) {
            case 'signin':
                $this->signin($db, $_POST['username'], $_POST['password']);
                break;
            case 'signup':
                $this->signup($db, $_ENV['SITE_NAME'], $_ENV['SITE_URL'], $_ENV['SITE_EMAIL'], $_POST['username'], $_POST['useremail'], $_POST['password']);
                break;
            case 'resetpass':
                $this->resetpass($db, $_ENV['SITE_NAME'], $_ENV['SITE_URL'], $_ENV['SITE_EMAIL'], $_POST['useremail']);
                break;
            case 'usercheck':
                $this->usercheck($db, $_POST['username']);
                break;
            case 'emailcheck':
                $this->emailcheck($db, $_POST['useremail']);
                break;
        }

    }

    function signin($db, $username, $password)
    {

        $usrname = htmlspecialchars($username);
        $pass = functions::encodeIt($password);

        $compClause = new aacompositewhereclause();
        $compClause->add(new simplewhereclause($usrname, '=', $usrname, $_ENV['STRING_COMPARISON']));
        $compClause->add(new simplewhereclause($pass, '=', $pass, $_ENV['STRING_COMPARISON']));
        $userdata = $db->selectWhere('users.txt', $compClause, 1);

        foreach ($userdata as $item => $row) {
            $_SESSION['st']['userId'] = $row[0];
            $_SESSION['st']['userName'] = $row[1];
            $_SESSION['st']['userEmail'] = $row[3];
        }

        echo json_encode($userdata);
    }

    function signup($db, $username, $useremail, $password)
    {
        define('USER_ID', 0);
        define('USERNAME', 1);
        define('PASSWORD', 2);
        define('USER_EMAIL', 3);
        define('DATE_CREATED', 4);

        $usrname = htmlspecialchars(functions::alphaNum($username));
        $usremail = htmlspecialchars($useremail);
        $pass = functions::encodeIt($password);
        $dateCreated = date('Y-m-d H:i:s');

        $randomHash = uniqid(rand());
        $randHash = substr($randomHash, 0, 8);

        $newuser[USER_ID] = $randHash;
        $newuser[USERNAME] = $usrname;
        $newuser[PASSWORD] = $pass;
        $newuser[USER_EMAIL] = $usremail;
        $newuser[DATE_CREATED] = $dateCreated;

        $new_user = $db->insert(
            'users.txt',
            $newuser
        );

        $userinfo[USER_ID] = $randHash;
        $userinfo[USERNAME] = $usrname;
        $userinfo[DATE_CREATED] = $dateCreated;

        $userFile = $usrname . '-' . $randHash;

        $new_user = $db->insert(
            $userFile . '.txt',
            $userinfo
        );

        $subject = $_ENV['SITE_NAME'] . ' New Account Created';

        $message = '<html><body>';
        $message .= '<h3>' . $subject . '</h3>';
        $message .= '<p>';
        $message .= 'Your new account has been successfully created, and you can now sign in.<br />';
        $message .= '<a href="' . $_ENV['SITE_URL'] . 'sign-in">Sign In</a>';
        $message .= '</p>';
        $message .= '<p>Username: ' . $usrname . '<br />Password: The password you signed up with.</p>';
        $message .= '<hr />';
        $message .= '<p>Thank You,<br>' . $_ENV['SITE_NAME'] . '</p>';
        $message .= '</body></html>';

        $headers = 'From: ' . $_ENV['SITE_NAME'] . ' <' . $_ENV['SITE_EMAIL'] . ">\r\n";
        $headers .= 'Reply-To: ' . $_ENV['SITE_EMAIL'] . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        mail($usremail, $subject, $message, $headers);

        // Check if the file was created
        $checkFile = $_ENV['APP_DIR'] . '/data/' . $userFile . '.txt';

        if (file_exists($checkFile)) {
            echo '1';    // All is good!
        } else {
            echo '0';    // Nope, error...
        }
    }

    function resetpass($db, $useremail)
    {
        $userdata = '';

        define('USER_ID', 0);
        define('USERNAME', 1);
        define('PASSWORD', 2);
        define('USER_EMAIL', 3);
        define('DATE_CREATED', 4);

        $useremail = htmlspecialchars($useremail);

        $userdata = $db->selectWhere(
            'users.txt',
            new simplewhereclause(USER_EMAIL, '=', $useremail)
        );

        if (empty($userdata)) {
            echo '0';
        } else {
            global $uid;
            global $uname;
            foreach ($userdata as $item => $row) {
                $uid = $row[0];
                $uname = $row[1];
            }

            $userfile = $db->selectAll($uname . '-' . $uid . '.txt');

            $randomHash = uniqid(rand());
            $randHash = substr($randomHash, 0, 8);

            $newpass = encodeIt($randHash);

            $db->updateSetWhere(
                'users.txt', [
                PASSWORD => $newpass,
            ],
                new simplewhereclause(
                    USER_ID, '=', $uid
                )
            );

            $subject = $_ENV['SITE_NAME'] . ' Account Password Reset';

            $message = '<html><body>';
            $message .= '<h3>' . $subject . '</h3>';
            $message .= '<p>';
            $message .= 'Your Account Password has been Reset<br />';
            $message .= 'Temporary Password: ' . $randHash;
            $message .= '</p>';
            $message .= '<p>Once you have signed in, please take the time to update your account password to something you can easily remember.</p>';
            $message .= '<hr />';
            $message .= '<p>Thank You,<br>' . $_ENV['SITE_NAME'] . '</p>';
            $message .= '</body></html>';

            $headers = 'From: ' . $_ENV['SITE_NAME'] . ' <' . $_ENV['SITE_EMAIL'] . ">\r\n";
            $headers .= 'Reply-To: ' . $_ENV['SITE_EMAIL'] . "\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

            mail($useremail, $subject, $message, $headers);

            echo '1';
        }
    }

    function usercheck($db, $username)
    {
        $userdata = '';

        define('USER_ID', 0);
        define('USERNAME', 1);
        define('PASSWORD', 2);
        define('USER_EMAIL', 3);
        define('DATE_CREATED', 4);

        $usrname = htmlspecialchars(functions::alphaNum($username));

        $userdata = $db->selectWhere(
            'users.txt',
            new SimpleWhereClause(USERNAME, '=', $usrname)
        );

        if (empty($userdata)) {
            echo '0';
        } else {
            echo '1';
        }
    }

    function emailcheck($db, $useremail)
    {
        $userdata = '';

        define('USER_ID', 0);
        define('USERNAME', 1);
        define('PASSWORD', 2);
        define('USER_EMAIL', 3);
        define('DATE_CREATED', 4);

        $useremail = htmlspecialchars($useremail);

        $userdata = $db->selectWhere(
            'users.txt',
            new SimpleWhereClause(USER_EMAIL, '=', $useremail)
        );

        if (empty($userdata)) echo '0'; else echo '1';
    }
}

if (isset($_GET['signin'])) new signin();