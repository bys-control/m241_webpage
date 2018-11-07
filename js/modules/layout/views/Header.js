/**
	@class Header
	@desc View that renders the Header of the Invariant using the config file.
	@extends Backbone.View
*/
define(['config', 'text!../templates/productbanner.tpl', 'text!../templates/toprightmenu.tpl', 'i18n!nls/translations', 'backbone'], 
    function(config, ProductBannerTemplate, TopRightMenuTemplate, Translations){
        var View = Backbone.View.extend({
			productBannerTemplate: _.template(ProductBannerTemplate),
			topRightMenuTemplate: _.template(TopRightMenuTemplate),
			attributes: {
				id: 'header'
			},
			initialize: function(){
				_.bindAll(this);
				
				var self = this;
				$.ajax({
				    type: "POST",
				    url: "/plcExchange/getValues/",
				    data: "S;32;0;104;s;s",
				    success: self.onGetNameSuccess,
				    error: self.onGetNameError
				});
			},
			onGetNameSuccess:function(data, textStatus,jqXHR){
			  //this.$('#maintitle').html(data);
			  var productref = data.substr(0,data.length-1);
			  config.pageTitle=productref;
			},
			onGetNameError:function(data, textStatus,jqXHR){
			  this.$('#maintitle').html("error");
			},
            render: function(){
				this.$el.html(this.productBannerTemplate({
                    config: config,
					trans: Translations
                }));
				this.$el.append(this.topRightMenuTemplate({
					trans: Translations
                }));
				return this;
            }
		});
        return View;
    }
);
