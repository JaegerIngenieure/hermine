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