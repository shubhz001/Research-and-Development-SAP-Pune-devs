sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/Label',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/comp/smartvariants/PersonalizableInfo',
	"sap/f/library"
],
    function (Controller,Label, Filter, FilterOperator, PersonalizableInfo,fioriLibrary) {
        "use strict";

        return Controller.extend("larsento02t1.controller.SFMaster", {
            onInit: function () {
            
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("SFMaster").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
				var sCustomerId = parseInt(oEvent.getParameter("arguments").CustomerID);
                console.log(sCustomerId);

				//this.oBusyDialog.open();
			var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
				"v2/odata/v4/CPMaster/MatchingCandidate(Jid='"+sCustomerId+"')"
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
					// console.log(odata);
					var NoJSONModel = new sap.ui.model.json.JSONModel();
					NoJSONModel.setData(odata);
					that.getView().setModel(NoJSONModel, "Matching");
					//that.oBusyDialog.close();
				},
				error: function (err) {
					console.log("item status change failed");
					console.log(err);
					this.oBusyDialog.close();

				}
			});
				
            },
            
        

        });
    });
