(function(fluid, QUnit) {
    "use strict";

    QUnit.test("basics of piano", function(assert) {
        var done = assert.async();
        var elm = $("<div class='test1' style='width:100px; height: 150px'></div>");
        $(".test1").remove();
        $("body").append(elm);
        assert.equal(elm.html().length, 0, "Element should be empty before the evaluation");

        fluid.sisiliano.piano(".test1");

        setTimeout(function() {
            assert.notEqual(elm.html().length, 0, "Piano should be appended to the element in a while");
            done();
        }, 2);
    });

    QUnit.test("Custimizations of piano", function(assert) {
        var done = assert.async();
        var elm = $("<div class='test2' style='width:100px; height: 150px'></div>");
        $(".test2").remove();
        $("body").append(elm);
        assert.equal(elm.html().length, 0, "Element should be empty before the evaluation");

        fluid.sisiliano.piano(".test2", {
            value: 30,
            color: "blue"
        });

        setTimeout(function() {
            assert.notEqual(elm.html().length, 0, "Piano should be appended to the element in a while");
            done();
        }, 2);
    });
})(fluid, QUnit);