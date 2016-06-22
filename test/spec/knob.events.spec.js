(function (fluid, jqUnit) {
    "use strict";

    //Verifying key events
    jqUnit.test("knob : key events", function () {
        var knob = sisiliano.knob(".test");
        $(".test").empty();
        sisiliano.knob.verifyKeyEvents(knob);
    });
    sisiliano.knob.verifyKeyEvents = function (knob) {
        var expectedValue = knob.model.value + 1;
        sisiliano.knob.pressKeyUp(knob);
        jqUnit.assertEquals("Value should be increased when up key is pressed", expectedValue, knob.model.value);

        expectedValue = knob.model.value - 1;
        sisiliano.knob.pressKeyDown(knob);
        jqUnit.assertEquals("Value should be decreased when up down is pressed", expectedValue, knob.model.value);
    };

    sisiliano.knob.pressKeyUp = function (knob) {
        sisiliano.knob.triggerKeyDown(knob, 38);
    };
    sisiliano.knob.pressKeyDown = function (knob) {
        sisiliano.knob.triggerKeyDown(knob, 40);
    };
    sisiliano.knob.triggerKeyDown = function (knob, keyCode) {
        var evt = new MouseEvent("keydown", {
            view: window
        });
        evt.keyCode = keyCode;
        sisiliano.knob.triggerEvent(knob, evt);
    };
    sisiliano.knob.triggerEvent = function (knob, evt) {
        d3.select(knob.container.selector).node().dispatchEvent(evt);
    };

    //Verifying mouse events
    /*jqUnit.test("knob : mouse events", function () {
        var knob = sisiliano.knob(".test");

        sisiliano.knob.verifyMouseEvents(knob);
    });

    sisiliano.knob.verifyMouseEvents = function () {

    };*/
})(fluid, jqUnit);