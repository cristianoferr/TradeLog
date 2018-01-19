jQuery.sap.require("tradelog.shared.PainelEditavel");

sap.ui.define([
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (
    Filter,
    FilterOperator) {
        "use strict";

        return tradelog.shared.PainelEditavel.extend("tradelog.domain.posicao.fragments.DetalhePosicao", {


            fechaPosicao: function (valorAcao, descricaoMovimento) {
                var idPosicaoSelected = this.getView().getModel("viewModel").oData.idPosicaoSelected;
                var parameters = {
                    "IdPosicao": idPosicaoSelected,
                    "valorAcao": valorAcao
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

            dialogClosePosition: function (evt) {
                var that = this;
                var precoAtual = sap.ui.getCore().byId("txtPrecoAtual").getText();

                var content = [new sap.m.Label({ text: this.traduzChave("posicao.valorAcaoFechamento") }),
                new sap.m.Input({ maxLength: 20, id: "inputValor", value: precoAtual, liveChange: this.inputFloat.bind(that), change: this.checkFloat.bind(that) })
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
                            var valor = Math.abs(parseFloat(inputValor.getValue()));
                            that.fechaPosicao(valor);
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