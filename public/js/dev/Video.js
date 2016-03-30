var NewTerracotta = NewTerracotta || {};

(function() {

	'use strict';

	function Video( params ) {

		var that = this;

		params = params || {};

		this._containerId = params.video_container || 'video-container';
		this._videoId = params.video_id || 'WE15F9a6Jps';
		this._container = $( '#' + this._containerId );
		this._win = $( window );
		this._maxWidth = params.max_width || 1210;

		this._ratioW = params.radio_window || 1210;
		this._ratioH = params.radio_height || 682;

		this._winW = null;
		this._previousHeight = null;
		this._isPlaying = null;
		this._containerTop = null;

		this._win.bind('resize', function(){
			that._onResize();
		});

		this._win.bind('scroll', function(){
			that._onScroll();
		});

		this._startYoutubeApi();

	}

	Video.prototype._startYoutubeApi = function() {

		var that = this;

		// 2. This code loads the IFrame Player API code asynchronously.
		var tag = document.createElement( 'script' );

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName( 'script' )[0];
		firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

		// 3. This function creates an <iframe> (and YouTube player)
		//    after the API code downloads.

		window.onYouTubeIframeAPIReady = function() {
			that._player = new YT.Player( that._containerId, {
				width: '100%',
				height: '100%',
				videoId: that._videoId,
				playerVars : {
					controls : 0,
					modestbranding : 1
				},
				events: {
					'onReady': function( event ) {
						that._onPlayerReady( event );
					},
					'onStateChange': function( event ) {
						that._onPlayerStateChange( event );
					}
				}
			} );
		}

	};

	Video.prototype._onResize = function( ){

		this._winW = this._win.width();
		this._winH = this._win.height();

		if ( this._winW < this._maxWidth ){

			var newHeight = parseInt( ( this._winW * this._ratioH ) / this._ratioW , 10);

			if ( newHeight !== this._previousHeight ){
				this._container.height( newHeight );
				this._containerTop = this._container.offset().top;
				this._previousHeight = newHeight;
			}

		} else {

			this._containerTop = this._container.offset().top;
			this._previousHeight = this._ratioH;
			this._container.height( this._ratioH );

		}

	};

	Video.prototype._onScroll = function(){

		this._scrollTop = this._win.scrollTop();

		var containerIsSufficientlyVisible = this._checkIfContainerIsSufficientlyVisible();

		if ( containerIsSufficientlyVisible && !this._isPlaying ){
			this._player.playVideo();
			this._isPlaying = true;
		} else if ( !containerIsSufficientlyVisible && this._isPlaying ) {
			this._player.pauseVideo();
			this._isPlaying = false;
		}

	};

	Video.prototype._checkIfContainerIsSufficientlyVisible = function(){

		var maskAreaFinal = this._scrollTop + this._winH;
		var videoAreaFinalFromTop = ( this._previousHeight + this._containerTop );
		var visibleArea = this._winH - ( this._containerTop - this._scrollTop );

		visibleArea -= ( ( this._scrollTop > this._containerTop ) ? ( this._scrollTop - this._containerTop ) : 0 );
		visibleArea -= ( ( maskAreaFinal > videoAreaFinalFromTop ) ? maskAreaFinal - videoAreaFinalFromTop : 0 );

		return ( visibleArea > this._ratioH * 0.4 );

	};

	Video.prototype._onPlayerReady = function( event ) {
		this._container = $( '#' + this._containerId );
		this._onResize();
		//this._player.playVideo();
	};


	Video.prototype._onPlayerStateChange = function( event ) {

	};

	NewTerracotta.Video = Video;

})();