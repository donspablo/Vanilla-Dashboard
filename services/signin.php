<?php

namespace vandash\services;


use vandash\includes\aacompositewhereclause;
use vandash\includes\functions;
use vandash\includes\simplewhereclause;
use vandash\includes\txtDB;

class signin
{
    public function __construct()
    {
        $db = new txtDB();
        $db->datadir = $_ENV['APP_DIR'] . '/data/';

        $mode = $_POST['requestType'];
        switch ($mode) {
            case
            'signin':
                $this->sign($db, $_POST['username'], $_POST['password']);
                break;
            case 'signup':
                $this->signup($db, $_POST['username'], $_POST['useremail'], $_POST['password']);
                break;
            case 'resetpass':
                $this->resetpass($db, $_POST['username']);
                break;
            case 'usercheck':
                $this->usercheck($db, $_POST['username']);
                break;
            case 'emailcheck':
                $this->emailcheck($db, $_POST['useremail']);
                break;

        }
    }


    function sign($db, $username, $password)
    {
        $compClause = new aacompositewhereclause();
        print_r(11111);
        print_r($compClause);
        $compClause->add(new simplewhereclause($_ENV['USERNAME'], '=', htmlspecialchars($username), $_ENV['STRING_COMPARISON']));
        print_r(22222);
        print_r($compClause);
        $compClause->add(new simplewhereclause($_ENV['PASSWORD'], '=', functions::encodeIt($password), $_ENV['STRING_COMPARISON']));
        print_r(33333);
        print_r($compClause);
        $userdata = $db->selectWhere('users.txt', $compClause, 1);
        print_r(44444);
        print_r($userdata);

        foreach ($userdata as $item => $row) {
            $_SESSION['st']['userId'] = $row[0];
            $_SESSION['st']['userName'] = $row[1];
            $_SESSION['st']['userEmail'] = $row[3];
        }

        echo json_encode($userdata);
    }

    function signup($db, $username, $useremail, $password)
    {
        $userdata = '';
        // Get $_POST data
        $usrname = htmlspecialchars(functions::alphaNum($username));
        $usremail = htmlspecialchars($useremail);
        $pass = functions::encodeIt($password);
        $dateCreated = date('Y-m-d H:i:s');

        // Generate a RANDOM Hash
        $randomHash = uniqid(rand());
        // Take the first 8 hash digits and use it as the User's ID
        $randHash = substr($randomHash, 0, 8);

        // Set the values to insert
        $newuser[$_ENV['USER_ID']] = $randHash;
        $newuser[$_ENV['USERNAME']] = $usrname;
        $newuser[$_ENV['PASSWORD']] = $pass;
        $newuser[$_ENV['USER_EMAIL']] = $usremail;
        $newuser[$_ENV['DATE_CREATED']] = $dateCreated;

        $new_user = $db->insert(
            'users.txt',
            $newuser
        );

        $userinfo[$_ENV['USER_ID']] = $randHash;
        $userinfo[$_ENV['USERNAME']] = $usrname;
        $userinfo[$_ENV['DATE_CREATED']] = $dateCreated;

        // Define the File to be created
        $userFile = $usrname . '-' . $randHash;

        // Insert the data
        $new_user = $db->insert(
            $userFile . '.txt',
            $userinfo
        );

        // Send out Notification Email to the New User
        $subject = $_ENV['SITE_NAME'] . ' New Account Created';

        $message = '<html><body>';
        $message .= '<h3>' . $subject . '</h3>';
        $message .= '<p>';
        $message .= 'Your new account has been successfully created, and you can now sign in.<br />';
        $message .= '<a href="' . $_ENV['SITE_URL'] . 'sign-in.php">Sign In</a>';
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
        $useremail = htmlspecialchars($useremail);

        $userdata = $db->selectWhere(
            'users.txt',
            new simplewhereclause($_ENV['USER_EMAIL'], '=', $useremail)
        );

        if (empty($userdata)) {
            echo '0';
            exit;
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
                $_ENV['PASSWORD'] => $newpass,
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

            echo  '1';
        }
    }

    function usercheck($db, $username)
    {
        $userdata = '';

        $usrname = htmlspecialchars(functions::alphaNum($username));

        $userdata = $db->selectWhere(
            'users.txt',
            new simplewhereclause($_ENV['USERNAME'], '=', $usrname, $_ENV['DEFAULT_COMPARISON'])
        );

        echo (empty($userdata)) ? '0' : '1';
    }

    function emailcheck($db, $useremail)
    {
        $userdata = '';

        $useremail = htmlspecialchars($useremail);

        $userdata = $db->selectWhere(
            'users.txt',
            new simplewhereclause($_ENV['USER_EMAIL'], '=', $useremail,$_ENV['DEFAULT_COMPARISON'])
        );

        echo empty($userdata) ? '0' : '1';
    }
}

if (isset($_GET['signin'])) new signin();