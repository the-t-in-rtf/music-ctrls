/*! sisiliano - v1.0.0 - 2016-06-22 

*/var htmlTempl = htmlTempl || {};
htmlTempl["templates"] = {"src/controllers/knob/knob.html":"<div tabindex=\"0\" class=\"sisiliano\" role=\"slider\" aria-label=\"Ring Slider\" aria-valuemax=\"100\" aria-valuemin=\"0\">\r\n    <svg\r\n            xmlns:osb=\"http://www.openswatchbook.org/uri/2009/osb\"\r\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n            xmlns:cc=\"http://creativecommons.org/ns#\"\r\n            xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n            xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n            xmlns=\"http://www.w3.org/2000/svg\"\r\n            xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\r\n            viewBox=\"0 0 300 300\"\r\n            width=\"100%\"\r\n            height=\"100%\"\r\n            class=\"sisiliano-knob\">\r\n        <defs\r\n                id=\"defs4\">\r\n            <filter\r\n                    style=\"color-interpolation-filters:sRGB;\"\r\n                    id=\"filter6244\">\r\n                <feFlood\r\n                        flood-opacity=\"0.4\"\r\n                        flood-color=\"black\"\r\n                        result=\"flood\"\r\n                        id=\"feFlood6246\" />\r\n                <feComposite\r\n                        in=\"flood\"\r\n                        in2=\"SourceGraphic\"\r\n                        operator=\"in\"\r\n                        result=\"composite1\"\r\n                        id=\"feComposite6248\" />\r\n                <feGaussianBlur\r\n                        in=\"composite1\"\r\n                        stdDeviation=\"3\"\r\n                        result=\"blur\"\r\n                        id=\"feGaussianBlur6250\" />\r\n                <feOffset\r\n                        dx=\"-1\"\r\n                        dy=\"1\"\r\n                        result=\"offset\"\r\n                        id=\"feOffset6252\" />\r\n                <feComposite\r\n                        in=\"SourceGraphic\"\r\n                        in2=\"offset\"\r\n                        operator=\"over\"\r\n                        result=\"composite2\"\r\n                        id=\"feComposite6254\" />\r\n            </filter>\r\n            <filter\r\n                    style=\"color-interpolation-filters:sRGB;\"\r\n                    id=\"filter6245\">\r\n                <feFlood\r\n                        flood-opacity=\"0.5\"\r\n                        flood-color=\"black\"\r\n                        result=\"flood\"\r\n                        id=\"feFlood6246\" />\r\n                <feComposite\r\n                        in=\"flood\"\r\n                        in2=\"SourceGraphic\"\r\n                        operator=\"in\"\r\n                        result=\"composite1\"\r\n                        id=\"feComposite6248\" />\r\n                <feGaussianBlur\r\n                        in=\"composite1\"\r\n                        stdDeviation=\"3.5\"\r\n                        result=\"blur\"\r\n                        id=\"feGaussianBlur6250\" />\r\n                <feOffset\r\n                        dx=\"2\"\r\n                        dy=\"-2\"\r\n                        result=\"offset\"\r\n                        id=\"feOffset6252\" />\r\n                <feComposite\r\n                        in=\"SourceGraphic\"\r\n                        in2=\"offset\"\r\n                        operator=\"over\"\r\n                        result=\"composite2\"\r\n                        id=\"feComposite6254\" />\r\n            </filter>\r\n        </defs>\r\n\r\n        <style>\r\n            .sisiliano-knob-circle {\r\n                filter: url(\"#filter6244\");\r\n            }\r\n            .sisiliano-border, .sisiliano:focus .sisiliano-knob-circle {\r\n                filter: url(\"#filter6245\");\r\n            }\r\n        </style>\r\n\r\n        <g style=\"display:inline\">\r\n            <circle\r\n                    class=\"sisiliano-border\"\r\n                    r=\"147\" cx=\"150\"\r\n                    cy=\"150\">\r\n            </circle>\r\n            <circle\r\n                    class=\"sisiliano-knob-circle sisiliano-knob-background-circle\"\r\n                    id=\"circle5634\"\r\n                    r=\"130\"\r\n                    cx=\"150\"\r\n                    cy=\"150\"/>\r\n            <text xmlns=\"http://www.w3.org/2000/svg\" x=\"40\" y=\"170\"\r\n                  role=\"alert\" aria-live=\"assertive\"\r\n                  class=\"unselectable sisiliano-knob-value-text\">\r\n                100%\r\n            </text>\r\n            <circle\r\n                    class=\"sisiliano-knob-circle sisiliano-knob-value-circle\"\r\n                    fill=\"transparent\"\r\n                    id=\"circle5636\"\r\n                    r=\"130\"\r\n                    cx=\"150\"\r\n                    cy=\"150\"\r\n                    stroke-width=\"20\"/>\r\n        </g>\r\n    </svg>\r\n</div>","src/controllers/piano/piano.html":"<div tabindex=\"0\" class=\"sisiliano\" role=\"slider\" aria-label=\"Piano\" id=\"{{id}}\">\r\n    <svg\r\n            xmlns:osb=\"http://www.openswatchbook.org/uri/2009/osb\"\r\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\r\n            xmlns:cc=\"http://creativecommons.org/ns#\"\r\n            xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n            xmlns:svg=\"http://www.w3.org/2000/svg\"\r\n            xmlns=\"http://www.w3.org/2000/svg\"\r\n            xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\r\n            class=\"sisiliano-piano\"\r\n            width=\"100%\"\r\n            height=\"100%\"\r\n            viewBox=\"0 0 {{viewBox.width}} {{viewBox.height}}\">\r\n        <defs\r\n                id=\"defs4\">\r\n            <filter\r\n                    style=\"color-interpolation-filters:sRGB;\"\r\n                    id=\"filter6244\">\r\n                <feFlood\r\n                        flood-opacity=\"0.5\"\r\n                        flood-color=\"black\"\r\n                        result=\"flood\"\r\n                        id=\"feFlood6246\"/>\r\n                <feComposite\r\n                        in=\"flood\"\r\n                        in2=\"SourceGraphic\"\r\n                        operator=\"in\"\r\n                        result=\"composite1\"\r\n                        id=\"feComposite6248\"/>\r\n                <feGaussianBlur\r\n                        in=\"composite1\"\r\n                        stdDeviation=\"3\"\r\n                        result=\"blur\"\r\n                        id=\"feGaussianBlur6250\"/>\r\n                <feOffset\r\n                        dx=\"0\"\r\n                        dy=\"1\"\r\n                        result=\"offset\"\r\n                        id=\"feOffset6252\"/>\r\n                <feComposite\r\n                        in=\"SourceGraphic\"\r\n                        in2=\"offset\"\r\n                        operator=\"over\"\r\n                        result=\"composite2\"\r\n                        id=\"feComposite6254\"/>\r\n            </filter>\r\n            <filter\r\n                    style=\"color-interpolation-filters:sRGB;\"\r\n                    id=\"filter6245\">\r\n                <feFlood\r\n                        flood-opacity=\"0.5\"\r\n                        flood-color=\"black\"\r\n                        result=\"flood\"\r\n                        id=\"feFlood6246\"/>\r\n                <feComposite\r\n                        in=\"flood\"\r\n                        in2=\"SourceGraphic\"\r\n                        operator=\"in\"\r\n                        result=\"composite1\"\r\n                        id=\"feComposite6248\"/>\r\n                <feGaussianBlur\r\n                        in=\"composite1\"\r\n                        stdDeviation=\"8\"\r\n                        result=\"blur\"\r\n                        id=\"feGaussianBlur6250\"/>\r\n                <feOffset\r\n                        dx=\"-3\"\r\n                        dy=\"3.5\"\r\n                        result=\"offset\"\r\n                        id=\"feOffset6252\"/>\r\n                <feComposite\r\n                        in=\"SourceGraphic\"\r\n                        in2=\"offset\"\r\n                        operator=\"over\"\r\n                        result=\"composite2\"\r\n                        id=\"feComposite6254\"/>\r\n            </filter>\r\n            <filter\r\n                    style=\"color-interpolation-filters:sRGB;\"\r\n                    id=\"filter6245\">\r\n                <feFlood\r\n                        flood-opacity=\"0.5\"\r\n                        flood-color=\"black\"\r\n                        result=\"flood\"\r\n                        id=\"feFlood6246\"/>\r\n                <feComposite\r\n                        in=\"flood\"\r\n                        in2=\"SourceGraphic\"\r\n                        operator=\"in\"\r\n                        result=\"composite1\"\r\n                        id=\"feComposite6248\"/>\r\n                <feGaussianBlur\r\n                        in=\"composite1\"\r\n                        stdDeviation=\"3.5\"\r\n                        result=\"blur\"\r\n                        id=\"feGaussianBlur6250\"/>\r\n                <feOffset\r\n                        dx=\"2\"\r\n                        dy=\"-2\"\r\n                        result=\"offset\"\r\n                        id=\"feOffset6252\"/>\r\n                <feComposite\r\n                        in=\"SourceGraphic\"\r\n                        in2=\"offset\"\r\n                        operator=\"over\"\r\n                        result=\"composite2\"\r\n                        id=\"feComposite6254\"/>\r\n            </filter>\r\n        </defs>\r\n\r\n        <style>\r\n            /* These styles have been added seperately as a fix for firefox and IE */\r\n            #{{id}}.sisiliano .sisiliano-piano .sisiliano-piano-white-key {\r\n                filter: url('#filter6244');\r\n            }\r\n\r\n            #{{id}}.sisiliano .sisiliano-piano .sisiliano-piano-black-key {\r\n                filter: url('#filter6244');\r\n            }\r\n\r\n            #{{id}}.sisiliano-border {\r\n                filter: url(\"#filter6245\");\r\n            }\r\n\r\n            #{{id}}.sisiliano .sisiliano-piano .sisiliano-piano-key-pressed,\r\n            #{{id}}.sisiliano .sisiliano-piano .sisiliano-piano-white-key:hover,\r\n            #{{id}}.sisiliano .sisiliano-piano .sisiliano-piano-black-key:hover,\r\n            #{{id}}.sisiliano .sisiliano-piano .sisiliano-piano-key-inactive:hover {\r\n                fill: {{color}};\r\n                stroke: {{color}};\r\n            }\r\n        </style>\r\n        <g style=\"display:inline\">\r\n            <rect\r\n                    class=\"sisiliano-border\"\r\n                    height=\"{{keyBoard.border.height}}\"\r\n                    width=\"{{keyBoard.border.width}}\"\r\n                    x=\"{{keyBoard.border.x}}\"\r\n                    y=\"{{keyBoard.border.y}}\"/>\r\n            {{#each keyBoard.whiteKeys}}\r\n            <rect\r\n                    index=\"{{index}}\"\r\n                    class=\"sisiliano-piano-key sisiliano-piano-white-key\"\r\n                    height=\"{{height}}\"\r\n                    width=\"{{width}}\"\r\n                    x=\"{{x}}\"\r\n                    y=\"{{y}}\"/>\r\n            {{/each}}\r\n            {{#each keyBoard.blackKeys}}\r\n            <rect\r\n                    index=\"{{index}}\"\r\n                    class=\"sisiliano-piano-key sisiliano-piano-black-key\"\r\n                    height=\"{{height}}\"\r\n                    width=\"{{width}}\"\r\n                    x=\"{{x}}\"\r\n                    y=\"{{y}}\"/>\r\n            {{/each}}\r\n        </g>\r\n\r\n        <!--<g style=\"display:inline\">\r\n          <rect\r\n            class=\"sisiliano-piano-key sisiliano-piano-disabledArea\"\r\n            height=\"{{disabledArea.left.height}}\"\r\n            width=\"{{disabledArea.left.width}}\"\r\n            x=\"{{disabledArea.left.x}}\"\r\n            y=\"{{disabledArea.left.y}}\" />\r\n          <rect\r\n            class=\"sisiliano-piano-key sisiliano-piano-disabledArea\"\r\n            height=\"{{disabledArea.right.height}}\"\r\n            width=\"{{disabledArea.right.width}}\"\r\n            x=\"{{disabledArea.right.x}}\"\r\n            y=\"{{disabledArea.right.y}}\" />\r\n        </g>-->\r\n    </svg>\r\n</div>\r\n"};
(function (fluid) {
    "use strict";

    fluid.registerNamespace("sisiliano");

    sisiliano.templates = htmlTempl.templates;



    fluid.registerNamespace("sisiliano.util");
    sisiliano.util.templateCache = {};
    sisiliano.util.getTemplate = function (callback, url) {
        var template = sisiliano.util.templateCache[url];
        if (!template) {
            var source = htmlTempl.templates[url];
            template = Handlebars.compile(source);
            sisiliano.util.templateCache[url] = template;
            callback(template);
        } else {
            callback(template);
        }
    };

    sisiliano.util.addClass = function(elm, className) {
        sisiliano.util.removeClass(elm, className);
        var oldClass = $(elm).attr("class");
        var newClass = oldClass + " " + className;
        $(elm).attr("class", newClass);
    };

    sisiliano.util.removeClass = function(elm, className) {
        var oldClass = $(elm).attr("class");
        var newClass = oldClass.replace(new RegExp(" " + className, "g"), "").replace(new RegExp(className, "g"), "");
        $(elm).attr("class", newClass);
    };

    sisiliano.util.getAngle = function(center, point) {
        var angle = Math.atan(Math.abs((point.x - center.x) / (point.y - center.y))) / (2 * Math.PI);
        if (center.x > point.x) {
            if (center.y > point.y) {
                angle = 0.5 - angle;
            }
        } else {
            if (center.y < point.y) {
                angle = 0.5 - angle;
            }

            angle += 0.5;
        }

        return angle;
    };

    sisiliano.util.isInsideTheCircle = function(center, radius, point) {
        var distanceFromTheCenter = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
        return distanceFromTheCenter <= radius;
    };
})(fluid);

