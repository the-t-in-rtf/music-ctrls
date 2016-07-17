(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("sisiliano.tests.knob");

    sisiliano.tests.knob.verifyValue = function (knob, message, expectedValue) {
        jqUnit.assertEquals(message + " : value", expectedValue, knob.model.value);
        var formattedValue = knob.model.formatValue ? knob.model.formatValue(expectedValue) : expectedValue;
        jqUnit.assertEquals(message + " : label", knob.locate("valueLabel").text(), formattedValue + "");
    };

    jqUnit.test("knob: slider regression", function () {
        $(".test").empty();
        var knob = sisiliano.knob(".test");

        sisiliano.tests.verifySlider("knob regression of slider features", knob);
    });

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


    /////////////////////////////////////////////////////////
    /////           Verifying mouse events
    /////////////////////////////////////////////////////////
    jqUnit.test("knob : mouse events", function () {
        var knob = sisiliano.knob(".test");

        sisiliano.tests.knob.mouseEvents.verifyMouseEvents(knob);
    });

    fluid.registerNamespace("sisiliano.tests.knob.mouseEvents");

    sisiliano.tests.knob.mouseEvents.verifyMouseEvents = function (knob) {
        sisiliano.tests.knob.mouseEvents.pressMouseDown(knob);

        sisiliano.tests.knob.mouseEvents.verifyMouseMoveInsideTheKnob(knob);
        sisiliano.tests.knob.mouseEvents.verifyMouseMoveOutsideTheKnob(knob);
    };

    sisiliano.tests.knob.mouseEvents.getValueByAngle  = function (knob, angle) {
        var min = knob.model.min;
        var max = knob.model.max;

        return ((max - min) * angle) + min;
    };

    sisiliano.tests.knob.mouseEvents.verifyMouseMoveInsideTheKnob = function (knob) {
        var svgPosition = knob.container.find("svg").position();
        var d = Math.min(knob.container.width(), knob.container.height());
        svgPosition.left += (knob.container.width() - d) / 2;
        svgPosition.top += (knob.container.height() - d) / 2;

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left, svgPosition.top + d);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 45 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 0.125));

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left, svgPosition.top);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 135 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 0.375));

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left + d, svgPosition.top);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 225 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 0.625));

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left + d, svgPosition.top + d);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 315 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 0.875));
    };

    sisiliano.tests.knob.mouseEvents.verifyMouseMoveOutsideTheKnob = function (knob) {
        var svgPosition = knob.container.find("svg").position();
        var d = Math.min(knob.container.width(), knob.container.height());
        svgPosition.left += (knob.container.width() - d) / 2;
        svgPosition.top += (knob.container.height() - d) / 2;

        sisiliano.tests.knob.mouseEvents.moveMouseToOutside(-1000, svgPosition.top + d / 2);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 90 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 0.25));

        sisiliano.tests.knob.mouseEvents.moveMouseToOutside(svgPosition.left + d / 2, -1000);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 180 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 0.50));

        sisiliano.tests.knob.mouseEvents.moveMouseToOutside(1000, svgPosition.top + d / 2);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 270 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 0.75));

        sisiliano.tests.knob.mouseEvents.moveMouseToOutside(svgPosition.left + d / 2, 1000);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 360 degrees",
            sisiliano.tests.knob.mouseEvents.getValueByAngle(knob, 1));
    };

    sisiliano.tests.knob.mouseEvents.moveMouseAndGetValue = function (knob, x, y) {
        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, x, y);

        return knob.model.value;
    };

    sisiliano.tests.knob.mouseEvents.moveMouseTo = function (knob, x, y) {
        knob.container.simulate("mousemove", {
            clientX : x,
            clientY: y
        });
    };

    sisiliano.tests.knob.mouseEvents.moveMouseToOutside = function (x, y) {
        $(document).simulate("mousemove", {
            clientX : x,
            clientY: y
        });
    };

    sisiliano.tests.knob.mouseEvents.pressMouseDown = function (knob) {
        knob.container.simulate("mousedown");
    };
    
})(fluid, jqUnit);