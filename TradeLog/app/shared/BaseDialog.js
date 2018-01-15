sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.controller.BaseDialog", {

            onInit: function (masterController) {
                this.masterController = masterController;
            },

            setDialog: function (oDialog) {
                this._oDialog = oDialog;
                this.viewId = oDialog.id;

                oDialog.setModel(this.getView().getModel("i18n"), "i18n");
                this._oDialog.setModel(this.masterController.getView().getModel());
            },

            getView: function () {
                return this.masterController.getView();
            },
            close: function (oEvent) {
                //pode ser que já tenha fechado...
                this._oDialog.close();
            }
        });
    });