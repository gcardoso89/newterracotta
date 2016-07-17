var NewTerracotta = NewTerracotta || {};

(function() {

	class Gallery {

		constructor( params ) {

			params = params || {};

			var _this = this;

			this.cont = $( params.content || '.projects-list' );
			this.list = $( params.list || '.mold', this.cont );
			this.header = $( params.header || 'header' );

			this.parObj = params.items || 'figure';

			this.items = $( this.parObj, this.list );
			console.log(this.items.length);
			this.nrItems = this.items.length;

			params.frame = params.frame || {};

			this.frame = $( params.frame.block || '.proj-frame', this.cont );
			this.fImg = $( params.frame.image || '.img', this.frame );
			this.fInfo = $( params.frame.info || '.info', this.frame );
			this.btClose = $( params.frame.bt_close || '.bt-close', this.frame );
			this.btNext = $( params.frame.bt_next || '.bt-next', this.frame );
			this.btPrev = $( params.frame.bt_previous || '.bt-prev', this.frame );

			this.filter = $( params.filter || '.filter', this.cont );

			this.ci = 0;
			this.fOpened = false;

			this.pars = params;

			this.items.bind( 'click.Gallery', function( e ) {
				e.preventDefault();

				var dataAttr = $( this ).data().zoom;

				if ( typeof(dataAttr) !== "undefined" && dataAttr !== false ) {
					if ( dataAttr != "false" ) {
						_this.selectItem( $( this ), true );
					}
				}
				else {
					_this.selectItem( $( this ), true );
				}

			} );

			this.btNext.bind( 'click.Gallery', showNext );
			this.btPrev.bind( 'click.Gallery', showPrev );
			this.btClose.bind( 'click.Gallery', function( e ) {
				_this.closeFrame();
			} );
			this.filter.bind( 'click.Gallery', function( e ) {
				_this.closeFrame();
			} );

			function showNext( e ) {

				var ind = _this.ci;

				if ( ind + 1 >= _this.nrItems ) ind = 0;
				else ind++;

				_this.selectItem( _this.items.eq( ind ), false );

			}

			function showPrev( e ) {

				var ind = _this.ci;

				if ( ind - 1 < 0 ) ind = _this.nrItems - 1;
				else ind--;

				_this.selectItem( _this.items.eq( ind ), false );

			}

		}

		closeFrame() {

			if ( this.frame.hasClass( "gal-frame" ) ) this.closeFrameNormal();
			else this.closeFrameProjects();

			this.header.css( { zIndex: 2 } );

		};

		selectItem( obj, toAnimate ) {
			if ( this.frame.hasClass( "gal-frame" ) ) this.selectItemNormal( obj, toAnimate );
			else this.selectItemProjects( obj );

			this.header.css( { zIndex:  1 } );

		};

		selectItemProjects( obj ) {

			var _this = this;
			var _obj = obj;

			var _img = _obj.find( this.pars.image || 'img' );

			var _info = $( this.pars.info || 'figcaption', _obj );
			var _index = obj.index();

			var newImg = new Image();

			var oldSrc = _img.attr( 'src' );

			if ( oldSrc.indexOf( '?' ) != -1 ) {
				newImg.src = oldSrc.split( '?' )[0];
			}
			else {
				newImg.src = oldSrc;
			}

			this.filter.show();

			this.fImg.html( '' );
			this.fInfo.hide();
			this.fInfo.html( '' );

			this.frame.show();

			this.ci = _index;

			if ( newImg.complete ) {
				loadImage();
			}
			else {
				newImg.onload = loadImage;
			}

			newImg.onerror = errorImage;

			function loadImage() {

				var fig = _this.fImg.closest( 'figure' );

				_this.fImg.html( newImg );
				_this.fInfo.html( _info.html().replace( " #", "</em> <em>#" ) );
				_this.fInfo.show();

				fig.css( {marginTop: -(fig.height() / 2)} );

				_this.btNext.show();
				_this.btPrev.show();
				_this.btClose.show();

			}

			function errorImage() {

				_this.frame.hide();

			}

		};

		closeFrameProjects() {

			var _this = this;

			this.filter.hide();
			this.frame.hide();

		};


		selectItemNormal( obj, toAnimate ) {

			var _this = this;
			var _obj = obj;

			var _img = _obj.find( this.pars.image || 'img' );
			var _info = $( this.pars.info || 'figcaption', _obj );
			var _index = obj.index();

			var newImg = new Image();

			var oldSrc = _img.attr( 'src' );

			if ( oldSrc.indexOf( '?' ) != -1 ) {
				newImg.src = oldSrc.split( '?' )[0];
			}
			else {
				newImg.src = oldSrc;
			}

			this.filter.show();

			this.fImg.html( '' );
			this.fInfo.hide();
			this.fInfo.html( '' );

			this.animTime = 600;

			if ( !this.fOpened ) {
				this.fOpened = true;
				this.frame.show();
				this.frame.css( {height: 0, width: 0, marginLeft: 0, marginTop: 0} );

				this.animTime = 1500;
			}


			this.frame.stop( true, true );
			this.frame.show();

			if ( newImg.complete ) {
				loadImage();
			}
			else {
				newImg.onload = loadImage;
			}

			newImg.onerror = errorImage;

			function loadImage() {

				var fInfoH = 0;
				var fInfoExtra = 0;

				if ( _this.fInfo.length > 0 ) {
					fInfoH = _this.fInfo.height();
					fInfoExtra = parseInt( _this.fInfo.css( 'padding-top' ), 10 ) * 2;
				}

				_this.fImg.html( newImg );
				_this.fInfo.html( _info.html() );
				_this.fInfo.show();

				_this.btNext.show();
				_this.btPrev.show();
				_this.btClose.show();

				if ( toAnimate ) {
					_this.frame.animate( {
							height: newImg.height + 24 + fInfoH + fInfoExtra,
							width: newImg.width + 24 + 40,
							marginLeft: -(newImg.width / 2 + 12 + 20),
							marginTop: -(newImg.height / 2 + 12 + (fInfoH + fInfoExtra) / 2),
							opacity: 1
						},
						_this.animTime,
						"easeOutQuint"
					);
				}

				else {
					_this.frame.css( {
						height: newImg.height + 24 + fInfoH + fInfoExtra,
						width: newImg.width + 24 + 40,
						marginLeft: -(newImg.width / 2 + 12 + 20),
						marginTop: -(newImg.height / 2 + 12 + (fInfoH + fInfoExtra) / 2),
						opacity: 1
					} );
				}

				_this.ci = _index;

			}

			function errorImage() {

				_this.frame.hide();

			}

		};

		closeFrameNormal() {

			var _this = this;

			this.filter.hide();
			this.frame.stop( true, true );
			//this.frame.hide();

			this.frame.animate( {
				height: 0,
				width: 0,
				marginTop: 0,
				marginLeft: 0,
				opacity: 0
			}, 1000, "easeOutQuint", function() {
				_this.frame.hide();
			} );

			_this.fOpened = false;

			this.btNext.hide();
			this.btPrev.hide();
			this.btClose.hide();

		};

	}

	NewTerracotta.Gallery = Gallery;

})();

