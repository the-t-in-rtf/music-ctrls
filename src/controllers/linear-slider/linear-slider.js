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
                        "font-size": "10px"
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
        }
    });

    sisiliano.linearSlider.onStatusChange = function (that, isActive) {
        that.locate("valuePointerHover").css("display", isActive ? "block" : "none");
    };

    sisiliano.linearSlider.onValueChange = function (that, obviousValue) {
        var valueRange = that.model.size;
        var maxWidth = parseInt(that.locate("backgroundRect").attr("width"), null);
        var leftPadding = parseInt(that.locate("backgroundRect").attr("x"), null);
        var newWidth = maxWidth * (obviousValue / valueRange);
        that.locate("valueRect").attr("width", newWidth);
        that.locate("valueLabelRect").attr("x", newWidth + leftPadding - 25);
        that.locate("valuePointer").attr("x", newWidth + leftPadding - 8);
        that.locate("valuePointerHover").attr("x", newWidth + leftPadding - 13);
        that.locate("valueLabel").attr("x", newWidth + 3 + leftPadding - 25);
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
        return that.model.rulerPoints;
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
            sisiliano.util.applyStyles(rulerLine, that.model.styles.ruler.line);

            var rulerValue = notchesPane.append("text")
                .attr("fill", that.model.color[0])
                .attr("fill-opacity", 0.6)
                .attr("class", "sisiliano-linear-slider-ruler-value")
                .attr("text-anchor", "end")
                .attr("x", x + 0.5)
                .attr("y", sliderY + 25)
                .attr("transform","rotate(-90, " + (x + 1) + ", " + (sliderY + 25) + ")")
                .text(notchValue);
            sisiliano.util.applyStyles(rulerValue, that.model.styles.ruler.value);
        });
    };
})(fluid);