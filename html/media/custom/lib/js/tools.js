function isPocketPC() {
    return (navigator.userAgent.indexOf("Windows CE") > -1) || (navigator.userAgent.indexOf("240x320") > -1);
}

function getLanguageParam(strParamName) {
    var language = "english";
    var href = window.location.href;
    if (href.indexOf("?") > -1) {
        var params = href.substr(href.indexOf("?") + 1).toLowerCase().split('=');
        if (params[0] == "language") return params[1];
    }
    return language;
}

function loadLanguagePack() {
    var language = getLanguageParam();
    var cmd = '<script language="javascript" src="../../../media/custom/' + language + '/languagePack.js" type="text/javascript"></script>';
    document.write(cmd);
}

function updatePage(items, values, formatsFunc) {
    for (var index = 0; index < items.length; index++) {
        var x = document.getElementById(items[index]);
        if (x != null) {
            if (index < values.length) {
                if ((formatsFunc == undefined) || (formatsFunc[index] == null)) x.innerHTML = unescape(values[index]);
                else x.innerHTML = formatsFunc[index](values[index]);
            } else x.innerHTML = '-';
        }
    }
}

function createXMLHttpRequest() {
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    try {
        return new XMLHttpRequest();
    } catch (e) {}
    alert("XMLHttpRequest not supported");
    return null;
}
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    while (i < input.length);
    return output;
}

function decode64(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    while (i < input.length);
    return output;
}

function getUser() {
    var M258_LOG = "M258_LOG=";
    var pos = document.cookie.indexOf(M258_LOG);
    if (pos != -1) {
        var userKey = document.cookie.substring(pos + M258_LOG.length);
        pos = userKey.indexOf(":");
        if (pos != -1) return userKey.substring(0, pos);
        else return userKey;
    }
    return "";
}

function displayRights() {
    var rights;
    var M258_LOG = "M258_LOG=";
    var pos = document.cookie.indexOf(M258_LOG);
    if (pos != -1) {
        var userKey = document.cookie.substring(pos + M258_LOG.length);
        pos = userKey.indexOf(":");
        if (pos != -1) rights = "All";
        else rights = "No rights";
    } else rights = "";
    var x = document.getElementById("RIGHTS");
    if (x != null) x.innerHTML = rights;
}

function displayUser() {
    var info;
    if (getUser() == "") info = "Not logged";
    else {
        info = "Logged as " + getUser();
    }
    var x = document.getElementById("USER");
    if (x != null) x.innerHTML = info;
}

function formatProductImage(val) {
    // mockup patch
    return '<img src="/media/custom/images/' + val + 'Mockup.jpg"/>';
}

function formatDate(date) {
    var d = new Date();
    d.setTime(date * 1000);
    var s = d.toGMTString();
    return s.substr(0, s.length - 4);
}

function formatHexa(val) {
    var s = parseInt(val).toString(16).toUpperCase();
    return s;
}

function formatStatus(val) {
    if (val == 0) return "Empty (" + val + ")";
    if (val == 1) return "Stopped (" + val + ")";
    if (val == 2) return "Running (" + val + ")";
    if (val == 4) return "Halt (" + val + ")";
    if (val == 8) return "Breakpoint (" + val + ")";
    return val;
}

function formatStopCause(val) {
    if (val == 65535) return "-";
    if (val == 0) return "Unknown (" + val + ")";
    if (val == 1) return "System error (" + val + ")";
    if (val == 2) return "Reset (" + val + ")";
    if (val == 3) return "Exception (" + val + ")";
    if (val == 4) return "User (" + val + ")";
    if (val == 5) return "IECProgram (" + val + ")";
    if (val == 6) return "Delete (" + val + ")";
    if (val == 7) return "Debugging (" + val + ")";
    if (val == 10) return "Network request (" + val + ")";
    if (val == 11) return "Input (" + val + ")";
    if (val == 12) return "Run/Stop switch (" + val + ")";
    if (val == 13) return "Retain mismatch (" + val + ")";
    if (val == 14) return "Boot Application mismatch (" + val + ")";
    if (val == 15) return "Powerfail (" + val + ")";
    return val;
}

function formatBootProjectStatus(val) {
    if (val == 0) return "No boot project (" + val + ")";
    if (val == 1) return "Boot project creation in progress (" + val + ")";
    if (val == 2) return "Different boot project (" + val + ")";
    if (val == 65535) return "Same boot project (" + val + ")";
    return val;
}

