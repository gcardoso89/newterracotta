var NewTerracotta = NewTerracotta || {};

(function(){

	'use strict';

	function ResponsiveMenu( params ) {

		var that = this;
		this._cont = $( params.content );
		this._button = $( params.button, this._cont );
		this._menu = $( params.menu, this._cont );
		this._win = $( window );
		this._close = $( params.close, this._cont );
		this._minWidth = params.minWidth || 1024;

		this._win.bind( 'resize', function(){
			that._onResize();
		} );

		this._button.bind( 'click', function(e){
			e.preventDefault();
			that._onButtonClick( $(this) );
		} );

		this._close.bind( 'click', function(e){
			e.preventDefault();
			that._onCloseClick( $(this) );
		} );

		this._onResize();

	}

	ResponsiveMenu.prototype._onResize = function( ){

		if ( this._win.width() <= this._minWidth ){
			this._button.show();
		}

	};

	ResponsiveMenu.prototype._onButtonClick = function( element ){

		this._menu.addClass( 'opened' );

	};

	ResponsiveMenu.prototype._onCloseClick = function( element ){

		this._menu.removeClass( 'opened' );

	};

	NewTerracotta.ResponsiveMenu = ResponsiveMenu;

})();