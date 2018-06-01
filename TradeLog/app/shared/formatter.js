sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
    "use strict";

    var mStatusState = {
        "A": "Success",
        "O": "Warning",
        "D": "Error"
    };

    var formatter = {

        stateValor: function (valor) {
            if (valor < 0) {
                return "Error";
            } else if (valor == 0) {
                return "None";
            } else {
                return "Success";
            }
        },

        stateValorMaior: function (valor1, valor2) {
            var valor = 0;
            if (valor1 < valor2) valor = -1;
            if (valor1 > valor2) valor = 1;
            if (valor < 0) {
                return "Error";
            } else if (valor == 0) {
                return "None";
            } else {
                return "Success";
            }
        },

        formataMultiplicacao: function (preco, qtd) {
            var total;
            total = parseFloat(preco) * parseFloat(qtd);
            return this.formatter.formataValor(total);
        },

        calculaTotalOperacao: function (preco, qtd, custo, tipo) {
            var total;
            if (tipo == "C") {
                total = parseFloat(preco) * parseFloat(qtd) + parseFloat(custo);
            }
            if (tipo == "V") {
                total = -parseFloat(preco) * parseFloat(qtd) - parseFloat(custo);
            }
            return total;
        },

        formataCalculaTotalOperacao: function (preco, qtd, custo, tipo) {
            var total = this.formatter.calculaTotalOperacao(preco, qtd, custo, tipo);
            return this.formatter.formataValor(total);
        },
        formataCalculaRiscoOperacao: function (precoStop, preco, qtd, custo, tipo) {
            var valorPreco = this.formatter.calculaTotalOperacao.bind(this)(preco, qtd, custo, tipo);
            var valorStop = this.formatter.calculaTotalOperacao.bind(this)(precoStop, qtd, custo, tipo == "C" ? "V" : "C");
            return this.formatter.formataValor(parseFloat(valorPreco) + parseFloat(valorStop));
        },
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
        formataValor: function (sValue) {
            var numberFormat = NumberFormat.getFloatInstance({
                maxFractionDigits: 2,
                minFractionDigits: 2,
                groupingEnabled: true,
                groupingSeparator: ",",
                decimalSeparator: "."
            });
            return numberFormat.format(sValue);
        },

        /**
        * Retorna uma data formatada no padrão "dd.MM.yyyy"
        */
        formataData: function (value) {
            if (value) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" });
                var oFormattedDate = oDateFormat.format(new Date(value), true);
                return oFormattedDate;
            } else {
                return value;
            }
        },
        formataDataYYYYMMDD: function (value) {
            if (value) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });
                var oFormattedDate = oDateFormat.format(new Date(value), true);
                return oFormattedDate;
            } else {
                return value;
            }
        },
        formataDataHora: function (value) {
            if (value) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy HH:mm" });
                var oFormattedDate = oDateFormat.format(new Date(value), true);
                return oFormattedDate;
            } else {
                return value;
            }
        },
        calcDifDays: function (value) {
            var date1 = new Date(value);
            var date2 = new Date();
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return diffDays;
        }


    };


    return formatter;

});


//desativando o auto formatador do openui5...
sap.ui.model.PropertyBinding.prototype._toExternalValue = function (oValue) {

    if (this.fnFormatter) {
        oValue = this.fnFormatter(oValue);
    }
    return oValue;
};
