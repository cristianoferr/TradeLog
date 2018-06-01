jQuery.sap.require("tradelog.domain.posicao.dialogs.AdicionaPosicao");

sap.ui.define([
    'tradelog/shared/DomainController'
], function (DomainController) {
    "use strict";

    return DomainController.extend("tradelog.domain.balanco.consulta.BalancoCarteira", {
        //objeto contendo dados que podem ser usados pela view (por exemplo: para saber qual a aba atual que o usuário clicou)
        viewData: { bindPath: '', carteiraAtual: undefined, abaDadosGerais: true },

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
            this.viewData.carteiraAtual = evt.getParameter("arguments").carteira;
            this.viewData.bindPath = `/Carteira(${this.viewData.carteiraAtual})`;
            this.bindTableMovimento();
            sap.balanco = this;
        },

        bindTableMovimento: function () {
            var list = this.getView().byId("tableBalanco");
            list.bindItems(this.viewData.bindPath + "/TradeLogServer.Controllers.Balanco", list.getBindingInfo("items").template.clone());
            var binding = list.getBinding("items");

            binding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
        }

    });
});