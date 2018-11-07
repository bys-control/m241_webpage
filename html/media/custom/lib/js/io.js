Ext.BLANK_IMAGE_URL = '../../../media/custom/lib/images/s.gif';

function main() {
    var fm = Ext.form;
    var timer;
    var period = "1000";
    var requestPending;
    var IOGlobal = "IoConfig_Globals_Mapping.";
    var listID;
    var MAX_IO = 20;
    var ioOffset = 0;
    var requestPending;
    var formatStore = new Ext.data.SimpleStore({
        fields: ['format', 'formatID']
    });
    var formatComboBox = new Ext.form.ComboBox({
        store: formatStore,
        displayField: 'format',
        triggerAction: 'all',
        editable: false,
        forceSelection: true,
        mode: 'local'
    });
    var typeStore = new Ext.data.SimpleStore({
        fields: ['type', 'typeID', 'defaultFormatID']
    });
    var ioVar = Ext.data.Record.create([{
        name: 'mapping',
        type: 'string'
    }, {
        name: 'address',
        type: 'string'
    }, {
        name: 'format',
        type: 'string'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'value',
        type: 'string'
    }, {
        name: 'info',
        type: 'string'
    }, {
        name: 'formatID'
    }, {
        name: 'typeID'
    }]);
    var ioStore = new Ext.data.SimpleStore({
        fields: ['mapping', 'address', 'format', 'type', 'value', 'info', 'formatID', 'typeID']
    });
    var ioGridCM = new Ext.grid.ColumnModel([{
        header: lang.mapping,
        dataIndex: 'mapping',
        width: 100,
        menuDisabled: true,
        editable: false
    }, {
        header: lang.address,
        dataIndex: 'address',
        width: 100,
        menuDisabled: true,
        editable: false
    }, {
        header: lang.type,
        dataIndex: 'type',
        width: 100,
        menuDisabled: true,
        editable: false
    }, {
        header: lang.format,
        dataIndex: 'format',
        width: 100,
        menuDisabled: true,
        editor: formatComboBox
    }, {
        header: lang.value,
        dataIndex: 'value',
        width: 100,
        menuDisabled: true,
        editor: new fm.TextField()
    }]);
    var ioGrid = new Ext.grid.EditorGridPanel({
        store: ioStore,
        cm: ioGridCM,
        baseCls: 'x-plain',
        autoHeight: true,
        stripeRows: true,
        baseCls: 'x-plain',
        clicksToEdit: 2,
        listeners: {
            afteredit: function (e) {
                if (e.column == 3) editIoFormat(e);
                else if (e.column == 4) {}
            },
            beforeedit: function (e) {
                if (e.column == 4) {}
            }
        }
    });
    var refreshB = new Ext.Button({
        text: lang.refresh,
        icon: '../../../media/custom/lib/images/refresh.png',
        iconCls: ' ',
        enableToggle: true,
        handler: startstop
    });
    var previousB = new Ext.Button({
        text: '<<',
        handler: previousIO
    });
    var nextB = new Ext.Button({
        text: '>>',
        handler: nextIO
    });
    var periodTextfield = new Ext.form.TextField({
        value: period,
        width: 40
    });
    var periodUnit = new Ext.form.Label({
        text: ' ms '
    });
    var iolabel = new Ext.form.Label({
        autoWidth: true,
        text: ''
    });
    var ioPanel = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        layout: 'table',
        items: [refreshB, periodTextfield, periodUnit, previousB, iolabel, nextB]
    });
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'north',
            height: 25,
            items: ioPanel
        }, {
            region: 'center',
            layout: 'fit',
            autoScroll: true,
            items: ioGrid
        }]
    });

    function findRecord(store, field, value) {
        var i = 0;
        var record;
        while ((i = store.find(field, value, i)) != -1) {
            record = store.getAt(i);
            if (record.get(field) == value) return record;
            i++;
        }
        return null;
    }

    function getType(typeID) {
        var t = findRecord(typeStore, "typeID", typeID);
        return t.data.type;
    }

    function getFormat(formatID) {
        var f = findRecord(formatStore, "formatID", formatID);
        return f.data.format;
    }

    function getDefaultFormatID(typeID) {
        var f = findRecord(typeStore, "typeID", typeID);
        return f.data.defaultFormatID;
    }

    function editIoFormat(e) {
        e.record.data.format = e.value;
        e.record.data.formatID = findRecord(formatStore, "format", e.value).data.formatID;
        e.record.data.value = '';
        e.record.commit();
        if (refreshB.pressed) {
            buildIORequest();
        }
    }

    function GetIONumbit(address) {
        var indexAdr = address.indexOf('.');
        var numBit = address.substring(indexAdr + 1);
        return numBit;
    }

    function IsIOBit(address) {
        var isIObit = ((address.substring(0, 3) == "%QX") || (address.substring(0, 3) == "%IX"));
        return isIObit;
    }

    function loadIO() {
        var i;
        var name = "";
        var ioMapping = "";
        var ioAddress = "";
        var bracketPos = 0;
        var count = 0;
        var pos = 0;
        ioStore.removeAll();
        for (i = 0; i < availableVariables.length; i++) {
            name = availableVariables[i][0];
            if (name.substr(0, IOGlobal.length) == IOGlobal) {
                if (pos >= ioOffset && count < MAX_IO) {
                    bracketPos = name.indexOf('(');
                    ioMapping = name.substr(IOGlobal.length, bracketPos - IOGlobal.length - 1);
                    ioAddress = name.substr(bracketPos + 1, name.length - 2 - bracketPos);
                    var io = new ioVar({
                        mapping: ioMapping,
                        address: ioAddress,
                        formatID: getDefaultFormatID(availableVariables[i][1]),
                        format: getFormat(getDefaultFormatID(availableVariables[i][1])),
                        typeID: availableVariables[i][1],
                        type: getType(availableVariables[i][1]),
                        info: availableVariables[i][2],
                        value: ''
                    });
                    ioStore.add(io);
                    count++;
                }
                pos++;
            }
        }
        if (pos <= MAX_IO) {
            iolabel.setVisible(false);
            previousB.setVisible(false);
            nextB.setVisible(false);
        } else {
            iolabel.setVisible(true);
            previousB.setVisible(true);
            nextB.setVisible(true);
        }
        iolabel.setText((ioOffset + 1) + ' - ' + (ioOffset + count) + ' of ' + pos);
        if (ioOffset == 0) previousB.setDisabled(true);
        else previousB.setDisabled(false);
        if ((ioOffset + count) == pos) nextB.setDisabled(true);
        else nextB.setDisabled(false);
    }

    function buildIORequest() {
        var i;
        var x;
        var isIObit = false;
        var request = '';
        for (i = 0; i < ioStore.getCount(); i++) {
            x = ioStore.getAt(i);
            if (IsIOBit(x.data.address)) request += x.data.info + ';' + 'B' + ';' + 'd' + ';';
            else request += x.data.info + ';' + x.data.typeID + ';' + x.data.formatID + ';';
        }
        listID = buildList(request);
    }

    function startstop() {
        if (refreshB.pressed) {
            buildIORequest();
            refreshIO();
            requestPending = false;
            timer = setInterval(refreshIO, periodTextfield.getValue());
        } else {
            clearTimeout(timer);
        }
    }

    function refreshIO() {
        if (requestPending == false) {
            requestPending = true;
            var xhrRequest = createXMLHttpRequest();
            xhrRequest.onreadystatechange = function () {
                if (xhrRequest.readyState == 4) {
                    if (xhrRequest.status == 200) {
                        var newValue = new Array();
                        newValue = xhrRequest.responseText.split(';');
                        ioGrid.suspendEvents();
                        ioGrid.hide();
                        valIndex = 0;
                        for (index = 0; index < ioStore.getCount(); index++) {
                            v = ioStore.getAt(index);
                            if (v.data.info != 0) {
                                if (v.data.typeID == 's') v.data.value = unescape(newValue[valIndex++]);
                                else {
                                    if (IsIOBit(v.data.address)) {
                                        var numbit = GetIONumbit(v.data.address);
                                        var rangbit = 1 << numbit;
                                        var nVal = parseInt(newValue[valIndex++]);
                                        var bitValue = (nVal & rangbit);
                                        if (bitValue) v.data.value = 'true';
                                        else v.data.value = 'false';
                                    } else {
                                        v.data.value = newValue[valIndex++];
                                    }
                                }
                                v.commit();
                            }
                        }
                        ioGrid.resumeEvents();
                        ioGrid.show();
                    }
                    requestPending = false;
                }
            };
            xhrRequest.open("GET", "/plcExchange/getDataList/", true);
            xhrRequest.setRequestHeader('ListID', listID);
            xhrRequest.setRequestHeader('GUID_A', GUID['A']);
            try {
                xhrRequest.send(null);
            } catch (e) {
                Ext.Msg.alert("M241/51", "Communication error");
                clearTimeout(timer);
                return;
            }
        }
    }

    function previousIO() {
        ioOffset -= MAX_IO;
        loadIO();
        if (refreshB.pressed) {
            buildIORequest();
        }
    }

    function nextIO() {
        ioOffset += MAX_IO;
        loadIO();
        if (refreshB.pressed) {
            buildIORequest();
        }
    }
    formatStore.loadData(availableFormats);
    typeStore.loadData(availableTypes);
    loadIO();
};