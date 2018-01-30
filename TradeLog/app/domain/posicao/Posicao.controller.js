jQuery.sap.require("tradelog.shared.DomainController");
jQuery.sap.require("tradelog.domain.posicao.dialogs.AdicionaPosicao");

sap.ui.define([
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'DialogoPosicao',
    'ServicoCarteira'
], function (
    Filter,
    FilterOperator, dialogoPosicao, servicoCarteira) {
        "use strict";

        return tradelog.shared.DomainController.extend("tradelog.domain.posicao.Posicao", {
            //objeto contendo dados que podem ser usados pela view (por exemplo: para saber qual a aba atual que o usuário clicou)
            viewData: { bindPath: '', carteiraAtual: undefined, posicaoAtual: undefined },

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
                this.getRouter().getRoute('posicao').attachMatched(this.onRouteMatched, this);
            },
            /** Método chamado cada vez que o usuário acessa a tela
             * @function onRouteMatched
             * @return {type} {description}
             */
            onRouteMatched: function (evt) {
                this.viewData.carteiraAtual = evt.getParameter("arguments").carteira;
                this.viewData.posicaoAtual = evt.getParameter("arguments").posicao;

                this.bindView(`/Posicao(${this.viewData.posicaoAtual})`);

            },

            /**
             *Método que 'binda' a view atual com o caminho da entidade
            * @param sEntityPath
            */
            bindView: function (sEntityPath) {
                this.viewData.bindPathPosicao = sEntityPath;
                this.getView().byId("paginaPosicao").bindElement(sEntityPath);
                var viewModel = new sap.ui.model.json.JSONModel(this.viewData, true);
                this.getView().setModel(viewModel, "viewPosicao");
            },

            onPressBack: function () {
                this.navegaParaRota("carteira", { carteira: this.viewData.carteiraAtual });
            }

        });
    });