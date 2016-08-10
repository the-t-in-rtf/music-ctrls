(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.piano", {
        gradeNames: ["sisiliano.border", "sisiliano.component"],
        template: "src/controllers/piano/piano.html",
        ariaDescription: "Piano keys are accessible by mouse and the keyboad as well. Only the active area of the piano is accessible by the keyboard. If you want to move the active area, use left and right keys.",
        model: {
            color: "#4CAF50",
            styles: {
                keyBoard: {
                    padding: {
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20
                    },
                    whiteKey: {
                        width: 40,
                        height: 150
                    },
                    blackKey: {
                        width: 27,
                        height: 100
                    }
                }
            },
            keyBoard: {
                keys: [],
                length: 36,
                start: 0,
                activeArea: {
                    start: 0,
                    end: 10
                }
            }
        },
        events: {
            onKeyPress: null,
            onKeyRelease: null
        },
        selectors: {
            root: ".sisiliano",
            svg: ".sisiliano-piano",
            keyBoard: ".sisiliano-piano-key-board",
            whiteKeys: ".sisiliano-piano-white-key",
            blackKeys: ".sisiliano-piano-black-key",
            keys: ".sisiliano-piano-key",
            activeAreaStatus: ".sisiliano-piano-active-area-status",
            pressedKeys: ".sisiliano-piano-key-pressed"
        },
        listeners: {
            onReady: [
                {
                    func: "sisiliano.piano.generateKeyboard",
                    args: ["{that}"]
                },
                {
                    func: "sisiliano.piano.onCreate",
                    args: ["{that}", "{that}.dom.keyBoard"]
                }
            ]
        },
        modelListeners: {
            "keyBoard.activeArea.*": {
                func: "sisiliano.piano.onChangeActiveArea",
                args: ["{that}", "{that}.model.keyBoard.keys", "{that}.model.keyBoard.activeArea"]
            },
            "keyBoard.keys": {
                func: "sisiliano.piano.onKeysChange",
                args: ["{that}", "{that}.model.keyBoard.keys"]
            }
        }
    });

    sisiliano.piano.onChangeActiveArea = function (that, keys, activeArea) {
        var allocatedComputerKeysForThePiano = [81, 65, 87, 83, 69, 68, 82, 70, 84, 71, 89, 72,
            85, 74, 73, 75, 79, 76, 80, 186, 219, 222, 221];

        var whiteKeys = sisiliano.piano.getWhiteKeys(keys);

        if (whiteKeys.length > 0) {
            var activeStartKey = whiteKeys[activeArea.start];
            var activeEndKey = whiteKeys[Math.min(activeArea.end, that.model.keyBoard.length - 1)];
            var activeStartIndex = activeStartKey.index;
            var activeEndIndex = activeEndKey.index;
            var activeAreaStatusMessage = "The piano is active from " + sisiliano.piano.getMusicNote(activeStartKey) + " to " + sisiliano.piano.getMusicNote(activeEndKey);
            that.locate("activeAreaStatus").text(activeAreaStatusMessage);

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
        var keyBoardElm = d3.select(that.locate("keyBoard").get(0));

        keyBoardElm.empty();
        keyBoardElm.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("aria-live", "assertive")
            .attr("class", "sisiliano-piano-active-area-status")
            .text("Piano is active from G to C");

        fluid.each(sisiliano.piano.getWhiteKeys(that.model.keyBoard.keys), function (whiteKey) {
            var key = keyBoardElm.append("rect")
                .attr("index", whiteKey.index)
                .attr("class", "sisiliano-piano-key sisiliano-piano-white-key")
                .attr("height", whiteKey.height)
                .attr("width", whiteKey.width)
                .attr("x", whiteKey.x)
                .attr("y", whiteKey.y);
            sisiliano.util.applyStyles(key, that.model.styles.keyBoard.whiteKey,
                ["x", "y", "width", "height"]);
        });

        fluid.each(sisiliano.piano.getBlackKeys(that.model.keyBoard.keys), function (blackKey) {
            var key = keyBoardElm.append("rect")
                .attr("index", blackKey.index)
                .attr("class", "sisiliano-piano-key sisiliano-piano-black-key")
                .attr("height", blackKey.height)
                .attr("width", blackKey.width)
                .attr("x", blackKey.x)
                .attr("y", blackKey.y);
            sisiliano.util.applyStyles(key, that.model.styles.keyBoard.blackKey,
                ["x", "y", "width", "height"]);
        });

        sisiliano.piano.onChangeActiveArea(that, that.model.keyBoard.keys, that.model.keyBoard.activeArea);
        sisiliano.piano.appendListeners(that);
    };

    sisiliano.piano.moveTabBy = function (that, increaseBy) {
        if (increaseBy) {
            var newActiveArea = {
                start: that.model.keyBoard.activeArea.start + increaseBy,
                end: that.model.keyBoard.activeArea.end + increaseBy
            };
            var whiteKeys = sisiliano.piano.getWhiteKeys(that.model.keyBoard.keys);
            var isValid = newActiveArea.start >= 0 && newActiveArea.start < whiteKeys.length &&
                newActiveArea.end >= 0 && newActiveArea.end < whiteKeys.length &&
                newActiveArea.start < newActiveArea.end;
            if (isValid) {
                that.applier.change("keyBoard.activeArea", newActiveArea);
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
            if (mappedPianoKey) {
                if (!mappedPianoKey.isPressed) {
                    mappedPianoKey.isPressed = true;
                    sisiliano.piano.updateKey(that, mappedPianoKey);
                    sisiliano.piano.playKey(that, mappedPianoKey);
                }

                d3.event.preventDefault();
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

        document.addEventListener("mouseup", function () {
            mouseDown = false;
            d3.select(that.container.get(0)).selectAll(".sisiliano-piano-key-pressed").each(keyUpHandler);
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

    sisiliano.piano.getPianoKey = function (key) {
        return sisiliano.piano.OCTAVE[key.octaveIndex];
    };


    sisiliano.piano.getMusicNote = function (key) {
        var pianoKey = sisiliano.piano.getPianoKey(key);

        return pianoKey.note + " in octave " + (key.octave + 1);
    };

    sisiliano.piano.getWhiteKeys = function (keys) {
        return sisiliano.piano.getKeysByColor(keys, "WHITE");
    };

    sisiliano.piano.getBlackKeys = function (keys) {
        return sisiliano.piano.getKeysByColor(keys, "BLACK");
    };

    sisiliano.piano.generateKeyboard = function (that) {
        that.model.styles.keyBoard.blackKey.width = (((that.model.styles.keyBoard.whiteKey.width - 1) / 3) * 2) + 1;
        that.model.styles.keyBoard.blackKey.height = (that.model.styles.keyBoard.whiteKey.height / 3) * 2;
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
                    x: that.model.styles.keyBoard.padding.left + (keyCount.whiteKeys * that.model.styles.keyBoard.whiteKey.width),
                    y: that.model.styles.keyBoard.padding.top,
                    width: that.model.styles.keyBoard.whiteKey.width - 1,
                    height: that.model.styles.keyBoard.whiteKey.height,
                    index: index,
                    octave: Math.floor(x / 12),
                    octaveIndex: octaveIndex,
                    className: "sisiliano-piano-key sisiliano-piano-white-key"
                };

                keyCount.whiteKeys++;
            } else if (sisiliano.piano.OCTAVE[octaveIndex].color === "BLACK") {
                key = {
                    color: "BLACK",
                    x: that.model.styles.keyBoard.padding.left + ((keyCount.whiteKeys - 1) * that.model.styles.keyBoard.whiteKey.width) + ((that.model.styles.keyBoard.whiteKey.width / 3) * 2),
                    y: that.model.styles.keyBoard.padding.top,
                    width: that.model.styles.keyBoard.blackKey.width,
                    height: that.model.styles.keyBoard.blackKey.height,
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
        that.applier.change("styles.controller", {
            width: (keyCount.whiteKeys * that.model.styles.keyBoard.whiteKey.width) + that.model.styles.keyBoard.padding.left + that.model.styles.keyBoard.padding.right,
            height: that.model.styles.keyBoard.whiteKey.height + that.model.styles.keyBoard.padding.top + that.model.styles.keyBoard.padding.bottom
        });

        that.applier.change("", that.model);
    };
})(fluid);