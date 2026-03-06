sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/core/Fragment'

],
    function (Controller,Filter, FilterOperator, Fragment) {
        "use strict";

        return Controller.extend("larsento02t1.controller.SFData", {
            onInit: function () {
                this.OnReadSFData();
            },
            OnReadSFData: function () {

                var oModel = this.getOwnerComponent().getModel("v2");
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading Data",
                    text: "Please wait..."
                });
                oBusyDialog.open();

                oModel.read("/Candidate", {
                    success: function (resp) {
                        oBusyDialog.close();
                        oJSONModel.setData(resp.results);
                        this.getView().setModel(oJSONModel, "SFCand");
                    }.bind(this),
                    error: function (err) {
                        oBusyDialog.close();
                        console.error("Error fetching data", err);
                    }
                });
            },
            onValueHelpRequest: function (oEvent) {

				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				var id = oEvent.getSource().getId();
	
				if (id.endsWith("PIdLable4")) {
	
					if (!this._pValueHelpDialog2) {
						this._pValueHelpDialog2 = Fragment.load({
							id: oView.getId(),
							name: "larsento02t1.view.fragment.Cid",
							controller: this
						}).then(function (oDialog2) {
							oView.addDependent(oDialog2);
							return oDialog2;
						});
					}
					this._pValueHelpDialog2.then(function (oDialog2) {
						oDialog2.getBinding("items").filter([new Filter("candidateId", FilterOperator.Contains, sInputValue)]);
						oDialog2.open(sInputValue);
					});
				}
				if (id.endsWith("PIdLablene")) {
	
					if (!this._pValueHelpDialog2) {
						this._pValueHelpDialog2 = Fragment.load({
							id: oView.getId(),
							name: "larsento02t1.view.fragment.FnSF",
							controller: this
						}).then(function (oDialog3) {
							oView.addDependent(oDialog3);
							return oDialog3;
						});
					}
					this._pValueHelpDialog2.then(function (oDialog3) {
						oDialog3.getBinding("items").filter([new Filter("firstName", FilterOperator.Contains, sInputValue)]);
						oDialog3.open(sInputValue);
					});
				}
			},
	
			ConValueHelpSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("candidateId", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
	
			ConValueHelpClose: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("PIdLable4").setValue(oSelectedItem.getTitle());
			},
			ConValueHelpSearchfn: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("firstName", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
	
			ConValueHelpClosefn: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("PIdLablene").setValue(oSelectedItem.getTitle());
			},

            onclickC: function(oEvent){
				var pQuery = this.getView().byId("PIdLable4").getValue();
				var fnQuery = this.getView().byId("PIdLablene").getValue();
				if(pQuery){
					this.getView().byId("SFTable").getBinding().filter([new Filter("candidateId", FilterOperator.EQ, pQuery)]);
				}else if(fnQuery){
					console.log("triggered");
					this.getView().byId("SFTable").getBinding().filter([new Filter("firstName", FilterOperator.Contains, fnQuery)]);
				}
				else{
					this.getView().byId("SFTable").getBinding().filter();
				}
			},
            onNAVBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CandidatePM");
            },
            navtoHP: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHomePage");

            },
			Onrefresh: function(){
				this.OnReadSFData();
			}

        });
    });
