
sap.ui.define([], function() {
    "use strict";
    return {
        formatDate: function(sDate) {
            if (!sDate) {
                return "";
            }
            var timestamp = parseInt(sDate.replace(/\/Date\((\d+)\)\//, '$1'));
            var date = new Date(timestamp);
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "dd/MM/yyyy"});
            return oDateFormat.format(date);
        }
    };
});
