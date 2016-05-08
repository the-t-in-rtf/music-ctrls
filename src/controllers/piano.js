/**
 * Created by VDESIDI on 5/1/2016.
 */

(function(config, fluid, $) {
  fluid.defaults("fluid." + config.frameworkName + ".piano", {
    gradeNames: ["fluid.viewComponent"],
    model: {
      color: "#009688",
      keyBoard: {
        keys: [],
        whiteKeys: [],
        blackKeys: [],
        length: 50,
        start: 3,
        keyCodeListenerMap: {}
      },
      viewBox: {
        width: 600,
        height: 170
      },
      activeArea: {
        /*Gap of start and end should be 11 to make make
        the piano accessible to the computer keyboard*/
        start: 1,
        end: 11
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
        func: "fluid." + config.frameworkName + ".piano.onCreate",
        args: ["{that}", "{that}.dom.keyBoard"]
      }
    },
    modelListeners: {
      "keyBoard.keyStatus": {
        func: "fluid." + config.frameworkName + ".piano.onChange",
        args: ["{that}", "[change}"]
      }
    }
  });

  fluid[config.frameworkName].piano.onChange = function() {};

  fluid[config.frameworkName].piano.onCreate = function (that) {
    fluid[config.frameworkName].piano.generateKeyboard(that);
    fluid[config.frameworkName].piano.appendListeners(that);
    fluid[config.frameworkName].piano.moveTabBy(that, 0);
    fluid[config.frameworkName].piano.refresh(that);
  };

  fluid[config.frameworkName].piano.refresh = function (that) {
    fluid[config.frameworkName].util.getTemplate(function(template) {
      var html = template(that.model);
      that.container.html(html);
    }, "src/templates/piano.html");
  };

  fluid[config.frameworkName].piano.updateTheDisabledAreaUI = function(that) {
    var disabledAreaContextList = [that.model.disabledArea.left, that.model.disabledArea.right];
    for (var x = 0; x < 2; x++) {
      var context = disabledAreaContextList[x];
      var disabledArea = that.container.find('.fl-sisiliano-piano-disabledArea:eq(' + x + ')');
      disabledArea.attr('x', context.x);
      disabledArea.attr('y', context.y);
      disabledArea.attr('width', context.width);
      disabledArea.attr('height', context.height);
    }
  };


  fluid[config.frameworkName].piano.moveTabBy = function(that, increaseBy) {
    if (increaseBy) {
      var newActiveArea = {
        start: that.model.activeArea.start + increaseBy,
        end: that.model.activeArea.end + increaseBy
      };
      var isValid = newActiveArea.start >= 0 && newActiveArea.start < that.model.keyBoard.whiteKeys.length &&
                    newActiveArea.end >= 0 && newActiveArea.end < that.model.keyBoard.whiteKeys.length &&
                    newActiveArea.start < newActiveArea.end;

      if (isValid) {
        that.model.activeArea.start = newActiveArea.start;
        that.model.activeArea.end = newActiveArea.end;
      }
    }

    var pianoKeyCodes = fluid[config.frameworkName].piano.COMPUTER_KEYBOARD_CODES_FOR_PIANO;
    var keyCodeListenerMap = that.model.keyBoard.keyCodeListenerMap;

    for (var x = that.model.activeArea.start, nextKeyCodeIndex = 0; x <= that.model.activeArea.end; x++) {
      var key = that.model.keyBoard.whiteKeys[x];
      if (nextKeyCodeIndex === 0) {
        appendListenerToKey(key.prev, "BLACK", pianoKeyCodes[nextKeyCodeIndex++]);
      }

      appendListenerToKey(key, "WHITE", pianoKeyCodes[nextKeyCodeIndex++]);
      appendListenerToKey(key.next, "BLACK", pianoKeyCodes[nextKeyCodeIndex++]);
    }

    function appendListenerToKey(key, keyColor, keyCode) {
      if (key && getColor(key) === keyColor) {
        keyCodeListenerMap[keyCode] = key;
      } else {
        keyCodeListenerMap[keyCode] = null;
      }
    }

    function getColor(key) {
      return fluid[config.frameworkName].piano.OCTAVE[key.octaveIndex].color;
    }

    //Adjust the disabled area
    that.model.disabledArea.left.width = that.model.activeArea.start * 40;
    that.model.disabledArea.right.width = (that.model.keyBoard.whiteKeys.length - that.model.activeArea.end) * 40;
    if (that.model.activeArea.end < that.model.keyBoard.whiteKeys.length) {
      that.model.disabledArea.right.x = that.model.keyBoard.whiteKeys[that.model.activeArea.end].x + 40;
    }
  };

  fluid[config.frameworkName].piano.appendListeners = function (that) {
    var pianoKeyCodes = fluid[config.frameworkName].piano.COMPUTER_KEYBOARD_CODES_FOR_PIANO;
    var keyCodeListenerMap = that.model.keyBoard.keyCodeListenerMap;

    that.container.on('keydown', function(evt) {
      var keyCode = evt.keyCode;
      var mappedPianoKey = keyCodeListenerMap[keyCode];
      if (mappedPianoKey) {
        if (mappedPianoKey.statusClass !== 'fl-sisiliano-piano-key-pressed') {
          mappedPianoKey.statusClass = 'fl-sisiliano-piano-key-pressed';
          updateKeyStatus(that, mappedPianoKey);
        }
      } else {
        console.log("keydown : not found");
      }

      //Handel the arrow click
      switch (keyCode) {
        case 37:
          fluid[config.frameworkName].piano.moveTabBy(that, -1);
          fluid[config.frameworkName].piano.updateTheDisabledAreaUI(that);
          break;
        case 39:
          fluid[config.frameworkName].piano.moveTabBy(that, 1);
          fluid[config.frameworkName].piano.updateTheDisabledAreaUI(that);
          break;
      }
    });

    that.container.on('keypress', function(evt) {
    });

    that.container.on('keyup', function(evt) {
      var keyCode = evt.keyCode;
      var mappedPianoKey = keyCodeListenerMap[keyCode];
      if (mappedPianoKey) {
        if (mappedPianoKey.statusClass === 'fl-sisiliano-piano-key-pressed') {
          mappedPianoKey.statusClass = null;
          updateKeyStatus(that, mappedPianoKey);
        }
      } else {
        console.log("keyup : not found");
      }
    });
    
    function updateKeyStatus(that, key) {
      that.container.find('.fl-sisiliano-piano-key[index="' + key.index + '"]').attr('class', key.class + ' ' + key.statusClass);
    }
  };

  fluid[config.frameworkName].piano.OCTAVE = {
    0: { color: "WHITE", note: "c" },
    1: { color: "BLACK", note: "c#" },
    2: { color: "WHITE", note: "d" },
    3: { color: "BLACK", note: "d#" },
    4: { color: "WHITE", note: "e" },
    5: { color: "WHITE", note: "f" },
    6: { color: "BLACK", note: "f#" },
    7: { color: "WHITE", note: "g" },
    8: { color: "BLACK", note: "g#" },
    9: { color: "WHITE", note: "a" },
    10:{ color: "BLACK", note: "a#" },
    11:{ color: "WHITE", note: "b" }
  };

  fluid[config.frameworkName].piano.COMPUTER_KEYBOARD_CODES_FOR_PIANO = [81, 65, 87, 83, 69, 68, 82, 70, 84, 71, 89, 72,
                                                              85, 74, 73, 75, 79, 76, 80, 186, 219, 222, 221];

  fluid[config.frameworkName].piano.generateKeyboard = function(that) {
    that.model.keyBoard.keyCodeListenerMap = {};
    that.model.keyBoard.whiteKeys = [];
    that.model.keyBoard.blackKeys = [];

    //Initialize the key map to store the listeners
    for (var i; i < fluid[config.frameworkName].piano.COMPUTER_KEYBOARD_CODES_FOR_PIANO.length; i++) {
      that.model.keyBoard.keyCodeListenerMap = fluid[config.frameworkName].piano.COMPUTER_KEYBOARD_CODES_FOR_PIANO[i];
    }

    for (var x = that.model.keyBoard.start; x < that.model.keyBoard.length + that.model.keyBoard.start; x++) {
      var octaveIndex = x % 12;
      var key;
      if (fluid[config.frameworkName].piano.OCTAVE[octaveIndex].color === "WHITE") {
        key = {
          x: 5 + (that.model.keyBoard.whiteKeys.length * 40),
          index: x,
          octaveIndex: octaveIndex,
          class: "fl-sisiliano-piano-key fl-sisiliano-piano-white-key"
        };
        that.model.keyBoard.whiteKeys.push(key);
      } else if (fluid[config.frameworkName].piano.OCTAVE[octaveIndex].color === "BLACK") {
        key = {
          x: 5 + ((that.model.keyBoard.whiteKeys.length - 1) * 40) + 24,
          index: x,
          octaveIndex: octaveIndex,
          class: "fl-sisiliano-piano-key fl-sisiliano-piano-black-key"
        };
        that.model.keyBoard.blackKeys.push(key);
      }

      if (that.model.keyBoard.keys.length !== 0) {
        key.prev = that.model.keyBoard.keys[that.model.keyBoard.keys.length - 1];
        that.model.keyBoard.keys[that.model.keyBoard.keys.length - 1].next = key;
      }

      that.model.keyBoard.keys.push(key);
    }

    //Adjust the viewBox to fit with the entire div
    that.model.viewBox.width = (that.model.keyBoard.whiteKeys.length * 40) + 5;
  };


  //TODO move to an external file and generalize to other components
  fluid.registerNamespace("fluid." + config.frameworkName + ".util");
  fluid[config.frameworkName].util.templateCache = {};
  fluid[config.frameworkName].util.getTemplate = function (callback, url) {
    var template = fluid[config.frameworkName].util.templateCache[url];
    if (!template) {
      var source = htmlTempl.templates["src/templates/piano.html"];
      template = Handlebars.compile(source);
      fluid[config.frameworkName].util.templateCache[url] = template;
      callback(template);
    } else {
      callback(template);
    }
  };

})(config, fluid, $);