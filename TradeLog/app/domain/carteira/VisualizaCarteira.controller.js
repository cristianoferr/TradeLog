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
            },

            depositaValorCarteira: function (valor, descricaoMovimento) {
                var parameters = {
                    "valor": valor,
                    "descricao": descricaoMovimento
                };
                var sServiceUrl = `Carteira(${this.viewData.idCarteira})/TradeLogServer.Controllers.DepositaFundos`;
                //this.getView().getModel().create(sServiceUrl, parameters);
                this.postData(sServiceUrl, parameters);
            },

            /*
            Função que realiza uma chamada para um serviço odata no caminho indicado usando o serviço atual como base
             */
            postData: function (sServicePath, parameters) {
                var jsonParameters = JSON.stringify(parameters);
                var that = this;

                var createPost = new XMLHttpRequest();
                createPost.open("GET", this.getView().getModel().sServiceUrl + sServicePath, true);
                createPost.setRequestHeader("Accept", "application/json");
                createPost.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                createPost.onreadystatechange = function (evt) {
                    if (createPost.readyState == 4 && createPost.status == 200) {
                        that.sucessoTransferencia();
                    } else {
                        that.errorTransferencia();
                    }
                };
                createPost.send(jsonParameters);
            },

            sucessoTransferencia: function () {
                //TODO: mostrar mensagem
            },

            errorTransferencia: function () {
                //TODO: mostrar mensagem de erro
            },

            retirarValorCarteira: function (valor, descricaoMovimento) {
                if (valor == 0) {
                    //TODO: mostrar mensagem de erro
                    return;
                }
                var parameters = {
                    "valor": valor,
                    "descricao": descricaoMovimento
                };
                var sServiceUrl = `Carteira(${this.viewData.idCarteira})/TradeLogServer.Controllers.RetiraFundos`;
                this.getView().getModel().create(sServiceUrl, parameters);
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
                //carteira.tituloDialogoRemoveFundos
                var dialog = sap.ui.xmlfragment("tradelog.domain.carteira.dialogs.AddRemoveFunds", this);
                dialog.mode = "Remove";
                dialog.open();
            },

        });
    });