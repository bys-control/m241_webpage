/**
	@class TopMenu
	@desc View that renders the top menu of the Invariant using the config file
	@extends Backbone.View
*/
define(['text!../templates/topmenu.tpl', 'i18n!nls/translations', 'backbone'], 
    function(template, Translations){
        var View = Backbone.View.extend({
			template: _.template(template),
			attributes:{
				id: 'bottom-menu'
			},
			className: 'green-with-inset',
			events: {
				'click div': 'changePage'
            },
			/**
				@func initialize
				@desc Constructor for the top menu. Binds events, and initializes the template, configuration file, translations, and menu collection.
			*/
            initialize: function(){
				_.bindAll(this);
				this.menu = this.options.menu;
				this.menu.on('change', this.render);
            },
			remove: function (){
				this.menu.off('change', this.render);
				this.menu = null;
				// Call the parent class remove method
				Backbone.View.prototype.remove.call(this);
			},
            render: function(level1){
				this.$el.html(this.template({
                    menu: this.menu,
                    trans: Translations
                }));
				return this;
            },
			changePage: function (e){
				var targetEl = $(e.target);
				if(targetEl.attr('name'))
					Backbone.AppRouter.navigate(targetEl.attr('name'), {trigger:true});
			}
		});
        return View;
    }
);
