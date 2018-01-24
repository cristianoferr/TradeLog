(function () {

    ServicoUsuario =
        {
            autenticaUsuarioLogado: autenticaUsuarioLogado

        };

    function autenticaUsuarioLogado(functionSuccess, functionFail) {
        var parameters = {
            "email": sap.ui.userData.email,
            "googleId": sap.ui.userData.googleId,
            "name": sap.ui.userData.LoggedUser
        };
        var fSucesso = function (evt) {
            var jsonReturn = JSON.parse(evt.currentTarget.response);
            var userData = JSON.parse(jsonReturn.value);
            functionSuccess(userData.IdUsuario);
        }
        var sServiceUrl = 'Usuario/TradeLogServer.Controllers.VerificaUsuario';
        this.postData(sServiceUrl, parameters, fSucesso.bind(this), functionFail.bind(this));
    }



    return ServicoUsuario;


})();