(function (fluid, jqUnit) {
    "use strict";

    /////////////////////////////////////////////////////////
    /////           Verifying key events
    /////////////////////////////////////////////////////////
    fluid.registerNamespace("sisiliano.tests.knob.keyEvents");
    jqUnit.test("knob : key events", function () {
        var knob = sisiliano.knob(".test");
        $(".test").empty();
        sisiliano.tests.knob.keyEvents.verifyKeyEvents(knob);
    });
    sisiliano.tests.knob.keyEvents.verifyKeyEvents = function (knob) {
        var expectedValue = knob.model.value + 1;
        sisiliano.tests.knob.keyEvents.pressKeyUp(knob);
        sisiliano.tests.knob.verifyValue(knob, "Value should be increased when up key is pressed", expectedValue);

        expectedValue = knob.model.value - 1;
        sisiliano.tests.knob.keyEvents.pressKeyDown(knob);
        sisiliano.tests.knob.verifyValue(knob, "Value should be decreased when up down is pressed", expectedValue);
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

    sisiliano.tests.knob.mouseEvents.verifyMouseMoveInsideTheKnob = function (knob) {
        var svgPosition = knob.container.find("svg").position();
        var d = Math.min(knob.container.width(), knob.container.height());
        svgPosition.left += (knob.container.width() - d) / 2;
        svgPosition.top += (knob.container.height() - d) / 2;

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left, svgPosition.top + d);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 45 degrees", 12.5);

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left, svgPosition.top);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 135 degrees", 37.5);

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left + d, svgPosition.top);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 225 degrees", 62.5);

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left + d, svgPosition.top + d);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 315 degrees", 87.5);
    };

    sisiliano.tests.knob.mouseEvents.verifyMouseMoveOutsideTheKnob = function (knob) {
        var svgPosition = knob.container.find("svg").position();
        var d = Math.min(knob.container.width(), knob.container.height());
        svgPosition.left += (knob.container.width() - d) / 2;
        svgPosition.top += (knob.container.height() - d) / 2;

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, -1000, svgPosition.top + d / 2);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 90 degrees", 25);

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left + d / 2, -1000);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 180 degrees", 50);

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, 1000, svgPosition.top + d / 2);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 270 degrees", 75);

        sisiliano.tests.knob.mouseEvents.moveMouseTo(knob, svgPosition.left + d / 2, 1000);
        sisiliano.tests.knob.verifyValue(knob, "when the mouse pointer has made an angle of 360 degrees", 100);
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

    sisiliano.tests.knob.mouseEvents.pressMouseDown = function (knob) {
        knob.container.simulate("mousedown");
    };
})(fluid, jqUnit);