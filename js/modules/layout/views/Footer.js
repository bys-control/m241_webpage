/**
	@class Footer
	@desc View that renders the Footer of the Invariant using the config file
	@extends Backbone.View
*/
define(['config', 'text!../templates/footer.tpl', 'backbone'], 
function (config, template) {
    var View = Backbone.View.extend({
		template: _.template(template),
		// El defaults to div
		attributes: {
			id: 'footer'
		},
        render: function () {
            this.$el.html(this.template({
                config: config
            }));
            return this;
        }
    });
    return View;
});