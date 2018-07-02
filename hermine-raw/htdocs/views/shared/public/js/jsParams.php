<?php
/**
 * Gerneric javascript file that provides files of the configuration as js variables
 */

header('Content-type: application/javascript');
include dirname(__FILE__)."/../../../../controller/configuration.controller.php";
$configController = new ConfigurationController(null, true);

echo "BRUNCH.config = BRUNCH.config || {};\r\n";

foreach ($configController->getJsSettings() as $key => $value) {
	echo "BRUNCH.config.{$key} = '{$value}';\r\n";
}

?>