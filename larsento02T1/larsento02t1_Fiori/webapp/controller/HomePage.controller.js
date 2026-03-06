sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("larsento02t1.controller.HomePage", {
            onInit: function () {
                // var oTile = this.byId("profileOid");
                // var oBusyIndicator = this.byId("myBusyIndicator");

                // // Show the busy indicator and update the header text
                // oBusyIndicator.setVisible(true);
                // oTile.setHeader("Please wait Data is getting load...");

            },
            onNavToCPM: function (oEvent) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CandidatePM");
            },
            onNavToSFM: function (oEvent) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("SFMain");
            },
            onNavToPo: function (oEvent) {

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("ProfileOverview");
            },
            onpress: function () {
                var oTile = this.byId("profileOid");
                var oBusyIndicator = this.byId("myBusyIndicator");

                // // Show the busy indicator and update the header text
                // oBusyIndicator.setVisible(true);
                // oTile.setHeader("Please wait for 10 seconds...");

                // // Set a timeout to hide the busy indicator and reset the header text after 10 seconds
                // setTimeout(function () {
                    oBusyIndicator.setVisible(false);
                    oTile.setHeader("Profile overview"); // Reset the header text
                // }, 10000); // 10000 milliseconds = 10 seconds
            }
        });
    });
