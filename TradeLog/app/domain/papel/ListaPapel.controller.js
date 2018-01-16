sap.ui.define([
    'tradelog/shared/DomainController',
    'tradelog/shared/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (DomainController,
    formatter,
    Filter,
    FilterOperator) {
        "use strict";

        return DomainController.extend("tradelog.domain.papel.ListaPapel", {
            formatter: formatter,

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
            }

        });
    });