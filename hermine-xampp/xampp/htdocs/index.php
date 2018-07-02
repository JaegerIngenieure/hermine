<?php
    
	error_reporting(E_ALL & ~E_NOTICE);

    require_once('controller/app.controller.php');
    $application = new ApplicationController();
    $application->run();

?>