/**
 * --------------------------------------------------------------------
 * jQuery customfileinput plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Modified by: Lixar I.T
 * Copyright (c) 2009 Filament Group
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 */
;(function ($) {
	$.fn.customFileInput = function(options) {
		var options = $.extend({}, $.fn.customFileInput.defaults, options);
		var fileInput = $(this);
		fileInput.addClass('customfile-input');
		
		//apply events and styles for file input element
		$(this).bind({
			disable: function(){			
				$(this).prop('disabled', true);
				upload.addClass('customfile-disabled');
			},
			enable: function(){
				$(this).removeProp('disabled');
				upload.removeClass('customfile-disabled');
			},
			checkChange: function(){
				if ($(this).val() && $(this).val() != $(this).data('val')) {
					$(this).trigger('change');
				}
			},
			change: function(){
				var fileName = $(this).val().split(/\\/).pop(),
					fileExtension = fileName.split('.').pop().toLowerCase(),
					fileExtClass = 'customfile-ext-' + fileExtension,
					uploadFeedback = $(this).parent().find('.customfile-feedback'),
					uploadButton = $(this).parent().find('.customfile-button');
				
				uploadFeedback.text(fileName) //set feedback text to filename
				.removeClass(uploadFeedback.data('fileext') || '') //remove any existing file extension class
				.addClass(fileExtClass) //add file extension class
				.data('fileext', fileExtClass) //store file extension for class removal on next change
				.addClass('customfile-feedback-populated'); //add class to show populated state
				
				//change text of button
				uploadButton.text('Change');
			},
			click: function(){
				fileInput.data('val', fileInput.val());
				setTimeout(function() {
					fileInput.trigger('checkChange');
				}, 100);
			}
		});
	
		//create custom control container
		var upload = $('<div/>', {
			'class': 'customfile'
		});
		
		//create custom control button
		var uploadButton = $('<span/>', {
			text: 'Browse',
			'class': 'customfile-button',
			"aria-hidden": 'true'
		});
		
		//create custom control feedback
		var uploadFeedback = $('<span/>', {
			text: options.feedbackMessage,
			'class': 'customfile-feedback',
			'aria-hidden': 'true'
		});
		
		//match disabled state
		if ($(this).is('[disabled]')) {
			$(this).trigger('disable');
		}
		
		$(this).wrap(upload);
		uploadButton.insertAfter($(this));
		uploadFeedback.insertAfter($(this));
		
		//return jQuery
		return $(this);
	};
	
	$.fn.customFileInput.defaults = {
		feedbackMessage : 'No selected file...'
	};
})(jQuery);
