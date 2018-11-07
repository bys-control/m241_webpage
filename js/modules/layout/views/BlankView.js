/**
	@class BlankView
	@desc View that renders a placeholder
	@extends Backbone.View
*/
define(['text!html/blank.html', 'backbone'], 
function (HTMLFile) {
    var View = Backbone.View.extend({
		initialize: function(){
			_.bindAll(this);
		},
        render: function () {
			this.$el.html(HTMLFile);
            return this;
        }
    });
    return View;
});