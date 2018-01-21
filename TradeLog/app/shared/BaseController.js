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

            /*
                     Função que realiza uma chamada para um serviço odata no caminho indicado usando o serviço atual como base
                      */
            postData: function (sServicePath, parameters, fSuccess, fError) {
                var jsonParameters = JSON.stringify(parameters);

                var createPost = new XMLHttpRequest();
                createPost.open("POST", this.getView().getModel().sServiceUrl + sServicePath, true);
                createPost.setRequestHeader("Accept", "application/json");
                createPost.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                createPost.onreadystatechange = function (evt) {
                    if (createPost.readyState == 4 && createPost.status == 200) {
                        fSuccess();
                    } else {
                        fError();
                    }
                };
                createPost.send(jsonParameters);
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



            /* Recria o evento onChange do input... o onchange não está funcionando corretamente por padrão */
            addOnChange: function (inputId) {
                var input = sap.ui.getCore().byId(inputId);
                this.addOnChangeToInput(input);
            },
            addOnChangeToInput: function (input) {
                input.onChange = function (e) {
                    if (!this.getEditable() || !this.getEnabled()) {
                        return
                    }
                    var v = this._getInputValue();
                    //if (v !== this._lastValue)
                    {
                        this.setValue(v);
                        v = this.getValue();
                        this._lastValue = v;
                        this.fireChangeEvent(v);
                        return true
                    }

                };
            },

            /*Limita o campo a apenas númerico. liveChange="inputNumeric" */
            inputNumeric: function (oEvent) {
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');

                _oInput.setValue(val);
            },

            /*Limita o campo a apenas númerico com '.'. liveChange="inputFloat" */
            inputFloat: function (oEvent) {
                var _oInput = oEvent.getSource();
                if (!_oInput.hasInitializedOnChange) {
                    _oInput.hasInitializedOnChange = true;
                    this.addOnChangeToInput(_oInput);
                }
                var val = _oInput.getValue();
                val = val.replace(/[^0-9\.]+/g, '');
                var contaPonto = val.split(".").length - 1;
                if (contaPonto > 1) val = val.replace(".", "");
                _oInput.setValue(val);
                console.log("inputFloat:" + val + " || " + _oInput.getValue());
            },
            checkFloat: function (oEvent) {
                this.inputFloat(oEvent);
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                if (val.endsWith(".")) val = val + "0";
                if (val.startsWith(".")) val = "0" + val;
                if (val == "") val = "0.0";
                _oInput.setValue(val);
                console.log("checkFloat:" + val + " || " + _oInput.getValue());
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

            toast: function (msg) {
                MessageToast.show(msg);
            },

            getValorInputDialog: function (content, idInput) {
                var inputValor = content.filter(x => x.sId == idInput)[0];
                if (inputValor.getSelectedKey) return inputValor.getSelectedKey();
                return inputValor.getValue();
            },


            criaDialogPadrao: function (titleKey, okTextKey, content, functionOk) {
                var dialog = new sap.m.Dialog({
                    title: this.traduzChave(titleKey),
                    type: 'Message',
                    content: content,
                    beginButton: new sap.m.Button({
                        text: this.traduzChave(okTextKey),
                        press: function (evt) {
                            functionOk(evt);
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

                dialog.setModel(this.getModel("i18n"), "i18n");
                // dialog.setModel(this.getModel());
                dialog.open();

                return dialog;
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