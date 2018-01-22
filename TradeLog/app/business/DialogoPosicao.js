(function () {


    DialogoPosicao =
        {
            dialogClosePosition: dialogClosePosition,
            dialogCreatePosition: dialogCreatePosition,
            dialogSellPosition: dialogSellPosition,
            dialogBuyPosition: dialogBuyPosition

        };
    return DialogoPosicao;

    /*  var parameters = { tipo: "V", IdPapel: data.IdPapel, PrecoAtual: data.PrecoAtual, QuantidadeLiquida: data.QuantidadeLiquida };
                  dialogoPosicao.dialogSellPosition.call(this, evt, parameters);
  */
    function dialogSellPosition(evt, parameters,servicoCarteira) {
        dialogCreatePosition.bind(this)(evt, parameters,servicoCarteira);
    }
    function dialogBuyPosition(evt, parameters,servicoCarteira) {
        dialogCreatePosition.bind(this)(evt, parameters,servicoCarteira);
    }

    function dialogCreatePosition(evt, parameters,servicoCarteira) {
        if (parameters == undefined) parameters = {};
        //AdicionaPosicao
        var content = sap.ui.xmlfragment("tradelog.domain.carteira.fragments.AdicionaPosicao", this);
        content.setModel(this.getModel());
        content.setModel(this.getModel("dominio"), "dominio");

        var carteiraAtual = this.getView().getBindingContext().getObject();

        var dataPosicao = {
            IdPapel: parameters.IdPapel,
            CanChangePapel: parameters.IdPapel == undefined ? true : false,
            CanChangeTipo: parameters.tipo == undefined ? true : false,
            tipoOperacao: parameters.tipo == undefined ? 'C' : parameters.tipo,
            IdCarteira: parameters.IdCarteira,
            quantidade: 100,
            PrecoAcao: parameters.PrecoAtual ? parameters.PrecoAtual : 0,
            custoOperacao: this.formatter.formataValor(parameters.custoOperacao),
            PrecoStopOpcional: parameters.PrecoStopAtual ? parameters.PrecoStopAtual : parameters.PrecoAtual,
            totalTrade: 0,
            quantidadeExistentePapel: parameters.QuantidadeLiquida ? parameters.QuantidadeLiquida : 0,
            liquidoCarteira: parameters.ValorLiquidoCarteira,
        };
        var modelPosicao = new sap.ui.model.json.JSONModel(dataPosicao);
        this.getView().setModel(modelPosicao, "localModel");
        content.setModel(modelPosicao, "localModel");

        var functionOk = function (evt) {
            var data = this.getModel("localModel").oData;

            servicoCarteira.criaPosicao.call(this, data);
        }

        this.criaDialogPadrao("carteira.adicionaPosicao", "carteira.executaTrade", content, functionOk.bind(this));
    }

    /*
    Abre um dialogo na tela para que o usuário possa fechar a posição atual
     */
    function dialogClosePosition(evt) {
        var that = this;
        var precoAtual = sap.ui.getCore().byId("txtPrecoAtual").getText();
        var quantidadeAtual = sap.ui.getCore().byId("txtQuantidadeAtual").getText();
        var precoTotal = parseFloat(precoAtual) * quantidadeAtual;

        var functionAtualizaValor = function (evt) {
            this.inputFloat(evt);
            this.checkFloat(evt);
            var precoAtual = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValor")[0].getValue();
            var quantidadeAtual = evt.getSource().oParent.getContent().filter(x => x.sId == "quantidadeAtual")[0].getValue();
            var precoTotal = parseFloat(precoAtual) * quantidadeAtual;
            var inputValorTotal = evt.getSource().oParent.getContent().filter(x => x.sId == "inputValorTotal")[0];
            inputValorTotal.setValue(this.formatter.formataValor(precoTotal));
        }

        var content = [
            new sap.m.Label({ text: this.traduzChave("posicao.valorAcaoFechamento") }),
            new sap.m.Input({ maxLength: 20, id: "inputValor", value: precoAtual, liveChange: functionAtualizaValor.bind(this), change: functionAtualizaValor.bind(this) }),
            new sap.m.Label({ text: this.traduzChave("posicao.quantidade") }),
            new sap.m.Input({ maxLength: 20, id: "quantidadeAtual", value: quantidadeAtual, liveChange: functionAtualizaValor.bind(this), change: functionAtualizaValor.bind(this) }),
            new sap.m.Label({ text: this.traduzChave("posicao.valorTotal") }),
            new sap.m.Input({ maxLength: 20, id: "inputValorTotal", value: this.formatter.formataValor(precoTotal), editable: false })
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
                    var quantidadeAtual = evt.getSource().oParent.getContent().filter(x => x.sId == "quantidadeAtual")[0];
                    var valor = Math.abs(parseFloat(inputValor.getValue()));
                    that.fechaPosicao(valor, parseInt(quantidadeAtual.getValue()));
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
    }




})();