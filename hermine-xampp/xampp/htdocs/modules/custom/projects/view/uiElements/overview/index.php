<?php

	$authModule	= $this->controller->getModule('auth');

	$importBtn= "";
		
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

			<div class="btn clr-hermine pull-right no-margin-right marginBottom10" ng-click="showNewProjectDialog()">
				<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;Project
			</div>

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