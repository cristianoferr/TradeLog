(function () {

    ServicoCarteira =
        {
            depositaValorCarteira: depositaValorCarteira,
            criaPosicao: criaPosicao,
            retiraValorCarteira: retiraValorCarteira
        };

    return ServicoCarteira;

    /*Executa chamada ao backend que adiciona fundos à carteira */
    function depositaValorCarteira(valor, descricaoMovimento) {
        var parameters = {
            "IdCarteira": this.viewData.idCarteira,
            "valor": valor,
            "descricao": descricaoMovimento
        };
        var sServiceUrl = `Carteira/TradeLogServer.Controllers.DepositaFundos`;
        this.postData(sServiceUrl, parameters, sucessoTransferencia.bind(this), errorTransferencia.bind(this));
    }

    /*Executa chamada ao backend que remove fundos da carteira */
    function retiraValorCarteira(valor, descricaoMovimento) {
        var parameters = {
            "IdCarteira": this.viewData.idCarteira,
            "valor": valor,
            "descricao": descricaoMovimento
        };
        var sServiceUrl = `Carteira/TradeLogServer.Controllers.RetiraFundos`;
        this.postData(sServiceUrl, parameters, sucessoTransferencia.bind(this), errorTransferencia.bind(this));
    }


    /*Executa a chamada ao backend que cria a Posição (executa o Trade) a partir dos parâmetros indicados */
    function criaPosicao(data) {
        var parameters = {
            "IdPapel": parseInt(data.IdPapel),
            "tipoOperacao": data.tipoOperacao,
            "IdCarteira": data.IdCarteira,
            "PrecoAcao": parseFloat(data.PrecoAcao),
            "quantidade": parseInt(data.quantidade),
            "custoOperacao": parseFloat(data.custoOperacao),
            "PrecoStopOpcional": data.PrecoStopOpcional ? parseFloat(data.PrecoStopOpcional) : 0,
            "IsClosing": data.isClosing || false
        };

        var sServiceUrl = `Trade/TradeLogServer.Controllers.ExecutaTrade`;
        this.postData(sServiceUrl, parameters, sucessoTrade.bind(this), errorTrade.bind(this));
    }

    /*Callback quando há sucesso na transferencia de fundos à carteira */
    function sucessoTrade() {
        this.toast(this.traduzChave("trade.sucessoTrade"));
        this.getView().getModel().refresh();
    }

    /*Callback quando há erro na transferencia de fundos à carteira */
    function errorTrade() {
        this.toast(this.traduzChave("trade.erroTrade"));
    }

    /*Callback quando há sucesso na transferencia de fundos à carteira */
    function sucessoTransferencia() {
        this.toast(this.traduzChave("carteira.fundoTransferidoSucesso"));
        this.getView().getModel().refresh();
    }

    /*Callback quando há erro na transferencia de fundos à carteira */
    function errorTransferencia() {
        this.toast(this.traduzChave("carteira.fundoTransferidoErro"));
    }




})();