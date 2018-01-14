sap.ui.define([
    'tradelog/shared/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (BaseController,
    Filter,
    FilterOperator) {
        "use strict";

        return BaseController.extend("tradelog.shared.PainelEditavel", {

            //id do Painel que será alterado entre os modos Display e Change
            nomePainel: '',
            //caminho da entidade base (raiz), exemplo: /Areas('1')
            entidade: '',
            //o model não é inicializado ainda quando o componente é chamado via routematched,paramEntidade vai pegar o campo que identifica o registro da rota atual
            paramEntidade: '',
            //aponta para o id da entidade atual
            idEntidade: '',
            //nome do domain onde o componente está sendo usado (usado para recuperar o caminho completo do fragmento)
            domainAtual: '',

            //aponta para os respectivos botoes de editar, salvar e cancelar
            buttonEdit: undefined,
            buttonSave: undefined,
            buttonCancel: undefined,
            //indica se o componente já foi inicializado (isso ocorre no routeMatched pois é preciso pegar os componentes da view)
            hasInitialized: false,

            onInit: function () {
                var oComponent = this.getOwnerComponent();
                this._router = oComponent.getRouter();
                this.getRouter().attachRouteMatched(this.onRouteMatched, this);
            },


            /** Método usado para inicializar as propriedades do painel que está sendo editado
    * @function onRouteMatched
    * @return {type} {description}
    */
            onRouteMatched: function (evt) {
                var parameters = evt.getParameters();
                //if (this.getView().data("idEntidade") == null) return;
                this.entidade = this.getView().data("entidade");
                this.paramEntidade = this.getView().data("paramEntidade");
                this.idEntidade = parameters.arguments[this.paramEntidade];

                this.domainAtual = this.getView().data("domainAtual");
                this.nomePainel = this.getView().data("nomePainel");
                this.showFormFragment("Display");

                if (this.hasInitialized) return;
                //pego os botoes da view principal (que não fazem parte da sub view)
                this.buttonEdit = this.getView().byId(this.nomePainel + "Edit");
                this.buttonSave = this.getView().byId(this.nomePainel + "Save");
                this.buttonCancel = this.getView().byId(this.nomePainel + "Cancel");

                this.buttonEdit.attachPress({ controller: this }, this.handleEditPress);
                this.buttonSave.attachPress({ controller: this }, this.handleSavePress);
                this.buttonCancel.attachPress({ controller: this }, this.handleCancelPress);

                this.hasInitialized = true;
            },

            /**
             * Usado para transitar entre estados: todo o conteudo do painel é removido e recebe o conteudo do fragmento informado
             */
            showFormFragment: function (sFragmentName) {
                var oPage = this.getView().byId(this.nomePainel);

                oPage.removeAllContent();
                oPage.insertContent(this.getFormFragment("tradelog.domain." + this.domainAtual + ".fragments." + this.nomePainel + sFragmentName), 0);
            },

            /**
             * Método chamado ao clicar no botão editar
             */
            handleEditPress: function (evt, context) {
                context.controller.toggleButtonsAndView(true);

            },

            /**
             * Método chamado ao clicar no botão cancelar
             */
            handleCancelPress: function (evt, context) {
                context.controller.toggleButtonsAndView(false);
                var oModel = context.controller.getView().getModel();
                //oModel.refresh(true);
                oModel.resetChanges();
            },

            /**
             * Método chamado ao clicar no botão salvar
             */
            handleSavePress(evt, context) {
                context.controller.toggleButtonsAndView(false);
                var oModel = context.controller.getView().getModel();
                //oModel.resetChanges();
                oModel.attachEventOnce("batchRequestCompleted", this.onBatchRequestCompleted);
                oModel.attachEventOnce("batchRequestFailed", this.onBatchRequestFailed);
                oModel.submitChanges();
                //TODO: mandar para o serviço os dados alterados

            },

            onBatchRequestCompleted(oData) {
                debugger;
            },
            onBatchRequestFailed(oData) {
                debugger;
            },

            toggleButtonsAndView(bEdit) {
                var oView = this.getView();

                // Show the appropriate action buttons
                /*oView.byId(this.nomePainel + "Edit").setVisible(!bEdit);
                oView.byId(this.nomePainel + "Save").setVisible(bEdit);
                oView.byId(this.nomePainel + "Cancel").setVisible(bEdit);*/
                this.buttonEdit.setVisible(!bEdit);
                this.buttonSave.setVisible(bEdit);
                this.buttonCancel.setVisible(bEdit);

                // Set the right form type
                this.showFormFragment(bEdit ? "Change" : "Display");
            }


        });
    });