/**
	@class DiagDataModel
	@desc Data Model for basic diagnostics pages
	@extends Backbone.Model
*/
define(['config', 'backbone'],
    function(config){
		'use strict';
        var Model = Backbone.Model.extend({
            url: null,
			interval: null,
			eventName: null,
			pageRef: null,
			isPolling: false,
			/**
				@func initialize
				@desc Constructor for the data model on the QoS page. Initializes all data on page load.
			*/
			initialize: function (options) {
				_.bindAll(this);
				this.url = options.url;
				this.eventName = options.eventName || null;
				this.pageRef = options.pageRef || null;
				if(options.defaults){
					for(var  d in options.defaults){
						this.set(d, options.defaults[d], {silent: true});
					}
				}
			},
			onSuccess: function(data){
				Backbone.Layout.trigger('errorCleared');
				if(this.eventName){
					this.trigger(this.eventName, data);
				}
			},
			onError: function(){
				//We don't want to stop polling here in case the connection returns
				//Let the view worry about stopping the poller
				Backbone.Layout.trigger('errorFired');
			},
			startPolling: function(){
				if(!this.isPolling){
					var self = this;
					this.interval = window.setInterval(
						self.getData,
						config.diagnosticPollingInterval
					);
					this.isPolling = true;
				}
			},
			stopPolling: function(){
				var self = this;
				if(this.isPolling && this.interval){
					window.clearInterval(self.interval);
					this.interval = null;
					this.isPolling = false;
				}
			},
			getData: function(){
				this.fetch({success: this.onSuccess, error: this.onError, timeout: 2000});
			},
			parse: function(data){
				if(this.pageRef === 'rstp'){
					return this.parseRSTPData(data);
				}else if(this.pageRef === 'messaging'){
					return this.parseMessagingData(data);
				}else if(this.pageRef === 'portstats'){
					return this.parsePortStatsData(data);
				}
				return data;
			},
			//Special parser for RSTP data
			parseRSTPData: function(data){
				var rstpPortCollection = new Backbone.Collection();
				$.each(data.ports, function(index, portData){
					rstpPortCollection.add( new Backbone.Model(portData) );
				});
								
				var result = {
					serviceStatus: data.serviceStatus,
					lastTopologyChange: data.lastTopologyChange,
					bridgeId: data.bridgeId,
					bridgePriority: data.bridgePriority,
					rstpPortCollection: rstpPortCollection
				};
				
				return result;
			},
			//Special parser for Messaging data
			parseMessagingData: function(data){
				var connectionCollection = new Backbone.Collection();
				$.each(data.connections, function(index, connectionData){
					connectionCollection.add( new Backbone.Model(connectionData) );
				});
								
				var result = {
					messagesSent: data.messagesSent,
					messagesReceived: data.messagesReceived,
					successRate: data.successRate,
					connectionCollection: connectionCollection
				};
				
				return result;
			},
			//Special parser for Port Statistics
			parsePortStatsData: function(data){
				var portCollection = new Backbone.Collection();
				for(var p = 0; p < data.length; p++){
					portCollection.add( new Backbone.Model(data[p]));
				}
				return portCollection;
			},
			resetCounters: function(url, successEvent, failEvent){
				var self = this;
				$.ajax({
					url: url,
					type: 'GET',
					success: function(){
						self.trigger(successEvent, null, null, true);
					},
					error: function(jqXHR, textStatus, errorThrown){
						self.trigger(failEvent, jqXHR, textStatus, errorThrown);
					}
				});
			}
		});
        return Model;
    }
);