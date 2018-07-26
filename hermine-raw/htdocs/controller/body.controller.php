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

class BodyController {
    private $application;
    private $menuController;
    private $contentController;
    private $moduleController;

    public function __construct($application) {
        $this -> application = $application;
        $this -> application -> AddController('body', $this);
		$this -> menuController = new MenuController($application);
        $this -> contentController = new ContentController($application);
    }

    /**
    * writes the output to the page
    */
    public function output() {

		//get controller and module
    	$moduleController	= $this->application->getController("modules");
		$authModule			= $moduleController->getModule("auth");
		$contextController	= $this->application->getController("context");
		$currentModule		= $contextController->currentContext;

		//build label menu
		$startCurrent		= ($currentModule == "home") ? "currentModule" : "";
		$settingsCurrent	= ($currentModule == "auth") ? "currentModule" : "";
		$logoutButton		= '<div class="labelNavigationElement" onclick="BRUNCH.functions.logout();">Logout<span class="glyphicon glyphicon-off" aria-hidden="true"></span></div>';
		$settingsButton		= '<div class="labelNavigationElement '.$settingsCurrent.'" onclick="BRUNCH.navigateTo(\'/auth\');">User<span class="glyphicon glyphicon-cog" aria-hidden="true"></span></div>';

		$labelMenuCode		= '
			<div class="labelNavigationElement '.$startCurrent.'" onclick="BRUNCH.navigateTo(\'/\');">Start</div>
		';
		foreach($moduleController->getAllModules() as $module)
		{
			if ($module->showAtHome == true)
			{
				if ($authModule->hasUserAnyPermissionsForModule($module->key))
				{

				    $currentModuleCss	= ($module->key == $currentModule) ? "currentModule" : "";
		        	$labelMenuCode .= '
		        		<div class="labelNavigationElement '.$currentModuleCss.'" onclick="BRUNCH.navigateTo(\'/'.$module->key.'\');">'.$module->name.'</div>
		        	';
		        }
		    }
		}

		echo '<body>';
		if($_SESSION["user"])
		{
			echo '
			<div class="container '.$hideLabelMenu.'">

				<div class="row">
					<div id="labelNavigationArea" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
						'.$labelMenuCode.'
						'.$settingsButton.'
						'.$logoutButton.'
					</div>					
				</div>
			</div>';
		}
		echo '
			<!-- brunch loading spinner -->
			<div id="spinnerArea">
				<div class="spinnerBox">
					<div class="spinner">
						<span class="glyphicon glyphicon-refresh spinner" aria-hidden="true"></span>
						<span class="loadingText">Loading...</span>
					</div>
				</div>
				<div class="spinnerOverlay"></div>
			</div>
			<!-- ng view -->
			<ng-view></ng-view>';
	        $this->menuController->output();
	        $this->contentController->output();
	        		
		//imprint
		echo '<div id="imprint">
				<span>
					<a href="https://github.com/JaegerIngenieure/hermine">hermine</a> is licensed under <a href="https://www.gnu.org/licenses/agpl.txt">AGPL-3.0-only</a> by <a href="https://www.jaeger-ingenieure.de">J&auml;ger Ingenieure GmbH</a> and <a href="https://www.webthinker.de/" title="WebThinker Website" target="_BLANK">WebThinker</a>
					<br>
					Sponsored by the research initiative "<a href="https://www.forschungsinitiative.de">ZukunftBau</a>" of the "<a href="https://www.bbsr.bund.de">Federal Institute for Research on Building, Urban Affairs and Spatial Development</a>"					
				</span>
			</div>';
		echo '</body>';
    }
}
?>