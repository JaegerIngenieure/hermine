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

class HeadController {

    private $application;

    public function __construct($application) {
        $this->application = $application;
        $this->application->AddController('head', $this);
    }

    public function output() {

        $contextController = $this -> application -> GetController('context');
        echo "	<head>\r\n";

        // meta attributes
        echo "		<meta charset=\"utf-8\">\r\n";
		echo "		<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n";
		echo "		<title>hermine</title>\r\n";
		echo "		<meta name=\"description\" content=\"heritage-expedition, rubble-management & intuitive nametag excavation\">\r\n";
        echo "		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n";
        echo "      <link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"views\shared\public\img\\favicon.ico\">";

        // load global javascripts
        $globalScriptFile   = $contextController->viewsRootDirectory . "/js.xml";
        $globalScripts      = simplexml_load_file($globalScriptFile);

        echo "\r\n		<!-- load scripts -->\r\n";
		echo "		<!-- globals -->\r\n";
        foreach ($globalScripts->script as $script) {
        	if($script->attributes()->access == "private" && $_SESSION['user'] == null) {
        		continue;
        	}
            $src = $script -> attributes() -> src;

            if (strpos($src, "http") === false) {
                $src = $this->application->GetController("configuration")->GetSetting('pageRoot').$src;
            }
            echo "		<script type=\"text/javascript\" src=\"{$src}\"></script>\r\n";
        }

        // load view specific scripts
        $viewScriptDir  = $contextController->currentViewDirectory . "/js";
        $currentViewUrl = $contextController->currentViewUrl;
		echo "\r\n		<!-- view -->\r\n";
        if (file_exists($viewScriptDir)) {
            foreach (scandir($viewScriptDir) as $file) {
                if ($file != "." && $file != "..") {
                    echo "		<script type=\"text/javascript\" src=\"" . $currentViewUrl . "/js/" . $file . "\"></script>\r\n";
                }
            }
        }

        // load core Module scripts
        $moduleController = $this -> application -> getController('modules');
        $coreModules = $moduleController -> getCoreModules();
		echo "\r\n		<!-- core -->\r\n";
        foreach ($coreModules as $module) {
            foreach ($module->getJs() as $scriptFile) {
                echo "		<script type=\"text/javascript\" src=\"" . $scriptFile . "\"></script>\r\n";
            }
        }

        // load the module specific files
        $activeModule = $this -> application -> getController('context') -> currentModule;
		echo "\r\n		<!-- module -->\r\n";
        if ($activeModule != null && $coreModules[$activeModule -> key] == null) {
            foreach ($activeModule->getJs() as $scriptFile) {
                echo "		<script type=\"text/javascript\" src=\"" . $scriptFile . "\"></script>\r\n";
            }
        }

        // load global styles
        $globalStyleFile = $contextController -> viewsRootDirectory . "/css.xml";
        $globalStyles = simplexml_load_file($globalStyleFile);

        echo "\r\n\r\n		<!-- load styles -->\r\n";
		echo "		<!-- globals -->\r\n";
        foreach ($globalStyles->style as $style) {
        	if($style->attributes()->access == "private" && $_SESSION['user'] == null) {
        		continue;
        	}
            $href = $style -> attributes() -> href;
            if (strpos($href, "http") > -1) {
                $location = $href;
            } else {
                $location = $contextController -> viewsRootUrl . "/" . $href;
            }

            if (strpos($location, "css") > -1) {
                echo "		<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $location . "\" />\r\n";
            }
        }

        // load view specific styles
		echo "\r\n		<!-- view -->\r\n";
        $viewScriptDir = $contextController -> currentViewDirectory . "/css/";
        $currentViewUrl = $contextController -> currentViewUrl;

        if (file_exists($viewScriptDir)) {
            foreach (scandir($viewScriptDir) as $file) {
                if ($file != "." && $file != "..") {
                    echo "		<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $currentViewUrl . "/css/" . $file . "\" />\r\n";
                }
            }
        }

        // load core module styles
		echo "\r\n		<!-- core -->\r\n";
        foreach ($coreModules as $module) {
            foreach ($module->getCss() as $styleFile) {
                echo "		<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $styleFile . "\"/>\r\n";
            }
        }

        // load active module styles
		echo "\r\n		<!-- module -->\r\n";
        if ($activeModule != null && $coreModules[$activeModule -> key] == null) {
            foreach ($activeModule->getCss() as $styleFile) {
                echo "		<link rel=\"stylesheet\" type=\"text/css\" href=\"" . $styleFile . "\"/>\r\n";
            }
        }

        echo "	</head>\r\n";
    }

}
?>