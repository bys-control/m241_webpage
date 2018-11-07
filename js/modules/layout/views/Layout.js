/**
	@class Layout
	@desc View that renders the Invariant's main layout
	@extends Backbone.View
*/
define(['config',
        './Header', 
        './TopMenu', 
        './SideMenu', 
        './Footer',
        'layoutModels/MenuItemModel',
        'layoutCollections/MenuItemsCollection', 
		'text!../templates/languagebox.tpl',
		'i18n!nls/translations',
        'backbone',  'layout', 'slide'],
    function(config, HeaderView, TopMenuView, SideMenuView, FooterView, MenuItemModel, MenuItemsCollection, LanguageBoxTemplate, Translations){
        var View = Backbone.View.extend({
            el: $('body'),
			header: new HeaderView(),
			footer: new FooterView(),
			languageBoxTemplate: _.template(LanguageBoxTemplate),
            events: {
				'click #lang' : 'displayLanguageSelector',
				'mouseleave #lang-box': 'onLangBoxLeave',
				'click #lang-box ul li' : 'fireChooseLanguage',
				'mouseenter span.reopen' : 'onReopenHover',
				'mouseleave span.reopen' : 'onReopenLeave',
				'click span.reopen': 'showMenu'
            },
            currentPageView: null,
			_level1: null,
            isLayoutRendered: false,
			/**
				@func initialize
				@desc Constructor for the footer. Binds events, initializes the template, configuration file, and menu collection.
			*/
            initialize: function(){
                _.bindAll(this);
                // Generate the menu collection
                this.menuCollection = this.generateMenuFromConfig(config.menu);                
                this.topMenu = new TopMenuView({menu: this.menuCollection});
                this.sideMenu = new SideMenuView({menu: this.menuCollection});
				
				$(window).on('resize', _.bind(this.onResize, this));
            },
            render: function(level1, level2, level3) {
                if(!this.isLayoutRendered){
					//Append the title from the configuration file
					$('head').prepend('<title>' + config.pageTitle + '</title>');
                    // Only render the layout once.
					this.$el.append(this.footer.render().el);
					this.$el.append(this.languageBoxTemplate);
                    $('#header-parent', this.$el).prepend(this.topMenu.render(level1).el);
                    $('#header-parent', this.$el).prepend(this.header.render().el);
                    $('#side-menu-parent', this.$el).html(this.sideMenu.render(level1, level2, level3).el);
                    this.isLayoutRendered = true;
                }
                // Update the MenuItems with the correct selection
                this.menuCollection.updateSelection(level1, level2, level3);
				this.layout = $('#container', this.$el).layout({
					applyDefaultStyles: true,
					north__resizable: false,
					north__closable: false,
					north__spacing_open: 0,
					west__spacing_open: 2,
					west__size: 250,
					west__minSize: 0,
					west__resizerTip: Translations['resize'],
					west__onclose: function(){
						$('#page-content', this.$el).prepend('<span><span class="ui-icon ui-icon-carat-1-e reopen"></span></span>');
					},
					west__onopen: function(){
						$('span.reopen', this.$el).parent('span').remove();
						$('span.reopen', this.$el).remove();
					},
					west__onhide: function(){
						$('span.reopen', this.$el).remove();
					},
					west__fxName:   "slideOffscreen",
					west__fxSpeed: 500
				});
				this.layout.addToggleBtn('.ui-layout-pane-west .control:eq(0)', 'west');
                return this;
            },
			onReopenHover: function(e){
				var $target = $(e.target);
				$target.parent('span').addClass('ui-state-whiteout');
			},
			onReopenLeave: function(e){
				var $target = $(e.target);
				$target.parent('span').removeClass('ui-state-whiteout');
			},
            remove: function (){
                this.menuCollection = null;
				$('span.reopen').remove();
				$(window).off('resize.app');
                // Call the parent class remove method
                Backbone.View.prototype.remove.call(this);
            },
            updatePageContent: function (level1, level2, level3, viewClass, options){
				var isFullPage = (level2 instanceof Object);
				
				if(isFullPage){
					this.render(level1);
				}else{
					this._level1 = level1;
					// Update the menus
					this.render(level1, level2, level3);
				}
				
				// Remove the page content if one already exists
				if(this.currentPageView){
					// Clean up previous view
					this.currentPageView.remove();
				}
					
				// Instantiate a new view and output it to the page if a view is provided.
				if(isFullPage){
					this.currentPageView = new level2();	//level2 is viewClass in this case
					$('#page-content', this.$el).html(this.currentPageView.render().el);
				}else if(viewClass){
					// Instantiate new view and hold a reference in the layout.
					this.currentPageView = 
						new viewClass({level1: level1, level2: level2, level3: level3, info: options});
					$('#page-content', this.$el).html(this.currentPageView.render().el);
				}else{
					// Even if there isn't a new view remove the old view.
					this.currentPageView = null;
					
					var imgTag = 'unknown';
					//Show images on blank pages
					switch(level1){
						default:
							imgTag = 'unknown';
						break;
					}
					$('#page-content', this.$el).html(
						'<div class="sectionImage wrapper"><img src="images/lg_' + imgTag + '.png"></div>'
					);
				}
				
				if(isFullPage){
					//Make sure the menu gets shown again if coming from the home page
					this.hideMenu();
				}else{
					//Do not show the left menu in full page mode
					this.showMenu();
				}
            },
            generateMenuFromConfig: function(menuItems){
                var collection = new MenuItemsCollection();
                if(menuItems && menuItems.length > 0){
                    for(var i=0;i<menuItems.length;i++){
                        var model = new MenuItemModel({id:menuItems[i].id, name:menuItems[i].displayName, url:menuItems[i].url});
                        
                        if(menuItems[i].image){
                            model.set('image', menuItems[i].image);
                        }
						
						if(menuItems[i].state){
							model.set('state', menuItems[i].state);
						}
                        
                        if(menuItems[i].children){
                            // Recursion is your friend
                            model.set('children', this.generateMenuFromConfig(menuItems[i].children));
                        }
						
                        // Add the model to the 
                        collection.add(model);
                    }
                }
                return collection;
            },
			hideMenu: function(){
				Backbone.Layout.layout.hide('west');
			},
			showMenu: function(){
				Backbone.Layout.layout.show('west');
				Backbone.Layout.layout.open('west');
			},
			//Needed to move the next to functions from Header because they would not fire
			fireChooseLanguage: function(event){
				//NOTE: Language change is handled differently here from FactoryCast version
				event.stopPropagation();
				var targetName = $(event.target).attr('name');
				if(targetName.match(/^[0-5]$/)){
					//Change language
					switch(targetName){
						case '0': this.createCookie('lang','root',1); break;
						case '1': this.createCookie('lang','fr-fr',1); break;
						case '2': this.createCookie('lang','de-de',1); break;
						case '3': this.createCookie('lang','it-it',1); break;
						case '4': this.createCookie('lang','es-es',1); break;
						case '5': this.createCookie('lang','zh-cn',1); break;
						default:  this.createCookie('lang','root',1); break;
					}
					window.location.reload(true);
				}
			},
			//Cookie handling from: http://www.quirksmode.org/js/cookies.html
			createCookie: function(name,value,days) {
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var expires = "; expires="+date.toGMTString();
				}
				else var expires = "";
				document.cookie = name+"="+value+expires+"; path=/";
			},
			displayLanguageSelector: function (){
				$('#lang-box', this.$el).slideDown();
			},
			onLangBoxLeave: function(){
				$('#lang-box', this.$el).slideUp();
			},
			onResize: function(){
				var winW = $(window).width();
				var winH = $(window).height();
				
				// Calculate height of the page content
				$('#container').height(winH - 46);
				// Calculate width of the page content
				$('#container').width(winW);
			}
        });
        return View;
    }
);