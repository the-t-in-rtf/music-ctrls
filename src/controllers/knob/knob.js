(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.knob", {
        gradeNames: ["sisiliano.slider"],
        model: {
            radius: 130
        },
        ariaDescription: "Use up and down keys to increase and decrease the value. If you are using the mouse, Drag around the center to adjust the value",
        selectors: {
            controller: ".sisiliano",
            svg: "svg",
            valueLabel: ".sisiliano-knob-value-text",
            valueCircle: ".sisiliano-knob-value-circle",
            knobBackgroundCircle: ".sisiliano-knob-background-circle",
            borderCircle: "sisiliano-knob-circle sisiliano-knob-border-circle",
            circles: ".sisiliano-knob-circle"
        },
        listeners: {
            onCreate: {
                func: "sisiliano.knob.onCreate",
                args: ["{that}"]
            },
            onValueChange: {
                func: "sisiliano.knob.onValueChange",
                args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            onColorChange: {
                func: "sisiliano.knob.onColorChange",
                args: ["{that}", "{that}.model.color"]
            },
            onStatusChange: {
                func: "sisiliano.knob.onStatusChange",
                args: ["{that}", "{that}.model.status.isActive"]
            }
        },
        modelListeners: {
            radius: {
                func: "sisiliano.knob.onRadiusChange",
                args: ["{that}", "{that}.model.radius"]
            }
        }
    });

    sisiliano.knob.onRadiusChange = function (that, radius) {
        that.locate("knobBackgroundCircle").attr("r", radius);
        var circumference = 2 * radius * Math.PI;
        that.applier.change("circumference", circumference);
        that.locate("circles").attr("stroke-dasharray", circumference);
    };

    sisiliano.knob.onStatusChange = function (that, isActive) {
        var className = "sisiliano-knob" + (isActive ? " sisiliano-active" : "");
        d3.select(that.container.get(0)).select(".sisiliano-knob").attr("class", className);
    };

    sisiliano.knob.onValueChange = function (that, obviousValue) {
        var valueRange = that.model.size;
        var offset = ((that.model.circumference / valueRange) * (valueRange - obviousValue)) + "px";
        that.locate("valueCircle").attr("stroke-dashoffset", offset);
    };

    sisiliano.knob.onColorChange = function (that, newColor) {
        that.locate("valueCircle").css("stroke", newColor);
        that.locate("knobBackgroundCircle").css("stroke", newColor);
        that.locate("valueCircle").css("fill", newColor);
        that.locate("knobBackgroundCircle").css("fill", newColor);
        that.locate("valueLabel").css("fill", newColor);
    };

    sisiliano.knob.onCreate = function (that) {
        sisiliano.util.getTemplate(function (template) {
            var html = template(that.model);
            that.container.html(html);
            sisiliano.knob.onRadiusChange(that, that.model.radius);
            that.events.onReady.fire();
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

        document.addEventListener("mousemove", function (evt) {
            var svgElm = that.locate("svg");
            if (svgElm && svgElm.length > 0) {
                var svgPosition = svgElm.position();
                var center = {x: svgPosition.left + (svgElm.width() / 2), y: svgPosition.top + (svgElm.height() / 2)};
                var clickedPosition = {x: evt.pageX, y: evt.pageY};
                if (that.model.status.isActive) {
                    sisiliano.knob.setValueByAngle(that, center, clickedPosition);

                    return false;
                }
            }
        });
        document.addEventListener("mouseup", sisiliano.knob.setKnobActiveStatus.bind(this, that, false));

        d3.select(that.container.get(0))
            .on("touchmove", mouseMoveHandler)
            .on("mousemove", mouseMoveHandler);
    };

    sisiliano.knob.setKnobActiveStatus = function (that, status) {
        that.applier.change("status.isActive", status);
    };

    sisiliano.knob.setValueByAngle = function (that, center, clickedPosition) {
        var value = sisiliano.util.getAngle(center, clickedPosition) * that.model.size;
        if (that.model.value !== value) {
            that.applier.change("value", value + that.model.min);
        }
    };
})(fluid);