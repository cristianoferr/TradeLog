sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.domain.carteira.VisualizaCarteira", {

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
            },


            formataCalculoPrecoAtual: function (preco, quantidade) {
                return this.formatter.formataValor(preco * quantidade);
            },

            formataCalculoPercDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada;

                return this.formatter.formataValor(dif / valorEntrada);
            },
            formataCalculoValorDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada;
                return this.formatter.formataValor(dif);
            }


        });
    });