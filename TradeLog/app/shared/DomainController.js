sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.shared.DomainController", {


            formataCalculoPreco: function (preco, quantidade) {
                return this.formatter.formataValor(preco * quantidade);
            },

            formataCalculoPercDif: function (valorPosicaoAtual, diferenca) {
                return this.formatter.formataValor(diferenca / (valorPosicaoAtual) * 100);
            },
            formataCalculoValorDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada * quantidade;
                return this.formatter.formataValor(dif);
            }
        });
    });