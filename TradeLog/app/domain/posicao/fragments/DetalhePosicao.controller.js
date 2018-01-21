jQuery.sap.require("tradelog.shared.PainelEditavel");

sap.ui.define([
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (
    Filter,
    FilterOperator) {
        "use strict";

        return tradelog.shared.PainelEditavel.extend("tradelog.domain.posicao.fragments.DetalhePosicao", {


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

            sucessoFechamento: function () {
                this.toast(this.traduzChave("posicao.posicaoFechadaSucesso"));
                this.getView().getModel().refresh();
            },

            errorFechamento: function () {
                this.toast(this.traduzChave("posicao.posicaoFechadaErro"));
            },

            eventToggle: function (bEdit) {
                this.getView().byId("btnBuyPosition").setVisible(!bEdit);
                this.getView().byId("btnSellPosition").setVisible(!bEdit);
            },

            dialogClosePosition: function (evt) {
                var that = this;
                var precoAtual = sap.ui.getCore().byId("txtPrecoAtual").getText();
                var quantidadeAtual = sap.ui.getCore().byId("txtQuantidadeAtual").getText();
                var precoTotal = parseFloat(precoAtual) * quantidadeAtual;

                var functionAtualizaValor = function (evt) {
                    this.inputFloat(evt);
                    this.checkFloat(evt);
                    var precoAtual = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0].getValue();
                    var quantidadeAtual = evt.getSource().oParent.getContent().filter(x => x.sId == "quantidadeAtual")[0].getValue();
                    var precoTotal = parseFloat(precoAtual) * quantidadeAtual;
                    var inputValorTotal = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValorTotal")[0];
                    inputValorTotal.setValue(this.formatter.formataValor(precoTotal));
                }

                var content = [
                    new sap.m.Label({ text: this.traduzChave("posicao.valorAcaoFechamento") }),
                    new sap.m.Input({ maxLength: 20, id: "inputValor", value: precoAtual, liveChange: functionAtualizaValor.bind(this), change: functionAtualizaValor.bind(this) }),
                    new sap.m.Label({ text: this.traduzChave("posicao.quantidade") }),
                    new sap.m.Input({ maxLength: 20, id: "quantidadeAtual", value: quantidadeAtual, liveChange: functionAtualizaValor.bind(this), change: functionAtualizaValor.bind(this) }),
                    new sap.m.Label({ text: this.traduzChave("posicao.valorTotal") }),
                    new sap.m.Input({ maxLength: 20, id: "inputValorTotal", value: this.formatter.formataValor(precoTotal), editable: false })
                ];

                //content[1].set

                var dialog = new sap.m.Dialog({
                    title: this.traduzChave("posicao.tituloFechar"),
                    type: 'Message',
                    content: content,
                    beginButton: new sap.m.Button({
                        text: this.traduzChave("posicao.fechaPosicao"),
                        press: function (evt) {
                            var inputValor = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0];
                            var quantidadeAtual = evt.getSource().oParent.getContent().filter(x => x.sId == "quantidadeAtual")[0];
                            var valor = Math.abs(parseFloat(inputValor.getValue()));
                            that.fechaPosicao(valor, parseInt(quantidadeAtual.getValue()));
                            dialog.close();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: this.traduzChave("generico.fechar"),
                        press: function () {
                            dialog.close();
                        }
                    }),
                    afterClose: function () {
                        dialog.destroy();
                    }
                });

                dialog.open();
            },

        });
    });