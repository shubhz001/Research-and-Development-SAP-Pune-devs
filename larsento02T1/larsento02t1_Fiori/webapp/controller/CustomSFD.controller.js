sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"

],
    function (Controller,History) {
        "use strict";

        return Controller.extend("larsento02t1.controller.CustomSFD", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("CustomSFD").attachPatternMatched(this._onRouteMatched, this);
                
            },
            _onRouteMatched: function (oEvent) {
                var sCustomerId = oEvent.getParameter("arguments").CustomerID;
                console.log(sCustomerId);

                var oModel = this.getOwnerComponent().getModel("v2");
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading Data",
                    text: "Please wait..."
                });
                oBusyDialog.open();

                var oFilter = new sap.ui.model.Filter("candidateId", sap.ui.model.FilterOperator.EQ, sCustomerId);
                oModel.read("/Candidate", {
                    filters: [oFilter],
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
            navtoHP: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHomePage");

            },
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
              
                if (sPreviousHash !== undefined) {
                  window.history.go(-1);
                } else {
                  var oRouter = this.getOwnerComponent().getRouter();
                  oRouter.navTo("CandidatePM", {}, true);
                }
              }

        });
    });
