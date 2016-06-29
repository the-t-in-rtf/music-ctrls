(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("sisiliano.tests.piano");

    jqUnit.test("basics of piano", function () {
        $(".test").empty();
        var piano = sisiliano.piano(".test");
        sisiliano.tests.piano.verifyPressedColor(piano, "#4CAF50");
        sisiliano.tests.piano.verifyActiveArea(piano, 0, 18);
        sisiliano.tests.piano.verifyLength(piano, 36);
    });

    jqUnit.test("Custimizations of piano", function () {
        $(".test").empty();
        var piano = sisiliano.piano(".test", {
            model: {
                color: "#FF0000",
                activeArea: {
                    start: 3,
                    end: 9
                },
                keyBoard: {
                    length: 20
                }
            }
        });
        sisiliano.tests.piano.verifyPressedColor(piano, "#FF0000");
        sisiliano.tests.piano.verifyActiveArea(piano, 5, 16);
        sisiliano.tests.piano.verifyLength(piano, 20);
    });

    sisiliano.tests.piano.verifyPressedColor = function (piano, expectedColor) {
        d3.select(piano.container.get(0)).selectAll(".sisiliano-piano-key").each(function () {
            var key = d3.select(this);
            var className = key.attr("class");
            key.attr("class", className + " sisiliano-piano-key-pressed");
            var fillColorWhenPressed = key.style("fill");
            jqUnit.assertEquals("color should be #4CAF50 - " + className, expectedColor, sisiliano.tests.helpers.toHex(fillColorWhenPressed));
            key.attr("class", className);
        });
    };

    sisiliano.tests.piano.verifyActiveArea = function (piano, expectedStart, expectedEnd) {
        d3.select(piano.container.get(0)).selectAll(".sisiliano-piano-key").each(function () {
            var key = d3.select(this);
            var className = key.attr("class");
            var index = parseInt(key.attr("index"), null);
            if (index >= expectedStart && index <= expectedEnd) {
                jqUnit.assertTrue(index + " should be active", className.indexOf("sisiliano-piano-key-active") >= 0);
            } else {
                jqUnit.assertFalse(index + " should be inactive", className.indexOf("sisiliano-piano-key-active") >= 0);
            }
        });
    };

    sisiliano.tests.piano.verifyLength = function (piano, expectedLength) {
        var numberOfKeys = d3.select(piano.container.get(0)).selectAll(".sisiliano-piano-key")[0].length;
        jqUnit.assertEquals("The length should be " + expectedLength, expectedLength, numberOfKeys);
    };
})(fluid, jqUnit);