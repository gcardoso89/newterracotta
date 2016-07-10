var NewTerracotta = NewTerracotta || {};

(function() {

	'use strict';

	function TileCalculator( params ) {

		var that = this;

		params = params || {};

		this._select = $( params.select || '#select-tiles' );
		this._ipt10Extra = $( params.input10Extra || '#ipt-10-extra' );
		this._iptTotalSqm = $( params.inputTotalSqm || '#ipt-estimated-sqm' );
		this._iptTotalTiles = $( params.inputTotalTiles || '#ipt-estimated-tiles' );
		this._iptUser = $( params.inputUser || '#ipt-total-area' );

		that._selectedData = {};

		this._iptUser.bind( 'keyup change', function( e ) {

			that._onUserInput( e.target.value );
			that._calculate();

		} );

		this._select.bind( 'change', function() {
			that._selectedData = $( this ).find( ":selected" ).data();
			that._calculate();
		} );

	}

	TileCalculator.prototype._onUserInput = function( value ) {
		if ( value.indexOf( ',' ) > -1 ) {
			value.replace( ',', '.' );
		}
		value = parseFloat( value );
		this._userInputValue = value;
	};

	TileCalculator.prototype._calculate = function() {

		var totalSqm = this._userInputValue * 1.10;
		var numberOfTiles = this._selectedData.tiles || 0;

		var totalTiles = totalSqm * numberOfTiles;
		totalSqm = totalSqm.toFixed( 2 );
		totalTiles = totalTiles.toFixed( 2 );

		var extr10percent = this._userInputValue * 0.10;
		extr10percent = extr10percent.toFixed( 2 );

		this._ipt10Extra.val( isNaN( extr10percent ) ? '' : extr10percent );
		this._iptTotalSqm.val( isNaN( totalSqm ) ? '' : totalSqm );
		this._iptTotalTiles.val( isNaN( totalTiles ) ? '' : totalTiles );

	};


	NewTerracotta.TileCalculator = TileCalculator;

})();