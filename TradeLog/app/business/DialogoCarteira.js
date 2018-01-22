(function () {

    DialogoCarteira =
        {

            dialogAddFunds: dialogAddFunds,
            dialogRemoveFunds: dialogRemoveFunds,
            atualizaValorEntradaDialogo: atualizaValorEntradaDialogo
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



    /*Evento chamado quando o usuário seleciona um papel na combo de papeis, o valor do precoAcao é atualizado com o valor do papel selecionado */
    function atualizaValorEntradaDialogo(evt) {
        var source = evt.getSource();
        var item = source.getSelectedItem();
        var data = item.getBindingContext().getObject();

        this.getModel("localModel").oData.PrecoAcao = this.formatter.formataValor(data.ValorAtual);
        this.getModel("localModel").oData.PrecoStopOpcional = this.formatter.formataValor(data.ValorAtual);
    }

    function sucessoFechamento() {
        this.toast(this.traduzChave("posicao.posicaoFechadaSucesso"));
        this.getView().getModel().refresh();
    }

    function errorFechamento() {
        this.toast(this.traduzChave("posicao.posicaoFechadaErro"));
    }





})();