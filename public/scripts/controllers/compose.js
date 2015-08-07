define(['angular',
	'controllers/module',
	'marked',
	'hljs',
	'services/article'
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
		function ($scope, $sce, $stateParams, $state, service) {
			$scope.articleId = $stateParams.articleId;
			$scope.content = "";

			$scope.save = function () {
				var article = {
					content: $scope.content,
					tags: [{ name: "nodejs" }],
					title: $scope.title
				};
				if ($scope.articleId) {
					service.updateArticle($scope.articleId, article)
						.success(function (res) {
							$state.go("articles");
						})
				} else {
					service.createArticle(article)
						.success(function (res) {
							$state.go("articles");
						})
				}
			};


			if ($scope.articleId) {
				service.getArticleInfo($scope.articleId, { raw: 1 })
					.success(function (res) {
						var article = res.data;
						$scope.content = article.content;
						$scope.title = article.title;
					})
			}

			$scope.$watch('content', function (val) {
				$scope.preview = $sce.trustAsHtml(marked(val));
			})
		}
	])
})