define(['text!../templates/custom.tpl', 'i18n!nls/translations', 'backbone'],
function(CustomTemplate, Translations){
	var View = Backbone.View.extend({
		className: 'wrapper custom',
		template: _.template(CustomTemplate),
		initialize: function(options){
			_.bindAll(this);
			this.pageUrl = options.info.pageUrl;
			this.pageTitle = options.info.pageTitle
		},
		render: function(){
			this.$el.html(this.template({
				pageUrl: this.pageUrl,
				pageTitle: this.pageTitle,
				trans: Translations
			}));
			return this;
		}
	});
	return View;
});