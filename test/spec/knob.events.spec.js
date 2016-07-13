(function (fluid, jqUnit) {
    "use strict";

    /////////////////////////////////////////////////////////
    /////           Verifying key events
    /////////////////////////////////////////////////////////
    fluid.registerNamespace("sisiliano.tests.knob.keyEvents");
    jqUnit.test("knob : key events", function () {
        var knob = sisiliano.knob(".test");
        sisiliano.tests.knob.keyEvents.verifyKeyEvents(knob);
    });
    sisiliano.tests.knob.keyEvents.verifyKeyEvents = function (knob) {
        var expectedValue = knob.model.value + knob.model.tickValue;
        sisiliano.tests.knob.keyEvents.pressKeyUp(knob);
        sisiliano.tests.knob.verifyValue(knob, "Value should be increased when up key is pressed", expectedValue);

        expectedValue = knob.model.value - knob.model.tickValue;
        sisiliano.tests.knob.keyEvents.pressKeyDown(knob);
        sisiliano.tests.knob.verifyValue(knob, "Value should be decreased when down key is pressed", expectedValue);

        sisiliano.tests.knob.keyEvents.verifyMinMax(knob);
    };

    sisiliano.tests.knob.keyEvents.verifyMinMax = function (knob) {
        var min = knob.model.min;
        var max = knob.model.max;

        knob.applier.change("value", min + knob.model.tickValue);
        sisiliano.tests.knob.keyEvents.pressKeyDown(knob);
        sisiliano.tests.knob.keyEvents.pressKeyDown(knob);
        sisiliano.tests.knob.keyEvents.pressKeyDown(knob);
        sisiliano.tests.knob.verifyValue(knob, "Value should be not decreasing less than the min value", min);

        knob.applier.change("value", max - knob.model.tickValue);
        sisiliano.tests.knob.keyEvents.pressKeyUp(knob);
        sisiliano.tests.knob.keyEvents.pressKeyUp(knob);
        sisiliano.tests.knob.keyEvents.pressKeyUp(knob);
        sisiliano.tests.knob.verifyValue(knob, "Value should be not increasing greater than the max value", max);
    };

    sisiliano.tests.knob.keyEvents.pressKeyUp = function (knob) {
        sisiliano.tests.knob.keyEvents.triggerKeyDown(knob, 38);
    };
    sisiliano.tests.knob.keyEvents.pressKeyDown = function (knob) {
        sisiliano.tests.knob.keyEvents.triggerKeyDown(knob, 40);
    };
    sisiliano.tests.knob.keyEvents.triggerKeyDown = function (knob, keyCode) {
        knob.container.simulate("keydown", {
            keyCode: keyCode
        });
    };
    sisiliano.tests.knob.keyEvents.triggerEvent = function (knob, evt) {
        d3.select(knob.container.selector).node().dispatchEvent(evt);
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


    /////////////////////////////////////////////////////////
    /////           Verifying min and max values
    /////////////////////////////////////////////////////////
    jqUnit.test("knob : min max", function () {
        var testCases = [
            {min: 10, max: 150},
            {min: -10, max: 100},
            {min: -140, max: -20}
        ];
        fluid.each(testCases, function (testCase) {
            var knob = sisiliano.knob(".test", {
                model: {
                    min: testCase.min,
                    max: testCase.max
                }
            });
            sisiliano.tests.knob.verifyMinMaxValues(knob);
        });
    });

    sisiliano.tests.knob.verifyMinMaxValues = function (knob) {
        var min = knob.model.min;
        var max = knob.model.max;

        jqUnit.assertEquals("aria-valuemax label should have been added", max + "",
            knob.container.find(".sisiliano").attr("aria-valuemax"));
        jqUnit.assertEquals("aria-valuemin label should have been added", min + "",
            knob.container.find(".sisiliano").attr("aria-valuemin"));
    };

    /////////////////////////////////////////////////////////
    /////           Verifying tick value
    /////////////////////////////////////////////////////////
    jqUnit.test("knob : tick value", function () {
        var testingTickValues = [1, 2, 5, 7, 10];
        fluid.each(testingTickValues, function (tickValue) {
            var knob = sisiliano.knob(".test", {
                model: {
                    tickValue: tickValue
                }
            });
            sisiliano.tests.knob.verifyTickValue(knob);
        });
    });

    sisiliano.tests.knob.verifyTickValue = function (knob) {
        sisiliano.tests.knob.keyEvents.verifyKeyEvents(knob);
        sisiliano.tests.knob.mouseEvents.verifyMouseEvents(knob);
    };


    /////////////////////////////////////////////////////////
    /////           Verifying format value
    /////////////////////////////////////////////////////////
    jqUnit.test("knob : format value", function () {
        var knob = sisiliano.knob(".test", {
            model: {
                formatValue: function (value) {
                    return "#### " + value;
                }
            }
        });
        sisiliano.tests.knob.verifyFormatValue(knob);
    });

    sisiliano.tests.knob.verifyFormatValue = function (knob) {
        knob.applier.change("value", 54);
        sisiliano.tests.knob.verifyValue(knob, "Value should have been formatted", 54);
    };
})(fluid, jqUnit);