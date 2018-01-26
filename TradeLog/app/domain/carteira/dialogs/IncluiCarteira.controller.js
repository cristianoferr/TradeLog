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

            onShow: function () {
                //this.addOnChange("riscoPorPosicao");
                // this.addOnChange("riscoPorCarteira");
                // this.addOnChange("custoOperacao");
                // this.addOnChange("saldoInicial");
            },



            addRegistro: function () {
                var form = sap.ui.getCore().byId("formAddCarteira");
                var lista = this.getView().byId("listCarteira");
                var content = form.getContent();
                var oEntry = {
                    NomeCarteira: this.getFormValue("nomeCarteira", content),
                    RiscoPorPosicao: parseFloat(this.getFormValue("riscoPorPosicao", content)),
                    RiscoPorCarteira: parseFloat(this.getFormValue("riscoPorCarteira", content)),
                    CustoOperacaoPadrao: parseFloat(this.getFormValue("custoOperacao", content)),
                    ValorLiquido: parseFloat(this.getFormValue("saldoInicial", content)),
                    IdUsuario: 0,
                    IdCarteira: 0
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