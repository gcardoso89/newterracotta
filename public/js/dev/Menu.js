var NewTerracotta = NewTerracotta || {};

(function(){

	'use strict';

	function Menu( params ) {

		var that = this;

		this._cont = $( params.content );
		this._nav = $( params.navigation, this._cont );
		this._items = $( params.items, this._nav );
		this._subClass = params.sub_menu;
		this._sub = $( this._subClass, this._items );
		this._win = $( window );
		this._subMenuShown = false;
		this._isLocked = false;

		this._disableSize = params.disableSize || 1024;

		this._items.bind( 'mouseenter.Menu', menuOver );
		this._items.bind( 'mouseleave.Menu', menuOut );
		this._win.bind( 'resize', resizeHandler );

		function resizeHandler() {
			that._onResizeHandler();
		}

		function menuOver() {
			that._onMenuOver( $(this) );
		}

		function menuOut() {
			that._onMenuOut( $(this) );
		}

		resizeHandler();

	}

	Menu.prototype._onMenuOver = function( element ) {

		if ( this._isLocked ) return;

		var sub = $( this._subClass, element );
		sub.stop( true, true );
		sub.slideDown();

	};

	Menu.prototype._onMenuOut = function( element ) {

		if ( this._isLocked ) return;
		var sub = $( this._subClass, element );
		sub.stop( true, true );
		sub.slideUp();

	};

	Menu.prototype._onResizeHandler = function(  ){

		this._sub.height( 'auto' );
		this._isLocked = this._win.width() <= this._disableSize;

		if ( this._isLocked && !this._subMenuShown ){
			this._sub.show();
			this._subMenuShown = true;
		} else if ( !this._isLocked && this._subMenuShown ) {
			this._sub.hide();
			this._subMenuShown = false;
		}

	};

	NewTerracotta.Menu = Menu;

})();