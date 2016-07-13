(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("sisiliano.tests.knob");

    sisiliano.tests.knob.getElementNode = function (knob) {
        return d3.select(knob.container.selector).node();
    };

    sisiliano.tests.knob.verifyValue = function (knob, message, expectedValue) {
        jqUnit.assertEquals(message + " : value", expectedValue, knob.model.value);
        var formattedValue = knob.model.formatValue ? knob.model.formatValue(expectedValue) : expectedValue;
        jqUnit.assertEquals(message + " : label", knob.locate("valueLabel").text(), formattedValue + "");
        jqUnit.assertEquals(message + " : aria-valuenow", knob.container.attr("aria-valuenow"), formattedValue + "");
    };

    //Verifying styles and inouts
    jqUnit.test("knob: default styles and inputs", function () {
        $(".test").empty();
        var knob = sisiliano.knob(".test");

        sisiliano.tests.knob.verifyStyles(knob, {
            color: "#009688",
            value: "0"
        });
    });

    jqUnit.test("knob: customized styles and inputs", function () {
        $(".test").empty();
        var knob = sisiliano.knob(".test", {
            model: {
                value: 30,
                color: "#0000BB"
            }
        });

        sisiliano.tests.knob.verifyStyles(knob, {
            value: 30,
            color: "#0000BB"
        });
    });

    sisiliano.tests.knob.verifyStyles = function (knob, properties) {
        jqUnit.assertEquals("value '" + properties.value + "' should have been applied to the slider",
            properties.value + "",
            knob.locate("valueLabel").text()
        );
        jqUnit.assertEquals("text color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.tests.helpers.toHex(knob.locate("valueLabel").css("fill"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.tests.helpers.toHex(knob.locate("valueCircle").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.tests.helpers.toHex(knob.locate("knobBackgroundCircle").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.tests.helpers.toHex(knob.locate("valueCircle").css("fill"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.tests.helpers.toHex(knob.locate("knobBackgroundCircle").css("fill"))
        );
    };
})(fluid, jqUnit);