function formatLastApplicationError(val) {
    if (val == 65535) return "-";
    if (val == 0) return "No error (" + val + ")";
    if (val == 16) return "Software watchdog of IEC-task expired (" + val + ")";
    if (val == 17) return "System error (" + val + ")";
    if (val == 18) return "IO config error (" + val + ")";
    if (val == 24) return "Unresolved external references (" + val + ")";
    if (val == 37) return "Iec task configuration failed (" + val + ")";
    if (val == 80) return "Illegal instruction (" + val + ")";
    if (val == 81) return "Access violation (" + val + ")";
    if (val == 261) return "Processor load watchdog of all IEC-tasks detected (" + val + ")";
    if (val == 258) return "Divison by zero exception (" + val + ")";
    if (val == 338) return "Real divison by zero exception (" + val + ")";
    if (val == 20000) return "Too many events on expert IOs detected (" + val + ")";
    return val;
}
var SYSTEMFAULT_BIT1 = {
    EXPERT_IO: 1,
    TM3: 2,
    ETH0: 3,
    ETH1: 4,
    SERIAL0: 5,
    SERIAL1: 6,
    CAN_0: 7,
    CART0: 8,
    CART1: 9,
    TM4: 10,
    SD: 11,
    FW: 12,
    DHCPS: 13,
    OPCUA: 14
};
var SYSTEMFAULT_BIT_TEXT = ['', 'Expert IO', 'TM3', 'Ethernet 1', 'Ethernet 2','Serial 0', 'Serial 1','CART 0', 'CART 1', 'TM4', 'SDCard','Firewall','DHCPS','OPCUA'];

function formatSystemFault1(val) {
    var systemFault = "";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.EXPERT_IO) == '0') systemFault += "Expert IO fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.TM3) == '0') systemFault += "TM3 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.ETH0) == '0') systemFault += "Ethernet_1 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.ETH1) == '0') systemFault += "Ethernet_2 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.SERIAL0) == '0') systemFault += "Serial 0 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.SERIAL1) == '0') systemFault += "Serial 1 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.CAN_0) == '0') systemFault += "Can 0 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.CART0) == '0') systemFault += "Cartridge 0 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.CART1) == '0') systemFault += "Cartridge 1 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.TM4) == '0') systemFault += "TM4 fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.SD) == '0') systemFault += "SDCard fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.FW) == '0') systemFault += "Firewall fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.DHCPS) == '0') systemFault += "DHCP server fault<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT1.OPCUA) == '0') systemFault += "OPCUA server fault<br/>";
    if (systemFault.length == 0) systemFault = "No error";
    return systemFault;
}

var SYSTEMFAULT_BIT2 = {
    SHORTCUT_GROUP_0: 1,
    SHORTCUT_GROUP_1: 2,
    SHORTCUT_GROUP_2: 3,
    SHORTCUT_GROUP_3: 4,
    SHORTCUT_GROUP_4: 5
};

function formatSystemFault2(val) {
    var systemFault = "";
    if (val.charAt(val.length - SYSTEMFAULT_BIT2.SHORTCUT_GROUP_0) == '0') systemFault += "Shortcut detected on group 0 (Q0...Q1)<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT2.SHORTCUT_GROUP_1) == '0') systemFault += "Shortcut detected on group 1 (Q2...Q3)<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT2.SHORTCUT_GROUP_2) == '0') systemFault += "Shortcut detected on group 2 (Q4...Q7)<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT2.SHORTCUT_GROUP_3) == '0') systemFault += "Shortcut detected on group 3 (Q8...Q11)<br/>";
    if (val.charAt(val.length - SYSTEMFAULT_BIT2.SHORTCUT_GROUP_4) == '0') systemFault += "Shortcut detected on group 4 (Q12...Q15)<br/>";
    if (systemFault.length == 0) systemFault = "No error";
    return systemFault;
}

function getSystemFault(val, bitIndex) {
    if (val.charAt(val.length - bitIndex) == '0') return "Error";
    else return "No error";
}

function formatLocalIOStatus(val) {
    if (val == 65535) return "Ok (" + formatHexa(val) + ")";
    if (val == 1) return "No init (" + formatHexa(val) + ")";
    if (val == 2) return "Conf fault (" + formatHexa(val) + ")";
    if (val == 3) return "Shortcut fault (" + formatHexa(val) + ")";
    if (val == 4) return "Power supply fault (" + formatHexa(val) + ")";
    return val;
}

