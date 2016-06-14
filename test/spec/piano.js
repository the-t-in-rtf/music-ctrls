(function(fluid, QUnit) {
    "use strict";

    QUnit.test("basics of piano", function(assert) {
        var done = assert.async();

        fluid.sisiliano.piano(".test");
        setTimeout(function() {
            assert.notEqual($(".test").html().length, 0, "Piano should be appended to the element in a while");
            done();
        }, 2);
    });

    QUnit.test("Custimizations of piano", function(assert) {
        var done = assert.async();

        fluid.sisiliano.piano(".test", {
            value: 30,
            color: "blue"
        });
        setTimeout(function() {
            assert.notEqual($(".test").html().length, 0, "Piano should be appended to the element in a while");
            done();
        }, 2);
    });
})(fluid, QUnit);