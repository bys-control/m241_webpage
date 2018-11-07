/**
	@class MenuItemsCollection
	@desc A collection that consists of Menu items for the side menu
	@extends Backbone.Collection
*/
define(['layoutModels/MenuItemModel', 'backbone'], 
function (MenuItemModel) {
    var Collection = Backbone.Collection.extend({
		initialize: function (models, options){
			Backbone.Collection.prototype.initialize.call(this, models, options);
            _.bindAll(this);
		},
		model: MenuItemModel,
		/**
			@func updateSelection
			@desc Updates which list item in the left menu has the isSelected class
			@param level1 First level menu item (Diagnostics, Monitoring, Setup)
			@param level2 Second level menu item (Module, Services, etc.)
			@param level3 Third level menu item (Summary, NTP, etc.)
		*/
		updateSelection: function (level1, level2, level3){
			this.each(function(modelLevel1){
				if(modelLevel1.get('id') === level1) {
					modelLevel1.set('isSelected', true, {silent: true});
				}
				else {
					modelLevel1.set('isSelected', false, {silent: true});
				}
				modelLevel1.get('children').each(function(modelLevel2){
					if(modelLevel2.get('id') === level2) {
						modelLevel2.set('isSelected', true, {silent: true});
					}
					else {
						modelLevel2.set('isSelected', false, {silent: true});
					}
					modelLevel2.get('children').each(function(modelLevel3){
						if(modelLevel3.get('id') === level3) {
							modelLevel3.set('isSelected', true, {silent: true});
						}
						else {
							modelLevel3.set('isSelected', false, {silent: true});
						}
					});
				});
			});
			this.trigger('change');
		}
	});
    return Collection;
});