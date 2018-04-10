
(function($) {    

	// Register a component with the className: my.Image,
	// and prototype with the following overrides 
	// getCreateOptions
	// getCreateString
	// getProperties
	// getAttributes  test
    $.buildWidget("ef.TutorEngine", {
        options: {
			'visible': false,
			'position': 'absolute'
        },
		_props: ["left", "top", "width", "height", "position", "transform-origin", "transform"],
		_attrs: ["id", "src", "alt", "class", "border"],

		_createWidget: function( options, element ) {

			var comp=AdobeAn.getComposition(options.compositionID);

			// Inject a static property pointing to the Animate library.
			//
			$.efLibrary = comp.getLibrary();
			$.rootTutor = options.tutorID;
			$.options   = options;
			$.loaded     = true;
		},		
		
		// Add functions required by AnimateCC
		//
		create: function(){},
		attach: function(){},
		setProperty: function(k, v) {},
		update: function(force) {}

	});   

})(EFLoadManager);