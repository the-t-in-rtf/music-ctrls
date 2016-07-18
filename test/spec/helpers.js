(function() {
    "use strict";

    fluid.registerNamespace("sisiliano.tests.helpers");

    sisiliano.tests.helpers.toHex = function(colorCode) {
        if (colorCode.indexOf("(") > 0) {
            var vals = colorCode.replace(/rgb|\(|\)/g, "").split(/ *,* /g);

            if (vals.length === 3) {
                return "#" + sisiliano.tests.helpers.dec2hex(vals[0]) + sisiliano.tests.helpers.dec2hex(vals[1]) + sisiliano.tests.helpers.dec2hex(vals[2]);
            } else {
                return colorCode;
            }
        }
        return colorCode.toUpperCase();
    };

    sisiliano.tests.helpers.dec2hex = function(i) {
        return (parseInt(i, "") + 0x10000).toString(16).substr(-2).toUpperCase();
    };
    
    
    
    fluid.registerNamespace("sisiliano.tests.util.mouseEvents");

    sisiliano.tests.util.mouseEvents.moveMouseTo = function (element, x, y) {
        element.simulate("mousemove", {
            clientX : x,
            clientY: y
        });
    };

    sisiliano.tests.util.mouseEvents.moveMouseToOutside = function (x, y) {
        $(document).simulate("mousemove", {
            clientX : x,
            clientY: y
        });
    };

    sisiliano.tests.util.mouseEvents.mouseDown = function (element) {
        element.simulate("mousedown");
    };

    sisiliano.tests.util.mouseEvents.mouseUp = function (element) {
        element.simulate("mouseup");
    };
})(fluid);
