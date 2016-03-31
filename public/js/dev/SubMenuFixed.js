var NewTerracotta = NewTerracotta || {};

(function(){
	'use strict';

	function SubMenuFixed( pars ) {

		var params = ( typeof(pars) === "undefined" ) ? {} : pars;

		this.cont = (typeof(params.content_selector) === "undefined" ) ? $( '.nav-top' ) : $( params.content_selector );
		this.fixed = (typeof(params.fixed_element_selector) === "undefined" ) ? $( '> ul', this.cont ) : $( params.fixed_element_selector, this.cont );
		this.scrlCtrl = (typeof(params.visible_element_selector) === "undefined" ) ? $( 'span', this.fixed ).eq( 0 ) : $( params.visible_element_selector, this.fixed );
		this.imgs = $( 'img', this.fixed );
		this.win = $( window );
		this.hasImg = true;

		this.nrLoaded = 0;
		this.nrTotal = (this.cont.hasClass('no-img') ) ? 0 : this.imgs.length;

		for ( var i = 0; i < this.nrTotal; i++ ) {
			this.imageLoader( this.imgs.eq( i ).attr( 'src' ) );
		}

		if ( this.nrTotal === 0 ){
			this.hasImg = false;
			this.activate();
		}

	}

	SubMenuFixed.prototype.activate = function() {

		var _this = this;

		this.scrlCtrlH = this.scrlCtrl.outerHeight();
		this.contH = this.contNewH = this.cont.height();
		this.contW = this.cont.width();

		this.refresh();

		this.win.bind( 'resize.SubMenuFixed', function( e ) {
			_this.refresh();
		} );
		this.win.bind( 'scroll.SubMenuFixed', function( e ) {
			_this.scrollHandler();
		} );

	};

	SubMenuFixed.prototype.refresh = function() {

		this.resizeHandler();
		this.scrollHandler();

	};

	SubMenuFixed.prototype.resizeHandler = function() {

		var newW = this.cont.width();

		if ( this.hasImg ){
			this.contNewH = (newW * this.contH) / this.contW;
			this.cont.css( { height: this.contNewH  } );

			if ( !this.fixed.hasClass( 'fixed' ) ) {
				this.cTop = this.scrlCtrl.offset().top;
			}
		} else {
			this.cont.css( { height: this.contH } );
		}

	};

	SubMenuFixed.prototype.scrollHandler = function() {

		var sTop = this.win.scrollTop();

		if ( !this.fixed.hasClass( 'fixed' ) ) {
			this.cTop = this.scrlCtrl.offset().top;
		}

		if ( sTop >= this.cTop ) {
			this.fixed.addClass( 'fixed' );
			this.fixed.css( {top: -(this.contNewH - this.scrlCtrlH)} );
		}

		else {
			this.fixed.removeClass( 'fixed' );
			this.fixed.css( {top: 0} );
		}

	};

	SubMenuFixed.prototype.imageLoader = function( source ) {

		var _this = this;
		var img = new Image();

		img.src = source;

		if ( img.complete ) {
			loadImage();
		}
		else {
			img.onload = loadImage;
		}

		img.onerror = errorImage;

		function loadImage() {
			_this.nrLoaded++;
			if ( _this.nrLoaded == _this.nrTotal ) _this.activate();
		}

		function errorImage() {
			_this.nrTotal--;
		}

	};

	NewTerracotta.SubMenuFixed = SubMenuFixed;

})();