function formatRemoteIOStatus(val) {
    if (val == 65535) return "Ok (" + formatHexa(val) + ")";
    if (val == 1) return "No init (" + formatHexa(val) + ")";
    if (val == 2) return "Conf fault (" + formatHexa(val) + ")";
    if (val == 3) return "Shortcut fault (" + formatHexa(val) + ")";
    if (val == 4) return "Power supply fault (" + formatHexa(val) + ")";
    return val;
}

function formatBatteryStatus(val) {
    if (val == 65535) return "Ok (" + formatHexa(val) + ")";
    if (val == 0) return "Change needed (" + formatHexa(val) + ")";
    return val;
}

function formatApplicationSignature(val) {
    return (formatHexa(val).toString());
}

function formatTerminalPortStatus(val) {
    if (val == 0) return "Not connected (" + formatHexa(val) + ")";
    if (val == 1) return "USB Connexion in progress (" + formatHexa(val) + ")";
    if (val == 2) return "Connected (" + formatHexa(val) + ")";
    if (val == 255) return "Error (" + formatHexa(val) + ")";
    return val;
}

function formatUSBHostStatus(val) {
    if (val == 0) return "None (" + formatHexa(val) + ")";
    if (val == 1) return "Read only (" + formatHexa(val) + ")";
    if (val == 2) return "Read/Write(" + formatHexa(val) + ")";
    if (val == 3) return "Error (" + formatHexa(val) + ")";
    return val;
}

function formatBytes(val) {
    var x = parseInt(val);
    return val + " (" + Math.round(x / 1024 / 1024) + " MB)";
}

function formatXBusState(val) {
    var XBusState = val + " :<br/>";
    if ((val.charAt(val.length-1) == '1')&& (val.charAt(val.length-2) == '1')) XBusState += "OK<br/>";
    if ((val.charAt(val.length-1) == '1')&& (val.charAt(val.length-2) == '0')) XBusState += "Bus Configuation error<br/>";
    if ((val.charAt(val.length-1) == '0')&& (val.charAt(val.length-2) == '0')&& (val.charAt(val.length-3) == '1')) XBusState += "Power supply error<br/>";
    return XBusState;
}

function formatIPMode(val) {
    if (val == 0) return "Stored (" + val + ")";
    if (val == 1) return "BootP (" + val + ")";
    if (val == 2) return "DHCP (" + val + ")";
    if (val == 255) return "Default IP (" + val + ")";
    return val;
}

function formatFrameSendingProtocol(val) {
    if (val == 0) return "802.3 (" + val + ")";
    if (val == 1) return "Ethernet II (" + val + ")";
    return "NA (" + val + ")";
}

function formatIpStatus(val) {
    if (val == 0) return "Wainting for parameters (" + val + ")";
    if (val == 1) return "Wainting for configuration (" + val + ")";
    if (val == 2) return "Data Exchange (" + val + ")";
    if (val == 3) return "Error (" + val + ")";
    if (val == 3) return "Duplicate Ip (" + val + ")";
    return val;
}

function formatIpMaster(val) {
    if (val == 0) return "Connected (" + val + ")";
    if (val == 1) return "Not connected (" + val + ")";
    return val;
}

function formatLinkStatus(val) {
    if (val == 0) return "Link down (" + val + ")";
    if (val == 1) return "Link up (" + val + ")";
    return val;
}

function formatDuplexStatus(val) {
    if (val == 0) return "Half Duplex (" + val + ")";
    if (val == 1) return "Full Duplex (" + val + ")";
    return "NA (" + val + ")";
}

