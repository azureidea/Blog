define(['angular',
	'controllers/module',
	'services/article'
	],function(angular,app){
	app.controller('ArticlesController',[
		'$scope',
		'ArticleService',
		function ($scope,service){
			service.getArticleList()
				.success(function(res){
					$scope.articles = res.data;
				})
		}
	])
})