(function () {

    ServicoAutenticacaoGoogle =
        {
            handleClientLoad: handleClientLoad,
            signOut: signOut,
            signIn: signIn
        };



    function signOut() {
        if (!gapi) return;
        gapi.auth2.getAuthInstance().signOut();
    }

    function signIn() {
        if (!gapi) return;
        gapi.auth2.getAuthInstance().signIn();
    }


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

    function handleClientLoad() {
        // Load the API client and auth2 library
        gapi.load('client:auth2', initClient.bind(this));
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
        };

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
            makeApiCall.bind(this)();
        } else {
            this.removeCredentials();
        }
    }


    // Load the API and make an API call.  Display the results on the screen.
    function makeApiCall() {
        var that = this;
        var id_token = gapi.client.getToken().id_token;
        gapi.client.people.people.get({
            'resourceName': 'people/me',
            'requestMask.includeField': 'person.names,person.emailAddresses,person.photos'
        }).then(function (resp) {
            that.callbackUpdateCredentials(id_token, resp);
        });
    }

    return ServicoAutenticacaoGoogle;

})();