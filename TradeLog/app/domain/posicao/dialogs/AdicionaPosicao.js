jQuery.sap.require("tradelog.shared.DomainController");

sap.ui.define([
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'DialogoPosicao',
    'ServicoCarteira'
], function (
    Filter,
    FilterOperator, dialogoPosicao, servicoCarteira) {
        "use strict";

        return tradelog.shared.DomainController.extend("tradelog.domain.posicao.dialogs.AdicionaPosicao", {


            quantidadeChange: function (evt) {
                this.inputNumeric(evt);
                this.atualizaValores(evt, false);
            },
            floatChange: function (evt) {
                this.inputFloat(evt);
                this.atualizaValores(evt, true);
            },

            atualizaValores: function (evt, changeQtd) {
                //nesses casos é porque o usuário está fazendo uma operação no sentido oposto (desfazendo da posição), se está comprado então está vendendo e vice versa
                if (!this.dataPosicao.CanChangeQuantidade || !this.dataPosicao.StopVisible) {
                    changeQtd = false;
                }


                var gapStop = this.dataPosicao.PrecoAcao - this.dataPosicao.PrecoStopOpcional;

                //situação normal de adição à posição
                if (this.dataPosicao.StopVisible) {
                    var qtdMaximaCapital = parseInt((this.dataPosicao.liquidoCarteira - this.dataPosicao.custoOperacao) / this.dataPosicao.PrecoAcao);
                    if (this.dataPosicao.quantidade > qtdMaximaCapital || changeQtd) {
                        this.dataPosicao.quantidade = qtdMaximaCapital;
                    }
                } else {
                    //se desfazendo da posição, se isClosing=false então eu permito vender mais que a posição total
                    if (this.dataPosicao.quantidade > this.dataPosicao.quantidadeExistentePapel && this.dataPosicao.isClosing) {
                        this.dataPosicao.quantidade = this.dataPosicao.quantidadeExistentePapel;
                    }
                }

                if (gapStop == 0) return;
                var qtdMaximaTrade = this.dataPosicao.carteiraAtual.PerdaMaximaTrade / gapStop;
                var qtdMaximaRiscoCarteira = this.dataPosicao.carteiraAtual.SaldoRiscoCarteira / gapStop;
                if (qtdMaximaRiscoCarteira < 0) qtdMaximaRiscoCarteira = 0;
                if (qtdMaximaTrade < 0) qtdMaximaTrade = 0;
                this.dataPosicao.quantidadeRecomendada = parseInt(qtdMaximaTrade < qtdMaximaRiscoCarteira ? qtdMaximaTrade : qtdMaximaRiscoCarteira);

                if (changeQtd) {
                    this.dataPosicao.quantidade = this.dataPosicao.quantidadeRecomendada;
                }

                var riscoTrade = gapStop * this.dataPosicao.quantidade;
                this.dataPosicao.riscoCarteira = -(this.dataPosicao.carteiraAtual.RiscoAtual + riscoTrade);
                this.dataPosicao.saldoRisco = this.dataPosicao.carteiraAtual.SaldoRiscoCarteira - riscoTrade;

                if (this.dataPosicao.quantidade > qtdMaximaCapital && changeQtd) {
                    this.dataPosicao.quantidade = qtdMaximaCapital;
                }
            },
            setDataInUse: function (dataPosicao) {
                this.dataPosicao = dataPosicao;
            },
            atualizaValorEntradaDialogo: atualizaValorEntradaDialogo
        });


        /*Evento chamado quando o usuário seleciona um papel na combo de papeis, o valor do precoAcao é atualizado com o valor do papel selecionado */
        function atualizaValorEntradaDialogo(evt) {
            var source = evt.getSource();
            var item = source.getSelectedItem();
            var data = item.getBindingContext().getObject();

            this.getModel("localModel").oData.PrecoAcao = this.formatter.formataValor(data.ValorAtual);
            if (this.dataPosicao.StopVisible) {
                this.getModel("localModel").oData.PrecoStopOpcional = this.formatter.formataValor(data.ValorAtual);
            }
        }
    });