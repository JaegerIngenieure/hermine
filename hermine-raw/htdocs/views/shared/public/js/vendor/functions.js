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

$(document).ready(function() {

	//label navigation handling
	$(".labelNavigationElement").hover(function() {
		$(this).addClass("active");
	});
	$(".labelNavigationElement").mouseleave(function() {
		$(".labelNavigationElement").removeClass("active");
	});

	//focus input
	$("#loginUsername").focus();

	//try login if user presses enter
	$(".loginInput").keypress(function(e) {
		if(e.which == 13) {
			BRUNCH.functions.login();
		}
	});
});
function hashGlobalPass(pass,salt) {return CryptoJS.SHA512(pass,salt).toString();}