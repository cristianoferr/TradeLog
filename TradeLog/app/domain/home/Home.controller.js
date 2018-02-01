sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.domain.home.Home", {

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
            },

            onSelecionaMenu: function (evt) {
                var rota = evt.mParameters.listItem.data("rota");
                evt.mParameters.listItem.setSelected(false);
                this.navegaParaRota(rota);
            }

        });
    });