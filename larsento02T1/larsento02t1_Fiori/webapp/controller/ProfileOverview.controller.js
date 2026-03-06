   sap.ui.define([
                "sap/ui/core/mvc/Controller",
                "sap/viz/ui5/data/FlattenedDataset",
                "sap/viz/ui5/controls/common/feeds/FeedItem"
            ], function (Controller, FlattenedDataset, FeedItem) {
                "use strict";
                return Controller.extend("larsento02t1.controller.CandidatePM", {
                    
                    onInit: function () {
                        this.onreadData();
                    },
                    onreadData: function(){
                        var oBusyDialog = new sap.m.BusyDialog({
                            title: "Loading Data",
                            text: "Please wait..."
                        });
                        
                        var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
                            "v2/odata/v4/CPMaster/DataSummary()"
                        );
                        console.log(posturl);
                        oBusyDialog.open();
                        var that = this; 
                        $.ajax({
                            url: posturl,
                            type: "GET",
                            async: true,
                            success: function (data) {
                                console.log(data.d.results);
                                var data = data.d.results;
                                var oDataModel = new sap.ui.model.json.JSONModel(data);
                                var oChartContainer = that.getView().byId("chartContainer");
                                oChartContainer.setModel(oDataModel);
                    
                                var oDataset = new FlattenedDataset({
                                    dimensions: [{
                                        name: "Job Request ID",
                                        value: "{jobReqId}"
                                    }],
                                    measures: [{
                                        name: "Number of Matching Candidates",
                                        value: "{numberOfMatchingCandidates}"
                                    }],
                                    data: {
                                        path: "/"
                                    }
                                });
                                oChartContainer.setDataset(oDataset);
                    
                                var oCategoryFeed = new FeedItem({
                                    uid: "categoryAxis",
                                    type: "Dimension",
                                    values: ["Job Request ID"]
                                });
                                var oRevenueFeed = new FeedItem({
                                    uid: "valueAxis",
                                    type: "Measure",
                                    values: ["Number of Matching Candidates"]
                                });
                                oChartContainer.addFeed(oCategoryFeed);
                                oChartContainer.addFeed(oRevenueFeed);
                    
                                // Set chart title
                                oChartContainer.setVizProperties({
                                    title: {
                                        text: "Job Matching Candidates Overview"
                                    }
                                });
                    
                                that.byId("chartContainer").setVizType('column');
                                oBusyDialog.close();
                            },
                            error: function (err) {
                                console.log("item status change failed");
                                console.log(err);
                                oBusyDialog.close();
                            }
                        });
                    }
                    ,
                    navtoHP: function (oEvent) {
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("RouteHomePage");
        
                    }
                });
            });