(function () {
    var context = false;
    ServicoUsuario =
        {
            autenticaUsuarioLogado: autenticaUsuarioLogado,
            callbackUpdateCredentials: callbackUpdateCredentials,
            removeCredentials: removeCredentials,
            setContext: setContext,
            context: context,
            checkSession: checkSession

        };

    function checkSession(servicoAutenticacao) {
        var cookieData = Cookies.getJSON("loggedUser");
        servicoAutenticacao.handleClientLoad.call(this);
        if (cookieData == undefined) {
            sap.ui.userData = createAnonymousData();
        } else {
            sap.ui.userData = cookieData;
        }

        if (sap.ui.userData.responseURL) {
            console.log("ResponseURL recuperado via cookie...");
            createModelSession(sap.ui.userData.responseURL);
            //verifica o usuario também seta o idusuario da sessão atual
            verificaUsuario.call(this);
        } else if (sap.ui.userData.email) {
            console.log("ResponseURL não encontrado no cookie... requisitando ao backend");
            autenticaUsuarioLogado.call(this);
        }
        sap.ui.userModel = new sap.ui.model.json.JSONModel(sap.ui.userData);

    }

    function setContext(_context) {
        ServicoUsuario.context = _context;
        context = _context;
    }

    function createAnonymousData() {
        return { LoggedUser: "Anonymous", UserImg: "content/images/user-placeholder.jpg", email: null, IdUsuario: null, isLogged: false, isAnonymous: true };
    }

    function createModelSession(responseURL) {
        var modelSession = new sap.ui.model.odata.v4.ODataModel({
            groupId: "$direct",
            synchronizationMode: "None",
            serviceUrl: responseURL
        });
        ServicoUsuario.context.setModel(modelSession);
        sap.ui.mainModel = modelSession;
    }

    /**
     * Autentica o usuario logado no backend do serviço, se estiver ok o modelo da sessão é criado
     */
    function autenticaUsuarioLogado() {

        var functionAutenticaUsuario = function (responseURL) {
            createModelSession(responseURL);
            sap.ui.userData.responseURL = responseURL;
            salvaCookie();

            verificaUsuario.call(this);
        }

        if (!sap.ui.mainModel) {
            pegaSessionAtual.call(this, functionAutenticaUsuario.bind(this));
        }
    }



    function verificaUsuario() {
        if (!sap.ui.userData.isLogged) return;

        var fSucesso = function (evt) {
            var jsonReturn = JSON.parse(evt.currentTarget.response);
            console.log("Usuario Autenticado!" + jsonReturn);
            var userData = JSON.parse(jsonReturn.value);
            salvaCookie(userData.IdUsuario);
            // this.navegaParaRota("home");
        };

        var parameters = {
            "email": sap.ui.userData.email,
            "googleId": sap.ui.userData.googleId,
            "name": sap.ui.userData.LoggedUser,
            "id_token": sap.ui.userData.id_token
        };

        var sServiceUrl = 'Usuario/TradeLogServer.Controllers.VerificaUsuario';
        this.postData(sServiceUrl, parameters, fSucesso.bind(this), erroAutenticandoUsuario.bind(this));
    }

    return ServicoUsuario;

    /*Chamado no retorno do serviço quando o usuário está autenticado */
    function callbackUpdateCredentials(id_token, resp) {
        var name = resp.result.names[0].givenName;
        var email = resp.result.emailAddresses[0].value;
        sap.ui.userData.UserImg = resp.result.photos[0].url;
        sap.ui.userData.googleId = resp.result.resourceName;
        sap.ui.userData.id_token = id_token;
        sap.ui.userData.LoggedUser = name;
        sap.ui.userData.email = email;
        sap.ui.userData.isLogged = true;
        sap.ui.userData.isAnonymous = !sap.ui.userData.isLogged;
        salvaCookie();

        sap.ui.userModel.refresh();


        autenticaUsuarioLogado.call(this);

    }


    function erroAutenticandoUsuario(evt) {
        sap.ui.userData.responseURL = undefined;
        console.error("Erro ao autenticar o usuário");
        console.log(evt);
        Cookies.set("loggedUser", sap.ui.userData);
        location.reload();

    }

    function removeCredentials() {
        console.log("Removendo credenciais do usuário");
        sap.ui.userData = createAnonymousData();
        sap.ui.userModel.setData(sap.ui.userData);
        sap.ui.userModel.refresh();
        Cookies.remove('loggedUser');
    }

    function salvaCookie(IdUsuario) {
        if (IdUsuario) {
            sap.ui.userData.IdUsuario = IdUsuario;
        }
        Cookies.set("loggedUser", sap.ui.userData);
    }

    function pegaSessionAtual(funcaoOk) {
        var createPost = new XMLHttpRequest();
        var that = this;
        createPost.open("GET", ServicoUsuario.context.getModel("mainService").sServiceUrl, true);
        createPost.setRequestHeader("Accept", "application/json");
        createPost.setRequestHeader("Content-Type", "text/plain");
        createPost.onreadystatechange = function (evt) {
            if (createPost.readyState == 4 && createPost.status == 200) {
                //model.sServiceUrl = createPost.responseURL;
                funcaoOk.call(that, createPost.responseURL);
            }
        };
        createPost.send();
    }


})();