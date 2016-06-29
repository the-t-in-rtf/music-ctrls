(function (fluid, jqUnit) {
    "use strict";

    //Verifying key events
    jqUnit.test("knob : key events", function () {
        var knob = sisiliano.knob(".test");
        $(".test").empty();
        sisiliano.tests.knob.verifyKeyEvents(knob);
    });
    sisiliano.tests.knob.verifyKeyEvents = function (knob) {
        var expectedValue = knob.model.value + 1;
        sisiliano.tests.knob.pressKeyUp(knob);
        jqUnit.assertEquals("Value should be increased when up key is pressed", expectedValue, knob.model.value);

        expectedValue = knob.model.value - 1;
        sisiliano.tests.knob.pressKeyDown(knob);
        jqUnit.assertEquals("Value should be decreased when up down is pressed", expectedValue, knob.model.value);
    };

    sisiliano.tests.knob.pressKeyUp = function (knob) {
        sisiliano.tests.knob.triggerKeyDown(knob, 38);
    };
    sisiliano.tests.knob.pressKeyDown = function (knob) {
        sisiliano.tests.knob.triggerKeyDown(knob, 40);
    };
    sisiliano.tests.knob.triggerKeyDown = function (knob, keyCode) {
        var evt = new MouseEvent("keydown", {
            view: window
        });
        evt.keyCode = keyCode;
        sisiliano.tests.knob.triggerEvent(knob, evt);
    };
    sisiliano.tests.knob.triggerEvent = function (knob, evt) {
        d3.select(knob.container.selector).node().dispatchEvent(evt);
    };

    //Verifying mouse events
    /*jqUnit.test("knob : mouse events", function () {
        var knob = sisiliano.knob(".test");

        sisiliano.tests.knob.verifyMouseEvents(knob);
    });

    sisiliano.tests.knob.verifyMouseEvents = function () {

    };*/
})(fluid, jqUnit);