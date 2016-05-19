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
        length: 48,
        start: 5,
        keyCodeListenerMap: {},
        whiteKey: {
          width: 40,
          height: 150
        },
        blackKey: {
          width: 27,
          height: 100
        },
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
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
      "viewBox": {
        func: "fluid." + config.frameworkName + ".piano.onChange",
        args: ["{that}", "{change}"]
      }
    }
  });

  fluid[config.frameworkName].piano.onChange = function() {
    console.log("onChange");
  };

  fluid[config.frameworkName].piano.onCreate = function (that) {
    fluid[config.frameworkName].piano.generateKeyboard(that);
    fluid[config.frameworkName].piano.appendListeners(that);
    fluid[config.frameworkName].piano.moveTabBy(that, 0);
    fluid[config.frameworkName].piano.refresh(that);
    fluid[config.frameworkName].piano.updateTheDisabledAreaUI(that);
  };

  fluid[config.frameworkName].piano.refresh = function (that) {
    fluid[config.frameworkName].util.getTemplate(function(template) {
      var html = template(that.model);
      that.container.html(html);
    }, "src/templates/piano.html");
  };

  fluid[config.frameworkName].piano.updateTheDisabledAreaUI = function(that) {
    var keyElms = that.container.find('.fl-sisiliano-piano-key');
    for (var i = 0; i < keyElms.length; i++) {
      fluid[config.frameworkName].util.removeClass(keyElms[i], 'fl-sisiliano-piano-key-pressed');
    }

    var whiteKeyElms = that.container.find(".fl-sisiliano-piano-white-key");
    for (i = 0; i < whiteKeyElms.length; i++) {
      if (i >= that.model.activeArea.start && i <= that.model.activeArea.end) {
        fluid[config.frameworkName].util.removeClass(whiteKeyElms[i], 'fl-sisiliano-piano-key-inactive');
      } else {
        fluid[config.frameworkName].util.addClass(whiteKeyElms[i], 'fl-sisiliano-piano-key-inactive');
      }
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
    that.model.disabledArea.left.width = that.model.activeArea.start * that.model.keyBoard.whiteKey.width;
    that.model.disabledArea.right.width = (that.model.keyBoard.whiteKeys.length - that.model.activeArea.end) * that.model.keyBoard.whiteKey.width;
    if (that.model.activeArea.end < that.model.keyBoard.whiteKeys.length) {
      that.model.disabledArea.right.x = that.model.keyBoard.whiteKeys[that.model.activeArea.end].x + that.model.keyBoard.whiteKey.width;
    }
  };

  fluid[config.frameworkName].piano.appendListeners = function (that) {
    var pianoKeyCodes = fluid[config.frameworkName].piano.COMPUTER_KEYBOARD_CODES_FOR_PIANO;
    var keyCodeListenerMap = that.model.keyBoard.keyCodeListenerMap;
    
    //To produce the music
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new window.AudioContext();
    masterGain = context.createGain();
    nodes = {};
    masterGain.gain.value = 0.3;
    masterGain.connect(context.destination);
    
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

    /*var triangular = function (value) {
      var abs = Math.abs(value);
      return ((abs / 2) * (abs + 1)) * (abs / value) || 0;
    };*/

    var getFreequency = function(octave, octaveIndex) {
      return Math.pow(2,octave) * frequencyMap[octaveIndex];
    };

    that.container.on('keydown', function(evt) {
      var keyCode = evt.keyCode;
      var mappedPianoKey = keyCodeListenerMap[keyCode];
      if (mappedPianoKey) {
        if (mappedPianoKey.statusClass !== 'fl-sisiliano-piano-key-pressed') {
          mappedPianoKey.statusClass = 'fl-sisiliano-piano-key-pressed';
          updateKeyStatus(that, mappedPianoKey);

          var oscillator = context.createOscillator();
          oscillator.type = 'square';
          oscillator.frequency.value = getFreequency(mappedPianoKey.octave, mappedPianoKey.octaveIndex);
          console.log("mappedPianoKey.octave : " + mappedPianoKey.octave + " -- mappedPianoKey.octaveIndex : " + mappedPianoKey.octaveIndex);
          oscillator.connect(masterGain);
          oscillator.start(0);
          nodes[mappedPianoKey.index] = oscillator;
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

      return false;
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

          var node = nodes[mappedPianoKey.index];
          nodes[mappedPianoKey.index] = null;
          node.stop(0);
          node.disconnect();
        }
      } else {
        console.log("keyup : not found");
      }

      return false;
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
    that.model.keyBoard.blackKey.width = (((that.model.keyBoard.whiteKey.width - 1) / 3) * 2) + 1;
    that.model.keyBoard.blackKey.height = (that.model.keyBoard.whiteKey.height / 3) * 2;

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
          x: that.model.keyBoard.padding.left + (that.model.keyBoard.whiteKeys.length * that.model.keyBoard.whiteKey.width),
          y: that.model.keyBoard.padding.top,
          width: that.model.keyBoard.whiteKey.width - 1,
          height: that.model.keyBoard.whiteKey.height,
          index: x,
          octave: Math.floor(x/12),
          octaveIndex: octaveIndex,
          class: "fl-sisiliano-piano-key fl-sisiliano-piano-white-key"
        };
        that.model.keyBoard.whiteKeys.push(key);
      } else if (fluid[config.frameworkName].piano.OCTAVE[octaveIndex].color === "BLACK") {
        key = {
          x: that.model.keyBoard.padding.left + ((that.model.keyBoard.whiteKeys.length - 1) * that.model.keyBoard.whiteKey.width) + ((that.model.keyBoard.whiteKey.width / 3) * 2),
          y: that.model.keyBoard.padding.top,
          width: that.model.keyBoard.blackKey.width,
          height: that.model.keyBoard.blackKey.height,
          index: x,
          octave: Math.floor(x/12),
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
    that.model.viewBox.width = (that.model.keyBoard.whiteKeys.length * that.model.keyBoard.whiteKey.width) +
                              that.model.keyBoard.padding.left + that.model.keyBoard.padding.right;
    that.model.viewBox.height = that.model.keyBoard.whiteKey.height +
                              that.model.keyBoard.padding.top + that.model.keyBoard.padding.bottom;
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

  fluid[config.frameworkName].util.addClass = function(elm, className) {
    fluid[config.frameworkName].util.removeClass(elm, className);
    var oldClass = $(elm).attr('class');
    var newClass = oldClass + ' ' + className;
    $(elm).attr('class', newClass);
  };

  fluid[config.frameworkName].util.removeClass = function(elm, className) {
    var oldClass = $(elm).attr('class');
    var newClass = oldClass.replace(new RegExp(' ' + className, 'g'), "").replace(new RegExp(className, 'g'), "");
    $(elm).attr('class', newClass);
  };

})(config, fluid, $);