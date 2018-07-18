<!-- /*
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
*/  -->

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