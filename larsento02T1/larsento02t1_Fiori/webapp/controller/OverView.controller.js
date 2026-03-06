sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/odata/v2/ODataModel"
],
    function (Controller, History, ODataModel) {
        "use strict";

        return Controller.extend("larsento02t1.controller.OverView", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("OverView").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                var sCustomerId = parseInt(oEvent.getParameter("arguments").CustomerID);

                console.log(sCustomerId);

                var oModel = this.getOwnerComponent().getModel("cpmaster");
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading Data",
                    text: "Please wait..."
                });
                oBusyDialog.open();

                //var oFilter = new sap.ui.model.Filter("personalId", sap.ui.model.FilterOperator.EQ, sCustomerId);
                oModel.read("/Candidates_Details(personalId=" + sCustomerId + ")", {
                    //filters: [oFilter],
                    success: function (resp) {
                        oBusyDialog.close();
                        
                        var data = { 0: resp };
                        console.log(data);
                        oJSONModel.setData(data);
                        this.getView().setModel(oJSONModel, "UserDOdata");

                    }.bind(this),
                    error: function (err) {
                        oBusyDialog.close();
                        console.error("Error fetching data", err);
                    }
                });

                var NoModel = this.getOwnerComponent().getModel("CPMaster");
                console.log(typeof(sCustomerId));
                var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
                    "v2/odata/v4/CPMaster/CompareCDwithSF(pid="+sCustomerId+")"
                );
                console.log(posturl);
             
                var that = this; 
                $.ajax({
                    url: posturl,
                    type: "GET",
                    async: false,
                    success: function (data) {
                        console.log("Before data:",data.d.value.results[0])
                        var odata = { 0: data.d.value.results[0].matching[0] };
                        //console.log(odata);
                        var NoJSONModel = new sap.ui.model.json.JSONModel();
                        NoJSONModel.setData(odata);
                        that.getView().setModel(NoJSONModel, "TData");
                    },
                    error: function (err) {
                        console.log("item status change failed");
                        console.log(err);

                    }
                });



            },
            
            OnNavBack: function () {

                console.log("Back button pressed");
                var oModel = this.getView().getModel("TData");
                if (oModel) {
                    console.log("Model found, clearing data");
                    oModel.setProperty("/", {}); // Clear the model data
                } else {
                    console.log("Model not found");
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CandidatePM");
            },
            navtoHP: function () {
                console.log("Back button pressed");
                var oModel = this.getView().getModel("TData");
                if (oModel) {
                    console.log("Model found, clearing data");
                    oModel.setProperty("/", {}); // Clear the model data
                } else {
                    console.log("Model not found");
                }
                var oModel = this.getView().getModel("TData");
                if (oModel) {
                    oModel.setData({});
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHomePage");

            },
            onNavToSFD: function (oEvent) {
                var oBindingContext = oEvent.getParameters().rowBindingContext;
                if (oBindingContext) {
                    // Get the value of the first column (Sid)
                    var sSid = oBindingContext.getProperty("Sid");
                    // Store the value in a variable
                    this._selectedSid = sSid;

                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    var sCustomerId = this._selectedSid;
                    oRouter.navTo("CustomSFD", { CustomerID: sCustomerId });

                }
            }
        });
    });
