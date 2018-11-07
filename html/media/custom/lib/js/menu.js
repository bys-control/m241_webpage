var id = 0;
var niv = 0;
var timeoutId;
var staticItems = new Array();
var dynamicItems = new Array();
var staticValues = new Array();
var dynamicValues = new Array();
var dynamicFormatsFunc = new Array();
var refreshTimer;
var pendingCommand = false;
var retryCommand = false;
var commandConfirmed = false;
var confirmPending = false;

function addJavascript(jsname, pos, winp) {
    var th = winp.document.getElementsByTagName(pos)[0];
    var s = winp.document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', jsname);
    th.appendChild(s);
}

function addCss(jsname, pos, winp) {
    var th = winp.document.getElementsByTagName(pos)[0];
    var s = winp.document.createElement('link');
    s.setAttribute('type', 'text/css');
    s.setAttribute('href', jsname);
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('media', 'screen');
    th.appendChild(s);
}

function Directory(url) {
    var i1 = url.lastIndexOf('/menu.htm');
    var ch = '/';
    if (i1 == -1) {
        i1 = url.lastIndexOf('\\menu.htm');
        ch = '\\';
    }
    var x = url.substring(0, i1);
    return x.substring(x.lastIndexOf(ch) + 1, i1);
}

function selectMenu() {
    window.clearTimeout(timeoutId);
    if (window.top.mainTop) {
        var id = Directory(window.top.mainTop.panel.location.pathname);
        if (window.top.header && window.top.header.selectMenu) {
            window.top.header.selectMenu(id);
            return true;
        } else {
            return false;
        }
    }
}

function framesetLoaded() {
    if (selectMenu() == false) {
        timeoutId = window.setTimeout('selectMenu()', 100);
    }
}

function indexMaintenance(){
  indexMaintUrl('../home/home.htm');
}

function indexMaintUrl(url){
if (isPocketPC()) {
        window.location.replace('menu.htm');
    } else if (url) {
        otherPlatformsIndexMaint(url);
    } else {
        otherPlatformsIndexMaint('../home/home.htm');
    }
    document.title = config.titleHtml;
}
function otherPlatformsIndexMaint(url) {
    if (document.location.search) {
        document.write('<frameset rows="78,*" cols="*" frameborder="no" border="0" framespacing="0">' + '<frame name="header" id="header" src="../header.htm" scrolling="no" noresize marginwidth="0" frameborder="no" />' + '<frame name="mainTop" id="mainTop" src="../index.htm' + document.location.search + '" scrolling="auto" noresize marginwidth="0" frameborder="no" />');
    } else {
            document.write('<frameset onload="framesetLoaded();" cols="156,*" frameborder="no" border="0" framespacing="0" >' + '<frame name="panel" id="panel" src="menu.htm" scrolling="no" noresize marginwidth="0" frameborder="no" />' + '<iframe name="main" id="main" href="' + url + '" scrolling="auto" noresize marginwidth="0" frameborder="no" />');
       }
    document.write('<noframes><body><p>This page uses frames, but your browser does not support them.</p></body></noframes>' + '</frameset>');
}


function index() {
    indexUrl('../home/home.htm');
}

function indexUrl(url) {
    if (isPocketPC()) {
        window.location.replace('menu.htm');
    } else if (url) {
        otherPlatformsIndex(url);
    } else {
        otherPlatformsIndex('../home/home.htm');
    }
    document.title = config.titleHtml;
}

function otherPlatformsIndex(url) {
    if (document.location.search) {
        document.write('<frameset rows="78,*" cols="*" frameborder="no" border="0" framespacing="0">' + '<frame name="header" id="header" src="../header.htm" scrolling="no" noresize marginwidth="0" frameborder="no" />' + '<frame name="mainTop" id="mainTop" src="../index.htm' + document.location.search + '" scrolling="auto" noresize marginwidth="0" frameborder="no" />');
    } else {
        strUrl = url.toString();
        if (strUrl.substring(0,3)== 'ftp:')
            document.write('<frameset onload="framesetLoaded();" cols="156,*" frameborder="no" border="0" framespacing="0" >' + '<frame name="panel" id="panel" src="menu.htm" scrolling="no" noresize marginwidth="0" frameborder="no" />' + '<iframe name="main" id="main" href="' + url + '" scrolling="auto" noresize marginwidth="0" frameborder="no"/>');
        else
            document.write('<frameset onload="framesetLoaded();" cols="156,*" frameborder="no" border="0" framespacing="0" >' + '<frame name="panel" id="panel" src="menu.htm" scrolling="no" noresize marginwidth="0" frameborder="no" />' + '<frame name="main" id="main" href="' + url + '" scrolling="auto" noresize marginwidth="0" frameborder="no"/>');
    }
    document.write('<noframes><body><p>This page uses frames, but your browser does not support them.</p></body></noframes>' + '</frameset>');
}

