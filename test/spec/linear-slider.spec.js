(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("sisiliano.tests.linearSlider");

    sisiliano.tests.linearSlider.verifyValue = function (linearSlider, message, expectedValue) {
        jqUnit.assertEquals(message + " : value", expectedValue, linearSlider.model.value);
        var formattedValue = linearSlider.model.formatValue ? linearSlider.model.formatValue(expectedValue) : expectedValue;
        jqUnit.assertEquals(message + " : label", linearSlider.locate("valueLabel").text(), formattedValue + "");
    };

    jqUnit.test("linearSlider: slider regression", function () {
        $(".test").empty();
        var linearSlider = sisiliano.linearSlider(".test");

        sisiliano.tests.verifySlider("linearSlider regression of slider features", linearSlider);
    });

    /////////////////////////////////////////////////////////
    /////           Verifying mouse events
    /////////////////////////////////////////////////////////
    //TODO
})(fluid, jqUnit);