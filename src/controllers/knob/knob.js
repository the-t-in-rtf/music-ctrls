(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.knob", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            min: 0,
            max: 100,
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
            valueLabelTitle: ".sisiliano-knob-value-text-title",
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
        } else if (newValue > that.model.max) {
            newValue = that.model.max;
            that.applier.change("value", newValue);
        } else if (newValue < that.model.min) {
            newValue = that.model.min;
            that.applier.change("value", newValue);
        } else {
            if (that.model.value <= that.model.max && that.model.value >= that.model.min) {
                //Update the value in the UI
                that.locate("valueLabel").text(Math.round(newValue) + "%");
                that.locate("valueLabelTitle").html(Math.round(newValue * 100.0) / 100);

                //Update the ring arc according to the value
                var offset = ((that.model.circumference / that.model.max) * (that.model.max - newValue)) + "px";
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
        var mouseMoveHandler = function () {
            var position = d3.mouse(that.container.find("svg").eq(0).get(0));
            var center = {x: 150, y: 150};
            var clickedPosition = {x: position[0], y: position[1]};
            if (that.model.status.isActive) {
                sisiliano.knob.setValueByAngle(that, center, clickedPosition);
                d3.event.preventDefault();
            }
        };
        var keyDownHandler = function () {
            if (d3.event.keyCode === 38) {
                that.applier.change("value", that.model.value + 1);
                d3.event.preventDefault();
            } else if (d3.event.keyCode === 40) {
                that.applier.change("value", that.model.value - 1);
                d3.event.preventDefault();
            }
        };

        document.addEventListener("mousemove", function (evt) {
            var svgElm = that.container.find("svg");
            var svgPosition = svgElm.position();
            var center = {x: svgPosition.left + (svgElm.width() / 2), y: svgPosition.top + (svgElm.height() / 2)};
            var clickedPosition = {x: evt.pageX, y: evt.pageY};
            if (that.model.status.isActive) {
                sisiliano.knob.setValueByAngle(that, center, clickedPosition);

                return false;
            }
        });
        document.addEventListener("mouseup", sisiliano.knob.setKnobActiveStatus.bind(this, that, false));

        d3.select(that.container.get(0))
            .on("keydown", keyDownHandler)
            .on("mousedown", sisiliano.knob.setKnobActiveStatus.bind(this, that, true))
            .on("touchstart", sisiliano.knob.setKnobActiveStatus.bind(this, that, true))
            .on("touchmove", mouseMoveHandler)
            .on("mouseup", sisiliano.knob.setKnobActiveStatus.bind(this, that, false))
            .on("touchend", sisiliano.knob.setKnobActiveStatus.bind(this, that, false));
    };

    sisiliano.knob.setKnobActiveStatus = function (that, status) {
        that.applier.change("status.isActive", status);
    };

    sisiliano.knob.setValueByAngle = function (that, center, clickedPosition) {
        var value = sisiliano.util.getAngle(center, clickedPosition) * that.model.max;
        if (that.model.value !== value) {
            that.applier.change("value", value);
        }
    };
})(fluid);