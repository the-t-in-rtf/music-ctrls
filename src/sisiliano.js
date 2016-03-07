
(function($, window) {
	var ringCtrl = (function() {
		var ringCtrl = function(options) {
			draw();
			return model.element;
		};
		
		//Default options which can be overriden by the user
		var options = {
			accentColor: "blue",
			coverColor: null,
			textColor: null
		};
		
		//Model of the ring controller
		var model = {
			//DOM element of the ring controller
			element: null,
			
			//Displaying value of the ring
			value: 0,
			
			radius: 1,
			circumference: null
		};
		
		//HTML template of the ring controller
		var ringCtrlHtml = '<div class="sisiliano"><div class="ringCtrl" tabindex="0">'
			+ '<svg width="100%" height="100%">'
			+ '<circle class="ctrl-circle ctrl-circle-background" r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0em"></circle>'
			+ '<circle class="ctrl-circle ctrl-circle-cover"      r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0"></circle>'
			+ '</svg>'
			+ '<div class="ctrl-circle-center"><i class="ctrl-circle-value"></i></div>'
			+ '</div></div>';
		
		/**
		 * Initialize the DOM
		 */
		function draw() {
			model.element = $(ringCtrlHtml);
			model.element.options = options;
			
			$(this).on('load.refresh', function() {
				if (options.accentColor) {
					$(model.element).find('.ctrl-circle-background').css('stroke', options.accentColor);
				}
				
				if (options.coverColor) {
					$(model.element).find('.ctrl-circle-cover').css('stroke', options.coverColor);
				}
				
				if (options.textColor) {
					$(model.element).find('.ctrl-circle-value').css('stroke', options.textColor);
				}
				
				$(model.element).resize();
			});
			
			$(window).on('resize', function() {
				console.log("resize");
				var height = $(model.element).height();
				var width = $(model.element).width();
				var ringWidth = Math.min(width, height);
				var strokeWidth = ringWidth * 0.21;
				var fontSize = ringWidth / 5;

				radius = (ringWidth / 2) - (strokeWidth / 2);
				circumference = 2 * radius * Math.PI; 

				$(model.element).find('.ctrl-circle').css('stroke-width', strokeWidth + "px");
				$(model.element).find('.ctrl-circle').attr('r', radius + "px");
				
				$(model.element).find('.ringCtrl').css('width', ringWidth + "px");
				$(model.element).find('.ringCtrl').css('height', ringWidth + "px");
				$(model.element).find('.ctrl-circle-value').css('font-size', fontSize + "px");
				$(model.element).find('.ctrl-circle').attr('stroke-dasharray', circumference + "px");
				$(model.element).keydown();
			  
			});
			
			$(model.element).on('load', function() {
				$(this).resize();
			});

			$(model.element).on('keydown', function(evt) {
				if (evt.keyCode == 38 && model.value < 100) {
					model.value++;
				} else if (evt.keyCode == 40 && model.value > 0) {
					model.value--;
				}
				
				$(this).find('.ctrl-circle-value')[0].innerHTML = model.value + "%";
				
				var offset = -(circumference / 100) * model.value + 'px';
				$(this).find('.ctrl-circle-cover').attr('stroke-dashoffset', offset);
			});
			
			return model.element;
		}
		
		ringCtrl.prototype.getValue = function() {
			return $(model.element).find('.ctrl-circle-value')[0].innerHTML;
		};
	
		ringCtrl.prototype.setValue = function(value) {
			model.value = value;
			$(model.element).find('.ctrl-circle-value')[0].innerHTML = value;
		};
		
		return ringCtrl;
	})();
	
	window.sisiliano = {
		ringCtrl: ringCtrl,
		xyPad: null, //TODO
		slider: null, //TODO
	}
	
})($,window);



$(document).on('ready', function() {
	var circleHtml = '<svg width="100%" height="100%" tabindex="0">'
		+ '<circle class="ctrl-circle ctrl-circle-background" r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0em"></circle>'
		+ '<circle class="ctrl-circle ctrl-circle-cover"      r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0"></circle>'
		+ '<text class="ctrl-circle-value" x="5em" y="5em">0%</text>'
		+ '</svg>';

	$.fn.ctrlCircle = function() {
		this.html(circleHtml);
		var self = this;
		var radius;
		var circumference;
		var value = 0;
		
		$(window).on('resize', function() {
	      console.log("resize");
		  var height = $(self).height();
		  var width = $(self).width();
		  var strokeWidth = $(self).find('.ctrl-circle').css('stroke-width').replace('px', '');
		  try {
			strokeWidth = eval(strokeWidth);
		  } catch (err) {
			strokeWidth = 30;
		  }
		
		  radius = (Math.min(width, height) / 2) - (strokeWidth / 2);
		  circumference = 2 * radius * Math.PI; 
		  
		  $(self).find('.ctrl-circle').attr('r', radius + "px");
		  $(self).find('.ctrl-circle').attr('stroke-dasharray', circumference + "px");
		  
		  //document.querySelector('.ctrl-circle-center').setAttribute('r', (radius - 0.01 + 'em'));
		  $(self).keydown();
		  
		});

		$(this).on('keydown', function(evt) {
			if (evt.keyCode == 38 && value < 100) {
				value++;
			} else if (evt.keyCode == 40 && value > 0) {
				value--;
			}
			
			$(this).find('.ctrl-circle-value')[0].innerHTML = value + "%";
			
			var offset = -(circumference / 100) * value + 'px';
			document.querySelector('.ctrl-circle-cover').setAttribute('stroke-dashoffset', offset);
		});
		
		//$(this).resize();
	}

	
	
});