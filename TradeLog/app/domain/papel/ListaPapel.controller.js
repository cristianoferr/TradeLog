sap.ui.define([
    'tradelog/shared/DomainController',
    'tradelog/shared/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'ServicoCarteira'
], function (DomainController,
    formatter,
    Filter,
    FilterOperator, servicoCarteira) {
        "use strict";

        return DomainController.extend("tradelog.domain.papel.ListaPapel", {
            formatter: formatter,

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
            },
            onDialogAddPapel: function () {
                var oCtrl = sap.ui.controller("tradelog.domain.papel.dialogs.AdicionaPapel");
                var content = sap.ui.xmlfragment("tradelog.domain.papel.dialogs.AdicionaPapel", oCtrl);
                content.setModel(this.getModel("i18n"), "i18n");
                oCtrl.connectToView(content);
                content.setModel(this.getModel());
                content.setModel(this.getModel("dominio"), "dominio");
                
                var dataPosicao = {
                    LotePadrao: 100
                }

                var modelPosicao = new sap.ui.model.json.JSONModel(dataPosicao);
                this.getView().setModel(modelPosicao, "localModel");
                content.setModel(modelPosicao, "localModel");

                var functionOk = function (evt) {
                    var data = this.getModel("localModel").oData;

                    servicoCarteira.cadastraPapel.call(this, data);
                }

                this.criaDialogPadrao("papel.tituloAddPapel", "papel.addPapel", content, functionOk.bind(this));

            }

        });
    });