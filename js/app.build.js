({
    //By default, all modules are located relative to this path. If baseUrl
    //is not explicitly set, then all modules are loaded relative to
    //the directory that holds the build file. If appDir is set, then
    //baseUrl should be specified as relative to the appDir.
    baseUrl: "./",
    paths: {
        'backbone': 'libs/backbone/backbone',
        'jquery': 'libs/jquery/jquery',
        'jqueryui': 'libs/jqueryui/jquery-ui',
        'underscore': 'libs/lodash/lodash',
        'i18n':'libs/require/i18n',
		'text' : 'libs/require/text',
		'nls' : 'nls',
        'config':'config',
		'layout':'libs/jqueryui/jquery.layout.min',
		'slide': 'libs/jqueryui/jquery.layout.slide.min',
		
		'layoutModels' : 'models/layout',
		'layoutCollections' : 'collections/layout',
		'layoutTemplates' : 'modules/layout/templates'
    },
    dir: "./bin",
    optimize: "uglify",
    name: "app",
    findNestedDependencies: false
})
