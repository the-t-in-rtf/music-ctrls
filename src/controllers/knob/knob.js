(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.knob", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            color: "#009688",
            value: 0,
            status: {
                isActive: false
            },
            title: "Knob Controoler",
            description: "Use up and down keys to increase and decrease the value. If you are using the mouse, Drag around the center to adjust the value"
        },
        selectors: {
            valueLabel: ".sisiliano-knob-value-text",
            valueCircle: ".sisiliano-knob-value-circle",
            knobBackgroundCircle: ".sisiliano-knob-background-circle",
            borderCircle: "sisiliano-knob-circle sisiliano-knob-border-circle",
            circles: ".sisiliano-knob-circle"
        },
        events: {
            onChange: null
        },
        listeners: {
            onCreate: {
                func: "sisiliano.knob.onCreate",
                args: ["{that}"]
            }
        },
        modelListeners: {
            "value": {
                func: "sisiliano.knob.onValueChange",
                args: ["{that}", "{that}.model.value"]
            },
            "color": {
                func: "sisiliano.knob.onColorChange",
                args: ["{that}", "{that}.model.color"]
            },
            "status.isActive": {
                func: "sisiliano.knob.onStatusChange",
                args: ["{that}", "{that}.model.status.isActive"]
            }
        }
    });

    sisiliano.knob.onStatusChange = function (that, isActive) {
        var className = "sisiliano-knob" + (isActive ? " sisiliano-active" : "");
        d3.select(that.container.get(0)).select(".sisiliano-knob").attr("class", className);
    };

    sisiliano.knob.onValueChange = function (that, newValue) {
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

    sisiliano.knob.onColorChange = function (that, newColor) {
        that.locate("valueCircle").css("stroke", newColor);
        that.locate("knobBackgroundCircle").css("stroke", newColor);
        that.locate("valueCircle").css("fill", newColor);
        that.locate("knobBackgroundCircle").css("fill", newColor);
        that.locate("valueLabel").css("fill", newColor);
    };

    sisiliano.knob.init = function (that) {
        var circleRadius = parseInt(that.locate("knobBackgroundCircle").attr("r"), "");

        that.applier.change("radius", circleRadius);
        that.applier.change("circumference", 2 * that.model.radius * Math.PI);
        that.locate("circles").attr("stroke-dasharray", that.model.circumference + "px");
    };

    sisiliano.knob.onCreate = function (that) {
        sisiliano.util.getTemplate(function (template) {
            var html = template(that.model);
            that.container.html(html);
            sisiliano.knob.init(that);
            sisiliano.knob.onColorChange(that, that.model.color);
            sisiliano.knob.onValueChange(that, that.model.value);
            sisiliano.knob.addListeners(that);
        }, "src/controllers/knob/knob.html");
    };

    sisiliano.knob.addListeners = function (that) {
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

        var mouseMoveHandler = function () {
            var position = d3.mouse(that.container.find("svg").eq(0).get(0));
            var center = {x: 150, y: 150};
            var radius = 150;
            var clickedPosition = {x: position[0], y: position[1]};
            if (that.model.status.isActive && sisiliano.util.isInsideTheCircle(center, radius, clickedPosition)) {
                var value = sisiliano.util.getAngle(center, clickedPosition) * 100;

                if (that.model.value !== value) {
                    that.applier.change("value", value);
                    d3.event.preventDefault();
                }
            }
        };

        var mouseDownHandler = function () {
            that.applier.change("status.isActive", true);
        };

        var moveOutHandler = function () {
            that.applier.change("status.isActive", false);
        };

        d3.select(that.container.get(0)).selectAll(".sisiliano-knob")
            .on("mousedown", mouseDownHandler)
            .on("touchstart", mouseDownHandler)
            .on("mousemove", mouseMoveHandler)
            .on("touchmove", mouseMoveHandler)
            .on("mouseup", moveOutHandler)
            .on("touchend", moveOutHandler)
            .on("mouseleave", moveOutHandler);
    };
})(fluid);