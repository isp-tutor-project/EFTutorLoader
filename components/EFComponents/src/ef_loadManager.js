/**
ADOBE SYSTEMS INCORPORATED
 Copyright 2016. Adobe Systems Incorporated
 All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file as stand-alone 
		or as bundled with other components useful to End User, in accordance with 
		the terms of the Adobe license agreement accompanying it. You may not delete 
		or in any manner alter the copyright notices, trademarks, logos or related notices, 
		or other proprietary rights notices of Adobe (and its licensors, if any) appearing 
		on or within such File and include a copyright notice reflecting copyright ownership 
		in any files modified by you. And You agree to indemnify, defend and hold Adobe 
		harmless from any and all liabilities (including attorney's fees) arising from any 
		claims, lawsuits, or other legal proceedings that arise from or are related to the 
		use or distribution of any software application product that you reproduced and/or 
		distributed that incorporates these files. If you have received this file from a 
		source other than Adobe, then your use, modification, or distribution of it requires
		 the prior written permission of Adobe.
*/
 
var _widgetID = 0;

EFLoadManager = function() {};
$ = EFLoadManager;

(function ($) {
    "use strict";
    
    $.buildWidget = function( name, prototype ) {

        var existingConstructor, constructor, basePrototype;
			
        var namespace = name.split( "." )[ 0 ];
        name = name.split( "." )[ 1 ];
        var fullName = namespace + "-" + name;

        $[ namespace ] = $[ namespace ] || {};
		existingConstructor = $[ namespace ][ name ];
		
        constructor = $[ namespace ][ name ] = function( options, element ) {
            if ( arguments.length ) {
                this._createWidget( options, element );
            }
        };        
        
		constructor.prototype = prototype;

		return constructor;
		
    } //$.buildWidget	

	
	// Link the library classes to the Tutor Engine inheritance chain.
	//
	$.eflinkLib = function() {

		


	};
	

})(EFLoadManager || {});
