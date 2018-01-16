sap.ui.define([
    'tradelog/shared/DomainController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (DomainController,
    Filter,
    FilterOperator) {
        "use strict";

        return DomainController.extend("tradelog.controller.BaseDialog", {

            onInit: function (masterController) {
                this.masterController = masterController;

            },

            onShow: function () {
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
            },


        });
    });