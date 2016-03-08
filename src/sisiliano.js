
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
		
		
		var ringCtrl =function(options) {
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
			
			/**
			 * Initialize the DOM
			 */
			function draw() {
				model.element = $(baseElement);
				model.element.options = options;
				model.ringElement = $(ringCtrlHtml);
				
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
				
				$(model.element).on('load', function() {
					console.log("resize");
					var height = $(model.element).height();
					var width = $(model.element).width();
					var ringWidth = Math.min(width, height);
					var strokeWidth = ringWidth * 0.21;
					var fontSize = ringWidth / 5;

					model.radius = (ringWidth / 2) - (strokeWidth / 2);
					model.circumference = 2 * model.radius * Math.PI; 
					
					$(model.element).append(model.ringElement);

					$(model.element).find('.ctrl-circle').css('stroke-width', strokeWidth + "px");
					$(model.element).find('.ctrl-circle').attr('r', model.radius + "px");
					
					$(model.element).find('.ringCtrl').css('width', ringWidth + "px");
					$(model.element).find('.ringCtrl').css('height', ringWidth + "px");
					$(model.element).find('.ctrl-circle-value').css('font-size', fontSize + "px");
					$(model.element).find('.ctrl-circle').attr('stroke-dasharray', model.circumference + "px");
					$(model.element).keydown();
				  
				});

				$(model.element).on('keydown', function(evt) {
					if (evt.keyCode == 38 && model.value < 100) {
						model.value++;
					} else if (evt.keyCode == 40 && model.value > 0) {
						model.value--;
					}
					
					$(this).find('.ctrl-circle-value')[0].innerHTML = model.value + "%";
					
					var offset = -(model.circumference / 100) * model.value + 'px';
					$(this).find('.ctrl-circle-cover').attr('stroke-dashoffset', offset);
					
					return false;
				});
				
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
	

	$.fn.ringCtrl = function() {
		var elm = new ringCtrl().element();
        this.html(elm);
		elm.load();
    }
	
})($,window);

