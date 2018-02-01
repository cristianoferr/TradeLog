sap.ui.define(
    ['tradelog/shared/BaseController',
        'ServicoUsuario',
        'ServicoAutenticacaoGoogle'],
    function (Controller, servicoUsuario, servicoAutenticacaoGoogle) {
        "use strict";

        return Controller.extend("tradelog.layout.App", {
            onInit: function () {
                servicoUsuario.setContext(this.getOwnerComponent());
                servicoUsuario.checkSession.call(this, servicoAutenticacaoGoogle);

                var title = this.traduzChave("appTitle") + " - " + this.traduzChave("appDescription") + " - " + this.traduzChave("appVersion");
                document.title = title;


            },

            callbackUpdateCredentials: function (id_token, resp) {
                servicoUsuario.callbackUpdateCredentials.call(this, id_token, resp);
            }
        });

    });