(function (fluid) {
    "use strict";

    fluid.defaults("fluid.sisiliano.knob", {
        gradeNames: ["fluid.viewComponent", "autoInit", "fluid.eventedComponent"],
        model: {
            color: "#009688",
            value: 0,
            status: {
                prev: {},
                mousedown: false
            }
        },
        selectors: {
            knob: ".knob-circle",
            valueLabel: ".knob-value-text",
            valueRing: ".knob-value-circle",
            knobBackgroundCircle: ".knob-background-circle",
            borderCircle: "knob-circle knob-border-circle",
            rings: ".knob-circle"
        },
        events: {
            onChange: null
        },
        listeners: {
            onCreate: {
                func: "fluid.sisiliano.knob.onCreate",
                args: ["{that}"]
            }
        },
        modelListeners: {
            "value": {
                func: "fluid.sisiliano.knob.onValueChange",
                args: ["{that}", "{that}.model.value"]
            },
            "color": {
                func: "fluid.sisiliano.knob.onColorChange",
                args: ["{that}", "{that}.model.color"]
            }
        }
    });

    fluid.sisiliano.knob.onValueChange = function (that, newValue) {
        if (typeof newValue !== "number") {
            newValue = 0;
            that.applier.change("value", newValue);
        } else if (newValue > 100) {
            newValue = 100;
            that.applier.change("value", newValue);
        } else if (newValue < 0) {
            newValue = 0;
            that.applier.change("value", newValue);
        } else {
            newValue = Math.round(newValue);

            if (that.model.value <= 100 && that.model.value >= 0) {
                //Update the value in the UI
                that.locate("valueLabel").text(newValue + "%");

                //Update the ring arc according to the value
                var offset = ((that.model.circumference / 100) * (100 - newValue)) + "px";
                that.locate("valueRing").attr("stroke-dashoffset", offset);
            }
        }
    };

    fluid.sisiliano.knob.onColorChange = function (that, newColor) {
        that.locate("valueRing").css("stroke", newColor);
        that.locate("knobBackgroundCircle").css("stroke", newColor);
        that.locate("valueRing").css("fill", newColor);
        that.locate("knobBackgroundCircle").css("fill", newColor);
        that.locate("valueLabel").css("fill", newColor);
    };

    fluid.sisiliano.knob.initOptions = function (that, model, input) {
        for (var key in model) {
            if (input[key] !== undefined) {
                that.applier.change(key, input[key]);
            }
        }

        fluid.sisiliano.knob.onColorChange(that, that.model.color);
        fluid.sisiliano.knob.onValueChange(that, that.model.value);
    };

    fluid.sisiliano.knob.init = function (that) {
        var circleRadius = parseInt(that.locate("knobBackgroundCircle").attr("r"), "");

        that.applier.change("radius", circleRadius);
        that.applier.change("circumference", 2 * that.model.radius * Math.PI);
        that.locate("rings").attr("stroke-dasharray", that.model.circumference + "px");
    };

    fluid.sisiliano.knob.onCreate = function (that) {
        that.container.html(fluid.sisiliano.templates["src/controllers/knob/knob.html"]);
        fluid.sisiliano.knob.init(that);
        fluid.sisiliano.knob.initOptions(that, that.model, that.options);

        d3.select($(that.container).get(0))
            .on("keydown", function () {
                if (d3.event.keyCode === 38) {
                    that.applier.change("value", that.model.value + 1);
                    d3.event.preventDefault();
                } else if (d3.event.keyCode === 40) {
                    that.applier.change("value", that.model.value - 1);
                    d3.event.preventDefault();
                }
            })
            .on("mousemove", function () {
                var position = d3.mouse($(that.container).find("svg").eq(0).get(0));
                var center = {x: 150, y: 150};
                var radius = 150;
                var clickedPosition = {x: position[0], y: position[1]};

                if (that.model.status.mousedown && fluid.sisiliano.util.isInsideTheCircle(center, radius, clickedPosition)) {
                    var value = (fluid.sisiliano.util.getAngle(center, clickedPosition) / 2) * 100;

                    if (that.model.value !== value) {
                        that.applier.change("value", value);
                    }
                }
            })
            .on("mousedown", function () {
                that.applier.change("status.mousedown", true);
            })
            .on("mouseup", function () {
                that.applier.change("status.mousedown", false);
            })
            /*.on("mouseleave", function () {
                that.applier.change("status.mousedown", false);
            })*/
            .on("focusout", function () {
                that.applier.change("status.mousedown", false);
            })
            .on("blur", function () {
                that.applier.change("status.mousedown", false);
            });
    };

})(fluid);