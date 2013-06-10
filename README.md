[(jQuery)](http://jquery.com) Custom File input 
================================ 
This Plugin supports disabled="disabled" and multiple="multiple" attribute

Basic Usage
================================
`<input type="file" name="file" class="file" data-extensions="all" />` Accepts all extensions <br/>
`<input type="file" name="file" class="file" data-extensions="zip,png" />` Accepts Custom Extensions User defined <br/>

```js
$(document).ready(function(){
	$('.file').customFileInput();
});
```

Custom Usage
================================
```js
$(document).ready(function(){
	$('.file').customFileInput({
		feedbackMessage : 'Currently no Selected File...'
	});
});
```

This repository includes open-sourced code developed and maintained by Lixar I.T.

All examples use the [jQuery library](http://jquery.com).

Credit to [Filament Group, Inc.](http://filamentgroup.com/lab/jquery_custom_file_input_book_designing_with_progressive_enhancement/) for original code.  
