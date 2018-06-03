jQuery.sap.require("tradelog.domain.posicao.dialogs.AdicionaPosicao");

sap.ui.define([
    'tradelog/shared/DomainController'
], function (DomainController) {
    "use strict";
    let that;

    return DomainController.extend("tradelog.domain.balanco.consulta.BalancoCarteira", {
        //objeto contendo dados que podem ser usados pela view (por exemplo: para saber qual a aba atual que o usuário clicou)
        viewData: { bindPath: '', carteiraAtual: undefined, abaDadosGerais: true },

        onInit: function () {
            that = this;
            var oComponent = this.getOwnerComponent();
            this._router = oComponent.getRouter();
            this.getRouter().getRoute('carteira').attachMatched(this.onRouteMatched, this);
        },
        onRouteMatched: onRouteMatched,
        formataAlvoRaw: formataAlvoRaw,
        formataAlvoAjustado: formataAlvoAjustado,
        formataValorAjustado: formataValorAjustado,
        atualizaBalanco: atualizaBalanco,
        removeBalanco: removeBalanco,
        adicionaBalanco: adicionaBalanco,
        somaTotalCalculado: somaTotalCalculado,
        somaTotalPosse: somaTotalPosse


    });
    /** Método chamado cada vez que o usuário acessa a tela
     * @function onRouteMatched
     * @return {type} {description}
     */
    function onRouteMatched(evt) {
        that.viewData.carteiraAtual = evt.getParameter("arguments").carteira;
        that.viewData.bindPath = `/Carteira(${that.viewData.carteiraAtual})`;
        bindTableBalanco();
    }

    function adicionaBalanco(evt) {
        var carteira = that.viewData.carteiraAtual;
        var papel = that.getModel("cacheModel").getProperty("/IdPapelNovo");
        var parameters = {
            "IdCarteira": carteira,
            "IdPapel": papel
        };
        var sServiceUrl = `Balanco/TradeLogServer.Controllers.AdicionaBalanco`;
        that.postData(sServiceUrl, parameters, atualizaBalanco, atualizaBalanco);

    }


    function removeBalanco(evt) {
        var carteira = evt.oSource.data().IdCarteira;
        var papel = evt.oSource.data().IdPapel;

        var parameters = {
            "IdCarteira": carteira,
            "IdPapel": papel
        };
        var sServiceUrl = `Balanco/TradeLogServer.Controllers.RemoveBalanco`;
        that.postData(sServiceUrl, parameters, atualizaBalanco, atualizaBalanco);

    }

    function bindTableBalanco() {
        var table = that.getView().byId("tableBalanco");
        //table.bindItems(`/Balanco(${that.viewData.carteiraAtual})`,
        var oFilters = [new sap.ui.model.Filter('IdCarteira', "EQ", that.viewData.carteiraAtual)];
        table.bindItems(`/Balanco`,
            //table.bindItems(that.viewData.bindPath + "/TradeLogServer.Controllers.Balanco",
            table.getBindingInfo("items").template.clone(), null);

        var binding = table.getBinding("items");
        if (binding) {
            binding.sOperationMode = sap.ui.model.odata.OperationMode.Server;
        }
        binding.filter(oFilters);

        table.attachUpdateFinished(function (evt) {
            var cacheModel = evt.oSource.getModel("cacheModel");
            var items = evt.oSource.getItems();
            var totalFroze = 0;
            var totalPeso = 0;
            var balancos = [];
            items.forEach((item) => {
                var dado = {
                    CodigoPapel: item.data().CodigoPapel,
                    BoolCongelado: item.data().BoolCongelado,
                    ValorPapel: item.data().ValorPapel,
                    QtdPosse: item.data().QtdPosse,
                    PesoPapel: item.data().PesoPapel,
                    ValorAtual: item.data().ValorAtual
                };
                if (dado.FlagCongelado !== 'T') {
                    totalPeso++;
                    totalFroze += dado.QtdPosse * dado.ValorPapel;
                }
                balancos.push(dado);

            });
            cacheModel.setProperty("/balancos", balancos);
            cacheModel.setProperty("/balancoPeso", totalPeso);
            cacheModel.setProperty("/balancoFroze", totalFroze);
            console.log("balancoPeso:" + totalPeso);
            //cacheModel.updateBindings();
            //  table.refreshItems();
        });
    }

    function atualizaBalanco() {
        var table = that.getView().byId("tableBalanco");
        //table.refreshItems();
        sap.table = table;
        var cacheModel = that.getModel("cacheModel");
        //cacheModel.updateBindings();
    }

    function formataAlvoRaw(pesoPapel, CodigoPapel, BoolCongelado, ValorCarteiraAtual, ValorPapel) {

        var dadoCache = buscaCache(CodigoPapel);
        var isFrozen = BoolCongelado;
        if (dadoCache) {

            if (isFrozen) {
                return dadoCache.QuantidadeLiquida;
            }
        }

        var cacheModel = that.getModel("cacheModel");
        var totalPeso = cacheModel.getProperty("/balancoPeso");
        if (totalPeso == undefined) {
            return 0;
        }
        var balancoFroze = cacheModel.getProperty("/balancoFroze");
        var totalPosicao = cacheModel.getProperty("/TotalPosicao");
        var liquido = getDadoCarteira("ValorLiquido");
        var capitalUnfroze = liquido + totalPosicao - balancoFroze;

        var percMax = pesoPapel / totalPeso;
        var alvo = capitalUnfroze * percMax / ValorPapel;


        return parseInt(alvo);


    }

    function getDadoCarteira(campo) {
        var hboxCarteira = that.getView().byId("hboxCarteira");
        var valor = hboxCarteira.getBindingContext().getProperty(campo);
        return valor;
    }

    function formataAlvoAjustado(pesoPapel, CodigoPapel, BoolCongelado, ValorCarteiraAtual, ValorPapel) {
        var alvoRaw = formataAlvoRaw(pesoPapel, CodigoPapel, BoolCongelado, ValorCarteiraAtual, ValorPapel);
        var alvoArr = parseInt(alvoRaw / 100) * 100;
        if (alvoArr <= 0) alvoArr = 100;

        var dadoCache = buscaCache(CodigoPapel);
        var loteFill = getDadoCarteira("LoteFill");
        //console.log("loteFill:" + loteFill);

        var alvoProx = alvoArr;
        if (alvoProx + 100 - alvoRaw < loteFill) {
            alvoProx += 100;
        }

        return alvoProx;
    }

    function formataValorAjustado(pesoPapel, CodigoPapel, BoolCongelado, ValorCarteiraAtual, ValorPapel) {
        var alvo = formataAlvoAjustado(pesoPapel, CodigoPapel, BoolCongelado, ValorCarteiraAtual, ValorPapel);

        return that.formatter.formataValor(alvo * ValorPapel);
    }

    /**
     * Soma o total de valores calculados
     * @param {*} totalPosicao
     * @param {*} balancoFroze
     */
    function somaTotalCalculado(totalPosicao, balancoFroze) {
        var cacheModel = that.getModel("cacheModel");
        var balancos = cacheModel.getProperty("/balancos");
        var soma = 0;
        if (balancos == undefined) {
            return 0;
        }
        balancos.forEach((item) => {
            soma += formataAlvoAjustado(item.PesoPapel, item.CodigoPapel, item.BoolCongelado, item.ValorAtual, item.ValorPapel) * item.ValorPapel;
        });
        return that.formatter.formataValor(soma);
    }

    function somaTotalPosse(totalPosicao, balancoFroze) {
        var cacheModel = that.getModel("cacheModel");
        var balancos = cacheModel.getProperty("/balancos");
        var soma = 0;
        if (balancos == undefined) {
            return 0;
        }
        balancos.forEach((item) => {
            soma += item.QtdPosse * item.ValorPapel;
        });
        return that.formatter.formataValor(soma);

    }

    function buscaCache(CodigoPapel) {
        var model = that.getModel("cacheModel");
        var listaPosicoes = model.getProperty("/posicoes");
        if (!listaPosicoes) {
            return;
        }
        var cache = listaPosicoes.filter(x => x.CodigoPapel == CodigoPapel);
        if (cache.length == 1) return cache[0];
        return null;
    }


});