(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.knob", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            color: "#009688",
            value: 0,
            status: {
                isActive: false
            }
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

    sisiliano.knob.initOptions = function (that, model, input) {
        for (var key in model) {
            if (input[key] !== undefined) {
                that.applier.change(key, input[key]);
            }
        }

        sisiliano.knob.onColorChange(that, that.model.color);
        sisiliano.knob.onValueChange(that, that.model.value);
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
            sisiliano.knob.initOptions(that, that.model, that.options);
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
(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.piano", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            color: "",
            keyBoard: {
                keys: [],
                length: 36,
                start: 0,
                whiteKey: {
                    width: 40,
                    height: 150
                },
                blackKey: {
                    width: 27,
                    height: 100
                },
                padding: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20
                },
                border: {
                    x: 0,
                    y: 0,
                    width: 600,
                    height: 170
                },
                borderPadding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            viewBox: {
                width: 600,
                height: 170
            },
            activeArea: {
                start: 0,
                end: 10
            }
        },
        events: {
            onChange: null,
            onKeyPress: null,
            onKeyRelease: null
        },
        selectors: {
            root: ".sisiliano",
            keyBoard: ".key-board",
            whiteKeys: ".white-key",
            blackKeys: ".black-key",
            key: ".key"
        },
        listeners: {
            onCreate: {
                func: "sisiliano.piano.onCreate",
                args: ["{that}", "{that}.dom.keyBoard"]
            }
        },
        modelListeners: {
            "viewBox": {
                func: "sisiliano.piano.onChange",
                args: ["{that}", "{change}"]
            },
            "activeArea.end": {
                func: "sisiliano.piano.onChangeActiveArea",
                args: ["{that}", "{that}.model.keyBoard.keys", "{that}.model.activeArea"]
            },
            "keyBoard.keys": {
                func: "sisiliano.piano.onKeysChange",
                args: ["{that}", "{that}.model.keyBoard.keys"]
            }
        }
    });

    sisiliano.piano.onChange = function () {
    };

    sisiliano.piano.onChangeActiveArea = function (that, keys, activeArea) {
        var allocatedComputerKeysForThePiano = [81, 65, 87, 83, 69, 68, 82, 70, 84, 71, 89, 72,
            85, 74, 73, 75, 79, 76, 80, 186, 219, 222, 221];

        var whiteKeys = sisiliano.piano.getWhiteKeys(keys);

        if (whiteKeys.length > 0) {
            var activeStartIndex = whiteKeys[activeArea.start].index;
            var activeEndIndex = whiteKeys[activeArea.end].index;

            if (activeStartIndex > 0) {
                var previousKey = keys[activeStartIndex - 1];
                if (previousKey.color === "BLACK") {
                    activeStartIndex--;
                }
            }

            if (activeEndIndex < keys.length - 1) {
                var nextKey = keys[activeEndIndex + 1];
                if (nextKey.color === "BLACK") {
                    activeEndIndex++;
                }
            }

            var allocatedKeyIndex = 0;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                key.isActive = i >= activeStartIndex && i <= activeEndIndex;

                if (key.isActive && allocatedKeyIndex === 0 && key.color === "WHITE") {
                    allocatedKeyIndex++;
                }

                if (allocatedKeyIndex > 1 && key.color === "WHITE" && keys[i - 1].color === "WHITE") {
                    allocatedKeyIndex++;
                }

                if (key.isActive) {
                    key.keyCode = allocatedComputerKeysForThePiano[allocatedKeyIndex];
                    allocatedKeyIndex++;
                } else {
                    key.keyCode = null;
                }
            }

        }

        //TODO fix
        //that.applier.change("keyBoard.keys", keys);
        sisiliano.piano.onKeysChange(that, keys);
        sisiliano.piano.clearPressedNodes(that);
    };

    sisiliano.piano.onKeysChange = function (that, keys) {
        d3.select(that.container.get(0)).selectAll(".sisiliano-piano-key").each(function () {
            var key = sisiliano.piano.getElementKey(d3.select(this), keys);
            sisiliano.piano.updateKey(that, key, d3.select(this));
        });
    };

    sisiliano.piano.getElementKey = function (element, keys) {
        return keys[element.attr("index")];
    };

    sisiliano.piano.onCreate = function (that) {
        sisiliano.piano.generateKeyboard(that);
        sisiliano.piano.refresh(that);
        sisiliano.piano.appendListeners(that);
    };

    sisiliano.piano.refresh = function (that) {
        sisiliano.util.getTemplate(function (template) {
            that.model.id = "fluid-sisiliano-id-" + that.id;
            that.model.keyBoard.whiteKeys = sisiliano.piano.getWhiteKeys(that.model.keyBoard.keys);
            that.model.keyBoard.blackKeys = sisiliano.piano.getBlackKeys(that.model.keyBoard.keys);
            var html = template(that.model);
            that.container.html(html);

            sisiliano.piano.onChangeActiveArea(that, that.model.keyBoard.keys, that.model.activeArea);
        }, "src/controllers/piano/piano.html");
    };

    sisiliano.piano.moveTabBy = function (that, increaseBy) {
        if (increaseBy) {
            var newActiveArea = {
                start: that.model.activeArea.start + increaseBy,
                end: that.model.activeArea.end + increaseBy
            };
            var whiteKeys = sisiliano.piano.getWhiteKeys(that.model.keyBoard.keys);
            var isValid = newActiveArea.start >= 0 && newActiveArea.start < whiteKeys.length &&
                newActiveArea.end >= 0 && newActiveArea.end < whiteKeys.length &&
                newActiveArea.start < newActiveArea.end;
            if (isValid) {
                that.applier.change("activeArea", newActiveArea);
            }
        }
    };

    sisiliano.piano.clearPressedNodes = function (that) {
        for (var i = 0; i < that.model.keyBoard.keys.length; i++) {
            var key = that.model.keyBoard.keys[i];
            key.isPressed = false;
            sisiliano.piano.updateKey(that, key);
            sisiliano.piano.releaseKey(that, key);
        }
    };

    sisiliano.piano.appendListeners = function (that) {
        var mouseDown = false;

        d3.select(document).on("mouseup", function () {
            mouseDown = false;
        });

        var keyPressHandler = function () {
            mouseDown = true;
            var clickedIndex = d3.select(this).attr("index");
            var clickedKey = that.model.keyBoard.keys[clickedIndex];
            if (mouseDown && !clickedKey.isPressed) {
                clickedKey.isPressed = true;
                sisiliano.piano.updateKey(that, clickedKey);
                sisiliano.piano.playKey(that, clickedKey);
            }
        };

        var keyOverHandler = function () {
            var clickedIndex = d3.select(this).attr("index");
            var clickedKey = that.model.keyBoard.keys[clickedIndex];
            if (mouseDown && !clickedKey.isPressed) {
                clickedKey.isPressed = true;
                sisiliano.piano.updateKey(that, clickedKey);
                sisiliano.piano.playKey(that, clickedKey);
            }

            d3.event.preventDefault();
        };

        var keyUpHandler = function () {
            mouseDown = false;
            var clickedIndex = d3.select(this).attr("index");
            var clickedKey = that.model.keyBoard.keys[clickedIndex];

            clickedKey.isPressed = false;
            sisiliano.piano.updateKey(that, clickedKey);
            sisiliano.piano.releaseKey(that, clickedKey);
        };

        var keyMoveOutHndler = function () {
            var clickedIndex = d3.select(this).attr("index");
            var clickedKey = that.model.keyBoard.keys[clickedIndex];

            clickedKey.isPressed = false;
            sisiliano.piano.updateKey(that, clickedKey);
            sisiliano.piano.releaseKey(that, clickedKey);

            d3.event.preventDefault();
        };

        d3.select(that.container.get(0)).selectAll(".sisiliano-piano-key")
            .on("mousedown", keyPressHandler)
            .on("touchstart", keyPressHandler)
            .on("mouseover", keyOverHandler)
            .on("touchmove", keyOverHandler)
            .on("mouseup", keyUpHandler)
            .on("touchend", keyUpHandler)
            .on("touchcancel", keyMoveOutHndler)
            .on("mouseleave", keyMoveOutHndler);

        d3.select(that.container.get(0)).on("keydown", function () {
            var keyCode = d3.event.keyCode;
            var mappedPianoKey = sisiliano.piano.getKeyByComputerKeyCode(keyCode, that.model.keyBoard.keys);
            if (mappedPianoKey && !mappedPianoKey.isPressed) {
                mappedPianoKey.isPressed = true;
                sisiliano.piano.updateKey(that, mappedPianoKey);
                sisiliano.piano.playKey(that, mappedPianoKey);
            } else {
            }

            //Handel the arrow click
            switch (keyCode) {
                case 37:
                    sisiliano.piano.moveTabBy(that, -1);
                    d3.event.preventDefault();
                    break;
                case 39:
                    sisiliano.piano.moveTabBy(that, 1);
                    d3.event.preventDefault();
                    break;
            }
        });

        d3.select(that.container.get(0)).on("keyup", function () {
            var keyCode = d3.event.keyCode;
            var mappedPianoKey = sisiliano.piano.getKeyByComputerKeyCode(keyCode, that.model.keyBoard.keys);
            if (mappedPianoKey) {
                mappedPianoKey.isPressed = false;
                sisiliano.piano.updateKey(that, mappedPianoKey);
                sisiliano.piano.releaseKey(that, mappedPianoKey);

                d3.event.preventDefault();
            }
        });
    };

    sisiliano.piano.playKey = function (that, key) {
        that.events.onKeyPress.fire(key.index, sisiliano.piano.getFreequency(key.octave, key.octaveIndex));
    };

    sisiliano.piano.releaseKey = function (that, key) {
        that.events.onKeyRelease.fire(key.index);
    };

    sisiliano.piano.updateKey = function (that, key, element) {
        if (!element) {
            element = that.container.find(".sisiliano-piano-key[index='" + key.index + "']");
        }

        var className = key.className;
        className += key.isActive ? " sisiliano-piano-key-active" : " sisiliano-piano-key-inactive";
        className += key.isPressed ? " sisiliano-piano-key-pressed" : "";

        element.attr("class", className);
    };

    sisiliano.piano.getKeyByComputerKeyCode = function (computerKeyCode, keys) {
        var matchingKeys = keys.filter(function (key) {
            return key.keyCode === computerKeyCode;
        });

        if (matchingKeys.length === 0) {
            return null;
        } else {
            return matchingKeys[0];
        }
    };

    sisiliano.piano.getKeysByColor = function (keys, color) {
        return keys.filter(function (key) {
            return key.color === color;
        });
    };

    sisiliano.piano.getFreequency = function (octave, octaveIndex) {
        var frequencyMap = [
            261.626,
            277.183,
            293.665,
            311.127,
            329.628,
            349.228,
            369.994,
            391.995,
            415.305,
            440,
            466.164,
            493.883
        ];

        return Math.pow(2, octave) * frequencyMap[octaveIndex];
    };

    sisiliano.piano.OCTAVE = {
        0: {color: "WHITE", note: "c"},
        1: {color: "BLACK", note: "c#"},
        2: {color: "WHITE", note: "d"},
        3: {color: "BLACK", note: "d#"},
        4: {color: "WHITE", note: "e"},
        5: {color: "WHITE", note: "f"},
        6: {color: "BLACK", note: "f#"},
        7: {color: "WHITE", note: "g"},
        8: {color: "BLACK", note: "g#"},
        9: {color: "WHITE", note: "a"},
        10: {color: "BLACK", note: "a#"},
        11: {color: "WHITE", note: "b"}
    };

    sisiliano.piano.getWhiteKeys = function (keys) {
        return sisiliano.piano.getKeysByColor(keys, "WHITE");
    };

    sisiliano.piano.getBlackKeys = function (keys) {
        return sisiliano.piano.getKeysByColor(keys, "BLACK");
    };

    sisiliano.piano.generateKeyboard = function (that) {
        that.model.keyBoard.blackKey.width = (((that.model.keyBoard.whiteKey.width - 1) / 3) * 2) + 1;
        that.model.keyBoard.blackKey.height = (that.model.keyBoard.whiteKey.height / 3) * 2;
        that.model.keyBoard.keys = [];

        var keyCount = {
            whiteKeys: 0,
            blackKeys: 0
        };
        var index = 0;
        for (var x = that.model.keyBoard.start; x < that.model.keyBoard.length + that.model.keyBoard.start; x++, index++) {
            var octaveIndex = x % 12;
            var key;
            if (sisiliano.piano.OCTAVE[octaveIndex].color === "WHITE") {
                key = {
                    color: "WHITE",
                    x: that.model.keyBoard.padding.left + (keyCount.whiteKeys * that.model.keyBoard.whiteKey.width),
                    y: that.model.keyBoard.padding.top,
                    width: that.model.keyBoard.whiteKey.width - 1,
                    height: that.model.keyBoard.whiteKey.height,
                    index: index,
                    octave: Math.floor(x / 12),
                    octaveIndex: octaveIndex,
                    className: "sisiliano-piano-key sisiliano-piano-white-key"
                };

                keyCount.whiteKeys++;
            } else if (sisiliano.piano.OCTAVE[octaveIndex].color === "BLACK") {
                key = {
                    color: "BLACK",
                    x: that.model.keyBoard.padding.left + ((keyCount.whiteKeys - 1) * that.model.keyBoard.whiteKey.width) + ((that.model.keyBoard.whiteKey.width / 3) * 2),
                    y: that.model.keyBoard.padding.top,
                    width: that.model.keyBoard.blackKey.width,
                    height: that.model.keyBoard.blackKey.height,
                    index: index,
                    octave: Math.floor(x / 12),
                    octaveIndex: octaveIndex,
                    className: "sisiliano-piano-key sisiliano-piano-black-key"
                };

                keyCount.blackKeys++;
            }

            that.model.keyBoard.keys.push(key);
        }

        //Adjust the viewBox to fit with the entire div
        that.model.viewBox.width = (keyCount.whiteKeys * that.model.keyBoard.whiteKey.width) +
            that.model.keyBoard.padding.left + that.model.keyBoard.padding.right;
        that.model.viewBox.height = that.model.keyBoard.whiteKey.height +
            that.model.keyBoard.padding.top + that.model.keyBoard.padding.bottom;

        //Adjust the border position and layout
        that.model.keyBoard.border.width = (keyCount.whiteKeys * that.model.keyBoard.whiteKey.width) +
            that.model.keyBoard.borderPadding.left + that.model.keyBoard.borderPadding.right;
        that.model.keyBoard.border.height = that.model.keyBoard.whiteKey.height +
            that.model.keyBoard.borderPadding.top + that.model.keyBoard.borderPadding.bottom;
        that.model.keyBoard.border.x = that.model.keyBoard.keys[0].x - that.model.keyBoard.borderPadding.left;
        that.model.keyBoard.border.y = that.model.keyBoard.keys[0].y - that.model.keyBoard.borderPadding.top;

        that.applier.change("", that.model);
    };
})(fluid);