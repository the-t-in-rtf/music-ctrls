(function (fluid, jqUnit) {
    "use strict";

    fluid.registerNamespace("sisiliano.tests.piano");

    jqUnit.test("Piano : basics of piano", function () {
        $(".test").empty();
        var piano = sisiliano.piano(".test");
        sisiliano.tests.piano.verifyPressedColor(piano, "#4CAF50");
        sisiliano.tests.piano.verifyActiveArea(piano, 0, 18);
        sisiliano.tests.piano.verifyLength(piano, 36);
    });

    jqUnit.test("Piano : Custimizations of piano", function () {
        $(".test").empty();
        var piano = sisiliano.piano(".test", {
            model: {
                color: "#FF0000",
                keyBoard: {
                    length: 20,
                    activeArea: {
                        start: 3,
                        end: 9
                    }
                }
            }
        });
        sisiliano.tests.piano.verifyPressedColor(piano, "#FF0000");
        sisiliano.tests.piano.verifyActiveArea(piano, 5, 16);
        sisiliano.tests.piano.verifyLength(piano, 20);
    });

    sisiliano.tests.piano.verifyPressedColor = function (piano, expectedColor) {
        d3.select(piano.container.get(0)).selectAll(".sisiliano-piano-key").each(function () {
            var key = d3.select(this);
            var className = key.attr("class");
            key.attr("class", className + " sisiliano-piano-key-pressed");
            var fillColorWhenPressed = key.style("fill");
            jqUnit.assertEquals("color should be #4CAF50 - " + className, expectedColor, sisiliano.tests.helpers.toHex(fillColorWhenPressed));
            key.attr("class", className);
        });
    };

    sisiliano.tests.piano.verifyActiveArea = function (piano, expectedStart, expectedEnd) {
        var message = "when the active area is (" + expectedStart + "," + expectedEnd + ")";
        d3.select(piano.container.get(0)).selectAll(".sisiliano-piano-key").each(function () {
            var key = d3.select(this);
            var className = key.attr("class");
            var index = parseInt(key.attr("index"), null);
            if (index >= expectedStart && index <= expectedEnd) {
                jqUnit.assertTrue(message + index + " should be active", className.indexOf("sisiliano-piano-key-active") >= 0);
            } else {
                jqUnit.assertFalse(message + index + " should be inactive", className.indexOf("sisiliano-piano-key-active") >= 0);
            }
        });
    };

    sisiliano.tests.piano.verifyLength = function (piano, expectedLength) {
        var numberOfKeys = d3.select(piano.container.get(0)).selectAll(".sisiliano-piano-key")[0].length;
        jqUnit.assertEquals("The length should be " + expectedLength, expectedLength, numberOfKeys);
    };

    sisiliano.tests.piano.verifyKeyStatus = function (piano, key, color, message, active, pressed) {
        var keyColor = $(key).css("fill");
        var expectedColor = null;
        if (color === "WHITE") {
            if (active) {
                expectedColor = "#FFFFFF";
            } else {
                expectedColor = "#D1CFCF";
            }
        } else {
            if (active) {
                expectedColor = "#000000";
            } else {
                expectedColor = "#504C4C";
            }
        }

        if (pressed) {
            expectedColor = piano.model.color[0];
        }

        jqUnit.assertEquals(message + " : pressed color should have" + (pressed ? "": " not") + " been applied",
            expectedColor,
            sisiliano.tests.helpers.toHex(keyColor));
    };

    sisiliano.tests.piano.getKeyColor = function (key) {
        var className = $(key).attr("class");
        if (className.indexOf("white") >= 0) {
            return "WHITE";
        } else {
            return "BLACK";
        }
    };

    sisiliano.tests.piano.getKeyIndex = function (key) {
        return parseInt($(key).attr("index"), null);
    };

    sisiliano.tests.piano.getKeyByIndex = function (piano, index) {
        var keys = piano.locate("keys");
        var filteredKeys = keys.filter(function () {
            return (sisiliano.tests.piano.getKeyIndex($(this)) + "") === (index + "");
        });

        return filteredKeys.length === 0 ? null : filteredKeys[0];
    };

    sisiliano.tests.piano.isKeyActive = function (key) {
        return $(key).attr("class").indexOf("inactive") < 0;
    };

    /////////////////////////////////////////////////////////
    /////           Verifying mouse click
    /////////////////////////////////////////////////////////
    fluid.registerNamespace("sisiliano.tests.piano.mouseEvents");
    jqUnit.test("Piano : mouse click", function () {
        var soundBox = {
            playKey: function() {},
            releaseKey: function() {}
        };
        $(".test").empty();
        var piano = sisiliano.piano(".test", {
            listeners: {
                onKeyPress: function (key, frequency) {
                    soundBox.playKey(key, frequency);
                },
                onKeyRelease: function (key) {
                    soundBox.releaseKey(key);
                }
            }
        });
        sisiliano.tests.piano.verifyMouseEvents(piano, soundBox);
    });

    sisiliano.tests.piano.verifyMouseEvents = function (piano, soundBox) {
        var whiteKeys = piano.locate("whiteKeys");
        var keyElm;
        for (var i = 0; i < whiteKeys.length; i++) {
            keyElm = $(whiteKeys[i]);
            sisiliano.tests.piano.mouseEvents.verifyMouseDown(piano, "White key " + keyElm.attr("index"), keyElm,
                "WHITE", i, soundBox);
            sisiliano.tests.piano.mouseEvents.verifyMouseUp(piano, "White key " + keyElm.attr("index"), keyElm,
                "WHITE", i, soundBox);
        }

        var blackKeys = piano.locate("blackKeys");
        for (i = 0; i < blackKeys.length; i++) {
            keyElm = $(blackKeys[i]);
            sisiliano.tests.piano.mouseEvents.verifyMouseDown(piano, "Black key " + keyElm.attr("index"), keyElm,
                "BLACK", i, soundBox);
            sisiliano.tests.piano.mouseEvents.verifyMouseUp(piano, "Black key " + keyElm.attr("index"), keyElm,
                "BLACK", i, soundBox);
        }

        sisiliano.tests.piano.mouseEvents.verifyMouseDownOutsideThePiano(piano, "Click on outside of the piano");
    };

    sisiliano.tests.piano.mouseEvents.verifyMouseDownOutsideThePiano = function (piano, message) {
        //Press all the keys in the piano
        var keys = piano.locate("keys");
        for (var i = 0; i < keys.length; i++) {
            var key = $(keys[i]);
            key.simulate("mousedown");
        }

        jqUnit.assertEquals(message + " : all keys should have been pressed before the test",
            keys.length, piano.locate("pressedKeys").length);

        //Click outside the piano
        $(document).simulate("mouseup");

        jqUnit.assertEquals(message + " : all keys should have been released on outside click",
            0, piano.locate("pressedKeys").length);
    };

    sisiliano.tests.piano.mouseEvents.verifyMouseDown = function (piano, message, key, color, index, soundBox) {
        soundBox.playKey = function () {
            jqUnit.assert(message + " : soundbox should start playing when mousedown");
        };
        var isActive = sisiliano.tests.piano.isKeyActive(key);
        key.simulate("mousedown");
        sisiliano.tests.piano.verifyKeyStatus(piano, key, color, message + " : Key style should be changed as clicked", isActive, true);
    };

    sisiliano.tests.piano.mouseEvents.verifyMouseUp = function (piano, message, key, color, index, soundBox) {
        soundBox.releaseKey = function () {
            jqUnit.assert(message + " : soundbox should stop playing when mouseup");
        };
        var isActive = sisiliano.tests.piano.isKeyActive(key);
        key.simulate("mouseup");
        sisiliano.tests.piano.verifyKeyStatus(piano, key, color, message + " : Key style should be changed as clicked", isActive, false);
    };

    /////////////////////////////////////////////////////////
    /////           Verifying active area navigation
    /////////////////////////////////////////////////////////
    fluid.registerNamespace("sisiliano.tests.piano.activeArea");

    jqUnit.test("Piano : active area navigation", function () {
        $(".test").empty();
        var piano = sisiliano.piano(".test");

        sisiliano.tests.piano.verifyActiveAreaKeys(piano, "Default active area", {start: 0, end: 10});
        sisiliano.tests.piano.verifyActiveAreaNavigations(piano, "Active area navigations");
    });

    sisiliano.tests.piano.verifyActiveAreaNavigations = function (piano, message) {
        var whiteKeys = piano.locate("whiteKeys");
        var expectedActiveArea = {
            start: piano.model.keyBoard.activeArea.start,
            end: piano.model.keyBoard.activeArea.end
        };
        var testCaseMessage = "";
        for (var i = 1; i <= whiteKeys.length; i++) {
            sisiliano.tests.piano.activeArea.moveToRight(piano);
            if (expectedActiveArea.end === (whiteKeys.length - 1)) {
                testCaseMessage = "Active area shouldn't moved to right from the last white key";
            } else {
                testCaseMessage = "Active area should be moved to (" + expectedActiveArea.start + "," + expectedActiveArea.end + ")";
                expectedActiveArea.start++;
                expectedActiveArea.end++;
            }

            sisiliano.tests.piano.verifyActiveAreaKeys(piano, message + " : " + testCaseMessage, expectedActiveArea);
        }

        for (i = 1; i <= whiteKeys.length; i++) {
            sisiliano.tests.piano.activeArea.moveToLeft(piano);
            if (expectedActiveArea.start === 0) {
                testCaseMessage = "Active area shouldn't moved to left from zero";
            } else {
                testCaseMessage = "Active area should be moved to (" + expectedActiveArea.start + "," + expectedActiveArea.end + ")";
                expectedActiveArea.start--;
                expectedActiveArea.end--;
            }

            sisiliano.tests.piano.verifyActiveAreaKeys(piano, message + " : " + testCaseMessage, expectedActiveArea);
        }
    };

    sisiliano.tests.piano.activeArea.moveToLeft = function (piano) {
        sisiliano.tests.piano.keyEvents.pressKey(piano, 37);
    };

    sisiliano.tests.piano.activeArea.moveToRight = function (piano) {
        sisiliano.tests.piano.keyEvents.pressKey(piano, 39);
    };

    sisiliano.tests.piano.verifyActiveAreaKeys = function (piano, message, expectedActiveArea) {
        var keys = piano.locate("keys");
        var whiteKeys = piano.locate("whiteKeys");
        var activeStartWhiteKey= whiteKeys[expectedActiveArea.start];
        var activeEndWhiteKey = whiteKeys[expectedActiveArea.end];
        var activeStartIndex = parseInt($(activeStartWhiteKey).attr("index"), null);
        var activeEndIndex = parseInt($(activeEndWhiteKey).attr("index"), null);
        for (var i = 0; i < keys.length; i++) {
            var key = $(keys[i]);
            var keyColor = sisiliano.tests.piano.getKeyColor(key);
            var keyIndex = parseInt(key.attr("index"), null);
            var isActive = keyIndex >= activeStartIndex && keyIndex <= activeEndIndex;

            //Verifying whether the edge black keys are being activated
            if (keyColor === "BLACK") {
                if (keyIndex === (activeStartIndex - 1) || keyIndex === (activeEndIndex + 1)) {
                    isActive = true;
                }
            }

            sisiliano.tests.piano.verifyKeyStatus(piano, key, keyColor,
                message + " : Key " + (keyIndex + 1) + " should be " + (isActive ? "active" : "inactive"), isActive, false);
        }

        sisiliano.tests.piano.verifyKeyEvents(piano, message + " : key events", expectedActiveArea);
    };

    /////////////////////////////////////////////////////////
    /////           Verifying Key Events
    /////////////////////////////////////////////////////////
    fluid.registerNamespace("sisiliano.tests.piano.keyEvents");
    jqUnit.test("Piano : key events", function () {
        $(".test").empty();
        var piano = sisiliano.piano(".test");
        sisiliano.tests.piano.verifyKeyEvents(piano, "Verifying key events", {start: 0, end: 10});
    });

    sisiliano.tests.piano.verifyKeyEvents = function (piano, message, expectedActiveArea) {
        var keyCodeMap = {
            Q: 81,
            A: 65,
            W: 87,
            S: 83,
            E: 69,
            D: 68,
            R: 82,
            F: 70,
            T: 84,
            G: 71,
            Y: 89,
            H: 72,
            U: 85,
            J: 74,
            I: 73,
            K: 75,
            O: 79,
            L: 76,
            P: 80,
            ":": 186,
            "{": 219,
            "\"": 222,
            "}": 221
        };

        var whiteKeys = piano.locate("whiteKeys");
        var keyLettersOrder = "QAWSEDRFTGYHUJIKOLP:{\"}";
        var expectedKeys = [];
        for (var i = expectedActiveArea.start; i <= expectedActiveArea.end + 1; i++) {
            var key = whiteKeys[i];
            var keyIndex = sisiliano.tests.piano.getKeyIndex(key);
            var prevKey = sisiliano.tests.piano.getKeyByIndex(piano, keyIndex - 1);
            if (prevKey && sisiliano.tests.piano.getKeyColor(prevKey) === "BLACK") {
                expectedKeys.push(prevKey);
            } else {
                expectedKeys.push(null);
            }

            expectedKeys.push(key);
        }

        for (i = 0; i < keyLettersOrder.length; i++) {
            var keyLetter = keyLettersOrder[i];
            var expectedKey = expectedKeys[i];
            if (expectedKey) {
                sisiliano.tests.piano.keyEvents.verifyKeyCodeAndKey(piano, keyCodeMap[keyLetter], expectedKey,
                    message + " : letter " + keyLetter + " should fire key " + sisiliano.tests.piano.getKeyIndex(expectedKey));
            }
        }
    };

    sisiliano.tests.piano.keyEvents.verifyKeyCodeAndKey = function (piano, keyCode, expectedKey, message) {
        //Verifying whether the key press of the specified key code presses the mapped key in the piano
        piano.container.simulate("keydown", {
            keyCode: keyCode
        });
        sisiliano.tests.piano.verifyKeyStatus(piano, expectedKey,
            sisiliano.tests.piano.getKeyColor(expectedKey),
            message + " : keydown", true, true);

        //Verifying whether the key release of the specified key code releases the mapped key in the piano
        piano.container.simulate("keyup", {
            keyCode: keyCode
        });
        sisiliano.tests.piano.verifyKeyStatus(piano, expectedKey,
            sisiliano.tests.piano.getKeyColor(expectedKey),
            message + " : keyup", true, false);
    };

    sisiliano.tests.piano.keyEvents.pressKey = function (piano, keyCode) {
        piano.container.simulate("keydown", {
            keyCode: keyCode
        });
    };
})(fluid, jqUnit);