<?php
	$hasPermissions	=(intval($_SESSION["user"]->permissions["auth"]) >= 90) ? true : false;
?>

<div class="container">
	<div class="row">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
			<h1>USER SETTINGS</h1>
		</div>
	</div>
	<div class="row spacer">
		<section class="col-lg-offset-1 col-lg-10 col-md-12 col-sm-12 col-xs-12">
			
			<div class="panel well tabsContent">
				
				<div class="row spacer">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<table>
							<tbody>
								<tr>
									<td colspan="2"><strong>Personal Data</strong></td>
								</tr>
								<tr>
									<td>Firstname</td>
									<td>
										<input id="firstname" placeholder="Vorname" type="text" class="form-control" ng-model="user.firstname"/>
									</td>
								</tr>
								<tr>
									<td>Lastname</td>
									<td>
										<input id="lastname" placeholder="Nachname" type="text" class="form-control" ng-model="user.lastname"/>
									</td>
								</tr>								
							</tbody>
						</table>
					</div>
				</div>
				<hr>
				
				<div class="row spacer">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<table>
							<tbody>
								<tr>
									<td colspan="2"><strong>Access</strong></td>
								</tr>
								<tr>
									<td>Username</td>
									<td>
										<input id="username" type="text" class="form-control" ng-model="user.username" disabled/>
									</td>
								</tr>
								<tr>
									<td>New password</td>
									<td>
										<input id="newPassword" type="password" placeholder="Password" class="form-control" ng-model="user.newpass"/>
									</td>
								</tr>
								<tr>
									<td>Repeat</td>
									<td>
										<input id="newPasswordConfirm" type="password" placeholder="Repeat" class="form-control" ng-model="user.newpassconf"/>
									</td>
								</tr>
								<?php if($hasPermissions) : ?>
								<tr>
									<td>User active?</td>
									<td>
										<input id="isActive" type="checkbox" class="form-control" ng-model="user.isActive"/>
									</td>
								</tr>
								<tr>
									<td>Administrator?</td>
									<td>
										<input id="isAdmin" type="checkbox" class="form-control" ng-model="user.isAdmin"/>
									</td>
								</tr>
								<?php endif; ?>
							</tbody>
						</table>
					</div>
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
						<?php if($hasPermissions) : ?>
						<table>
							<tbody>
								<tr>
									<td colspan="2"><strong>Permissions</strong></td>
								</tr>
								<tr>
									<td>Settings</td>
									<td><select name="auth" class="modulePerms form-control">
											<option ng-repeat="(nativePermValue, permName) in userRoles" value="{{nativePermValue}}" ng-selected="user.permissions.auth==nativePermValue">{{permName}}</option>
										</select>
									</td>
								</tr>
								<?php
									foreach($this->controller->getAllModules() as $module) {
									    if ($module->showAtHome == true) {
									    	echo '
									    	<tr>
									    		<td>'.$module->name.'</td>
									    		<td>
									    			<select name="'.$module->key.'" class="modulePerms form-control">
														<option ng-repeat="(nativePermValue, permName) in userRoles" value="{{nativePermValue}}" ng-selected="user.permissions.'.$module->key.'==nativePermValue">{{permName}}</option>
													</select>
												<td>
									    	</tr>
									    	';
									    }
									}
								?>
							</tbody>
						</table>
						<?php endif; ?>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<?php if($hasPermissions) : ?>
							<button id="deleteItemButton" class="btn btn-danger" type="button" ng-click="deleteUser()">
								<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
							</button>
						<?php endif; ?>

						<button type="button" class="btn clr-hermine pull-right" ng-click="saveData()">
							<span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>&nbsp;Save
						</button>
					</div>
				</div>
			</div>
			
		</section>
	</div>
</div>