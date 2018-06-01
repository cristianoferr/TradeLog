sap.ui.define([
    'tradelog/shared/DomainController',
    'DialogoCarteira',
    'DialogoPosicao',
    'ServicoCarteira'
], function (DomainController, dialogoCarteira, dialogoPosicao, servicoCarteira) {
    "use strict";

    let that;

    return DomainController.extend("tradelog.domain.carteira.ListaPosicoes", {

        viewData: { bindPath: '', posicaoSelected: false, idPosicaoSelected: false, idCarteira: undefined },

        onInit: function () {
            that = this;
            var oComponent = this.getOwnerComponent();
            this._router = oComponent.getRouter();
            this.getRouter().getRoute('carteira').attachMatched(this.onRouteMatched, this);
        },
        onRouteMatched: onRouteMatched,
        guardaDadosPosicao: guardaDadosPosicao,
        bindView: bindView,
        callDepositaValorCarteira: callDepositaValorCarteira,
        onClickPosicao: onClickPosicao,
        onDialogCreatePosition: onDialogCreatePosition,
        retirarValorCarteira: retirarValorCarteira,
        onDialogAddFunds: onDialogAddFunds,
        onDialogRemoveFunds: onDialogRemoveFunds


    });

    /** Método chamado cada vez que o usuário acessa a tela
     * @function onRouteMatched
     * @return {type} {description}
     */
    function onRouteMatched(evt) {
        this.viewData.idCarteira = evt.getParameter("arguments").carteira;
        var sEntityPath = `/Carteira(${evt.getParameter("arguments").carteira})`;
        this.bindView(sEntityPath);

        this.viewData.posicaoSelected = false;
        this.viewData.idPosicaoSelected = false;

    }

    /**
     * evento chamado quando os dados da posicao são carregados
     */
    function guardaDadosPosicao(evt) {
        var model = this.getView().getModel("viewModel");
        debugger;
    }

    /**
     *Método que 'binda' a view atual com o caminho da entidade
    * @param sEntityPath
    */
    function bindView(sEntityPath) {
        //this.getView().byId("tablePosicao").bindElement(sEntityPath);
        this.viewData.bindPath = sEntityPath;

        var table = this.getView().byId("tablePosicao");
        sap.ui.tablePosicao = table;
        table.bindItems(sEntityPath + "/Posicao", table.getBindingInfo("items").template.clone());
        table.attachUpdateFinished(function (evt) {
            var items = evt.oSource.getItems();
            var cacheModel = evt.oSource.getModel("cacheModel");
            var posicoes = [];
            adicionar os dados do cache em app: na view
            items.forEach((item) => {

            });
            cacheModel.setProperty("/posicoes", posicoes);
            debugger;

        });

        var viewModel = new sap.ui.model.json.JSONModel(this.viewData, true);
        this.getView().setModel(viewModel, "viewModel");
    }

    function callDepositaValorCarteira(valor, descricaoMovimento) {
        servicoCarteira.depositaValorCarteira.call(this, valor, descricaoMovimento);
    }

    function onClickPosicao(evt) {
        //debugger;
        this.viewData.idPosicaoSelected = evt.getSource().data().IdPosicao;
        this.viewData.posicaoSelected = this.viewData.idPosicaoSelected != undefined;
        this.navegaParaRota("posicao", { carteira: this.viewData.idCarteira, posicao: this.viewData.idPosicaoSelected });

    }

    /*Dialogo para criar uma posição nova (ou automaticamente adicionar à uma posição existente) */
    function onDialogCreatePosition(evt) {
        var carteiraAtual = this.getView().getBindingContext().getObject();
        var parameters = {
            IdCarteira: carteiraAtual.IdCarteira,
            ValorLiquidoCarteira: carteiraAtual.ValorLiquido,
            custoOperacao: carteiraAtual.CustoOperacaoPadrao
        };
        dialogoPosicao.dialogPosition.call(this, evt, parameters, servicoCarteira);

    }

    function retirarValorCarteira(valor, descricaoMovimento) {
        servicoCarteira.retiraValorCarteira.call(this, valor, descricaoMovimento);
    }

    function onDialogAddFunds(evt) {
        dialogoCarteira.dialogAddFunds.call(this, evt);
    }

    function onDialogRemoveFunds(evt) {
        dialogoCarteira.dialogRemoveFunds.call(this, evt);
    }

});