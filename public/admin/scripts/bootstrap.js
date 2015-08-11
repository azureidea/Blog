define(["angular","app","config/router"],function(angular,app){
	angular.element(document).ready(function(){
		angular.bootstrap(document,[app.name])
	})
});