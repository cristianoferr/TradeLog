sap.ui.define([
    'tradelog/shared/DomainController',
    'DialogoCarteira',
    'DialogoPosicao',
    'ServicoCarteira'
], function (DomainController, dialogoCarteira, dialogoPosicao, servicoCarteira) {
    "use strict";

    let that;

    return DomainController.extend("tradelog.domain.posicao.consulta.ListaPosicoesFechadas", {

        viewData: { bindPath: '', posicaoSelected: false, idPosicaoSelected: false, idCarteira: undefined },

        onInit: function () {
            that = this;
            var oComponent = that.getOwnerComponent();
            that._router = oComponent.getRouter();
            that.getRouter().getRoute('carteira').attachMatched(that.onRouteMatched, this);
        },
        onRouteMatched: onRouteMatched,
        bindView: bindView

    });

    /** Método chamado cada vez que o usuário acessa a tela
     * @function onRouteMatched
     * @return {type} {description}
     */
    function onRouteMatched(evt) {
        that.viewData.idCarteira = evt.getParameter("arguments").carteira;
        var sEntityPath = `/Carteira(${evt.getParameter("arguments").carteira})`;
        that.bindView(sEntityPath);

    }

    /**
     *Método que 'binda' a view atual com o caminho da entidade
    * @param sEntityPath
    */
    function bindView(sEntityPath) {
        //that.getView().byId("tablePosicao").bindElement(sEntityPath);
        that.viewData.bindPath = sEntityPath;


        bindPosicaoFechadas(sEntityPath);
    }

    function bindPosicaoFechadas(sEntityPath) {
        var table = that.getView().byId("tablePosicaoFechada");
        if (!table) {
            return;
        }

        table.bindItems(sEntityPath + "/PosicaoFechada", table.getBindingInfo("items").template.clone());
    }


});