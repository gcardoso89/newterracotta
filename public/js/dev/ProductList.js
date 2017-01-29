var NewTerracotta = NewTerracotta || {};

(function () {

	class ProductList {

		constructor( params ) {

			params = params || {};

			var that = this;

			this._prodList = $( params.list || '.prod-list' );
			this._loaders = {};
			this._counters = {};
			this._win = $( window );
			this._boundCheckIfCanResize = this._checkIfCanResize.bind( this );
			this._processProdList();

			this._win.bind( 'resize', function () {
				that._resizeHandler();
			} );

		}

		_resizeHandler(){
			this._prodList.each( this._boundCheckIfCanResize );
		}

		_processProdList() {
			this._prodList.each( this._startLoadingSystem.bind( this ) );
		}

		_startLoadingSystem( index, element ) {
			var that = this;
			this._loaders[ index ] = [];
			this._counters[ index ] = 0;

			var container = $( '> .auto', element );
			container.hide();
			var images = $( 'img', element );
			var loading = $( '> .prod-loading', element );
			loading.show();

			var loaderHandler = function ( counterIndex, container, loading, parent ) {
				return that._onImageLoad.bind( that, counterIndex, container, loading, parent );
			};

			for ( var i = 0; i < images.length; i++ ) {
				var src = images.eq( i )[ 0 ].src;
				var image = new Image();
				image.src = src;
				this._loaders[ index ].push( image );
				this._counters[ index ]++;
				image.onload = loaderHandler( index, container, loading, element );
				image.onerror = loaderHandler( index, container, loading, element );
			}
		}

		_onImageLoad( counterIndex, container, loading, parent ) {
			this._counters[ counterIndex ]--;
			if ( this._counters[ counterIndex ] === 0 ) {
				container.show();
				loading.hide();
				this._checkIfNeedsAutoHeight( parent );
			}
		}

		_checkIfCanResize( index, element ){
			if ( this._counters[ index ] === 0 ) {
				this._checkIfNeedsAutoHeight( element );
			}
		}

		_checkIfNeedsAutoHeight( element ) {

			if ( $( '.auto', element ).length > 0 ) {

				var items = $( 'figure', element );
				var firstItem = items.eq( 0 );
				var percentage = Math.round( ( firstItem.outerWidth() / firstItem.parent().outerWidth() ) * 100 );
				var numberOfElementsPerRow = parseInt( 100 / parseInt( percentage, 10 ), 10 );
				var maxHeight = 0;

				for ( var i = 0, n = items.length; i < n; i++ ) {

					var obj = items.eq( i );
					obj.removeAttr( 'style' );
					var height = obj.height();
					if ( height > maxHeight ) {
						maxHeight = height;
					}

					if ( ( ( i + 1 ) % numberOfElementsPerRow ) === 0 || i === n - 1 ) {
						obj.height( maxHeight );

						for ( var j = i - 1; ( j + 1 ) % numberOfElementsPerRow !== 0; j-- ) {
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