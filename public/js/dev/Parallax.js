var NewTerracotta = NewTerracotta || {};

(function() {

	'use strict';

	function Parallax( params ) {

		params = params || {};

		this._containers = $( params.containers || '.parallax' );
		this._images = $('> img', this._containers);
		this._velocity = params.velocity || 0.8;
		this._win = $(window);


		this._win.bind( 'scroll.Parallax', this._scrollHandler.bind(this) );

	}

	Parallax.prototype._scrollHandler = function( e ) {

		var that = this;
		var windowTop = this._win.scrollTop();

		this._images.each(function() {

			var element = $(this);
			var previous = element.data( 'previous' ) || 0;
			var position = element.offset().top - previous;
			var finalPosition = ( windowTop >= position ) ? ( ( windowTop - position ) * that._velocity ) : 0;
			element.data( 'previous', finalPosition );
			element.css( 'transform', 'translate3d(0px, ' + finalPosition + 'px, 0px)' );

		})

	};

	NewTerracotta.Parallax = Parallax;

})();
