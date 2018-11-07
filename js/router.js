//^#diagnostics/datatables[/](.*)$|^#diagnostics/datatables$
// Filename: router.js
define(['config', 'backbone', 'modules/layout/views/Layout'], function(config, Backbone, Layout){
  var AppRouter = Backbone.Router.extend({
		customRoutes: new Array(),
        initialize: function () {
            _.bindAll(this);
            // Instantiate the layout as a global inside of the backbone library
            Backbone.Layout = new Layout();
			this.config = config;
			this.createRoutes(this.config.menu);
        },
		//Generate routes: this.route(<URL>, <ID>)
		createRoutes: function(menuSection){
			for(var item = 0; item < menuSection.length; item++){
				// Base case
                if(menuSection[item].children){
					// Recursivly call createRoutes to go through the nested structure.
                    this.createRoutes(menuSection[item].children);
				}
                // Prevent data tables from going through the route generation
                var regExp = RegExp("^#monitoring/datatables[/](.*)$|^#monitoring/datatables$");
                if(!regExp.test(menuSection[item].url)){
					//This check needs to be done first, just in case someone has a custom page 
					//	with an ID of "custom"
                    if(menuSection[item].fileName){
						var levels = menuSection[item].url.substring(1).split('/');
						var fileName = menuSection[item].fileName;
						var pageTitle = menuSection[item].displayName;
						this.customRoutes['custom_'+menuSection[item].id] = 
							{levels: levels, fileName: fileName, pageTitle: pageTitle};
					}
					// If a route function is defined for the specific page then add the route normally.
					else if(this[menuSection[item].id]){
                        this.route(menuSection[item].url.substring(1), menuSection[item].id);
                        this.route(menuSection[item].url.substring(1) + '/', menuSection[item].id);
                    }
                    else{
                        // Add a route for the specific menu item that references pageDoesNotExist
                        this.route(menuSection[item].url.substring(1), 'pageDoesNotExist');
                        this.route(menuSection[item].url.substring(1) + '/', 'pageDoesNotExist');
                    }
                }
			}
		},
        // Actions available in the controller
         routes:{
			// Default start page
            '': 'home',
            // Generic Invalid 
            ':level1/:level2/:level3' : 'pageDoesNotExist',
            ':level1/:level2/:level3/' : 'pageDoesNotExist',
            ':level1/:level2' : 'pageDoesNotExist',
            ':level1/:level2/' : 'pageDoesNotExist',
            ':level1' : 'pageDoesNotExist',
            ':level1/' : 'pageDoesNotExist'
        },
        home: function(){
            require(['modules/layout/views/BlankView'], function(viewClass){
                Backbone.Layout.updatePageContent("home", viewClass);
            });
        },
        scannerstatus:function(){
            require(['modules/diagnostics/scannerstatus/views/Scanner'],function(viewClass){
                Backbone.Layout.updatePageContent('diagnostics','connecteddevices','scannerstatus',viewClass);
            });
        },
        eipscannerstatus: function () {
            require(['modules/diagnostics/eipscannerstatus/views/eipScanner'], function (viewClass) {
                Backbone.Layout.updatePageContent('diagnostics', 'connecteddevices', 'eipscannerstatus', viewClass);
            });
        },
        pageDoesNotExist: function (){
            // Grab the URI hash from backbone.
            var levels = Backbone.history.getHash().split('/');
			//Check to see if this is a custom (not Backbone-based) page
			if(this.customRoutes["custom_"+levels[2]]){
				var id = "custom_"+levels[2];
				this.custom(
					this.customRoutes[id].levels, 
					this.customRoutes[id].fileName, 
					this.customRoutes[id].pageTitle
				);
			}else{
				// Update the interface
				Backbone.Layout.updatePageContent(levels[0], levels[1], levels[2]);
			}
        },
		custom: function(levels, pageUrl, pageTitle){
			require(['modules/layout/views/CustomView'], function(viewClass){
				Backbone.Layout.updatePageContent(
					levels[0], levels[1], levels[2], viewClass, 
					{pageUrl: pageUrl, pageTitle: pageTitle}
				);
			});
        }
    });

    var initialize = function () {
            Backbone.AppRouter = new AppRouter;
            Backbone.history.start();
        };
    return {
        initialize: initialize
    };
});