sap.ui.define([
    'tradelog/shared/DomainController',
    'sap/ui/model/json/JSONModel',
], function (DomainController,
    JSONModel) {
        "use strict";


        // Enter an API key from the Google API Console:
        //   https://console.developers.google.com/apis/credentials
        var apiKey = 'AIzaSyAGWLLQi7okPi2zkLqFY9AEOVl6OfHrQ3k';

        // Enter the API Discovery Docs that describes the APIs you want to
        // access. In this example, we are accessing the People API, so we load
        // Discovery Doc found here: https://developers.google.com/people/api/rest/
        var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];

        // Enter a client ID for a web application from the Google API Console:
        //   https://console.developers.google.com/apis/credentials?project=_
        // In your API Console project, add a JavaScript origin that corresponds
        //   to the domain where you will be running the script.
        var clientId = '1014924510372-rcef9ja5r618oce94a502jonauhkank4.apps.googleusercontent.com';

        // Enter one or more authorization scopes. Refer to the documentation for
        // the API or https://developers.google.com/people/v1/how-tos/authorizing
        // for details.
        var scopes = 'profile';

        function handleClientLoad(context) {
            // Load the API client and auth2 library
            gapi.load('client:auth2', initClient.bind(context));
        }

        function initClient() {
            var that = this;
            var authOk = function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus.bind(that));

                // Handle the initial sign-in state.
                updateSigninStatus.bind(that)(gapi.auth2.getAuthInstance().isSignedIn.get());

                // authorizeButton.onclick = handleAuthClick;
                // signoutButton.onclick = handleSignoutClick
            }

            gapi.client.init({
                apiKey: apiKey,
                discoveryDocs: discoveryDocs,
                clientId: clientId,
                scope: scopes
            }).then(authOk.bind(this));
        }

        function updateSigninStatus(isSignedIn) {
            sap.ui.userData.isLogged = isSignedIn;
            sap.ui.userData.isAnonymous = !sap.ui.userData.isLogged;

            if (isSignedIn) {
                makeApiCall();
            } else {
                this.removeCredentials();
            }
        }



        // Load the API and make an API call.  Display the results on the screen.
        function makeApiCall() {
            gapi.client.people.people.get({
                'resourceName': 'people/me',
                'requestMask.includeField': 'person.names,person.emailAddresses,person.photos'
            }).then(function (resp) {
                var name = resp.result.names[0].givenName;
                var email = resp.result.emailAddresses[0].value;
                sap.ui.userData.UserImg = resp.result.photos[0].url;
                sap.ui.userData.googleId = resp.result.resourceName;
                sap.ui.userData.LoggedUser = name;
                sap.ui.userData.email = email;
                sap.ui.userData.isLogged = true;
                sap.ui.userData.isAnonymous = !sap.ui.userData.isLogged;
                sap.ui.userModel.refresh();

            });
        }

        //TODO: continuar setando o cookie: grava $.cookie("abc","1234"), lê: $.cookie("abc")

        return DomainController.extend("tradelog.domain.login.LoggedUser", {
            //loginInfo>LoggedUser
            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();

                if (sap.ui.userData == undefined) {
                    sap.ui.userData = this.createAnonymousData();
                    sap.ui.userModel = new JSONModel(sap.ui.userData);
                    this.firstInit();
                }

                this.getView().setModel(sap.ui.userModel, "loginInfo");

            },

            createAnonymousData: function () {
                return { LoggedUser: "Anonymous", UserImg: "content/images/user-placeholder.jpg", email: null, IdUsuario: null, isLogged: false, isAnonymous: true };
            },

            firstInit: function () {
                handleClientLoad(this);
            },

            removeCredentials: function () {
                sap.ui.userData = this.createAnonymousData();
                sap.ui.userModel.setData(sap.ui.userData);
                sap.ui.userModel.refresh();
            },

            onMenuAction: function (evt) {
                var acao = evt.mParameters.item.data("acao");

                if (acao == "login") {
                    var content = sap.ui.xmlfragment("tradelog.domain.login.dialogs.SignUp", this);
                    this.dialog = this.criaDialogPadrao("login.tituloLogin", null, content);
                }
                if (acao == "logoff") {
                    gapi.auth2.getAuthInstance().signOut();
                    this.removeCredentials();
                }
            },

            autenticaGoogle: function () {
                gapi.auth2.getAuthInstance().signIn();
                this.dialog.close();
                this.dialog.destroy();
            }

        });
    });