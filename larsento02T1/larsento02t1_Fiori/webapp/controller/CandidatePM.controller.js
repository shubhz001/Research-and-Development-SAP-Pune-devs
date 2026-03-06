sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/Label',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/comp/smartvariants/PersonalizableInfo',
	'sap/ui/core/Fragment',
	'sap/m/BusyDialog',
	"sap/m/MessageBox"
	
],
	function (Controller, Label, Filter, FilterOperator, PersonalizableInfo,Fragment,BusyDialog,MessageBox) {
		"use strict";

		return Controller.extend("larsento02t1.controller.CandidatePM", {
			onInit: function () {
				
				
				//-------------------------------

				this.onreademp();

				//-------------------------------			
			},
			onreademp: function () {
				var oBusyDialog = new sap.m.BusyDialog({
					title: "Loading Data",
					text: "Please wait..."
				}); 
				oBusyDialog.open();
				var oModel = this.getOwnerComponent().getModel("cpmaster");
				var oJSONModel = new sap.ui.model.json.JSONModel();
				
				oModel.read("/Candidates_Details", {
					success: function (resp) {
						console.log(resp.results);
						oJSONModel.setData(resp.results);
						this.getView().setModel(oJSONModel, "CPMoData");
						oBusyDialog.close();
					}.bind(this),
					error: function (err) {
						console.error("Error fetching data", err); 
						oBusyDialog.close();
					}
				});
									
			},
			comparePersonalId: function (a, b) {
				// Convert string to number for comparison
				var numA = parseInt(a, 10);
				var numB = parseInt(b, 10);
	
				if (numA < numB) {
					return -1;
				} else if (numA > numB) {
					return 1;
				} else {
					return 0;
				}
			},
			onValueHelpRequest: function (oEvent) {

				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				var id = oEvent.getSource().getId();
	
				if (id.endsWith("PIdLable")) {
	
					if (!this._pValueHelpDialog2) {
						this._pValueHelpDialog2 = Fragment.load({
							id: oView.getId(),
							name: "larsento02t1.view.fragment.Help",
							controller: this
						}).then(function (oDialog2) {
							oView.addDependent(oDialog2);
							return oDialog2;
						});
					}
					this._pValueHelpDialog2.then(function (oDialog2) {
						oDialog2.getBinding("items").filter([new Filter("personalId", FilterOperator.Contains, sInputValue)]);
						oDialog2.open(sInputValue);
					});
				}

				if (id.endsWith("PIdLable31")) {
	
					if (!this._pValueHelpDialog2) {
						this._pValueHelpDialog2 = Fragment.load({
							id: oView.getId(),
							name: "larsento02t1.view.fragment.Name",
							controller: this
						}).then(function (oDialog2) {
							oView.addDependent(oDialog2);
							return oDialog2;
						});
					}
					this._pValueHelpDialog2.then(function (oDialog2) {
						oDialog2.getBinding("items").filter([new Filter("firstName", FilterOperator.Contains, sInputValue)]);
						oDialog2.open(sInputValue);
					});
				}
			},
	
			onValueHelpSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("personalId", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
	
			onValueHelpClose: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("PIdLable").setValue(oSelectedItem.getTitle());
			},
			NonValueHelpSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("firstName", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
	
			NonValueHelpClose: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("PIdLable31").setValue(oSelectedItem.getTitle());
			},
	
			onclick: function(oEvent){
				var pQuery = this.getView().byId("PIdLable").getValue();
				var NQuery = this.getView().byId("PIdLable31").getValue();
				if(pQuery){
					this.getView().byId("Table").getBinding().filter([new Filter("personalId", FilterOperator.EQ, pQuery)]);
				}else if(NQuery){
					console.log("triggered");
					this.getView().byId("Table").getBinding().filter([new Filter("firstName", FilterOperator.Contains, NQuery)]);
				}
				else{
					this.getView().byId("Table").getBinding().filter();
				}
			},
			
			
			onNavToDetails: function (oEvent) {

				var oBindingContext = oEvent.getParameters().rowBindingContext;
				if (oBindingContext) {
					// Get the value of the first column (personalId)
					var sPersonalId = oBindingContext.getProperty("personalId");
					// Store the value in a variable
					this._selectedPersonalId = sPersonalId;

					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					var sCustomerId = this._selectedPersonalId;
					oRouter.navTo("OverView", { CustomerID: sCustomerId });

				}


			},
			navtoHP: function (oEvent) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("RouteHomePage");

			},
			onCheck: function () {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("SFData");
			},
			RefreshAll: function(){
				this.onreademp();
			},
			AddAi: function(){
				
				var oBusyDialog1 = new sap.m.BusyDialog({
					title: "Adding new Data",
					text: "Please wait...Data is getting added from AI"
				}); 
				oBusyDialog1.open();
				// var oComponent = this.getOwnerComponent();
                //         var sBaseUrl = oComponent.getManifestEntry("sap.app").dataSources.CPMaster.uri;
                //         var posturl = sBaseUrl + "/AddNewCandi()";
                // var Mbaseurl = this.getOwnerComponent().getManifestObject().resolveUri(
                //     "v2/odata/v4/CPMaster/"
                // );
				var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
                    "v2/odata/v4/CPMaster/AddNewCandi()"
                );
				
				// var posturl = Mbaseurl + "AddNewCandi()"
				console.log(posturl);
				var that = this;
                $.ajax({
                    url: posturl,
                    type: "GET",
                    async: true,
					dataType: "json",
                    success: function (ndata) {
						console.log(ndata.d.value);
						MessageBox.information(ndata.d.value, {
							onClose: function (oAction) {
								if (oAction === MessageBox.Action.OK) {
									that.onreademp();
								}
							}
						});
						
						
                        oBusyDialog1.close();
                    },
                    error: function (err) {
                        console.log("Error while adding data");
                        console.log(err);
                        oBusyDialog1.close();

                    }
                });
			}


		});
	});
