QUnit.test("basics of ring slider", function( assert ) {
  var done = assert.async();
  var elm = $('<div style="width:100px; height: 150px"></div>');
  $('body').append(elm);
  assert.equal(elm.html().length, 0, "Element should be empty before the evaluation");
    
  elm.ringCtrl({});
  
  var defaultColor = '#009688';
  var defaultValue = "0%";

  setTimeout(function() {
    assert.notEqual(elm.html().length, 0, "Ring slider should be appended to the element in a while");
    assert.equal(elm.find('.ctrl-circle-value').text(), defaultValue, "Default value '" + defaultValue + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-value').css('fill')), defaultColor, "Default text color '" + defaultColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-cover').css('stroke')), defaultColor, "Default slider color '" + defaultColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-background').css('stroke')), defaultColor, "Default slider color '" + defaultColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-cover').css('fill')), defaultColor, "Default slider color '" + defaultColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-background').css('fill')), defaultColor, "Default slider color '" + defaultColor + "' should have been applied to the slider");
    done();
  }, 10);
});

QUnit.test("Custimizations of ring slider", function( assert ) {
  var done = assert.async();
  var elm = $('<div style="width:100px; height: 150px"></div>');
  $('body').append(elm);
  assert.equal(elm.html().length, 0, "Element should be empty before the evaluation");
    
  elm.ringCtrl({
    value: 30,
    color: 'blue'
  });
  
  var customizedColor = '#0000FF';
  var customizedValue = '30%';

  setTimeout(function() {
    assert.notEqual(elm.html().length, 0, "Ring slider should be appended to the element in a while");
    assert.equal(elm.find('.ctrl-circle-value').text(), customizedValue, "Customized value '" + customizedValue + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-value').css('fill')), customizedColor, "Customized text color '" + customizedColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-cover').css('stroke')), customizedColor, "Customized slider color '" + customizedColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-background').css('stroke')), customizedColor, "Customized slider color '" + customizedColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-cover').css('fill')), customizedColor, "Customized slider color '" + customizedColor + "' should have been applied to the slider");
    assert.equal(toHex(elm.find('.ctrl-circle-background').css('fill')), customizedColor, "Customized slider color '" + customizedColor + "' should have been applied to the slider");
    done();
  }, 10);
});