(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("fluid.test.knob");

    fluid.test.knob.getElementNode = function (knob) {
        return d3.select(knob.container.selector).node();
    };

    //Verifying styles and inouts
    jqUnit.test("knob: default styles and inputs", function () {
        $(".test").empty();
        var knob = fluid.sisiliano.knob(".test");

        fluid.test.knob.verifyStyles(knob, {
            color: "#009688",
            value: "0"
        });
    });

    jqUnit.test("knob: customized styles and inputs", function () {
        $(".test").empty();
        var knob = fluid.sisiliano.knob(".test", {
            value: 30,
            color: "#0000BB"
        });

        fluid.test.knob.verifyStyles(knob, {
            value: 30,
            color: "#0000BB"
        });
    });

    fluid.test.knob.verifyStyles = function (knob, properties) {
        jqUnit.assertEquals("value '" + properties.value + "' should have been applied to the slider",
            properties.value + "%",
            knob.locate("valueLabel").text()
        );
        jqUnit.assertEquals("text color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("valueLabel").css("fill"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("valueCircle").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("knobBackgroundCircle").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("valueCircle").css("fill"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("knobBackgroundCircle").css("fill"))
        );
    };

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