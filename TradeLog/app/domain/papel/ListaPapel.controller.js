sap.ui.define([
    'tradelog/shared/BaseController',
    'tradelog/shared/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    formatter,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.domain.papel.ListaPapel", {
            formatter: formatter,

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
            }

        });
    });