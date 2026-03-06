sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"larsento02t1/controller/Formatter",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/core/Fragment',
	'sap/m/BusyDialog'
], function (JSONModel, Controller, Formatter, Filter, FilterOperator, Fragment,BusyDialog) {
	"use strict";

	return Controller.extend("larsento02t1.controller.SFMain", {
		Formatter: Formatter,
		onInit: function () {
			this.oBusyDialog = new BusyDialog({
				title: "Fetching data from Successfactor",
				text: "please wait, it might take few seconds"
			})
			this.GetData();
		},
		GetData: function () {
			this.oBusyDialog.open();
			var posturl = this.getOwnerComponent().getManifestObject().resolveUri(
				"v2/odata/v4/CPMaster/FetchJRData()"
			);
			console.log(posturl);

			var that = this;
			$.ajax({
				url: posturl,
				type: "GET",
				async: true,
				success: function (data) {
					//console.log("Before data:",data.d.results)
					var odata = data.d.results;

					// console.log(odata);
					var NoJSONModel = new sap.ui.model.json.JSONModel();
					NoJSONModel.setData(odata);
					that.getView().setModel(NoJSONModel, "SFMainData");
					that.oBusyDialog.close();
				},
				error: function (err) {
					console.log("item status change failed");
					console.log(err);
					this.oBusyDialog.close();

				}
			});
		},
		onNavToDetails: function (oEvent) {

			var oBindingContext = oEvent.getParameters().rowBindingContext;
			if (oBindingContext) {
				// Get the value of the first column (jobReqId)
				var sPersonalId = oBindingContext.getProperty("jobReqId");
				// Store the value in a variable
				this._selectedPersonalId = sPersonalId;

				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var sCustomerId = this._selectedPersonalId;
				oRouter.navTo("SFMDetails", { CustomerID: sCustomerId });

			}


		},

		onValueHelpRequest: function (oEvent) {

			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			var id = oEvent.getSource().getId();

			if (id.endsWith("PIdLableSFMain")) {

				if (!this._pValueHelpDialog2) {
					this._pValueHelpDialog2 = Fragment.load({
						id: oView.getId(),
						name: "larsento02t1.view.fragment.JobId",
						controller: this
					}).then(function (oDialog2) {
						oView.addDependent(oDialog2);
						return oDialog2;
					});
				}
				this._pValueHelpDialog2.then(function (oDialog2) {
					oDialog2.getBinding("items").filter([new Filter("jobReqId", FilterOperator.Contains, sInputValue)]);
					oDialog2.open(sInputValue);
				});
			}


		},
		onValueHelpRequestC: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			var id = oEvent.getSource().getId();
			if (id.endsWith("PIdLable31SFMain")) {

				if (!this._pValueHelpDialog) {
					this._pValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "larsento02t1.view.fragment.JRCountry",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialog.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("country", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			}
		},

		onValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("jobReqId", FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);
			if (!oSelectedItem) {
				return;
			}
			this.byId("PIdLableSFMain").setValue(oSelectedItem.getTitle());
		},
		NonValueHelpSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("country", FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		NonValueHelpClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);
			if (!oSelectedItem) {
				return;
			}
			this.byId("PIdLable31SFMain").setValue(oSelectedItem.getTitle());
		},

		onclick: function (oEvent) {
			var pQuery = this.getView().byId("PIdLableSFMain").getValue();
			var NQuery = this.getView().byId("PIdLable31SFMain").getValue();
			if (pQuery || NQuery) {
				if (pQuery && NQuery == '') {
					console.log("jobReqId");
					this.getView().byId("TablenewSF").getBinding().filter([new Filter("jobReqId", FilterOperator.EQ, pQuery)]);
				} else if (NQuery && pQuery == '') {
					console.log("country");
					this.getView().byId("TablenewSF").getBinding().filter([new Filter("country", FilterOperator.Contains, NQuery)]);
				} else if (NQuery && pQuery) {
					console.log("both");
					var oFilter1 = new Filter("jobReqId", FilterOperator.EQ, pQuery);
					var oFilter2 = new Filter("country", FilterOperator.Contains, NQuery);
					var oCombinedFilter = new Filter({
						filters: [oFilter1, oFilter2],
						and: true
					});

					this.getView().byId("TablenewSF").getBinding().filter(oCombinedFilter);

				}
			}
				else {
					this.getView().byId("TablenewSF").getBinding().filter();
				}
			
		},
		navtoHP: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteHomePage");

		}


	});
});
