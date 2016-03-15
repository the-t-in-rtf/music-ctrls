
(function($, window) {
	var ringCtrl = (function() {
		//HTML template of the ring controller
		var ringCtrlHtml = '<div class="ringCtrl" tabindex="0" role="slider" aria-label="Ring Slider" aria-valuemax="100" aria-valuemin="0">'
			+ '<svg width="100%" height="100%">'
			+ '<circle class="ctrl-circle ctrl-circle-background" r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0em"></circle>'
			+ '<circle class="ctrl-circle ctrl-circle-cover"      r="30%" cx="50%" cy="50%" fill="transparent" stroke-dasharray="0em" stroke-dashoffset="0"></circle>'
			+ '</svg>'
			+ '<div class="ctrl-circle-center"><i class="ctrl-circle-value unselectable" role="alert" aria-live="assertive"></i></div>'
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
			options.value = Math.round(options.value);
		}
		
		function updateValue(model) {
			if (typeof model.value != "number") {
				model.value = model.options.value;
			} else if (model.value > 100) {
				model.value = 100;
			} else if (model.value < 0) {
				model.value = 0;
			} 
			
			
			if (model.value <= 100 && model.value >= 0) {
				$(model.innerElement).find('.ctrl-circle-value')[0].innerHTML = model.value + "%";
				
				var offset = -(model.circumference / 100) * model.value + 'px';
				$(model.innerElement).find('.ctrl-circle-cover').attr('stroke-dashoffset', offset);
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
				options: options,
				
				//DOM element of the ring controller
				element: null,
				
				//Status of the element
				status: {
					
					//Previous position of mouse (This is used to mouse event to controll the value)
					prev: {}
				},
				
				//Content element of the ring slider controller
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
					$(model.element).append(model.innerElement);
					model.innerElement.hide();
					
					console.log("resize");
					var height = $(this).height();
					var width = $(this).width();
					var ringWidth = Math.min(width, height);
					var strokeWidth = ringWidth * 0.21;
					var fontSize = ringWidth / 5;
					var elementPosition = $(this).offset();
					
					model.radius = (ringWidth / 2) - (strokeWidth / 2);
					model.circumference = 2 * model.radius * Math.PI; 
					model.center = {
						x: (elementPosition.left + (width / 2)),
						y: (elementPosition.top)
					};
					
					model.innerElement.show();

					$(this).find('.ctrl-circle').css('stroke-width', strokeWidth + "px");
					$(this).find('.ctrl-circle').attr('r', model.radius + "px");
					
					$(this).find('.ringCtrl').css('width', ringWidth + "px");
					$(this).find('.ringCtrl').css('height', ringWidth + "px");
					$(this).find('.ctrl-circle-value').css('font-size', fontSize + "px");
					$(this).find('.ctrl-circle').attr('stroke-dasharray', model.circumference + "px");
					
					updateValue(model);
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
				
				$(model.innerElement).on('keydown', function(evt) {
					if (evt.keyCode == 38) {
						model.value++;
					} else if (evt.keyCode == 40) {
						model.value--;
					} else {
						return;
					}
					
					updateValue(model);
					
					return false;
				});

				$(model.innerElement).on('mousemove', function(evt) {
					if (model.status.mousedown) {
						if (model.status.prev.pageY > evt.pageY) {
							model.value++;
						} else if(model.status.prev.pageY < evt.pageY) {
							model.value--;
						}
					}
					
					model.status.prev.pageX = evt.pageX;
					model.status.prev.pageY = evt.pageY;
					updateValue(model);
				});
				
				/**
					Mouse wheel event
					Ref : http://stackoverflow.com/questions/8189840/get-mouse-wheel-events-in-jquery
				 */
				
				//Firefox
				$(model.innerElement).on('mousewheel', function(e){
					if (model.status.mousedown) {
						if (e.originalEvent.wheelDelta < 0) {
							//scroll down
							model.value--;
						} else {
							//scroll up
							model.value++;
						}
					}

					//prevent page fom scrolling
					updateValue(model);
					return false;
				});
				
				//IE, Opera, Safari
				$(model.innerElement).on('DOMMouseScroll', function(e){
					if (e.originalEvent.wheelDelta < 0) {
						//scroll down
						model.value--;
					} else {
						//scroll up
						model.value++;
					}

					//prevent page fom scrolling
					return false;
				});

				
				$(model.innerElement).on('mousedown', function(evt) {
					model.status.mousedown = true;
					model.status.prev.pageX = evt.pageX;
					model.status.prev.pageY = evt.pageY;
				});
				
				$(model.innerElement).on('mouseup mouseleave', function(evt) {
					model.status.mousedown = false;
				});
				
				
				return model.element;
			}
			
			ringCtrl.prototype.getValue = function() {
				return model.value;
			};
			
			ringCtrl.prototype.element = function() {
				return model.element;
			};
		
			ringCtrl.prototype.setValue = function(value) {
				model.value = value;
				updateValue(model);
			};
			
			
			draw();
			//return model.element;
		};
		
		$(window).on('resize', function(evt) {
			//Refreshes all elements to reflect with size changes
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

