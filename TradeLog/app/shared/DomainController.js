sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.controller.DomainController", {


            formataCalculoPreco: function (preco, quantidade) {
                return this.formatter.formataValor(preco * quantidade);
            },

            formataCalculoPercDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada * quantidade;
                return this.formatter.formataValor(dif / (valorEntrada * quantidade) * 100);
            },
            formataCalculoValorDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada * quantidade;
                return this.formatter.formataValor(dif);
            }
        });
    });