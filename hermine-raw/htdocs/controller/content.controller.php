<?php

class ContentController {
    private $application;

    function __construct($application) {
        $this->application = $application;
        $this->application->AddController('content', $this);
    }

    function output() {
        $contextController = $this->application->GetController('context');

        echo "<div class=\"pageContent\">\r\n";
        if ($contextController->currentModule == null)
        {
            $viewFooterFilePath     = $contextController->currentViewDirectory . "/content.php";
            $defaultFooterFilePath  = $contextController->defaultViewDirectory . "/content.php";

            if (file_exists($viewFooterFilePath))
            {
                include $viewFooterFilePath;
            }
            else
            {
                include $defaultFooterFilePath;
            }
        }
        else
        {
            $activeModule = $contextController->currentModule;
            $authModule = $this->application->GetController('modules')->getModule('auth');

            if ($authModule->hasUserAnyPermissionsForModule($activeModule->key))
            {
                echo $activeModule->getContent();
            }
            else
            {
            	$pageRoot = $contextController->pageRoot;
				echo '
				<script>
					BRUNCH.navigateTo("'.$pageRoot.'");
				</script>
				';
				exit();                
            }
        }
		echo "</div>\r\n";
    }

}
?>