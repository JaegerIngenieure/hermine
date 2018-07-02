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