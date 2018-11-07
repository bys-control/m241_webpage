Ext.BLANK_IMAGE_URL = '../../../media/custom/lib/images/s.gif';

function main() {
    var d1 = [];
    var d2 = [];
    var nbItems = 50;
    var plotFunction;
    var itemsIsIObit = new Array(2);
    var items = new Array(2);
    var date = new Date();
    var current = new Date();
    var currentTime = 0.0;
    var ListID = 0;
    var period = 1.0;
    var timer;
    var request;
    var filePath = '/usr/Web/savedOscilloscope.cfg';
    var options = {
        xaxis: {
            mode: "time",
            timeformat: "%H:%M:%S"
        },
        yaxis: {},
        y2axis: {},
        lines: {
            show: true
        },
        points: {
            show: true
        },
        selection: {
            mode: "xy"
        },
        grid: {
            hoverable: true
        },
        legend: {
            show: true,
            position: "ne",
            margin: 2,
            backgroundOpacity: 0.5
        }
    };
    var availableVariableStore = new Ext.data.SimpleStore({
        fields: ['name', 'typeID', 'info']
    });
    var availableVariableComboBox0 = new Ext.form.ComboBox({
        store: availableVariableStore,
        displayField: 'name',
        triggerAction: 'all',
        editable: true,
        forceSelection: true,
        mode: 'local',
        initList: function () {
            this.constructor.prototype.initList.apply(this, arguments);
            this.list.setWidth('auto');
            this.innerList.setWidth('auto');
        }
    });
    var availableVariableComboBox1 = new Ext.form.ComboBox({
        store: availableVariableStore,
        displayField: 'name',
        triggerAction: 'all',
        editable: true,
        forceSelection: true,
        mode: 'local',
        initList: function () {
            this.constructor.prototype.initList.apply(this, arguments);
            this.list.setWidth('auto');
            this.innerList.setWidth('auto');
        }
    });
    var refreshButton = new Ext.Button({
        text: lang.refresh,
        icon: '../../../media/custom/lib/images/refresh.png',
        iconCls: ' ',
        enableToggle: true,
        handler: StartStop
    });
    var periodTextfield = new Ext.form.TextField({
        value: period,
        width: 40,
        listeners: {
            change: function (txt, newValue, oldValue) {
                if (parseFloat(newValue) < 1) {
                    Ext.Msg.alert("M241/51", "Refresh period too small");
                    txt.setValue(oldValue);
                } else {
                    txt.setValue(newValue);
                }
            }
        }
    })
    var ymin0Textfield = new Ext.form.TextField({
        width: 80
    })
    var ymax0Textfield = new Ext.form.TextField({
        width: 80
    })
    var ymin1Textfield = new Ext.form.TextField({
        width: 80
    })
    var ymax1Textfield = new Ext.form.TextField({
        width: 80
    })
    var d1Textfield = new Ext.form.TextField({
        width: 40
    })
    var d2Textfield = new Ext.form.TextField({
        width: 40
    })
    var panel = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        layout: 'table',
        layoutConfig: {
            columns: 9
        },
        items: [{
            layout: 'table',
            baseCls: 'x-plain',
            layoutConfig: {
                columns: 2
            },
            items: [{
                xtype: 'button',
                text: lang.reset,
                handler: Reset
            }, {
                xtype: 'container',
                autoEl: {},
                items: refreshButton
            }]
        }, {
            xtype: 'label',
            text: 'Item0:',
            style: 'text-align: right; padding:0 0 0 5px'
        }, {
            xtype: 'container',
            autoEl: {},
            items: availableVariableComboBox0
        }, {
            xtype: 'label',
            text: 'min:',
            style: 'text-align: right; padding:0 0 0 5px'
        }, {
            xtype: 'container',
            autoEl: {},
            items: ymin0Textfield
        }, {
            xtype: 'label',
            text: 'max:',
            style: 'text-align: right; padding:0 0 0 5px'
        }, {
            xtype: 'container',
            autoEl: {},
            items: ymax0Textfield
        }, {
            xtype: 'label',
            text: 'period (s):',
            rowspan: 2,
            style: 'padding:0 0 0 5px'
        }, {
            xtype: 'container',
            autoEl: {},
            rowspan: 2,
            items: periodTextfield
        }, {
            layout: 'table',
            baseCls: 'x-plain',
            layoutConfig: {
                columns: 2
            },
            items: [{
                xtype: 'button',
                text: lang.load,
                icon: '../../../media/custom/lib/images/load.png',
                iconCls: ' ',
                handler: load
            }, {
                xtype: 'button',
                text: lang.save,
                icon: '../../../media/custom/lib/images/save.png',
                iconCls: ' ',
                handler: save
            }]
        }, {
            xtype: 'label',
            text: 'Item1:',
            style: 'text-align: right; padding:0 0 0 5px'
        }, {
            xtype: 'container',
            autoEl: {},
            items: availableVariableComboBox1
        }, {
            xtype: 'label',
            text: 'min:',
            style: 'text-align: right; padding:0 0 0 5px'
        }, {
            xtype: 'container',
            autoEl: {},
            items: ymin1Textfield
        }, {
            xtype: 'label',
            text: 'max:',
            style: 'text-align: right; padding:0 0 0 5px'
        }, {
            xtype: 'container',
            autoEl: {},
            items: ymax1Textfield
        }]
    });
    var chart = new Ext.Panel({
        baseCls: 'x-plain',
        id: 'dataChart',
        width: 100,
        height: 100
    });
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'north',
            height: 50,
            items: panel
        }, {
            region: 'center',
            layout: 'fit',
            id: 'dataChartRegion',
            items: chart
        }],
        onResize: function () {}
    });

    function GetIONumbit(address) {
        var indexAdr = address.indexOf('.');
        var numBit = address.substring(indexAdr + 1);
        return numBit;
    }

    function IsIOBit(address) {
        var isIObit = ((address.substring(0, 3) == "%QX") || (address.substring(0, 3) == "%IX"));
        return isIObit;
    }

    function StartStop() {
        if (refreshButton.pressed == true) {
            var y1min = parseFloat(ymin0Textfield.getValue());
            var y1max = parseFloat(ymax0Textfield.getValue());
            if (y1min >= y1max) {
                Ext.Msg.alert("M241/51", "Error Item0  min >= max (" + y1min + " >= " + y1max + ")");
                refreshButton.toggle();
                return;
            }
            var y2min = parseFloat(ymin1Textfield.getValue());
            var y2max = parseFloat(ymax1Textfield.getValue());
            if (y2min >= y2max) {
                Ext.Msg.alert("M241/51", "Error Item0  min >= max (" + y2min + " >= " + y2max + ")");
                refreshButton.toggle();
                return;
            }
            availableVariableComboBox0.setDisabled(true);
            availableVariableComboBox1.setDisabled(true);
            periodTextfield.setDisabled(true);
            ymin0Textfield.setDisabled(true);
            ymax0Textfield.setDisabled(true);
            ymin1Textfield.setDisabled(true);
            ymax1Textfield.setDisabled(true);
            items[0] = availableVariableComboBox0.getValue();
            items[1] = availableVariableComboBox1.getValue();
            var request = '';
            for (var i = 0; i < items.length; i++) {
                var index = getVariableIndex(availableVariables, items[i])
                if (index != -1) {
                    var bracketPos = availableVariables[index][0].indexOf('(');
                    var ioAddress = availableVariables[index][0].substr(bracketPos + 1, availableVariables[index][0].length - 2 - bracketPos);
                    if (IsIOBit(ioAddress)) {
                        request += availableVariables[index][2] + ';' + 'B' + ';' + 'd' + ';';
                        itemsIsIObit[i] = true;
                    } else {
                        request += availableVariables[index][2] + ';' + availableVariables[index][1] + ';' + getDefaultFormatID(availableVariables[index][1]) + ';';
                        itemsIsIObit[i] = false;
                    }
                } else request += '-;'
            }
            ListID = 0;
            var xhr = createXMLHttpRequest();
            xhr.open("POST", "/plcExchange/buildList/", false);
            xhr.setRequestHeader("Content-length", request.length);
            try {
                xhr.send(request);
            } catch (e) {
                Ext.Msg.alert("M241/51", "Communication error");
                refreshButton.toggle();
                return;
            }
            if (xhr.readyState == 4 && xhr.status == 200) {
                ListID = xhr.responseText;
                Reset();
                Refresh();
                timer = setInterval(Refresh, period * 1000);
            } else if(xhr.status == 406) {
				alert('You have been idle for 20 minutes. You will be redirected to the login page.');
				window.top.location.replace('/login.htm');
			}
        } else {
            clearTimeout(timer);
            availableVariableComboBox0.setDisabled(false);
            availableVariableComboBox1.setDisabled(false);
            periodTextfield.setDisabled(false);
            ymin0Textfield.setDisabled(false);
            ymax0Textfield.setDisabled(false);
            ymin1Textfield.setDisabled(false);
            ymax1Textfield.setDisabled(false);
        }
    }

    function Reset() {
        period = parseFloat(periodTextfield.getValue());
        d1 = new Array();
        d2 = new Array();
        date = new Date();
        options.xaxis.min = date.getTime() - (60000 * date.getTimezoneOffset());
        options.xaxis.max = options.xaxis.min + (1000 * period * nbItems);
        var ymin = parseFloat(ymin0Textfield.getValue());
        var ymax = parseFloat(ymax0Textfield.getValue());
        var y2min = parseFloat(ymin1Textfield.getValue());
        var y2max = parseFloat(ymax1Textfield.getValue());
        if (isNaN(ymin) || isNaN(ymax)) {
            options.yaxis.min = null;
            options.yaxis.max = null;
        } else {
            options.yaxis.min = ymin;
            options.yaxis.max = ymax;
        }
        if (isNaN(y2min) || isNaN(y2max)) {
            options.y2axis.min = null;
            options.y2axis.max = null;
        } else {
            options.y2axis.min = y2min;
            options.y2axis.max = y2max;
        }
        currentTime = options.xaxis.min;
    }

    function CalculIOBitValue(valueName, val) {
        var bracketPos = valueName.indexOf('(');
        var ioAddress = valueName.substr(bracketPos + 1, valueName.length - 2 - bracketPos);
        var numBitID = GetIONumbit(ioAddress);
        var rangbit = 1 << numBitID;
        var nVal = (val & rangbit);
        if (nVal != 0) return 1;
        else return 0;
    }

    function Refresh() {
        var xhr = createXMLHttpRequest();
        xhr.open("GET", "/plcExchange/getDataList/", false);
        xhr.setRequestHeader('ListID', ListID);
        xhr.setRequestHeader('GUID_A', GUID['A']);
        try {
            xhr.send(null);
        } catch (e) {
            Ext.Msg.alert("M241/51", "Communication error");
            refreshButton.toggle();
            clearTimeout(timer);
            return;
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            var newValue = new Array();
            newValue = xhr.responseText.split(';');
            date = new Date();
            currentTime = date.getTime() - (60000 * date.getTimezoneOffset());
            if ((availableVariableComboBox0.getValue()=="")&& (availableVariableComboBox1.getValue()!="")){
            if (itemsIsIObit[1] == true) {
                d2.push([currentTime, CalculIOBitValue(items[1], parseInt(newValue[0]))]);
              } else {
                d2.push([currentTime, newValue[0]]);
             }
            }
            else{
            if (availableVariableComboBox0.getValue()!=""){
              if (itemsIsIObit[0] == true) {
                d1.push([currentTime, CalculIOBitValue(items[0], parseInt(newValue[0]))]);
              } else {
                d1.push([currentTime, newValue[0]]);
              }
            }
            if (availableVariableComboBox1.getValue()!=""){
              if (itemsIsIObit[1] == true) {
                d2.push([currentTime, CalculIOBitValue(items[1], parseInt(newValue[1]))]);
              } else {
                d2.push([currentTime, newValue[1]]);
             }
            }
           }
        }
        if (currentTime >= options.xaxis.max) {
            options.xaxis.max = currentTime;
            options.xaxis.min = options.xaxis.max - (1000 * period * nbItems);
            while (d1[0][0] < options.xaxis.min) {
                d1.shift();
                d2.shift();
            }
        }
        plotFunction = $.plot($("#dataChart"), [{
            data: d1,
            label: items[0]
        }, {
            data: d2,
            label: items[1],
            yaxis: 2
        }], options);
    }

    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }
    var previousPoint = null;
    $("#dataChart").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.datapoint) {
                previousPoint = item.datapoint;
                $("#tooltip").remove();
                var x = item.datapoint[0],
                    y = item.datapoint[1];
                showTooltip(item.pageX, item.pageY, item.series.label + " = " + y);
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });

    function load() {
        Ext.Ajax.request({
            url: '/plcExchange/load/',
            method: 'GET',
            headers: {
                'FilePath': filePath
            },
            success: function (result, request) {
                try {
                    eval(result.responseText);
                    availableVariableComboBox0.setValue(oscilloCfg.item0);
                    availableVariableComboBox1.setValue(oscilloCfg.item1);
                    ymin0Textfield.setValue(oscilloCfg.ymin0);
                    ymax0Textfield.setValue(oscilloCfg.ymax0);
                    ymin1Textfield.setValue(oscilloCfg.ymin1);
                    ymax1Textfield.setValue(oscilloCfg.ymax1);
                    periodTextfield.setValue(oscilloCfg.period);
                } catch (error) {
                    Ext.Msg.alert("M241/51", lang.paramNotLoaded);
                }
            },
            failure: function (result, request) {
                Ext.Msg.alert("M241/51", lang.paramNotLoaded);
            }
        });
    }

    function save() {
        data = 'var oscilloCfg = {\n';
        data += 'item0: "' + availableVariableComboBox0.getValue() + '",\n';
        data += 'item1: "' + availableVariableComboBox1.getValue() + '",\n';
        data += 'ymin0: "' + ymin0Textfield.getValue() + '",\n';
        data += 'ymax0: "' + ymax0Textfield.getValue() + '",\n';
        data += 'ymin1: "' + ymin1Textfield.getValue() + '",\n';
        data += 'ymax1: "' + ymax1Textfield.getValue() + '",\n';
        data += 'period: "' + periodTextfield.getValue() + '"\n';
        data += '}\n;'
        Ext.Ajax.request({
            url: '/plcExchange/save/',
            method: 'POST',
            headers: {
                'FilePath': filePath
            },
            params: data,
            success: function (result, request) {
                Ext.Msg.alert("M241/51", lang.paramSaved);
            },
            failure: function (result, request) {
                Ext.Msg.alert("M241/51", lang.paramNotSaved);
            }
        });
    }
    availableVariableStore.loadData(availableVariables);
    Reset();
};