function formatExtensionProductID(val) {
    if (val == 51200) return "TM2DDI8DT (" + val + ")<br/>8 DI 24Vdc sink/source, 1 wire";
    if (val == 51201) return "TM2DAI8DT (" + val + ")<br/>8 DI 120Vac, 2 wires";
    if (val == 51202) return "TM2DDI16DT (" + val + ")<br/>16 DI 24Vdc sink/source, 1 wire ";
    if (val == 51203) return "TM2DDI16DK (" + val + ")<br/>16 DI 24Vdc sink/source, 1 wire, MIL";
    if (val == 51204) return "TM2DDI32DK (" + val + ")<br/>32 DI 24Vdc sink/source, 2 wires, MIL";
    if (val == 51205) return "TM2DDO8UT (" + val + ")<br/>8 D0 0.3A sink, 1 wire";
    if (val == 51206) return "TM2DDO8TT (" + val + ")<br/>8 D0 0.3A source, 1 wire";
    if (val == 51207) return "TM2DDO16TK (" + val + ")<br/>16 D0 0.1A source, 1 wire, MIL";
    if (val == 51208) return "TM2DDO16UK (" + val + ")<br/>16 D0 0.1A sink, 1 wire, MIL";
    if (val == 51209) return "TM2DDO32TK (" + val + ")<br/>32 D0 0.1A source, 2 wires, MIL";
    if (val == 51210) return "TM2DDO32UK (" + val + ")<br/>32 D0 0.1A sink, 2 wires, MIL";
    if (val == 51211) return "TM2DMM8DRT (" + val + ")<br/>4 DI 24Vdc (1 wire), 4 DO 2A relay (2 wires)";
    if (val == 51212) return "TM2DMM24DRF (" + val + ")<br/>16 DI 24Vdc (1 wire), 8 DO 2A relay (2 wires)";
    if (val == 51213) return "TM2DRA8RT (" + val + ")<br/>8 DO 2A relay, 2 wires";
    if (val == 51214) return "TM2DRA16RT (" + val + ")<br/>16 DO 2A relay, 2 wires";
    if (val == 51215) return "TM2ALM3LT (" + val + ")<br/>2 AI (RTD-Th), 1 AO (0-10V, 4-20mA), 12 bits, K, J, T thermocouple and 3-wire PT100";
    if (val == 51216) return "TM2AMI2HT (" + val + ")<br/>2 AI (0-10V, 4-20mA), 12 bits";
    if (val == 51217) return "TM2AMI2LT (" + val + ")<br/>2 AI (Th), 12 bits, K, J, T thermocouple";
    if (val == 51218) return "TM2AMI4LT (" + val + ")<br/>4 AI (0-10V, 0-20mA, 3-wire PT100, 3-wire PT1000, 3-wire NI 100, 3-wire NI1000), 12 bits";
    if (val == 51219) return "TM2AMI8HT (" + val + ")<br/>8 AI (0-10V, 0-20mA), 10 bits";
    if (val == 51220) return "TM2AMM3HT (" + val + ")<br/>2 AI and 1 AO (0-10V, 4-20mA), 12 bits";
    if (val == 51221) return "TM2AMM6HT (" + val + ")<br/>4 AI and 2 AO (0-10V, 4-20mA), 12 bits";
    if (val == 51222) return "TM2AMO1HT (" + val + ")<br/>1 AO (0-10V, 4-20mA), 12 bits";
    if (val == 51223) return "TM2ARI8HT (" + val + ")<br/>8 AI (0-10V, 0-20mA), 10 bits";
    if (val == 51224) return "TM2ARI8LRJ (" + val + ")<br/>8 AI (PT100, PT1000), 12 bits, RJ11";
    if (val == 51225) return "TM2ARI8LT (" + val + ")<br/>8 AI (PT100, PT1000) 12 bits";
    if (val == 51226) return "TM2AVO2HT (" + val + ")<br/>2 AO (-10V-+10V), 11 bits + sign";
    if (val == 51227) return "TWDNOI10M3 (" + val + ")<br/>AS-Interface Master";
        
    if (val == 51400) return "TM3DI8 (" + val + ")<br/>8 DI 24Vdc sink/source, 1 wire";
    if (val == 51401) return "TM3DI16 (" + val + ")<br/>16 DI 24Vdc sink/source, 1 wire";
    if (val == 51402) return "TM3DI16K (" + val + ")<br/>16 DI 24Vdc sink/source, 1 wire, HE10";
    if (val == 51403) return "TM3DI32K (" + val + ")<br/>32 DI 24Vdc sink/source, 2 wires, HE10";
    if (val == 51404) return "TM3DQ8R (" + val + ")<br/>8 DO 2A relay, 2 wires";
    if (val == 51405) return "TM3DQ16R (" + val + ")<br/>16 DO 2A relay, 2 wires";
    if (val == 51406) return "TM3DQ8T (" + val + ")<br/>8 DO 0.5A source, 1 wire";
    if (val == 51407) return "TM3DQ16T (" + val + ")<br/>16 DO 0.5A source, 1 wire";
    if (val == 51408) return "TM3DQ16TK (" + val + ")<br/>16 DO 0.1A source, 1 wire, HE10";
    if (val == 51409) return "TM3DQ32TK (" + val + ")<br/>32 DO 0.1A source, 2 wires, HE10";
    if (val == 51410) return "TM3DM8R (" + val + ")<br/>4 DI 24Vdc sink/source (1 wire), 4 DO 2A relay (1 wire)";
    if (val == 51411) return "TM3DM24R (" + val + ")<br/>16 DI 24Vdc sink/source (1 wire), 8 DO 2A relay (2 wires)";
    if (val == 51412) return "TM3DQ8U (" + val + ")<br/>8 DO 0.5A sink, 1 wire";
    if (val == 51413) return "TM3DQ16U (" + val + ")<br/>16 DO 0.4A sink, 1 wire";
    if (val == 51414) return "TM3DQ16UK (" + val + ")<br/>16 DO 0.1A sink, 1 wire, HE10";
    if (val == 51415) return "TM3DQ32UK (" + val + ")<br/>32 DO 0.1A sink, 2 wires, HE10";
    if (val == 51416) return "TM3DI8A (" + val + ")<br/>8 DI 120 Vac sink/source, 2 wires";
    if (val == 51417) return "TM3AI2H (" + val + ")<br/>2 ANALOG INPUTS HIGH RES.";
    if (val == 51418) return "TM3AI4 (" + val + ")<br/>4 ANALOG INPUTS";
    if (val == 51419) return "TM3AI8 (" + val + ")<br/>MODULE TM3-8 ANALOG INPUTS";
    if (val == 51420) return "TM3AQ2 (" + val + ")<br/>2 ANALOG OUTPUTS";
    if (val == 51421) return "TM3AQ4 (" + val + ")<br/>4 ANALOG OUTPUTS";
    if (val == 51422) return "TM3AM6 (" + val + ")<br/>4 ANALOG OUT. 2 ANALOG IN.";
    if (val == 51423) return "TM3TM3 (" + val + ")<br/>2 TEMP INPUT 1 ANALOG OUT.";
    if (val == 51424) return "TM3TI4 (" + val + ")<br/>4 INPUTS TEMPERATURE";
    if (val == 51425) return "TM3TI8T (" + val + ")<br/>8 INPUTS TEMPERATURE";
    if (val == 51426) return "TM3XTRA1 (" + val + ")<br/>Transmitter ";
    if (val == 51427) return "TM3XREC1 (" + val + ")<br/>Receiver ";
    if (val == 51428) return "TM3XPID2 (" + val + ")<br/>xxxxx xxxx xxxx";
    if (val == 51429) return "TM3XTYS4 (" + val + ")<br/>4 Tesys motor starters ";
    if (val == 51430) return "TM3XHSC2 (" + val + ")<br/>xxxxx xxxx xxxx";
    if (val == 51431) return "TM3XPTO2 (" + val + ")<br/>xxxxx xxxx xxxx";
	
	if (val == 0) return "-";
	
	return val;
}

