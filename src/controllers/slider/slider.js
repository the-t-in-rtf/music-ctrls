(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.slider", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            min: 0,
            max: 100,
            color: "#009688",
            value: null,
            size: 100,
            tickValue: 1,
            status: {
                isActive: false
            },
            formatValue: function (value) {
                return Math.round(value * 100) / 100.0;
            },
            title: "Abstract Slider Controoler",
            description: "Abstract slider component"
        },
        selectors: {
            controller: ".sisiliano",
            svg: "svg",
            valueLabel: ".sisiliano-slider-value-text"
        },
        events: {
            onCreate: null,
            onReady: null,
            onChange: null,
            onColorChange: null,
            onValueChange: null,
            onStatusChange: null
        },
        listeners: {
            onCreate: {
                func: "sisiliano.slider.validateInputs",
                args: ["{that}"]
            },
            onReady: [
                {
                    func: "{that}.events.onColorChange.fire",
                    args: ["{that}", "{that}.model.color"]
                },
                {
                    func: "sisiliano.slider.onMinValueChange",
                    args: ["{that}", "{that}.model.min"]
                },
                {
                    func: "sisiliano.slider.onMaxValueChange",
                    args: ["{that}", "{that}.model.max"]
                }
            ]
        },
        modelListeners: {
            "value": {
                func: "sisiliano.slider.onValueChange",
                args: ["{that}", "{that}.model.value"]
            },
            "formatValue": {
                func: "sisiliano.slider.onValueChange",
                args: ["{that}", "{that}.model.value"]
            },
            "color": {
                func: "{that}.events.onColorChange.fire",
                args: ["{that}", "{that}.model.color"]
            },
            "min": {
                func: "sisiliano.slider.onMinValueChange",
                args: ["{that}", "{that}.model.min"]
            },
            "max": {
                func: "sisiliano.slider.onMaxValueChange",
                args: ["{that}", "{that}.model.max"]
            },
            "status.isActive": {
                func: "sisiliano.knob.onStatusChange",
                args: ["{that}", "{that}.model.status.isActive"]
            }
        }
    });

    sisiliano.slider.onMinValueChange = function (that, min) {
        that.locate("controller").attr("aria-valuemin", min);
        that.applier.change("size", sisiliano.slider.getSize(that));
        sisiliano.slider.onValueChange(that, that.model.value);
    };

    sisiliano.slider.onMaxValueChange = function (that, max) {
        that.locate("controller").attr("aria-valuemax", max);
        that.applier.change("size", sisiliano.slider.getSize(that));
        sisiliano.slider.onValueChange(that, that.model.value);
    };

    sisiliano.slider.onValueChange = function (that, newValue) {
        if (typeof newValue !== "number") {
            sisiliano.slider.updateTheValueInUI(that, that.model.min);
        } if (newValue < that.model.min) {
            newValue = that.model.min;
            that.applier.change("value", newValue);
        } else if (newValue > that.model.max) {
            newValue = that.model.max;
            that.applier.change("value", newValue);
        } else {
            sisiliano.slider.updateTheValueInUI(that, newValue);
        }
    };

    sisiliano.slider.updateTheValueInUI = function (that, newValue) {
        var formatedValue = newValue;
        if (that.model.formatValue && typeof that.model.formatValue === "function") {
            formatedValue = that.model.formatValue(newValue);
        }

        //Update the aria-valuenow
        that.locate("controller").attr("aria-valuenow", formatedValue);

        //Update the value in the UI
        that.locate("valueLabel").text(formatedValue);
        that.events.onValueChange.fire(that, sisiliano.slider.getObviousValue(that, that.model.value));
    };

    sisiliano.slider.validateInputs = function (that) {
        //TODO modified according to the standards of infusion
        if (that.model.min >= that.model.max) {
            throw new Error("Min should be less than max");
        }
    };

    sisiliano.slider.getSize = function (that) {
        return Math.abs(that.model.max - that.model.min);
    };

    sisiliano.slider.getValue = function (that) {
        if (typeof that.model.value === "number") {
            return that.model.value;
        } else {
            return that.model.min;
        }
    };

    sisiliano.slider.getObviousValue = function (that, value) {
        return value - that.model.min;
    };
})(fluid);