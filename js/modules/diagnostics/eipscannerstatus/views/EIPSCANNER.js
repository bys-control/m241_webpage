/**
	@class Scanner
	@desc View that renders the Scanner Status page
	@extends Backbone.View
*/
define(['text!../templates/eipscanner.tpl', 'models/DiagDataModel', 'i18n!nls/translations', 'backbone'],
	function(template, DiagDataModel, Translations){
		'use strict';
		var View = Backbone.View.extend({
			template: _.template(template),
			className: 'scanner wrapper',
			events: {
				'click .devCell' : 'goToIp',
				'click .up' : 'scrollUp',
				'click .down' : 'scrollDown'
			},
			/**
				@func initialize
				@desc Constructor for the Scanner Status page. Binds events and initializes the template.
			*/
			initialize: function(){
				_.bindAll(this);
				this.dataModel = new DiagDataModel({url: '/rest/diagnostic/geteipioscannerdata'});
				this.listenTo(this.dataModel, 'change', this.updateDataPoints);
				this.dataModel.fetch({success: this.generateView, silent: true});
				/* ggo */
				this.dataModel.startPolling();
			},
			generateView: function(model, resp){
				this.$el.html(this.template({
					scannerDataModel : resp,
					trans: Translations
				}));
				this.$('td').tooltip({
					items: 'td',
					track: true
				});
				this.numRows = Math.ceil(resp.maxConnections / 16);
				this.maxTopMargin = Math.ceil(this.numRows / 4) === 1 ? -15 : (Math.ceil(this.numRows / 4) - 1) * - 208 + 15;
				this.topMargin = -15;
				this.updateDataPoints();
				this.dataModel.startPolling();
				return this;
			},
			render: function(){
				this.$el.html(this.template({
					scannerDataModel: this.dataModel,
					trans: Translations
				}));
				return this;
			},
			remove: function(){
				this.dataModel.off('change');
				this.dataModel.stopPolling();
				this.dataModel = null;
				// Clean up events for tooltip(s)
				this.$('td').tooltip('destroy');
				Backbone.View.prototype.remove.call(this);
			},
			updateDataPoints: function(){
				var attrs = this.dataModel.attributes;

				for(var attr in attrs){
					if(attr === 'serviceStatus'){
						this.$('[data-model-binding="' + attr + '"]')
							.html(this.formatServiceStatus(attrs[attr]));
					}else if(attr === 'devices'){
						var cells = this.$('.devCell');
						var devices = attrs.devices;
						if(parseInt(attrs.maxConnections, 10) > 0){
							for (var c = 0; c < devices.length; c++){
                                if(devices[c]){
								    this.updateCell(
                                        $(cells[devices[c].deviceNumber-257]),
                                        devices[c].deviceHealth,
                                        devices[c].deviceStatus,
                                        devices[c].deviceIp,
                                        devices[c].deviceType
                                    );
                                }
							}
						}
					}else{
						this.$('[data-model-binding="' + attr + '"]')
							.html(attrs[attr]);
					}
				}
			},
			updateCell: function($device, deviceHealth, deviceStatus, ip, type){
				var status;
				switch(deviceStatus){
                    case 0:
                        status = '';
                    break;
                    case 1:
                        status = 'scan';
                    break;
                    case 2:
                        status = 'unscan';
                    break;
                    case 3:
                        status = 'fault';
                    break;
                    default:
                        throw 'Unknown device status';
                    break;
                }

				if(status !== ''){
					$device.removeClass().addClass('devCell ss-' + status)
						.attr('data-ip', ip)
						.tooltip('option', 'content', '<strong>Health: </strong>' +
							this.getHealth(deviceHealth) +
							'<br><strong>IP:</strong> ' +
							ip +
							'<br><strong>Type:</strong> ' +
							this.getType(type)
						);
				}
			},
			getHealth: function(health){
				return health === 1 ? 'OK' : 'NOK';
			},
			getType: function(type){
				return type === 1 ? 'EIP' : 'Modbus TCP';
			},
			goToIp: function(e){
				var target = $(e.target).attr('data-ip');
				if(typeof(target) !== 'undefined')
					window.open('http://' + target, '_blank');
			},
			/**
				@func formatServiceStatus
				@desc Formats the service status icon and text
				@param val [int] Integer value that determines what the service status will look like on this page.
				@returns [String] 'Faulty' (0) or 'Enabled' (1)
			*/
			formatServiceStatus: function(val){
				switch(val){
				    case 0:
					case 1: // Idle
						this.$('[data-img="serviceStatus"]').attr('src', 'images/idle.png');
						this.$('[data-model-binding="serviceStatus"]').removeClass().addClass('status-unknown');
						return Translations.Idle;
					case 2: // Operational
						this.$('[data-img="serviceStatus"]').attr('src', 'images/ok.png');
						this.$('[data-model-binding="serviceStatus"]').removeClass().addClass('status-ok');
						return Translations.Operational;
					case 3: // Stopped
						this.$('[data-img="serviceStatus"]').attr('src', 'images/ok.png');
						this.$('[data-model-binding="serviceStatus"]').removeClass().addClass('status-error');
						return Translations.Stopped;
					default: // Unknown
						this.$('[data-img="serviceStatus"]').attr('src', 'images/unknown.png');
						this.$('[data-model-binding="serviceStatus"]').removeClass().addClass('status-unknown');
						return Translations.Unknown;
				}
			},
			scrollDown: function(){
				if (this.topMargin > this.maxTopMargin){
					this.topMargin = this.topMargin - 208;
					this.$('table.devTable').animate({'margin-top':this.topMargin.toString() + 'px'});
				}
			},
			scrollUp: function(){
				if (this.topMargin < -15){
					this.topMargin = this.topMargin + 208;
					this.$('table.devTable').animate({'margin-top':this.topMargin.toString() + 'px'});
				}
			}
		});
		return View;
	}
);
