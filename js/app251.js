// Function from http://www.quirksmode.org/js/cookies.html
// Used below to get the locale from cookies.
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// Configure requirejs
require.config({
    appDir: "../",
    baseUrl: "js/",
    paths: {
        'backbone': 'libs/backbone/backbone',
        'jquery': 'libs/jquery/jquery',
        'jqueryui': 'libs/jqueryui/jquery-ui',
        'underscore': 'libs/lodash/lodash',
        'i18n':'libs/require/i18n',
		'text' : 'libs/require/text',
		'nls' : '../nls',
        'config':'config251',
		'html' : '../html',
		'layout':'libs/jqueryui/jquery.layout.min',
		'slide': 'libs/jqueryui/jquery.layout.slide.min',
		
		'layoutModels' : 'models/layout',
		'layoutCollections' : 'collections/layout',
		'layoutTemplates' : 'modules/layout/templates'
    },
	config: {
        //Set the config for i18n locale
        i18n: {
            locale: document.cookie.length > 0 ? readCookie('lang') : 'root'
        }
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'jqueryui': {
            deps: ['jquery']
        },
		'layout': {
			deps: ['jqueryui']
		},
		'slide': {
			deps: ['layout']
		},
        'config': {
            exports: 'Config'
        }
    }
});
require(['router', 'backbone'], function(Router){
    if(navigator.appName == 'Microsoft Internet Explorer'){
        // IE 8 hack: prevent IE 8 from caching the AJAX requests
        $.ajaxSetup({
            cache: false
        });
    }
    // Initialize the router
    Router.initialize();
});