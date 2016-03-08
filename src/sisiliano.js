
(function($, window) {
	var ringCtrl = (function() {
		//HTML template of the ring controller
		var ringCtrlHtml = '<div class="ringCtrl" tabindex="0">'
			+ '<svg width="100%" height="100%">'
			+ '<circle class="ctrl-circle ctrl-circle-background" r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0em"></circle>'
			+ '<circle class="ctrl-circle ctrl-circle-cover"      r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0"></circle>'
			+ '</svg>'
			+ '<div class="ctrl-circle-center"><i class="ctrl-circle-value"></i></div>'
			+ '</div>';
		
		var baseElement = '<div class="sisiliano"></div>';
		
		
		function validateOptions(options, input) {
			for (var key in options) {
				if (input[key] !== undefined) {
					options[key] = input[key];
				}
			}
			
			if (!options.value || typeof options.value !== "number" || options.value === NaN || options.value > 100 || options.value < 0) {
				options.value = 0;
			}
		}
		
		var ringCtrl =function(customOptions) {
			//Default options which can be overriden by the user
			var options = {
				id: null,
				accentColor: "blue",
				coverColor: null,
				textColor: null,
				value: 0
			};
			
			//Model of the ring controller
			var model = {
				//DOM element of the ring controller
				element: null,
				
				innerElement: null,
				
				//Displaying value of the ring
				value: null,
				
				radius: 1,
				circumference: null
			};
			
			validateOptions(options, customOptions);
			
			/**
			 * Initialize the DOM
			 */
			function draw() {
				model.element = $(baseElement);
				model.element.options = options;
				model.innerElement = $(ringCtrlHtml);
				
				$(model.element).on('load', function() {
					console.log("resize");
					var height = $(this).height();
					var width = $(this).width();
					var ringWidth = Math.min(width, height);
					var strokeWidth = ringWidth * 0.21;
					var fontSize = ringWidth / 5;

					model.radius = (ringWidth / 2) - (strokeWidth / 2);
					model.circumference = 2 * model.radius * Math.PI; 
					
					
					$(this).append(model.innerElement);

					$(this).find('.ctrl-circle').css('stroke-width', strokeWidth + "px");
					$(this).find('.ctrl-circle').attr('r', model.radius + "px");
					
					$(this).find('.ringCtrl').css('width', ringWidth + "px");
					$(this).find('.ringCtrl').css('height', ringWidth + "px");
					$(this).find('.ctrl-circle-value').css('font-size', fontSize + "px");
					$(this).find('.ctrl-circle').attr('stroke-dasharray', model.circumference + "px");
					
					
					
					updateValue();
				});
				
				$(model.element).on('load.refresh', function() {
					if (options.accentColor) {
						$(model.element).find('.ctrl-circle-background').css('stroke', options.accentColor);
					}
					
					if (options.coverColor) {
						$(model.element).find('.ctrl-circle-cover').css('stroke', options.coverColor);
					}
					
					if (options.textColor) {
						$(model.element).find('.ctrl-circle-value').css('stroke', options.textColor);
					}
				});
				
				$(model.element).on('keydown', function(evt) {
					if (evt.keyCode == 38 && model.value < 100) {
						model.value++;
					} else if (evt.keyCode == 40 && model.value > 0) {
						model.value--;
					} else {
						return;
					}
					
					updateValue();
					
					return false;
				});
				
				function updateValue() {
					if (!model.value) {
						model.value = options.value;
					}
					
					$(model.innerElement).find('.ctrl-circle-value')[0].innerHTML = Math.round(model.value) + "%";
					
					var offset = -(model.circumference / 100) * Math.round(model.value) + 'px';
					$(model.innerElement).find('.ctrl-circle-cover').attr('stroke-dashoffset', offset);
				}
				
				return model.element;
			}
			
			ringCtrl.prototype.getValue = function() {
				return $(model.element).find('.ctrl-circle-value')[0].innerHTML;
			};
			
			ringCtrl.prototype.element = function() {
				return model.element;
			};
		
			ringCtrl.prototype.setValue = function(value) {
				model.value = value;
				$(model.element).find('.ctrl-circle-value')[0].innerHTML = value;
			};
			
			
			draw();
			//return model.element;
		};
		
		$(window).on('resize', function(evt) {
			//Refreshes all elements to reflect with size changes
			$('.sisiliano').empty();
			$('.sisiliano').load();
		});

		return ringCtrl;
	})();
	

	$.fn.ringCtrl = function(options) {
		var elm = new ringCtrl(options).element();
        this.html(elm);
		elm.load();
    }
	
})($,window);

