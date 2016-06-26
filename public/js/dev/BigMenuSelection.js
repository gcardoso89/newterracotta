var NewTerracotta = NewTerracotta || {};

(function() {

	'use strict';

	function BigMenuSelection( params ) {

		params = params || {};

		this._container = $( params.container );
		this._button = $( params.button, this._container );
		this._menu = $( params.selector, this._container );
		this._close = $( params.close, this._container );

		this._button.bind( 'click.Main', this._onClickButton.bind( this ) );
		this._close.bind( 'click.Main', this._onClickClose.bind( this ) );

	}

	BigMenuSelection.prototype._onClickButton = function( e ) {
		e.preventDefault();
		if ( !this._isVisible ) {
			this._menu.show();
			this._isVisible = true;
		}
	};

	BigMenuSelection.prototype._onClickClose = function( e ) {
		e.preventDefault();
		if ( this._isVisible ) {
			this._menu.hide();
			this._isVisible = false;
		}
	};


	NewTerracotta.BigMenuSelection = BigMenuSelection;

})();