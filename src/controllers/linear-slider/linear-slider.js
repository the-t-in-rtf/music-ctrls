(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.linearSlider", {
        gradeNames: ["sisiliano.slider"],
        defaultViewBox: [0 ,0, 500, 50],
        ariaDescription: "Linear slider, the value can be adjusted by arrow keys. If you are using the mouse, drag along the slider",
        template: "src/controllers/linear-slider/linear-slider.html",
        model: {
            styles: {
                pointer: {
                    label: {
                        padding: {
                            left: 2,
                            right: 2,
                            top: 2,
                            bottom: 2
                        },
                        margin: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 10
                        }
                    },
                    labelText: {
                        "font-size": "10px"
                    },
                    value: {
                        width: 20,
                        height: 20,
                        rx: "10",
                        ry: "10"
                    },
                    valueShadow: {
                        width: 30,
                        height: 30,
                        rx: "15",
                        ry: "15"
                    }
                },
                ruler: {
                    line: {
                        width: 1,
                        height: 20
                    },
                    value: {
                        "font-size": "10px"
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
                        left: 40,
                        right: 40,
                        top: 40,
                        bottom: 40
                    }
                }
            },
            rulerPoints: [0,  20, 30, 40, 50, 60, 70, 80, 90, 100],
            viewBox: {
                width: 500,
                height: 100
            },
            orientation: "vertical", // vertical or horizontal
            title: "linearSlider Controller",
            description: ""
        },
        selectors: {
            controller: ".sisiliano",
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
            "viewBox.*": {
                func: "sisiliano.linearSlider.onViewBoxChange",
                args: ["{that}", "{that}.model.viewBox"]
            },
            "styles.*": {
                func: "sisiliano.linearSlider.onSliderStyleChange",
                args: ["{that}", "{that}.model.styles"]
            }
        }
    });

    sisiliano.linearSlider.onSliderStyleChange = function (that) {
        sisiliano.linearSlider.onSliderBarStyleChange(that);
        sisiliano.linearSlider.drawNotches(that);

        sisiliano.linearSlider.onSliderPointerStyleChange(that);


        sisiliano.slider.onValueChange(that, that.model.value);
    };

    sisiliano.linearSlider.onSliderBarStyleChange = sisiliano.linearSlider.onSliderPointerStyleChange = function (that) {
        var barCenterY = (that.model.styles.sliderBar.backgroundBar.height / 2) + that.model.styles.sliderBar.padding.top;

        sisiliano.util.applyStyles(that.locate("valueRect"), that.model.styles.sliderBar.valueBar, ["x", "y", "width"]);
        that.locate("valueRect")
            .attr("x", that.model.styles.sliderBar.padding.left)
            .attr("y", barCenterY - (that.model.styles.sliderBar.valueBar.height / 2))
            .attr("width", that.model.viewBox.width - that.model.styles.sliderBar.padding.left - that.model.styles.sliderBar.padding.right)
            .attr("height", that.model.styles.sliderBar.valueBar.height);

        sisiliano.util.applyStyles(that.locate("backgroundRect"), that.model.styles.sliderBar.backgroundBar,
            ["x", "y", "width"]);
        that.locate("backgroundRect")
            .attr("x", that.model.styles.sliderBar.padding.left)
            .attr("y", barCenterY - (that.model.styles.sliderBar.backgroundBar.height / 2))
            .attr("width", that.model.viewBox.width - that.model.styles.sliderBar.padding.left - that.model.styles.sliderBar.padding.right)
            .attr("height", that.model.styles.sliderBar.backgroundBar.height);
    };

    sisiliano.linearSlider.onSliderPointerLabelStyleChange = sisiliano.linearSlider.onSliderPointerStyleChange = function (that) {
        var barCenterY = (that.model.styles.sliderBar.backgroundBar.height / 2) + that.model.styles.sliderBar.padding.top;

        sisiliano.util.applyStyles(that.locate("valueLabel"), that.model.styles.pointer.labelText, ["y"]);
        that.locate("valueLabel")
            .attr(
                "y",
                barCenterY - (that.model.styles.pointer.value.height / 2) - that.model.styles.pointer.label.padding.bottom - that.model.styles.pointer.label.margin.bottom
            );

        sisiliano.util.applyStyles(that.locate("valueLabelRect"), that.model.styles.pointer.label,
            ["x", "y", "width", "height"]);
        if (that.locate("valueLabel").length > 0) {
            var SVGRect = d3.select(that.locate("valueLabel").get(0))[0][0].getBBox();
            that.locate("valueLabelRect")
                .attr("x", SVGRect.x - that.model.styles.pointer.label.padding.left)
                .attr("y", SVGRect.y - that.model.styles.pointer.label.padding.top)
                .attr("width", SVGRect.width + that.model.styles.pointer.label.padding.left + that.model.styles.pointer.label.padding.right)
                .attr("height", SVGRect.height + that.model.styles.pointer.label.padding.bottom + that.model.styles.pointer.label.padding.top);
        }
    };

    sisiliano.linearSlider.onSliderPointerStyleChange = function (that) {
        //value pointer label
        sisiliano.linearSlider.onSliderPointerLabelStyleChange(that);

        var barCenterY = (that.model.styles.sliderBar.backgroundBar.height / 2) + that.model.styles.sliderBar.padding.top;

        //Value pointer
        sisiliano.util.applyStyles(that.locate("valuePointer"), that.model.styles.pointer.value,
            ["width", "height", "x", "y", "rx", "ry"]);
        that.locate("valuePointer")
            .attr("width", that.model.styles.pointer.value.width)
            .attr("height", that.model.styles.pointer.value.height)
            .attr("y", barCenterY - (that.model.styles.pointer.value.height / 2))
            .attr("rx", that.model.styles.pointer.value.rx)
            .attr("ry", that.model.styles.pointer.value.ry);

        //Value pointer hover
        sisiliano.util.applyStyles(that.locate("valuePointerHover"), that.model.styles.pointer.valueShadow,
            ["width", "height", "x", "y", "rx", "ry"]);
        that.locate("valuePointerHover")
            .attr("width", that.model.styles.pointer.valueShadow.width)
            .attr("height", that.model.styles.pointer.valueShadow.height)
            .attr("y", barCenterY - (that.model.styles.pointer.valueShadow.height / 2))
            .attr("rx", that.model.styles.pointer.valueShadow.rx)
            .attr("ry", that.model.styles.pointer.valueShadow.ry);
    };

    sisiliano.linearSlider.onViewBoxChange = function (that, viewBox) {
        var sliderBarPadding = that.model.styles.sliderBar.padding;
        d3.select(that.locate("svg").get(0)).attr("viewBox", "0 0 " + viewBox.width + " " + viewBox.height);
        that.applier.change("styles.sliderBar.backgroundBar.width",
            viewBox.width - sliderBarPadding.left - sliderBarPadding.right);
    };
    
    sisiliano.linearSlider.onResize = function (that) {
        var sliderBarPadding = that.model.styles.sliderBar.padding;
        var styles = that.model.styles;

        //Configuring the viewBox based on the container
        var svgHeight = sliderBarPadding.left + sliderBarPadding.right + Math.max(styles.sliderBar.backgroundBar.height,
                styles.sliderBar.valueBar.height);
        var containerHeight = that.container.height();
        var containerWidth = that.container.width();
        var svgWidth = (containerWidth / containerHeight) * svgHeight;
        that.applier.change("viewBox", {
            width: svgWidth,
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
        that.locate("valueRect").attr("width", newWidth);
        that.locate("valuePointer").attr("x", newWidth + leftPadding - (that.model.styles.pointer.value.width / 2));
        that.locate("valuePointerHover").attr("x", newWidth + leftPadding - that.model.styles.pointer.valueShadow.width / 2);
        that.locate("valueLabel").attr("x", newWidth + leftPadding);

        sisiliano.linearSlider.onSliderPointerLabelStyleChange(that);
    };

    sisiliano.linearSlider.onColorChange = function (that, newColor) {
        that.locate("rects").attr("fill", newColor[0]);
        that.locate("valueLabelRect").attr("fill", newColor[0]);
        that.locate("valueLabel").attr("fill", newColor[1]);
        that.locate("valuePointer").attr("fill", newColor[0]);
        that.locate("valuePointerHover").attr("fill", newColor[0]);
    };

    sisiliano.linearSlider.setValueByPosition = function (that, clickedPosition) {
        var maxWidth = parseInt(that.locate("backgroundRect").attr("width"), null);
        var leftPadding = parseInt(that.locate("valueRect").attr("x"), null);
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