var NewTerracotta = NewTerracotta || {};

(function () {

	'use strict';

	class ColourStudies {

		constructor() {
			var _this = this;

			this.cont = $( '.colour-studies' );
			this.list = $( '.big-list', this.cont );
			this.items = $( '> li', this.list );
			this.img = $( 'figure img', this.items );
			this.name = $( 'h2', this.items );
			this.btUp = $( '.bt-up', this.cont );
			this.btDown = $( '.bt-down', this.items );
			this.firstBt = this.btDown.eq( 0 );
			this.btDown.eq( this.btDown.length - 1 ).hide();
			this.nrItems = this.items.length;
			this.clickTimeout = null;

			this.selMenuImg = [];

			this.nrTotal = this.img.length;
			this.nrLoaded = 0;

			this.scrollable = $( 'html, body' );

			this.win = $( window );

			this.btUp.bind( 'click.ColourStudies', ( e ) => {
				e.preventDefault();
				this.scrollable.animate( { scrollTop: 0 }, 1200, "easeInOutQuint" );
			} );

			this.btDown.bind( 'click.ColourStudies', function ( e ) {
				e.preventDefault();
				var thisObj = $( this ).closest( 'li' );
				var next = thisObj.next();
				var nextColourId = next.attr( 'data-colourid' );
				_this.animateToColour( nextColourId );
			} );

			this.items.bind( 'click.ColourStudies', function ( e ) {
				var thisObj = $( this );
				var idx = thisObj.index();
				_this.items.removeAttr( 'style' );
				if ( idx !== _this.currentOpened ) {
					thisObj.height( _this.winH );
					if ( _this.clickTimeout ) {
						clearTimeout( _this.clickTimeout );
						_this.clickTimeout = null;
					}
					_this.clickTimeout = setTimeout( function () {
						var pos = thisObj.offset().top;
						_this.currentOpened = idx;
						_this.scrollable.stop( true, false );
						_this.scrollable.animate( { scrollTop: pos }, 800, "easeInOutQuint" );
					}, 500 );
				}
				_this.currentOpened = null;
			} );

			this.checkImages();
		}

		checkImages() {
			var _this = this;

			this.cont.addClass( 'loading' );

			for ( var i = 0, n = this.img.length; i < n; i++ ) {
				var img = this.img.eq( i );
				this.createMenuImages( this.img.eq( i ).attr( 'src' ), this.name.eq( i ).html(), this.items.eq( i ).attr( 'data-colourid' ) );
				//this.loadImage(img.attr('src'));
			}

			this.win.load( function () {
				_this.allLoaded();
			} );

			this.createSelectionMenu();
		}

		loadImage( source ) {
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

				if ( _this.nrLoaded == _this.nrTotal ) {
					_this.allLoaded();
				}

			}

			function errorImage() {
				_this.nrTotal--;
			}
		}

		allLoaded() {
			var _this = this;

			this.resizeHandler();

			this.win.bind( 'resize.ColourStudies', function () {
				_this.resizeHandler();
			} );
			this.win.bind( 'scroll.ColourStudies', function () {
				//_this.scrollHandler();
			} );

			this.getColourUrl();

			this.cont.removeClass( 'loading' );
			this.list.show();
		}

		resizeHandler() {
			this.winH = this.win.height();
			var valW = (this.winH * 1920) / 514;
			//this.items.css( {height: this.winH} );
			this.extra = this.cont.offset().top;
			this.img.css( { height: this.winH, width: valW, marginLeft: -(valW / 2) } );
		}

		getColourUrl() {
			var url = window.location.pathname;
			var isParam = url.indexOf( "/c/" );
			var iptScrollTop = $( '#ScrollTop' );

			if ( isParam != -1 ) {
				var colourId = url.substring( isParam + 3, isParam + 3 + 4 );
				if ( colourId.length >= 4 ) {
					var obj = this.items.filter( '[data-colourid="' + colourId + '"]' );
					if ( obj.length == 1 ) {

						var valTop = this.extra + ( obj.index() * this.winH );

						if ( iptScrollTop.length > 0 ) iptScrollTop.val( valTop );
						this.win.scrollTop( valTop );
						$( 'html, body' ).animate( { scrollTop: valTop } );

					}
				}
			}
			else {
				return false;
			}
		}

		animateToColour( colourId ) {
			var obj = this.items.filter( '[data-colourid="' + colourId + '"]' );
			this.scrollable.stop( true, false );
			if ( obj.length == 1 ) {
				var valTop = obj.position().top;
				this.scrollable.animate( { scrollTop: valTop }, 5000, "easeInOutQuint" );
			}
		}

		createMenuImages( attribute, name, colourId ) {
			this.selMenuImg.push( {
				imageSource: attribute + "?w=92&h=63&l=960&t=0&r=1",
				colourName: name,
				colourId: colourId
			} );
		}

		createSelectionMenu() {
			var _this = this;

			this.menuCont = $( '.colour-sel' );
			this.menu = $( 'ul', this.menuCont );

			for ( var i = 0, n = this.selMenuImg.length; i < n; i++ ) {
				this.menu.append( '<li><a href="#" data-colourid="' + this.selMenuImg[ i ].colourId + '"><figure><img src="' + this.selMenuImg[ i ].imageSource + '" alt="' + this.selMenuImg[ i ].colourName + '" /></figure><div class="name">' + this.selMenuImg[ i ].colourName + '</div></a></li>' )
			}

			this.menuItems = $( 'li', this.menu );
			this.btPrev = $( '.bt-prev', this.menuCont );
			this.btNext = $( '.bt-next', this.menuCont );
			this.menuWrap = $( '.slid-wrap', this.menuCont );
			this.menuBt = $( 'a', this.menuItems );

			this.extraMar = parseInt( this.menuItems.css( 'marginRight' ), 10 );
			this.menuTotalW = (this.menuItems.width() + this.extraMar) * this.menuItems.length;

			this.menu.css( { width: this.menuTotalW } );

			this.toSlide = this.menuWrap.width() + this.extraMar;

			this.btPrev.click( slideLeft );
			this.btNext.click( slideRight );

			this.menuBt.click( goToColour );

			function goToColour( e ) {
				e.preventDefault();
				_this.animateToColour( $( this ).attr( 'data-colourid' ) );
			}

			function slideLeft( e ) {
				e.preventDefault();
				_this.menu.stop( true, true );
				var posX = _this.menu.position().left;

				if ( posX < 0 ) {
					_this.menu.animate( { left: posX + _this.toSlide }, 1200, "easeOutQuad" );
				}
			}

			function slideRight( e ) {
				e.preventDefault();

				_this.menu.stop( true, true );
				var posX = _this.menu.position().left;

				if ( posX > -(_this.menuTotalW - _this.toSlide + _this.extraMar) ) {
					_this.menu.animate( { left: posX - _this.toSlide }, 1200, "easeOutQuad" );
				}
			}
		}

	}

	NewTerracotta.ColourStudies = ColourStudies;

})();