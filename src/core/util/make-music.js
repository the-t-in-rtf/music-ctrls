/**
 * Created by VDESIDI on 8/2/2016.
 */

(function (fluid) {
    "use strict";

    fluid.defaults("sisiliano.util.makeMusic", {
        gradeNames: ["fluid.component"],
        listeners: {
            onCreate: {
                func: "sisiliano.util.makeMusic.onCreate",
                args: ["{that}"]
            }
        },
        invokers: {
            play: {
                funcName: "sisiliano.util.makeMusic.play",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            release: {
                funcName: "sisiliano.util.makeMusic.release",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            }
        },
        context: null,
        masterGain: null,
        nodes: {}
    });

    sisiliano.util.makeMusic.onCreate = function (that) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        that.context = new AudioContext();
        that.nodes = {};
        if (that.context) {
            that.masterGain = that.context.createGain();
            that.masterGain.gain.value = 0.3;
            that.masterGain.connect(that.context.destination);
        }
    };

    sisiliano.util.makeMusic.play = function (that, index, frequency) {
        var oscillator = that.context.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = frequency;
        oscillator.connect(that.masterGain);
        oscillator.start(0);
        that.nodes[index] = oscillator;
    };

    sisiliano.util.makeMusic.release = function (that, index) {
        var node = that.nodes[index];
        if (node) {
            node.stop(0);
            node.disconnect();
            that.nodes[index] = null;
        }
    };
})(fluid);