(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.knob", {
        gradeNames: ["sisiliano.slider"],
        template: "src/controllers/knob/knob.html",
        model: {
            styles: {
                valueText: {
                    "x": 40,
                    "y": 170,
                    "class": "unselectable sisiliano-knob-value-text",
                    "font-family": "inherit",
                    "fill": "#009688",
                    "font-style": "italic",
                    "font-size": "80px"
                },
                valueKnob: {
                    "class": "sisiliano-knob-circle sisiliano-knob-value-circle",
                    "cx": 150,
                    "cy": 150,
                    "fill": "transparent",
                    "fill-opacity": 0,
                    "r": 130,
                    "stroke": "#009688",
                    "stroke-width": 20,
                    "transform": "rotate(90, 150, 150)"
                },
                backgroundKnob: {
                    "class": "sisiliano-knob-circle sisiliano-knob-background-circle",
                    "cx": 150,
                    "cy": 150,
                    "fill": "white",
                    "fill-opacity": 0,
                    "r": 130,
                    "stroke": "white",
                    "stroke-dashoffset": 0,
                    "stroke-opacity": 0.4,
                    "stroke-width": 10
                }
            }
        },
        ariaDescription: "Use up and down keys to increase and decrease the value. If you are using the mouse, Drag around the center to adjust the value",
        selectors: {
            svg: "svg",
            valueLabel: ".sisiliano-knob-value-text",
            valueCircle: ".sisiliano-knob-value-circle",
            knobBackgroundCircle: ".sisiliano-knob-background-circle",
            borderCircle: "sisiliano-knob-circle sisiliano-knob-border-circle",
            circles: ".sisiliano-knob-circle"
        },
        listeners: {
            onReady: [
                {
                    func: "sisiliano.knob.onRadiusChange",
                    args: ["{that}", "{that}.model.styles.valueKnob.r"]
                },
                {
                    func: "sisiliano.util.applyStylesToTheElement",
                    args: ["{that}.dom.valueLabel", "{that}.model.styles.valueText", "{that}.options.styleRules"]
                },
                {
                    func: "sisiliano.util.applyStylesToTheElement",
                    args: ["{that}.dom.valueCircle", "{that}.model.styles.valueKnob", "{that}.options.styleRules"]
                },
                {
                    func: "sisiliano.util.applyStylesToTheElement",
                    args: ["{that}.dom.knobBackgroundCircle", "{that}.model.styles.backgroundKnob", "{that}.options.styleRules"]
                },
                {
                    func: "sisiliano.knob.addListeners",
                    args: ["{that}"]
                }
            ],
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
            "styles.valueKnob.r": {
                func: "sisiliano.knob.onRadiusChange",
                args: ["{that}", "{that}.model.styles.valueKnob.r"]
            },
            "styles.valueText.*": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.valueLabel", "{that}.model.styles.valueText", "{that}.options.styleRules"]
            },
            "styles.valueKnob.*": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.valueCircle", "{that}.model.styles.valueKnob", "{that}.options.styleRules"]
            },
            "styles.backgroundKnob.*": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.knobBackgroundCircle", "{that}.model.styles.backgroundKnob", "{that}.options.styleRules"]
            }
        }
    });

    sisiliano.knob.onRadiusChange = function (that, radius) {
        var circumference = sisiliano.knob.getCircumference(radius);
        that.applier.change("styles.valueKnob.stroke-dasharray", circumference);
    };

    sisiliano.knob.onStatusChange = function (that, isActive) {
        var className = "sisiliano-knob" + (isActive ? " sisiliano-active" : "");
        d3.select(that.container.get(0)).select(".sisiliano-knob").attr("class", className);
    };

    sisiliano.knob.onValueChange = function (that, obviousValue) {
        var valueRange = that.model.size;
        var circumference = sisiliano.knob.getCircumference(that.model.styles.valueKnob.r);
        var offset = ((circumference / valueRange) * (valueRange - obviousValue)) ;
        that.applier.change("styles.valueKnob.stroke-dashoffset", offset);
    };

    sisiliano.knob.getCircumference = function (radius) {
        return 2 * radius * Math.PI;
    };

    sisiliano.knob.onColorChange = function (that, newColor) {
        that.applier.change("styles.valueKnob.fill", newColor[0]);
        that.applier.change("styles.valueKnob.stroke", newColor[0]);
        that.applier.change("styles.backgroundKnob.fill", newColor[0]);
        that.applier.change("styles.backgroundKnob.stroke", newColor[0]);
        that.applier.change("styles.valueText.fill", newColor[0]);
    };

    sisiliano.knob.addListeners = function (that) {
        var mouseMoveHandler = function () {
            if (that.model.status.isActive) {
                var position = d3.mouse(that.container.find("svg").eq(0).get(0));
                var center = {x: 150, y: 150};
                var clickedPosition = {x: position[0], y: position[1]};
                sisiliano.knob.setValueByAngle(that, center, clickedPosition);

                d3.event.preventDefault();
            }
        };

        var outsideMouseMoveHandler = function (evt) {
            if (that.model.status.isActive) {
                var svgElm = that.locate("svg");
                if (svgElm && svgElm.length > 0) {
                    var svgPosition = svgElm.offset();
                    var center = {x: svgPosition.left + (svgElm.width() / 2), y: svgPosition.top + (svgElm.height() / 2)};

                    //Considering the firstly touched position if there are many touch points
                    var touchEvt = evt.type === "touchmove" ? evt.touches[0] : evt;

                    var clickedPosition = {x: touchEvt.pageX, y: touchEvt.pageY};
                    sisiliano.knob.setValueByAngle(that, center, clickedPosition);
                }

                evt.preventDefault(evt);
            }
        };

        document.addEventListener("mousemove", outsideMouseMoveHandler);
        document.addEventListener("pointermove", outsideMouseMoveHandler);
        document.addEventListener("touchmove", outsideMouseMoveHandler);

        d3.select(that.locate("componentDiv").get(0))
            .on("mousemove", mouseMoveHandler)
            .on("pointermove", mouseMoveHandler)
            .on("touchmove", mouseMoveHandler);
    };

    sisiliano.knob.setValueByAngle = function (that, center, clickedPosition) {
        var value = sisiliano.util.getAngle(center, clickedPosition) * that.model.size;
        if (that.model.value !== value) {
            that.applier.change("value", value + that.model.min);
        }
    };
})(fluid);