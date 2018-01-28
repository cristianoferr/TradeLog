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


                if (sap.ui.userData == undefined) {
                    var cookieData = Cookies.getJSON("loggedUser");
                    if (cookieData == undefined) {
                        sap.ui.userData = this.createAnonymousData();
                    } else {
                        sap.ui.userData = cookieData;
                    }
                    sap.ui.userModel = new JSONModel(sap.ui.userData);
                }
                this.firstInit();

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

                this.validateUser();
            },

            createAnonymousData: function () {
                return { LoggedUser: "Anonymous", UserImg: "content/images/user-placeholder.jpg", email: null, IdUsuario: null, isLogged: false, isAnonymous: true };
            },

            firstInit: function () {
                servicoAutenticacaoGoogle.handleClientLoad.call(this);
            },

            removeCredentials: function () {
                sap.ui.userData = this.createAnonymousData();
                sap.ui.userModel.setData(sap.ui.userData);
                sap.ui.userModel.refresh();
                Cookies.remove('loggedUser');
            },

            /*Chamado no retorno do serviço quando o usuário está autenticado */
            callbackUpdateCredentials: function (id_token, resp) {
                var name = resp.result.names[0].givenName;
                var email = resp.result.emailAddresses[0].value;
                sap.ui.userData.UserImg = resp.result.photos[0].url;
                sap.ui.userData.googleId = resp.result.resourceName;
                sap.ui.userData.id_token = id_token;
                sap.ui.userData.LoggedUser = name;
                sap.ui.userData.email = email;
                sap.ui.userData.isLogged = true;
                sap.ui.userData.isAnonymous = !sap.ui.userData.isLogged;
                this.salvaCookie();

                sap.ui.userModel.refresh();
                this.validateUser();

            },

            salvaCookie: function (IdUsuario) {
                if (IdUsuario) {
                    sap.ui.userData.IdUsuario = IdUsuario;
                }
                Cookies.set("loggedUser", sap.ui.userData);
            },

            //valida o usuário ante o backend
            validateUser: function () {
                if (!sap.ui.userData.isLogged) return;
                servicoUsuario.autenticaUsuarioLogado.call(this, this.salvaCookie, this.removeCredentials);
            },

            onMenuAction: function (evt) {
                var acao = evt.mParameters.item.data("acao");

                if (acao == "login") {
                    var content = sap.ui.xmlfragment("tradelog.domain.login.dialogs.SignUp", this);
                    this.dialog = this.criaDialogPadrao("login.tituloLogin", null, content);
                }
                if (acao == "logoff") {
                    servicoAutenticacaoGoogle.signOut();

                    this.removeCredentials();
                }
            },

            autenticaGoogle: function () {
                servicoAutenticacaoGoogle.signIn();
                this.dialog.close();
                this.dialog.destroy();
            }

        });
    });