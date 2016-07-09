var NewTerracotta = NewTerracotta || {};

(function(){

	'use strict';

	function TileSearch( params ) {

		var that = this;
		
		params = params || {};
		
		this.cont = $( params.container );
		this.items = $( params.items );
		this.dataSelector = params.data_selector || null;

		this.coloursListObj = [];
		this.searchedColoursCache = {};
		this.iptSearch = $( params.search_input );

		this.processData();

		this.iptSearch.bind('keyup', function(e){
			that.searchColour(e.target.value);
		});

	}

	TileSearch.prototype.processData = function(  ) {

		var that = this;
		this.coloursListObj.length = 0;

		this.items.each(function( index, element ){

			var obj = {};

			if ( that.dataSelector ){
				for (var prop in that.dataSelector ){
					if ( that.dataSelector.hasOwnProperty( prop ) ){
						obj[ prop ] = $( that.dataSelector, element).text();
					}
				}
			}

			obj[ 'id' ] = index;

			that.coloursListObj.push(obj);

		});

	};

	TileSearch.prototype.searchColour = function( valueToSearch ){

		valueToSearch = valueToSearch.toLowerCase();
		var reg = new RegExp( valueToSearch, 'g' );
		var that = this;

		if ( valueToSearch === ''){
			this.items.removeClass( 'dark' );
		}
		//search through the cached obj
		else if ( this.searchedColoursCache[ valueToSearch ] ){

			this.items.addClass( 'dark' );
			this.searchedColoursCache[ valueToSearch ].forEach( function(value){
				that.items.eq( value.id ).removeClass('dark');
			} );

		}
		//filter the array and cache the result
		else {
			this.searchedColoursCache[ valueToSearch ] = this.coloursListObj.filter( function(value){

				if ( reg.test( value.name ) || reg.test( value.code ) ){
					that.items.eq( value.id ).removeClass( 'dark' );
					return value;
				} else {
					that.items.eq( value.id ).addClass('dark');
				}

			} );
		}

	};

	NewTerracotta.TileSearch = TileSearch;

})();
