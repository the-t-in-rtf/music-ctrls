(function (fluid) {
    "use strict";

    fluid.defaults("fluid.sisiliano.piano", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            color: "#009688",
            keyBoard: {
                keys: [],
                length: 48,
                start: 5,
                pianoKeyListenerMap: {},
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
                /*Gap of start and end should be 11 to make make
                 the piano accessible to the computer keyboard*/
                start: 1,
                end: 19
            },
            disabledArea: {
                left: {
                    x: 0,
                    y: 5,
                    width: 100,
                    height: 160
                },
                right: {
                    x: 300,
                    y: 5,
                    width: 300,
                    height: 160
                }
            }
        },
        events: {
            onChange: null
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
                func: "fluid.sisiliano.piano.onCreate",
                args: ["{that}", "{that}.dom.keyBoard"]
            }
        },
        modelListeners: {
            "viewBox": {
                func: "fluid.sisiliano.piano.onChange",
                args: ["{that}", "{change}"]
            },
            "activeArea.end": {
                func: "fluid.sisiliano.piano.onChangeActiveArea",
                args: ["{that}", "{that}.model.keyBoard.keys", "{that}.model.activeArea"]
            },
            "keyBoard.keys": {
                func: "fluid.sisiliano.piano.onKeysChange",
                args: ["{that}", "{that}.model.keyBoard.keys"]
            }
        }
    });

    fluid.sisiliano.piano.onChange = function () {
    };

    fluid.sisiliano.piano.onChangeActiveArea = function (that, keys, activeArea) {
        var allocatedComputerKeysForThePiano = [81, 65, 87, 83, 69, 68, 82, 70, 84, 71, 89, 72,
            85, 74, 73, 75, 79, 76, 80, 186, 219, 222, 221];

        var allocatedKeyIndex = 0;
        var activeWhiteKeys = 0;
        var MAX_ACTIVE_WHITE_KEYS = 11;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            key.isActive = fluid.sisiliano.piano.isKeyWithinTheActiveArea(key, activeArea);

            if (key.isActive) {
                if (key.color === "WHITE" && activeWhiteKeys < MAX_ACTIVE_WHITE_KEYS) {
                    activeWhiteKeys++;
                } else if (key.color === "BLACK" && activeWhiteKeys === MAX_ACTIVE_WHITE_KEYS) {
                    activeWhiteKeys++;
                } else if (activeWhiteKeys >= MAX_ACTIVE_WHITE_KEYS) {
                    key.isActive = false;
                }
            }

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

        //TODO fix
        //that.applier.change("keyBoard.keys", keys);
        fluid.sisiliano.piano.onKeysChange(that, keys);
        fluid.sisiliano.piano.clearPressedNodes(that);
    };

    fluid.sisiliano.piano.onKeysChange = function (that, keys) {
        d3.select(that.container.get(0)).selectAll(".fl-sisiliano-piano-key").each(function () {
            var key = fluid.sisiliano.piano.getElementKey(d3.select(this), keys);
            fluid.sisiliano.piano.updateKey(that, key, d3.select(this));
        });
    };

    fluid.sisiliano.piano.getElementKey = function (element, keys) {
        return keys[element.attr("index")];
    };

    fluid.sisiliano.piano.isKeyWithinTheActiveArea = function (key, activeArea) {
        var index = key.index;
        return index >= activeArea.start && index <= activeArea.end;
    };

    fluid.sisiliano.piano.onCreate = function (that) {
        fluid.sisiliano.piano.generateKeyboard(that);
        fluid.sisiliano.piano.refresh(that);
        fluid.sisiliano.piano.appendListeners(that);
    };

    fluid.sisiliano.piano.refresh = function (that) {
        fluid.sisiliano.util.getTemplate(function (template) {
            that.model.keyBoard.whiteKeys = fluid.sisiliano.piano.getWhiteKeys(that.model.keyBoard.keys);
            that.model.keyBoard.blackKeys = fluid.sisiliano.piano.getBlackKeys(that.model.keyBoard.keys);
            var html = template(that.model);
            that.container.html(html);

            fluid.sisiliano.piano.onChangeActiveArea(that, that.model.keyBoard.keys, that.model.activeArea);
        }, "src/controllers/piano/piano.html");
    };

    fluid.sisiliano.piano.moveTabBy = function (that, increaseBy) {
        if (increaseBy) {
            var newActiveArea = {
                start: that.model.activeArea.start + increaseBy,
                end: that.model.activeArea.end + increaseBy
            };
            var isValid = newActiveArea.start >= 0 && newActiveArea.start < that.model.keyBoard.keys.length &&
                newActiveArea.end >= 0 && newActiveArea.end < that.model.keyBoard.keys.length &&
                newActiveArea.start < newActiveArea.end;

            if (isValid) {
                that.applier.change("activeArea", newActiveArea);
            }
        }

        that.applier.change("activeArea", that.model.activeArea);
    };

    fluid.sisiliano.piano.clearPressedNodes = function (that) {
        var nodes = fluid.sisiliano.piano.collectionOfNodes[that.id];
        if (nodes) {
            for (var keyIndex in nodes) {
                var key = that.model.keyBoard.keys[keyIndex];
                key.isPressed = false;
                fluid.sisiliano.piano.updateKey(that, key);
                var node = nodes[keyIndex];
                if (node) {
                    node.stop(0);
                    node.disconnect();
                }
            }
        }
    };

    fluid.sisiliano.piano.collectionOfNodes = {};
    fluid.sisiliano.piano.appendListeners = function (that) {
        var nodes = {};
        fluid.sisiliano.piano.collectionOfNodes[that.id] = nodes;

        //To produce the music
        var context = that.options.context;
        if (context) {
            var masterGain = context.createGain();
            masterGain.gain.value = 0.3;
            masterGain.connect(context.destination);
        }

        var playKey = function (key) {
            var oscillator = context.createOscillator();
            oscillator.type = "square";
            oscillator.frequency.value = fluid.sisiliano.piano.getFreequency(key.octave, key.octaveIndex);
            oscillator.connect(masterGain);
            oscillator.start(0);
            nodes[key.index] = oscillator;
        };

        var mouseDown = false;

        d3.select(document).on("mouseup", function () {
            mouseDown = false;
        });

        d3.select(that.container.get(0)).selectAll(".fl-sisiliano-piano-key")
            .on("mousedown", function () {
                mouseDown = true;
                var clickedIndex = d3.select(this).attr("index");
                var clickedKey = that.model.keyBoard.keys[clickedIndex];
                if (mouseDown && !clickedKey.isPressed) {
                    clickedKey.isPressed = true;
                    fluid.sisiliano.piano.updateKey(that, clickedKey);
                    playKey(clickedKey);
                }
            })
            .on("mouseover", function () {
                var clickedIndex = d3.select(this).attr("index");
                var clickedKey = that.model.keyBoard.keys[clickedIndex];
                if (mouseDown && !clickedKey.isPressed) {
                    clickedKey.isPressed = true;
                    fluid.sisiliano.piano.updateKey(that, clickedKey);

                    playKey(clickedKey);
                }
            })
            .on("mouseup", function () {
                mouseDown = false;
                var clickedIndex = d3.select(this).attr("index");
                var clickedKey = that.model.keyBoard.keys[clickedIndex];

                clickedKey.isPressed = false;
                fluid.sisiliano.piano.updateKey(that, clickedKey);
                var node = nodes[clickedKey.index];
                if (node) {
                    node.stop(0);
                    node.disconnect();
                    nodes[clickedKey.index] = null;
                }
            })
            .on("mouseleave", function () {
                var clickedIndex = d3.select(this).attr("index");
                var clickedKey = that.model.keyBoard.keys[clickedIndex];

                clickedKey.isPressed = false;
                fluid.sisiliano.piano.updateKey(that, clickedKey);
                var node = nodes[clickedKey.index];
                if (node) {
                    node.stop(0);
                    node.disconnect();
                    nodes[clickedKey.index] = null;
                }
            });

        that.container.on("keydown", function (evt) {
            var keyCode = evt.keyCode;
            var mappedPianoKey = fluid.sisiliano.piano.getKeyByComputerKeyCode(keyCode, that.model.keyBoard.keys);
            if (mappedPianoKey && !mappedPianoKey.isPressed) {
                mappedPianoKey.isPressed = true;
                fluid.sisiliano.piano.updateKey(that, mappedPianoKey);

                playKey(mappedPianoKey);
            } else {
            }

            //Handel the arrow click
            switch (keyCode) {
                case 37:
                    fluid.sisiliano.piano.moveTabBy(that, -1);
                    d3.event.preventDefault();
                    break;
                case 39:
                    fluid.sisiliano.piano.moveTabBy(that, 1);
                    d3.event.preventDefault();
                    break;
            }
        });

        that.container.on("keyup", function (evt) {
            var keyCode = evt.keyCode;
            var mappedPianoKey = fluid.sisiliano.piano.getKeyByComputerKeyCode(keyCode, that.model.keyBoard.keys);
            if (mappedPianoKey) {
                mappedPianoKey.isPressed = false;
                fluid.sisiliano.piano.updateKey(that, mappedPianoKey);
                var node = nodes[mappedPianoKey.index];
                if (node) {
                    node.stop(0);
                    node.disconnect();
                    nodes[mappedPianoKey.index] = null;
                }
                d3.event.preventDefault();
            }
        });
    };

    fluid.sisiliano.piano.updateKey = function (that, key, element) {
        if (!element) {
            element = that.container.find(".fl-sisiliano-piano-key[index='" + key.index + "']");
        }

        var className = key.className;
        className += key.isActive ? " fl-sisiliano-piano-key-active" : " fl-sisiliano-piano-key-inactive";
        className += key.isPressed ? " fl-sisiliano-piano-key-pressed" : "";

        element.attr("class", className);
    };

    fluid.sisiliano.piano.getKeyByComputerKeyCode = function (computerKeyCode, keys) {
        var matchingKeys = keys.filter(function (key) {
            return key.keyCode === computerKeyCode;
        });

        if (matchingKeys.length === 0) {
            return null;
        } else {
            return matchingKeys[0];
        }
    };

    fluid.sisiliano.piano.getKeysByColor = function (keys, color) {
        return keys.filter(function (key) {
            return key.color === color;
        });
    };

    fluid.sisiliano.piano.getFreequency = function (octave, octaveIndex) {
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

    fluid.sisiliano.piano.OCTAVE = {
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

    fluid.sisiliano.piano.getWhiteKeys = function (keys) {
        return fluid.sisiliano.piano.getKeysByColor(keys, "WHITE");
    };

    fluid.sisiliano.piano.getBlackKeys = function (keys) {
        return fluid.sisiliano.piano.getKeysByColor(keys, "BLACK");
    };

    fluid.sisiliano.piano.generateKeyboard = function (that) {
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
            if (fluid.sisiliano.piano.OCTAVE[octaveIndex].color === "WHITE") {
                key = {
                    color: "WHITE",
                    x: that.model.keyBoard.padding.left + (keyCount.whiteKeys * that.model.keyBoard.whiteKey.width),
                    y: that.model.keyBoard.padding.top,
                    width: that.model.keyBoard.whiteKey.width - 1,
                    height: that.model.keyBoard.whiteKey.height,
                    index: index,
                    octave: Math.floor(x / 12),
                    octaveIndex: octaveIndex,
                    className: "fl-sisiliano-piano-key fl-sisiliano-piano-white-key"
                };

                keyCount.whiteKeys++;
            } else if (fluid.sisiliano.piano.OCTAVE[octaveIndex].color === "BLACK") {
                key = {
                    color: "BLACK",
                    x: that.model.keyBoard.padding.left + ((keyCount.whiteKeys - 1) * that.model.keyBoard.whiteKey.width) + ((that.model.keyBoard.whiteKey.width / 3) * 2),
                    y: that.model.keyBoard.padding.top,
                    width: that.model.keyBoard.blackKey.width,
                    height: that.model.keyBoard.blackKey.height,
                    index: index,
                    octave: Math.floor(x / 12),
                    octaveIndex: octaveIndex,
                    className: "fl-sisiliano-piano-key fl-sisiliano-piano-black-key"
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