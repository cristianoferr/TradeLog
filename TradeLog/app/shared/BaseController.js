sap.ui.define(
    ["sap/ui/core/mvc/Controller",
        'tradelog/shared/formatter',
        "sap/m/MessageToast"],
    function (Controller, formatter, MessageToast) {
        "use strict";

        return Controller.extend("tradelog.controller.BaseController", {

            formatter: formatter,
            //usado para carregar dinamicamente fragments xml para a memoria
            formFragments: [],

            /**
             * Navega para a rota
             * @param rota
             * @param params
             */
            navegaParaRota: function (rota, params) {
                this.getRouter().navTo(rota, params, true);
            },

            /**
             * Método de navegação para rotas genérico a partir da view, para usar basta adicionar o parametro rota, exemplo: app:rota='suaRota' press="onNavTo"
             * @param evt
             */
            onNavTo: function (evt) {
                var rota = evt.oSource.data("rota");
                this.navegaParaRota(rota);
            },

            /**
            * Traduz a chave informada pelo usuário
            * @param chave
            */
            traduzChave: function (chave) {
                if (chave === false) return this.traduzChave("nao");
                if (chave === true) return this.traduzChave("sim");
                if (chave == "" || chave == null) return "";
                return this.getView().getModel("i18n").getProperty(chave);
            },

            /**
             * Convenience method for accessing the router.
             * @public
             * @returns {sap.ui.core.routing.Router} the router for this component
             */
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },

            /**
             * Convenience method for getting the view model by name.
             * @public
             * @param {string} [sName] the model name
             * @returns {sap.ui.model.Model} the model instance
             */
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            /**
             * Convenience method for setting the view model.
             * @public
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName the model name
             * @returns {sap.ui.mvc.View} the view instance
             */
            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            /**
             * Getter for the resource bundle.
             * @public
             * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
             */
            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            /**
             * Handler for the Avatar button press event
             * @public
             */
            onAvatarButtonPress: function () {
                var msg = this.getResourceBundle().getText("avatarButtonMessageToastText");
                MessageToast.show(msg);
            },

            onNavButtonPress: function () {
                this.getOwnerComponent().myNavBack();
            },

            onNavBack: function () {
                this.getOwnerComponent().myNavBack();
            },

            /**
         * retorna o fragmento XML indicado pelo parametro path, ao recuperar um novo ele guarda na array para facil reuso
         */
            getFormFragment: function (path) {
                var oFormFragment = this.formFragments[path];
                if (oFormFragment) {
                    return oFormFragment;
                }
                oFormFragment = sap.ui.xmlfragment(path, this);
                return this.formFragments[path] = oFormFragment;
            }


        });
    });