(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("sisiliano.tests.linearSlider");

    sisiliano.tests.linearSlider.verifyValue = function (linearSlider, message, expectedValue) {
        jqUnit.assertEquals(message + " : value", expectedValue, linearSlider.model.value);
        var formattedValue = linearSlider.model.formatValue ? linearSlider.model.formatValue(expectedValue) : expectedValue;
        jqUnit.assertEquals(message + " : label", formattedValue + "", linearSlider.locate("valueLabel").text());
    };

    jqUnit.test("linearSlider: slider regression", function () {
        $(".test").empty();
        var linearSlider = sisiliano.linearSlider(".test");

        sisiliano.tests.verifySlider("linearSlider regression of slider features", linearSlider);
    });

    /////////////////////////////////////////////////////////
    /////           Verifying mouse events
    /////////////////////////////////////////////////////////

    fluid.registerNamespace("sisiliano.tests.linearSlider.mouseEvents");
    
    jqUnit.test("linearSlider: mouse events", function () {
        $(".test").empty();
        var linearSlider = sisiliano.linearSlider(".test");

        linearSlider.events.onReady.fire();
        sisiliano.tests.linearSlider.verifyMouseEvents("linearSlider: mouse events", linearSlider);
    });

    sisiliano.tests.linearSlider.verifyMouseEvents = function (message, linearSlider) {
        var sliderWidth = linearSlider.container.width();
        var sliderPosition = linearSlider.container.position();

        var testCases = [
            {
                position: {
                    x: sliderPosition.left,
                    y: sliderPosition.top
                },
                expectedValue: linearSlider.model.min
            },
            {
                position: {
                    x: sliderPosition.left + (sliderWidth / 2),
                    y: sliderPosition.top
                },
                expectedValue: linearSlider.model.min + ((linearSlider.model.max - linearSlider.model.min) / 2)
            },
            {
                position: {
                    x: sliderPosition.left + sliderWidth,
                    y: sliderPosition.top
                },
                expectedValue: linearSlider.model.max
            }
        ];

        fluid.each(testCases, function (testCase) {
            var element = linearSlider.container;

            sisiliano.tests.util.mouseEvents.mouseUp(element);
            sisiliano.tests.linearSlider.verifyValueWhenMouseIsMoved(message + " : without mouse down",
                linearSlider, testCase.position, linearSlider.model.value);

            sisiliano.tests.util.mouseEvents.mouseDown(element);
            sisiliano.tests.linearSlider.verifyValueWhenMouseIsMoved(message + " : with mouse down",
                linearSlider, testCase.position, testCase.expectedValue);

            sisiliano.tests.util.mouseEvents.mouseUp(element);
        });
    };

    sisiliano.tests.linearSlider.verifyValueWhenMouseIsMoved = function (message, linearSlider, newPosition, expectedValue) {
        var element = linearSlider.container;

        sisiliano.tests.util.mouseEvents.moveMouseTo(element, newPosition.x, newPosition.y);
        sisiliano.tests.linearSlider.verifyValue(linearSlider, message, expectedValue);
    };
})(fluid, jqUnit);