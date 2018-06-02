jQuery.sap.require("tradelog.domain.posicao.dialogs.AdicionaPosicao");

sap.ui.define([
    'tradelog/shared/DomainController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (DomainController,
    Filter,
    FilterOperator) {
        "use strict";
        let that;

        return DomainController.extend("tradelog.domain.carteira.Carteira", {
            //objeto contendo dados que podem ser usados pela view (por exemplo: para saber qual a aba atual que o usuário clicou)
            viewData: { bindPath: '', carteiraAtual: undefined, abaDadosGerais: true },

            onInit: function () {
                that = this;
                that.getRouter().getRoute('carteira').attachMatched(that.onRouteMatched, that);
            },
            onRouteMatched: onRouteMatched,
            onTabBarSelected: onTabBarSelected,
            bindView: bindView,
            bindTableMovimento: bindTableMovimento,
            bindTableEvolucao: bindTableEvolucao,
            montaGraficoEvolucaoAsync: montaGraficoEvolucaoAsync,
            montaGraficoEvolucao: montaGraficoEvolucao,
            iniciaTimerGraficoComposicao: iniciaTimerGraficoComposicao,
            montaGraficoPizza: montaGraficoPizza,

        });

        /** Método chamado cada vez que o usuário acessa a tela
         * @function onRouteMatched
         * @return {type} {description}
         */
        function onRouteMatched(evt) {
            that.viewData.carteiraAtual = evt.getParameter("arguments").carteira;
            that.viewData.bindPath = `/Carteira(${that.viewData.carteiraAtual})`;
            that.bindView(that.viewData.bindPath);
            that.onTabBarSelected();
        }

        /**
        * método chamado quando o usuário clica em um ícone da tabBar
        */
        function onTabBarSelected(evt) {
            if (evt) {
                that.lastTabBar = evt.getParameters().selectedKey;
            }
            that.viewData.abaDadosGerais = that.lastTabBar === "DadosGerais";
            if (that.lastTabBar == "Evolucao") {
                that.montaGraficoEvolucaoAsync();
            }
        }


        /**
         *Método que 'binda' a view atual com o caminho da entidade
        * @param sEntityPath
        */
        function bindView(sEntityPath) {
            that.viewData.bindPath = sEntityPath;
            that.getView().byId("idIconTabBar").bindElement(sEntityPath);
            //that.getView().byId("idIconTabBar").getModel().attachEventOnce("requestCompleted", that.montaGraficoPizza.bind(this));

            var viewModel = new sap.ui.model.json.JSONModel(that.viewData, true);
            that.getView().setModel(viewModel, "viewModel");

            that.bindTableMovimento();

            that.iniciaTimerGraficoComposicao();

            that.bindTableEvolucao();

            criaCacheModel(sEntityPath);
        }

        function criaCacheModel(sEntityPath) {
            var cacheModel = new sap.ui.model.json.JSONModel({}, true);
            that.getView().setModel(cacheModel, "cacheModel");
        }

        function bindTableMovimento() {
            var list = that.getView().byId("tableMovimento");
            list.bindItems(that.viewData.bindPath + "/TradeLogServer.Controllers.Movimento", list.getBindingInfo("items").template.clone());
            var binding = list.getBinding("items");
            var sort = new sap.ui.model.Sorter("IdMovimento", true, false);
            if (binding == null) {
                return;
            }
            binding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
            binding.sort(sort);
        }


        function bindTableEvolucao() {
            var list = that.getView().byId("tableEvolucao");
            list.bindItems(that.viewData.bindPath + "/TradeLogServer.Controllers.Evolucao", list.getBindingInfo("items").template.clone());
        }

        function montaGraficoEvolucaoAsync() {
            var list = that.getView().byId("tableEvolucao");
            var count = 0;
            var fnVerificaCarga = function () {
                count++;
                if (list.getItems().length > 0 || count > 5) {
                    clearInterval(timer);
                    that.montaGraficoEvolucao();
                }
            };
            var timer = setInterval(fnVerificaCarga.bind(that), 1000);
        }

        function montaGraficoEvolucao() {
            var table = that.getView().byId("tableEvolucao");
            var panel = that.getView().byId("graficoEvolucao");


            var carteiraAtual = that.getView().byId("idIconTabBar").getBindingContext().getObject();
            var data = { items: [] };
            var items = table.getItems();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                data.items.push({ data: that.formatter.formataDataYYYYMMDD(item.data().Data), name: "Valor Posição", valor: item.data().ValorPosicao });
                data.items.push({ data: that.formatter.formataDataYYYYMMDD(item.data().Data), name: "Valor Líquido", valor: item.data().ValorLiquido });
                data.items.push({ data: that.formatter.formataDataYYYYMMDD(item.data().Data), name: "Valor Total", valor: item.data().ValorTotal });
            }

            var oDatasetPie = new openui5.simplecharts.SimpleChartData();
            oDatasetPie.bindDimensions({
                items: [{ name: "data", description: "Data", axis: "x" },
                { name: "name", description: "Dado", axis: "y" }]
            });
            oDatasetPie.bindMeasures({ items: [{ name: "valor", description: "Valor", rank: "1" }] });
            oDatasetPie.bindData(data);

            var grafico = new openui5.simplecharts.SimpleLineChart({ title: "Evolução da Carteira" });
            grafico.setDataSet(oDatasetPie);
            panel.removeAllContent();
            panel.addContent(grafico);
        }

        function iniciaTimerGraficoComposicao() {
            var fnVerificaCarga = function () {
                if (sap.ui.tablePosicao == undefined) return;

                var carteiraAtual = that.getView().byId("idIconTabBar").getBindingContext().getObject();
                if (carteiraAtual != undefined) {
                    //se a carteira não tem posicoes ou se tem posicoes e as mesmas já foram carregadas...
                    if ((carteiraAtual.ValorAtual == carteiraAtual.ValorLiquido) ||
                        (carteiraAtual.ValorAtual != carteiraAtual.ValorLiquido && sap.ui.tablePosicao.getItems().length > 0)) {
                        clearInterval(timer);
                        that.montaGraficoPizza();
                    }
                }
            };
            var timer = setInterval(fnVerificaCarga.bind(that), 1000);
        }

        /**Ver uma forma de recuperar os dados da carteira e posições adicionar aqui */
        function montaGraficoPizza() {
            var tablePosicao = sap.ui.tablePosicao;
            var panel = that.getView().byId("graficoPizzaCarteira");
            if (typeof openui5 == "undefined") return;


            var carteiraAtual = that.getView().byId("idIconTabBar").getBindingContext().getObject();
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