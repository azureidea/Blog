define(['angular','services/module'],function(angular,app){
	app.factory('ArticleService',[
		'http',
		function ($http){
			return {
				getArticleList : function(search){
					return $http.get('/articles',search);
				},
				getArticleInfo : function(articleId,search){
					return $http.get('/article/' + articleId,search);
				},
				createArticle: function(data){
					return $http.post('/article/create',data);
				},
				updateArticle: function(articleId,data){
					return $http.post('/article/update/' + articleId,data);
				},
				delArticle: function(articleId,data){
					return $http.post('/article/delete/' + articleId,data);
				}
			}
		}
	])
})