function formatExtensionStatus(val) {
    if (val == 0) return "Inactive (" + val + ")";
    if (val == 1) return "CONFIGURATION ERROR (" + val + ")";
    if (val == 2) return "BUS ERROR (" + val + ")";
    if (val == 3) return "OK (" + val + ")";
    if (val == 5) return "Missing Optional Module (" + val + ")";
    return val;
}

function formatExtensionSerialNumber(val) {
    if (val == 4294967295) return "Not relevant";
    return val;
}

function formatProfibusState(val) {
    if (val == 0) return "Unknown (" + val + ")";
    if (val == 1) return "Not configured (" + val + ")";
    if (val == 2) return "Stop (" + val + ")";
    if (val == 3) return "Idle (" + val + ")";
    if (val == 4) return "Operate (" + val + ")";
}

function insertTableLabels(place, title, labels, values) {
    var i;
    var sTable = "<table class='data'>";
    sTable += "<th colspan=2 class='data_category'>" + title + "</th>";
    for (i = 0; i < labels.length; i++) {
        sTable += "<tr>";
        sTable += "<td class='data_label'>" + labels[i] + "</td>";
        sTable += "<td class='data_value'><label id='" + values[i] + "'></label></td>";
        sTable += "</tr>";
    }
    sTable += "</table>";
    var x = document.getElementById(place);
    if (x != null) x.innerHTML = sTable;
}
var NAME = 0;
var SIZE = 1;
var DYN = 2;
var FORMAT_FUNC = 3;
var FORMAT = 4;
var TRANS = 5
var SYS_AREA = [
    ['PLC_R.VendorID', 1, false, null, 'h'],
    ['PLC_R.ProductID', 1, false, null, 'h'],
    ['PLC_R.SerialNumber', 1, false, null],
    ['PLC_R.FirmVersion', 4, false, null],
    ['PLC_R.BootVersion', 4, false, null],
    ['PLC_R.HardVersion', 1, false, null],
    ['PLC_R.ChipVersion', 1, false, null],
    ['PLC_R.Status', 1, true, formatStatus],
    ['PLC_R.BootProjectStatus', 1, true, formatBootProjectStatus],
    ['PLC_R.LastStopCause', 1, true, formatStopCause],
    ['PLC_R.LastApplicationError', 1, true, formatLastApplicationError],
    ['PLC_R.SystemFault_1', 1, true, formatSystemFault1, 'B'],
    ['PLC_R.SystemFault_2', 1, true, formatSystemFault2, 'B'],
    ['PLC_R.LocalIOStatus', 1, true, formatLocalIOStatus],
    ['PLC_R.TM3IOStatus', 1, true, formatRemoteIOStatus],
    ['PLC_R.ClockBatterystatus', 1, true, formatBatteryStatus],
    ['PLC_R.AppliSignature1', 1, true, formatApplicationSignature],
    ['PLC_R.AppliSignature2', 1, true, formatApplicationSignature],
    ['PLC_R.AppliSignature3', 1, true, formatApplicationSignature],
    ['PLC_R.AppliSignature4', 1, true, formatApplicationSignature],
    ['PLC_R.VendorName', 1, false, null],
    ['PLC_R.ProductRef', 1, false, null],
    ['PLC_R.NodeName', 1, true, null],
    ['PLC_R.LastStopTime', 1, true, formatDate],
    ['PLC_R.LastPowerOffDate', 1, true, formatDate],
    ['PLC_R.EventsCounter', 1, true, null],
    ['PLC_R.TerminalPortStatus', 1, true, formatTerminalPortStatus],
    ['PLC_R.SdCardStatus', 1, true, formatUSBHostStatus],
    ['PLC_R.UsrFreeFileHdl', 1, true, null],
    ['PLC_R.UsrFsTotalBytes', 1, true, formatBytes],
    ['PLC_R.UsrFsFreeBytes', 1, true, formatBytes],
    ['PLC_R.To_XBusState', 1, true, formatXBusState, 'B'],
    ['PLC_R.To_XSyncErrCnt', 1, true, null],
    ['PLC_R.To_XAsynErrCnt', 1, true, null],
    ['PLC_R.To_XBreakCnt', 1, true, null],
    ['PLC_R.To_XTopoChangedCnt', 1, true, null],
    ['PLC_R.To_XBusCycleCnt', 1, true, null],
    ['ETH_R.IPAddress', 4, true, null],
    ['ETH_R.SubNetMask', 4, true, null],
    ['ETH_R.Gateway', 4, true, null],
    ['ETH_R.MACAddress', 6, false, formatHexa],
    ['ETH_R.DeviceName', 1, true, null],
    ['ETH_R.IpMode', 1, true, formatIPMode],
    ['ETH_R.FDRServerIPAddress', 4, true, null],
    ['ETH_R.OpenTcpConnections', 1, true, null],
    ['ETH_R.FramesTransmittedOK', 1, true, null],
    ['ETH_R.FramedReceivedOK', 1, true, null],
    ['ETH_R.TransmitBufferErrors', 1, true, null],
    ['ETH_R.ReceiveBufferErrors', 1, true, null],
    ['ETH_R.FrameSendingProtocol', 1, true, formatFrameSendingProtocol],
    ['ETH_R.PortALinkStatus', 1, true, formatLinkStatus],
    ['ETH_R.PortASpeed', 1, true, null],
    ['ETH_R.PortADuplexStatus', 1, true, formatDuplexStatus],
    ['ETH_R.PortACollisions', 1, true, null],
    ['ETH_R.ModbusMessageTransmitted', 1, true, null],
    ['ETH_R.ModbusMessageReceived', 1, true, null],
    ['ETH_R.ModbusErrorMessage', 1, true, null],
    ['ETH_R.i_udiETHIP_IOMessagingTransmitted', 1, true, null],
    ['ETH_R.i_udiETHIP_IOMessagingRceived', 1, true, null],
    ['ETH_R.i_udiUCMM_Request', 1, true, null],
    ['ETH_R.i_udiUCMM_Error', 1, true, null],
    ['ETH_R.i_udiClass3_Request', 1, true, null],
    ['ETH_R.i_udiClass3_Error', 1, true, null],
    ['ETH_R.i_uiAssemblyInstanceInput', 1, true, null],
    ['ETH_R.i_uiAssemblyInstanceInputSize', 1, true, null],
    ['ETH_R.i_uiAssemblyInstanceOutput', 1, true, null],
    ['ETH_R.i_uiAssemblyInstanceOutputSize', 1, true, null],
    ['ETH_R.i_uiETHIP_ConnectionTimeouts', 1, true, null],
    ['ETH_R.MasterIpTimeouts', 1, true, null],
    ['ETH_R.MasterIpLost', 1, true, formatIpMaster],
    ['ETH_R.PortAIpStatus', 1, true, formatIpStatus],
    ['ETH_R.IPAddress_If2', 4, true, null],
    ['ETH_R.SubNetMask_If2', 4, true, null],
    ['ETH_R.Gateway_If2', 4, true, null],
    ['ETH_R.MACAddress_If2', 6, false, formatHexa],
    ['ETH_R.DeviceName_If2', 1, true, null],
    ['ETH_R.IpMode_If2', 1, true, formatIPMode],
    ['ETH_R.PortALinkStatus_If2', 1, true, formatLinkStatus],
    ['ETH_R.PortASpeed_If2', 1, true, null],
    ['ETH_R.PortADuplexStatus_If2', 1, true, formatDuplexStatus],
    ['SER_R.FramesTransmittedOK', 1, true, null],
    ['SER_R.FramesReceivedOK', 1, true, null],
    ['SER_R.RX_MessagesError', 1, true, null],
    ['SER_R.SlaveExceptionCount', 1, true, null],
    ['SER_R.SlaveMsgCount', 1, true, null],
    ['SER_R.SlaveNoRespCount', 1, true, null],
    ['SER_R.SlaveNakCount', 1, true, null],
    ['SER_R.SlaveBusyCount', 1, true, null],
    ['SER_R.CharOverrunCount', 1, true, null],
    ['XMODULE.ProductRefID', 1, true, formatExtensionProductID],
    //['XMODULE.SerialNumber', 1, true, formatExtensionSerialNumber],
    //['XMODULE.FirmVersion', 1, true, null],
    //['XMODULE.BootVersion', 1, true, null],
    ['XMODULE.State', 1, true, formatExtensionStatus],
    ['PB_R.wPNOIdentifier', 1, true, null, 'h'],
    ['PB_R.wBusAddr', 1, true, null],
    ['PB_R.iCommState', 1, true, formatProfibusState],
    ['PB_R.iCommError', 1, true, null, 'h'],
    ['PB_R.iErrorCount', 1, true, null]
];

