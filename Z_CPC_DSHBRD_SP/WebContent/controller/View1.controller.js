sap.ui.define(["sap/ui/core/mvc/Controller",
               'sap/ui/core/BusyIndicator',
               "sap/m/MessageToast",
               'sap/viz/ui5/api/env/Format',	
               'sap/viz/ui5/format/ChartFormatter',	
               "sap/ui/vbm/AnalyticMap",	
               'sap/ui/model/Filter',	
               'sap/ui/model/FilterOperator',
               "sap/ui/core/format/NumberFormat",	
               'sap/ui/model/Sorter',
               'sap/ui/core/util/Export',	
               'sap/ui/core/util/ExportTypeCSV',	
               'sap/m/Token',
               	"sap/m/library"
               ], function (Controller, BusyIndicator, Format, ChartFormatter,MessageToast, AnalyticMap, Filter, FilterOperator, NumberFormat, Sorter, Export, ExportTypeCSV, Token, MLibrary) {	
	"use strict";	
		var URLHelper = MLibrary.URLHelper;
	var me;
	var callTypeFlag;
	var currentScreen;

	var selectedDuetoSearchDistributor = [];
	var selectedDuetoSearchDealer = [];
	var selectedDuetoSearchStatesLP = [];
	var selectedDuetoSearchCampaign = [];
	var selectedDuetoSearchStatesOSS = [];
	var selectedDuetoSearchCallTypes = [];
	
	AnalyticMap.GeoJSONURL = "model/L1_US.json";	
	return Controller.extend("cpc.CPC_Dashboard_Split.controller.View1", {	
		onInit: function () {
				$('.loader').hide();
			$("#splash-screen").remove();
		/*	$('.loader').hide();*/
		
			
				/*	BusyIndicator.show(0);
						$("#splash-screen").remove();*/
			me = this;
			if (!me.dialog) {	
				me.dialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.BusyLoader", this);	
			}	
				this.ObjectPageLayout = new sap.m.BusyDialog({
				text: "Data Load in Progress"
			});
			
			me.postUsageMetrics();
			me.ObjectPageLayout.open(); 
			
			var formatPattern = ChartFormatter.DefaultPattern;	
			// Chart Containers and Chart characterstics
			var oVizFrame = me.oVizFrame = me.getView().byId("idVizFrameLeadsProvided");	
			oVizFrame.setVizProperties({	
				legend: {	
					isScrollable:true,	
					title: {	
						visible: false	
					},	
					label: {	
						linesOfWrap: 3,	
						style: {	
							fontSize: "9px"	
						}	
					}	
				},	
				legendGroup: {	
					layout: {	
						position: "right" // keep legend to bottom of the
							// chart
					}	
				},	
				categoryAxis: {	
					visible: false		
				},	
				title: {	
					text:"Call Count",	
					visible: true	
				},	
				valueAxis: {
					visible: false	
				},	
				plotArea: {	
					gridline: {	
						visible: false	
					},	
					dataLabel: {
						style:{	
							color:"#FFFFFF",	
							fontWeight:"bold"	
						},
						type: "value",
						visible: true
					}	
				},
				tooltip: {
					bodyMeasureValue: {
						type: "valueAndPercentage"
					},
					visible: true,
					formatString: "1234"
				}
			});	
			var oVizFrameTrackingLeads = me.oVizFrameTrackingLeads = me.getView().byId("idVizFrameTrackingLeadsProvided");	
			oVizFrameTrackingLeads.setVizProperties({	
				legend: {	
					title: {	
						visible: false	
					},	
					label: {	
						linesOfWrap: 2,	
						style: {	
							fontSize: "10px"	
						}	
					}	
				},	
				categoryAxis: {	
					visible: false	
				},	
				title: {	
					visible: false	
				},	
				valueAxis: {	
					visible: false	
				},	
				plotArea: {	
					gridline: {	
						visible: false	
					},	
					dataLabel: {	
						visible: true,	
						style:{	
							color:"#333333",	
							fontWeight:"bold"	
						},	
						radius:0.30	
					},	
					colorPalette : ["rgb(88, 153, 218)","rgb(232, 116, 59)","rgb(148, 94, 207)"],
					window: {	
						start: null,	
						end: null	
					},	
				}	
			});	
			var oVizFrameTrackingLeads = me.oVizFrameTrackingLeads = me.getView().byId("idVizFrameOnlineScheduling");	
			oVizFrameTrackingLeads.setVizProperties({	
				legend: {	
					title: {	
						visible: false	
					},	
					label: {	
						linesOfWrap: 2,	
						style: {	
							fontSize: "10px"	
						}	
					}	
				},	
				categoryAxis: {	
					visible: false	
				},	
				title: {	
					visible: false	
				},	
				valueAxis: {	
					visible: false	
				},	
				plotArea: {	
					gridline: {	
						visible: false	
					},	
					dataLabel: {	
						visible: true,	
						style:{	
							color:"#333333",	
							fontWeight:"bold"	
						},	
						radius:0.30	
					},	
					window: {	
						start: null,	
						end: null	
					},	
				}	
			});	
			var oVizFrameTrackingLeadsFactory = me.oVizFrameTrackingLeads = me.getView().byId("idVizFrameLeadsFactory");	
			oVizFrameTrackingLeadsFactory.setVizProperties({	
				legend: {	
					visible: false	
				},	
				categoryAxis: {	
					title: {	
						visible: false,	
					}	
				},	
				title: {	
					visible: false,	
				},	
				plotArea: {	
					dataLabel: {	
						visible: true,	
						type: "percentage",	
					}	
				}	
			});	
			var oVizFrameTrackingLeadsFactoryDay = me.oVizFrameTrackingLeads = me.getView().byId("idVizFrameLeadsFactoryDay");	
			oVizFrameTrackingLeadsFactoryDay.setVizProperties({	
				legend: {	
					visible: false	
				},	
				categoryAxis: {	
					title: {	
						visible: false,	
					}	
				},	
				title: {	
					visible: false,	
				},	
				plotArea: {	
					dataLabel: {	
						visible: true,	
						type: "percentage"	
					}	
				}	
			});	
			var oVizFrameTrackingLeadsFactoryDay = me.oVizFrameTrackingLeads = me.getView().byId("idVizFrameLeadsFactoryDayTime");	
			oVizFrameTrackingLeadsFactoryDay.setVizProperties({	
				legend: {	
					visible: false	
				},	
				categoryAxis: {	
					title: {	
						visible: false,	
					}	
				},	
				title: {	
					visible: false,	
				},	
				plotArea: {	
					dataLabel: {	
						visible: true,	
						type: "percentage"	
					}	
				}	
			});	

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({	
				pattern: "MM/dd/yyyy"	
			});	
			var sTodaysDate=oDateFormat.format(new Date());	
			var selectionParameterdata = {	
					"Date": [{	
						DateTime:"Data for YTD as of " + sTodaysDate,	
						Key:"CD"	
					},{	
						DateTime:"Last Year Performance",	
						Key:"LY"	
					}],	
					"Brand": [],	
					"Distributor": [],	
					"Dealer": [],	
					"Stacked_Column":[],	
					"Donut":[],	
					"DonutOnlineScheduling":[],	
					"Table":[],	
					"CallTypes":[],
					"Campaign":[],	
					"States":[],	
					"LeadsFactory":[],	
					"LeadsFactoryByTime":[],	
					"LeadsFactoryByDay":[],	
					"LeadsFactoryParameters":[],	
					"LeadsFactoryStates":[],	
					"StatesLeads":[],	
					"LegendOnlineScheduling": [{	
						"text": "0 - 100",	
						"color": "rgb(92,186,229)"	
					}, {	
						"text": "100 - 200",	
						"color": "rgb(39,163,221)"	
					}, {	
						"text": "200 - 300",	
						"color": "rgb(27,126,172)"	
					}],	
					"HyperlinkOnlineScheduling":[],	
					"HyperlinkLeadsProvided":[],	
					"LeadStatus":[],	
					"DealerDetails":[]	
			};	
			var oModelSelectionParameter = new sap.ui.model.json.JSONModel();	
			oModelSelectionParameter.setData(selectionParameterdata);	
			me.getOwnerComponent().setModel(oModelSelectionParameter, "SelectionParameterModel");	
			
			me.loadCommonFilters();
			me.loadScreen1();
		},	 
		
		/********************** POST for Usage Metrics ***************/
		postUsageMetrics: function() {
			me.usageMetricsModel = me.getOwnerComponent().getModel("DashboardUsageMetrics");
			
			var entry = {
					KEY: "X",
					APPLNAME: "CPC Distributor Dashboard",
					APPID: "1"	
			};
			
			me.usageMetricsModel.create("/LOGINDETAILSet", entry, null, function() {
				alert("Create successful");
			}, function() {
				alert("Create failed");
			});
		},
		
		onAfterRendering: function() {
			/*BusyIndicator.hide("<Please wait...>");*/
	
			
			/****************** Auto Logout Feature *****************/
			var idleTime = 0;
			$(document).ready(function () {
			    //Increment the idle time counter every minute.
			    var idleInterval = setInterval(function timerIncrement() {
			        idleTime = idleTime + 1;
			        if (idleTime > 14) { // 15 minutes
			        	window.open("https://www.login.hvacpartners.com/","_self"); 
			        }
			    }, 60000); 

			    //Zero the idle timer on mouse movement.
			    $(this).mousemove(function (e) {
			        idleTime = 0;
			    });
			    $(this).keypress(function (e) {
			        idleTime = 0;
			    });
			});
			this.ObjectPageLayout.close();
		},
		
		loadCommonFilters: function() {
			var sDateTimeKey = me.getView().byId("idDateTime").getSelectedKey();
			var entitySet;
			
			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			if (sDateTimeKey === "LY") {
				me.oDataModel = me.getOwnerComponent().getModel("DashboardFirstScreenModel_LY");
				entitySet = "/ZCV_CPCLG_SC01_Q0003Results";
			} else {
				me.oDataModel = me.getOwnerComponent().getModel("DashboardFirstScreenModel");
				entitySet = "/ZCV_CPCLG_SC01_Q0001Results";
			}
			
			// Fill Brand Values
			me.getView().byId("commonFilters").setBusy(true);
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HGB2ED4OKF9J5AIITF49DYZ2BA_T,A2HGB2ED4OKF9J5AIITF49DYZ2BA',
					$format: 'json'
				},
								
				success: function (oData, response) {
					oModel.getData().Brand = oData;
					
					me.getView().byId("idBrand").setModel(oModel);
				},
				error: function(oError) {
					
				}
			});
			
			// Fill Distributor Values
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T,A2HHDBJ1ZTDJT4I2RACFYWLNOBX9,A2HGB2ED4OKF9J5AIITF49DYZ2BA_T',
					$format: 'json',
					$orderby: 'A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T'
				},
								
				success: function (oData, response) {
	
					var cleaned = (function () {
						 var arr = [],
					        collection = [];
					    
					    $.each(oData.results, function (index, value) {
					        if ($.inArray(value.A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T, arr) == -1) {
					            arr.push(value.A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T);
					            collection.push(value);
					        }
					    });
					    return collection;
					});
					
					var allDistributors = cleaned();
					oModel.setProperty("/Distributor",[]);
					for (var i = 0; i < allDistributors.length; i++) {
						if (allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T[0] === " ") {
							allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T = allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T.slice(1);
						}
						oModel.getData().Distributor.push({
							"DistributorText": allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T,
							"DistributorKey": allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9
						});
					}
				},
				error: function(oError) {
					
				}
			});
			
			
			// Fill Dealer Values
	
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HH1AHVH1XFP2B8U26XY6E1QA0E,A2HQ3BP0M836H2ES6HU2I5A52QNJ',
					$format: 'json'
				},
								
				success: function (oData, response) {
	
					var cleaned = (function () {
						 var arr = [],
					        collection = [];
					    
					    $.each(oData.results, function (index, value) {
					        if ($.inArray(value.A2HQ3BP0M836H2ES6HU2I5A52QNJ, arr) == -1) {
					            arr.push(value.A2HQ3BP0M836H2ES6HU2I5A52QNJ);
					            collection.push(value);
					        }
					    });
					    return collection;
					});
					
					oModel.getData().Dealer = cleaned()
				},
				error: function(oError) {
					
				}
			});
			
			
			// Fill States Values for Screen 2 and 3
		
			me.stateModel = me.getOwnerComponent().getModel("DashboardSecondScreenModelQ1AndQ3_LY");
			me.stateModel.read("/ZCV_CPCLG_SC2A_Q0005Results",{	
				
				urlParameters: {
					$select: 'A2HRGR7SP5KY5T1Q9QHRQCALDERH',
					$format: 'json'
				},
								
				success: function (oData, response) {
					oModel.getData().States = oData.results;
				},
				error: function(oError) {
					
				}
			});
			
			
			// Fill Campaign Values for Screen 2
			me.getView().byId("commonFilters").setBusy(true);
			me.stateModel = me.getOwnerComponent().getModel("DashboardSecondScreenModelQ1AndQ3_LY");
			me.stateModel.read("/ZCV_CPCLG_SC2A_Q0005Results",{	
				
				urlParameters: {
					$select: 'A2HGKN4494F3PQR2SQBH4PWDIAE1',
					$format: 'json'
				},
								
				success: function (oData, response) {
					oModel.getData().Campaign = oData.results;
				},
				error: function(oError) {
					
				}
			});
			
		},
		
		/**
		 * Load the First Screen
		 */
		loadScreen1: function() {
			currentScreen = 1;
			
			var sBrandValue = me.getView().byId("idBrand").getSelectedKey();
			var sDateTimeKey = me.getView().byId("idDateTime").getSelectedKey();
			var sDistributorValue = me.getView().byId("idDistributor").getTokens(); 
			var sDealerValue = me.getView().byId("idDealer").getTokens();
			
			var entitySet;
			var selectParameters;
			
			var totalLeadsKey;
			
			var salesCallsKey;
			var serviceCallsKey;
			var businessCallsKey;
			var busyCallsKey;
			var hungUpsKey;
			
			var revenueCapturedKey;
			var revenueMissedKey;
			
			var answeredKey;
			var busynoanswerKey;
			var callerhungupKey;
			
			var acceptedKey;
			var rejectedKey;
			var offeredKey;
			
			var unscheduledKey;	
			var scheduledKey;	
			var inprogressKey;	
			var cancelledKey;	
			var completedKey;	
			
			var nonzeroAvgTimeKey;
			var avgTimeKey;
			var completedTimeKey;
			
			var trackingLeads;
			var totalLeads;
			
			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			/************ Setting Filter Values **************/
			var additionalSelectParameters = "";
			
			var allFilters = [];
			var FADFilters = [];
			
			if (sBrandValue !== "") {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HGB2ED4OKF9J5AIITF49DYZ2BA";
				var brandFilter = new sap.ui.model.Filter("A2HGB2ED4OKF9J5AIITF49DYZ2BA", sap.ui.model.FilterOperator.EQ, sBrandValue);
				allFilters.push(brandFilter);
				FADFilters.push(brandFilter);
			}
			if (sDistributorValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HHDBJ1ZTDJT4I2RACFYWLNOBX9";
				var currentDistributorIds = [];
							
				for (var i = 0; i < sDistributorValue.length; i++) {
					var newArray = [];
					newArray = oModel.getData().Distributor.filter(function (el) {
						  return el.DistributorText == sDistributorValue[i].getText();
					});
					currentDistributorIds.push(newArray[0].DistributorKey);
				}
				
				var distributorFilters = []
				for (var i = 0; i < currentDistributorIds.length; i++) {
					var distributorFilter = new sap.ui.model.Filter("A2HHDBJ1ZTDJT4I2RACFYWLNOBX9", sap.ui.model.FilterOperator.EQ, currentDistributorIds[i]);
					distributorFilters.push(distributorFilter);
				}
				var distributorFilterModel = new Filter(distributorFilters, false);
				allFilters.push(distributorFilterModel);
				FADFilters.push(distributorFilterModel);
			}
			
			if (sDealerValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HH1AHVH1XFP2B8U26XY6E1QA0E";
				var currentDealerIds = [];
				
				var dealerFilters = []
				for (var i = 0; i < sDealerValue.length; i++) {
					var dealerFilter = new sap.ui.model.Filter("A2HH1AHVH1XFP2B8U26XY6E1QA0E", sap.ui.model.FilterOperator.EQ, sDealerValue[i].getText());
					dealerFilters.push(dealerFilter);
					
				}
				var dealerFilterModel = new Filter(dealerFilters, false);
				allFilters.push(dealerFilterModel);
			}
			
			
			if (sDateTimeKey === "LY") {
				
				me.oDataModel = me.getOwnerComponent().getModel("DashboardFirstScreenModel_LY");
				
				entitySet = "/ZCV_CPCLG_SC01_Q0003Results";
						// Fill Brand Values  previous year logic by bmr
			me.getView().byId("commonFilters").setBusy(true);
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HGB2ED4OKF9J5AIITF49DYZ2BA_T,A2HGB2ED4OKF9J5AIITF49DYZ2BA',
					$format: 'json'
				},
								
				success: function (oData, response) {
					oModel.getData().Brand = oData;
					
					me.getView().byId("idBrand").setModel(oModel);
				},
				error: function(oError) {
					
				}
			});
			
			// Fill Distributor Values
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T,A2HHDBJ1ZTDJT4I2RACFYWLNOBX9,A2HGB2ED4OKF9J5AIITF49DYZ2BA_T',
					$format: 'json',
					$orderby: 'A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T'
				},
								
				success: function (oData, response) {
	
					var cleaned = (function () {
						 var arr = [],
					        collection = [];
					    
					    $.each(oData.results, function (index, value) {
					        if ($.inArray(value.A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T, arr) == -1) {
					            arr.push(value.A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T);
					            collection.push(value);
					        }
					    });
					    return collection;
					});
					
					var allDistributors = cleaned();
					oModel.setProperty("/Distributor",[]);
					for (var i = 0; i < allDistributors.length; i++) {
						if (allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T[0] === " ") {
							allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T = allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T.slice(1);
						}
						oModel.getData().Distributor.push({
							"DistributorText": allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T,
							"DistributorKey": allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9
						});
					}
				},
				error: function(oError) {
					
				}
			});
			
			
			// Fill Dealer Values
	
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HH1AHVH1XFP2B8U26XY6E1QA0E,A2HQ3BP0M836H2ES6HU2I5A52QNJ',
					$format: 'json'
				},
								
				success: function (oData, response) {
	
					var cleaned = (function () {
						 var arr = [],
					        collection = [];
					    
					    $.each(oData.results, function (index, value) {
					        if ($.inArray(value.A2HQ3BP0M836H2ES6HU2I5A52QNJ, arr) == -1) {
					            arr.push(value.A2HQ3BP0M836H2ES6HU2I5A52QNJ);
					            collection.push(value);
					        }
					    });
					    return collection;
					});
					
					oModel.getData().Dealer = cleaned()
				},
				error: function(oError) {
					
				}
			});
				
			
				selectParameters = 'Z_TOT_LEAD_1,ZCNT_SACAL_1,ZCNT_SRCAL_1,ZCNT_GBISCAL_1,ZCNT_BNOA_1,ZCNT_HNGUP_1,ZRLZ_VAL_1,ZUNRLZ_VAL_1,ZCNT_CONCAL_1,ZCN_STNREJ_1,ZCNT_STRJ_1,ZNO_LEDOFF_1,ZCT_ST_UNSCH_1,ZCT_ST_SCNORJ_1,ZCT_ST_INPRG_1,ZCT_ST_CANCL_1,ZCT_ST_CMPLT_1,ZCUS_WTIM_1,ZCN_ACNONL_1,ZCOMP_TIME_1';
				
				totalLeadsKey = 'Z_TOT_LEAD_1';
				
				salesCallsKey = 'ZCNT_SACAL_1';
				serviceCallsKey = 'ZCNT_SRCAL_1';
				businessCallsKey = 'ZCNT_GBISCAL_1';
				busyCallsKey = 'ZCNT_BNOA_1';
				hungUpsKey = 'ZCNT_HNGUP_1';
				
				revenueCapturedKey = 'ZRLZ_VAL_1';
				revenueMissedKey = 'ZUNRLZ_VAL_1';
				
				answeredKey = 'ZCNT_CONCAL_1';
				busynoanswerKey = 'ZCNT_BNOA_1';
				callerhungupKey = 'ZCNT_HNGUP_1';
				
				acceptedKey = 'ZCN_STNREJ_1';
				rejectedKey = 'ZCNT_STRJ_1';
				offeredKey = 'ZNO_LEDOFF_1';
				
				unscheduledKey = 'ZCT_ST_UNSCH_1';
				scheduledKey = 'ZCT_ST_SCNORJ_1';
				inprogressKey = 'ZCT_ST_INPRG_1';
				cancelledKey = 'ZCT_ST_CANCL_1';
				completedKey = 'ZCT_ST_CMPLT_1';
				
				nonzeroAvgTimeKey = 'ZCUS_WTIM_1';
				avgTimeKey = 'ZCN_ACNONL_1';
				completedTimeKey = 'ZCOMP_TIME_1';
			} else {
				
				me.oDataModel = me.getOwnerComponent().getModel("DashboardFirstScreenModel");
				
				entitySet = "/ZCV_CPCLG_SC01_Q0001Results";
						// Fill Brand Values Current year change
			me.getView().byId("commonFilters").setBusy(true);
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HGB2ED4OKF9J5AIITF49DYZ2BA_T,A2HGB2ED4OKF9J5AIITF49DYZ2BA',
					$format: 'json'
				},
								
				success: function (oData, response) {
					oModel.getData().Brand = oData;
					
					me.getView().byId("idBrand").setModel(oModel);
				},
				error: function(oError) {
					
				}
			});
			
			// Fill Distributor Values
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T,A2HHDBJ1ZTDJT4I2RACFYWLNOBX9,A2HGB2ED4OKF9J5AIITF49DYZ2BA_T',
					$format: 'json',
					$orderby: 'A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T'
				},
								
				success: function (oData, response) {
	
					var cleaned = (function () {
						 var arr = [],
					        collection = [];
					    
					    $.each(oData.results, function (index, value) {
					        if ($.inArray(value.A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T, arr) == -1) {
					            arr.push(value.A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T);
					            collection.push(value);
					        }
					    });
					    return collection;
					});
					
					var allDistributors = cleaned();
					oModel.setProperty("/Distributor",[]);
					for (var i = 0; i < allDistributors.length; i++) {
						if (allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T[0] === " ") {
							allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T = allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T.slice(1);
						}
						oModel.getData().Distributor.push({
							"DistributorText": allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T,
							"DistributorKey": allDistributors[i].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9
						});
					}
				},
				error: function(oError) {
					
				}
			});
			
			
			// Fill Dealer Values
	
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: 'A2HH1AHVH1XFP2B8U26XY6E1QA0E,A2HQ3BP0M836H2ES6HU2I5A52QNJ',
					$format: 'json'
				},
								
				success: function (oData, response) {
	
					var cleaned = (function () {
						 var arr = [],
					        collection = [];
					    
					    $.each(oData.results, function (index, value) {
					        if ($.inArray(value.A2HQ3BP0M836H2ES6HU2I5A52QNJ, arr) == -1) {
					            arr.push(value.A2HQ3BP0M836H2ES6HU2I5A52QNJ);
					            collection.push(value);
					        }
					    });
					    return collection;
					});
					
					oModel.getData().Dealer = cleaned()
				},
				error: function(oError) {
					
				}
			});
				
			
				selectParameters = 'Z_TOT_LEAD,ZCNT_SACAL,A006NZKS3HHO23TM2AGPXH5DW7,ZCNT_GBISCAL,ZCNT_BNOA,ZCNT_HNGUP,ZRLZ_VAL,ZUNRLZ_VAL,ZCNT_CONCAL,ZCN_STNREJ,ZCNT_STRJ,ZNO_LEDOFF,ZCT_ST_UNSCH,A006NZKS3HHO23TM2AGPXH8JO7,A006NZKS3HHO23TM2AGPXH8PZR,ZCT_ST_CANCL,ZCT_ST_CMPLT,ZCUS_WTIM,ZCN_ACNONL,ZCOMP_TIME';
				
				totalLeadsKey = 'Z_TOT_LEAD';
				
				salesCallsKey = 'ZCNT_SACAL';
				serviceCallsKey = 'A006NZKS3HHO23TM2AGPXH5DW7';
				businessCallsKey = 'ZCNT_GBISCAL';
				busyCallsKey = 'ZCNT_BNOA';
				hungUpsKey = 'ZCNT_HNGUP';
				
				revenueCapturedKey = 'ZRLZ_VAL';
				revenueMissedKey = 'ZUNRLZ_VAL';
				
				answeredKey = 'ZCNT_CONCAL';
				busynoanswerKey = 'ZCNT_BNOA';
				callerhungupKey = 'ZCNT_HNGUP';
				
				acceptedKey = 'ZCN_STNREJ';
				rejectedKey = 'ZCNT_STRJ';
				offeredKey = 'ZNO_LEDOFF';
				
				unscheduledKey = 'ZCT_ST_UNSCH';
				scheduledKey = 'A006NZKS3HHO23TM2AGPXH8JO7';
				inprogressKey = 'A006NZKS3HHO23TM2AGPXH8PZR';
				cancelledKey = 'ZCT_ST_CANCL';
				completedKey = 'ZCT_ST_CMPLT';
				
				nonzeroAvgTimeKey = 'ZCUS_WTIM';
				avgTimeKey = 'ZCN_ACNONL';
				completedTimeKey = 'ZCOMP_TIME';
			}
			
			
			me.getView().byId("leadsProvidedBlock").setBusy(true);
			me.getView().byId("onlineSchedulingBlock").setBusy(true);
			
			var filterModel = new Filter(allFilters, true);
			var xFilter = [];
			xFilter.push(filterModel);
			
			me.oDataModel.read(entitySet,{	
				
				urlParameters: {
					$select: selectParameters,
					$format: 'json'
				},
				filters: xFilter,				
				success: function (oData, response) {
					
					oModel.getData().Stacked_Column = [];
					oModel.getData().Donut = [];
					oModel.getData().Pie = [];
					
					me.getView().byId("trackingLeadsBigText").setText(me.handleCurrencyFormatting(0));
					me.getView().byId("revenueCaptured").setText("$"+me.handleCurrencyFormatting(0));
					me.getView().byId("revenueMissed").setText("$"+me.handleCurrencyFormatting(0));
					me.getView().byId("answeredCalls").setText(me.handleCurrencyFormatting(0));
					me.getView().byId("busyCalls").setText(me.handleCurrencyFormatting(0));
					me.getView().byId("hungupCalls").setText(me.handleCurrencyFormatting(0));
					
					me.getView().byId("acceptedLeads").setText(me.handleCurrencyFormatting(0));
					me.getView().byId("rejectedLeads").setText(me.handleCurrencyFormatting(0));
					me.getView().byId("offeredLeads").setText(me.handleCurrencyFormatting(0));
					
					me.getView().byId("totalLeadsBigText").setText(me.handleCurrencyFormatting(0));
					
					oModel.setProperty("/LeadsUnscheduled","0");		
					oModel.setProperty("/LeadsScheduled","0");		
					oModel.setProperty("/LeadsInProg","0");		
					oModel.setProperty("/LeadsCancelled","0");		
					oModel.setProperty("/LeadsCompleted","0");		
					oModel.setProperty("/LeadsUnscheduledPer",me.handlePercentageCalculation(parseInt(0),0));		
					oModel.setProperty("/LeadsScheduledPer",me.handlePercentageCalculation(parseInt(0),0));		
					oModel.setProperty("/LeadsInProgPer",me.handlePercentageCalculation(parseInt(0),0));		
					oModel.setProperty("/LeadsCancelledPer",me.handlePercentageCalculation(parseInt(0),0));		
					oModel.setProperty("/LeadsCompletedPer",me.handlePercentageCalculation(parseInt(0),0));		
					oModel.setProperty("/AverageAcceptedHours",me.handleDivisionCalculation(parseInt(0),parseInt(0)));	
					oModel.setProperty("/AverageCompletedHours",me.handleDivisionCalculation(parseInt(0),parseInt(0)));	
					oModel.setProperty("/TotalLeads", me.handleCurrencyFormatting(parseInt(0) + parseInt(0)));
					
					
					if (oData.results.length === 0) {
						me.getView().byId("leadsProvidedBlock").setBusy(false);
						me.getView().byId("onlineSchedulingBlock").setBusy(false);
						oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
						me.getView().byId("reasonArea").removeAllContent();
						oModel.refresh();
						oModel.updateBindings();
						} else {
						
							/************ Leads Provided Block ***********/
							/************ Tracking Leads Big Text **********/
							trackingLeads = parseInt(oData.results[0][busynoanswerKey]) + parseInt(oData.results[0][callerhungupKey]) + parseInt(oData.results[0][answeredKey]);
							me.getView().byId("trackingLeadsBigText").setText(me.handleCurrencyFormatting(trackingLeads.toString()));
							
							
							/************ Stacked Column Chart **********/
							var selectionParameterModel = me.getOwnerComponent().getModel("SelectionParameterModel");
							
							oModel.getData().Stacked_Column.push({
									"CallCount": "Call Count",	
									"SalesCalls": (oData.results[0][salesCallsKey]),	
									"ServcieCalls": (oData.results[0][serviceCallsKey]),	
									"BusinessCalls": (oData.results[0][businessCallsKey]),	
									"BusyCalls": (oData.results[0][busyCallsKey]),	
									"HungUps": (oData.results[0][hungUpsKey])
								});
							
						
							oModel.refresh();
							oModel.updateBindings();	
							
							var oTooltip = new sap.viz.ui5.controls.VizTooltip({
								tooltip: new sap.ui.core.TooltipBase({
									text: ""
										
								})
							});
							oTooltip.connect(me.getView().byId("idVizFrameLeadsProvided").getVizUid());
							
							
							/************ Revenue Dollar Values **********/
							me.getView().byId("revenueCaptured").setText("$"+me.handleCurrencyFormatting((oData.results[0][revenueCapturedKey]).toString()));
							me.getView().byId("revenueMissed").setText("$"+me.handleCurrencyFormatting((oData.results[0][revenueMissedKey]).toString()));
							
							
							/************ Donut Chart **********/
							
							oModel.getData().Donut.push({	
								"CallType": "Answered Calls",	
								"Value": oData.results[0][answeredKey]	
							}, {	
								"CallType": "Busy/No Answer",	
								"Value": oData.results[0][busynoanswerKey]	
							}, {	
								"CallType": "Caller Hung Up",	
								"Value": oData.results[0][callerhungupKey]	
							});
							
							
							/************ Call Types Big Texts **********/
							me.getView().byId("answeredCalls").setText(me.handleCurrencyFormatting((oData.results[0][answeredKey]).toString()));
							me.getView().byId("busyCalls").setText(me.handleCurrencyFormatting((oData.results[0][busynoanswerKey]).toString()));
							me.getView().byId("hungupCalls").setText(me.handleCurrencyFormatting((oData.results[0][callerhungupKey]).toString()));
							
							me.getView().byId("leadsProvidedBlock").setBusy(false);
							/************ End of Leads Provided Block ***********/
							
							/************ Online Scheduling Leads  Block ***********/
							
							/************ Total Leads Big Text **********/
							totalLeads = parseInt(oData.results[0][acceptedKey]) + parseInt(oData.results[0][rejectedKey]) + parseInt(oData.results[0][offeredKey]);
							me.getView().byId("totalLeadsBigText").setText(me.handleCurrencyFormatting(totalLeads.toString()));
							
							
							/************ Pie Chart **********/
							
							oModel.getData().Pie.push({	
								"CallType": "Accepted",	
								"Value": oData.results[0][acceptedKey]	
							}, {	
								"CallType": "Rejected",	
								"Value": oData.results[0][rejectedKey]	
							}, {	
								"CallType": "Offered",	
								"Value": oData.results[0][offeredKey]	
							});
							
							
							/************ Leads Types Big Texts **********/
							me.getView().byId("acceptedLeads").setText(me.handleCurrencyFormatting((oData.results[0][acceptedKey]).toString()));
							me.getView().byId("rejectedLeads").setText(me.handleCurrencyFormatting((oData.results[0][rejectedKey]).toString()));
							me.getView().byId("offeredLeads").setText(me.handleCurrencyFormatting((oData.results[0][offeredKey]).toString()));
							
							/************ Rejected Reasons Progress Indicators **********/
							me.getView().byId("onlineSchedulingBlock").setBusy(true);
							
							var filterModel = new Filter(allFilters, true);
							var xFilter = [];
							xFilter.push(filterModel);
							
							me.oDataModel.read(entitySet,{	
								
								urlParameters: {
									$select: 'A2HR3HOED5O5WS6BZIYE6XXWI2MA,'+ rejectedKey,
									$format: 'json'
								},
								
								filters: xFilter,
												
								success: function (oData, response) {
									
									if (oData.results.length === 0) {
										me.getView().byId("reasonArea").removeAllContent();
										me.getView().byId("onlineSchedulingBlock").setBusy(false);
										me.getView().byId("commonFilters").setBusy(false);
									} else {
									
										me.getView().byId("reasonArea").removeAllContent();
										var oVerInner1Layout = new sap.ui.layout.VerticalLayout();
										var oVerInner2Layout = new sap.ui.layout.VerticalLayout().addStyleClass("reasonVerLayout2");
										
										var totalRejected = 0;
										for (var i = 0; i < oData.results.length; i++) {
											totalRejected = totalRejected + parseInt(oData.results[i][rejectedKey]);
										}
										
										for (var i = 0; i < oData.results.length; i++) {
											if (oData.results[i].A2HR3HOED5O5WS6BZIYE6XXWI2MA !== "#") {
												var oReason = new sap.m.Text({
													text: oData.results[i].A2HR3HOED5O5WS6BZIYE6XXWI2MA
												}).addStyleClass("callsTextClass sapUiTinyMarginTop");
												oVerInner1Layout.addContent(oReason);
												var oHorInnerLayout = new sap.ui.layout.HorizontalLayout();
												var oIndicator = new sap.m.ProgressIndicator({
													percentValue: me.handlePercentageCalculation(parseInt(oData.results[i][rejectedKey]),totalRejected),
													displayOnly: true,
													state: "Success"
												});
												var oLabel = new sap.m.Label({
													text: oData.results[i][rejectedKey]
												}).addStyleClass("leadsNumberReasonRejectionClass");
												oHorInnerLayout.addContent(oIndicator);
												oHorInnerLayout.addContent(oLabel);
												oVerInner2Layout.addContent(oHorInnerLayout);
											}
										}
										var oHorLayout = new sap.ui.layout.HorizontalLayout();
										oHorLayout.addContent(oVerInner1Layout);
										oHorLayout.addContent(oVerInner2Layout);
										me.getView().byId("reasonArea").addContent(oHorLayout);
										
										oModel.refresh();
										oModel.updateBindings();
										me.getView().byId("onlineSchedulingBlock").setBusy(false);
										me.getView().byId("commonFilters").setBusy(false);
									}
								},
								error: function (oError) {
									
								}
							});
							
							
							/************ Leads Progress Indicators **********/
							
							oModel.setProperty("/LeadsUnscheduled",oData.results[0][unscheduledKey].toString());		
							oModel.setProperty("/LeadsScheduled",oData.results[0][scheduledKey].toString());		
							oModel.setProperty("/LeadsInProg",oData.results[0][inprogressKey].toString());		
							oModel.setProperty("/LeadsCancelled",oData.results[0][cancelledKey].toString());		
							oModel.setProperty("/LeadsCompleted",oData.results[0][completedKey].toString());		
							
							var sTotLeadsValue= parseInt(oData.results[0][unscheduledKey]) + parseInt(oData.results[0][scheduledKey]) + parseInt(oData.results[0][inprogressKey]) + parseInt(oData.results[0][cancelledKey]) + parseInt(oData.results[0][completedKey]);	
							
							oModel.setProperty("/LeadsUnscheduledPer",me.handlePercentageCalculation(parseInt(oData.results[0][unscheduledKey]),sTotLeadsValue));		
							oModel.setProperty("/LeadsScheduledPer",me.handlePercentageCalculation(parseInt(oData.results[0][scheduledKey]),sTotLeadsValue));		
							oModel.setProperty("/LeadsInProgPer",me.handlePercentageCalculation(parseInt(oData.results[0][inprogressKey]),sTotLeadsValue));		
							oModel.setProperty("/LeadsCancelledPer",me.handlePercentageCalculation(parseInt(oData.results[0][cancelledKey]),sTotLeadsValue));		
							oModel.setProperty("/LeadsCompletedPer",me.handlePercentageCalculation(parseInt(oData.results[0][completedKey]),sTotLeadsValue));		
							
							
							/************ Average Time Texts **********/
							oModel.setProperty("/AverageAcceptedHours",me.handleDivisionCalculation(parseInt(oData.results[0][nonzeroAvgTimeKey]),parseInt(oData.results[0][avgTimeKey])));	
							oModel.setProperty("/AverageCompletedHours",me.handleDivisionCalculation(parseInt(oData.results[0][completedTimeKey]),parseInt(oData.results[0][completedKey])));	
							
							/************ End of Online Scheduling Leads  Block ***********/
							
							/******** Setting the Total Leads Header Bar Text ********/
							oModel.setProperty("/TotalLeads", me.handleCurrencyFormatting(parseInt(trackingLeads) + parseInt(totalLeads)));
							
							oModel.refresh();
							oModel.updateBindings();	
						}	
				},
				error: function(oError) {
					
				}
			});
			
			
			/************ Setting FAD and Non-FAD Values in the Header Bar *************/
			
			
			var dashboardModelFAD;
			var entitySetFAD;
			var calculationFlag;
			var FADvsNFADKey;
			var factoryLeadsFADKey;
			var countDistinctFADKey;
			var factoryLeadsNFADKey;
			var countDistinctNFADKey;
			
			var FADselectionParameters;
			
			
			// Only No Filter is present
			if (sBrandValue === "" && sDistributorValue.length === 0) {
				
				var yFilter = [];
				
				if (sDateTimeKey === "LY") {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_NoFilter_LY";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0013Results";
					FADvsNFADKey = "ZFAD_NFAD_04_LY";
					countDistinctFADKey = "ZCN_FAD_DL_04_LY";
				} else {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_NoFilter";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0009Results";
					FADvsNFADKey = "ZFAD_NFAD_04";
					countDistinctFADKey = "ZCN_FAD_DL_04";
				}
				calculationFlag = 0;
				
				FADselectionParameters = FADvsNFADKey + "," + countDistinctFADKey;
			}


			// Only Brand Filter is present
			if (sBrandValue !== "" && sDistributorValue.length === 0) {
				
				var yFilter = FADFilters;
				
				if (sDateTimeKey === "LY") {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_B_LY";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0011Results";
					FADvsNFADKey = "ZFAD_NFAD_02_LY";
					countDistinctFADKey = "ZCN_FAD_DL_02_LY";
				} else {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_B";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0007Results";
					FADvsNFADKey = "ZFAD_NFAD_02";
					countDistinctFADKey = "ZCN_FAD_DL_02";
				}
				calculationFlag = 0;
				
				FADselectionParameters = FADvsNFADKey + "," + countDistinctFADKey;
				
			}


			// Only Distributor Filter is present
			if (sBrandValue === "" && sDistributorValue.length !== 0) {
				
				var yFilter = FADFilters;
				
				if (sDateTimeKey === "LY") {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_D_LY";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0012Results";
					factoryLeadsFADKey = "ZF_CPO_FAD_Y_03_LY";
					countDistinctFADKey = "ZCN_FAD_DL_03_LY";
					factoryLeadsNFADKey = "ZF_CPO_FAD_N_03_LY";
					countDistinctNFADKey = "ZCN_NONFAD_DL_03_LY";
				} else {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_D";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0008Results";
					factoryLeadsFADKey = "ZF_CPO_FAD_Y_03";
					countDistinctFADKey = "ZCN_FAD_DL_03";
					factoryLeadsNFADKey = "ZF_CPO_FAD_N_03";
					countDistinctNFADKey = "ZCN_NONFAD_DL_03";
				}
				calculationFlag = 1;
				
				FADselectionParameters = countDistinctFADKey + "," + factoryLeadsFADKey + "," + factoryLeadsNFADKey + "," + countDistinctNFADKey;
			}


			// Both Brand & Distributor Filter is present
			if (sBrandValue !== "" && sDistributorValue.length !== 0) {
				
				var filterModelFAD = new Filter(FADFilters, true);
				var yFilter = [];
				yFilter.push(filterModelFAD);
				
				if (sDateTimeKey === "LY") {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_B&D_LY";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0010Results";
					factoryLeadsFADKey = "ZF_CPO_FAD_Y_01_LY";
					countDistinctFADKey = "ZCN_FAD_DL_01_LY";
					factoryLeadsNFADKey = "ZF_CPO_FAD_N_01_LY";
					countDistinctNFADKey = "ZCN_NONFAD_DL_01_LY";
				} else {
					dashboardModelFAD = "DashboardFirstScreenModel_KPIs_B&D";
					entitySetFAD = "/ZCV_CPCLG_SC01_Q0006Results";
					factoryLeadsFADKey = "ZF_CPO_FAD_Y_01";
					countDistinctFADKey = "ZCN_FAD_DL_01";
					factoryLeadsNFADKey = "ZF_CPO_FAD_N_01";
					countDistinctNFADKey = "ZCN_NONFAD_DL_01";
				}
				calculationFlag = 1;
				
				FADselectionParameters = countDistinctFADKey + "," + factoryLeadsFADKey + "," + factoryLeadsNFADKey + "," + countDistinctNFADKey;
			}
			
			
			
			me.FADModel = me.getOwnerComponent().getModel(dashboardModelFAD);
			
			me.FADModel.read(entitySetFAD,{
				
				urlParameters: {
					$select: FADselectionParameters,
					$format: 'json'
				},
				
				filters: yFilter,
								
				success: function (oData, response) {
					var fadVsNfadValue = 0;
					if (calculationFlag == 0) {
						fadVsNfadValue = parseFloat(oData.results[oData.results.length-1][FADvsNFADKey]);
						
						oModel.setProperty("/DistFADs",me.handleCurrencyFormatting((oData.results[oData.results.length-1][countDistinctFADKey])));
						oModel.setProperty("/TimesFADs",me.handleCurrencyFormattingDecimals(fadVsNfadValue.toFixed(2)));
					} else {
						fadVsNfadValue = parseFloat((parseFloat(oData.results[oData.results.length-1][factoryLeadsFADKey])/parseFloat(oData.results[oData.results.length-1][countDistinctFADKey]))/(parseFloat(oData.results[oData.results.length-1][factoryLeadsNFADKey])/parseFloat(oData.results[oData.results.length-1][countDistinctNFADKey])));
						
						oModel.setProperty("/DistFADs",me.handleCurrencyFormatting(parseFloat(oData.results[oData.results.length-1][countDistinctFADKey])));
						oModel.setProperty("/TimesFADs",me.handleCurrencyFormattingDecimals(fadVsNfadValue.toFixed(2)));
					}
					
					/******** Setting the Total Leads Header Bar Text ********/
					oModel.setProperty("/TotalLeads", me.handleCurrencyFormatting(parseInt(trackingLeads) + parseInt(totalLeads)));
					
					oModel.refresh();
					oModel.updateBindings();
					
				}, 
				error: function (oError) {}
			});
			
		},
		
		/**
		 * Load the Second Screen. 
		 * Function call when Lead Provided View Details link is pressed
		 */ 
		handleLeadsProvidedPress: function () {
			currentScreen = 2;
			var oModel=me.getOwnerComponent().getModel("SelectionParameterModel");	
			
			me.getView().byId("idLeadsProvidedSection").setVisible(true);	
			me.getView().byId("idHomeSection").setVisible(false);	
			me.getView().byId("idOnlineScheduling").setVisible(false);	
			me.getView().byId("idKPIsText1").setVisible(false);	
			me.getView().byId("idKPIsText1expanded").setVisible(false);	
			
			var sDateTimeKey = me.getView().byId("idDateTime").getSelectedKey(); 	
			var sDistributorValue = me.getView().byId("idDistributor").getTokens(); 	
			var sBrandValue = me.getView().byId("idBrand").getSelectedKey();	
			var sDealerValue = me.getView().byId("idDealer").getTokens();	
			var sCallTypesValue = me.getView().byId("idCallTypes").getValue();	
			var sCampaign = me.getView().byId("idCampaignLeadsProvided").getTokens();	
			var sStates = me.getView().byId("idLeadsProvidedStates").getTokens();	
			
			
			/************ Setting Filter Values **************/
			var additionalSelectParameters = "";
			
			var allFilters = []
			if (sBrandValue !== "") {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HGB2ED4OKF9J5AIITF49DYZ2BA";
				var brandFilter = new sap.ui.model.Filter("A2HGB2ED4OKF9J5AIITF49DYZ2BA", sap.ui.model.FilterOperator.EQ, sBrandValue);
				allFilters.push(brandFilter);
			}
			if (sDistributorValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HHDBJ1ZTDJT4I2RACFYWLNOBX9";
				var currentDistributorIds = [];
							
				for (var i = 0; i < sDistributorValue.length; i++) {
					var newArray = [];
					newArray = oModel.getData().Distributor.filter(function (el) {
						  return el.DistributorText == sDistributorValue[i].getText();
					});
					currentDistributorIds.push(newArray[0].DistributorKey);
				}
				
				var distributorFilters = []
				for (var i = 0; i < currentDistributorIds.length; i++) {
					var distributorFilter = new sap.ui.model.Filter("A2HHDBJ1ZTDJT4I2RACFYWLNOBX9", sap.ui.model.FilterOperator.EQ, currentDistributorIds[i]);
					distributorFilters.push(distributorFilter);
					
				}
				var distributorFilterModel = new Filter(distributorFilters, false);
				allFilters.push(distributorFilterModel);
			}
			if (sDealerValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HH1AHVH1XFP2B8U26XY6E1QA0E";
				var currentDealerIds = [];
				
				var dealerFilters = []
				for (var i = 0; i < sDealerValue.length; i++) {
					var dealerFilter = new sap.ui.model.Filter("A2HH1AHVH1XFP2B8U26XY6E1QA0E", sap.ui.model.FilterOperator.EQ, sDealerValue[i].getText());
					dealerFilters.push(dealerFilter);
					
				}
				var dealerFilterModel = new Filter(dealerFilters, false);
				allFilters.push(dealerFilterModel);
			}
			if (sStates.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HRGR7SP5KY5T1Q9QHRQCALDERH";
				var currentStateIds = [];
				
				var stateFilters = []
				for (var i = 0; i < sStates.length; i++) {
					var stateFilter = new sap.ui.model.Filter("A2HRGR7SP5KY5T1Q9QHRQCALDERH", sap.ui.model.FilterOperator.EQ, sStates[i].getText());
					stateFilters.push(stateFilter);
					
				}
				var stateFilterModel = new Filter(stateFilters, false);
				allFilters.push(stateFilterModel);
				
			}
			if (sCampaign.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HGKN4494F3PQR2SQBH4PWDIAE1";
				var currentCampaignIds = [];
				
				var campaignFilters = []
				for (var i = 0; i < sCampaign.length; i++) {
					var campaignFilter = new sap.ui.model.Filter("A2HGKN4494F3PQR2SQBH4PWDIAE1", sap.ui.model.FilterOperator.EQ, sCampaign[i].getText());
					campaignFilters.push(campaignFilter);
					
				}
				var campaignFilterModel = new Filter(campaignFilters, false);
				allFilters.push(campaignFilterModel);
				
			}
			
			var dashboardScreenModelQ13;
			var dashboardScreenModelQ2;
			var dashboardScreenModelQ4A;
			var dashboardScreenModelQ4B;
			
			var entitySetQuad13;
			var entitySetQuad2;
			var entitySetQuad4A;
			var entitySetQuad4B;
			
			var callCountQuad13;
			var callCountQuad2;
			var callCountQuad4A;
			var callCountQuad4B;
			
			var headerModel;
			var entitySetHeader;
			var callCountHeader;
			
			if(sDateTimeKey==="LY"){	
					
				dashboardScreenModelQ13 = "DashboardSecondScreenModelQ1AndQ3_LY";
				dashboardScreenModelQ2 = "DashboardSecondScreenModelQ2_LY";
				dashboardScreenModelQ4B = "DashboardSecondScreenModelQ4A_LY";
				dashboardScreenModelQ4A = "DashboardSecondScreenModelQ4B_LY";
				entitySetQuad13 = "/ZCV_CPCLG_SC2A_Q0005Results";
				entitySetQuad2 = "/ZCV_CPCLG_SC2A_Q0006Results";
				entitySetQuad4A = "/ZCV_CPCLG_SC2A_Q0008Results";
				entitySetQuad4B= "/ZCV_CPCLG_SC2A_Q0007Results";
					
				
				if (sCallTypesValue === "Sales Call"){	
					callCountQuad13 = "ZCNT_SACAL_05";	
					callCountQuad2 = "ZCNT_SACAL_06";
					callCountQuad4A = "ZCNT_SACAL_08";
					callCountQuad4B = "ZCNT_SACAL_07";
				} else if (sCallTypesValue === "Service Call") {	
					callCountQuad13 = "ZCNT_SRCAL_05";	
					callCountQuad2 = "ZCNT_SRCAL_06";
					callCountQuad4A = "ZCNT_SRCAL_08";
					callCountQuad4B = "ZCNT_SRCAL_07";
				} else if (sCallTypesValue === "General Business Call") {	
					callCountQuad13 = "ZCNT_GBISCAL_05";	
					callCountQuad2 = "ZCNT_GBISCAL_06";
					callCountQuad4A = "ZCNT_GBISCAL_08";
					callCountQuad4B = "ZCNT_GBISCAL_07";
				} else if (sCallTypesValue === "Busy-No Answer") {	
					callCountQuad13 = "ZCNT_BNOA_05";	
					callCountQuad2 = "ZCNT_BNOA_06";
					callCountQuad4A = "ZCNT_BNOA_08";
					callCountQuad4B = "ZCNT_BNOA_07";
				} else if (sCallTypesValue === "Hang-Up") {	
					callCountQuad13 = "ZCNT_HNGUP_05";	
					callCountQuad2 = "ZCNT_HNGUP_06";
					callCountQuad4A = "ZCNT_HNGUP_08";
					callCountQuad4B = "ZCNT_HNGUP_07";	
				} else {
					callCountQuad13 = "ZCAL_CNT_05";	
					callCountQuad2 = "ZCAL_CNT_06";
					callCountQuad4A = "ZCAL_CNT_08";
					callCountQuad4B = "ZCAL_CNT_07";
				}	
			
			}else{	
				
				dashboardScreenModelQ13 = "DashboardSecondScreenModelQ1AndQ3";
				dashboardScreenModelQ2 = "DashboardSecondScreenModelQ2";
				dashboardScreenModelQ4B = "DashboardSecondScreenModelQ4A";
				dashboardScreenModelQ4A = "DashboardSecondScreenModelQ4B";	
				entitySetQuad13 = "/ZCV_CPCLG_SC2A_Q0009Results";
				entitySetQuad2 = "/ZCV_CPCLG_SC2A_Q0011Results";
				entitySetQuad4A = "/ZCV_CPCLG_SC2A_Q0004Results";
				entitySetQuad4B = "/ZCV_CPCLG_SC2A_Q0003Results";
					
				
				if (sCallTypesValue === "Sales Call"){	
					callCountQuad13 = "ZCNT_SACAL_01";	
					callCountQuad2 = "ZCNT_SACAL_02";
					callCountQuad4A = "ZCNT_SACAL_04";
					callCountQuad4B = "ZCNT_SACAL_03";
				} else if (sCallTypesValue === "Service Call") {	
					callCountQuad13 = "ZCNT_SRCAL_01";	
					callCountQuad2 = "ZCNT_SRCAL_02";
					callCountQuad4A = "ZCNT_SRCAL_04";
					callCountQuad4B = "ZCNT_SRCAL_03";
				} else if (sCallTypesValue === "General Business Call") {	
					callCountQuad13 = "ZCNT_GBISCAL_01";	
					callCountQuad2 = "ZCNT_GBISCAL_02";
					callCountQuad4A = "ZCNT_GBISCAL_04";
					callCountQuad4B = "ZCNT_GBISCAL_03";
				} else if (sCallTypesValue === "Busy-No Answer") {	
					callCountQuad13 = "ZCNT_BNOA_01";	
					callCountQuad2 = "ZCNT_BNOA_02";
					callCountQuad4A = "ZCNT_BNOA_04";
					callCountQuad4B = "ZCNT_BNOA_03";
				} else if (sCallTypesValue === "Hang-Up") {	
					callCountQuad13 = "ZCNT_HNGUP_01";	
					callCountQuad2 = "ZCNT_HNGUP_02";
					callCountQuad4A = "ZCNT_HNGUP_04";
					callCountQuad4B = "ZCNT_HNGUP_03";	
				} else {
					callCountQuad13 = "ZCAL_CNT_01";	
					callCountQuad2 = "A006NZKS3HHO0DQUFQH61B224S";
					callCountQuad4A = "ZCAL_CNT_04";
					callCountQuad4B = "ZCAL_CNT_03";
				}	
			}
			
			
			
			
			/************* Quadrant 1 *************/
			me.getView().byId("quadrant1").setBusy(true);
			
			var filterModel = new Filter(allFilters, true);
			var xFilter = [];
			xFilter.push(filterModel);
			
			var quadModel1 = me.getOwnerComponent().getModel(dashboardScreenModelQ13);
			quadModel1.read(entitySetQuad13,{
				urlParameters: {
					$select: 'A2HR9LC1UKUYRQBWF4HWT72AH5O7,' + callCountQuad13,
					$format: 'json'
				},
				filters: xFilter,
				success: function(oData, response) {
					
					
					oModel.setProperty("/SocialMedia","");
					oModel.setProperty("/Digital","");
					oModel.setProperty("/DirectMail","");
					oModel.setProperty("/Email","");
					oModel.setProperty("/GenAdv","");
					oModel.setProperty("/Locator","");
					oModel.setProperty("/OnlineScheduling","");
					oModel.setProperty("/Print","");
					oModel.setProperty("/Radio","");
					oModel.setProperty("/SocialMedia","");
					oModel.setProperty("/WebCampaigns","");
					oModel.setProperty("/Hardware","");
					
					
					var totalLeads = 0;
					for (var i = 0; i < oData.results.length; i++) {
						totalLeads = totalLeads + parseInt(oData.results[i][callCountQuad13]);
						if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Digital") {
							oModel.setProperty("/Digital",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Direct Mail") {
							oModel.setProperty("/DirectMail",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Email") {
							oModel.setProperty("/Email",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "General Advertising") {
							oModel.setProperty("/GenAdv",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Locator") {
							oModel.setProperty("/Locator",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Online Scheduling") {
							oModel.setProperty("/OnlineScheduling",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Print") {
							oModel.setProperty("/Print",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Radio") {
							oModel.setProperty("/Radio",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Social Media") {
							oModel.setProperty("/SocialMedia",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "Web Campaigns") {
							oModel.setProperty("/WebCampaigns",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						} else if (oData.results[i].A2HR9LC1UKUYRQBWF4HWT72AH5O7 === "DLS ACE Hardware Pro") {
							oModel.setProperty("/Hardware",me.handleCurrencyFormatting(oData.results[i][callCountQuad13]));
						}
					}
					
					// Set the Total Leads Text in the Header Bar
					oModel.setProperty("/TotalLeads",me.handleCurrencyFormatting(totalLeads));
					
					me.getView().byId("quadrant1").setBusy(false);
					
				},
				error: function(oError){}
			});
			
			
			/************* Quadrant 2 *************/
			me.getView().byId("quadrant2").setBusy(true);
			var quadModel2 = me.getOwnerComponent().getModel(dashboardScreenModelQ2);
			quadModel2.read(entitySetQuad2,{
				urlParameters: {
					$select: 'A2HOKNREC4Q52E51AOCJH26IXGQX_T,' + callCountQuad2 + additionalSelectParameters,
					$format: 'json'
				},
				filters: xFilter,
				success: function(oData, response) {
					
					for (var i = 0; i < oData.results.length; i++) {
						oModel.getData().LeadsFactory.push({	
							LeadsFactoryMonth:oData.results[i].A2HOKNREC4Q52E51AOCJH26IXGQX_T,	
							CallCount:oData.results[i][callCountQuad2]	
						});	
					}
					
					var aLeadsFactory = oModel.getData().LeadsFactory.reduce(function(x, i) { 	
						var name = i.LeadsFactoryMonth 	
						var count = +i.CallCount 	
						x[name] = (x[name] || 0) + parseInt(count) 	
						return x 	
					}, {});	

					delete aLeadsFactory.undefined;

					var aLeadsFactoryConsolidated = Object.keys(aLeadsFactory).map(function(name) { 	
						if (name !== "undefined") {
							return { 	
								Month: name, 	
								CallCount: aLeadsFactory[name] 	
							} 	
						}
					}); 
					
					var orderMon = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep:9, Oct:10, Nov:11, Dec:12 };	
					aLeadsFactoryConsolidated.sort(function (a, b) {	
						return orderMon[a.Month] - orderMon[b.Month];	
					});	
					
					oModel.getData().LeadsFactory = aLeadsFactoryConsolidated;
					oModel.refresh();
					oModel.updateBindings();
					me.getView().byId("quadrant2").setBusy(false);
			
				},
				error: function(oError){}
			});
			
			
			
			/************* Quadrant 3 *************/
			me.getView().byId("quadrant3").setBusy(true);
			var quadModel3 = me.getOwnerComponent().getModel(dashboardScreenModelQ13);
			quadModel3.read(entitySetQuad13,{
				urlParameters: {
					$select: 'A2HRGR7SP5KY5T1Q9QHRQCALDERH,' + callCountQuad13 + additionalSelectParameters,
					$format: 'json'
				},
				filters: xFilter,
				success: function(oData, response) {
					oModel.getData().LeadsFactoryStates = [];
					for (var i = 0; i < oData.results.length; i++) {
						oModel.getData().LeadsFactoryStates.push({	
							States:oData.results[i].A2HRGR7SP5KY5T1Q9QHRQCALDERH,	
							CallCount:oData.results[i][callCountQuad13]	
						});
					}
					
					
					var aLeadsFactoryStates = oModel.getData().LeadsFactoryStates.reduce(function(x, i) { 	
						var name = i.States 	
						var count = 0;
						if (i.CallCount !== undefined) {
							count = +i.CallCount
						}
						x[name] = (x[name] || 0) + parseInt(count) 	
						return x 	
					}, {});	
					var aLeadsFactoryStatesConsolidated = Object.keys(aLeadsFactoryStates).map(function(name) { 	
						return { 	
							States: "US-" + name, 	
							CallCount: aLeadsFactoryStates[name] 	
						} 	
					});	
					
					
					oModel.getData().LeadsFactoryStates=aLeadsFactoryStatesConsolidated;
					var allCallCounts = [];	
					for (var i = 0; i <= oModel.getData().LeadsFactoryStates.length ; i++) {	
						if (oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount") !== undefined) {	
							allCallCounts.push(oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount"));	
						}	
					}	
					if (allCallCounts.length === 0) {	
						allCallCounts.push(0);	
					}	

					allCallCounts = allCallCounts.sort(function(a, b){return a-b});	

					var allCallCountsTemp = allCallCounts.filter(function onlyUnique(value, index, self) { 	
						return self.indexOf(value) === index;	
					});

					// Quartile Calculation
					var startingPoint = allCallCountsTemp[0];	
					var median;	
					if (allCallCountsTemp.length%2==0) {	
						median = allCallCountsTemp[Math.floor((allCallCountsTemp.length/2) -1)];	
					} else {	
						median = allCallCountsTemp[Math.floor(((allCallCountsTemp.length+1)/2) -1)];	
					}	
					var lowerMedian;	
					var upperMedian;	
					if (allCallCountsTemp.indexOf(median)%2==0) {	
						lowerMedian = allCallCountsTemp[Math.floor((allCallCountsTemp.indexOf(median))/2)];	
						upperMedian = allCallCountsTemp[Math.floor((allCallCountsTemp.indexOf(median) + 1 + allCallCountsTemp.length)/2)];	
					} else {	
						lowerMedian = allCallCountsTemp[Math.floor(((allCallCountsTemp.indexOf(median))+1)/2)];	
						upperMedian = allCallCountsTemp[Math.floor((allCallCountsTemp.indexOf(median) + allCallCountsTemp.length)/2)];	
					}	

					var endingPoint = allCallCountsTemp[allCallCountsTemp.length-1];	

					startingPoint = (startingPoint == undefined) || (isNaN(startingPoint)) ? 0 : startingPoint;
					lowerMedian = (lowerMedian == undefined) || (isNaN(lowerMedian)) ? 0 : lowerMedian;
					median = (median == undefined) || (isNaN(median)) ? 0 : median;
					upperMedian = (upperMedian == undefined) || (isNaN(upperMedian)) ? 0 : upperMedian;
					endingPoint = (endingPoint == undefined) || (isNaN(endingPoint)) ? 0 : endingPoint;

					var rangeText = {};

					me.getView().byId("legend1").setVisible(true);	
					me.getView().byId("legend2").setVisible(true);	
					me.getView().byId("legend3").setVisible(true);	
					me.getView().byId("legend4").setVisible(true);

					if (allCallCountsTemp.length === 1) {	
						rangeText = {
								range1: "0",
								range2: "0",
								range3: "0",
								range4: me.rangeCalculator(allCallCountsTemp[0], false)
						};

						for (var i = 0; i <= oModel.getData().LeadsFactoryStates.length ; i++) {	
							var callCount = oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount");	
							oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(30,87,117)");	
						}
						me.getView().byId("legend1").setVisible(false);	
						me.getView().byId("legend2").setVisible(false);	
						me.getView().byId("legend3").setVisible(false);	
						me.getView().byId("legend4").setText(rangeText.range4);
					} else if (allCallCountsTemp.length === 2) {	
						rangeText = {
								range1: "0",
								range2: "0",
								range3: "0",
								range4: me.rangeCalculator(allCallCountsTemp[0], false) + " - " + me.rangeCalculator(allCallCountsTemp[1], false)
						};

						for (var i = 0; i <= oModel.getData().LeadsFactoryStates.length ; i++) {	
							var callCount = oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount");	
							if (callCount >= allCallCountsTemp[0] && callCount <= allCallCountsTemp[1]) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(30,87,117)");	
							}	
						}
						me.getView().byId("legend1").setVisible(false);	
						me.getView().byId("legend2").setVisible(false);	
						me.getView().byId("legend3").setVisible(false);	
						me.getView().byId("legend4").setText(rangeText.range4);
					} else if (allCallCountsTemp.length === 3) {	
						rangeText = {
								range1: "0",
								range2: "0",
								range3: me.rangeCalculator(allCallCountsTemp[0], false) + " - " + me.rangeCalculator(allCallCountsTemp[1], false),
								range4: me.rangeCalculator(allCallCountsTemp[1], true) + " - " + me.rangeCalculator(allCallCountsTemp[2], false)
						};

						for (var i = 0; i <= oModel.getData().LeadsFactoryStates.length ; i++) {	
							var callCount = oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount");	
							if (callCount >= allCallCountsTemp[0] && callCount < allCallCountsTemp[1]) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(0,143,214)");	
							} else if (callCount >= allCallCountsTemp[1] && callCount <= allCallCountsTemp[2]) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(30,87,117)");	
							}	
						}

						me.getView().byId("legend1").setVisible(false);	
						me.getView().byId("legend2").setVisible(false);	
						me.getView().byId("legend3").setText(rangeText.range3);	
						me.getView().byId("legend4").setText(rangeText.range4);
					} else if (allCallCountsTemp.length === 4) {	
						rangeText = {
								range1: "0",
								range2: me.rangeCalculator(allCallCountsTemp[0], false) + " - " + me.rangeCalculator(allCallCountsTemp[1], false),
								range3: me.rangeCalculator(allCallCountsTemp[1], true) + " - " + me.rangeCalculator(allCallCountsTemp[2], false),
								range4: me.rangeCalculator(allCallCountsTemp[2], true) + " - " + me.rangeCalculator(allCallCountsTemp[3], false)
						};

						for (var i = 0; i <= oModel.getData().LeadsFactoryStates.length ; i++) {	
							var callCount = oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount");	
							if (callCount >= allCallCountsTemp[0] && callCount < allCallCountsTemp[1]) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color",  "rgb(92,186,229)");	
							} else if (callCount >= allCallCountsTemp[1] && callCount < allCallCountsTemp[2]) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(0,143,214)");	
							} else if (callCount >= allCallCountsTemp[2] && callCount <= allCallCountsTemp[3]) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(30,87,117)");	
							}	
						}

						me.getView().byId("legend1").setVisible(false);	
						me.getView().byId("legend2").setText(rangeText.range2);	
						me.getView().byId("legend3").setText(rangeText.range3);	
						me.getView().byId("legend4").setText(rangeText.range4);

					} else if (allCallCountsTemp.length === 5) {
						rangeText = {
								range1: me.rangeCalculator(allCallCountsTemp[0], false) + " - " + me.rangeCalculator(allCallCountsTemp[1], false),
								range2: me.rangeCalculator(allCallCountsTemp[1], true) + " - " + me.rangeCalculator(allCallCountsTemp[2], false),
								range3: me.rangeCalculator(allCallCountsTemp[2], true) + " - " + me.rangeCalculator(allCallCountsTemp[3], false),
								range4: me.rangeCalculator(allCallCountsTemp[3], true) + " - " + me.rangeCalculator(allCallCountsTemp[4], false)
						};

						for (var i = 0; i <= oModel.getData().LeadsFactoryStates.length ; i++) {	
							var callCount = oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount");	
							if (callCount >= startingPoint && callCount < lowerMedian){	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(171,219,242)");	
							} else if (callCount >= lowerMedian && callCount < median) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color",  "rgb(92,186,229)");	
							} else if (callCount >= median && callCount < upperMedian) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(0,143,214)");	
							} else if (callCount >= upperMedian && callCount <= endingPoint) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(30,87,117)");	
							}	
						}

						me.getView().byId("legend1").setText(rangeText.range1);	
						me.getView().byId("legend2").setText(rangeText.range2);	
						me.getView().byId("legend3").setText(rangeText.range3);	
						me.getView().byId("legend4").setText(rangeText.range4);
					} else {
						rangeText = {
								range1: 0 + " - " + me.rangeCalculator(lowerMedian, false),
								range2: me.rangeCalculator(lowerMedian, true) + " - " + me.rangeCalculator(median, false),
								range3: me.rangeCalculator(median, true) + " - " + me.rangeCalculator(upperMedian, false),
								range4: me.rangeCalculator(upperMedian, true) + " - " + me.rangeCalculator(endingPoint, false)
						};

						for (var i = 0; i <= oModel.getData().LeadsFactoryStates.length ; i++) {	
							var callCount = oModel.getProperty("/LeadsFactoryStates/" + i + "/CallCount");	
							if (callCount >= startingPoint && callCount < lowerMedian){	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(171,219,242)");	
							} else if (callCount >= lowerMedian && callCount < median) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color",  "rgb(92,186,229)");	
							} else if (callCount >= median && callCount < upperMedian) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(0,143,214)");	
							} else if (callCount >= upperMedian && callCount <= endingPoint) {	
								oModel.setProperty("/LeadsFactoryStates/" + i + "/color", "rgb(30,87,117)");	
							}	
						}
						me.getView().byId("legend1").setText(rangeText.range1);	
						me.getView().byId("legend2").setText(rangeText.range2);	
						me.getView().byId("legend3").setText(rangeText.range3);	
						me.getView().byId("legend4").setText(rangeText.range4);
					}	
					
					oModel.refresh();
					oModel.updateBindings();
					
					me.getView().byId("quadrant3").setBusy(false);
					
				},
				error: function(oError){}
			});
			
			
			/************* Quadrant 4A *************/
			me.getView().byId("quadrant4").setBusy(true);
			var quadModel4A = me.getOwnerComponent().getModel(dashboardScreenModelQ4A);
			quadModel4A.read(entitySetQuad4A,{
				urlParameters: {
					$select: 'A2HPYUNND81E6ZQDAXQDPL7F6TWD_T,A2HPYUNND81E6ZQDAXQDPL7F6TWD,' + callCountQuad4A,
					$format: 'json'
				},
				filters: xFilter,
				success: function(oData, response) {
					oModel.getData().LeadsFactoryByTime = [];
					for (var i = 0; i < oData.results.length; i++) {
						oModel.getData().LeadsFactoryByTime.push({
							Time: oData.results[i].A2HPYUNND81E6ZQDAXQDPL7F6TWD_T,
							Key: oData.results[i].A2HPYUNND81E6ZQDAXQDPL7F6TWD,
							CallCount: parseInt(oData.results[i][callCountQuad4A])
						});
					}
					
					oModel.getData().LeadsFactoryByTime.sort(function(a, b){	
						return a.Key - b.Key;	
					});	
					
					var aLeadsFactoryByTime = oModel.getData().LeadsFactoryByTime.reduce(function(x, i) { 	
						var name = i.Time 	
						var count = +i.CallCount 	
						x[name] = (x[name] || 0) + parseInt(count) 	
						return x 	
					}, {});	

					delete aLeadsFactoryByTime.undefined;

					var aLeadsFactoryByTimeConsolidated = Object.keys(aLeadsFactoryByTime).map(function(name) { 	
						return { 	
							Time: name, 	
							CallCount: aLeadsFactoryByTime[name] 	
						} 	
					});	
					
					var orderTime = { '12 AM': 1, '01 AM': 2, '02 AM': 3, '03 AM': 4, '04 AM': 5, '05 AM': 6, '06 AM': 7, '07 AM': 8, '08 AM': 9, '09 AM': 10, '10 AM': 11, '11 AM': 12, '12 PM': 13, '01 PM': 14, '02 PM': 15, '03 PM': 16, '04 PM': 17, '05 PM': 18, '06 PM': 19, '07 PM': 20, '08 PM': 21, '09 PM': 22, '10 PM': 23, '11 PM': 24 };	
					aLeadsFactoryByTimeConsolidated.sort(function (a, b) {	
						return orderTime[a.Time] - orderTime[b.Time];	
					});
										
					for (var i = 0; i < aLeadsFactoryByTimeConsolidated.length; i++) {
						aLeadsFactoryByTimeConsolidated.splice(i + 1, 1);
					}
					
					oModel.getData().LeadsFactoryByTime = aLeadsFactoryByTimeConsolidated;
					
					oModel.refresh();
					oModel.updateBindings();
					me.getView().byId("quadrant4").setBusy(false);
				},
				error: function (oError) {}
				
			});
					
			
			/************* Quadrant 4B *************/
			me.getView().byId("quadrant4").setBusy(true);
			var quadModel4B = me.getOwnerComponent().getModel(dashboardScreenModelQ4B);
			quadModel4B.read(entitySetQuad4B,{
				urlParameters: {
					$select: 'A2HRIYE19QCCPJF30J0LQGZJS5HC,' + callCountQuad4B,
					$format: 'json'
				},
				filters: xFilter,
				success: function(oData, response) {
					oModel.getData().LeadsFactoryByDay = [];
					for (var i = 0; i < oData.results.length; i++) {
						oModel.getData().LeadsFactoryByDay.push({
							Time: oData.results[i].A2HRIYE19QCCPJF30J0LQGZJS5HC,
							CallCount: parseInt(oData.results[i][callCountQuad4B])
						});
					}
					var aLeadsFactoryByDay = oModel.getData().LeadsFactoryByDay.reduce(function(x, i) { 	
						var name = i.Time 	
						var count = +i.CallCount 	
						x[name] = (x[name] || 0) + parseInt(count) 	
						return x 	
					}, {});	

					delete aLeadsFactoryByDay.undefined;

					var aLeadsFactoryByDayConsolidated = Object.keys(aLeadsFactoryByDay).map(function(name) { 	
						return { 	
							Time: name, 	
							CallCount: aLeadsFactoryByDay[name] 	
						} 	
					});	
					
					var order = { SUN: 1, MON: 2, TUE: 3, WED: 4, THU: 5, FRI: 6, SAT: 7 };	
					aLeadsFactoryByDayConsolidated.sort(function (a, b) {	
						return order[a.Time] - order[b.Time];	
					});	
					
					oModel.getData().LeadsFactoryByDay = aLeadsFactoryByDayConsolidated;
					
					oModel.refresh();
					oModel.updateBindings();
					me.getView().byId("quadrant4").setBusy(false);
				},
				error: function (oError) {}
			});
			
		},	

		rangeCalculator: function(number, incrementFlag) {
			var range;
			if (number.toString().length < 4) {
				var dividingFactor = 10**(number.toString().length-1);
				if (incrementFlag === true) {
					range = (Math.round(number/dividingFactor)*dividingFactor)+1;
				} else {
					range = (Math.round(number/dividingFactor)*dividingFactor);
				}
			} else {
				if (incrementFlag === true) {
					range = Math.round(number/1000)+0.1 + "K";
				} else {
					range = Math.round(number/1000) + "K";
				}
			}
			return range;
		},
		
		/**
		 * Function call to Filter Based on Brand
		 */ 
		handleBrandChange:function(Evt){	
			var sBrandValue;
			
			if (Evt.getSource().mProperties.hasOwnProperty("selectedKey") === true ) {
				me.getView().byId("idBrandCancelIcon").setVisible(true);
			} else {
				me.getView().byId("idBrand").setSelectedKey();
				me.getView().byId("idBrandCancelIcon").setVisible(false);	
			}
			
			if(currentScreen=== 1){
				me.loadScreen1();
			}else if(currentScreen === 2){	
				me.handleLeadsProvidedPress();	
			}else if(currentScreen === 3){
				me.handleOnlineSchedulingPress();
			}	
		},	
	

		/**
		 * Function call to Filter Based on Distributor
		 */ 
		handleDistributorChange:function(Evt){	
			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");	
			if(Evt!==undefined){	
				for (var i = 0; i < oModel.getData().Distributor.length; i++) {
					oModel.getData().Distributor[i].selected=false;
				}
				me.getView().byId("idDistributor").destroyTokens();	
			}	
			var sDistributorValue=me.getView().byId("idDistributor").getTokens(); 	
			if(sDistributorValue.length!==0){	
				me.getView().byId("idDistrCancelIcon").setVisible(true);	
			}else{	
				me.getView().byId("idDistrCancelIcon").setVisible(false);	
			}	
			
			if(currentScreen===1){
				me.loadScreen1();
			}else if(currentScreen===2){	
				me.handleLeadsProvidedPress();	
			}else if(currentScreen === 3){
				me.handleOnlineSchedulingPress();
			}	
		},	
		
		/**
		 * Function call to Filter Based on Dealer
		 */ 
		handleDealerChange:function(Evt){	
			
			var oModel=me.getOwnerComponent().getModel("SelectionParameterModel");	
			
			if(Evt!==undefined){	
				for (var i = 0; i < oModel.getData().Dealer.length; i++) {
					oModel.getData().Dealer[i].selected=false;
				}
				me.getView().byId("idDealer").destroyTokens();	
			}
			
			var sDealerValue = me.getView().byId("idDealer").getTokens();	
			if(sDealerValue.length!==0){	
				me.getView().byId("idDealerCancelIcon").setVisible(true);	
			}else{	
				me.getView().byId("idDealerCancelIcon").setVisible(false);	
			}	
			
			if(currentScreen===1){
				me.loadScreen1();
			}else if(currentScreen===2){
				me.handleLeadsProvidedPress();
			}else if(currentScreen === 3){
				me.handleOnlineSchedulingPress();
			}	
		},	
		
		/**
		 * Function call for Date Time Change
		 */ 
		handleDateTimeChange:function(){	
			if(currentScreen === 1){
				me.loadScreen1();
			}else if(currentScreen === 2){	
				me.handleLeadsProvidedPress();	
			}else if(currentScreen === 3){
				me.handleOnlineSchedulingPress();
			}
		},	
		
		/**
		 * Function call for Currency Formatting
		 */ 
		handleCurrencyFormatting:function(sVal){	
			var oLocale = new sap.ui.core.Locale("en-US");	
			var oFormatOptions = {	
					showMeasure: true,	
					currencyCode: false,	
					currencyContext: 'standard',	
					decimalSeparator:".",	
					groupingSeparator:",",	
					decimals:0	
			};	
			var oCurrencyFormat = NumberFormat.getCurrencyInstance(oFormatOptions, oLocale);	
			var formattedValue = oCurrencyFormat.format(sVal);	
			return formattedValue;	
		},	
		
		/**
		 * Function call for Currency Formatting in Decimals
		 */ 
		handleCurrencyFormattingDecimals:function(sVal){	
			var oLocale = new sap.ui.core.Locale("en-US");	
			var oFormatOptions = {	
					showMeasure: true,	
					currencyCode: false,	
					currencyContext: 'standard',	
					decimalSeparator:".",	
					groupingSeparator:","	
			};	
			var oCurrencyFormat = NumberFormat.getCurrencyInstance(oFormatOptions, oLocale);	
			var formattedValue = oCurrencyFormat.format(sVal);	
			return formattedValue;	
		},	
		// Function to calculate Division
		handlePercentageCalculation:function(sVal,sTot){	
			var sPercentage=(sVal/sTot) * 100;	
			if(isNaN(sPercentage)===true){	
				sPercentage=0;	
				return sPercentage.toFixed(2);	
			}else{	
				return sPercentage.toFixed(2);	
			}	
		},	
		// Function to calculate Percentage
		handleDivisionCalculation:function(sVal,sTot){	
			var sDivision=(sVal/sTot);	
			if(isNaN(sDivision)===true){	
				sDivision=0;	
				return sDivision.toFixed(2);	
			}else{	
				return sDivision.toFixed(2);	
			}	
		},	
		
		

		// Function call when Home button is pressed to navigate to Home Page
		handleHomeBtnPress: function () {	
			me.getView().byId("idHomeSection").setVisible(true);	
			me.getView().byId("idLeadsProvidedSection").setVisible(false);	
			me.getView().byId("idOnlineScheduling").setVisible(false);	
			me.getView().byId("idKPIsText1").setVisible(true);	
			me.getView().byId("idKPIsText1expanded").setVisible(true);	
			me.loadScreen1();
		},
		
		/**
		 * Function Call when Online Scheduling View Detail Link is pressed
		 */
		
		handleOnlineSchedulingPress: function () {
			currentScreen = 3;
			me.getView().byId("idOnlineScheduling").setVisible(true);		
			me.getView().byId("idHomeSection").setVisible(false);		
			me.getView().byId("idLeadsProvidedSection").setVisible(false);		
			me.getView().byId("idKPIsText1").setVisible(false);		
			me.getView().byId("idKPIsText1expanded").setVisible(false);		

			var sDateTimeKey = me.getView().byId("idDateTime").getSelectedKey(); 		
			var sDistributorValue = me.getView().byId("idDistributor").getTokens(); 		
			var sBrandValue = me.getView().byId("idBrand").getSelectedKey();		
			var sDealerValue = me.getView().byId("idDealer").getTokens();		
			var sStates = me.getView().byId("idStatesOnlineScheduling").getTokens();	

			var dashboardModelName;		
			var entitySet;		
			var totalOssLeadsKey;		
			var totalLeadsOfferedKey;		

			if(sDateTimeKey==="LY"){		
				dashboardModelName = "DashboardThirdScreenModel_LY";		
				entitySet = "/ZCV_CPCLG_SC03_Q0002Results";		
				totalOssLeadsKey = "Z_OSSLEPR_04";		
				totalLeadsOfferedKey = "Z_LOFRD_04";		
			}else{		
				dashboardModelName = "DashboardThirdScreenModel";		
				entitySet = "/ZCV_CPCLG_SC03_Q0001Results";		
				totalOssLeadsKey = "Z_OSSLEPR_03";		
				totalLeadsOfferedKey = "Z_LOFRD_03";		
			}		
			
			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			/************ Setting Filter Values **************/
			var additionalSelectParameters = "";
			
			var allFilters = []
			if (sBrandValue !== "") {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HGB2ED4OKF9J5AIITF49DYZ2BA";
				var brandFilter = new Filter("A2HGB2ED4OKF9J5AIITF49DYZ2BA", FilterOperator.EQ, sBrandValue);
				allFilters.push(brandFilter);
			}
			if (sDistributorValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HHDBJ1ZTDJT4I2RACFYWLNOBX9";
				var currentDistributorIds = [];
							
				for (var i = 0; i < sDistributorValue.length; i++) {
					var newArray = [];
					newArray = oModel.getData().Distributor.filter(function (el) {
						  return el.DistributorText == sDistributorValue[i].getText();
					});
					currentDistributorIds.push(newArray[0].DistributorKey);
				}
				
				var distributorFilters = []
				for (var i = 0; i < currentDistributorIds.length; i++) {
					var distributorFilter = new Filter("A2HHDBJ1ZTDJT4I2RACFYWLNOBX9", FilterOperator.EQ, currentDistributorIds[i]);
					distributorFilters.push(distributorFilter);
					
				}
				var distributorFilterModel = new Filter(distributorFilters, false);
				allFilters.push(distributorFilterModel);
			}
			if (sDealerValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HH1AHVH1XFP2B8U26XY6E1QA0E";
				var currentDealerIds = [];
				
				var dealerFilters = []
				for (var i = 0; i < sDealerValue.length; i++) {
					var dealerFilter = new Filter("A2HH1AHVH1XFP2B8U26XY6E1QA0E", FilterOperator.EQ, sDealerValue[i].getText());
					dealerFilters.push(dealerFilter);
					
				}
				var dealerFilterModel = new Filter(dealerFilters, false);
				allFilters.push(dealerFilterModel);
			}
			if (sStates.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HRGR7SP5KY5T1Q9QHRQCALDERH";
				var currentStateIds = [];
				
				var stateFilters = []
				for (var i = 0; i < sStates.length; i++) {
					var stateFilter = new Filter("A2HRGR7SP5KY5T1Q9QHRQCALDERH", FilterOperator.EQ, sStates[i].getText());
					stateFilters.push(stateFilter);
					
				}
				var stateFilterModel = new Filter(stateFilters, false);
				allFilters.push(stateFilterModel);
				
			}
			
			var filterModel = new Filter(allFilters, true);
			var xFilter = [];
			xFilter.push(filterModel);
			
			
			/***************** Quadrant 1 *****************/
			me.getView().byId("quadrant1OSS").setBusy(true);
			var quadModel1 = me.getOwnerComponent().getModel(dashboardModelName);
			quadModel1.read(entitySet,{
				urlParameters: {
					$select: 'A2HRGR7SP5KY5T1Q9QHRQCALDERH,' + totalOssLeadsKey,
					$format: 'json'
				},
				filters: xFilter,
				success: function (oData, response) {
					oModel.getData().StatesLeads = [];
					for (var i = 0; i < oData.results.length; i++) {
						oModel.getData().StatesLeads.push({	
							States: oData.results[i].A2HRGR7SP5KY5T1Q9QHRQCALDERH,	
							OssLeads: parseInt(oData.results[i][totalOssLeadsKey])	
						});
					}
					
					var aLeadsFactoryStates = oModel.getData().StatesLeads.reduce(function(x, i) { 	
						var name = i.States 	
						var count = +i.OssLeads 	
						x[name] = (x[name] || 0) + parseInt(count) 	
						return x 	
					}, {});	
					var aLeadsFactoryStatesConsolidated = Object.keys(aLeadsFactoryStates).map(function(name) { 	
						return { 	
							States: "US-" + name, 	
							OssLeads: aLeadsFactoryStates[name] 	
						} 	
					});	
					oModel.getData().StatesLeads=aLeadsFactoryStatesConsolidated;	
					var allOssLeads = [];	
					for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
						if (oModel.getProperty("/StatesLeads/" + i + "/OssLeads") !== undefined) {	
							allOssLeads.push(oModel.getProperty("/StatesLeads/" + i + "/OssLeads"));	
						}	
					}	
					allOssLeads = allOssLeads.filter(function onlyUnique(value, index, self) { 	
						return self.indexOf(value) === index;	
					});	
					allOssLeads = allOssLeads.sort(function(a, b){return a-b});	
					// Quartile Calculation
					var startingPoint = allOssLeads[0];	
					var median;	
					if (allOssLeads.length%2==0) {	
						median = allOssLeads[Math.floor((allOssLeads.length/2) -1)];	
					} else {	
						median = allOssLeads[Math.floor(((allOssLeads.length+1)/2) -1)];	
					}	
					var lowerMedian;	
					var upperMedian;	
					if (allOssLeads.indexOf(median)%2==0) {	
						lowerMedian = allOssLeads[Math.floor((allOssLeads.indexOf(median))/2)];	
						upperMedian = allOssLeads[Math.floor((allOssLeads.indexOf(median) + 1 + allOssLeads.length)/2)];	
					} else {	
						lowerMedian = allOssLeads[Math.floor(((allOssLeads.indexOf(median))+1)/2)];	
						upperMedian = allOssLeads[Math.floor((allOssLeads.indexOf(median) + allOssLeads.length)/2)];	
					}	
					lowerMedian = (Math.round(lowerMedian/10)*10);	
					median = (Math.round(median/10)*10);	
					upperMedian = (Math.round(upperMedian/10)*10);	
					endingPoint = (Math.round(endingPoint/10)*10);	
					var endingPoint = allOssLeads[allOssLeads.length-1];	

					startingPoint = (startingPoint == undefined) || (isNaN(startingPoint)) ? 0 : startingPoint;
					lowerMedian = (lowerMedian == undefined) || (isNaN(lowerMedian)) ? 0 : lowerMedian;
					median = (median == undefined) || (isNaN(median)) ? 0 : median;
					upperMedian = (upperMedian == undefined) || (isNaN(upperMedian)) ? 0 : upperMedian;
					endingPoint = (endingPoint == undefined) || (isNaN(endingPoint)) ? 0 : endingPoint;

					var rangeText = {};

					me.getView().byId("legend1onlinescheduling").setVisible(true);	
					me.getView().byId("legend2onlinescheduling").setVisible(true);	
					me.getView().byId("legend3onlinescheduling").setVisible(true);	
					me.getView().byId("legend4onlinescheduling").setVisible(true);

					if (Math.round(startingPoint) < Math.round(lowerMedian)) {
						rangeText.range1 = Math.round(startingPoint) + '-' + Math.round(lowerMedian);

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setText(rangeText.range1);	
						me.getView().byId("legend2onlinescheduling").setText(rangeText.range2);	
						me.getView().byId("legend3onlinescheduling").setText(rangeText.range3);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					} else {
						rangeText.range1 = "0";

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setVisible(false);	
						me.getView().byId("legend2onlinescheduling").setText(rangeText.range2);	
						me.getView().byId("legend3onlinescheduling").setText(rangeText.range3);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					}

					if (Math.round(lowerMedian) < Math.round(median)) {
						rangeText.range2 = Math.round(lowerMedian)+1 + '-' + Math.round(median);

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setText(rangeText.range1);	
						me.getView().byId("legend2onlinescheduling").setText(rangeText.range2);	
						me.getView().byId("legend3onlinescheduling").setText(rangeText.range3);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					} else {
						rangeText.range2 = "0";

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setText(rangeText.range1);	
						me.getView().byId("legend2onlinescheduling").setVisible(false);	
						me.getView().byId("legend3onlinescheduling").setText(rangeText.range3);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					}

					if (Math.round(median) < Math.round(upperMedian)) {
						rangeText.range3 = Math.round(median)+1 + '-' + Math.round(upperMedian);

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setText(rangeText.range1);	
						me.getView().byId("legend2onlinescheduling").setText(rangeText.range2);	
						me.getView().byId("legend3onlinescheduling").setText(rangeText.range3);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					} else {
						rangeText.range3 = "0";

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setText(rangeText.range1);	
						me.getView().byId("legend2onlinescheduling").setText(rangeText.range2);	
						me.getView().byId("legend3onlinescheduling").setVisible(false);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					}

					if (Math.round(upperMedian) < Math.round(endingPoint)) {
						rangeText.range4 = Math.round(upperMedian)+1 + '-' + Math.round(endingPoint);

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setText(rangeText.range1);	
						me.getView().byId("legend2onlinescheduling").setText(rangeText.range2);	
						me.getView().byId("legend3onlinescheduling").setText(rangeText.range3);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					} else {
						rangeText.range4 = "0";

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							if (ossLeads >= startingPoint && ossLeads < lowerMedian){	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(171,219,242)");	
							} else if (ossLeads >= lowerMedian && ossLeads < median) {	
								oModel.setProperty("/StatesLeads/" + i + "/color",  "rgb(92,186,229)");	
							} else if (ossLeads >= median && ossLeads < upperMedian) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(0,143,214)");	
							} else if (ossLeads >= upperMedian && ossLeads <= endingPoint) {	
								oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
							}	
						}	
						me.getView().byId("legend1onlinescheduling").setText(rangeText.range1);	
						me.getView().byId("legend2onlinescheduling").setText(rangeText.range2);	
						me.getView().byId("legend3onlinescheduling").setText(rangeText.range3);	
						me.getView().byId("legend4onlinescheduling").setVisible(false);	
					}


					if (allOssLeads.length === 1) {	
						upperMedian = allOssLeads[0];	
						var rangeText = {	
								"range1": "0",	
								"range2": "0",	
								"range3": "0",	
								"range4": Math.round(upperMedian)
						};

						for (var i = 0; i <= oModel.getData().StatesLeads.length ; i++) {	
							var ossLeads = oModel.getProperty("/StatesLeads/" + i + "/OssLeads");	
							oModel.setProperty("/StatesLeads/" + i + "/color", "rgb(30,87,117)");	
						}	
						me.getView().byId("legend1onlinescheduling").setVisible(false);
						me.getView().byId("legend2onlinescheduling").setVisible(false);	
						me.getView().byId("legend3onlinescheduling").setVisible(false);	
						me.getView().byId("legend4onlinescheduling").setText(rangeText.range4);	
					}	
					
					oModel.refresh();
					oModel.updateBindings();
					me.getView().byId("quadrant1OSS").setBusy(false);
					
				},
				error: function (oError){}
			});
			
			
			/*************** Progress Indicators in Quadrant 1 ****************/
			me.getView().byId("progressIndicatorsOSS").setBusy(true);
			quadModel1.read(entitySet,{
				urlParameters: {
					$select: 'A2HTU78LJBESDINNHHJFEWAXZXVY,' + totalOssLeadsKey + "," + totalLeadsOfferedKey,
					$format: 'json'
				},
				filters: xFilter,
				success: function (oData, response) {
					
					var filterDataFinalWithLeadStatus;
					var barGraphObject = {};
					
					var leadStatusTypes = ["unscheduled","scheduled","complete","offered","canceled","rejected","expired","paused"];
					
					for (var j = 0; j < leadStatusTypes.length; j++) {
						filterDataFinalWithLeadStatus=oData.results.filter(function (n){
							return  n.A2HTU78LJBESDINNHHJFEWAXZXVY===leadStatusTypes[j];
						});
						var leadsCount = 0;
						for (var i = 0; i < filterDataFinalWithLeadStatus.length; i++) {
							leadsCount = leadsCount + parseInt(filterDataFinalWithLeadStatus[i][totalOssLeadsKey]);
						}
						barGraphObject[leadStatusTypes[j]] = leadsCount;
					}
					
					
					oModel.setProperty("/OSSUnscheduled",barGraphObject.unscheduled.toString());
					oModel.setProperty("/OSSScheduled",barGraphObject.scheduled.toString());
					oModel.setProperty("/OSSCompleted",barGraphObject.complete.toString());
					oModel.setProperty("/OSSOffered",barGraphObject.offered.toString());
					oModel.setProperty("/OSSCanceled",barGraphObject.canceled.toString());
					oModel.setProperty("/OSSRejected",barGraphObject.rejected.toString());
					oModel.setProperty("/OSSExpired",barGraphObject.expired.toString());
					oModel.setProperty("/OSSPaused",barGraphObject.paused.toString());
					
					var sTotOSSLeadStatusValue= barGraphObject.unscheduled + barGraphObject.scheduled + barGraphObject.complete + barGraphObject.offered + barGraphObject.canceled + barGraphObject.rejected + barGraphObject.expired + barGraphObject.paused;	
					
					oModel.setProperty("/OSSUnscheduledPer",me.handlePercentageCalculation(barGraphObject.unscheduled,sTotOSSLeadStatusValue));
					oModel.setProperty("/OSSScheduledPer",me.handlePercentageCalculation(barGraphObject.scheduled,sTotOSSLeadStatusValue));
					oModel.setProperty("/OSSCompletedPer",me.handlePercentageCalculation(barGraphObject.complete,sTotOSSLeadStatusValue));
					oModel.setProperty("/OSSOfferedPer",me.handlePercentageCalculation(barGraphObject.offered,sTotOSSLeadStatusValue));
					oModel.setProperty("/OSSCanceledPer",me.handlePercentageCalculation(barGraphObject.canceled,sTotOSSLeadStatusValue));
					oModel.setProperty("/OSSRejectedPer",me.handlePercentageCalculation(barGraphObject.rejected,sTotOSSLeadStatusValue));
					oModel.setProperty("/OSSExpiredPer",me.handlePercentageCalculation(barGraphObject.expired,sTotOSSLeadStatusValue));
					oModel.setProperty("/OSSPausedPer",me.handlePercentageCalculation(barGraphObject.paused,sTotOSSLeadStatusValue));
					
					oModel.refresh();
					oModel.updateBindings();
					me.getView().byId("progressIndicatorsOSS").setBusy(false);
				},
				error: function (oError) {}
			});
			
			
			
			/*************** Quadrant 2 ****************/
			me.getView().byId("quadrant2OSS").setBusy(true);
			
			var quadModel2 = quadModel1;
			quadModel2.read(entitySet,{
				urlParameters: {
					$select: 'A2HTU78LJBESDINNHHJFEWAXZXVY,A2HH1AHVH1XFP2B8U26XY6E1QA0E,A2HQ3BP0M836H2ES6HU2I5A52QNJ,A2HJQR5S3MH6GGN0ZYJ6O4M6LXPR,' + totalOssLeadsKey + "," + totalLeadsOfferedKey,
					$format: 'json'
				},
				filters: xFilter,
				success: function (oData, response) {
					oModel.getData().Table = [];
					for(var i=0;i<oData.results.length;i++){		
						if (oData.results[i].A2HTU78LJBESDINNHHJFEWAXZXVY==="offered"){		
							oModel.getData().Table.push({		
								"Dealer": oData.results[i].A2HH1AHVH1XFP2B8U26XY6E1QA0E,		
								"DealerHVP": oData.results[i].A2HQ3BP0M836H2ES6HU2I5A52QNJ,		
								"FAD": oData.results[i].A2HJQR5S3MH6GGN0ZYJ6O4M6LXPR,		
								"OssLeads": parseInt(oData.results[i][totalOssLeadsKey]),		
								"LeadsOffered": parseInt(oData.results[i][totalLeadsOfferedKey])		
							});		
						}	
					}
					
					me.getView().byId("idOnlineSchedulingTable").setModel(oModel);
					oModel.refresh();
					oModel.updateBindings();
					me.getView().byId("quadrant2OSS").setBusy(false);
				},
				error: function (oError) {}
			});
			
			
			/******* Leads Awaiting Action Text and Total Leads Text in Header Bar *******/
			me.getView().byId("leadsAwaitingAction").setBusy(true);
			quadModel2.read(entitySet,{
				urlParameters: {
					$select: totalOssLeadsKey + "," + totalLeadsOfferedKey,
					$format: 'json'
				},
				filters: xFilter,
				success: function (oData, response) {
					
					var sTotAwaitingLeads=(parseFloat(oData.results[0][totalLeadsOfferedKey])/parseFloat(oData.results[0][totalOssLeadsKey]))*100;	
					if(isNaN(sTotAwaitingLeads)===true){	
						sTotAwaitingLeads=0;	
					}else{	
						sTotAwaitingLeads=sTotAwaitingLeads;	
					}
					
					oModel.setProperty("/LeadsAwaitingAction", sTotAwaitingLeads.toFixed(2).toString() + " %");
					oModel.setProperty("/TotalLeads", me.handleCurrencyFormatting(parseFloat(oData.results[0][totalOssLeadsKey])));
					
					oModel.refresh();
					oModel.updateBindings();
					me.getView().byId("leadsAwaitingAction").setBusy(false);
				},
				error: function (oError) {}
			});
		},	
		
		/**
		 * Function call to Open Sort Dialog
		 */ 
		handleSortButtonPressed: function () {	
			if (!me.SortDialog) {	
				me.SortDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.SortDialog", this);	
				me.SortDialog.addStyleClass("sapUiSizeCompact");	
			}	
			me.SortDialog.open();	
		},	
		
		/**
		 * Function call when Sort Dialog confirm button is pressed
		 */ 
		handleSortDialogConfirm: function (oEvent) {	
			var oTable = me.byId("idOnlineSchedulingTable"),	
			mParams = oEvent.getParameters(),	
			oBinding = oTable.getBinding("items"),	
			sPath,	
			bDescending,	
			aSorters = [];	
			sPath = mParams.sortItem.getKey();	
			bDescending = mParams.sortDescending;	
			aSorters.push(new Sorter(sPath, bDescending));	
			// apply the selected sort and group settings
			oBinding.sort(aSorters);	
		},	
				
		/**
		 * Function call when dealer link is pressed in screen 3
		 */ 
		handleDealerLinkPress:function(Evt){	
			BusyIndicator.show();
			var sDateTimeKey = me.getView().byId("idDateTime").getSelectedKey(); 	
			var entitySet;
			var acceptedKey;
			var noOfDaysWaitingKey;
			if(sDateTimeKey==="LY"){	
				me.oDataModelScreen3_DealerDetails= me.getOwnerComponent().getModel("DashboardThirdScreenModel_DealerDetails_LY"); // Global
				entitySet="/ZCV_CPCLG_SC03_Q0004Results";
				acceptedKey = "ZCN_STNREJ_3";
				noOfDaysWaitingKey = "ZNO_DY_WAIT_1";
			}else{	
				me.oDataModelScreen3_DealerDetails= me.getOwnerComponent().getModel("DashboardThirdScreenModel_DealerDetails"); // Global
				entitySet="/ZCV_CPCLG_SC03_Q0003Results";
				acceptedKey = "ZCN_STNREJ_2";
				noOfDaysWaitingKey = "ZNO_DY_WAIT";	
			}	
			var sDealerValue=Evt.getSource().getText();	
			me.oDataModelScreen3_DealerDetails.read(entitySet,{	
				success: function (oData, response) {	
					me.dialog.close();	
					var oModel=me.getOwnerComponent().getModel("SelectionParameterModel");	
					var obj=oData.results;	
					oModel.getData().DealerDetails=[];	
					var sDistributorValue=me.getView().byId("idDistributor").getTokens(); 	
					var aDistributorArray={	
							A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T:[]	
					};	
					for(var i=0;i<sDistributorValue.length;i++){	
						aDistributorArray.A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T.push(sDistributorValue[i].getText());	
					}	
					var sBrandValue=me.getView().byId("idBrand").getValue();	
					var aDealerArray={	
							A2HH1AHVH1XFP2B8U26XY6E1QA0E:[]	
					};	
					aDealerArray.A2HH1AHVH1XFP2B8U26XY6E1QA0E.push(sDealerValue);	
					var filterDataBrand=obj.filter(function (n){	
						if(sBrandValue!==""){	
							return  n.A2HGB2ED4OKF9J5AIITF49DYZ2BA_T===sBrandValue;	
						}else{	
							return n;	
						}	
					});	
					if(sDistributorValue.length!==0){	
						var filterDistributor = filterDataBrand.filter(function (o) {	
							return Object.keys(aDistributorArray).every(function (k) {	
								return aDistributorArray[k].some(function (f) {	
									return o[k] === f;	
								});	
							});	
						});	
					}else{	
						filterDistributor=filterDataBrand;	
					}	
					if(sDealerValue.length!==0){	
						var filterDealer = filterDistributor.filter(function (o) {	
							return Object.keys(aDealerArray).every(function (k) {	
								return aDealerArray[k].some(function (f) {	
									return o[k] === f;	
								});	
							});	
						});	
					}else{	
						filterDealer=filterDistributor;	
					}	
					var filterDataFinal=filterDealer;	
					obj=filterDataFinal;	
					for (var i = 0; i<obj.length; i++) {
						oModel.getData().DealerDetails.push({
							"CustomerName": obj[i].A2HHBXV4LNHY4T1BYOU7CGICK8BY,
							"Email": obj[i].A2HKRZGGC5CO5XVI9L9VQPS3IJG4,
							"Phone": obj[i].A2HFIXM0NZDY40BWS5PWGIJY1XS0,
							"ApptRequestedOn": obj[i].A2HQOCKP51JQYFF66Z1R5R7MKY08,
							"Accepted": obj[i][acceptedKey],
							"NoOfDaysWaiting": obj[i][noOfDaysWaitingKey]
						});
					}
					me._oDealerDetailsDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.DealerDetails", me);	
					me.getView().addDependent(me._oDealerDetailsDialog);	
					me._oDealerDetailsDialog.open();	
					me._oDealerDetailsDialog.setModel(oModel);
					BusyIndicator.hide();
				},	
				error: function (error) {	
				}	
			});	
		},	
			handleLinkObjectAttributePress : function (oEvent) {
			URLHelper.redirect("https://www.apps1.hvacpartners.com/SeamlessSignOn/SeamlessSignOn/?programCode=CallTracking3&Brand=Any", true);
		},

		/**
		 * Function call for dealer Search
		 */ 
		handleDealerDetailsLiveSearch:function(oEvent){	
			var sValue = oEvent.getParameter("value");	
			var oFilter1 = new Filter("A2HHBXV4LNHY4T1BYOU7CGICK8BY", sap.ui.model.FilterOperator.Contains, sValue);	
			var oBinding = oEvent.getSource().getBinding("items");	
			oBinding.filter([oFilter1]);	
		},	
		
		/**
		 * Function call to close the Dealer Details Popup
		 */ 
		handleCloseDealerDetails: function(Evt) {	
				
			me._oDealerDetailsDialog.close();	
		},	

		/**
		 * Function call when Call Time Toggle Btn is pressed
		 */ 
		handleCallTimeToggleBtnPress:function(){	
			me.getView().byId("idWeeklyDayToggleBtn").setPressed(false);	
			me.getView().byId("idVizFrameLeadsFactoryDay").setVisible(true);	
			me.getView().byId("idVizFrameLeadsFactoryDayTime").setVisible(false);	
		},	
		
		/**
		 * Function call when Weekly Day Toggle Btn is pressed
		 */ 
		handleWeeklyDayToggleBtnPress:function(){	
			me.getView().byId("idCallTimeToggleBtn").setPressed(false);	
			me.getView().byId("idVizFrameLeadsFactoryDay").setVisible(false);	
			me.getView().byId("idVizFrameLeadsFactoryDayTime").setVisible(true);	
		},	
		
		/**
		 * Function Call for Dealer ValueHelp
		 */ 
		handleValueHelpDistributor:function(Evt){
			
			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			me._oDistributorValueHelpDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.ValueHelpDialogDistributor", me);	
			me.getView().addDependent(me._oDistributorValueHelpDialog);	
			
			var tempModel = new sap.ui.model.json.JSONModel();	
			tempModel.setData({
				Distributor: oModel.oData.Distributor
			});
			
			var oItemTemplate1 = new sap.m.ColumnListItem({	
				type : "Active",	
				unread : false,	
				selected: "{selected}",	
				cells : [	
				         new sap.m.Text({	
				        	 text : "{DistributorText}"	
				         }),	
				         new sap.m.Text({	
				        	 text: "{DistributorKey}"	
				         })	
				         ]	
			});	
			var aInput = me.getView().byId("idDistributor").getTokens();	
			var aDistributors = tempModel.getProperty("/Distributor");	

			for (var inputValue = 0; inputValue < aInput.length; inputValue++) {	
				for (var type = 0; type < aDistributors.length; type++) {	
					if (aDistributors[type].A2HHDBJ1ZTDJT4I2RACFYWLNOBX9_T === aInput[inputValue].getText()) {	
						aDistributors[type].selected = true;	
					} 	
				}	
				var aTempDistributors =  aDistributors.filter(function(e){
					return e.selected == true;
				});
				var aTempDistributors2 =  aDistributors.filter(function(e){
					return e.selected == null || e.selected == false;
				});
				aDistributors = [];
				aDistributors = aTempDistributors.concat(aTempDistributors2);
				tempModel.setProperty("/Distributor", aDistributors);	
			}
			me._oDistributorValueHelpDialog.setModel(tempModel);
			me._oDistributorValueHelpDialog.bindAggregation("items", "/Distributor", oItemTemplate1);	
			
			me._oDistributorValueHelpDialog.setModel(oModel);
			me._oDistributorValueHelpDialog.open();	
			
			
		},	
		
		/**
		 * Function Call for Distributor Value Help Confirm
		 */ 
		handleDistributorValueHelpConfirm:function(Evt){	
			
			var aSelectedItems = Evt.getParameter("selectedItems"),	
			oMultiInput = me.getView().byId("idDistributor");	
			
			for (var i = 0; i < aSelectedItems.length; i++) {
				selectedDuetoSearchDistributor.push(aSelectedItems[i].getCells()[0].getProperty("text"));
				
			}
			
			var selectedDuetoSearchDistributorTemp = selectedDuetoSearchDistributor.filter(function onlyUnique(value, index, self) { 	
			return self.indexOf(value) === index;	
				});
			selectedDuetoSearchDistributor = selectedDuetoSearchDistributorTemp;
				
			
			var existingTokens = oMultiInput.getTokens();	
			for (var i = 0; i < existingTokens.length; i++) {	
				oMultiInput.removeToken(existingTokens[i])	
			}
			for(var i=0;i<selectedDuetoSearchDistributor.length;i++){	
				var oToken = new Token({	
					text: selectedDuetoSearchDistributor[i]	
				});	
				oMultiInput.addToken(oToken);		
			}	
			var existingTokens = oMultiInput.getTokens();	
			var tokenText = [];	
			for (var i = 0; i < existingTokens.length; i++) {	
				if (tokenText.includes(existingTokens[i].getText())) {	
					oMultiInput.removeToken(existingTokens[i])	
				} else {	
					tokenText.push(existingTokens[i].getText());	
				}	
			}	
			selectedDuetoSearchDistributor = [];
			
			me.handleDistributorChange();	
		},	
	
		/**
		 * Function Call for Dealer ValueHelp
		 */ 
		handleValueHelpDealer:function(Evt){
			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			me._oDealerValueHelpDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.ValueHelpDialogDealer", me);	
			me.getView().addDependent(me._oDealerValueHelpDialog);	
			
			var tempModel = new sap.ui.model.json.JSONModel();	
			tempModel.setData({
				Dealer: oModel.oData.Dealer
			});
			
			
			var oItemTemplate1 = new sap.m.ColumnListItem({	
				type : "Active",	
				unread : false,	
				selected: "{selected}",	
				cells : [	
				         new sap.m.Text({	
				        	 text : "{A2HH1AHVH1XFP2B8U26XY6E1QA0E}"	
				         }),	
				         new sap.m.Text({	
				        	 text: "{A2HQ3BP0M836H2ES6HU2I5A52QNJ}"	
				         })	
				         ]	
			});	
			var aInput = me.getView().byId("idDealer").getTokens();	
			var aDealers = tempModel.getProperty("/Dealer");	

			for (var inputValue = 0; inputValue < aInput.length; inputValue++) {	
				for (var type = 0; type < aDealers.length; type++) {	
					if (aDealers[type].A2HH1AHVH1XFP2B8U26XY6E1QA0E === aInput[inputValue].getText()) {	
						aDealers[type].selected = true;	
					} 	
				}	
				var aTempDealers =  aDealers.filter(function(e){
					return e.selected == true;
				});
				var aTempDealers2 =  aDealers.filter(function(e){
					return e.selected == null || e.selected == false;
				});
				aDealers = [];
				aDealers = aTempDealers.concat(aTempDealers2);
				tempModel.setProperty("/Dealer", aDealers);	
			}
			me._oDealerValueHelpDialog.setModel(tempModel);	
			me._oDealerValueHelpDialog.bindAggregation("items", "/Dealer", oItemTemplate1);	
			me._oDealerValueHelpDialog.open();	
			
		},	
		
		/**
		 * Function Call for Dealer Value Help Confirm 
		 */
		handleDealerValueHelpConfirm:function(Evt){	
			var aSelectedItems = Evt.getParameter("selectedItems"),	
			oMultiInput = me.getView().byId("idDealer");	
			
			for (var i = 0; i < aSelectedItems.length; i++) {
				selectedDuetoSearchDealer.push(aSelectedItems[i].getCells()[0].getProperty("text"));
			}
			
			var selectedDuetoSearchDealerTemp = selectedDuetoSearchDealer.filter(function onlyUnique(value, index, self) { 	
			return self.indexOf(value) === index;	
				});
			selectedDuetoSearchDealer = selectedDuetoSearchDealerTemp;
				
			
			var existingTokens = oMultiInput.getTokens();	
			for (var i = 0; i < existingTokens.length; i++) {	
				oMultiInput.removeToken(existingTokens[i])	
			}
			for(var i=0;i<selectedDuetoSearchDealer.length;i++){	
				var oToken = new Token({	
					text: selectedDuetoSearchDealer[i]	
				});	
				oMultiInput.addToken(oToken);		
			}	
			var existingTokens = oMultiInput.getTokens();	
			var tokenText = [];	
			for (var i = 0; i < existingTokens.length; i++) {	
				if (tokenText.includes(existingTokens[i].getText())) {	
					oMultiInput.removeToken(existingTokens[i])	
				} else {	
					tokenText.push(existingTokens[i].getText());	
				}	
			}	
			selectedDuetoSearchDealer = [];
			me.handleDealerChange();	
		},	
		
		handleDistributorsLiveSearch:function(Evt){var sValue = Evt.getParameter("value");	
		var oFilter1 = new Filter("DistributorText", sap.ui.model.FilterOperator.Contains, sValue);	
		var oBinding = Evt.getSource().getBinding("items");	
		Evt.getSource().getItems().filter(function(i){
				if(i.getSelected()) {
					selectedDuetoSearchDistributor.push(i.getCells()[0].getText())
				}
		});
			oBinding.filter([oFilter1]);	
		},	
		
		handleDealerLiveSearch:function(Evt){	
			var sValue = Evt.getParameter("value");	
			var oFilter1 = new Filter("A2HH1AHVH1XFP2B8U26XY6E1QA0E", sap.ui.model.FilterOperator.Contains, sValue);	
			var oBinding = Evt.getSource().getBinding("items");	
			Evt.getSource().getItems().filter(function(i){
					if(i.getSelected()) {
						selectedDuetoSearchDealer.push(i.getCells()[0].getText())
					}
			});
			oBinding.filter([oFilter1]);	
		},
		handleCallTypeLiveSearch:function(Evt){	
			var sValue = Evt.getParameter("value");	
			var oFilter1 = new Filter("CallTypesValue", sap.ui.model.FilterOperator.Contains, sValue);	
			var oBinding = Evt.getSource().getBinding("items");	
			Evt.getSource().getItems().filter(function(i){
				if(i.getSelected()) {
					selectedDuetoSearchCallTypes.push(i.getTitle())
				}
			});
			oBinding.filter([oFilter1]);	
		},
		handleCampaignLiveSearch:function(Evt){	
			var sValue = Evt.getParameter("value");	
			var oFilter1 = new Filter("A2HGKN4494F3PQR2SQBH4PWDIAE1", sap.ui.model.FilterOperator.Contains, sValue);	
			var oBinding = Evt.getSource().getBinding("items");	
			Evt.getSource().getItems().filter(function(i){
				if(i.getSelected()) {
					selectedDuetoSearchCampaign.push(i.getTitle())
				}
			});
			oBinding.filter([oFilter1]);	
		},
		handleStatesLPLiveSearch:function(Evt){	
			var sValue = Evt.getParameter("value");	
			var oFilter1 = new Filter("A2HRGR7SP5KY5T1Q9QHRQCALDERH", sap.ui.model.FilterOperator.Contains, sValue);	
			var oBinding = Evt.getSource().getBinding("items");	
			Evt.getSource().getItems().filter(function(i){
				if(i.getSelected()) {
					selectedDuetoSearchStatesLP.push(i.getTitle())
				}
			});
			oBinding.filter([oFilter1]);	
		},
		handleStatesOSSLiveSearch:function(Evt){	
			var sValue = Evt.getParameter("value");	
			var oFilter1 = new Filter("A2HRGR7SP5KY5T1Q9QHRQCALDERH", sap.ui.model.FilterOperator.Contains, sValue);	
			var oBinding = Evt.getSource().getBinding("items");	
			Evt.getSource().getItems().filter(function(i){
				if(i.getSelected()) {
					selectedDuetoSearchStatesOSS.push(i.getTitle())
				}
			});
			oBinding.filter([oFilter1]);	
		},
		
		handleCallTypesChange: function(Evt) {
			var oModel=me.getOwnerComponent().getModel("SelectionParameterModel");
			var sCallTypesValue;
			if (Evt === "clear") {
				me.getView().byId("idCallTypes").setSelectedKey();
				sCallTypesValue = "";
			} else {
				sCallTypesValue = Evt.mParameters.value;
			}
			if(sCallTypesValue!==""){	
				me.getView().byId("idCallTypesCancelIcon").setVisible(true);	
			}else{	
				me.getView().byId("idCallTypesCancelIcon").setVisible(false);	
			}
			callTypeFlag = true;
			me.handleLeadsProvidedPress();
		
		},
		clearCallTypeFilter: function() {
			me.handleCallTypesChange("clear");
		},
		handleValueHelpCampaign:function(Evt){

			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			me._oCampaignValueHelpDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.ValueHelpDialogCampaign", me);	
			me.getView().addDependent(me._oCampaignValueHelpDialog);	
			
			var tempModel = new sap.ui.model.json.JSONModel();	
			tempModel.setData({
				Campaign: oModel.oData.Campaign
			});
						
			var oItemTemplate1 = new sap.m.StandardListItem({	
				type : "Active",	
				unread: false,
				selected: "{selected}",
				title: "{A2HGKN4494F3PQR2SQBH4PWDIAE1}"
			});	
			var aInput = me.getView().byId("idCampaignLeadsProvided").getTokens();	
			var aCampaigns = tempModel.getProperty("/Campaign");	

			for (var inputValue = 0; inputValue < aInput.length; inputValue++) {	
				for (var type = 0; type < aCampaigns.length; type++) {	
					if (aCampaigns[type].A2HGKN4494F3PQR2SQBH4PWDIAE1 === aInput[inputValue].getText()) {	
						aCampaigns[type].selected = true;	
					} 	
				}	
				tempModel.setProperty("/Campaign", aCampaigns);	
			}
			
			me._oCampaignValueHelpDialog.setModel(tempModel);	
			me._oCampaignValueHelpDialog.bindAggregation("items", "/Campaign", oItemTemplate1);	
			me._oCampaignValueHelpDialog.open();	
			
		},	
		handleCampaignValueHelpConfirm:function(Evt){	
			var aSelectedItems = Evt.getParameter("selectedItems"),	
			oMultiInput = me.getView().byId("idCampaignLeadsProvided");	
			
			for (var i = 0; i < aSelectedItems.length; i++) {
				selectedDuetoSearchCampaign.push(aSelectedItems[i].getTitle());
			}
			
			var selectedDuetoSearchCampaignTemp = selectedDuetoSearchCampaign.filter(function onlyUnique(value, index, self) { 	
			return self.indexOf(value) === index;	
				});
			selectedDuetoSearchCampaign = selectedDuetoSearchCampaignTemp;
				
			
			var existingTokens = oMultiInput.getTokens();	
			for (var i = 0; i < existingTokens.length; i++) {	
				oMultiInput.removeToken(existingTokens[i])	
			}
			for(var i=0;i<selectedDuetoSearchCampaign.length;i++){	
				var oToken = new Token({	
					text: selectedDuetoSearchCampaign[i]	
				});	
				oMultiInput.addToken(oToken);		
			}	
			var existingTokens = oMultiInput.getTokens();	
			var tokenText = [];	
			for (var i = 0; i < existingTokens.length; i++) {	
				if (tokenText.includes(existingTokens[i].getText())) {	
					oMultiInput.removeToken(existingTokens[i])	
				} else {	
					tokenText.push(existingTokens[i].getText());	
				}	
			}	
			selectedDuetoSearchCampaign = [];	
			me.handleCampaignChange();	
		},	

		handleCampaignChange:function(Evt){	
			var sCampaignValue=me.getView().byId("idCampaignLeadsProvided").getTokens(); 	
			if(sCampaignValue.length!==0){	
				me.getView().byId("idCampaignCancelIcon").setVisible(true);	
			}else{	
				me.getView().byId("idCampaignCancelIcon").setVisible(false);	
			}
			if(Evt!==undefined){	
				var oModel=me.getOwnerComponent().getModel("SelectionParameterModel");	
				for (var i = 0; i < oModel.getData().Campaign.length; i++) {
					oModel.getData().Campaign[i].selected=false;
				}
				me.getView().byId("idCampaignLeadsProvided").destroyTokens();	
				me.getView().byId("idCampaignCancelIcon").setVisible(false);	
			}	
			me.handleLeadsProvidedPress();
		},	

		handleValueHelpStatesLP:function(Evt){

			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			me._oStatesLPValueHelpDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.ValueHelpDialogStatesLP", me);	
			me.getView().addDependent(me._oStatesLPValueHelpDialog);	
			
			var tempModel = new sap.ui.model.json.JSONModel();	
			tempModel.setData({
				States: oModel.oData.States
			});
						
			var oItemTemplate1 = new sap.m.StandardListItem({	
				type : "Active",	
				unread: false,
				selected: "{selected}",
				title: "{A2HRGR7SP5KY5T1Q9QHRQCALDERH}"
			});	
			var aInput = me.getView().byId("idLeadsProvidedStates").getTokens();	
			var aStates = tempModel.getProperty("/States");	

			for (var inputValue = 0; inputValue < aInput.length; inputValue++) {	
				for (var type = 0; type < aStates.length; type++) {	
					if (aStates[type].StatesValue === aInput[inputValue].getText()) {	
						aStates[type].selected = true;	
					} 	
				}	
				tempModel.setProperty("/States", aStates);	
			}
			
			me._oStatesLPValueHelpDialog.setModel(tempModel);	
			me._oStatesLPValueHelpDialog.bindAggregation("items", "/States", oItemTemplate1);	
			me._oStatesLPValueHelpDialog.open();	
			
		},	
		handleStatesLPValueHelpConfirm:function(Evt){	
			var aSelectedItems = Evt.getParameter("selectedItems"),	
			oMultiInput = me.getView().byId("idLeadsProvidedStates");	
			for (var i = 0; i < aSelectedItems.length; i++) {
				selectedDuetoSearchStatesLP.push(aSelectedItems[i].getTitle());
			}
			
			var selectedDuetoSearchStatesLPTemp = selectedDuetoSearchStatesLP.filter(function onlyUnique(value, index, self) { 	
			return self.indexOf(value) === index;	
				});
			selectedDuetoSearchStatesLP = selectedDuetoSearchStatesLPTemp;
				
			
			var existingTokens = oMultiInput.getTokens();	
			for (var i = 0; i < existingTokens.length; i++) {	
				oMultiInput.removeToken(existingTokens[i])	
			}
			for(var i=0;i<selectedDuetoSearchStatesLP.length;i++){	
				var oToken = new Token({	
					text: selectedDuetoSearchStatesLP[i]	
				});	
				oMultiInput.addToken(oToken);		
			}	
			var existingTokens = oMultiInput.getTokens();	
			var tokenText = [];	
			for (var i = 0; i < existingTokens.length; i++) {	
				if (tokenText.includes(existingTokens[i].getText())) {	
					oMultiInput.removeToken(existingTokens[i])	
				} else {	
					tokenText.push(existingTokens[i].getText());	
				}	
			}	
			selectedDuetoSearchStatesLP = [];
			me.handleStatesChange();	
		},	
		handleValueHelpStatesOSS:function(Evt){

			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
			
			me._oStatesOSSValueHelpDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.ValueHelpDialogStatesOSS", me);	
			me.getView().addDependent(me._oStatesOSSValueHelpDialog);	
			
			var tempModel = new sap.ui.model.json.JSONModel();	
			tempModel.setData({
				States: oModel.oData.States
			});
						
			var oItemTemplate1 = new sap.m.StandardListItem({	
				type : "Active",	
				unread: false,
				selected: "{selected}",
				title: "{A2HRGR7SP5KY5T1Q9QHRQCALDERH}"
			});	
			var aInput = me.getView().byId("idStatesOnlineScheduling").getTokens();	
			var aStates = tempModel.getProperty("/States");	

			for (var inputValue = 0; inputValue < aInput.length; inputValue++) {	
				for (var type = 0; type < aStates.length; type++) {	
					if (aStates[type].StatesValue === aInput[inputValue].getText()) {	
						aStates[type].selected = true;	
					} 	
				}	
				tempModel.setProperty("/States", aStates);	
			}
			
			me._oStatesOSSValueHelpDialog.setModel(tempModel);	
			me._oStatesOSSValueHelpDialog.bindAggregation("items", "/States", oItemTemplate1);	
			me._oStatesOSSValueHelpDialog.open();	
			
		},	

		handleStatesOSSValueHelpConfirm:function(Evt){	
			var aSelectedItems = Evt.getParameter("selectedItems"),	
			oMultiInput = me.getView().byId("idStatesOnlineScheduling");	
			for (var i = 0; i < aSelectedItems.length; i++) {
				selectedDuetoSearchStatesOSS.push(aSelectedItems[i].getTitle());
			}
			
			var selectedDuetoSearchStatesOSSTemp = selectedDuetoSearchStatesOSS.filter(function onlyUnique(value, index, self) { 	
			return self.indexOf(value) === index;	
				});
			selectedDuetoSearchStatesOSS = selectedDuetoSearchStatesOSSTemp;
				
			
			var existingTokens = oMultiInput.getTokens();	
			for (var i = 0; i < existingTokens.length; i++) {	
				oMultiInput.removeToken(existingTokens[i])	
			}
			for(var i=0;i<selectedDuetoSearchStatesOSS.length;i++){	
				var oToken = new Token({	
					text: selectedDuetoSearchStatesOSS[i]	
				});	
				oMultiInput.addToken(oToken);		
			}	
			var existingTokens = oMultiInput.getTokens();	
			var tokenText = [];	
			for (var i = 0; i < existingTokens.length; i++) {	
				if (tokenText.includes(existingTokens[i].getText())) {	
					oMultiInput.removeToken(existingTokens[i])	
				} else {	
					tokenText.push(existingTokens[i].getText());	
				}	
			}	
			selectedDuetoSearchStatesOSS = [];
			me.handleStatesChange();	
		},	

		handleStatesChange:function(Evt){	
			
			if(currentScreen === 2){	
				var sStatesValue = me.getView().byId("idLeadsProvidedStates").getTokens(); 	
				if(sStatesValue.length!==0){	
					me.getView().byId("idStatesCancelIcon").setVisible(true);	
				}else{	
					me.getView().byId("idStatesCancelIcon").setVisible(false);	
				}
				if(Evt!==undefined){	
					var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");	
					for (var i = 0; i < oModel.getData().States.length; i++) {
						oModel.getData().States[i].selected=false;
					}
					me.getView().byId("idLeadsProvidedStates").destroyTokens();	
					me.getView().byId("idStatesCancelIcon").setVisible(false);	
				}	
				me.handleLeadsProvidedPress();

			} else if(currentScreen === 3){	
				var sStatesValue = me.getView().byId("idStatesOnlineScheduling").getTokens(); 	
				if(sStatesValue.length!==0){	
					me.getView().byId("idStatesOnlineSchCancelIcon").setVisible(true);	
				}else{	
					me.getView().byId("idStatesOnlineSchCancelIcon").setVisible(false);	
				}
				if(Evt!==undefined){	
					var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");	
					for (var i = 0; i < oModel.getData().States.length; i++) {
						oModel.getData().States[i].selected=false;
					}
					me.getView().byId("idStatesOnlineScheduling").destroyTokens();	
					me.getView().byId("idStatesOnlineSchCancelIcon").setVisible(false);	
				}	
				me.handleOnlineSchedulingPress();
				
			}	
		},
		
		/**
		 * Function call when Online scheduling Hyperlink is pressed
		 */ 
		handleHyperLinkPressOnlineScheduling:function(){	
				
			me.dialog.open();	
			var sDateTimeKey = me.getView().byId("idDateTime").getSelectedKey(); 		
			var sDistributorValue = me.getView().byId("idDistributor").getTokens(); 		
			var sBrandValue = me.getView().byId("idBrand").getSelectedKey();		
			var sDealerValue = me.getView().byId("idDealer").getTokens();		
			var sStates = me.getView().byId("idStatesOnlineScheduling").getTokens();	


			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
						
			/************ Setting Filter Values **************/
			var additionalSelectParameters = "";

			var allFilters = []
			if (sBrandValue !== "") {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HS11Q0ZWBZ3RTM6GXT58XOOOMJ";
				var brandFilter = new Filter("A2HS11Q0ZWBZ3RTM6GXT58XOOOMJ", FilterOperator.EQ, sBrandValue);
				allFilters.push(brandFilter);
			}
			if (sDistributorValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HOYU4PO5L16H3TZK008UXQ1BSA";
				var currentDistributorIds = [];
					
				var distributorFilters = []
				for (var i = 0; i < sDistributorValue.length; i++) {
					var distributorFilter = new Filter("A2HOYU4PO5L16H3TZK008UXQ1BSA", FilterOperator.EQ, sDistributorValue[i].getText());
					distributorFilters.push(distributorFilter);
					
				}
				var distributorFilterModel = new Filter(distributorFilters, false);
				allFilters.push(distributorFilterModel);
			}
			if (sDealerValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HK584U64195CQVU4PPJPLGSETB";
				var currentDealerIds = [];
				
				var dealerFilters = []
				for (var i = 0; i < sDealerValue.length; i++) {
					var dealerFilter = new Filter("A2HK584U64195CQVU4PPJPLGSETB", FilterOperator.EQ, sDealerValue[i].getText());
					dealerFilters.push(dealerFilter);
					
				}
				var dealerFilterModel = new Filter(dealerFilters, false);
				allFilters.push(dealerFilterModel);
			}
			if (sStates.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HHBF5ENGIBIHD3WBMWQPFGLE9M";
				var currentStateIds = [];
				
				var stateFilters = []
				for (var i = 0; i < sStates.length; i++) {
					var stateFilter = new Filter("A2HHBF5ENGIBIHD3WBMWQPFGLE9M", FilterOperator.EQ, sStates[i].getText());
					stateFilters.push(stateFilter);
					
				}
				var stateFilterModel = new Filter(stateFilters, false);
				allFilters.push(stateFilterModel);
				
			}

			var filterModel = new Filter(allFilters, true);
			var xFilter = [];
			xFilter.push(filterModel);
			
			var entitySet;
			
			if(sDateTimeKey==="LY"){	
				me.oDataModelScreen3_Hyperlink = me.getOwnerComponent().getModel("DashboardThirdScreenModel_Hyperlink_LY"); // Global
				
				entitySet="/ZCV_CPCLG_OSS_R1_SC03_Q0002Results"	
			}else{	
				me.oDataModelScreen3_Hyperlink = me.getOwnerComponent().getModel("DashboardThirdScreenModel_Hyperlink"); // Global
				
				entitySet="/ZCV_CPCLG_OSS_R1_SC03_Q0001Results"	
			}	
			
			me.oDataModelScreen3_Hyperlink.read(entitySet,{	
				
				urlParameters: {
					$format: 'json'
				},
				
				filters: xFilter,
				
				success: function (oData, response) {	
					me.dialog.close();	
					
					var obj=oData.results;	
					oModel.getData().HyperlinkOnlineScheduling=[];	
					oModel.getData().HyperlinkOnlineScheduling.push(obj);	
					me._oHyperlinkOnlineSchedulingDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.OnlineSchedulingHyperLink", me);	
					me.getView().addDependent(me._oHyperlinkOnlineSchedulingDialog);	
					me._oHyperlinkOnlineSchedulingDialog.open();	
					me.handleHyperlinkOnlineSchedulingExport();	
					
				},	
				error: function (error) {	
				}	
			});	
		},	
		
		handleOnlineSchedulingHyperlinkClose:function(){	
			me._oHyperlinkOnlineSchedulingDialog.close();	
			me._oHyperlinkOnlineSchedulingDialog.destroy();	
		},	
		
		/**
		 * Function call when Leads Hyperlink is pressed
		 */ 
		handleHyperLinkPressLeadsProvided:function(){	
				
			me.dialog.open();	
			var sDateTimeKey = me.getView().byId("idDateTime").getSelectedKey(); 		
			var sDistributorValue = me.getView().byId("idDistributor").getTokens(); 		
			var sBrandValue = me.getView().byId("idBrand").getSelectedKey();		
			var sDealerValue = me.getView().byId("idDealer").getTokens();		
			var sCampaign = me.getView().byId("idCampaignLeadsProvided").getTokens();	
			var sStates = me.getView().byId("idLeadsProvidedStates").getTokens();	


			var oModel = me.getOwnerComponent().getModel("SelectionParameterModel");
						
			/************ Setting Filter Values **************/
			var additionalSelectParameters = "";

			var allFilters = []
			if (sBrandValue !== "") {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HR4VQBEZ14ZT3BS0DRMWK48IGM";
				var brandFilter = new Filter("A2HR4VQBEZ14ZT3BS0DRMWK48IGM", FilterOperator.EQ, sBrandValue);
				allFilters.push(brandFilter);
			}
			if (sDistributorValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HJYZCSY1RGUT52657O9VEUQ58M";
				var currentDistributorIds = [];
					
				var distributorFilters = []
				for (var i = 0; i < sDistributorValue.length; i++) {
					var distributorFilter = new Filter("A2HJYZCSY1RGUT52657O9VEUQ58M", FilterOperator.EQ, sDistributorValue[i].getText());
					distributorFilters.push(distributorFilter);
					
				}
				var distributorFilterModel = new Filter(distributorFilters, false);
				allFilters.push(distributorFilterModel);
			}
			if (sDealerValue.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HIH681RAML9MOTJFW2H2UYPEGD";
				var currentDealerIds = [];
				
				var dealerFilters = []
				for (var i = 0; i < sDealerValue.length; i++) {
					var dealerFilter = new Filter("A2HIH681RAML9MOTJFW2H2UYPEGD", FilterOperator.EQ, sDealerValue[i].getText());
					dealerFilters.push(dealerFilter);
					
				}
				var dealerFilterModel = new Filter(dealerFilters, false);
				allFilters.push(dealerFilterModel);
			}
			if (sStates.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HK6ZV2TZK3GKNV413GA3G68B4K";
				var currentStateIds = [];
				
				var stateFilters = []
				for (var i = 0; i < sStates.length; i++) {
					var stateFilter = new Filter("A2HK6ZV2TZK3GKNV413GA3G68B4K", FilterOperator.EQ, sStates[i].getText());
					stateFilters.push(stateFilter);
					
				}
				var stateFilterModel = new Filter(stateFilters, false);
				allFilters.push(stateFilterModel);
			}
			if (sCampaign.length !== 0) {
				additionalSelectParameters = additionalSelectParameters + "," + "A2HK8BO2EMCI2PHJXGV3LGFE77WP";
				var currentCampaignIds = [];
				
				var campaignFilters = []
				for (var i = 0; i < sCampaign.length; i++) {
					var campaignFilter = new sap.ui.model.Filter("A2HK8BO2EMCI2PHJXGV3LGFE77WP", sap.ui.model.FilterOperator.EQ, sCampaign[i].getText());
					campaignFilters.push(campaignFilter);
					
				}
				var campaignFilterModel = new Filter(campaignFilters, false);
				allFilters.push(campaignFilterModel);
				
			}

			var filterModel = new Filter(allFilters, true);
			var xFilter = [];
			xFilter.push(filterModel);
			
			var entitySet;
			
			if(sDateTimeKey==="LY"){	
				me.oDataModelScreen2_Hyperlink = me.getOwnerComponent().getModel("DashboardSecondScreenModel_Hyperlink_LY"); // Global
				entitySet="/ZCV_CPC_CT_Q0002Results"	
			}else{	
				me.oDataModelScreen2_Hyperlink = me.getOwnerComponent().getModel("DashboardSecondScreenModel_Hyperlink"); // Global
				entitySet="/ZCV_CPC_CT_Q0001Results"	
			}		
			
			me.oDataModelScreen2_Hyperlink.read(entitySet,{	
				
				urlParameters: {
					$format: 'json'
				},
				
				filters: xFilter,
				
				success: function (oData, response) {	
					me.dialog.close();	
					
					var obj=oData.results;	
					oModel.getData().HyperlinkLeadsProvided=[];	
					oModel.getData().HyperlinkLeadsProvided.push(obj);	
					me._oHyperlinkLeadsProvidedDialog = sap.ui.xmlfragment("cpc.CPC_Dashboard_Split.fragments.LeadsProvidedHyperlink", me);	
					me.getView().addDependent(me._oHyperlinkLeadsProvidedDialog);	
					me._oHyperlinkLeadsProvidedDialog.open();	
					me.handleHyperlinkLeadsProvidedExport();	
					
				},	
				error: function (error) {	
				}	
			});	
			
		},	
		
		handleLeadsProvidedHyperlinkClose:function(){	
			me._oHyperlinkLeadsProvidedDialog.close();	
			me._oHyperlinkLeadsProvidedDialog.destroy();	
		},	
		
		/**
		 * Function Call for Download Excel Sheet
		 */ 
		handleHyperlinkOnlineSchedulingExport:function(Evt){	
			var oExport = new Export({	
				// Type that will be used to generate the content. Own
				// ExportType's can be created to support other formats
				exportType : new ExportTypeCSV({	
					fileExtension: "xls",	
					separatorChar: "\t",	
					charset: "utf-8",	
					mimeType: "application/vnd.ms-excel"	
				}),	
				// Pass in the model created above
				models :me.getOwnerComponent().getModel("SelectionParameterModel"),	
				// binding information for the rows aggregation
				rows : {	
					path : "/HyperlinkOnlineScheduling/0"	
				},	
				// column definitions with column name and binding info for the
				// content
				columns : [{	
					name : "Distributor",	
					template : {	
						content : "{A2HOYU4PO5L16H3TZK008UXQ1BSA}"	
					}	
				}, {	
					name : "Distributor Id",	
					template : {	
						content : "{A2HQCFF7YB7ASICZ7ID0E11LAY4L}"	
					}	
				}, {	
					name : "Dealer",	
					template : {	
						content : "{A2HK584U64195CQVU4PPJPLGSETB}"	
					}	
				}, {	
					name : "Dealer HVP",	
					template : {	
						content : "{A2HKJ4RHDOWDIIXILH7ZA8IVZUY3}"	
					}	
				}, {	
					name : "FAD",	
					template : {	
						content : "{A2HPUK7MLZ5UUOI75MKTKMI4GHHS}"	
					}	
				}, {	
					name : "Brand",	
					template : {	
						content : "{A2HS11Q0ZWBZ3RTM6GXT58XOOOMJ}"	
					}	
				}, {	
					name : "Current Status",	
					template : {	
						content : "{A2HOYS2CRPA0V347MEYLL58MYL52}"	
					}	
				}, {	
					name : "Job Creation Date",	
					template : {	
						content : "{A2HKZPYQ6Q0FHUTGK3VPV8QCEQAL_T}"	
					}	
				}, {	
					name : "Job Accepted Date",	
					template : {	
						content : "{A2HFBZ4U8DSHB990MTNED41NSKMT_T}"	
					}	
				}, {	
					name : "Job Scheduled Date",	
					template : {	
						content : "{A2HKWB33NG5MGXC0CTM4MDDFSYFG_T}"	
					}	
				}, {	
					name : "Job Completion Date",	
					template : {	
						content : "{A2HOSP343N1QUW3BMF6ZXBWK09GD_T}"	
					}	
				}, {	
					name : "Job Rejected Date",	
					template : {	
						content : "{A2HNQYL44ZCVWW5SBTLB2C9MO3LE_T}"	
					}	
				}, {	
					name : "Job Cancelled Date",	
					template : {	
						content : "{A2HJUKPUM6PONFMQ33VHVJTUN64B_T}"	
					}	
				}, {	
					name : "Job Paused Date",	
					template : {	
						content : "{A2HRJML3HSL4ZZQ80E57YL7X9ZJE_T}"	
					}	
				}, {	
					name : "Appointment Creation Date",	
					template : {	
						content : "{A2HKOR2EUF42B6PCG86CYJOH7DMM_T}"	
					}	
				}, {	
					name : "Appointment Completion Date",	
					template : {	
						content : "{A2HQGQ5HYO019L5T1VPG2VCEXSBA_T}"	
					}	
				}, {	
					name : "Customer First Name",	
					template : {	
						content : "{A2HS1EH4CNQHOHRW8RC929M24KE1}"	
					}	
				}, {	
					name : "Customer Last Name",	
					template : {	
						content : "{A2HKDZ1OJ8W6KA1BWC0GRI71RU9T}"	
					}	
				}, {	
					name : "Customer Address",	
					template : {	
						content : "{A2HO1PDFB9YV6Q0EP7QAGVB30XOL}"	
					}	
				}, {	
					name : "Customer City",	
					template : {	
						content : "{A2HUA0FI2ZUDBP5ZVROCFC4Y6MVQ}"	
					}	
				}, {	
					name : "Customer State",	
					template : {	
						content : "{A2HHBF5ENGIBIHD3WBMWQPFGLE9M}"	
					}	
				}, {	
					name : "Customer Zip Code",	
					template : {	
						content : "{A2HO5WR0QDKHD4RGNPCUOCTFL3P7}"	
					}	
				}, {	
					name : "Customer Email",	
					template : {	
						content : "{A2HL3LHTNJF83KSKUQLGU91YN9U3}"	
					}	
				}, {	
					name : "Customer Phone",	
					template : {	
						content : "{A2HORJYO9YMKOF517Z8S4B7J9NGI}"	
					}	
				}, {	
					name : "Customer Acceptance Time HRS",	
					template : {	
						content : "{A006NZKS3HHO23V7C6V1BI0Y7S}"	
					}	
				}, {	
					name : "Completion Time(Days)",	
					template : {	
						content : "{A006NZKS3HHO23V7C6V1BI14JC}"	
					}	
				}]	
			});	
			
			var fileName = "Online Scheduling";
			var sDateTime = me.getView().byId("idDateTime").getSelectedKey();
			if (sDateTime === "LY") {
				fileName = fileName + " Last Year";
			} else {
				fileName = fileName + " Year to Date";
			}
			// download exported file
			oExport.saveFile(fileName).catch(function(oError) {	
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);	
			}).then(function() {	
				oExport.destroy();	
			});	
			me._oHyperlinkOnlineSchedulingDialog.close();	
		},	
		
		/**
		 * Function Call for Download Excel Sheet Leads Provided
		 */ 
		handleHyperlinkLeadsProvidedExport:function(Evt){	
			var oExport = new Export({	
				// Type that will be used to generate the content. Own
				// ExportType's can be created to support other formats
				exportType : new ExportTypeCSV({	
					fileExtension: "xls",	
					separatorChar: "\t",	
					charset: "utf-8",	
					mimeType: "application/vnd.ms-excel"	
				}),	
				// Pass in the model created above
				models :me.getOwnerComponent().getModel("SelectionParameterModel"),	
				// binding information for the rows aggregation
				rows : {	
					path : "/HyperlinkLeadsProvided/0"	
				},	
				// column definitions with column name and binding info for the
				// content
				columns : [{	
					name : "Distributor",	
					template : {	
						content : "{A2HTKA9JO3X1AD5YCWS9TG4VK2R9}"	
					}	
				}, {	
					name : "Distributor Id",	
					template : {	
						content : "{A2HJYZCSY1RGUT52657O9VEUQ58M}"	
					}	
				}, {	
					name : "Dealer HVP",	
					template : {	
						content : "{A2HJKP1ZPYURAJGIGQK4683UUHCJ}"	
					}	
				}, {	
					name : "Dealer",	
					template : {	
						content : "{A2HIH681RAML9MOTJFW2H2UYPEGD}"	
					}	
				}, {	
					name : "Brand",	
					template : {	
						content : "{A2HR4VQBEZ14ZT3BS0DRMWK48IGM}"	
					}	
				}, {	
					name : "Ad Source",	
					template : {	
						content : "{A2HIKD99NIS4RJOMEYGXRL22LNA9}"	
					}	
				}, {	
					name : "Campaign Name",	
					template : {	
						content : "{A2HK8BO2EMCI2PHJXGV3LGFE77WP}"	
					}	
				}, {	
					name : "Tracking No.",	
					template : {	
						content : "{A2HTI2UO2D2502C1RERRMQUS9AFU}"	
					}	
				}, {	
					name : "Dealer No.",	
					template : {	
						content : "{A2HI8OJLEARYTE4LPT9VA6108B4C}"	
					}	
				}, {	
					name : "FAD",	
					template : {	
						content : "{A2HK9VSSWZWEWVZ016E0XZYOHT7A}"	
					}	
				}, {	
					name : "High Internet Outcome",	
					template : {	
						content : "{A2HNBUY07Q62XBQ3HGQJ1W7JJA7S}"	
					}	
				}, {	
					name : "Name",	
					template : {	
						content : "{A2HR8QH4FRAIHHTI4QTABXT95A1J}"	
					}	
				}, {	
					name : "Call DNA Class",	
					template : {	
						content : "{A2HNC7YPSAZJKWV8BA0W2V95DQKX}"	
					}	
				}, {	
					name : "Call Result Group",	
					template : {	
						content : "{A2HSRUX3KDN8G5H4LK99O2U0AW0B}"	
					}	
				}, {	
					name : "Caller",	
					template : {	
						content : "{A2HPQYO0UQFUHJCYI9BJA3Q3NFME}"	
					}	
				}, {	
					name : "Caller Name",	
					template : {	
						content : "{A2HO81PFA7NUH5VRBUS8517L8LNE}"	
					}	
				}, {	
					name : "Caller Time",	
					template : {	
						content : "{A2HR0TAHEWLIWXOANMF86BQYJJPH_T} {A2HR0TAHEWLIWXOANMF86BQYJJPH}"	
					}	
				}, {	
					name : "Caller City",	
					template : {	
						content : "{A2HFPFY1RGW101W4M5I9AUFR549R}"	
					}	
				}, {	
					name : "Caller States",	
					template : {	
						content : "{A2HK6ZV2TZK3GKNV413GA3G68B4K}"	
					}	
				}, {	
					name : "Customer Postal Code",	
					template : {	
						content : "{A2HS3OUQPKWVSUARZ229OLNCUEPL}"	
					}	
				}, {	
					name : "Reason for Call",	
					template : {	
						content : "{A2HQ39EH7KONQOFLJVFZBOA5UPQ5}"	
					}	
				}, {	
					name : "URL",	
					template : {	
						content : "{A2HIKKG8DXF2FL0J8TBLXBXC30TE}"	
					}	
				}]	
			});	
			
			var fileName = "Call Tracking";
			var sDateTime = me.getView().byId("idDateTime").getSelectedKey();
			if (sDateTime === "LY") {
				fileName = fileName + " Last Year";
			} else {
				fileName = fileName + " Year to Date";
			}
			// download exported file
			oExport.saveFile(fileName).catch(function(oError) {	
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);	
			}).then(function() {
				me._oHyperlinkLeadsProvidedDialog.getContent()[0].destroy();					
				oExport.destroy();	
			});	
			me._oHyperlinkLeadsProvidedDialog.close();	
		}	
	});	
});