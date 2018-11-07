/**
	@class SideMenu
	@desc View that renders the Side Menu of the Invariant
	@extends Backbone.View
*/
define(['text!../templates/sidemenu.tpl', 'i18n!nls/translations', 'backbone'], 
    function(template, Translations){
        var View = Backbone.View.extend({
			template: _.template(template),
			attributes:{
				id: 'side-menu'
			},
			selected: null,
			events: {
                'click ul li': 'changePage',
				'click .listtype': 'toggleParent',
				'click .control:eq(1)': 'contractAll',
				'click .control:eq(2)': 'expandAll'
            },
			/**
				@func initialize
				@desc Constructor for the side menu. Binds events, and initializes the template and options.
			*/
            initialize: function(){
                _.bindAll(this);
				this.menu = this.options.menu;
				this.menu.on('change', this.render);
            },
			/**
				@func render
				@desc Displays the side menu with the correctly selected item
				@returns [View] This view object
			*/
            render: function(){
                this.$el.html(this.template({
                    menu: this.menu,
					trans: Translations
                }));
				return this;
            },
			remove: function(){
				this.menu.off('change');
				Backbone.View.prototype.remove.call(this);
			},
			/**
				@func changePage
				@desc Updates #page with the correct content based on the menu item selected
				@param e [Event] Event object we can get the click target from
			*/
			changePage: function (e) {
				var targetEl = $(e.target);
				var href = targetEl.attr('name');
				Backbone.AppRouter.navigate(href, {trigger:true});
			},
			/**
				@func toggleParent
				@desc Toggles the level3 list elements when a level2 list element is clicked
				@param e [Event] Event object we can get the click target from
			*/
			toggleParent: function (e) {
				var targetEl = $(e.target);
				//Persist the menu state
				var clickedParent = targetEl.attr('id').split('_')[0];
				this.menu.each(function(lvl1){
					lvl1.get('children').each(function(lvl2){
						if(lvl2.get('id') === clickedParent){
							lvl2.set('state', targetEl.next().is(':visible') ? 'closed' : 'open', {silent:true});
						}
					});
				});
				
				targetEl.next().slideToggle();
			},
			contractAll: function(){
				this.menu.each(function(lvl1){
					if(lvl1.get('id') === Backbone.Layout._level1){
						lvl1.get('children').each(function(lvl2){
							lvl2.set('state', 'closed', {silent:true});
						});
					}
				});
				$('.listtype').next('ul').slideUp();
			},
			expandAll: function(){
				this.menu.each(function(lvl1){
					if(lvl1.get('id') === Backbone.Layout._level1){
						lvl1.get('children').each(function(lvl2){
							lvl2.set('state', 'open', {silent:true});
						});
					}
				});
				$('.listtype').next('ul').slideDown();
			}
		});
        return View;
    }
);