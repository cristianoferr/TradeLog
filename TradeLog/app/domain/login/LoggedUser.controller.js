sap.ui.define([
    'tradelog/shared/DomainController',
    'sap/ui/model/json/JSONModel',
    'ServicoAutenticacaoGoogle',
    'ServicoUsuario'
], function (DomainController,
    JSONModel, servicoAutenticacaoGoogle, servicoUsuario) {
        "use strict";

        return DomainController.extend("tradelog.domain.login.LoggedUser", {
            viewData: { titulo: "" },
            //loginInfo>LoggedUser
            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();


                //contém dados do usuário logado
                this.getView().setModel(sap.ui.userModel, "loginInfo");
                var that = this;

                //usado para mostrar o titulo
                this.viewModel = new JSONModel(this.viewData);
                this.getView().setModel(this.viewModel, "viewData");

                this.getView().addEventDelegate({
                    onAfterShow: jQuery.proxy(function (evt) {
                        this.onAfterRendering.bind(that)(evt);
                    }, this)
                });

            },

            onAfterRendering: function (evt) {
                var titulo = evt.getSource().data().title;
                this.viewData.titulo = titulo;
                this.viewModel.refresh();

                // this.validateUser();
            },



            firstInit: function () {
                //atualizo o titulo da pagina
                var title = this.traduzChave("appTitle") + " - " + this.traduzChave("appDescription") + " - " + this.traduzChave("appVersion");
                document.title = title;

                // servicoAutenticacaoGoogle.handleClientLoad.call(this);
            },

            onMenuAction: function (evt) {
                var acao = evt.mParameters.item.data("acao");

                if (acao == "login") {
                    var content = sap.ui.xmlfragment("tradelog.domain.login.dialogs.SignUp", this);
                    this.dialog = this.criaDialogPadrao("login.tituloLogin", null, content);
                }
                if (acao == "logoff") {
                    servicoAutenticacaoGoogle.signOut();

                    servicoUsuario.removeCredentials();
                }
            },

            autenticaGoogle: function () {
                servicoAutenticacaoGoogle.signIn();
                this.dialog.close();
                this.dialog.destroy();
            }

        });
    });