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

	$authModule	= $this->controller->getModule('auth');

	$importBtn      = "";
    $addProjectBtn  = "";
		
	if($authModule->getUserPermissionForModule($this->key) > 85)
    {
        $importBtn .= '
            <!-- upload area -->
            <div ngf-drop ngf-select ng-model="importFile" class="btn clr-hermine no-margin-right marginBottom10"
                ngf-multiple="false" ngf-allow-dir="false" accept=".zip"
                ngf-pattern="\'.zip\'">
                <span class="glyphicon glyphicon-open-file" aria-hidden="true"></span>&nbsp;Import
            </div>
            <div class="btn clr-hermine no-margin-right marginBottom10" ng-click="exportProject()">
                <span class="glyphicon glyphicon-save-file" aria-hidden="true"></span>&nbsp;Export
            </div>				
            ';

        $addProjectBtn .= '
            <div class="btn clr-hermine pull-right no-margin-right marginBottom10" ng-click="showNewProjectDialog()">
				<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;Project
            </div>
            ';
    }
?>

<div class="container">
	<div class="row spacer">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
			<h1>
				{{currentUser.fullname}} <br> <small>Projects Overview</small>
			</h1>
		</div>	
		
	<div class="row spacer">
		<div class="col-lg-offset-1 col-lg-10 col-md-12 col-sm-12 col-xs-12">
			
			<?php 
				echo $importBtn;
			?>

            <?php
                echo $addProjectBtn;
            ?>

			<table class="table hermine-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Comment</th>						
					</tr>
				</thead>
				<tbody class="userList">
					<tr ng-repeat="project in allProjects" class="userRow" ng-click="detailRedirect(project.Id)">
						<td><span>{{project.name}}</span></td>
						<td><span>{{project.comment}}</span></td>						
					</tr>
				</tbody>
			</table>
			
		</div>
	</div>
</div>