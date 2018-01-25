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

        var functionAutenticaUsuario = function () {
            var sServiceUrl = 'Usuario/TradeLogServer.Controllers.VerificaUsuario';
            this.postData(sServiceUrl, parameters, fSucesso.bind(this), functionFail.bind(this));;
        }

        pegaSessionAtual.call(this, functionAutenticaUsuario.bind(this));
    }



    return ServicoUsuario;

    function pegaSessionAtual(funcaoOk) {
        var model = this.getView().getModel();
        var createPost = new XMLHttpRequest();
        createPost.open("GET", this.getView().getModel().sServiceUrl, true);
        createPost.setRequestHeader("Accept", "application/json");
        createPost.setRequestHeader("Content-Type", "text/plain");
        createPost.onreadystatechange = function (evt) {
            if (createPost.readyState == 4 && createPost.status == 200) {
                model.sServiceUrl = createPost.responseURL;
                funcaoOk();
            }
        };
        createPost.send();
    }


})();