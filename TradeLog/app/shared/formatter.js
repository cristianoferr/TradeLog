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
