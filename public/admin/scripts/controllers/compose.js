define(['angular',
	'controllers/module',
	'marked',
	'hljs',
	'services/article',
	'services/tag'
], function (angular, app, marked, hljs) {
	marked.setOptions({
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false,
		highlight: function (code) {
			return hljs.highlightAuto(code).value;
		}
	});

	app.controller('ComposeController', [
		'$scope',
		'$sce',
		'$stateParams',
		'$state',
		'ArticleService',
		'TagService',
		function ($scope, $sce, $stateParams, $state, ArticleService,TagService) {
			$scope.articleId = $stateParams.articleId;
			$scope.content = "";

			$scope.save = function () {
				var article = {
					content: $scope.content,
					tags: $scope.tags,
					title: $scope.title
				};
				if ($scope.articleId) {
					ArticleService.updateArticle($scope.articleId, article)
						.success(function (res) {
							$state.go("articles");
						})
				} else {
					ArticleService.createArticle(article)
						.success(function (res) {
							$state.go("articles");
						})
				}
			};

			$scope.tags = [];
			
			$scope.addTag = function(){
				TagService.createTag({
					name: $scope.tag,
					articles: []
				})
					.success(function(res){					
						$scope.tags.push({
							name:$scope.tag,
							id: res.data._id
						});
						$scope.tag = "";
					})
			};
		
			if ($scope.articleId) {
				ArticleService.getArticleInfo($scope.articleId, { raw: 1 })
					.success(function (res) {
						var article = res.data;
						$scope.content = article.content;
						$scope.title = article.title;
						$scope.tags = article.tags;
					})
			}

			$scope.$watch('content', function (val) {
				$scope.preview = $sce.trustAsHtml(marked(val));
			})
		}
	])
})