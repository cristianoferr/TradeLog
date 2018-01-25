(function () {

    DialogoCarteira =
        {

            dialogAddFunds: dialogAddFunds,
            dialogRemoveFunds: dialogRemoveFunds
        };

    return DialogoCarteira;

    /*Abre um dialogo para remoção dos fundos da carteira */
    function dialogRemoveFunds(evt) {
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
        };
        this.criaDialogPadrao("carteira.tituloDialogoRemoveFundos", "carteira.removerFundos", content, functionOk.bind(this));

    }

    /*Abre um dialogo para adição de fundos à carteira */
    function dialogAddFunds(evt) {
        var content = [new sap.m.Label({ text: this.traduzChave("carteira.valorAMovimentar") }),
        new sap.m.Input({ maxLength: 20, id: "inputValor", liveChange: this.inputFloat.bind(this), change: this.checkFloat.bind(this) }),
        new sap.m.Label({ text: this.traduzChave("carteira.descricaoMovimentacao") }),
        new sap.m.Input({ maxLength: 50, id: "descricaoMovimento" })
        ];

        var functionOk = function (evt) {
            var inputValor = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0];
            var descricaoMovimento = evt.getSource().oParent.getContent().filter(x => x.sId == "descricaoMovimento")[0];
            var valor = Math.abs(parseFloat(inputValor.getValue()));
            this.callDepositaValorCarteira(valor, descricaoMovimento.getValue());
        }

        this.criaDialogPadrao("carteira.tituloDialogoAdicionaFundos", "carteira.depositaFundos", content, functionOk.bind(this));
    }





    function sucessoFechamento() {
        this.toast(this.traduzChave("posicao.posicaoFechadaSucesso"));
        this.getView().getModel().refresh();
    }

    function errorFechamento() {
        this.toast(this.traduzChave("posicao.posicaoFechadaErro"));
    }





})();