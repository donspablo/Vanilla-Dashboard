<?php


namespace vandash\config;

ini_set('session.cookie_httponly', true);            // Helps mitigate xss
ini_set('session.session.use_only_cookies', true);    // Prevents session fixation
ini_set('session.cookie_lifetime', false);            // Smaller exploitation window for xss/csrf/clickjacking...
ini_set('session.cookie_secure', true);                // Owasp a9 violations


ini_set('SMTP',$ENV['SMTP']);
ini_set('smtp_port',$ENV['smtp_port']);
ini_set('username',$ENV['username']);
ini_set('password',$ENV['password']);
ini_set('sendmail_from',$ENV['sendmail_from']);

if (!isset($_SESSION)) session_start();
// Start Sessions                // Session Start

// Session Data
if ((isset($_SESSION['st']['userId'])) && ($_SESSION['st']['userId'] != '')) {
    // Keep some User data available
    $st_userId = $_SESSION['st']['userId'];
    $st_username = $_SESSION['st']['userName'];
    $st_useremail = $_SESSION['st']['userEmail'];
} else {
    $st_userId = $st_username = $st_useremail = '';
}
