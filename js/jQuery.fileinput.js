/**
 * --------------------------------------------------------------------
 * jQuery customfileinput plugin
 * Author: Scott Jehl, scott@filamentgroup.com
 * Modified By: Lixar I.T
 * Copyright (c) 2009 Filament Group
 * licensed under MIT (filamentgroup.com/examples/mit-license.txt)
 * --------------------------------------------------------------------
 * <input type="file" name="file" class="uploadFileInput" data-allowed="zip, rar" />
 */;
(function($) {
	"use strict";
	$.fn.customFileInput = function(options) {
		options = $.extend({}, $.fn.customFileInput.defaults, options);
		var fileInput = $(this);
		fileInput.addClass('customfile-input');
		fileInput.attr('size', '28'); //width Fix has firefox does not support CSS width for input of type file.

		var ie = (function() {

			var undef,
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');

			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]);

			return v > 4 ? v : undef;

		}());

		//Event Binding
		fileInput.bind({
			click: function() {
				$(this).data('val', fileInput.val());
				setTimeout(function() {
					$(this).trigger('checkChange');
				}, 100);
			},
			checkChange: function() {
				if ($(this).val() !== $(this).data('val')) {
					$(this).trigger('change');
				}
			},
			change: function(e) {

				if (ie <= 9) {
					lessThanIE9($(this), e);
				} else {
					greaterThenIE9anOthers($(this), e);
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

		$(this).wrap(upload);
		uploadButton.insertAfter($(this));
		uploadFeedback.insertAfter($(this));

		//disables input field if this as disabled attribute
		fileInput.each(function() {
			var inputs = $(this),
				disabledInput = inputs.prop('disabled');

			if (disabledInput === true) {
				inputs.parent().addClass('customfile-disabled');
			}
		});

		/**
		 *	Function for Browsers that Support multiple="multiple" attribute.
		 */
		function greaterThenIE9anOthers(element, event) {

			var getFileList = event.target.files,
				getFileListLength = getFileList.length,
				fileToObject = getFileList[0];

			//checking if extensions are valid.
			var fileExtension = [];

			for (var extension = 0; extension < getFileListLength; extension++) {
				fileExtension.push(getFileList[extension].name.split('.').pop().toLowerCase());
			}

			var extensions = element.data('extensions'),
				parent = element.parent(),
				uploadFeedback = parent.find('.customfile-feedback'),
				uploadButton = parent.find('.customfile-button'),
				progressionBar = parent.find('.customfile-progress'),
				fileExtClass = 'customfile-ext-' + fileExtension[0];

			var validExtension = fileExtValidation(extensions, fileExtension);


			if (fileToObject.name !== '' && getFileListLength <= 1) {

				if (validExtension) {
					uploadFeedback.text(fileToObject.name);

					didValidate(uploadFeedback, uploadButton, fileExtClass);

				} else {

					didNotValidate(element, uploadFeedback, uploadButton);

				}

			} else if (fileToObject.name !== '' && getFileListLength > 1) {

				if (validExtension) {

					uploadFeedback.text(getFileListLength + ' files selected.');

					didValidate(uploadFeedback, uploadButton, fileExtClass);

				} else {

					didNotValidate(element, uploadFeedback, uploadButton);

				}

			}
		}

		/**
		 *	Function for Browsers that do not support multiple="multiple" so anything <= IE9
		 */
		function lessThanIE9(element) {
			var fileName = element.val().split(/\\/).pop();

			if (!fileName == '') {

				var fileExtension = fileName.split('.').pop().toLowerCase(),
					extensions = element.data('extensions'),
					parent = element.parent(),
					uploadFeedback = parent.find('.customfile-feedback'),
					uploadButton = parent.find('.customfile-button'),
					progressionBar = parent.find('.customfile-progress'),
					fileExtClass = 'customfile-ext-' + fileExtension;

				var validExtension = fileExtValidation(extensions, [fileExtension]);

				if (validExtension) {
					uploadFeedback.text(fileName);

					didValidate(uploadFeedback, uploadButton, fileExtClass);

				} else {

					didNotValidate(element, uploadFeedback, uploadButton);

				}

			}
		}

		/**
		 *	Validating Extensions
		 */
		function fileExtValidation(validExtensions, choosenFileExtensions) {
			var valid = true;

			if (!validExtensions) {
				throw 'Attribute data-extensions must exist and have a value (data-extensions=\"all\")';
			} else if (validExtensions !== 'all') {

				var splitValidExtensions = validExtensions.split(',');

				for (var ext in choosenFileExtensions) {

					var choosenFileExtension = choosenFileExtensions[ext];
					var validFileExtension = false;

					for (var index in splitValidExtensions) {

						var trimedValidExtension = splitValidExtensions[index].trim();

						if (choosenFileExtension === trimedValidExtension) {
							validFileExtension = true;
							break;
						}

					}

					valid = valid && validFileExtension;

				}

			}

			return valid;
		}

		/**
		 *	Extensions did validate
		 */
		function didValidate(feedback, upButton, fileExtClass) {
			feedback.removeClass(feedback.data('fileext') || '')
				.addClass(fileExtClass)
				.data('fileext', fileExtClass)
				.addClass('customfile-feedback-populated');

			//change text of the upload button
			upButton.text('Change');
		}

		/**
		 *	Extensions did not validate
		 */
		function didNotValidate(element, feedback, upButton) {
			//Use with Caution this will reset your whole form.. to avoid comment out.
			element.parents('form').trigger('reset');

			feedback.text('File extension not supported.').removeClass('' + feedback.data('fileext') + ' customfile-feedback-populated');
			upButton.text('Browse');
		} //END didNotValidate

		//return jQuery
		return $(this);
	};

	$.fn.customFileInput.defaults = {
		feedbackMessage: 'No selected file...'
	};
})(jQuery);
