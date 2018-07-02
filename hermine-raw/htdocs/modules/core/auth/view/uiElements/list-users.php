<div class="container">
	<div class="row">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
			<h1>hermine <br> <small>User Overview</small></h1>
		</div>
	</div>
	<div class="row spacer">
		<div class="col-lg-offset-1 col-lg-10 col-md-12 col-sm-12 col-xs-12">
			
			<div class="btn clr-hermine pull-right marginBottom10" ng-click="showCreateUserDialog()">
				<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>&nbsp;User
			</div>
			
			<table class="hermine-table table">
				<thead class="hermine-table-th">
					<tr>
						<th>Name</th>
						<th>Username</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody class="userList">
					<tr ng-repeat="user in allUsers | orderBy:'firstname'" class="userRow" data-userId="{{user.userId}}" ng-click="navigateTo(user.userId)">
						<td><span>{{user.firstname}} {{user.lastname}}</span></td>
						<td><span>{{user.username}}</span></td>
						<td>
							<span class="glyphicon" aria-hidden="true" ng-class="user.isActive ? 'glyphicon-ok' : 'glyphicon-remove'"></span>
						</td>
					</tr>
				</tbody>
			</table>
			
		</div>
	</div>
</div>