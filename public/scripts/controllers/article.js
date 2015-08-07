define(['angular',
	'controllers/module',
	'services/article'
	],function(angular,app){
	app.controller('ArticleController',[
		'$scope',
		'$sce',
		'$stateParams',
		'$state',
		'ArticleService',
		function ($scope,$sce,$stateParams,$state,service){
			$scope.articleId = $stateParams.articleId;
			
			service.getArticleInfo($stateParams.articleId)
				.success(function(res){
					res.data.content = $sce.trustAsHtml(res.data.content);
					$scope.article = res.data;
				})
				
			$scope.delArticle = function(articleId) {
				service.delArticle(articleId,{})
					.success(function(res){
						$state.go('articles');
					})
			}
		}
	])
})