(function(fluid) {
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

    fluid.sisiliano.knob.onValueChange = function(that, newValue) {
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

    fluid.sisiliano.knob.onColorChange = function(that, newColor) {
        that.locate("valueRing").css("stroke", newColor);
        that.locate("knobBackgroundCircle").css("stroke", newColor);
        that.locate("valueRing").css("fill", newColor);
        that.locate("knobBackgroundCircle").css("fill", newColor);
        that.locate("valueLabel").css("fill", newColor);
    };

    fluid.sisiliano.knob.initOptions = function(that, model, input) {
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

        /**
         * TODO add touch events
         * https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
         *
         * function startup() {
              var el = document.getElementsByTagName("canvas")[0];
              el.addEventListener("touchstart", handleStart, false);
              el.addEventListener("touchend", handleEnd, false);
              el.addEventListener("touchcancel", handleCancel, false);
              el.addEventListener("touchmove", handleMove, false);
              log("initialized.");
            }
         */

        that.container.bind("keydown", function(evt) {
            if (evt.keyCode === 38) {
                that.applier.change("value", that.model.value + 1);
                return false;
            } else if (evt.keyCode === 40) {
                that.applier.change("value", that.model.value - 1);
                return false;
            } else {
                return;
            }
        });

        that.container.bind("mousemove", ".knob-circle", function(evt) {
            if (that.model.status.mousedown) {
                if (that.model.status.prev.pageY > evt.pageY) {
                    that.applier.change("value", that.model.value + 1);
                } else if(that.model.status.prev.pageY < evt.pageY) {
                    that.applier.change("value", that.model.value - 1);
                }
            }

            that.applier.change("status.prev", {pageX: evt.pageX, pageY: evt.pageY});
        });


        /**
         Mouse wheel event
         Ref : http://stackoverflow.com/questions/8189840/get-mouse-wheel-events-in-jquery
         */
        //Firefox
        that.container.bind("mousewheel", ".knob-circle", function(e){
            if (that.model.status.mousedown) {
                if (e.originalEvent.wheelDelta < 0) {
                    //scroll down
                    that.applier.change("value", that.model.value - 1);
                } else {
                    //scroll up
                    that.applier.change("value", that.model.value + 1);
                }
            }

            //prevent page fom scrolling
            return false;
        });

        //IE, Opera, Safari
        that.container.bind("DOMMouseScroll", ".knob-circle", function(e){
            if (e.originalEvent.wheelDelta < 0) {
                //scroll down
                that.applier.change("value", that.model.value - 1);
            } else {
                //scroll up
                that.applier.change("value", that.model.value + 1);
            }

            //prevent page fom scrolling
            return false;
        });

        that.container.bind("mousedown", ".knob-circle", function(evt) {
            that.applier.change("status.mousedown", true);
            that.applier.change("status.prev", {pageX: evt.pageX, pageY: evt.pageY});
        });

        that.container.bind("mouseup mouseleave", ".knob-circle", function() {
            that.applier.change("status.mousedown", false);
        });

        that.container.bind("focusout blur", "knob-circle", function() {
            that.applier.change("status.mousedown", false);
        });
    };

})(fluid);