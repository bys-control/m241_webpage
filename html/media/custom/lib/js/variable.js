/**
 * @author PDufrene
 */
var GUID = new Array();
var xhrVariable = createXMLHttpRequest();

function getTypeID(type){
    for (var index = 0; index < availableTypes.length; index++) {
        if (availableTypes[index][0] == type) 
            return availableFormats[index][1];
    }
    return '-';
}

function getFormatID(format){
    for (var index = 0; index < availableFormats.length; index++) {
        if (availableFormats[index][0] == format) 
            return availableFormats[index][1];
    }
    return '-';
}

function getDefaultFormatID(typeID){
    for (var index = 0; index < availableTypes.length; index++) {
        if (availableTypes[index][1] == typeID) 
            return availableTypes[index][2];
    }
    return '-';
}

function getVariableIndex(array, name){
    if (array == undefined ) return -1;
    for (var index = 0; index < array.length; index++) {
        if (array[index][0] == name) 
            return index;
    }
    return -1;
}

//This function search for all variable in array from srcArray
//and build the request to send to the server
function buildRequest(array, availableArray, formatArray){
    var request = '';
    for (var i = 0; i < array.length; i++) {
        var index = getVariableIndex(availableArray, array[i])
        if (index != -1) {
            if ( (formatArray == undefined) || (formatArray[i] == null) )
                request += availableArray[index][2] + ';' + availableArray[index][1] + ';' + getDefaultFormatID(availableArray[index][1]) + ';';
            else
                request += availableArray[index][2] + ';' + availableArray[index][1] + ';' + formatArray[i] + ';';
        }
        else 
            request += '-;'
    }
    return request;
}

//This function creates a list on the server and returns the ID of this list
function buildList(request){
    var xhrVariable = createXMLHttpRequest();
    xhrVariable.open("POST", "/plcExchange/buildList/", false);
    xhrVariable.setRequestHeader("Content-length", request.length);
    xhrVariable.send(request);
    if (xhrVariable.readyState == 4 && xhrVariable.status == 200) {
        return xhrVariable.responseText;
    }
    return 0;
}

//This function retrieve values of variable as specified in request
function getValues(request){
    var xhrVariable = createXMLHttpRequest();
    xhrVariable.open("POST", "/plcExchange/getValues/", false);
    xhrVariable.setRequestHeader('GUID_A', GUID['A']);
    xhrVariable.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhrVariable.send(request);
    if (xhrVariable.readyState == 4 && xhrVariable.status == 200) {
        return xhrVariable.responseText;
	}
	else 
		if(xhrVariable.status == 406){
		alert('You have been idle for 20 minutes. You will be redirected to the login page.');
		window.top.location.replace('/login.htm');
		
	}
	else {
	
	}
    return '-;'
}

//This function retrieve values of variable as specified in request
//And call back the specified function when finished
function getValuesAsync(request, callback){
    var xhrVariable = createXMLHttpRequest();
    xhrVariable.open("POST", "/plcExchange/getValues/", false);
    xhrVariable.setRequestHeader('GUID_A', GUID['A']);
    xhrVariable.send(request);
    if (xhrVariable.readyState == 4 && xhrVariable.status == 200) {
        callback(xhrVariable.responseText);
    }
	else
		if(xhrVariable.status == 406){
		window.top.location.replace('/login.htm');
	}
    else {
        callback('-;');
    }
}

//This function retrieve valued of variable in list identified by ListID
function refreshValues(ListID){
    var xhrVariable = createXMLHttpRequest();
    xhrVariable.open("GET", "/plcExchange/getValues/", false);
    xhrVariable.setRequestHeader("ListID", ListID);
    xhrVariable.setRequestHeader('GUID_A', GUID['A']);
     try {
         xhrVariable.send(null);
    } catch(e) {
	  Ext.Msg.alert("M241/51", "Communication error" );
	  return;
	}    
    if (xhrVariable.readyState == 4 && xhrVariable.status == 200) {
        return xhrVariable.responseText;
    }
    return "-;";
}
function refreshValues(ListID){
    var xhrVariable = createXMLHttpRequest();
    xhrVariable.open("GET", "/plcExchange/getValues/", false);
    xhrVariable.setRequestHeader("ListID", ListID);
    xhrVariable.setRequestHeader('GUID_A', GUID['A']);
     try {
         xhrVariable.send(null);
    } catch(e) {
	  Ext.Msg.alert("M241/51", "Communication error" );
	  return;
	}    
    if (xhrVariable.readyState == 4 && xhrVariable.status == 200) {
        return xhrVariable.responseText;
    }
    return "-;";
}

//This function retrive the value of a variable 
function getRTValue( variableName, format ) {
    var index = -1;
    var request = '';
    var variableAddr = '';
    var variableType = '';
    var variableFormat = '';
    var values = new Array();
    
    if ( typeof(availableVariables) != "undefined" )
        index = getVariableIndex( availableVariables, variableName );
    if ( index != -1 ) {
        variableAddr = availableVariables[index][2];
        variableType = availableVariables[index][1];
        if ( format == undefined )
            variableFormat = getDefaultFormatID( variableType );
        else
            variableFormat = format;
    } else {
        if ( typeof(availableSystems) != "undefined" )
          index = getVariableIndex( availableSystems, variableName );
        if ( index != -1 ) {
            variableAddr = availableSystems[index][2];
            variableType = availableSystems[index][1];
            if ( format == undefined )
                variableFormat = getDefaultFormatID( variableType );
            else
                variableFormat = format;
        }
    }
    if ( index != -1 ) {
        request = variableAddr + ';' + variableType + ';' + variableFormat + ';' ;
        var xhrVariable = createXMLHttpRequest();
        xhrVariable.open("POST", "/plcExchange/getValues/", false);
        xhrVariable.setRequestHeader('GUID_A', GUID['A']);
        xhrVariable.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        xhrVariable.send(request);
        if (xhrVariable.readyState == 4 && xhrVariable.status == 200) {
            values = xhrVariable.responseText.split(';');
            if ( variableType == 's' ) {
                return unescape( values[0] );
            } else {
                return values[0];
            }
        }        
    }
    return '-';
}

function setRTValue( variableName, format, value ) {
    var index = -1;
    var request = '';
    var variableAddr = '';
    var variableType = '';
    var variableFormat = '';
    
    index = getVariableIndex( availableVariables, variableName );
    if ( index != -1 ) {
        variableAddr = availableVariables[index][2];
        variableType = availableVariables[index][1];
        if ( format == undefined )
            variableFormat = getDefaultFormatID( variableType );
        else
            variableFormat = format;
    } else {
        index = getVariableIndex( availableSystems, variableName );
        if ( index != -1 ) {
            variableAddr = availableSystems[index][2];
            variableType = availableSystems[index][1];
            if ( format == undefined )
                variableFormat = getDefaultFormatID( variableType );
            else
                variableFormat = format;
        }
    }
    if ( index != -1 ) {
        if ( variableType == 's' ) {
            request = variableAddr + ';' + variableType + ';' + variableFormat + ';' + escape(value) + ';';
        } else {
            request = variableAddr + ';' + variableType + ';' + variableFormat + ';' + value + ';';
        }
        var xhrVariable = createXMLHttpRequest();
        xhrVariable.open("POST", "/plcExchange/setValues/", false);
        xhrVariable.setRequestHeader('GUID_A', GUID['A']);
        xhrVariable.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        xhrVariable.send(request);
		if (xhrVariable.status != 200) {alert("Operation not Allowed");}
    } 
}
