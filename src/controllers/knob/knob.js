(function (fluid) {
    "use strict";

    fluid.defaults("fluid.sisiliano.knob", {
        gradeNames: ["fluid.viewComponent", "autoInit", "fluid.eventedComponent"],
        model: {
            color: "#009688",
            value: 0,
            status: {
                isActive: false
            }
        },
        selectors: {
            valueLabel: ".fl-sisiliano-knob-value-text",
            valueCircle: ".fl-sisiliano-knob-value-circle",
            knobBackgroundCircle: ".fl-sisiliano-knob-background-circle",
            borderCircle: "fl-sisiliano-knob-circle fl-sisiliano-knob-border-circle",
            circles: ".fl-sisiliano-knob-circle"
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
            },
            "status.isActive": {
                func: "fluid.sisiliano.knob.onStatusChange",
                args: ["{that}", "{that}.model.status.isActive"]
            }
        }
    });

    fluid.sisiliano.knob.onStatusChange = function (that, isActive) {
        var className = "fl-sisiliano-knob" + (isActive ? " fl-sisiliano-active" : "");
        d3.select(that.container.get(0)).select(".fl-sisiliano-knob").attr("class", className);
    };

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
                that.locate("valueCircle").attr("stroke-dashoffset", offset);
            }
        }
    };

    fluid.sisiliano.knob.onColorChange = function (that, newColor) {
        that.locate("valueCircle").css("stroke", newColor);
        that.locate("knobBackgroundCircle").css("stroke", newColor);
        that.locate("valueCircle").css("fill", newColor);
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
        that.locate("circles").attr("stroke-dasharray", that.model.circumference + "px");
    };

    fluid.sisiliano.knob.onCreate = function (that) {
        fluid.sisiliano.util.getTemplate(function (template) {
            var html = template(that.model);
            that.container.html(html);
            fluid.sisiliano.knob.init(that);
            fluid.sisiliano.knob.initOptions(that, that.model, that.options);
            fluid.sisiliano.knob.addListeners(that);
        }, "src/controllers/knob/knob.html");
    };

    fluid.sisiliano.knob.addListeners = function (that) {
        d3.select(document)
            .on("mouseup", function () {
                that.applier.change("status.isActive", false);
            })
            .on("click", function () {
                that.applier.change("status.isActive", false);
            });

        d3.select(that.container.get(0))
            .on("keydown", function () {
                if (d3.event.keyCode === 38) {
                    that.applier.change("value", that.model.value + 1);
                    d3.event.preventDefault();
                } else if (d3.event.keyCode === 40) {
                    that.applier.change("value", that.model.value - 1);
                    d3.event.preventDefault();
                }
            });

        d3.select(that.container.get(0)).selectAll(".fl-sisiliano-knob")
            .on("mousedown", function () {
                that.applier.change("status.isActive", true);
            })
            .on("mousemove", function () {
                var position = d3.mouse(that.container.find("svg").eq(0).get(0));
                var center = {x: 150, y: 150};
                var radius = 150;
                var clickedPosition = {x: position[0], y: position[1]};

                if (that.model.status.isActive && fluid.sisiliano.util.isInsideTheCircle(center, radius, clickedPosition)) {
                    var value = (fluid.sisiliano.util.getAngle(center, clickedPosition) / 2) * 100;

                    if (that.model.value !== value) {
                        that.applier.change("value", value);
                    }
                }
            })
            .on("mouseup", function () {
                that.applier.change("status.isActive", false);
            })
            .on("mouseleave", function () {
                that.applier.change("status.isActive", false);
            });
    };
})(fluid);