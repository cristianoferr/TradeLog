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


            onClickPosicao: function (evt) {
                //debugger;
                this.viewData.idPosicaoSelected = evt.getSource().data().IdPosicao;
                this.viewData.posicaoSelected = this.viewData.idPosicaoSelected != undefined;

                this.getView().byId("detalhePosicao").bindElement(`/Posicao(${this.viewData.idPosicaoSelected})`);
            },

            depositaValorCarteira: function (valor, descricaoMovimento) {
                var parameters = {
                    "IdCarteira": this.viewData.idCarteira,
                    "valor": valor,
                    "descricao": descricaoMovimento
                };
                var sServiceUrl = `Carteira/TradeLogServer.Controllers.DepositaFundos`;
                this.postData(sServiceUrl, parameters, this.sucessoTransferencia.bind(this), this.errorTransferencia.bind(this));
            },



            sucessoTransferencia: function () {
                this.toast(this.traduzChave("carteira.fundoTransferidoSucesso"));
                this.getView().getModel().refresh();
            },

            errorTransferencia: function () {
                this.toast(this.traduzChave("carteira.fundoTransferidoErro"));
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

            dialogAddFunds: function (evt) {
                var that = this;

                var content = [new sap.m.Label({ text: this.traduzChave("carteira.valorAMovimentar") }),
                new sap.m.Input({ maxLength: 20, id: "inputValor", liveChange: this.inputFloat.bind(that), change: this.checkFloat.bind(that) }),
                new sap.m.Label({ text: this.traduzChave("carteira.descricaoMovimentacao") }),
                new sap.m.Input({ maxLength: 50, id: "descricaoMovimento" })
                ];

                var dialog = new sap.m.Dialog({
                    title: this.traduzChave("carteira.tituloDialogoAdicionaFundos"),
                    type: 'Message',
                    content: content,
                    beginButton: new sap.m.Button({
                        text: this.traduzChave("carteira.depositaFundos"),
                        press: function (evt) {
                            var inputValor = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0];
                            var descricaoMovimento = evt.getSource().oParent.getContent().filter(x => x.sId == "descricaoMovimento")[0];
                            var valor = Math.abs(parseFloat(inputValor.getValue()));
                            that.depositaValorCarteira(valor, descricaoMovimento.getValue());
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

            dialogRemoveFunds: function (evt) {
                var that = this;

                var content = [new sap.m.Label({ text: this.traduzChave("carteira.valorAMovimentar") }),
                new sap.m.Input({ maxLength: 20, id: "inputValor", liveChange: this.inputFloat.bind(that), change: this.checkFloat.bind(that) }),
                new sap.m.Label({ text: this.traduzChave("carteira.descricaoMovimentacao") }),
                new sap.m.Input({ maxLength: 50, id: "descricaoMovimento" })
                ];

                var dialog = new sap.m.Dialog({
                    title: this.traduzChave("carteira.tituloDialogoRemoveFundos"),
                    type: 'Message',
                    content: content,
                    beginButton: new sap.m.Button({
                        text: this.traduzChave("carteira.removerFundos"),
                        press: function (evt) {
                            var inputValor = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0];
                            var descricaoMovimento = evt.getSource().oParent.getContent().filter(x => x.sId == "descricaoMovimento")[0];
                            var valor = Math.abs(parseFloat(inputValor.getValue()));
                            that.retirarValorCarteira(valor, descricaoMovimento.getValue());
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