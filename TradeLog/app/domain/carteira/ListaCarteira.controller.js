sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.domain.carteira.ListaCarteira", {

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
                this.getRouter().getRoute('carteiras').attachMatched(this.onRouteMatched, this);
                sap.ui.currentView = this;
            },

            onRouteMatched: function (evt) {

            },

            onSelectCarteira: function (evt) {
                var id = evt.getParameters().listItem.data("idRegistro");
                this.navegaParaRota("carteira", { carteira: id });
            },

            onAdicionaCarteira: function (evt) {
                //TODO: implementar esse dialogo
                debugger;
            },

            /**
            * O que acontece quando o usuário clica em voltar? Descubra abaixo.
            */
            onNavBack: function () {
                this.navegaParaRota("home");
            }


        });
    });