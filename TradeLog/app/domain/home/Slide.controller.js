sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.domain.home.Slide", {

            onInit: function () {
                var that = this;
                setInterval(function () {
                    var carrossel = that.getView().byId("carrossel");
                    if (carrossel) {
                        carrossel.next();
                    }
                }, 6000);
            },


        });
    });