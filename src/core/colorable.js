/**
 * Created by VDESIDI on 7/23/2016.
 */
(function (fluid) {
    "use strict";
    
    fluid.defaults("sisiliano.util.colorable", {
        gradeNames: "fluid.component",
        model: {
            color: ["#009688", "#000000"]
        },
        events: {
            onColorChange: null
        },
        modelListeners: {
            "color.*": {
                func: "sisiliano.util.colorable.onColorChange",
                args: ["{that}", "{that}.model.color"]
            }
        },
        listeners: {
            onCreate: {
                func: "sisiliano.util.colorable.onColorChange",
                args: ["{that}", "{that}.model.color"]
            }
        }
    });

    sisiliano.util.colorable.defaultColor = ["#009688", "#000000"];

    sisiliano.util.colorable.onColorChange = function (that, color) {
        if (color) {
            if (typeof color !== "object" || !color.length) {
                color = [color];
                that.applier.change("color", color);
            } else if (color.length === 1) {
                //TODO think of a way to predict a second color for a given color
                color.push(sisiliano.util.colorable.defaultColor[1]);
                that.applier.change("color", color);
            } else {
                that.events.onColorChange.fire();
            }
        } else {
            that.applier.change("color", [
                sisiliano.util.colorable.defaultColor[0],
                sisiliano.util.colorable.defaultColor[1]
            ]);
        }
    };
})(fluid);
