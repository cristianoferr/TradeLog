sap.ui.define([
    'tradelog/shared/BaseDialog',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseDialog,
    Filter,
    FilterOperator) {
        "use strict";
        BaseDialog.extend("tradelog.domain.carteira.dialogs.IncluiCarteira", {

            getFormValue: function (fieldId, content) {
                for (var i = 0; i < content.length; i++) {
                    if (fieldId == content[i].sId) return content[i].getValue();
                }
                return undefined;
            },

            addRegistro: function () {
                var form = sap.ui.getCore().byId("formAddCarteira");
                var lista = this.getView().byId("listCarteira");
                var content = form.getContent();
                var oEntry = {
                    NomeCarteira: this.getFormValue("nomeCarteira", content),
                    RiscoPorPosicao: this.getFormValue("riscoPorPosicao", content),
                    RiscoPorCarteira: this.getFormValue("riscoPorCarteira", content),
                    CustoOperacaoPadrao: this.getFormValue("custoOperacao", content),
                    ValorAtual: this.getFormValue("saldoInicial", content)
                };

                var bind = lista.getBinding("items");
                bind.resetChanges();
                bind.refresh();

                var oContext = bind.create(oEntry);
                var that = this;

                /*oContext.created().then(function () {
                bind.attachEventOnce("change", function () {
                    bind.refresh();
                })*/

                oContext.created().then(function () {
                    bind.refresh();
                    lista.refreshItems();
                }, function (oError) {
                    alert("Create failed:" + oError);
                    bind.refresh();
                    lista.refreshItems();
                });
                that._oDialog.close();

                /* }, function (oError) {
                    that._oDialog.close();
                    alert("Create failed:" + oError);
                })*/


            }


        });
    });