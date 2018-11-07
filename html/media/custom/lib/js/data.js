/*
 * Ext JS Library 2.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */
Ext.BLANK_IMAGE_URL = '../../../media/custom/lib/images/s.gif';

function main(){
    // shorthand alias
    var currentList;
    var fm = Ext.form;
    var MAX_LIST = 10;
    var MAX_VARIABLE = 20;
    var allowRefresh = true;
    var request = '';
    var timer;
    var filePath = '/usr/Web/savedDataParameters.cfg';
    var requestPending;
    ///////////////////////////////////////////////////////////////////////////////////
    // The supported formats store and the combo box used to display them
    ///////////////////////////////////////////////////////////////////////////////////
    
    //Simple store with all supported formats
    var formatStore = new Ext.data.SimpleStore({
        fields: ['format', 'formatID']
    });
    
    //Combo box with all supported formats
    var formatComboBox = new Ext.form.ComboBox({
        store: formatStore,
        displayField: 'format',
        triggerAction: 'all',
        editable: false,
        forceSelection: true,
        mode: 'local'
    });
    
    //Simple store with all supported types
    var typeStore = new Ext.data.SimpleStore({
        fields: ['type', 'typeID', 'defaultFormatID']
    });
    
    ///////////////////////////////////////////////////////////////////////////////////
    // The store which manage all availables variables provided by the PLC
    // The combo box used to display them
    // The store is filled with an external files availableVariables.js provided by
    //     the server
    ///////////////////////////////////////////////////////////////////////////////////
    
    //Simple store with all available variables provided by the PLC
    var availableVariableStore = new Ext.data.SimpleStore({
        fields: ['name', 'typeID', 'info', 'ioAddress']
    });
    
    //Combo box with all available variables
    var availableVariableComboBox = new Ext.form.ComboBox({
        store: availableVariableStore,
        displayField: 'name',
        triggerAction: 'all',
        editable: true,
        forceSelection: true,
        mode: 'local',
		initList: function(){
			this.constructor.prototype.initList.apply(this, arguments);
			this.list.setWidth('auto');
			this.innerList.setWidth('auto');
		}
    });
    
    ///////////////////////////////////////////////////////////////////////////////////
    // The store which manage currently displayed variables of the currently selected list
    // The column model used to display these variables
    // The toolbar of the grid used to display these variables
    // And then the Grid itself
    ///////////////////////////////////////////////////////////////////////////////////
    
    //This type is used to manage variables currently displayed in the grid
    var displayVariable = Ext.data.Record.create([{
        name: 'name', //The name of the variable
        type: 'string'
    }, {
        name: 'format', //The requested format to display the variable
        type: 'string'
    }, {
        name: 'type', //The type of the variable
        type: 'string'
    }, {
        name: 'value', //The value of the variable
        type: 'string'
    }, {
        name: 'info', //The info fo the variable needed bu runtime system
        type: 'string'
    }, {
        name: 'formatID'
    }, {
        name: 'typeID'
    }, {
        name: 'globalID' // GG add more field to manage IO bit
    },{
        name: 'IsIObit'
    },{
        name: 'numBitID'
    },{
        name: 'valueByte'
    }]);
    //The globalID of the variable = the ID of the variable
    //added in listVariableStore
    //Simple store with variables of the currently displayed list
    
    var displayVariableStore = new Ext.data.SimpleStore({
        fields: ['name', 'format', 'type', 'value', 'info', 'formatID', 'typeID', 'globalID', 'IsIObit', 'numBitID', 'valueByte']
    });
    
    //Column model for the Grid which display variables of the selected list
    var displayVariableGridCM = new Ext.grid.ColumnModel([{
        header: lang.name,
        dataIndex: 'name',
        width: 220,
        menuDisabled: true,
        editor: availableVariableComboBox
    }, {
        header: lang.type,
        dataIndex: 'type',
        width: 100,
        menuDisabled: true,
        editable: false,
        editor: new fm.TextField({
            readOnly: true
        })
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
    
    var currentListLabel = new Ext.form.Label({
        text: ''
    });
    
    var addVariableB = new Ext.Button({
        text: lang.add,
        icon: '../../../media/custom/lib/images/add.png',
        iconCls: ' ',
        handler: addVariable
    });
    
    var delVariableB = new Ext.Button({
        text: lang.del,
        icon: '../../../media/custom/lib/images/delete.png',
        iconCls: ' ',
        handler: deleteVariable
    });
    
    var displayVariableGridPanel = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        layout: 'table',
        layoutConfig: {
            columns: 4
        },
        //bodyStyle: 'padding:2px',
        items: [addVariableB, delVariableB, currentListLabel]
    });
    
    //Grid which display variables of the selected list
    var displayVariableGrid = new Ext.grid.EditorGridPanel({
        store: displayVariableStore,
        cm: displayVariableGridCM,
        sm: new Ext.grid.RowSelectionModel({
            moveEditorOnEnter: false
        }),
        baseCls: 'x-plain',
        autoHeight: true,
        stripeRows: true,
        baseCls: 'x-plain',
        clicksToEdit: 2,
        listeners: {
            afteredit: function(e){
                if (e.column == 0) 
                    editVariableName(e);
                else 
                    if (e.column == 2) 
                        editVariableFormat(e);
                    else 
                        if (e.column == 3) {
                            editVariableValue(e);
                            if (refreshB.pressed == true) {
                                //editVariableValue(e);
                                //if (currentList.ListID == '0') 
                                    buildList();
                                timer = setInterval(requestVariable, currentList.refresh);
                            }
                        }
            },
            beforeedit: function(e){
                if (e.column == 3) {
                    requestVariable();
                    clearTimeout(timer);
                }
            }
        }
    });
    
    ///////////////////////////////////////////////////////////////////////////////////
    // The store which manage all lists
    // The column model used to display lists
    // The toolbar of the grid used to display lists
    // And then the grid itself
    ///////////////////////////////////////////////////////////////////////////////////
    
    //This type is used to manage list
    var list = Ext.data.Record.create([{
        name: 'name', //The name of the list
        type: 'string'
    }, {
        name: 'refresh' //The refresh period to refresh the list
    }, {
        name: 'ListID' //the ListID transmitted by server
    }]);
    
    //Simple store with all lists
    var listStore = new Ext.data.SimpleStore({
        fields: ['name', 'refresh', 'ListID']
    });
    
    var listGridCM = new Ext.grid.ColumnModel([{
        header: lang.name,
        dataIndex: 'name',
        menuDisabled: true,
        editor: new fm.TextField({
            allowBlank: false
        })
    }, {
        header: lang.refreshPeriod,
        dataIndex: 'refresh',
        menuDisabled: true,
        editor: new fm.TextField({
            allowBlank: false
        })
    }]);
    
    var refreshB = new Ext.Button({
        text: lang.refresh,
        icon: '../../../media/custom/lib/images/refresh.png',
        iconCls: ' ',
        enableToggle: true,
        handler: startStop
    });
    
    var addlistB = new Ext.Button({
        text: lang.add,
        icon: '../../../media/custom/lib/images/add.png',
        iconCls: ' ',
        handler: addList
    });
    
    var dellistB = new Ext.Button({
       text: lang.del,
       icon: '../../../media/custom/lib/images/delete.png',
       iconCls: ' ',
       handler: deleteList
    });
    
    var loadB = new Ext.Button({
        text: lang.load,
        icon: '../../../media/custom/lib/images/load.png',
        iconCls: ' ',
        handler: load
    });
    
    var saveB = new Ext.Button({
        text: lang.save,
        icon: '../../../media/custom/lib/images/save.png',
        iconCls: ' ',
        handler: save
    });
    
    var listGridPanel = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        items: [{
            layout: 'table',
            baseCls: 'x-plain',
            layoutConfig: {
                columns: 3
            },
            items:[addlistB,dellistB,refreshB]
           // items: [{
           //     xtype: 'button',
           //     text: lang.add,
           //     icon: '../media/custom/lib/images/add.png',
           //     iconCls: ' ',
           //     handler: addList
           // }, {
           //     xtype: 'button',
           //     text: lang.del,
           //     icon: '../media/custom/lib/images/delete.png',
           //     iconCls: ' ',
           //     handler: deleteList
           // }, refreshB]
        }, {
            layout: 'table',
            baseCls: 'x-plain',
            layoutConfig: {
                columns: 2
            },
            items: [loadB,saveB]
           // items: [{
           //     xtype: 'button',
           //     text: lang.load,
           //     icon: '../media/custom/lib/images/load.png',
           //     iconCls: ' ',
           //     handler: load
           // }, {
           //     xtype: 'button',
           //     text: lang.save,
           //     icon: '../media/custom/lib/images/save.png',
           //     iconCls: ' ',
           //     handler: save
           // }]
        }]
    });
    
    var listGrid = new Ext.grid.EditorGridPanel({
        store: listStore,
        cm: listGridCM,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            moveEditorOnEnter: false,
            listeners: {
                rowselect: updateList
            }
        }),
        baseCls: 'x-plain',
        autoHeight: true,
        width: 200 - 2,
        stripeRows: true,
        clicksToEdit: 2,
        listeners: {
            validateedit: function(e){
                if (e.column == 0) 
                    return editListName(e);
            },
            afteredit: function(e){
                e.record.commit();
                if (e.column == 0) 
                    currentListLabel.setText("   " + currentList.name);
            }
        }
    });
    
    ///////////////////////////////////////////////////////////////////////////////////
    // The store which manage all variables selected by the user to display in all lists
    // The debug grid used to display these variables if debug mode
    ///////////////////////////////////////////////////////////////////////////////////
    
    //This type is used to manage variables in listVariableStore.
    var listVariable = Ext.data.Record.create([{
        name: 'list' //The name of the list
    }, {
        name: 'name' //The name of the variable (for ex: POU.i)
    }, {
        name: 'formatID' //The format requested by the user
    }]);
    
    //Grouping store with all variables requested by the user in all lists.
    var listVariableReader = new Ext.data.ArrayReader({}, [{
        name: 'list'
    }, {
        name: 'name'
    }, {
        name: 'formatID'
    }]);
    
    var listVariableStore = new Ext.data.GroupingStore({
        reader: listVariableReader,
        sortInfo: {
            field: 'list'
        },
        groupField: 'list'
    });
    
    var debugGrid = new Ext.grid.GridPanel({
        store: listVariableStore,
        columns: [{
            header: "list",
            dataIndex: 'list'
        }, {
            header: "name",
            dataIndex: 'name'
        }, {
            header: "formatID",
            dataIndex: 'formatID'
        }],
        view: new Ext.grid.GroupingView({
            forceFit: true
        }),
        frame: true,
        height: 500
    });
    
    ///////////////////////////////////////////////////////////////////////////////////
    // Finally the viewport to arrange all grids
    ///////////////////////////////////////////////////////////////////////////////////
    
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [{
            region: 'west',
            split: true,
            width: 200,
            maxSize: 400,
            collapsible: true,
            collapseMode: 'mini',
            layout: 'border',
            items: [{
                region: 'north',
                baseCls: 'x-plain',
                height: 46,
                items: listGridPanel
            }, {
                region: 'center',
                baseCls: 'x-plain',
                layout: 'fit',
                autoScroll: true,
                items: listGrid
            }]
        }, {
            region: 'center',
            autoScroll: true,
            items: [{
                height: 23,
                baseCls: 'x-plain',
                items: displayVariableGridPanel
            
            }, {
                layout: 'fit',
                baseCls: 'x-plain',
                items: displayVariableGrid
            }]
        }]
    });
    
    ///////////////////////////////////////////////////////////////////////////////////
    // Now some usefull functions
    ///////////////////////////////////////////////////////////////////////////////////
    
    function addVariable(){
        if (displayVariableStore.getCount() < MAX_VARIABLE) {
            currentList.ListID = '0';
            var l = new listVariable({
                list: currentList.name,
                name: '',
                formatID: ''
            });
            listVariableStore.addSorted(l);
            var p = new displayVariable({
                name: '',
                format: '',
                formatID: '',
                type: '',
                typeID: '',
                value: '',
                info: '',
                globalID: l.id, 
                IsIObit: '',
                numBitID: '',
                valueByte: ''
            });
            
            displayVariableGrid.stopEditing();
            displayVariableStore.insert(displayVariableStore.getCount(), p);
            displayVariableGrid.startEditing(displayVariableStore.getCount() - 1, 0);
        }
        else {
            Ext.Msg.alert("M241/51", lang.maxVariable);
        }
    }
    
    function deleteVariable(){
        currentList.ListID = '0';
        var v = displayVariableGrid.selModel.getSelected();
        while (v != null) {
            listVariableStore.remove(listVariableStore.getById(v.data.globalID));
            displayVariableStore.remove(v);
            v = displayVariableGrid.selModel.getSelected()
        }
        displayVariableGrid.selModel.selectFirstRow();
    }
    
    function editVariableName(e){
        currentList.ListID = '0';
        var rSrc = findRecord(availableVariableStore, "name", e.value);
        var rGlobal = listVariableStore.getById(e.record.data.globalID);
        if (rSrc != null) {
            e.record.data.typeID = rSrc.data.typeID;
            e.record.data.type = getType(rSrc.data.typeID);
            e.record.data.formatID = getDefaultFormatID(rSrc.data.typeID);
            e.record.data.format = getFormat(e.record.data.formatID);
            e.record.data.info = rSrc.data.info;
            //GG todo complete with IObit specific field
            var bracketPos = e.record.data.name.indexOf('(');
            e.record.data.ioAddress = e.record.data.name.substr(bracketPos + 1, e.record.data.name.length - 2 - bracketPos);
            e.record.data.IsIObit = IsIOBit(e.record.data.ioAddress);
            if (e.record.data.IsIObit)
               e.record.data.numBitID = GetIONumbit(e.record.data.ioAddress);
        }
        else {
            e.record.data.type = '';
            e.record.data.typeID = '';
            e.record.data.format = '';
            e.record.data.formatID = '';
            e.record.data.info = '';
        }
        //Also change variable in listVariableStore.
        rGlobal.data.name = e.record.data.name;
        rGlobal.data.formatID = e.record.data.formatID;
        e.record.data.value = '';
        e.record.commit();
        rGlobal.commit();
    }
    
    function editVariableFormat(e){
        //Also change format in listVariableStore.
        currentList.ListID = '0';
        rGlobal = listVariableStore.getById(e.record.data.globalID);
        rGlobal.data.formatID = findRecord(formatStore, "format", e.value).data.formatID;
        e.record.data.format = e.value;
        e.record.data.formatID = findRecord(formatStore, "format", e.value).data.formatID;
        e.record.data.value = '';
        e.record.commit();
        rGlobal.commit();
    }
    
    function editVariableValue(e){
        e.record.commit();
        var request;
        var ByteValToWrite;
        var bitmask;
        var v = e.record;
        if ( v.data.typeID == 's') 
            request = v.data.info + ";" + v.data.typeID + ";" + v.data.formatID + ";" + escape(e.value) + ";";
        else {
            if (v.data.IsIObit){
                if (e.value == 'true'){
                    // set bit (Or 1)
                    bitmask = 1 << v.data.numBitID;
                    ByteValToWrite = (v.data.valueByte | bitmask);
                }
                else{
                   // reset bit (And 0)
                   bitmask = 1 << v.data.numBitID;
                   ByteValToWrite = (v.data.valueByte & ~bitmask);
                }
                request = v.data.info + ";" + "B" + ";" + "d" + ";" + ByteValToWrite + ";";
            }
            else{
                request = v.data.info + ";" + v.data.typeID + ";" + v.data.formatID + ";" + e.value + ";";
            }
        }
        var xhr = createXMLHttpRequest();
        xhr.open("POST", "/plcExchange/setValues/", false);
        xhr.setRequestHeader('GUID_A', GUID['A']);
        xhr.send(request);
		if (xhr.status != 200) {alert("Operation not Allowed");}
        requestVariable();
    }
    
    //When we create a list we want a "not yet used" name
    function findNextName(store, basename, baseindex){
        while (findRecordIndex(store, "name", basename + baseindex) != -1) 
            baseindex++;
        return basename + baseindex;
    }
    
    function addList(){
        if (listStore.getCount() < MAX_LIST) {
            var index = listStore.getCount();
            var p = new list({
                name: findNextName(listStore, "list", 1),
                refresh: 500,
                ListID: '0'
            });
            listStore.insert(index, p);
            listGrid.selModel.selectRow(index);
            listGrid.startEditing(index, 0);
        }
        else {
            Ext.Msg.alert("M241/51", lang.maxList);
        }
    }
    
    function deleteList(){
        if (listGrid.selModel.getSelected() != null) {
            listTab = listVariableStore.query('list', new RegExp("\\b" + currentList.name + "\\b"));
            for (listIndex = 0; listIndex < listTab.getCount(); listIndex++) {
                listVariableStore.remove(listTab.item(listIndex));
            }
            listStore.remove(listGrid.selModel.getSelected());
            listGrid.selModel.selectFirstRow();
            if (listGrid.selModel.getSelected() == null) 
                updateList();
        }
        else {
            updateList();
        }
    }
    
    function editListName(e){
        //Test forbidden characters
        var regExpression= new RegExp("[^A-Za-z0-9_-]+");
        if (regExpression.test(e.value)) {
            Ext.Msg.alert("M241/51", "'" + e.value + "' " + lang.forbidden);
            return false; 
        }
        if (findRecordIndex(listStore, "name", e.value) != -1) {
            Ext.Msg.alert("M241/51", e.value + lang.exists);
            return false;
        }
        else {
            listTab = listVariableStore.query('list', new RegExp("\\b" + currentList.name + "\\b"));
            for (listIndex = 0; listIndex < listTab.getCount(); listIndex++) {
                listTab.item(listIndex).data.list = e.value;
                listTab.item(listIndex).commit();
            }
            return true;
        }
    }
    
    // modif IPR OEM00016144
     function GetIONumbit(address)
     {
       var indexAdr = address.indexOf('.');
       var numBit = address.substring(indexAdr+1);
       return numBit; 
     }
    
     function IsIOBit(address)
     { 
       var isIObit = ((address.substring(0,3)=="%QX") || (address.substring(0,3)=="%IX"));
       return isIObit;
     }
    
    function updateList(){
        displayVariableGrid.stopEditing();
        listGrid.stopEditing();
        //Clear displaydisplayVariableGrid
        while (displayVariableStore.getCount() != 0) {
            displayVariableStore.remove(displayVariableStore.getAt(0));
        }
        
        if (listGrid.selModel.getSelected() != null) {
            currentList = listGrid.selModel.getSelected().data;
            currentListLabel.setText("   " + currentList.name);
            if (refreshB.pressed == false)
            {
            addVariableB.setDisabled(false);
            delVariableB.setDisabled(false);
            refreshB.setDisabled(false);
            }
            //Fill displayVariable 
            varTab = listVariableStore.query('list', new RegExp("\\b" + currentList.name + "\\b"));
            for (varIndex = 0; varIndex < varTab.getCount(); varIndex++) {
                var r = findRecord(availableVariableStore, "name", varTab.item(varIndex).data.name);
                if (r == null) {
                    var v = new displayVariable({
                        name: varTab.item(varIndex).data.name,
                        format: '',
                        formatID: '',
                        type: '',
                        typeID: '',
                        value: '',
                        info: '',
                        globalID: varTab.item(varIndex).id
                    });
                }
                else {
                    var v = new displayVariable({
                        name: varTab.item(varIndex).data.name,
                        formatID: varTab.item(varIndex).data.formatID,
                        format: getFormat(varTab.item(varIndex).data.formatID),
                        typeID: r.data.typeID,
                        type: getType(r.data.typeID),
                        value: '',
                        info: r.data.info,
                        globalID: varTab.item(varIndex).id
                    });
                    // GG detect if it is IO bit
                    var bracketPos = v.data.name.indexOf('(');
                    v.data.ioAddress = v.data.name.substr(bracketPos + 1, v.data.name.length - 2 - bracketPos);
                    v.data.IsIObit = IsIOBit(v.data.ioAddress);
                    if (v.data.IsIObit)
                        v.data.numBitID = GetIONumbit(v.data.ioAddress);
                }
                displayVariableStore.insert(displayVariableStore.getCount(), v);
            }
        }
        else {
            currentList = null;
            currentListLabel.setText("");
            addVariableB.setDisabled(true);
            delVariableB.setDisabled(true);
            refreshB.setDisabled(true);
        }
        if ( refreshB.pressed == true ) {
            clearTimeout(timer);
            timer = setInterval(requestVariable, currentList.refresh);
        }
    }
    
    function buildList(){
        var request = "";
        for (index = 0; index < displayVariableStore.getCount(); index++) {
            v = displayVariableStore.getAt(index);
            if (v.data.info != 0) {
                // GG patch typeID and formatID if it is IObit
                if (v.data.IsIObit)
                    request += v.data.info + ";" + 'B' + ';' + 'd' + ';';
                else
                    request += v.data.info + ";" + v.data.typeID + ";" + v.data.formatID + ";";
            }
        }
        var xhr = createXMLHttpRequest();
        xhr.open("POST", "/plcExchange/buildList/", false);
        xhr.setRequestHeader("Content-length", request.length);
        xhr.send(request);
        if (xhr.readyState == 4 && xhr.status == 200) 
            currentList.ListID = xhr.responseText;
		
		else 
			if(xhrVariable.status == 406){
				alert('You have been idle for 20 minutes. You will be redirected to the login page.');
				window.top.location.replace('/login.htm');
		
		}
        else 
            currentList.ListID = '0';
    }
    
    function startStop(){
        if (refreshB.pressed == true) {
            addVariableB.setDisabled(true);
            delVariableB.setDisabled(true);
            addlistB.setDisabled(true);
            dellistB.setDisabled(true);
            saveB.setDisabled(true);
            loadB.setDisabled(true);
            
            //if (currentList.ListID == '0') 
            buildList();
            requestPending = false;
            requestVariable();
            timer = setInterval(requestVariable, currentList.refresh);
        }
        else {
            addVariableB.setDisabled(false);
            delVariableB.setDisabled(false);
            addlistB.setDisabled(false);
            dellistB.setDisabled(false);
            saveB.setDisabled(false);
            loadB.setDisabled(false);
            clearTimeout(timer);
        }
    }
    
    function requestVariable(){
        if (requestPending == false) {
            requestPending = true;
            if (currentList.ListID == '0') 
                buildList();
            var xhrRequest = createXMLHttpRequest();
            xhrRequest.onreadystatechange = function(){
                if (xhrRequest.readyState == 4) {
                    if (xhrRequest.status == 200) {
                        var newValue = new Array();
                        newValue = xhrRequest.responseText.split(';');
                        displayVariableGrid.suspendEvents();
                        displayVariableGrid.hide();
                        valIndex = 0;
                        for (index = 0; index < displayVariableStore.getCount(); index++) {
                            v = displayVariableStore.getAt(index);
                            if (v.data.info != 0) {
                                if ( v.data.typeID == 's' )
                                    v.data.value = unescape( newValue[valIndex++] );
                                else{
                                    if (v.data.IsIObit){
                                       var rangbit = 1 << v.data.numBitID; 
                                       var nVal = parseInt(newValue[valIndex++]);
                                       var bitValue = (nVal & rangbit); 
                                       v.data.valueByte = nVal;
                                       if (bitValue)
                                           v.data.value = 'true';
                                       else
                                          v.data.value = 'false';
                                     }
                                     else{
                                        v.data.value = newValue[valIndex++]; 
                                     }
                                    }
                                v.commit();
                            }
                        }
                        displayVariableGrid.resumeEvents();
                        displayVariableGrid.show();
                    }
                    else {
                        currentList.ListID = '0';
                    }
                    requestPending = false;
                }
            };
            xhrRequest.open("GET", "/plcExchange/getDataList/", true);
            //xhrRequest.open("GET", "/rpmGetDataList/", true);
            //xhrRequest.setRequestHeader('Cache-Control','no-cache');
            xhrRequest.setRequestHeader('ListID', currentList.ListID);
            xhrRequest.setRequestHeader('GUID_A', GUID['A']);
            xhrRequest.send(null);
        }
    }
    
    function findRecord(store, field, value){
        var i = 0;
        var record;
        while ((i = store.find(field, value, i)) != -1) {
            record = store.getAt(i);
            if (record.get(field) == value) 
                return record;
            i++;
        }
        return null;
    }
    
    function findRecordIndex(store, field, value){
        var i = 0;
        while ((i = store.find(field, value, i)) != -1) {
            if (store.getAt(i).get(field) == value) 
                return i
            i++;
        }
        return -1;
    }
    
    function getType(typeID){
        var t = findRecord(typeStore, "typeID", typeID);
        return t.data.type;
    }
    
    function getFormat(formatID){
        var f = findRecord(formatStore, "formatID", formatID);
        return f.data.format;
    }
    
    function getDefaultFormatID(typeID){
        var f = findRecord(typeStore, "typeID", typeID);
        return f.data.defaultFormatID;
    }
    
    function findListVariable(name){
        var i = findRecordIndex(listVariableStore, "list", currentList.name);
        return findData(listVariableStore, "index", name, i);
    }
    
    function load(){
        Ext.Ajax.request({
            url: '/plcExchange/load/',
            method: 'GET',
            headers: {
                'FilePath': filePath
            },
            success: function(result, request){
                try {
                    eval(result.responseText);
                    listVariableStore.removeAll();
                    listVariableStore.loadData(savedVariables);
                    listStore.removeAll();
                    count = listVariableStore.getCount();
                    for (var index = 0; index < count; index++) {
                        var i = findRecordIndex(listStore, "name", listVariableStore.getAt(index).data.list);
                        if (i == -1) {
                            var p = new list({
                                name: listVariableStore.getAt(index).data.list,
                                refresh: 500,
                                ListID: '0'
                            });
                            listStore.insert(listStore.getCount(), p);
                        }
                    }
                    
                    if ( listPeriod != undefined ) {
                        for ( var index = 0 ; index < listPeriod.length ; index++ ) {
                            var listIndex = findRecordIndex(listStore, "name", listPeriod[index][0]);
                            if ( listIndex != -1 )
                                var v = listStore.getAt( listIndex );
                                v.data.refresh = listPeriod[index][1];
                                v.commit();
                        }
                    }                    
                    listGrid.selModel.selectFirstRow();
                    updateList();
                } 
                catch (error) {
                    Ext.Msg.alert("M241/51", lang.paramNotLoaded);
                }
            },
            failure: function(result, request){
                Ext.Msg.alert("M241/51", lang.paramNotLoaded);
            }
        });
    }
    
    function save(){
        var data = "var savedVariables = [\n";
        var count = listVariableStore.getCount();
        for (index = 0; index < count; index++) {
            var v = listVariableStore.getAt(index);
            if (index != (count - 1)) 
                data += "['" + v.data.list + "','" + v.data.name + "','" + v.data.formatID + "'],\n";
            else 
                data += "['" + v.data.list + "','" + v.data.name + "','" + v.data.formatID + "']\n];\n";
        }
        data += "var listPeriod = [\n";
        count = listStore.getCount();
        for (index = 0; index < count; index++ ) {
            var v = listStore.getAt(index);
            if ( index != (count-1) )
                data += "['" + v.data.name + "','" + v.data.refresh + "'],\n";
            else
                data += "['" + v.data.name + "','" + v.data.refresh + "']\n];\n";
        }
        Ext.Ajax.request({
            url: '/plcExchange/save/',
            method: 'POST',
            headers: {
                'FilePath': filePath
            },
            params: data,
            success: function(result, request){
                Ext.Msg.alert("M241/51", lang.paramSaved);
            },
            failure: function(result, request){
                Ext.Msg.alert("M241/51", lang.paramNotSaved);
            }
        });
        
    }
    
    currentListLabel.setText(' ');
    availableVariableStore.loadData(availableVariables);
    formatStore.loadData(availableFormats);
    typeStore.loadData(availableTypes);
    listGrid.selModel.selectFirstRow();
    updateList();
};
