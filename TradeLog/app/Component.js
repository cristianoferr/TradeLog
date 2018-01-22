sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    'tradelog/shared/LocalStorageModel',
    'jquery.sap.global',
    'tradelog/shared/models'
], function (UIComponent, JSONModel, LocalStorageModel, $, models) {

    "use strict";


    /**
       * Carrega módulos externos ao OPENI5 para serem utilizados na aplicação. Vai ser executada logo após sua definição.
       */
    (function carregarModulos() {
        jQuery.sap.registerModulePath('DialogoCarteira', 'business/DialogoCarteira');
        jQuery.sap.registerModulePath('DialogoPosicao', 'business/DialogoPosicao');
        jQuery.sap.registerModulePath('ServicoCarteira', 'business/ServicoCarteira');
    })();

    return UIComponent.extend("tradelog.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // call overwritten init (calls createContent)
            sap.ui.getCore().getConfiguration().setLanguage("en-US");
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().attachTitleChanged(function (oEvent) {
                var sTitle = oEvent.getParameter("title");
                $(document).ready(function () {
                    document.title = sTitle;
                });
            });

            /*//create and set cart model
            var oCartModel = new LocalStorageModel("SHOPPING_CART", {
                cartEntries: {},
                savedForLaterEntries: {}
            });

            this.setModel(oCartModel, "cartProducts");*/

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            this.getRouter().initialize();
        },

        myNavBack: function () {
            var oHistory = sap.ui.core.routing.History.getInstance();
            var oPrevHash = oHistory.getPreviousHash();
            if (oPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("home", {}, true);
            }
        },

        createContent: function () {
            // create root view
            return sap.ui.view("AppView", {
                viewName: "tradelog.layout.App",
                type: "XML"
            });
        }
    });
});
