(function() {
    "use strict";

    fluid.registerNamespace("fluid.test.helpers");

    fluid.test.helpers.toHex = function(colorCode) {
        if (colorCode.indexOf("(") > 0) {
            var vals = colorCode.replace(/rgb|\(|\)/g, "").split(/ *,* /g);

            if (vals.length === 3) {
                return "#" + fluid.test.helpers.dec2hex(vals[0]) + fluid.test.helpers.dec2hex(vals[1]) + fluid.test.helpers.dec2hex(vals[2]);
            } else {
                return colorCode;
            }
        }
        return colorCode.toUpperCase();
    };

    fluid.test.helpers.dec2hex = function(i) {
        return (parseInt(i, "") + 0x10000).toString(16).substr(-2).toUpperCase();
    };
})(fluid);
