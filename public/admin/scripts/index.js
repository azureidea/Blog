requirejs.config({
	baseUrl: "./scripts/",
	paths: {
        "views": "../views/",
		"angular": "vendors/angular/angular",
		"uiRouter": "vendors/angular-ui-router/release/angular-ui-router",
        "marked": "vendors/marked/lib/marked",
        "hljs": "vendors/highlightjs/highlight.pack"
	}, 
	shim:{
        'angular':{
            exports:'angular'
        },
        'uiRouter':{
            deps:['angular'],
            exports: 'uiRouter'
        },
        'marked': {
            exports: 'marked'
        },
        'hljs': {
            exports: 'hljs'
        }
    },
	deps:["bootstrap"]	
});
