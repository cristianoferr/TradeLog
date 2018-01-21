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

            atualizaValorEntradaDialogo: function (evt) {
                var source = evt.getSource()
                var item = source.getSelectedItem()
                var data = item.getBindingContext().getObject();

                this.getModel("localModel").oData.PrecoAcao = this.formatter.formataValor(data.ValorAtual);
                this.getModel("localModel").oData.PrecoStopOpcional = this.formatter.formataValor(data.ValorAtual);
            },

            /*Dialogo para criar uma posição nova (ou automaticamente adicionar à uma posição existente) */
            dialogCreatePosition: function () {
                //AdicionaPosicao
                var content = sap.ui.xmlfragment("tradelog.domain.carteira.fragments.AdicionaPosicao", this);
                content.setModel(this.getModel());
                content.setModel(this.getModel("dominio"), "dominio");

                var carteiraAtual = this.getView().getBindingContext().getObject();

                var dataPosicao = {
                    IdPapel: 0,
                    CanChangePapel: true,
                    tipoOperacao: 'C',
                    IdCarteira: this.viewData.idCarteira,
                    quantidade: 100,
                    PrecoAcao: 0,
                    custoOperacao: this.formatter.formataValor(carteiraAtual.CustoOperacaoPadrao),
                    PrecoStopOpcional: "0.00",
                    totalTrade: 0,
                    liquidoCarteira: carteiraAtual.ValorLiquido,
                };
                var modelPosicao = new sap.ui.model.json.JSONModel(dataPosicao);
                this.getView().setModel(modelPosicao, "localModel");
                content.setModel(modelPosicao, "localModel");

                var functionOk = function (evt) {
                    var data = this.getModel("localModel").oData;

                    this.criaPosicao(data);
                }

                this.criaDialogPadrao("carteira.adicionaPosicao", "carteira.criaPosicao", content, functionOk.bind(this));
            },

            criaPosicao: function (data) {

                /* action.Parameter<int>("IdPapel");
                 action.Parameter<int>("tipoOperacao");
                 action.Parameter<int>("IdCarteira");
                 action.Parameter<float>("PrecoAcao");
                 action.Parameter<int>("quantidade");
                 action.Parameter<float>("custoOperacao");
                 action.Parameter<float>("PrecoStopOpcional");*/

                var parameters = {
                    "IdPapel": data.IdPapel,
                    "tipoOperacao": data.tipoOperacao,
                    "IdCarteira": data.IdCarteira,
                    "PrecoAcao": data.PrecoAcao,
                    "quantidade": data.quantidade,
                    "custoOperacao": data.custoOperacao,
                    "PrecoStopOpcional": data.PrecoStopOpcional
                };

                var sServiceUrl = `Trade/TradeLogServer.Controllers.ExecutaTrade`;
                this.postData(sServiceUrl, parameters, this.sucessoTrade.bind(this), this.errorTrade.bind(this));
            },

            /*Callback quando há sucesso na transferencia de fundos à carteira */
            sucessoTrade: function () {
                this.toast(this.traduzChave("trade.sucessoTrade"));
                this.getView().getModel().refresh();
            },

            /*Callback quando há erro na transferencia de fundos à carteira */
            errorTrade: function () {
                this.toast(this.traduzChave("trade.erroTrade"));
            },


            /*Callback quando há sucesso na transferencia de fundos à carteira */
            sucessoTransferencia: function () {
                this.toast(this.traduzChave("carteira.fundoTransferidoSucesso"));
                this.getView().getModel().refresh();
            },

            /*Callback quando há erro na transferencia de fundos à carteira */
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
                var content = [new sap.m.Label({ text: this.traduzChave("carteira.valorAMovimentar") }),
                new sap.m.Input({ maxLength: 20, id: "inputValor", liveChange: this.inputFloat.bind(this), change: this.checkFloat.bind(this) }),
                new sap.m.Label({ text: this.traduzChave("carteira.descricaoMovimentacao") }),
                new sap.m.Input({ maxLength: 50, id: "descricaoMovimento" })
                ];

                var functionOk = function (evt) {
                    var inputValor = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0];
                    var descricaoMovimento = evt.getSource().oParent.getContent().filter(x => x.sId == "descricaoMovimento")[0];
                    var valor = Math.abs(parseFloat(inputValor.getValue()));
                    this.depositaValorCarteira(valor, descricaoMovimento.getValue());
                }

                this.criaDialogPadrao("carteira.tituloDialogoAdicionaFundos", "carteira.depositaFundos", content, functionOk.bind(this));
            },

            dialogRemoveFunds: function (evt) {

                var content = [new sap.m.Label({ text: this.traduzChave("carteira.valorAMovimentar") }),
                new sap.m.Input({ maxLength: 20, id: "inputValor", liveChange: this.inputFloat.bind(this), change: this.checkFloat.bind(this) }),
                new sap.m.Label({ text: this.traduzChave("carteira.descricaoMovimentacao") }),
                new sap.m.Input({ maxLength: 50, id: "descricaoMovimento" })
                ];

                var functionOk = function (evt) {
                    var inputValor = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0];
                    var descricaoMovimento = evt.getSource().oParent.getContent().filter(x => x.sId == "descricaoMovimento")[0];
                    var valor = Math.abs(parseFloat(inputValor.getValue()));
                    this.retirarValorCarteira(valor, descricaoMovimento.getValue());
                }

                this.criaDialogPadrao("carteira.tituloDialogoRemoveFundos", "carteira.removerFundos", content, functionOk.bind(this));

            },

        });
    });