define(['angular','services/module'],function(angular,app){
	app.factory('TagService',[
		'http',
		function ($http){
			return {
				getTagList : function(search){
					return $http.get('/tags',search);
				},
				createTag: function(data){
					return $http.post('/tag/create',data);
				},
				updateTag: function(tagId,data){
					return $http.post('/tag/update/' + tagId,data);
				},
				delTag: function(tagId,data){
					return $http.post('/tag/delete/' + tagId,data);
				}
			}
		}
	])
})