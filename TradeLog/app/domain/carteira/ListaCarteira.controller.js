sap.ui.define([
    'tradelog/shared/DomainController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (DomainController,
    Filter,
    FilterOperator) {
        "use strict";

        return DomainController.extend("tradelog.domain.carteira.ListaCarteira", {

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
                this.getRouter().getRoute('carteiras').attachMatched(this.onRouteMatched, this);
                sap.ui.currentView = this;
            },

            onRouteMatched: function (evt) {
                var list = this.getView().byId("listCarteira");
                if (list.getBinding("items") == undefined) {
                    this.navegaParaRota("home");
                    return;
                }
                list.getBinding("items").refresh();
                this.initInformativo();
            },


            initInformativo: function () {
                var that=this;
                if (!sap.ui.Device.system.phone) {
                    this.getRouter().myNavToWithoutHash({
                        currentView: this.getView(),
                        targetViewName: "br.com.petrobras.mm.documentos.view.Informativo",
                        targetViewType: "XML",
                        transition: "show"
                    },
                        function (viewInfo) {
                            if (viewInfo) {
                                var contInfo = viewInfo.getController();
                                contInfo.carregaAcoes(that.modeloServicos);
                            }
                        });
                }
            },

            onSelectCarteira: function (evt) {
                var id = evt.getParameters().listItem.data("idRegistro");
                this.navegaParaRota("carteira", { carteira: id });
            },

            onAdicionaCarteira: function (evt) {
                if (this._incluiDialog) {
                    this._incluiDialog.destroy();
                }
                this._incluiDialogController = sap.ui.controller("tradelog.domain.carteira.dialogs.IncluiCarteira");
                this._incluiDialogController.onInit(this);
                this._incluiDialog = sap.ui.xmlfragment("tradelog.domain.carteira.dialogs.IncluiCarteira", this._incluiDialogController);
                this._incluiDialogController.setDialog(this._incluiDialog);
                this._incluiDialog.open();
                this._incluiDialogController.onShow();
            },

            /**
            * O que acontece quando o usuário clica em voltar? Descubra abaixo.
            */
            onNavBack: function () {
                this.navegaParaRota("home");
            }


        });
    });