function findSysAreaByName(name) {
    var i;
    for (i = 0; i < SYS_AREA.length; i++) {
        if (SYS_AREA[i][NAME] == name) return i;
    }
}

function getLabel(label) {
    var s = eval("lang." + label);
    if (s == null) return label;
    else return s;
}

function getValue(label, index) {
    if (SYS_AREA[index][SIZE] == 1) return "<label id='" + label + "'></label>";
    else if (SYS_AREA[index][SIZE] == 4) return "<label id='" + label + "[0]'></label>." + "<label id='" + label + "[1]'></label>." + "<label id='" + label + "[2]'></label>." + "<label id='" + label + "[3]'></label>";
    else if (SYS_AREA[index][SIZE] == 6) return "<label id='" + label + "[0]'></label>." + "<label id='" + label + "[1]'></label>." + "<label id='" + label + "[2]'></label>." + "<label id='" + label + "[3]'></label>." + "<label id='" + label + "[4]'></label>." + "<label id='" + label + "[5]'></label>";
}

function AddSysAreaItem(itemIndex, label, staticItems, dynamicItems) {
    var i;
    var size = SYS_AREA[itemIndex][SIZE];
    if (SYS_AREA[itemIndex][DYN]) {
        if (size == 1) {
            dynamicItems[0].push(label);
            dynamicItems[1].push(SYS_AREA[itemIndex][FORMAT]);
            dynamicItems[2].push(SYS_AREA[itemIndex][FORMAT_FUNC]);
        } else {
            for (i = 0; i < size; i++) {
                dynamicItems[0].push(label + '[' + i + ']');
                dynamicItems[1].push(SYS_AREA[itemIndex][FORMAT]);
                dynamicItems[2].push(SYS_AREA[itemIndex][FORMAT_FUNC]);
            }
        }
    } else {
        if (size == 1) {
            staticItems[0].push(label);
            staticItems[1].push(SYS_AREA[itemIndex][FORMAT]);
            staticItems[2].push(SYS_AREA[itemIndex][FORMAT_FUNC]);
        } else {
            for (i = 0; i < size; i++) {
                staticItems[0].push(label + '[' + i + ']');
                staticItems[1].push(SYS_AREA[itemIndex][FORMAT]);
                staticItems[2].push(SYS_AREA[itemIndex][FORMAT_FUNC]);
            }
        }
    }
}

