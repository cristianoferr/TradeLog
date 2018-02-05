sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.shared.DomainController", {


            formataCalculoDif: function (valor1, valor2) {
                return this.formatter.formataValor(parseFloat(valor1) - parseFloat(valor2));
            },

            formataCalculoPreco: function (preco, quantidade) {
                return this.formatter.formataValor(preco * quantidade);
            },

            formataCalculoPercDif: function (valorPosicaoAtual, diferenca) {
                return this.formatter.formataValor(diferenca / (valorPosicaoAtual) * 100);
            },
            formataCalculoValorDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada * quantidade;
                return this.formatter.formataValor(dif);
            },

            /*Retorna o valor percentual preco*quantidade relacionando com o preco de entrada*/
            formataCalculoValorPercDif: function (preco, quantidade, valorEntrada, precoEntrada) {
                var dif = preco * quantidade - valorEntrada * quantidade;
                return this.formatter.formataValor(dif / (precoEntrada * quantidade) * 100);
            },

            onRefreshModel: function () {
                this.getView().getModel().refresh();
            },
        });
    });