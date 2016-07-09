var NewTerracotta = NewTerracotta || {};

(function(){

	'use strict';

	function ColourList() {

		var _this = this;

		this.nav = $( '.colour-menu' );
		this.navItems = $( 'ul > li', this.nav );

		this.list = $( '.colour-grid' );
		this.blocks = $( 'ul', this.list );
		this.items = $( 'li', this.list );

		this.target = $( '.colour-info' );
		this.tImg = $( 'img', this.target );
		this.tTit = $( '.tit', this.target );
		this.tRef = $( '.ref', this.target );
		this.tDefList = $( '.def-list', this.target );
		this.tTab = $( '.bot .tab', this.target );
		this.tBot = $( '.bot > a', this.target );
		this.tClose = $( '.bt-close', this.target );
		this.tLkInfo = $( '.ic-colour-info', this.target );
		this.tLkStudy = $( '.ic-colour', this.target );
		this.offsetValue = 0;
		this.mainCont = $('main');
		this.tBot.bind( 'click.ColourList', function( e ) {
			_this.showTab( e );
		} );
		this.tClose.bind( 'click.ColourList', function() {
			_this.hideTooltip();
		} );
		this.table = $( 'table.matrix-prod' );
		this.table.appendTo( this.tTab );
		this.items.bind( 'click', showTooltip );
		this.doc = $( document );
		this.extraLeft = 0;
		this.btW = this.items.width();
		this.scrollable = $( 'html, body' );
		this.extraTop = 150;
		this.isAnimating = false;
		this.resizeHandler();

		this.win.load( function() {
			_this.items.eq( 0 ).trigger( 'click' );
			$( 'a', _this.navItems ).bind( 'click', navigateToColour );
			_this.win.bind( 'scroll', function() {
				_this.scrollHandler()
			} );
			_this.win.bind( 'resize', function() {
				_this.resizeHandler()
			} );
		} );

		function showTooltip( e ) {
			e.preventDefault();
			var _obj = $( this );
			if ( _obj.hasClass( 'open' ) ) {
				setTimeout( function() {
					_this.hideTooltip();
				}, 1 );
				_obj.removeClass( 'open' );

				return true;
			}
			else {
				setTimeout( function() {
					_this.showTooltip( _obj );
				}, 1 );
				_obj.addClass( 'open' );
			}
			setTimeout( function() {
				_this.doc.bind( 'click.ColourList', clickDocument )
			}, 1 );
		}

		function clickDocument( e ) {

			if ( _this.target.has( e.target ).length === 0 ) {
				_this.doc.unbind( 'click.ColourList' );
				_this.hideTooltip();
				_this.items.removeClass( 'open' );
			}
		}

		function navigateToColour( e ) {

			e.preventDefault();
			var ind = $( this ).closest( 'li' ).index();
			_this.navigateToColour( ind );

		}

	}

	ColourList.prototype.showList = function( indexValue ) {

		this.navItems.removeClass( 'sel' );
		this.navItems.eq( indexValue ).addClass( 'sel' );
		this.blocks.hide();
		this.blocks.eq( indexValue ).show();

	};

	ColourList.prototype.showTab = function( e ) {

		e.preventDefault();
		this.tBot.hide();
		this.tTab.show();
		this.table.css( {display: "block"} );

	};

	ColourList.prototype.hideTab = function() {

		this.tBot.show();
		this.tTab.hide();
		this.table.css( {display: "none"} );

	};


	ColourList.prototype.showTooltip = function( obj ) {

		this.changeText( obj );
		this.moveTooltip( obj );
		this.target.css( { visibility: 'visible' } );

	};

	ColourList.prototype.hideTooltip = function() {
		this.target.removeClass( 'invert' );
		this.target.css( { visibility: 'hidden', top: -9999, left: -99999 } );
		this.hideTab();
	};


	ColourList.prototype.changeText = function( jObject ) {

		var obj = jObject;

		var img = $( 'figure img', obj );
		var tit = $( 'h3', obj );
		var ref = $( 'h4', obj );
		var defList = $( 'dl', obj );
		var lkInfo = $( '.lk-info', obj );
		var lkStudy = $( '.lk-study', obj );

		this.tImg.attr( 'src', img.attr( 'src' ) );
		this.tTit.html( tit.html() );
		this.tRef.html( ref.html() );
		this.tDefList.html( '' );
		this.tDefList.append( defList.clone() );
		this.tLkInfo.attr( 'href', lkInfo.attr( 'href' ) );
		this.tLkStudy.attr( 'href', lkStudy.attr( 'href' ) );

	};

	ColourList.prototype.resizeHandler = function() {

		var that = this;

		this.win = $( window );
		this.winWidth = this.win.width();
		this.win.bind( 'resize.ColourList', resizeFunc );
		this.offsetValue = this.mainCont.offset().top;

		this.hideTooltip();

		function resizeFunc() {
			that.winWidth = that.win.width();
			if ( that.target.css( 'visibility' ) == 'visible' ) {
			}
		}

	};

	ColourList.prototype.moveTooltip = function( obj ) {

		var offX = obj.offset().left;
		var posX = offX + this.btW / 2;
		var tW = this.target.width();
		if ( posX + tW > this.winWidth ) {
			posX = posX - tW;
			this.target.addClass( 'invert' );
		}
		else {
			this.target.removeClass( 'invert' );
		}

		var posY = obj.offset().top + (this.items.height() / 2) - this.offsetValue;

		this.target.css( { left: posX, top: posY } );

	};

	ColourList.prototype.navigateToColour = function( index ) {

		var _this = this;

		this.scrollable.stop( true, false );
		this.isAnimating = true;
		this.scrollable.animate( {scrollTop: this.list.eq( index ).offset().top - this.extraTop + 1 }, 1000, "easeInOutQuint", function() {

			if ( !_this.isAnimating ) return true;
			_this.isAnimating = false;
			_this.scrollHandler();

		} );

	};


	ColourList.prototype.scrollHandler = function() {

		var sTop = this.win.scrollTop();

		var found = false;

		if ( this.isAnimating ) return false;

		for ( var i = 0, n = this.list.length; i < n; i++ ) {
			var obj = this.list.eq( i );
			var next = (i + 1 < n) ? this.list.eq( i + 1 ) : false;

			var curTop = obj.offset().top - this.extraTop;
			var nextTop = ( next ) ? next.offset().top - this.extraTop : null;

			if ( ( sTop >= curTop && next && sTop < nextTop ) || ( sTop >= curTop && !next ) ) {
				this.navItems.removeClass( 'sel' );
				this.navItems.eq( i ).addClass( 'sel' );
				found = true;
				break;
			}

		}

		if ( !found ) this.navItems.removeClass( 'sel' );


	};

	NewTerracotta.ColourList = ColourList;

})();
