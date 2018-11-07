/**
	@class MenuItemModel
	@desc Data Model for the side menu items
	@extends Backbone.Model
*/
define(['layoutCollections/MenuItemsCollection', 'backbone'], 
function (MenuItemsCollection) {
    var Model = Backbone.Model.extend({
        defaults: {
            id: 'diagnostics',
			name: 'Diagnostics',
			url: '#diagnostics',
			image: '',
			isSelected: false,
			state: 'open',
			children: new MenuItemsCollection()
        }
    });
    
    return Model;
});