function menu(items) {
    if (isPocketPC()) {
        PocketPC(items);
    } else {
        otherPlatformsMenu(items);
    }
    document.title = config.titleHtml;
}

function PocketPC(items) {
    document.write('<body>');
    document.write('<img src="../' + config.logoPocketPC + '" >');
    document.write('<div class="productPocketPC">' + config.title + '</div>');
    PocketPCmenu2(items);
    document.write('</body>');
}

function otherPlatformsMenu(items) {
    document.write('<head> <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" /></head>');
    document.write('<body>');
    otherPlatformsMenu2(items);
    document.write('<table class="table_bottom">');
    document.write('<tr><td>');
    document.write('<hr size="1" />');
    document.write('<a class="level0" href="javascript:openMenu(\'Info\');" ><img id="ImgInfo" hspace="4" border="0" src="../../lib/images/moins.gif">Info</a><br/>');
    document.write('<div id="DivInfo">');
    document.write('<label class="level1_small" id="PLC_R.ProductRef"/></label><br/>');
    document.write('<label class="level1_small" id="PLC_R.NodeName"/>  </label><br/>');
    document.write('<label class="level1_small" id="PLC_R.Status"/>    </label><br/>');
    document.write('<label class="level1_small" id="PLC_R.ExpertIO_RunStop_Input"/> </label><br>');
    document.write('<label class="level1_small" id="USER"/>            </label><br/>');
    document.write('<label class="level1_small" id="RIGHTS"/>          </label>');
    document.write('</div>');
    document.write('<hr size="1" />');
    document.write('<a class="level0" href="javascript:openMenu(\'Control\');" ><img id="ImgControl" hspace="4" border="0" src="../../lib/images/moins.gif">Control</a><br/>');
    document.write('<div id="DivControl">');
    document.write('<a class="level1" href="javascript:plcCommand(\'start\');"     >Start</a><br/>');
    document.write('<a class="level1" href="javascript:plcCommand(\'stop\');"      >Stop</a><br/>');
    document.write('</div>');
    document.write('</td></tr>');
    document.write('</table>');
    document.writeln('</body>');
    staticItems.push(["PLC_R.ProductRef"]);
    staticItems.push(["PLC_R.NodeName"]);
    dynamicItems.push(["PLC_R.Status"]);
    dynamicFormatsFunc.push(formatStatus);
    staticValues = getValues(buildRequest(staticItems, availableSystems)).split(';');
    updatePage(staticItems, staticValues);
    refreshDyn();
    displayUser();
    displayRights();
    displayRunStop();
    refreshTimer = setInterval(refreshDyn, 2000);
}

function refreshDyn() {
    dynamicValues = getValues(buildRequest(dynamicItems, availableSystems)).split(';');
    updatePage(dynamicItems, dynamicValues, dynamicFormatsFunc);
}

function otherPlatformsMenu2(items) {
    if ((typeof items[0] == 'string')) {
        var left = 8 * niv;
        if ((typeof items[1] == 'string')) {
            var target = ((typeof items[2] == 'string') ? items[2] : 'main');
            document.write('<a style="padding-left:' + left + ';padding-right:8;cursor:hand;" href="' + items[1] + '" target="' + target + '">' + items[0] + '</a><br/>');
        } else {
            var close = ((typeof items[1] == 'boolean') && (items[1] == false));
            if (niv == 0) {
                document.write('<div style="padding-left:8;font-weight:bold;height:18px;" >' + items[0] + '</div>');
                document.write('<hr width="100%" size="1" />');
            } else {
                id++;
                document.write('<a href="javascript:openMenu(' + id + ');" style="padding-left:' + (left - 4) + ';cursor:hand;font-weight:bold;height:18px;" ><img id="Img' + id + '" hspace="4" border="0" src="../../lib/images/' + (close ? 'plus' : 'moins') + '.gif">' + items[0] + '</a><br/>');
            }
            niv++;
            document.write('<div id="Div' + id + '"' + (close ? ' style="display:none"' : '') + '>');
            for (var i = 1; i < items.length; i++) {
                otherPlatformsMenu2(items[i]);
            }
            document.write('</div>');
            niv--;
        }
        if (niv == 1) document.write('<hr width="100%" size="1" />');
    }
}

function PocketPCmenu2(items) {
    if ((typeof items[0] == 'string')) {
        if ((typeof items[1] == 'string')) {
            document.write('<li><a style="color:Black" href="' + items[1] + '">' + items[0] + '</a>');
        } else {
            if (niv == 0) {
                document.write('<div class="categoryPocketPC">' + items[0] + '</div>');
            } else {
                document.write('<li>' + items[0]);
            }
            niv++;
            document.write('<ul>');
            for (var i = 1; i < items.length; i++) {
                PocketPCmenu2(items[i]);
            }
            document.write('</ul>');
            niv--;
        }
    }
}

