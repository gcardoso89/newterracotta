var NewTerracotta = NewTerracotta || {};

(function() {

	'use strict';

	var settings = {
		markerImage : 'http://website-newterracotta.rhcloud.com/map-marker.svg',
		map : {
			lat: 44.33956525,
			lng: 6.28417969,
			minZoom : 4,
			maxZoom : 16,
			zoom: 4,
			zoomControl: true,
			zoomControlStyle : 2,
			mapTypeControl: false,
			streetViewControl: false,
			rotateControl: true,
			fullscreenControl: true,
			scrollwheel: false,
			styles : [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
		}

	};

	function Map( params ) {

		var that = this;
		this._settings = settings;

		window.onGoogleMapsReady = function() {
			$( function() {
				that._init( params );
			} );
		};

	}

	Map.prototype._init = function( params ) {

		params = params || {};

		this._cont = $( params.container || '#map-container' );
		this._listUrl = params.url || '/json/list.json';
		this._list = null;

		this._getList();

	};

	Map.prototype._getList = function() {

		var that = this;

		$.ajax( {

			url: this._listUrl,

			success: function( data ) {

				if ( data && data.length > 0 ) {
					that._onGetListSuccess( data );
				}
			}

		} );

	};

	Map.prototype._onGetListSuccess = function( data ) {

		var that = this;

		this._list = data.map( function(element){

			var position = element.position;
			if ( position ){
				var lat = position.latitude;
				var lng = position.longitude;

				if ( lat && lng ){
					return {
						lat : lat,
						lng : lng,
						title : element.title,
						icon: that._settings.markerImage,
						infoWindow: {
							content: '<p><b style="text-transform:uppercase">' + element.title + '</b></p>'
						}
					}
				}
			}

		} ).filter( element => element );

		this._settings.map.el = this._settings.map.el || this._cont[0];
		this._map = new GMaps( this._settings.map );

		this._map.addMarkers(this._list);
		this._map.fitZoom();

	};

	NewTerracotta.Map = Map;

})();
