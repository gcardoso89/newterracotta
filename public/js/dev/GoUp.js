var NewTerracotta = NewTerracotta || {};

(function() {

	'use strict';

	function GoUp( params ) {

		params = params || {};

		this._btnUp = $( params.btn_up || '.btn-up' );

		this._btnUp.bind('click.Main', this._onClickBtnUp.bind(this) );
		this._scrollable = $('html, body');

	}

	GoUp.prototype._onClickBtnUp = function( e ) {
		e.preventDefault();
		this._scrollable.animate({ scrollTop : 0 }, 600);
	};

	NewTerracotta.GoUp = GoUp;

})();
