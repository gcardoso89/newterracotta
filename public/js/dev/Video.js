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

		this._startBtn = $( params.btn_start );

		this._player = null;
		this._winW = null;
		this._previousHeight = null;
		this._isPlaying = null;
		this._containerTop = null;
		this._canPlay = !!params.auto_start;

		this._win.bind( 'resize', function() {
			that._onResize();
		} );

		this._win.bind( 'scroll', function() {
			that._onScroll();
		} );

		this._startBtn.bind( 'click', function( e ) {
			e.preventDefault();
			if ( params.onBtnStartClick ) {
				params.onBtnStartClick();
			}
			if ( that._player ) {
				that._player.playVideo();
			}
			that._canPlay = true;
		} );

		this._startYoutubeApi();

	}

	Video.prototype._isMobileOrTablet = function() {
		var check = false;
		(function( a ) {
			if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr( 0, 4 ) ) )check = true
		})( navigator.userAgent || navigator.vendor || window.opera );
		return check;
	};

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
				playerVars: {
					controls: 0,
					modestbranding: 1
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

	Video.prototype._onResize = function() {

		this._winW = this._win.width();
		this._winH = this._win.height();

		if ( this._winW < this._maxWidth ) {

			var newHeight = parseInt( ( this._winW * this._ratioH ) / this._ratioW, 10 );

			if ( newHeight !== this._previousHeight ) {
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

	Video.prototype._onScroll = function() {

		if ( !this._canPlay ) return;

		this._scrollTop = this._win.scrollTop();

		var containerIsSufficientlyVisible = this._checkIfContainerIsSufficientlyVisible();

		if ( containerIsSufficientlyVisible && !this._isPlaying && !this._isMobileOrTablet() ) {
			this._player.playVideo();
		} else if ( !containerIsSufficientlyVisible && this._isPlaying && !this._isMobileOrTablet() ) {
			this._player.pauseVideo();
		}

	};

	Video.prototype._checkIfContainerIsSufficientlyVisible = function() {

		var maskAreaFinal = this._scrollTop + this._winH;
		var videoAreaFinalFromTop = ( this._previousHeight + this._containerTop );
		var visibleArea = this._winH - ( this._containerTop - this._scrollTop );

		visibleArea -= ( ( this._scrollTop > this._containerTop ) ? ( this._scrollTop - this._containerTop ) : 0 );
		visibleArea -= ( ( maskAreaFinal > videoAreaFinalFromTop ) ? maskAreaFinal - videoAreaFinalFromTop : 0 );

		return ( visibleArea > this._previousHeight * 0.4 );

	};

	Video.prototype._onPlayerReady = function( event ) {
		this._container = $( '#' + this._containerId );
		this._onResize();
		this._onScroll();
	};


	Video.prototype._onPlayerStateChange = function( event ) {
		this._isPlaying = event.data === YT.PlayerState.PLAYING;
	};

	NewTerracotta.Video = Video;

})();