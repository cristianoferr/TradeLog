sap.ui.define([
    'tradelog/shared/DomainController',
    'DialogoCarteira',
    'DialogoPosicao',
    'ServicoCarteira'
], function (DomainController, dialogoCarteira, dialogoPosicao, servicoCarteira) {
    "use strict";

    return DomainController.extend("tradelog.domain.carteira.ListaPosicoes", {

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
            var sEntityPath = `/Carteira(${evt.getParameter("arguments").carteira})`;
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
            table.bindItems(sEntityPath + "/TradeLogServer.Controllers.Posicao", table.getBindingInfo("items").template.clone());

            var viewModel = new sap.ui.model.json.JSONModel(this.viewData, true);
            this.getView().setModel(viewModel, "viewModel");
        },

        callDepositaValorCarteira: function (valor, descricaoMovimento) {
            servicoCarteira.depositaValorCarteira.call(this, valor, descricaoMovimento);
        },


        onClickPosicao: function (evt) {
            //debugger;
            this.viewData.idPosicaoSelected = evt.getSource().data().IdPosicao;
            this.viewData.posicaoSelected = this.viewData.idPosicaoSelected != undefined;

            this.getView().byId("detalhePosicao").bindElement(`/Posicao(${this.viewData.idPosicaoSelected})`);
        },

        atualizaValorEntradaDialogo: function (evt) {
            dialogoCarteira.atualizaValorEntradaDialogo.call(this, evt);
        },

        /*Dialogo para criar uma posição nova (ou automaticamente adicionar à uma posição existente) */
        onDialogCreatePosition: function (evt) {
            var carteiraAtual = this.getView().getBindingContext().getObject();
            var parameters = {
                IdCarteira: carteiraAtual.IdCarteira,
                ValorLiquidoCarteira: carteiraAtual.ValorLiquido,
                custoOperacao: carteiraAtual.CustoOperacaoPadrao
            };
            dialogoPosicao.dialogCreatePosition.call(this, evt, parameters, servicoCarteira);

        },

        retirarValorCarteira: function (valor, descricaoMovimento) {
            var parameters = {
                "IdCarteira": this.viewData.idCarteira,
                "valor": valor,
                "descricao": descricaoMovimento
            };
            var sServiceUrl = `Carteira/TradeLogServer.Controllers.RetiraFundos`;
            this.postData(sServiceUrl, parameters, this.sucessoTransferencia.bind(this), this.errorTransferencia.bind(this));
        },

        onDialogAddFunds: function (evt) {
            dialogoCarteira.dialogAddFunds.call(this, evt);
        },

        onDialogRemoveFunds: function (evt) {
            dialogoCarteira.dialogRemoveFunds.call(this, evt);
        },

    });
});