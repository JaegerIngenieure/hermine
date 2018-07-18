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
	<div id="<?php echo $this->key; ?>-login">
		<div class="row">
			<div class="col-lg-2 col-lg-offset-5 col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 well">
				<img src="<?php echo $this->getContextController()->pageRoot; ?>/views/shared/public/img/logo_hermine.jpg" />
				<input type="text" class="form-control loginInput" id="loginUsername" placeholder="Username">
				<br />
				<input type="password" class="form-control loginInput" id="loginPassword" placeholder="Password">
				<br />
				<button type="button" class="btn clr-hermine pull-right" id="loginButton" onclick="BRUNCH.functions.login()">Login</button>
			</div>
		</div>
	</div>
</div>