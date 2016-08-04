(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.linearSlider", {
        gradeNames: ["sisiliano.border", "sisiliano.slider"],
        defaultViewBox: [0 ,0, 500, 50],
        ariaDescription: "Linear slider, the value can be adjusted by arrow keys. If you are using the mouse, drag along the slider",
        template: "src/controllers/linear-slider/linear-slider.html",
        model: {
            styles: {
                pointer: {
                    label: {
                        padding: {
                            left: 3,
                            right: 3,
                            top: 3,
                            bottom: 3
                        },
                        margin: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 12
                        }
                    },
                    labelText: {
                        "font-size": "20px",
                        fill: "white"
                    },
                    valuePointer: {
                        width: 30,
                        height: 30,
                        rx: "50%",
                        ry: "50%"
                    },
                    valuePointerShadow: {
                        width: 110,
                        height: 110,
                        rx: "50%",
                        ry: "50%"
                    }
                },
                ruler: {
                    line: {
                        width: 1,
                        height: 30
                    },
                    value: {
                        "font-size": "20px"
                    }
                },
                sliderBar: {
                    valueBar: {
                        height: 10
                    },
                    backgroundBar: {
                        height: 8
                    },
                    padding: {
                        left: 80,
                        right: 80,
                        top: 80,
                        bottom: 80
                    }
                }
            },
            rulerPoints: [0,  20, 30, 40, 50, 60, 70, 80, 90, 100],
            orientation: "vertical", // vertical or horizontal
            title: "linearSlider Controller",
            description: ""
        },
        selectors: {
            controller: ".sisiliano-controller-div",
            svg: "svg",
            valueLabel: ".sisiliano-linear-slider-value-text",
            valueLabelRect: ".sisiliano-linear-slider-value-label",
            valueRect: ".sisiliano-linear-slider-value-rect",
            backgroundRect: ".sisiliano-linear-slider-background-rect",
            rects: ".sisiliano-linear-slider-rect",
            valueCircle: ".sisiliano-linear-slider-value-circle",
            valueCircleHover: ".sisiliano-linear-slider-value-circle-hover",
            ruler: ".sisiliano-linear-slider-ruler",
            valuePointer: ".sisiliano-linear-slider-value-pointer",
            valuePointerHover: ".sisiliano-linear-slider-value-pointer-hover"
        },
        listeners: {
            onValueChange: {
                func: "sisiliano.linearSlider.onValueChange",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            onColorChange: {
                func: "sisiliano.linearSlider.onColorChange",
                args: ["{that}", "{that}.model.color"]
            },
            onStatusChange: {
                func: "sisiliano.linearSlider.onStatusChange",
                args: ["{that}", "{that}.model.status.isActive"]
            },
            onReady: [
                {
                    func: "sisiliano.linearSlider.onResize",
                    args: ["{that}"]
                },
                {
                    func: "sisiliano.linearSlider.drawNotches",
                    args: ["{that}"]
                },
                {
                    func: "sisiliano.linearSlider.addListeners",
                    args: ["{that}"]
                }
            ]
        },
        modelListeners: {
            "styles.controller.*": {
                func: "sisiliano.linearSlider.onSliderStyleChange",
                args: ["{that}", "{that}.model.styles"]
            },
            "styles.sliderBar.valueBar": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.valueRect", "{that}.model.styles.sliderBar.valueBar", "{that}.options.styleRules"]
            },
            "styles.sliderBar.backgroundBar": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.backgroundRect", "{that}.model.styles.sliderBar.backgroundBar", "{that}.options.styleRules"]
            },
            "styles.pointer.label.*": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.valueLabelRect", "{that}.model.styles.pointer.label", "{that}.options.styleRules"]
            },
            "styles.pointer.labelText.*": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.valueLabel", "{that}.model.styles.pointer.labelText", "{that}.options.styleRules"]
            },
            "styles.pointer.valuePointer.*": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.valuePointer", "{that}.model.styles.pointer.valuePointer",
                    "{that}.options.styleRules"]
            },
            "styles.pointer.valuePointerShadow.*": {
                func: "sisiliano.util.applyStylesToTheElement",
                args: ["{that}.dom.valuePointerHover", "{that}.model.styles.pointer.valuePointerShadow",
                    "{that}.options.styleRules"]
            }
        }
    });

    sisiliano.linearSlider.onSliderStyleChange = function (that, styles) {
        if (styles.controller.width && styles.controller.height) {
            sisiliano.linearSlider.onSliderBarStyleChange(that);
            sisiliano.linearSlider.drawNotches(that);
            sisiliano.linearSlider.onSliderPointerStyleChange(that);

            sisiliano.slider.onValueChange(that, that.model.value);
        }
    };

    sisiliano.linearSlider.onSliderBarStyleChange = sisiliano.linearSlider.onSliderPointerStyleChange = function (that) {
        var barCenterY = (that.model.styles.sliderBar.backgroundBar.height / 2) + that.model.styles.sliderBar.padding.top;

        that.applier.change("styles.sliderBar.valueBar.x", that.model.styles.sliderBar.padding.left);
        that.applier.change("styles.sliderBar.valueBar.y",
            barCenterY - (that.model.styles.sliderBar.valueBar.height / 2));
        that.applier.change("styles.sliderBar.valueBar.width",
            that.model.styles.controller.width - that.model.styles.sliderBar.padding.left - that.model.styles.sliderBar.padding.right);
        that.applier.change("styles.sliderBar.valueBar.height", that.model.styles.sliderBar.valueBar.height);

        that.applier.change("styles.sliderBar.backgroundBar.x", that.model.styles.sliderBar.padding.left);
        that.applier.change("styles.sliderBar.backgroundBar.y",
            barCenterY - (that.model.styles.sliderBar.backgroundBar.height / 2));
        that.applier.change("styles.sliderBar.backgroundBar.width",
            that.model.styles.controller.width - that.model.styles.sliderBar.padding.left - that.model.styles.sliderBar.padding.right);
        that.applier.change("styles.sliderBar.backgroundBar.height",
            that.model.styles.sliderBar.backgroundBar.height);
    };

    sisiliano.linearSlider.onSliderPointerLabelStyleChange = sisiliano.linearSlider.onSliderPointerStyleChange = function (that) {
        var barCenterY = (that.model.styles.sliderBar.backgroundBar.height / 2) + that.model.styles.sliderBar.padding.top;

        that.applier.change("styles.pointer.labelText.y",
            barCenterY - (that.model.styles.pointer.valuePointer.height / 2) - that.model.styles.pointer.label.padding.bottom - that.model.styles.pointer.label.margin.bottom);

        if (that.locate("valueLabel").length > 0) {
            var SVGRect = d3.select(that.locate("valueLabel").get(0))[0][0].getBBox();
            that.applier.change("styles.pointer.label.x", SVGRect.x - that.model.styles.pointer.label.padding.left);
            that.applier.change("styles.pointer.label.y", SVGRect.y - that.model.styles.pointer.label.padding.top);
            that.applier.change("styles.pointer.label.width",
                SVGRect.width + that.model.styles.pointer.label.padding.left + that.model.styles.pointer.label.padding.right);
            that.applier.change("styles.pointer.label.height",
                SVGRect.height + that.model.styles.pointer.label.padding.bottom + that.model.styles.pointer.label.padding.top);
        }
    };

    sisiliano.linearSlider.onSliderPointerStyleChange = function (that) {
        //value pointer label
        sisiliano.linearSlider.onSliderPointerLabelStyleChange(that);

        var barCenterY = (that.model.styles.sliderBar.backgroundBar.height / 2) + that.model.styles.sliderBar.padding.top;

        //Value pointer
        that.applier.change("styles.pointer.valuePointer.y", barCenterY - (that.model.styles.pointer.valuePointer.height / 2));

        //Value pointer hover
        that.applier.change("styles.pointer.valuePointerShadow.y",
            barCenterY - (that.model.styles.pointer.valuePointerShadow.height / 2));
    };
    
    sisiliano.linearSlider.onResize = function (that) {
        var sliderBarPadding = that.model.styles.sliderBar.padding;
        var styles = that.model.styles;

        //Configuring the viewBox based on the container
        var svgHeight = sliderBarPadding.top + sliderBarPadding.bottom + Math.max(styles.sliderBar.backgroundBar.height,
                styles.sliderBar.valueBar.height);

        that.applier.change("styles.controller", {
            width: null,
            height: svgHeight
        });
    };

    sisiliano.linearSlider.onStatusChange = function (that, isActive) {
        that.locate("valuePointerHover").css("display", isActive ? "block" : "none");
    };

    sisiliano.linearSlider.onValueChange = function (that, obviousValue) {
        var valueRange = that.model.size;
        var maxWidth = parseInt(that.locate("backgroundRect").attr("width"), null);
        var leftPadding = parseInt(that.locate("backgroundRect").attr("x"), null);
        var newWidth = maxWidth * (obviousValue / valueRange);

        that.applier.change("styles.sliderBar.valueBar.width", newWidth);
        that.applier.change("styles.pointer.valuePointer.x",
            newWidth + leftPadding - (that.model.styles.pointer.valuePointer.width / 2));
        that.applier.change("styles.pointer.valuePointerShadow.x",
            newWidth + leftPadding - that.model.styles.pointer.valuePointerShadow.width / 2);
        that.applier.change("styles.pointer.labelText.x", newWidth + leftPadding);

        sisiliano.linearSlider.onSliderPointerLabelStyleChange(that);
    };

    sisiliano.linearSlider.onColorChange = function (that, newColor) {
        that.applier.change("styles.sliderBar.valueBar.fill",
            that.model.styles.sliderBar.valueBar.fill || newColor[0]);
        that.applier.change("styles.sliderBar.backgroundBar.fill",
            that.model.styles.sliderBar.backgroundBar.fill || newColor[0]);
        that.applier.change("styles.pointer.label.fill",
            that.model.styles.pointer.label.fill || newColor[0]);
        that.applier.change("styles.pointer.labelText.fill",
            that.model.styles.pointer.labelText.fill || newColor[1]);
        that.applier.change("styles.pointer.valuePointer.fill",
            that.model.styles.pointer.valuePointer.fill || newColor[0]);
        that.applier.change("styles.pointer.valuePointerShadow.fill",
            that.model.styles.pointer.valuePointerShadow.fill || newColor[0]);
    };

    sisiliano.linearSlider.setValueByPosition = function (that, clickedPosition) {
        var maxWidth = parseInt(that.locate("backgroundRect").attr("width"), null);
        var leftPadding = parseInt(that.locate("valueRect").attr("x"), null) + that.model.styles.controller.x;
        var value = ((clickedPosition.x - leftPadding) / maxWidth) * that.model.size;
        if (that.model.value !== value) {
            that.applier.change("value", value + that.model.min);
        }
    };

    sisiliano.linearSlider.addListeners = function (that) {
        var mouseMoveHandler = function () {
            var position = d3.mouse(that.container.find("svg").eq(0).get(0));
            var clickedPosition = {x: position[0], y: position[1]};
            if (that.model.status.isActive) {
                sisiliano.linearSlider.setValueByPosition(that, clickedPosition);
                d3.event.preventDefault();
            }
        };

        document.addEventListener("mousemove", function (evt) {
            var svgElm = that.locate("svg");
            if (svgElm && svgElm.length > 0) {
                var svgPosition = svgElm.position();
                var svgWidth = svgElm.width();
                var clickedPosition = {x: ((evt.pageX - svgPosition.left) / svgWidth) * that.model.viewBox.width, y: 0};
                if (that.model.status.isActive) {
                    sisiliano.linearSlider.setValueByPosition(that, clickedPosition);
                    evt.preventDefault(evt);
                }
            }
        });
        document.addEventListener("mouseup", function () {
            that.applier.change("status.isActive", false);
        });

        d3.select(that.container.get(0))
            .on("touchmove", mouseMoveHandler)
            .on("mousemove", mouseMoveHandler);
    };

    sisiliano.linearSlider.getNotches = function (that) {
        //TODO define
        return that.model.rulerPoints.filter( function (value) {
            return value >= that.model.min && value <= that.model.max;
        });
    };

    sisiliano.linearSlider.drawNotches = function (that) {
        var notches = sisiliano.linearSlider.getNotches(that);
        var notchesPane = d3.select(that.locate("ruler").get(0));
        var sliderWidth = parseInt(that.locate("backgroundRect").attr("width"), null);
        var sliderX = parseInt(that.locate("backgroundRect").attr("x"), null);
        var sliderY = parseInt(that.locate("backgroundRect").attr("y"), null);
        fluid.each(notches, function (notchValue) {
            var x = sliderX + (sliderWidth * (notchValue - that.model.min) / (that.model.max - that.model.min));
            var rulerLine = notchesPane.append("rect")
                .attr("class", "sisiliano-linear-slider-ruler-line")
                .attr("fill", that.model.color[0])
                .attr("fill-opacity", 0.3)
                .attr("x", x - 0.5)
                .attr("y", sliderY);
            sisiliano.util.applyStyles(rulerLine, that.model.styles.ruler.line, ["x", "y"]);

            var rulerValue = notchesPane.append("text")
                .attr("fill", that.model.color[0])
                .attr("fill-opacity", 0.6)
                .attr("class", "sisiliano-linear-slider-ruler-value")
                .attr("text-anchor", "end")
                .attr("x", x + 0.5)
                .attr("y", sliderY + 25)
                .attr("transform","rotate(-90, " + (x + 1) + ", " + (sliderY + 25) + ")")
                .text(notchValue);
            sisiliano.util.applyStyles(rulerValue, that.model.styles.ruler.value, ["x", "y"]);
        });
    };
})(fluid);