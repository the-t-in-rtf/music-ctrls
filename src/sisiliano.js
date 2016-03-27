
/*global jQuery, fluid*/

(function($) {
  "use strict";

  fluid.defaults("sisiliano.knob", {
    gradeNames: ["fluid.viewComponent", "autoInit", "fluid.eventedComponent"],
    preInitFunction: "sisiliano.knob.preInitFunction",
    postInitFunction: "sisiliano.knob.postInitFunction",
    model: {
      color: "#009688",
      value: 0,
      status: {
        prev: {}
      }
    },
    events: {
      change: null,
      onChange: null,
      onClick: null
    }
  });

  sisiliano.knob.preInitFunction = function (that) {
    that.container.html(htmlTempl.templates["src/templates/ringCtrl.html"]);
  };
  
  sisiliano.knob.postInitFunction = function (that) {
    function updateValue(model) {
      if (typeof model.value != "number") {
        model.value = model.options.value;
      } else if (model.value > 100) {
        model.value = 100;
      } else if (model.value < 0) {
        model.value = 0;
      } 
      
      if (model.value <= 100 && model.value >= 0) {
        that.container.find('.ctrl-circle-value').text(model.value + "%");
        
        var offset = ((model.circumference / 100) * (100 - model.value)) + 'px';
        that.container.find('.ctrl-circle-cover').attr('stroke-dashoffset', offset);
      }
      
      that.events.onChange.fire(that.model.value);
    }
    
    function validateOptions(options, input) {
      for (var key in options) {
        if (input[key] !== undefined) {
          options[key] = input[key];
        }
      }
      
      if (!options.value || typeof options.value !== "number" || isNaN(options.value) || options.value > 100 || options.value < 0) {
        options.value = 0;
      }
      options.value = Math.round(options.value);
    }
    
    function endFocus() {
      that.container.find('.ctrl-circle').css('animation', '');
      that.container.find('.ctrl-circle').css('animation', 'rotate 0.5s');
      setTimeout(function() {
        that.container.find('.ctrl-circle').css('animation', '');
      }, 1000);
    }
  
    validateOptions(that.model, that.options);
    
    that.draw = function () {
      var circleRadius = parseInt(that.container.find('.ctrl-circle').attr('r'));
      that.model.radius = circleRadius;
      that.model.circumference = 2 * that.model.radius * Math.PI; 
      that.container.find('.ctrl-circle').attr('stroke-dasharray', that.model.circumference + "px");
      
      if (that.model.color) {
        that.container.find('.ctrl-circle-cover').css('stroke', that.model.color);
        that.container.find('.ctrl-circle-background').css('stroke', that.model.color);
        that.container.find('.ctrl-circle-cover').css('fill', that.model.color);
        that.container.find('.ctrl-circle-background').css('fill', that.model.color);
        that.container.find('.ctrl-circle-value').css('fill', that.model.color);
      }
      
      updateValue(that.model);
    };
    
    that.container.on('keydown', function(evt) {
      if (evt.keyCode == 38) {
        that.model.value++;
        updateValue(that.model);
        return false;
      } else if (evt.keyCode == 40) {
        that.model.value--;
        updateValue(that.model);
        return false;
      } else {
        return;
      }
    });

    that.container.on('mousemove', '.ctrl', function(evt) {
      if (that.model.status.mousedown) {
        if (that.model.status.prev.pageY > evt.pageY) {
          that.model.value++;
        } else if(that.model.status.prev.pageY < evt.pageY) {
          that.model.value--;
        }
        
        updateValue(that.model);
      }
      
      that.model.status.prev.pageX = evt.pageX;
      that.model.status.prev.pageY = evt.pageY;
      
    });
    
    /**
      Mouse wheel event
      Ref : http://stackoverflow.com/questions/8189840/get-mouse-wheel-events-in-jquery
     */
    
    //Firefox
    that.container.on('mousewheel', '.ctrl', function(e){
      if (that.model.status.mousedown) {
        if (e.originalEvent.wheelDelta < 0) {
          //scroll down
          that.model.value--;
        } else {
          //scroll up
          that.model.value++;
        }
        
        updateValue(that.model);
      }

      //prevent page fom scrolling
      return false;
    });
    
    //IE, Opera, Safari
    that.container.on('DOMMouseScroll', '.ctrl', function(e){
      if (e.originalEvent.wheelDelta < 0) {
        //scroll down
        that.model.value--;
      } else {
        //scroll up
        that.model.value++;
      }

      //prevent page fom scrolling
      return false;
    });
    
    that.container.on('mousedown', '.ctrl', function(evt) {
      that.model.status.mousedown = true;
      that.model.status.prev.pageX = evt.pageX;
      that.model.status.prev.pageY = evt.pageY;
    });
    
    that.container.on('mouseup mouseleave', '.ctrl', function(evt) {
      that.model.status.mousedown = false;
      endFocus();
    });
    
    that.container.on('focusout blur', function(evt) {
      that.model.status.mousedown = false;
      endFocus();
    });
  };
})($);


