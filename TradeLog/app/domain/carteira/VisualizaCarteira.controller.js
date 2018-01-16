sap.ui.define([
    'tradelog/shared/DomainController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (DomainController,
    Filter,
    FilterOperator) {
        "use strict";

        return DomainController.extend("tradelog.domain.carteira.VisualizaCarteira", {

            viewData: { bindPath: '', posicaoSelected: false, idPosicaoSelected: false, idCarteira: undefined },

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
                this.viewData.idCarteira = evt.getParameter("arguments").carteira;
                var sEntityPath = `/Carteira(${evt.getParameter("arguments").carteira})/Posicao`;
                this.bindView(sEntityPath);

                this.viewData.posicaoSelected = false;
                this.viewData.idPosicaoSelected = false;

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


            onClickPosicao: function (evt) {
                //debugger;
                this.viewData.idPosicaoSelected = evt.getSource().data().IdPosicao;
                this.viewData.posicaoSelected = this.viewData.idPosicaoSelected != undefined;

                this.getView().byId("detalhePosicao").bindElement(`/Posicao(${this.viewData.idPosicaoSelected})`);
            }


        });
    });