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
                this.getRouter().getRoute('carteira').attachMatched(this.onRouteMatched, this);
            },


            /** Método chamado cada vez que o usuário acessa a tela
             * @function onRouteMatched
             * @return {type} {description}
             */
            onRouteMatched: function (evt) {
                var sEntityPath = `/Carteira(${evt.getParameter("arguments").carteira})/Posicao`;
                //this.getView().byId("tablePosicao").bindElement(sEntityPath);

                var table = this.getView().byId("tablePosicao");
                table.bindItems(sEntityPath, table.getBindingInfo("items").template.clone());
            },


            formataCalculoPrecoAtual: function (preco, quantidade) {
                return this.formatter.formataValor(preco * quantidade);
            },

            formataCalculoPercDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada;

                return this.formatter.formataValor(dif / valorEntrada * 100);
            },
            formataCalculoValorDif: function (preco, quantidade, valorEntrada) {
                var dif = preco * quantidade - valorEntrada;
                return this.formatter.formataValor(dif);
            }


        });
    });