function insertTable(place, title, items, staticItems, dynamicItems) {
    var i;
    var index;
    var reg = new RegExp('\\\[.*\\\]');
    var sTable = "<table class='data'>";
    var label;
    sTable += "<th colspan=2 class='data_category'>" + title + "</th>";
    for (i = 0; i < items.length; i++) {
        label = items[i].replace(reg, "");
        index = findSysAreaByName(label);
        if (index == undefined) {
            sTable += "<tr>";
            sTable += "<td class='data_label'>" + items[i] + "</td>";
            sTable += "<td class='data_value'>" + "</td>";
            sTable += "</tr>";
        } else {
            sTable += "<tr>";
            sTable += "<td class='data_label'>" + getLabel(label) + "</td>";
            sTable += "<td class='data_value'>" + getValue(items[i], index) + "</td>";
            sTable += "</tr>";
            AddSysAreaItem(index, items[i], staticItems, dynamicItems);
        }
    }
    sTable += "</table>";
    var x = document.getElementById(place);
    if (x != null) x.innerHTML = sTable;
}

function userSite() {
    return false;
    // ggo list.js doesn't exist: no user list
    var xhr = createXMLHttpRequest();
    xhr.open("GET", "/pages/list.js/", false);
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhr.send("");
    if (xhr.readyState == 4 && xhr.status == 200) {
        return true;
    } else {
        return false;
    }
}

