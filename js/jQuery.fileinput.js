/**
 * --------------------------------------------------------------------
 * jQuery customfileinput plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Modified By: Lixar I.T
 * Copyright (c) 2009 Filament Group
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 * <input type="file" name="file" class="uploadFileInput" data-extensions="all" || data-extensions="zip,png" />
 */
;(function ($) {
	"use strict";
	$.fn.customFileInput = function(options) {
		options = $.extend({}, $.fn.customFileInput.defaults, options);
		var fileInput = $(this);
		fileInput.addClass('customfile-input');
		fileInput.attr('size', '28'); //width Fix has firefox does not support CSS width for input of type file.

		fileInput.bind({
			click: function(){
				$(this).data('val', fileInput.val());
				setTimeout(function() {
					$(this).trigger('checkChange');
				}, 100);
			},
			checkChange: function(){
				if ($(this).val() !== $(this).data('val')) {
					$(this).trigger('change');
				}
			},
			change: function(e){

				//Multiple file Selection
				var getFileList = e.target.files,
					getFileListLength = getFileList.length,
					fileToObject = getFileList[0];


				var extensions = $(this).data('extensions'),
					parent = $(this).parent(),
					uploadFeedback = parent.find('.customfile-feedback'),
					uploadButton = parent.find('.customfile-button');

				//checking if extensions are valid.
				var fileExtension = [];
				for(var e = 0; e < getFileListLength; e++){
					fileExtension.push( getFileList[e].name.split('.').pop().toLowerCase() );
				}

				var validExtension = fileExtValidation(extensions, fileExtension);
				var fileExtClass = 'customfile-ext-' + fileExtension[0];


				if(fileToObject.name !== '' && getFileListLength <= 1){

					if (validExtension) {
						uploadFeedback.text(fileToObject.name) //set feedback text to filename
						.removeClass(uploadFeedback.data('fileext') || '') //remove any existing file extension class
						.addClass(fileExtClass) //add file extension class
						.data('fileext', fileExtClass) //store file extension for class removal on next change
						.addClass('customfile-feedback-populated'); //add class to show populated state

						//change text of button
						uploadButton.text('Change');
					} else {
						//To use with caution Might reset all form elements
						$(this).parents('form').trigger('reset');

						uploadFeedback.text('Extension not supported.').removeClass('' + uploadFeedback.data('fileext') + ' customfile-feedback-populated');
						uploadButton.text('Browse');
					}

				} else if(fileToObject.name !== '' && getFileListLength > 1){

					if (validExtension) {

						uploadFeedback.text(getFileListLength + ' files selected.')
						.removeClass(uploadFeedback.data('fileext') || '')
						.addClass(fileExtClass)
						.data('fileext', fileExtClass)
						.addClass('customfile-feedback-populated');

						uploadButton.text('Change');
					} else {
						//To use with caution Might reset all form elements
						$(this).parents('form').trigger('reset');

						uploadFeedback.text('1 or more file as an invalid extension.').removeClass('' + uploadFeedback.data('fileext') + ' customfile-feedback-populated');
						uploadButton.text('Browse');
					}

				}

			}
		});

		//create custom control container
		var upload = $('<div/>', {
			'class': 'customfile'
		});

		//create custom control button
		var uploadButton = $('<span/>', {
			text: 'Browse',
			'class': 'customfile-button orangeButton',
			"aria-hidden": 'true'
		});

		//create custom control feedback
		var uploadFeedback = $('<span/>', {
			text: options.feedbackMessage,
			'class': 'customfile-feedback',
			'aria-hidden': 'true'
		});

		//create custom control upload Porgress bar
		var uploadProgress = $('<div/>', {
			html: '<span></span>',
			'class': 'customfile-progress',
			"aria-hidden": 'true',
			style: 'display: none;'
		});

		$(this).wrap(upload);
		uploadButton.insertAfter($(this));
		uploadFeedback.insertAfter($(this));

		fileInput.each(function(){
			var inputs = $(this),
				disabledInput = inputs.prop('disabled');

			if(disabledInput === true){
				inputs.parent().addClass('customfile-disabled');
			}
		});

		function fileExtValidation(validExtensions, choosenFileExtensions){
			var valid = true;

			if(!validExtensions){
				throw 'Attribute data-extensions must exist and have a value (data-extensions=\"all\")';
			} else if(validExtensions != 'all'){

				var splitValidExtensions = validExtensions.split(',');

				for (var ext in choosenFileExtensions){

					var choosenFileExtension = choosenFileExtensions[ext];
					var validFileExtension = false;

					for (var index in splitValidExtensions) {

						var trimedValidExtension = splitValidExtensions[index].trim();

						if(choosenFileExtension === trimedValidExtension){
							validFileExtension = true;
							break;
						}

					}

					valid = valid && validFileExtension;

				}

			}

			return valid;
		}

		//return jQuery
		return $(this);
	};

	$.fn.customFileInput.defaults = {
		feedbackMessage : 'No selected file...'
	};
})(jQuery);
