jQuery.sap.require("tradelog.domain.posicao.dialogs.AdicionaPosicao");

sap.ui.define([
    'tradelog/shared/DomainController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (DomainController,
    Filter,
    FilterOperator) {
        "use strict";

        return DomainController.extend("tradelog.domain.carteira.Carteira", {
            //objeto contendo dados que podem ser usados pela view (por exemplo: para saber qual a aba atual que o usuário clicou)
            viewData: { bindPath: '', carteiraAtual: undefined, abaDadosGerais: true },

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
                this.viewData.carteiraAtual = evt.getParameter("arguments").carteira;
                this.viewData.bindPath = `/Carteira(${this.viewData.carteiraAtual})`;
                this.bindView(this.viewData.bindPath);
            },

            /**
            * método chamado quando o usuário clica em um ícone da tabBar
            */
            onTabBarSelected: function (evt) {
                this.viewData.abaDadosGerais = evt.getParameters().selectedKey === "DadosGerais";
            },


            /**
             *Método que 'binda' a view atual com o caminho da entidade
            * @param sEntityPath
            */
            bindView: function (sEntityPath) {
                this.viewData.bindPath = sEntityPath;
                this.getView().byId("idIconTabBar").bindElement(sEntityPath);
                //this.getView().byId("idIconTabBar").getModel().attachEventOnce("requestCompleted", this.montaGraficoPizza.bind(this));

                var viewModel = new sap.ui.model.json.JSONModel(this.viewData, true);
                this.getView().setModel(viewModel, "viewModel");

                this.bindTableMovimento();

                this.iniciaTimerGrafico();
            },

            bindTableMovimento: function () {
                var list = this.getView().byId("tableMovimento");
                list.bindItems(this.viewData.bindPath + "/TradeLogServer.Controllers.Movimento", list.getBindingInfo("items").template.clone());
                var binding = list.getBinding("items");
                var sort = new sap.ui.model.Sorter("IdMovimento", true, false);
                if (binding == null) {
                    debugger;
                    return;
                }
                binding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
                binding.sort(sort);
            },

            iniciaTimerGrafico: function () {
                var fnVerificaCarga = function () {
                    if (sap.ui.tablePosicao == undefined) return;

                    var carteiraAtual = this.getView().byId("idIconTabBar").getBindingContext().getObject();
                    if (carteiraAtual != undefined) {
                        //se a carteira não tem posicoes ou se tem posicoes e as mesmas já foram carregadas...
                        if ((carteiraAtual.ValorAtual == carteiraAtual.ValorLiquido) ||
                            (carteiraAtual.ValorAtual != carteiraAtual.ValorLiquido && sap.ui.tablePosicao.getItems().length > 0)) {
                            clearInterval(timer);
                            this.montaGraficoPizza();
                        }
                    }
                };
                var timer = setInterval(fnVerificaCarga.bind(this), 1000);
            },

            /**Ver uma forma de recuperar os dados da carteira e posições adicionar aqui */
            montaGraficoPizza: function () {
                var tablePosicao = sap.ui.tablePosicao;
                var panel = this.getView().byId("graficoPizzaCarteira");
                if (typeof openui5 == "undefined") return;


                var carteiraAtual = this.getView().byId("idIconTabBar").getBindingContext().getObject();
                var data = { items: [] };
                data.items.push({ nome: "Líquido", valor: carteiraAtual.ValorLiquido });
                var items = tablePosicao.getItems();
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    data.items.push({ nome: item.data().CodigoPapel, valor: item.data().ValorPosicaoAtual });
                }

                var oDatasetPie = new openui5.simplecharts.SimpleChartData();
                oDatasetPie.bindDimensions({ items: [{ name: "nome", description: "Alocado", axis: "x" }] });
                oDatasetPie.bindMeasures({ items: [{ name: "valor", description: "Valor", rank: "1" }] });
                oDatasetPie.bindData(data);

                var grafico = new openui5.simplecharts.SimplePieChart({ title: "Composição da Carteira" });
                grafico.setDataSet(oDatasetPie);
                panel.removeAllContent();
                panel.addContent(grafico);
            }


        });
    });