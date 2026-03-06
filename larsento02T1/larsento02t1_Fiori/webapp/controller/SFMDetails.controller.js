sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "larsento02t1/controller/Formatter",
    "sap/f/library",
    'sap/m/BusyDialog'
],
    function (Controller, History, fioriLibrary, Formatter, BusyDialog) {
        "use strict";
        var Filtersavedata;
        var Mid;
        return Controller.extend("larsento02t1.controller.SFMDetails", {
            Formatter: Formatter,
            onInit: function () {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("SFMDetails").attachPatternMatched(this._onRouteMatched, this);
                this.oBusyDialog = new BusyDialog({
                    title: "Loading the Data",
                    text: "please wait, it might take few seconds"
                })

            },

            _onRouteMatched: function (oEvent) {
                this.oBusyDialog.open();
                var sCustomerId = parseInt(oEvent.getParameter("arguments").CustomerID);

                //console.log(sCustomerId);

                var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
                    "v2/odata/v4/CPMaster/FetchJRData()"
                );
                //console.log(posturl);

                var that = this;
                $.ajax({
                    url: posturl,
                    type: "GET",
                    async: true,
                    success: function (data) {
                        //console.log("Before data:",data.d.results)
                        var odata = data.d.results;
                        var filteredData = odata.filter(function (item) {
                            return parseInt(item.jobReqId) === parseInt(sCustomerId);
                        });
                        Filtersavedata = filteredData;
                        //console.log(filteredData);
                        var NoJSONModel = new sap.ui.model.json.JSONModel();
                        NoJSONModel.setData(filteredData);
                        that.getView().setModel(NoJSONModel, "FilterData");
                        that.oBusyDialog.close();
                    },
                    error: function (err) {
                        console.log("item status change failed");
                        console.log(err);
                        that.oBusyDialog.close();

                    }
                });
            },
            OnNavBack: function () {
                console.log("pressed")
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("SFMain");
                var oModel = this.getView().getModel("Matching");
                oModel.setData([]);
                this.getView().byId('personalSectionSFM4').setVisible(false);
                this.getView().byId('generate').setVisible(true);
                
            },
            navtoHP: function () {
                console.log("Back button pressed");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHomePage");
                var oModel = this.getView().getModel("Matching");
                oModel.setData([]);
                this.getView().byId('personalSectionSFM4').setVisible(false);
                this.getView().byId('generate').setVisible(true);

            },
            MatchCandi: function () {
                this.oBusyDialog.open();
                var data = this.getView().getModel("FilterData").getData();
                console.log(data);
                var sCustomerId = data[0].jobReqId;
                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("SFMaster", { CustomerID: sCustomerId });


                var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
                    "v2/odata/v4/CPMaster/MatchingCandidate(Jid='" + sCustomerId + "')"
                );
                console.log(posturl);

                var that = this;
                $.ajax({
                    url: posturl,
                    type: "GET",
                    async: true,
                    success: function (data) {
                        //console.log(data);
                        //console.log("Before data:",data.d.value)
                        var odata = data.d.value;
                        console.log(odata);
                        var NoJSONModel = new sap.ui.model.json.JSONModel();
                        NoJSONModel.setData(odata);
                        that.getView().setModel(NoJSONModel, "Matching");
                        that.oBusyDialog.close();
                        that.getView().byId('personalSectionSFM4').setVisible(true);
                        that.getView().byId('generate').setVisible(false);

                        // if (odata.overview == "<H2>No Candidate Matches as job description is empty</H2>") {
                        //     that.getView().byId('unmatched').setVisible(true);
                        // } else {
                        //     that.getView().byId('matched').setVisible(true);
                        // }
                        // //console.log(odata.personalId);
                        if(odata.numberOfMatches > 0){
                            that.getView().byId('Regis').setVisible(true);
                        }else{
                            console.log("bye");
                        }
                    },
                    error: function (err) {
                        console.log("item status change failed");
                        console.log(err);
                        that.oBusyDialog.close();

                    }

                });



            },
            Register: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Registering Data",
                    text: "Please wait..."
                });

                
            var oButton = oEvent.getSource();
            var oBindingContext = oButton.getBindingContext("Matching");
            var oCandidateData = oBindingContext.getObject();
            //console.log(oCandidateData.personalId);
            Mid = oCandidateData.personalId
                oBusyDialog.open();
                var that = this;
                var oModel = this.getOwnerComponent().getModel("cpmaster");
                
                console.log(Mid);
                var oFilter = new sap.ui.model.Filter("personalId", "EQ", Mid);
                oModel.read("/Candidates_Details", {
                    filters: [oFilter],
                    success: function (resp) {

                        var newodata = resp.results[0];
                        console.log(newodata);
                        var oComponent = this.getOwnerComponent();
                        var sBaseUrl = oComponent.getManifestEntry("sap.app").dataSources.v2.uri;
                        var posturl = sBaseUrl + "/Candidate()";
                        var pdata = {
                            "country": newodata.country,
                            "anonymized": "Non-anonymized",
                            "primaryEmail": newodata.primaryEmail,
                            "zip": newodata.zip,
                            "currentCompany": newodata.candCurrentCompany,
                            "homePhone": newodata.cellPhone,
                            "custMonthsYears": "20",
                            "firstName": newodata.firstName,
                            "currentTitle": newodata.candCurrentTitle,
                            "agreeToPrivacyStatement": "true",
                            "businessPhone": newodata.cellPhone,
                            "lastName": newodata.lastName,
                            "city": newodata.city,
                            "address": newodata.address,
                            "candidateLocale": "en_US",
                            "contactEmail": newodata.contactEmail,
                            "shareProfile": "0",
                            "custTotalExperience": "14",
                            "middleName": newodata.middleName,
                            "cellPhone": newodata.cellPhone,
                            "custHighestEducation": {
                                "results": [
                                    {
                                        "id": "49569"
                                    }
                                ]
                            }
                        };

                        console.log(pdata)
                        $.ajax({
                            url: posturl,
                            type: "POST",
                            data: JSON.stringify(pdata),
                            contentType: "application/json",
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("Authorization", "Basic " + btoa("LTIADMIN@larsento02T1:Ltiadmin@12345"));
                            },
                            success: function(response) {
                                console.log("Success:", response);
                            },
                            error: function(error) {
                                console.log("Error:", error);
                                console.log("Response Text:", error.responseText);
                            }
                        });

                        var sPath = "/Candidates_Details('"+Mid+"')"; 

                        oModel.remove(sPath, {
                            success: function () {
                                //sap.m.MessageToast.show("Entity deleted successfully!");
                            },
                            error: function (oError) {
                                sap.m.MessageToast.show("Error deleting entity: " + oError.message);
                            }
                        });

                        
                        that.getView().byId('personalSectionSFM4').setVisible(false);
                        that.getView().byId('generate').setVisible(true);
                        oBusyDialog.close();
                    }.bind(this),
                    error: function (err) {
                        console.error("Error fetching data", err);
                        oBusyDialog.close();
                    }
                });

            }
        });
    });
