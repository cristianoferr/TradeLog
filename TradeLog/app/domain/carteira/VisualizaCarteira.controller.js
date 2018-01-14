sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.domain.carteira.VisualizaCarteira", {

            viewData: { bindPath: '', posicaoSelected: false, idPosicaoSelected=false },

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
                this.bindView(sEntityPath);

            },

            /**
             *Método que 'binda' a view atual com o caminho da entidade
            * @param sEntityPath
            */
            bindView: function (sEntityPath) {
                //this.getView().byId("tablePosicao").bindElement(sEntityPath);
                this.viewData.bindPath = sEntityPath;

                var table = this.getView().byId("tablePosicao");
                table.bindItems(sEntityPath, table.getBindingInfo("items").template.clone());

                var viewModel = new sap.ui.model.json.JSONModel(this.viewData, true);
                this.getView().setModel(viewModel, "viewModel");
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
            },

            onClickPosicao: function (evt) {
                //debugger;
                this.viewData.idPosicaoSelected = evt.getSource().data().IdPosicao;
                this.viewData.posicaoSelected = this.viewData.idPosicaoSelected != undefined;


            }


        });
    });