(function(fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("fluid.test.knob");

    fluid.test.knob.verifyStyles = function(knob, properties) {
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
            fluid.test.helpers.toHex(knob.locate("valueRing").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("knobBackgroundCircle").css("stroke"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("valueRing").css("fill"))
        );
        jqUnit.assertEquals("slider color '" + properties.color + "' should have been applied to the slider",
            properties.color,
            fluid.test.helpers.toHex(knob.locate("knobBackgroundCircle").css("fill"))
        );
    };
    jqUnit.test("basics of ring slider", function() {
        var elm = $("<div class='test1' style='width:100px; height: 150px'></div>");
        $("body").append(elm);
        var knob = fluid.sisiliano.knob(".test1");

        fluid.test.knob.verifyStyles(knob, {
            color: "#009688",
            value: "0"
        });
    });

    jqUnit.test("Custimizations of ring slider", function() {
        var elm = $("<div class='test2' style='width:100px; height: 150px'></div>");
        $("body").append(elm);

        var knob = fluid.sisiliano.knob(".test2", {
            value: 30,
            color: "#0000BB"
        });

        fluid.test.knob.verifyStyles(knob, {
            value: 30,
            color: "#0000BB"
        });
    });
})(fluid, jqUnit);