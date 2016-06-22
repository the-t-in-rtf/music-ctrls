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
            d3.event.preventDefault();
            var clickedIndex = d3.select(this).attr("index");
            var clickedKey = that.model.keyBoard.keys[clickedIndex];
            if (mouseDown && !clickedKey.isPressed) {
                clickedKey.isPressed = true;
                sisiliano.piano.updateKey(that, clickedKey);
                sisiliano.piano.playKey(that, clickedKey);
            }
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
            d3.event.preventDefault();
            var clickedIndex = d3.select(this).attr("index");
            var clickedKey = that.model.keyBoard.keys[clickedIndex];

            clickedKey.isPressed = false;
            sisiliano.piano.updateKey(that, clickedKey);
            sisiliano.piano.releaseKey(that, clickedKey);
        };

        d3.select(that.container.get(0)).selectAll(".sisiliano-piano-key")
            .on("mousedown", keyPressHandler)
            //.on("touchstart", keyPressHandler)
            .on("mouseover", keyOverHandler)
            //.on("touchmove", keyOverHandler)
            .on("mouseup", keyUpHandler)
            //.on("touchend", keyUpHandler)
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