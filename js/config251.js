define([], 
    function(){
        var config = {
            copyright: "&copy; 2000-2013 Schneider Electric. All Rights Reserved.",
            pageTitle: " ",
            version: "1.1.0.1",
            logo: "images/se-gear.png",
            diagnosticPollingInterval: 5000, // 5 seconds
            menu: [
            {
                displayName: "home",
                id: "home",
                url: "#"
            },
            {
				displayName: "Monitoring",
				id: "monitoring",
				url: "#monitoring",
				children: [
					{
						displayName: "Monitoring",
						id: "mon",
						url: "#monitoring/mon",
						image: "datatbls.png",
						state: "open",
						children: [
							{
								displayName: "Data Parameters",
								id: "data",
								url: "#monitoring/mon/data",
								hidden: false,
								fileName: "monitoring/mon/data/dataParameters.htm"
							},
							{
								displayName: "IO Viewer",
								id: "ioviewer",
								url: "#monitoring/mon/ioviewer",
								hidden: false,
								fileName: "monitoring/mon/ioviewer/ioViewer.htm"
							},
							{
								displayName: "Oscilloscope",
								id: "oscillo",
								url: "#monitoring/mon/oscillo",
								hidden: false,
								fileName: "monitoring/mon/oscillo/oscilloscope.htm"
							}
						]
					}
				]
			},
			{
				displayName: 'Diagnostics',
				id: 'diagnostics',
				url: '#diagnostics',
				children: [
					{
						displayName: 'Diagnostics',
						id: 'diag',
						url: '#diagnostics/diag',
						image: "module.png",
						state: 'open',
						children: [
						    {
								displayName: "Controller",
								id: "controller",
								url: "#diagnostics/diag/controller",
								hidden: false,
								fileName: "diagnostics/diag/controller/plcdiag.html"
							},
							{
								displayName: "TM3 Expansion",
								id: "tm3expansion",
								url: "#diagnostics/diag/tm3expansion",
								hidden: false,
								fileName: "diagnostics/diag/tm3expansion/extViewer.htm"
							},
							{
								displayName: "Ethernet",
								id: "ethernet",
								url: "#diagnostics/diag/ethernet",
								hidden: false,
								fileName: "diagnostics/diag/ethernet/ethDiag.htm"
							},
							{
								displayName: "Serial",
								id: "serial",
								url: "#diagnostics/diag/serial",
								hidden: false,
								fileName: "diagnostics/diag/serial/serDiag.htm"
							},
							{
								displayName: 'Scanner Status',
								id: 'scannerstatus',
								url: '#diagnostics/connecteddevices/scannerstatus'
				            },
                            {
                                displayName: 'EtherNet/IP Status',
                                id: 'eipscannerstatus',
                                url: '#diagnostics/connecteddevices/eipscannerstatus'
                            }
						]
					}
				]
			},
			{
				displayName: "Maintenance",
				id: "maintenance",
				url: "#maintenance",
				children: [
					{
						displayName: "Maintenance",
						id: "maint",
						url: "#maintenance/maint",
						image: "services.png",
						state: "open",
						children: [
							{
								displayName: "Post Conf",
								id: "postconf",
								url: "#maintenance/maint/postconf",
								hidden: false,
								fileName: "maintenance/maint/postconf/lateconf.htm"
							},
							{
								displayName: "Firewall",
								id: "firewall",
								url: "#maintenance/maint/firewall",
								hidden: false,
								fileName: "maintenance/maint/firewall/fireconf.htm"
							},
							{
								displayName: "System Log Files",
								id: "logfile",
								url: "#maintenance/maint/logfile",
								hidden: false,
								fileName: "maintenance/maint/logfile/logfile.htm"
							},
							{
								displayName: "EIP config files",
								id: "eipconf",
								url: "#maintenance/maint/eipconf",
								hidden: false,
								fileName: "maintenance/maint/eipconf/eip.htm"
							},
							{
								displayName: "Run/Stop Controller",
								id: "runstopplc",
								url: "#maintenance/maint/runstopplc",
								hidden: false,
								fileName: "maintenance/maint/runstopplc/runstop.htm"
							}
						]
					}
				]
			}]
		};
		return config;
	}
);
