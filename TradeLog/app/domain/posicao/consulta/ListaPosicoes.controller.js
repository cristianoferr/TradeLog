sap.ui.define([
    'tradelog/shared/DomainController',
    'DialogoCarteira',
    'DialogoPosicao',
    'ServicoCarteira'
], function (DomainController, dialogoCarteira, dialogoPosicao, servicoCarteira) {
    "use strict";

    let that;

    return DomainController.extend("tradelog.domain.posicao.consulta.ListaPosicoes", {

        viewData: { bindPath: '', posicaoSelected: false, idPosicaoSelected: false, idCarteira: undefined },

        onInit: function () {
            that = this;
            var oComponent = that.getOwnerComponent();
            that._router = oComponent.getRouter();
            that.getRouter().getRoute('carteira').attachMatched(that.onRouteMatched, this);
        },
        onRouteMatched: onRouteMatched,
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
        that.viewData.idCarteira = evt.getParameter("arguments").carteira;
        var sEntityPath = `/Carteira(${evt.getParameter("arguments").carteira})`;
        that.bindView(sEntityPath);

        that.viewData.posicaoSelected = false;
        that.viewData.idPosicaoSelected = false;

    }

    /**
     *Método que 'binda' a view atual com o caminho da entidade
    * @param sEntityPath
    */
    function bindView(sEntityPath) {
        //that.getView().byId("tablePosicao").bindElement(sEntityPath);
        that.viewData.bindPath = sEntityPath;


        bindPosicaoAtivas(sEntityPath);
        bindPosicaoFechadas(sEntityPath);
    }

    function bindPosicaoFechadas(sEntityPath) {
        var table = that.getView().byId("tablePosicaoFechada");
        if (!table) {
            return;
        }

        table.bindItems(sEntityPath + "/PosicaoFechada", table.getBindingInfo("items").template.clone());
    }

    function bindPosicaoAtivas(sEntityPath) {

        var table = that.getView().byId("tablePosicao");
        if (!table) {
            return;
        }
        table.bindItems(sEntityPath + "/Posicao", table.getBindingInfo("items").template.clone());
        table.attachUpdateFinished(function (evt) {
            var items = evt.oSource.getItems();
            var cacheModel = evt.oSource.getModel("cacheModel");
            var posicoes = [];
            var totalPosicao = 0;

            //   adicionar os dados do cache em app: na view
            items.forEach((item) => {
                var dado = {
                    CodigoPapel: item.data().CodigoPapel,
                    IdPosicao: item.data().IdPosicao,
                    PrecoMedioCompra: item.data().PrecoMedioCompra,
                    PrecoMedioVenda: item.data().PrecoMedioVenda,
                    QuantidadeLiquida: item.data().QuantidadeLiquida,
                    ValorPosicaoAtual: item.data().ValorPosicaoAtual,
                };
                posicoes.push(dado);
                totalPosicao += parseFloat(item.data().ValorPosicaoAtual);
            });
            cacheModel.setProperty("/posicoes", posicoes);
            cacheModel.setProperty("/TotalPosicao", totalPosicao);


        });

        var viewModel = new sap.ui.model.json.JSONModel(that.viewData, true);
        that.getView().setModel(viewModel, "viewModel");
    }

    function callDepositaValorCarteira(valor, descricaoMovimento) {
        servicoCarteira.depositaValorCarteira.call(that, valor, descricaoMovimento);
    }

    function onClickPosicao(evt) {
        //debugger;
        that.viewData.idPosicaoSelected = evt.getSource().data().IdPosicao;
        that.viewData.posicaoSelected = that.viewData.idPosicaoSelected != undefined;
        that.navegaParaRota("posicao", { carteira: that.viewData.idCarteira, posicao: that.viewData.idPosicaoSelected });

    }

    /*Dialogo para criar uma posição nova (ou automaticamente adicionar à uma posição existente) */
    function onDialogCreatePosition(evt) {
        var carteiraAtual = that.getView().getBindingContext().getObject();
        var parameters = {
            IdCarteira: carteiraAtual.IdCarteira,
            ValorLiquidoCarteira: carteiraAtual.ValorLiquido,
            custoOperacao: carteiraAtual.CustoOperacaoPadrao
        };
        dialogoPosicao.dialogPosition.call(that, evt, parameters, servicoCarteira);

    }

    function retirarValorCarteira(valor, descricaoMovimento) {
        servicoCarteira.retiraValorCarteira.call(that, valor, descricaoMovimento);
    }

    function onDialogAddFunds(evt) {
        dialogoCarteira.dialogAddFunds.call(that, evt);
    }

    function onDialogRemoveFunds(evt) {
        dialogoCarteira.dialogRemoveFunds.call(that, evt);
    }

});