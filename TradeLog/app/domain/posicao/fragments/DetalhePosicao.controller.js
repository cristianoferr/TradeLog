jQuery.sap.require("tradelog.shared.PainelEditavel");
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

        return tradelog.shared.PainelEditavel.extend("tradelog.domain.posicao.fragments.DetalhePosicao", {

            routeMatched: function () {
                var data = this.getView().getModel("viewModel").oData;
                this.getView().byId("btnCarteira").bindElement(data.bindPath);
            },

            fechaPosicao: function (valorAcao, quantidadeAtual) {
                var idPosicaoSelected = this.getView().getModel("viewModel").oData.idPosicaoSelected;
                var parameters = {
                    "IdPosicao": idPosicaoSelected,
                    "valorAcao": valorAcao,
                    "quantidadeFechada": quantidadeAtual
                };
                var sServiceUrl = `Posicao/TradeLogServer.Controllers.FechaPosicao`;
                this.postData(sServiceUrl, parameters, this.sucessoFechamento.bind(this), this.errorFechamento.bind(this));
            },

            eventToggle: function (bEdit) {
                this.getView().byId("btnBuyPosition").setVisible(!bEdit);
                this.getView().byId("btnSellPosition").setVisible(!bEdit);
            },

            /*Dialogo de fechar a posição */
            dialogBuyPosition: function (evt) {
                var parameters = this.getParametersDialogoPosicao(evt);
                parameters.tipo = "C";

                dialogoPosicao.dialogBuyPosition.call(this, evt, parameters, servicoCarteira);
            },
            /*Dialogo de fechar a posição */
            dialogSellPosition: function (evt) {
                var parameters = this.getParametersDialogoPosicao(evt);
                parameters.tipo = "V";

                dialogoPosicao.dialogSellPosition.call(this, evt, parameters, servicoCarteira);
            },

            dialogClosePosition: function (evt) {
                var parameters = this.getParametersDialogoPosicao(evt);

                dialogoPosicao.dialogClosePosition.call(this, evt, parameters, servicoCarteira);
            },

            /*Retorna um objeto com todos os parametros necessário para comprar/vendar a posição atual*/
            getParametersDialogoPosicao: function (evt) {
                var btncarteira = this.getView().byId("btnCarteira");
                var carteiraAtual = btncarteira.getBindingContext().getObject();
                var data = evt.getSource().getBindingContext().getObject();
                var parameters = {
                    IdPapel: data.IdPapel,
                    PrecoAtual: data.PrecoAtual,
                    QuantidadeLiquida: data.QuantidadeLiquida,
                    IdCarteira: data.IdCarteira,
                    PrecoStopAtual: data.PrecoStopAtual,
                    ValorLiquidoCarteira: carteiraAtual.ValorLiquido,
                    custoOperacao: carteiraAtual.CustoOperacaoPadrao,
                    carteiraAtual: carteiraAtual

                };
                return parameters;
            }

        });
    });