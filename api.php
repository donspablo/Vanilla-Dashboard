<?php

//Boostrap: DIY autoloader to initialise API


namespace vandash;

$_configs = scandir((dirname(__FILE__) . '/config/'));
foreach (array_splice($_configs, 3) as $config) {
    require((dirname(__FILE__) . '/config/' . $config));
}

use vandash\config\dotenv;

(new dotenv(__DIR__ . '/.env'))->load();
$_ENV['SITE_URL'] = ($_ENV['SITE_URL'] == 'default') ? "https://" . @$_SERVER['HTTP_HOST'] : $_ENV['SITE_URL'];
$_ENV['SITE_EMAIL'] = $_ENV['SITE_EMAIL'];
$_ENV['APP_DIR'] = dirname(__FILE__);
error_reporting(($_ENV['DEBUG'] != 'true') ? 0 : E_ALL);
date_default_timezone_set($_ENV['TIME_ZONE']);
define('PEPPER', $_ENV['PEPPER']);
define('KEY', $_ENV['KEY']);


$_includes = scandir((dirname(__FILE__) . '/includes/'));
foreach (array_splice($_includes, 3) as $include) {
    require((dirname(__FILE__) . '/includes/' . $include));
}

$_services = scandir($_ENV['APP_DIR'] . '/services/');
foreach (array_splice($_services, 3) as $service) {
    require($_ENV['APP_DIR'] . '/services/' . $service);
}