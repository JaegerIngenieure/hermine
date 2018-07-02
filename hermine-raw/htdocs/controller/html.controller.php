<?php

class HtmlController {

    private $headController;
    private $bodyController;
    private $application;

    function __construct($application) {
        $this -> application = $application;
        $this->application->addController('html',$this);
        $this -> headController = new HeadController($application);
        $this -> bodyController = new BodyController($application);

    }

    public function output() {
        echo '
<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en" ng-app="hermine" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="en" ng-app="hermine" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="en" ng-app="hermine" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html lang="de" ng-app="hermine">
<!--<![endif]-->
';
        $this -> headController -> output();
        $this -> bodyController -> output();
        echo "\r\n</html>";

    }

}
?>