function openMenu(id) {
    var div = document.getElementById('Div' + id);
    var img = document.getElementById('Img' + id);
    if (div.style.display == 'none') {
        div.style.display = "inline";
        img.src = '../../lib/images/moins.gif';
    } else {
        div.style.display = 'none';
        img.src = '../../lib/images/plus.gif';
    }
}

function zeroPad(num, count) {
    var numZeropad = num + '';
    while (numZeropad.length < count) {
        numZeropad = "0" + numZeropad;
    }
    return numZeropad;
}

function plcCommand(cmd) {
    var w = window.top.mainTop.main;
    addJavascript('/html/lib/js/jquery-1.2.6.js', 'head', w);
    addJavascript('/html/lib/js/jquery.alerts.js', 'head', w);
    addCss('/html/lib/css/jquery.alerts.css', 'head', w);
    var ETHIPAdr = new Array();
    var MACAdr = new Array();
    var productRef = getValues(buildRequest(["PLC_R.ProductRef"], availableSystems)).split(';');
    var PLCName = getValues(buildRequest(["PLC_R.NodeName"], availableSystems)).split(';');
    ETHIPAdr[0] = getValues(buildRequest(["ETH_R.IPAddress[0]"], availableSystems)).split(';');
    ETHIPAdr[1] = getValues(buildRequest(["ETH_R.IPAddress[1]"], availableSystems)).split(';');
    ETHIPAdr[2] = getValues(buildRequest(["ETH_R.IPAddress[2]"], availableSystems)).split(';');
    ETHIPAdr[3] = getValues(buildRequest(["ETH_R.IPAddress[3]"], availableSystems)).split(';');
    var ipAdr = unescape(ETHIPAdr[0]) + unescape(ETHIPAdr[1]) + unescape(ETHIPAdr[2]) + unescape(ETHIPAdr[3]);
    MACAdr[0] = getValues(buildRequest(["ETH_R.MACAddress[0]"], availableSystems)).split(';');
    MACAdr[1] = getValues(buildRequest(["ETH_R.MACAddress[1]"], availableSystems)).split(';');
    MACAdr[2] = getValues(buildRequest(["ETH_R.MACAddress[2]"], availableSystems)).split(';');
    MACAdr[3] = getValues(buildRequest(["ETH_R.MACAddress[3]"], availableSystems)).split(';');
    MACAdr[4] = getValues(buildRequest(["ETH_R.MACAddress[4]"], availableSystems)).split(';');
    MACAdr[5] = getValues(buildRequest(["ETH_R.MACAddress[5]"], availableSystems)).split(';');
    var macadr = zeroPad(parseInt(MACAdr[0]).toString(16).toUpperCase(), 2) + "-" + zeroPad(parseInt(MACAdr[1]).toString(16).toUpperCase(), 2) + "-" + zeroPad(parseInt(MACAdr[2]).toString(16).toUpperCase(), 2) + "-" + zeroPad(parseInt(MACAdr[3]).toString(16).toUpperCase(), 2) + "-" + zeroPad(parseInt(MACAdr[4]).toString(16).toUpperCase(), 2) + "-" + zeroPad(parseInt(MACAdr[5]).toString(16).toUpperCase(), 2);
    var SerialNumber = getValues(buildRequest(["PLC_R.SerialNumber"], availableSystems)).split(';');
    if (pendingCommand == false) {
        try {
            w.jConfirm("<strong>You must be certain that this command will not provoke\nunintended machine operation or otherwise present\na hazard to personnel or equipment.</strong>\n\n\nController Identification:\n\n  - " + unescape(productRef[0]) + "\n  - Node name: " + unescape(PLCName) + "\n  - IP address:           " + ipAdr.replace(/,/g, ".") + "\n  - MAC address: " + macadr.replace(/,/g, "") + "\n  - Serial number: " + SerialNumber + "\n\n<strong>Do you really want to" + " " + cmd + "?\n\n</strong>", 'M258', function (r) {
                if (r == true) {
                    pendingCommand = true;
                    var xhrCmd = createXMLHttpRequest();
                    xhrCmd.onreadystatechange = function () {
                        if (xhrCmd.readyState == 4) {
							
                            pendingCommand = false;
                        }
                    };
                    xhrCmd.open("GET", "/plcExchange/command/" + cmd, true);
                    xhrCmd.send(null);
		    if(xhrCmd.status!=200){alert("Operation not Allowed");};
                };
            });
        } catch (e) {
            if (retryCommand == false) {
                retryCommand = true;
                setTimeout(plcCommand(cmd), 500);
            }
        };
        retryCommand = false;
    }
}