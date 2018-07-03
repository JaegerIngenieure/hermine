<?php

/*
    hermine - heritage-expedition, rubble-management & intuitive nametag excavation
    Copyright © 2017 Webthinker <https://www.webthinker.de/> (Alexander Kunz, Patrick Werner, Tobias Grass)
    Concept by Jäger Ingenieure GmbH <https://www.jaeger-ingenieure.de/> (Kay-Michael Müller)
    Sponsored by the research initiative "ZukunftBau" <https://www.forschungsinitiative.de/> of the "Federal Institute for Research on Building, Urban Affairs and Spatial Development" <https://www.bbsr.bund.de/>
    You are not permitted to remove or edit this or any other copyright or licence information.

    This file is part of hermine.

    hermine is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation version 3 of the License.

    hermine is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU  Affero General Public License
    along with hermine.  If not, see <https://www.gnu.org/licenses/>. 
*/ 

class AjaxModule extends AbstractModuleBase {
    public $name = "Ajax Module";
    public $description = "The Module to manages the ajax module";
    public $key = "ajax";

    function __construct($controller) {
        parent::__construct($controller);
        $this->controller->addCoreModule($this->key,$this);
        //$this->includeFiles();
    }

    function getContent() {

        $pathParts			= explode("/",$_GET['path']);
        $moduleIdentifier	= $pathParts[1];
        $methodIdentifier	= $pathParts[2];

        $data				= array("module" => $moduleIdentifier,"method" => $methodIdentifier);

		if ($_SESSION['user'] != null || ($moduleIdentifier == "auth" && $methodIdentifier == "login")) {

	        $moduleInstance		= $this->controller->getModule($moduleIdentifier);
	        $returnValue		= $moduleInstance->$methodIdentifier($_POST);

		} else {
			include(dirname(__FILE__)."/../model/error.php");
			$returnValue = new BrunchError($this->key,"403.1","Invalid authorization credentials","ALL");
		}
		if(is_array($returnValue) || is_object($returnValue)) {
			echo json_encode($returnValue);
		} else {
			echo $returnValue;
		}
    }
}
