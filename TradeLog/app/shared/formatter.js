sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
    "use strict";

    var mStatusState = {
        "A": "Success",
        "O": "Warning",
        "D": "Error"
    };

    var formatter = {
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
        formataValor: function (sValue) {
            //formataValor com problema: 1000 vira '1.000'...
            //return sValue;
            //debugger;
            //TODO: isso não pode ir para produção assim
            //if (sValue == undefined) return undefined;
            if (typeof sValue == "string") {
                sValue = sValue.replace(".", "");
                sValue = sValue.replace(",", ".");
            }
            var numberFormat = NumberFormat.getFloatInstance({
                maxFractionDigits: 2,
                minFractionDigits: 2,
                groupingEnabled: true,
                groupingSeparator: ".",
                decimalSeparator: ","
            });
            return numberFormat.format(sValue);
        },

        /**
        * Retorna uma data formatada no padrão "dd.MM.yyyy"
        */
        formataData: function (value) {
            debugger;
            if (value) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" });
                var oFormattedDate = oDateFormat.format(new Date(value), true);
                return oFormattedDate;
            } else {
                return value;
            }
        },
        calcDifDays: function (value) {
            return value;
        }


    };

    return formatter;
});
