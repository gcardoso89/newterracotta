var NewTerracotta = NewTerracotta || {};

(function() {
	'use strict';

	function SubMenuFixed( pars ) {

		var params = ( typeof(pars) === "undefined" ) ? {} : pars;
		var _this = this;

		this.cont = (typeof(params.content_selector) === "undefined" ) ? $( '.nav-top' ) : $( params.content_selector );
		this.fixed = (typeof(params.fixed_element_selector) === "undefined" ) ? $( '> ul', this.cont ) : $( params.fixed_element_selector, this.cont );
		this.items = (typeof(params.items_selector) === "undefined" ) ? $( '> li', this.fixed ) : $( params.fixed_element_selector, this.fixed );
		this.scrlCtrl = (typeof(params.visible_element_selector) === "undefined" ) ? $( 'span', this.fixed ).eq( 0 ) : $( params.visible_element_selector, this.fixed );
		this.imgs = $( 'img', this.fixed );
		this.win = $( window );
		this.hasImg = true;
		this.currentNumberOfLines = null;
		this.scrollable = $( 'html, body' );
		this.isAnimating = false;
		this.extraTop = 150;
		this.list = $( params.navigate_list );

		this.nrLoaded = 0;
		this.nrTotal = (this.cont.hasClass( 'no-img' ) ) ? 0 : this.imgs.length;

		for ( var i = 0; i < this.nrTotal; i++ ) {
			this.imageLoader( this.imgs.eq( i ).attr( 'src' ) );
		}

		if ( this.nrTotal === 0 ) {
			this.hasImg = false;
			this.activate();
		}

		if ( this.list.length > 0 ) {
			this.items.bind( 'click.SubMenuFixed', function( e ) {
				e.preventDefault();
				var ind = $( this ).index();
				_this.navigateToBlock( ind );
			} )
		}

	}

	SubMenuFixed.prototype.activate = function() {

		var _this = this;

		this.scrlCtrlH = this.scrlCtrl.outerHeight();

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

	SubMenuFixed.prototype.getNumberOfLines = function( containerWidth ) {

		var nrElements = this.items.length;
		var elementsPerLine = Math.round( containerWidth / this.items.width() );

		return Math.ceil( nrElements / elementsPerLine );

	};

	SubMenuFixed.prototype.resizeHandler = function() {

		var newW = this.cont.width();
		var numberOfLines = this.getNumberOfLines( newW );

		this.contW = newW;
		this.contH = this.items.eq( 0 ).height();
		this.currentNumberOfLines = numberOfLines;


		if ( this.hasImg ) {
			this.contNewH = (newW * this.contH) / this.contW;
			this.cont.css( {height: this.contNewH * numberOfLines} );

			if ( !this.fixed.hasClass( 'fixed' ) ) {
				this.cTop = this.scrlCtrl.offset().top;
			}
		} else {
			this.cont.css( {height: this.contH} );
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

		if ( this.list.length > 0 ) {

			if ( this.isAnimating ) return false;

			var found = false;

			for ( var i = 0, n = this.list.length; i < n; i++ ) {
				var obj = this.list.eq( i );
				var next = (i + 1 < n) ? this.list.eq( i + 1 ) : false;

				var curTop = obj.offset().top - this.extraTop;
				var nextTop = ( next ) ? next.offset().top - this.extraTop : null;

				if ( ( sTop >= curTop && next && sTop < nextTop ) || ( sTop >= curTop && !next ) ) {
					this.items.removeClass( 'sel' );
					this.items.eq( i ).addClass( 'sel' );
					found = true;
					break;
				}

			}

			if ( !found ) this.items.removeClass( 'sel' );

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

	SubMenuFixed.prototype.navigateToBlock = function( blockIndex ) {

		var _this = this;
		var listItem = this.list.eq( blockIndex );
		if ( listItem.length === 0 ) {
			return;
		}
		this.scrollable.stop( true, false );
		this.isAnimating = true;
		this.scrollable.animate( {scrollTop: listItem.offset().top - this.extraTop + 1}, 1000, "easeInOutQuint", function() {

			if ( !_this.isAnimating ) return true;
			_this.isAnimating = false;
			_this.scrollHandler();

		} );
	};

	NewTerracotta.SubMenuFixed = SubMenuFixed;

})();
