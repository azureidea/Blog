define(["angular", "app", "uiRouter"], function(angular, app) {
    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {
            $stateProvider
                .state('articles', {
                    url: "/articles",
                    templateUrl: "views/articles/articles.html",
                    controller: "ArticlesController"
                })  
                .state('articles.item', {
                    url: "/:articleId",
                    templateUrl: "views/articles/content.html",
                    controller: "ArticleController"
                })  
                .state('edit',{
                    url: "/edit/:articleId",
                    templateUrl: "views/compose.html",
                    controller: "ComposeController"
                })
                .state('compose', {
                    url: "/compose",
                    templateUrl: "views/compose.html",
                    controller: "ComposeController"
                })
                
            $urlRouterProvider.otherwise('/articles');   
                     
            $locationProvider.html5Mode(false).hashPrefix('!');

        }
    ])  
});
