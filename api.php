<?php

//Boostrap: Initialise API

namespace vandash;

require(dirname(__FILE__) . '/includes/Dotenv.php');
require(dirname(__FILE__) . '/includes/sessions.php');
require(dirname(__FILE__) . '/includes/functions.php');

(new Dotenv(__DIR__ . '/.env'))->load();
$_ENV['SITE_URL'] = ($_ENV['SITE_URL'] == 'default') ? "https://" . @$_SERVER['HTTP_HOST'] : $_ENV['SITE_URL'];
$_ENV['SITE_EMAIL'] = $_ENV['SITE_EMAIL'];
$_ENV['APP_DIR'] = dirname(__FILE__);
error_reporting(($_ENV['DEBUG'] != 'true') ? 0 : E_ALL);
date_default_timezone_set($_ENV['TIME_ZONE']);
define('PEPPER', $_ENV['PEPPER']);
define('KEY', $_ENV['KEY']);


$_services = scandir($_ENV['APP_DIR'] . '/services/');
foreach (array_splice($_services, 3) as $service) {
    require($_ENV['APP_DIR'] . '/services/' . $service);
}