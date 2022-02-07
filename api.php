<?php


namespace vandash;
error_reporting(0);
$_configs = scandir((dirname(__FILE__) . '/configs/'));
foreach (array_splice($_configs, 3) as $config) {
    require((dirname(__FILE__) . '/configs/' . $config));
}

use vandash\configs\dotenv;

(new dotenv(__DIR__ . '/.env'))->load();
$_ENV['SITE_URL'] = ($_ENV['SITE_URL'] == 'default') ? "https://" . @$_SERVER['HTTP_HOST'] : $_ENV['SITE_URL'];
$_ENV['SITE_EMAIL'] = $_ENV['SITE_EMAIL'];
$_ENV['APP_DIR'] = dirname(__FILE__);
error_reporting(($_ENV['DEBUG'] != 'true') ? 0 : E_ALL);

date_default_timezone_set($_ENV['TIME_ZONE']);

ini_set('SMTP', $_ENV['SMTP']);
ini_set('smtp_port', $_ENV['smtp_port']);
ini_set('username', $_ENV['username']);
ini_set('password', $_ENV['password']);
ini_set('sendmail_from', $_ENV['sendmail_from']);


$_includes = scandir((dirname(__FILE__) . '/includes/'));
foreach (array_splice($_includes, 3) as $include) {
    require((dirname(__FILE__) . '/includes/' . $include));
}

require_once $_ENV['APP_DIR'] . "/core/store.php";

$_services = scandir($_ENV['APP_DIR'] . '/services/');
foreach (array_splice($_services, 3) as $service) {
    require($_ENV['APP_DIR'] . '/services/' . $service);
}