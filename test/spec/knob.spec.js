(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("sisiliano.knob");

    sisiliano.knob.getElementNode = function (knob) {
        return d3.select(knob.container.selector).node();
    };

    //Verifying styles and inouts
    jqUnit.test("knob: default styles and inputs", function () {
        $(".test").empty();
        var knob = sisiliano.knob(".test");

        sisiliano.knob.verifyStyles(knob, {
            color: "#009688",
            value: "0"
        });
    });

    jqUnit.test("knob: customized styles and inputs", function () {
        $(".test").empty();
        var knob = sisiliano.knob(".test", {
            value: 30,
            color: "#0000BB"
        });

        sisiliano.knob.verifyStyles(knob, {
            value: 30,
            color: "#0000BB"
        });
    });

    sisiliano.knob.verifyStyles = function (knob, properties) {
        jqUnit.assertEquals("value '" + properties.value + "' should have been applied to the slider",
            properties.value + "%",
            knob.locate("valueLabel").text()
        );
        jqUnit.assertEquals("text color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.helpers.toHex(knob.locate("valueLabel").css("fill"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.helpers.toHex(knob.locate("valueCircle").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.helpers.toHex(knob.locate("knobBackgroundCircle").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.helpers.toHex(knob.locate("valueCircle").css("fill"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            sisiliano.helpers.toHex(knob.locate("knobBackgroundCircle").css("fill"))
        );
    };
})(fluid, jqUnit);