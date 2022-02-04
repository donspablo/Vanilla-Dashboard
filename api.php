<?php

//Boostrap: Initialise API

namespace VanillaDash\Includes;

require(dirname(__FILE__) . '/includes/Dotenv.php');
require(dirname(__FILE__) . '/includes/functions.php');
require(dirname(__FILE__) . '/includes/sessions.php');

(new Dotenv(__DIR__ . '/.env'))->load();
error_reporting(($_ENV['DEBUG'] != 'true') ? 0 : E_ALL);
date_default_timezone_set($_ENV['TIME_ZONE']);
define('PEPPER', $_ENV['PEPPER']);
define('KEY', $_ENV['KEY']);
$_ENV['SITE_URL'] = ($_ENV['SITE_URL'] == 'default') ? "https://" . @$_SERVER['HTTP_HOST'] : $_ENV['SITE_URL'];
$_ENV['SITE_EMAIL'] = $_ENV['SITE_EMAIL'];

$_services = scandir(dirname(__FILE__) . '/services/');
foreach (array_splice($_services, 3) as $service) {
    require(dirname(__FILE__) . '/services/' . $service);
}