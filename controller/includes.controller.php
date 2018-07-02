<?php

class IncludeController {
       
   private $application;        
              
   public function __construct($application) {
       $this->application = $application;
       $this->application->AddController('inclusion',$this);
   }       
      
    public function IncludeFiles() {
          $content = simplexml_load_file(dirname(__FILE__)."/controller.registry.xml");
          
          foreach($content->controller as $controller) {
              $dirName = dirname(__FILE__)."/".$controller->Attributes()->path;
              include $dirName;
          }        
    }
}

?>