function displayRunStop() {
    var runStopInfo;
    var runStopValue;
    runStopValue = getValues(buildRequest(["PLC_R.ExpertIO_RunStop_Input"], availableSystems)).split(';');
    if (runStopValue[0] == "0") runStopInfo = "Run/Stop: BLOCK0_I0";
    else if (runStopValue[0] == "1") runStopInfo = "Run/Stop: BLOCK0_I1";
    else if (runStopValue[0] == "2") runStopInfo = "Run/Stop: BLOCK0_I2";
    else if (runStopValue[0] == "3") runStopInfo = "Run/Stop: BLOCK0_I3";
    else if (runStopValue[0] == "4") runStopInfo = "Run/Stop: BLOCK0_I4";
    else if (runStopValue[0] == "5") runStopInfo = "Run/Stop: BLOCK0_I5";
    else if (runStopValue[0] == "16") runStopInfo = "Run/Stop: BLOCK1_I0";
    else if (runStopValue[0] == "17") runStopInfo = "Run/Stop: BLOCK1_I1";
    else if (runStopValue[0] == "18") runStopInfo = "Run/Stop: BLOCK1_I2";
    else if (runStopValue[0] == "19") runStopInfo = "Run/Stop: BLOCK1_I3";
    else if (runStopValue[0] == "20") runStopInfo = "Run/Stop: BLOCK1_I4";
    else if (runStopValue[0] == "21") runStopInfo = "Run/Stop: BLOCK1_I5";
    else runStopInfo = "Run/Stop: -";
    var x = document.getElementById("PLC_R.ExpertIO_RunStop_Input");
    if (x != null) x.innerHTML = runStopInfo;
}