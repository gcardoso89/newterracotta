var NewTerracotta = NewTerracotta || {};

(function(){

	'use strict';

	function ProductImageZoom( params ){

		params = params || {};

		var that = this;

		this._container = $(params.container || '.prod-img-cont' );
		this._zoomer = $( params.zoomer || '.prod-more', this._container );
		this._zoomerClassname = params.zoomerClassname || 'prod-more';

		this._zoomer.bind('click.ProductImageZoom', function( e ){
			that._onZoomerClick( e, $(this) );
		})

	}

	ProductImageZoom.prototype._onZoomerClick = function(event, element){

		if ( event.target && event.target.className == this._zoomerClassname ){

			console.warn('clicked');

		}

	};

	NewTerracotta.ProductImageZoom = ProductImageZoom;

})();