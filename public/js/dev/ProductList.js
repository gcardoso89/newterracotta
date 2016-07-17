var NewTerracotta = NewTerracotta || {};

(function() {

	class ProductList {

		constructor( params ) {

			params = params || {};

			var that = this;

			this._prodList = $( params.list || '.prod-list' );
			this._win = $( window );

			this._processProdList();

			this._win.bind( 'resize', function( ) {
				that._processProdList();
			});

		}

		_processProdList(){
			this._prodList.each( this._chekIfNeedsAutoHeight.bind( this ) );
		}

		_chekIfNeedsAutoHeight( index, element ) {

			if ( $( '.auto', element ).length > 0 ) {

				var items = $( 'figure', element );
				var firstItem = items.eq(0);
				var percentage = Math.round( ( firstItem.outerWidth() / firstItem.parent().outerWidth() ) * 100 );
				var numberOfElementsPerRow = parseInt( 100 / parseInt( percentage, 10), 10);
				var maxHeight = 0;

				for ( var i = 0, n = items.length; i < n; i++ ) {

					var obj = items.eq( i );
					obj.removeAttr('style');
					var height = obj.height();
					if ( height > maxHeight ){
						maxHeight = height;
					}

					if ( ( ( i + 1 ) % numberOfElementsPerRow ) === 0 || i === n - 1 ){
						obj.height( maxHeight );

						for ( var j = i - 1; ( j + 1 ) % numberOfElementsPerRow !== 0 ; j-- ) {
							var previousItems = items.eq( j );
							previousItems.height( maxHeight );
						}

						maxHeight = 0;
					}
				}

			}

		}

	}


	NewTerracotta.ProductList = ProductList;

})();