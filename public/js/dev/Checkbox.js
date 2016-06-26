
(function(){

	'use strict';

	function validateCheckbox( object, parent, blocks ) {
		if ( object.is( ':checked' ) ) {
			if ( blocks !== null ) blocks.show();
			parent.addClass( 'checked' );
		}
		else {
			if ( blocks !== null ) blocks.hide();
			parent.removeClass( 'checked' );
		}
	}

	$.fn.checkbox = function( ) {

		$( this ).each( function( ) {

			var chk = $( this );
			var name = (typeof(chk.parent().attr( 'data-checkbox-blc' )) === "undefined") ? "" : chk.parent().attr( 'data-checkbox-blc' );
			var blcs = $( '[data-checkbox="' + name + '"]' );

			var url = window.location.pathname;
			var isParam = url.indexOf( "/c/" );

			blcs = (blcs.length > 0) ? blcs : null;

			chk.wrap( '<span class="checkbox"></span>' );

			var par = chk.parent();

			par.bind( 'click.checkbox', function( e ) {
				if ( $( e.target ).attr( 'type' ) != "checkbox" ) {
					chk.trigger( 'click' );
				}
			} );

			chk.bind( 'change.checkbox', function() {
				validateCheckbox( $( this ), par, blcs );
			} );

			if ( isParam != -1 ) {
				var value = url.substring( isParam + 3 );
				if ( value === name && name !== "" ) {
					chk.attr( 'checked', true );
					validateCheckbox( chk, par, blcs );
				}
			}

		} );

	};

})();
