(function (fluid, jqUnit) {
    "use strict";

    //Verifying key events
    jqUnit.test("knob : key events", function () {
        var knob = fluid.sisiliano.knob(".test");
        $(".test").empty();
        fluid.test.knob.verifyKeyEvents(knob);
    });
    fluid.test.knob.verifyKeyEvents = function (knob) {
        var expectedValue = knob.model.value + 1;
        fluid.test.knob.pressKeyUp(knob);
        jqUnit.assertEquals("Value should be increased when up key is pressed", expectedValue, knob.model.value);

        expectedValue = knob.model.value - 1;
        fluid.test.knob.pressKeyDown(knob);
        jqUnit.assertEquals("Value should be decreased when up down is pressed", expectedValue, knob.model.value);
    };

    fluid.test.knob.pressKeyUp = function (knob) {
        fluid.test.knob.triggerKeyDown(knob, 38);
    };
    fluid.test.knob.pressKeyDown = function (knob) {
        fluid.test.knob.triggerKeyDown(knob, 40);
    };
    fluid.test.knob.triggerKeyDown = function (knob, keyCode) {
        var evt = new MouseEvent("keydown", {
            view: window
        });
        evt.keyCode = keyCode;
        fluid.test.knob.triggerEvent(knob, evt);
    };
    fluid.test.knob.triggerEvent = function (knob, evt) {
        d3.select(knob.container.selector).node().dispatchEvent(evt);
    };

    //Verifying mouse events
    /*jqUnit.test("knob : mouse events", function () {
        var knob = fluid.sisiliano.knob(".test");

        fluid.test.knob.verifyMouseEvents(knob);
    });

    fluid.test.knob.verifyMouseEvents = function () {

    };*/
})(fluid, jqUnit);