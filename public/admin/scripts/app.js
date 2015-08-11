define([
	"angular",
	"uiRouter",
	"controllers/index",
	"services/index",
	"directives/index",
	"filters/index"
],function(angular){
	return angular.module('app',[
		'ui.router',
		'app.services',
		'app.controllers'
		//'app.directives',
		//'app.filters'
	])
	.constant("API",'/api')
	.factory('url',[
		function () {
			return {
				addParam: function (url, search) {
					for (var key in search) {
						if (search.hasOwnProperty(key) && search[key]) {
							var connecter = "&";
							if (url.indexOf('?') === -1) {
								connecter = "?";
							}
							url += connecter + key + '=' + encodeURIComponent(search[key]);
						}
					}
					return url;
				}				
			}
		}
	])
	.factory('http',[
		'$http',
		'API',
		'url',
		function ($http,API,url) {
			return {	
				get: function (api, search) {
					api = API + api;
					api = url.addParam(api, search || {});
					return $http.get(api);
				},
				post: function (api, data, search) {
					api = API + api;
					api = url.addParam(api, search || {});
					return $http.post(api, data);
				}			
			}
		}
	])
	.factory('httpInterceptor',[
		'$q',
		'API',
		function ($q,API){
			return {
				request: function(config) { 
					if (config.url.indexOf(API) === 0) {
						//config.url = config.url.replace(API,'');
						
						angular.extend(config.headers,{
							'Content-Type': 'application/json'
						});
					}
					                 
                    return config;
                },
                requestError: function(rejection) {                  
                    return rejection;
                },
                response: function(response) {
					if (response.status === 200){
						var retCode = response.data.retCode;
						
						if (retCode !== 0) {						
							if (retCode === 999) {
								location.href = "/admin/login.html";
								return $q.reject(response);
							}
						}
						return response;
					}
                    
					return $q.reject(response);
                },
                responseError: function(response) {                   
                    return $q.reject(response);
                }
			}
		}
	])
	.config([
		'$httpProvider', 
		function($httpProvider) {
    		$httpProvider.interceptors.push('httpInterceptor');
		}
	])
});