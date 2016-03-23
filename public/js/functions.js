function SliderHomepage( params ) {
	if ( typeof(params) !== "undefined" ) this.init( params );
}
function SliderText( parentObject, parentItems, params ) {
	if ( !(typeof (params) === "undefined") || !(typeof (parentObject) === "undefined") || !(typeof (parentItems) === "undefined") ) this.init( parentObject, parentItems, params );
}

function Gallery( params ) {
	this.init( params );
}
function ColourList() {
	this.init();
}
function ColourStudies() {
	this.init();
}
function SubMenuFixed( params ) {
	if ( typeof(params) !== "undefined" ) this.init( params ); else this.init();
}


SliderHomepage.prototype.init = function( params ) {

	var that = this;
	//Objects
	this.cont = $( params.content );
	this.slider = $( params.slider, this.cont );
	this.items = $( params.items, this.slider );
	this.imgList = $( 'img', this.items );
	this.nrIt = this.items.length;

	this.win = $( window );

	//Navigation
	this.btNext = (typeof (params.bt_next) === "undefined") ? false : $( params.bt_next, this.cont );
	this.btPrev = (typeof (params.bt_previous) === "undefined") ? false : $( params.bt_previous, this.cont );
	this.nav = (typeof (params.navigation) === "undefined") ? false : $( params.navigation, this.cont );
	this.navItems = null;

	//Type of Slider - Number of visible items.
	this.showItems = (typeof (params.show_items) === "undefined") ? 1 : params.show_items;
	this.maxNrIt = Math.ceil( this.nrIt / this.showItems );

	//Fullscreen slider
	this.fscreen = (typeof (params.fullscreen) === "undefined") ? true : params.fullscreen;
	this.maxWidth = (typeof (params.max_width) === "undefined") ? parseInt( $( 'html > body > section, html > body > form > section' ).css( 'max-width' ), 10 ) : params.max_width;

	//Value for slide animation
	this.verSlide = (typeof (params.vertical_slider) === "undefined") ? false : params.vertical_slider;
	this.oneItVal = (this.verSlide) ? (this.items.height() + parseInt( this.items.eq( 1 ).css( 'margin-top' ), 10 ) + parseInt( this.items.eq( 1 ).css( 'margin-bottom' ), 10 )) : (this.items.width() + parseInt( this.items.eq( 1 ).css( 'margin-left' ), 10 ) + parseInt( this.items.eq( 1 ).css( 'margin-right' ), 10 ));
	this.slideVal = this.oneItVal * this.showItems;

	//Animation Params
	this.animParams = (typeof (params.animation_params) === "undefined") ? { duration: 1200, ease: 'easeOutQuint' } : params.animation_params;

	//Images params
	this.fullImgSz = (typeof (params.full_image_size) === "undefined") ? null : params.full_image_size;
	this.booCacheImg = (typeof (params.cache_image) === "undefined") ? true : params.cache_image;
	this.allLoaded = false;

	this.scrollable = $( 'html, body' );

	this.btDown = $( '.bt-down' );
	this.btDownTargetTop = $( this.btDown.attr( 'data-target' ) ).offset().top - 150;

	this.btDown.click( function( e ) {

		e.preventDefault();

		if ( that.win.scrollTop() >= that.btDownTargetTop ) return false;

		that.scrollable.animate( { scrollTop: that.btDownTargetTop }, 1000, "easeOutQuint" );

	} );

	//Timer
	this.timerAnim = (typeof(params.timer) === "undefined") ? false : params.timer;

	//Run appropriate methods
	if ( this.btNext && this.btPrev ) this.navigationControlsHandler();
	if ( this.nav ) this.navigationHandler();

	if ( this.fscreen ) {
		this.win.resize( function( e ) {
			that.adaptSlider();
		} );
		this.adaptSlider();
	}
	else {
		if ( this.verSlide ) this.slider.css( { height: this.oneItVal * this.nrIt } );
		else this.slider.css( { width: this.oneItVal * this.nrIt } );
	}

	if ( this.timerAnim ) this.startTimer();

	this.ci = null;

	this.slideBox = (typeof (params.slider_box) === "undefined") ? false : new SliderText( this.cont, this.items, params.slider_box );

	if ( this.nav ) this.animateSlider( 0 );

	$( window ).bind( 'load.MarinhaSliderBig', function( e ) {
		that.pageLoadHandler()
	} );

};

SliderHomepage.prototype.startTimer = function() {

	var that = this;

	this.timer = setTimeout( function() {
		that.stopTimer();
		var ind;
		if ( that.ci + 1 >= that.maxNrIt ) ind = 0;
		else ind = that.ci + 1;
		that.animateSlider( ind );
		that.startTimer();
	}, that.timerAnim );

};

SliderHomepage.prototype.stopTimer = function() {
	clearTimeout( this.timer );
};

SliderHomepage.prototype.navigationControlsHandler = function() {

	var that = this;

	if ( this.maxNrIt < 2 ) {
		this.btNext.remove();
		this.btPrev.remove();
		return false;
	}

	this.btNext.bind( 'click.slideBig', slideLeft );
	this.btPrev.bind( 'click.slideBig', slideRight );

	function slideLeft( e ) {
		e.preventDefault();
		that.slider.stop( true, false );
		var ind;
		if ( that.ci + 1 >= that.maxNrIt ) ind = 0;
		else ind = that.ci + 1;
		that.animateSlider( ind );
	};

	function slideRight( e ) {
		e.preventDefault();
		that.slider.stop( true, false );
		var ind;
		if ( that.ci - 1 < 0 ) ind = that.maxNrIt - 1;
		else ind = that.ci - 1;
		that.animateSlider( ind );
	};

};

SliderHomepage.prototype.navigationHandler = function() {

	var that = this;

	for ( var i = 0; i < this.maxNrIt; i++ ) {
		this.nav.append( '<li><a href="javascript:void(null);"></a></li>' );
	}

	this.navItems = $( '> li', this.nav );
	this.navBts = $( 'a', this.navItems );

	this.navBts.bind( 'click.slideBig', clickNavItems );
	var par = this.nav.parent();

	if ( this.maxNrIt < 2 ) {
		this.nav.remove();
		return false;
	}

	if ( par.hasClass( 'center' ) ) {
		var wi = 0;
		$( '> *', par ).each( function() {
			wi += $( this ).width();
		} );
		;
		par.css( { width: wi } );
	}

	function clickNavItems( e ) {
		var _li = $( this ).closest( 'li' );
		if ( _li.hasClass( 'act' ) ) return false;
		else that.animateSlider( _li.index() );
	}

};

SliderHomepage.prototype.animateSlider = function( indexValue ) {
	this.slider.stop( true, false );
	if ( this.verSlide ) this.animateSliderTop( indexValue );
	else this.animateSliderLeft( indexValue );
	if ( this.nav ) this.activateNavigation( indexValue );
	if ( this.slideBox ) this.slideBox.animateSlider( indexValue );
	this.ci = indexValue;
	if ( this.booCacheImg && this.allLoaded ) this.cacheImage( this.imgList.eq( indexValue ) );
};

SliderHomepage.prototype.animateSliderLeft = function( indexValue ) {
	this.slider.animate( { left: -(this.slideVal * indexValue) }, this.animParams.duration, this.animParams.ease );
	//this.slider.css({ '-webkit-transform' : 'translateX(' + ( -(this.slideVal * indexValue) ) + 'px)' });
};

SliderHomepage.prototype.animateSliderTop = function( indexValue ) {
	this.slider.animate( { top: -(this.slideVal * indexValue) }, this.animParams.duration, this.animParams.ease );

};

SliderHomepage.prototype.activateNavigation = function( indexValue ) {
	this.navItems.removeClass( 'act' );
	this.navItems.eq( indexValue ).addClass( 'act' );
};

SliderHomepage.prototype.adaptSlider = function() {

	this.slider.stop( true, true );
	this.withVal = this.win.width();
	if ( this.withVal > this.maxWidth ) this.withVal = this.maxWidth;
	this.items.css( { width: this.withVal } );
	this.slideVal = (this.items.width() * this.showItems) + (parseInt( this.items.css( 'margin-left' ), 10 ) * this.showItems) + (parseInt( this.items.css( 'margin-right' ), 10 ) * this.showItems);
	this.slider.css( { left: -(this.slideVal * this.ci), width: this.withVal * this.nrIt } );

};

SliderHomepage.prototype.pageLoadHandler = function() {
	if ( this.allLoaded ) return false;
	this.allLoaded = true;
	if ( this.booCacheImg ) this.cacheImage( this.imgList.eq( 0 ) );
};

SliderHomepage.prototype.cacheImage = function( imageObject ) {

	var img = imageObject;
	var src = img.attr( 'src' );
	if ( typeof (src) === "undefined" ) return false;
	var isHigh = (src.indexOf( '?w=' ) > 0) ? false : true;
	if ( img.hasClass( 'hi' ) || isHigh ) return false;
	var high = src.substring( 0, src.indexOf( '?w=' ) );

	var imgNew = new Image();
	var qstr = "";

	if ( this.fullImgSz != null ) {
		if ( !(typeof (this.fullImgSz.width) === "undefined") ) {
			qstr += "?w=" + this.fullImgSz.width;
		}
		if ( !(typeof (this.fullImgSz.height) === "undefined") ) {
			qstr += "&h=" + this.fullImgSz.height;
		}
	}

	imgNew.src = high + qstr;
	imgNew.alt = img.attr( 'alt' );
	imgNew.onload = loadImage;

	function loadImage() {
		img.parent().append( $( imgNew ).addClass( 'hi' ) );
		img.remove();
	}

};


/* --------------------> SLIDER BOX <-------------------------- */

SliderText.prototype.init = function( parentObject, parentItems, params ) {

	this.cont = parentObject;
	this.sld = $( params.slider, this.cont );
	this.wVal = this.sld.outerWidth();
	this.items = $( params.items, parentItems );
	this.animParams = (typeof (params.anim_params) === "undefined") ? { duration: 1200, ease: "easeOutBack" } : params.anim_params;
	this.cloneIt = (typeof (params.clone_items) === "undefined") ? false : params.clone_items;
	for ( var i = 0; i < this.items.length; i++ ) {
		if ( this.cloneIt ) this.items.eq( i ).clone().appendTo();
		else this.items.eq( i ).appendTo( this.sld );
	}
	this.items = $( params.items, this.sld );
	this.ci = 0;
};

SliderText.prototype.animateSlider = function( indexValue ) {

	this.animateOut( this.ci );
	this.animateIn( indexValue );

	this.ci = indexValue;

};

SliderText.prototype.animateIn = function( ind ) {

	var it = this.items.eq( ind );

	var h1 = $( 'h1', it );
	var h2 = $( 'h2', it );

	h1.stop( true, true );
	h2.stop( true, true );

	h1.css( { left: -200 } );
	h2.css( { left: -200 } );

	h1.animate( { left: 0, opacity: 1 }, this.animParams.duration, this.animParams.ease );
	h2.delay( 100 ).animate( { left: 0, opacity: 1 }, this.animParams.duration, this.animParams.ease );

};

SliderText.prototype.animateOut = function( ind ) {

	var it = this.items.eq( ind );

	var h1 = $( 'h1', it );
	var h2 = $( 'h2', it );

	h1.stop( true, true );
	h2.stop( true, true );

	h1.animate( { left: -300, opacity: 0 }, this.animParams.duration, this.animParams.ease );
	h2.delay( 100 ).animate( { left: -300, opacity: 0 }, this.animParams.duration, this.animParams.ease );

};

/* --------------------> FIM SLIDER BOX <-------------------------- */


function SlideHor( pars ) {

	var that = this;

	var params = (typeof(pars) === "undefined") ? {} : pars;

	this.$win = $( window );
	this.$body = $( document.body );
	this.bPrev = $( '.bt-prev', '.horslider' );
	this.bNext = $( '.bt-next', '.horslider' );

	this.slide = $( '.gal' );

	this.cont = (typeof(params.slider) === "undefined") ? $( 'article', this.slide ) : $( params.slider, this.cont );

	this.mainLoading = this.cont.closest( 'main' );

	this.img = (typeof(params.images) === "undefined") ? $( '> figure > img', this.cont ) : $( params.images, this.cont );
	this.nrImg = this.img.length;

	this.olist = (typeof(params.ordered_list) === "undefined") ? $( '> ol', this.cont ) : $( params.ordered_list, this.cont );

	this.oitems = $( '> li', this.olist );
	this.nrOitems = this.oitems.length;
	this.marg = parseInt( this.oitems.css( 'marginRight' ), 10 );
	this.wOitems = this.oitems.width() + this.marg;

	this.initAnim = (typeof(params.init_animation) === "undefined") ? false : params.init_animation;

	this.extra = 100;

	this.nrTotal = this.nrImg;
	this.nrLoaded = 0;

	this.slidePos = this.cont.position().left;

	this.winWidth = null;


	this.widthTotal = 0;
	this.maxPosX = null;

	this.dontMove = false;

	this.draggable = true;

	this.checkWinWidth();

	this.cont.css( { left: this.winWidth } );

	this.$win.bind( 'resize.ResizeWindow', function( e ) {
		that.resizeBrowserHandler()
	} );

	this.lastLeft = 0;

	this.mainLoading.addClass( "loading" );

	if ( this.nrImg > 0 && this.nrOitems == 0 ) {
		this.checkList = false;
		this.checkImages();

	}
	else if ( this.nrImg == 0 && this.nrOitems > 0 ) {
		this.checkList = false;
		this.checkListWidth();
		this.allLoaded();
	}

	else if ( this.nrImg > 0 && this.nrOitems > 0 ) {
		this.checkList = true;
		this.checkImages();
	}

}

SlideHor.prototype.checkListWidth = function() {
	var ttW = (this.wOitems * this.nrOitems);
	this.olist.css( {width: ttW + Math.abs( this.marg ) + this.extra} );
	this.widthTotal = this.olist.position().left + ttW + Math.abs( this.marg ) + this.extra;

	for ( var i = 0, n = this.nrOitems; i < n; i++ ) {
		this.oitems.eq( i ).addClass( (i % 2 != 0) ? "even" : "odd" );
	}

};

SlideHor.prototype.checkEachListWidth = function() {

	var ttW = 0;

	for ( var i = 0, n = this.nrOitems; i < n; i++ ) {
		var obj = this.oitems.eq( i );
		ttW += obj.width() + parseInt( obj.css( 'marginLeft' ), 10 );
		obj.addClass( (i % 2 != 0) ? "even" : "odd" );
	}

	this.olist.css( {width: ttW } );
	this.widthTotal = this.olist.position().left + ttW;

};

SlideHor.prototype.checkImages = function() {

	for ( var i = 0, n = this.nrImg; i < n; i++ ) {
		var img = this.img.eq( i );
		this.loadImage( img.attr( 'src' ), img.parent().position().left );
	}

};

SlideHor.prototype.loadImage = function( source, left ) {

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

		if ( left > _this.lastLeft ) {
			_this.lastLeft = left;
			_this.widthTotal = left + img.width;
		}

		if ( _this.nrLoaded == _this.nrTotal && !_this.checkList ) {
			_this.allLoaded();
		}
		else if ( _this.nrLoaded == _this.nrTotal && _this.checkList ) {
			_this.checkEachListWidth();
			_this.allLoaded();
		}


	}

	function errorImage() {
		_this.nrTotal--;
	}

};

SlideHor.prototype.checkWinWidth = function() {

	this.winWidth = this.$win.width();

	if ( this.widthTotal > this.winWidth ) {
		this.cont.css( { width: this.widthTotal } );
		this.slide.css( { width: this.winWidth + this.widthTotal } );
	}
	else {
		this.cont.css( { width: this.winWidth, left: this.winWidth } );
		this.slide.css( { width: this.winWidth } );
	}

	this.maxPosX = this.cont.width() - this.winWidth;

};

SlideHor.prototype.resizeBrowserHandler = function() {

	this.winWidth = this.$win.width();

	this.extraLeft = this.slide.offset().left;

	if ( !this.dontMove ) {
		this.cont.css( { left: this.winWidth } );
	}

	this.maxPosX = this.cont.width() - this.winWidth + this.extraLeft;


};


SlideHor.prototype.allLoaded = function() {

	this.mainLoading.removeClass( "loading" );

	this.checkWinWidth();
	this.slide.addClass( 'trans' );

	if ( this.initAnim ) {
		this.cont.animate( { left: 0 }, 2000, "easeOutBack" );
	}
	else {
		this.cont.hide().css( {left: 0, opacity: 0} ).show();
		this.cont.animate( {opacity: 1 }, 1500 );
	}

	//if (this.nrImg > 0 && this.nrOitems > 0) this.olist.css({width: this.widthTotal});

	this.dontMove = true;

	this.slidePos = this.cont.position().left;
	this.extraLeft = this.slide.offset().left;
	this.maxPosX = this.widthTotal - this.winWidth + this.extraLeft;

	if ( this.widthTotal > this.winWidth ) {
		this.dragSlide();
		this.animateSlide( this.winWidth / 2 );
	}

};

SlideHor.prototype.dragSlide = function() {

	var that = this;
	var initX;
	var posX;
	var clientPosX;

	function mouseDownHandler( e ) {
		e.preventDefault();
		if ( !that.draggable ) return true;
		initX = e.clientX;
		posX = that.cont.position().left;
		that.$body.bind( 'mousemove.DragSlide', mouseMoveHandler );
		that.$body.bind( 'mouseup.DragSlide', mouseUpHandler );
		that.$body.bind( 'mouseleave.DragSlide', mouseUpHandler );
	}

	function mouseMoveHandler( e ) {
		clientPosX = e.clientX;
		that.cont.stop( true, false );
		that.cont.css( { left: posX - (initX - e.clientX), opacity: 1 } );
	}

	function mouseUpHandler( e ) {
		that.$body.unbind( 'mousemove.DragSlide', mouseMoveHandler );
		that.$body.unbind( 'mouseup.DragSlide', mouseUpHandler );
		that.$body.unbind( 'mouseleave.DragSlide', mouseUpHandler );
		that.slidePos = that.cont.position().left;
		if ( that.slidePos >= 0 ) {
			that.bPrev.hide();
			that.bNext.show();
			that.cont.animate( { left: 0 }, 700, "easeOutQuad" );
		}
		else if ( Math.abs( that.slidePos ) >= that.maxPosX ) {
			that.bPrev.show();
			that.bNext.hide();
			that.cont.animate( { left: -that.maxPosX }, 700, "easeOutQuad" );
		}
		else {
			that.bNext.show();
			that.bPrev.show();
		}
		if ( Math.abs( initX - clientPosX ) > 100 ) that.removeButtonAnimation();
	}

	this.cont.bind( 'mousedown.DragSlide', mouseDownHandler );

};

SlideHor.prototype.animateSlide = function( slideValue ) {


	var that = this;
	var slider = this.cont;
	var sliVal = (typeof (slideValue) === "undefined") ? this.winWidth : slideValue;
	var $body = $( document.body );
	this.bNext.animate( { right: 15 }, 700, "easeOutCubic" );
	this.bPrev.hide().css( { left: 15 }, 700, "easeOutCubic" );

	function slideRight( e ) {

		e.preventDefault();

		that.removeButtonAnimation();

		slider.stop( true, false );
		var posX = slider.position().left;
		if ( Math.abs( posX ) < sliVal ) {
			slider.animate( { left: 0, opacity: 1 }, 1500, "easeOutQuint" );
			$( this ).hide();
		}
		else {
			slider.animate( { left: posX + sliVal, opacity: 1 }, 1500, "easeOutQuint" );
		}
		that.bNext.show();
		that.slidePos = slider.position().left;
	}

	function slideLeft( e ) {

		e.preventDefault();

		that.removeButtonAnimation();

		that.cont.stop( true, false );
		var posX = slider.position().left;
		var valC = that.widthTotal - (Math.abs( posX ) + that.winWidth) + that.extraLeft;
		if ( valC > sliVal ) {
			slider.animate( { left: posX - sliVal, opacity: 1 }, 1500, "easeOutQuint" );
		}
		else if ( valC < sliVal ) {
			slider.animate( { left: posX - valC, opacity: 1 }, 1500, "easeOutQuint" );
			$( this ).hide();
		}
		else {
			slider.animate( { left: posX - sliVal, opacity: 1 }, 1500, "easeOutQuint" );
			$( this ).hide();
		}
		that.bPrev.show();
		that.slidePos = slider.position().left;
	}


	this.bPrev.click( slideRight );
	this.bNext.click( slideLeft );
	$body.bind( 'keydown.Slider', function( e ) {
		if ( that.draggable == true ) {
			if ( e.keyCode == 37 ) that.bPrev.trigger( 'click' );
			else if ( e.keyCode == 39 ) that.bNext.trigger( 'click' );
		}
	} );

};

SlideHor.prototype.removeButtonAnimation = function() {

	if ( !this.bPrev.hasClass( 'animated' ) && !this.bNext.hasClass( 'animated' ) ) return false;

	this.bPrev.removeClass( 'animated' );
	this.bNext.removeClass( 'animated' );
	this.bPrev.removeClass( 'bounce-left' );
	this.bNext.removeClass( 'bounce-right' );

};

Gallery.prototype.init = function( params ) {

	if ( typeof(params) === "undefined" ) this.pars = {};
	else this.pars = params;

	var _this = this;

	this.cont = (typeof(this.pars.content) === "undefined") ? $( '.gallery' ) : this.pars.content;
	this.list = (typeof(this.pars.list) === "undefined") ? $( '.grid .mold', this.cont ) : $( this.pars.list, this.cont );

	this.parObj = (typeof(this.pars.items) === "undefined") ? 'figure' : this.pars.items;

	this.items = $( this.parObj, this.list );
	this.nrItems = this.items.length;

	if ( typeof(this.pars.frame) === "undefined" ) this.pars.frame = {};

	this.frame = (typeof(this.pars.frame.block) === "undefined") ? $( '.gal-frame', this.cont ) : this.pars.frame.block;
	this.fCont = (typeof(this.pars.frame.content) === "undefined") ? $( '.cont', this.frame ) : $( this.pars.frame.content, this.frame );
	this.fImg = (typeof(this.pars.frame.image) === "undefined") ? $( '.img', this.frame ) : $( this.pars.frame.image, this.frame );
	this.fInfo = (typeof(this.pars.frame.info) === "undefined") ? $( '.info', this.frame ) : $( this.pars.frame.info, this.frame );
	this.btClose = (typeof(this.pars.frame.bt_close) === "undefined") ? $( '.bt-close', this.frame ) : $( this.pars.frame.bt_close, this.frame );
	this.btNext = (typeof(this.pars.frame.bt_next) === "undefined") ? $( '.bt-next', this.frame ) : $( this.pars.frame.bt_next, this.frame );
	this.btPrev = (typeof(this.pars.frame.bt_previous) === "undefined") ? $( '.bt-prev', this.frame ) : $( this.pars.frame.bt_previous, this.frame );

	this.filter = (typeof(this.pars.filter) === "undefined") ? $( '.filter', this.cont ) : this.pars.filter;

	this.ci = 0;
	this.fOpened = false;

	//PARA ALTERAR
	/*this.coffTop = this.list.offset().top;
	 this.win = $(window);
	 this.win.bind('scroll.Gallery', function(e){ _this.scrollHandler(); });
	 this.scrollHandler();*/

	this.items.bind( 'click.Gallery', function( e ) {
		e.preventDefault();

		var dataAttr = $( this ).attr( "data-zoom" );

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

};

Gallery.prototype.closeFrame = function() {

	if ( this.frame.hasClass( "gal-frame" ) ) this.closeFrameNormal();
	else this.closeFrameProjects();

};

Gallery.prototype.selectItem = function( obj, toAnimate ) {

	if ( this.frame.hasClass( "gal-frame" ) ) this.selectItemNormal( obj, toAnimate );
	else this.selectItemProjects( obj );

};

Gallery.prototype.selectItemProjects = function( obj ) {

	var _this = this;
	var _obj = obj;

	var _img = (typeof(this.pars.image) === "undefined") ? _obj.find( 'img' ) : _obj.find( this.pars.image );

	var _info = (typeof(this.pars.info) === "undefined") ? $( 'figcaption', _obj ) : $( this.pars.info, _obj );
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

		fig.css( { marginTop: -(fig.height() / 2) } );
		;

		_this.btNext.show();
		_this.btPrev.show();
		_this.btClose.show();

	}

	function errorImage() {

		_this.frame.hide();

	}

};

Gallery.prototype.closeFrameProjects = function() {

	var _this = this;

	this.filter.hide();
	this.frame.hide();

};


Gallery.prototype.selectItemNormal = function( obj, toAnimate ) {

	var _this = this;
	var _obj = obj;

	var _img = (typeof(this.pars.image) === "undefined") ? _obj.find( 'img' ) : _obj.find( this.pars.image );

	var _info = (typeof(this.pars.info) === "undefined") ? $( 'figcaption', _obj ) : $( this.pars.info, _obj );
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

		//this.btNext.stop(true, false);
		//this.btPrev.stop(true, false);
		//this.btClose.stop(true, false);

		//this.btNext.animate({right: 5}, 1000, "easeOutQuint");
		//this.btPrev.animate({left: 5}, 1000, "easeOutQuint");
		//this.btClose.animate({top: 0}, 1000, "easeOutQuint");
	}


	this.frame.stop( true, true );
	this.frame.show();
	//this.fCont.animate({height: 300}, 1500, "easeOutQuint");

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

Gallery.prototype.closeFrameNormal = function() {

	var _this = this;

	this.filter.hide();
	this.frame.stop( true, true );
	//this.frame.hide();

	this.frame.animate( {height: 0, width: 0, marginTop: 0, marginLeft: 0, opacity: 0}, 1000, "easeOutQuint", function() {
		_this.frame.hide();
	} );

	_this.fOpened = false;

	this.btNext.hide();
	this.btPrev.hide();
	this.btClose.hide();

	//this.btNext.animate({right: -30}, 1000, "easeOutQuint");
	//this.btPrev.animate({left: -30}, 1000, "easeOutQuint");
	//this.btClose.animate({top: -30}, 1000, "easeOutQuint");

};

Gallery.prototype.scrollHandler = function() {

	var stop = this.win.scrollTop();

	if ( stop > this.coffTop ) {
		this.frame.css( {top: stop - this.coffTop} );
	}
	else {
		this.frame.css( {top: 0} );
	}

};

ColourList.prototype.init = function() {

	var _this = this;

	this.cont = $( '.colour-list' );

	this.nav = $( '.colour-menu', this.cont );
	this.navItems = $( 'ul > li', this.nav );

	this.list = $( '.colour-grid', this.cont );
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

	this.tBot.bind( 'click.ColourList', function( e ) {
		_this.showTab( e );
	} );
	this.tClose.bind( 'click.ColourList', function() {
		_this.hideTooltip();
	} );
	//this.navItems.bind('click.ColourList', function(e){ e.preventDefault(); _this.showList($(this).index()) } );

	//this.showList(0);

	this.table = $( 'table.matrix-prod', this.cont );
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
	};

	function clickDocument( e ) {

		if ( _this.target.has( e.target ).length === 0 ) {
			_this.doc.unbind( 'click.ColourList' );
			_this.hideTooltip();
			_this.items.removeClass( 'open' );
		}
	};

	function navigateToColour( e ) {

		e.preventDefault();
		var ind = $( this ).closest( 'li' ).index();
		_this.navigateToColour( ind );

	}

};

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

	var posY = obj.offset().top + (this.items.height() / 2);
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


ColourStudies.prototype.init = function() {

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

	this.selMenuImg = [];

	this.nrTotal = this.img.length;
	this.nrLoaded = 0;

	this.scrollable = $( 'html, body' );

	this.win = $( window );

	this.btUp.bind( 'click.ColourStudies', function( e ) {

		e.preventDefault();
		_this.scrollable.animate( {scrollTop: 0}, 1200, "easeInOutQuint" );

	} );

	this.btDown.bind( 'click.ColourStudies', function( e ) {

		e.preventDefault();

		var thisObj = $( this ).closest( 'li' );
		var next = thisObj.next();
		var nextColourId = next.attr( 'data-colourid' );

		_this.animateToColour( nextColourId );

	} );

	this.checkImages();

};

ColourStudies.prototype.checkImages = function() {

	var _this = this;

	//this.cont.addClass('loading');

	for ( var i = 0, n = this.img.length; i < n; i++ ) {
		var img = this.img.eq( i );
		this.createMenuImages( this.img.eq( i ).attr( 'src' ), this.name.eq( i ).html(), this.items.eq( i ).attr( 'data-colourid' ) );
		//this.loadImage(img.attr('src'));
	}

	this.win.load( function() {
		_this.allLoaded();
	} );

	this.createSelectionMenu();

};

ColourStudies.prototype.loadImage = function( source ) {

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

};

ColourStudies.prototype.allLoaded = function() {

	var _this = this;

	this.resizeHandler();

	this.win.bind( 'resize.ColourStudies', function() {
		_this.resizeHandler();
	} );
	this.win.bind( 'scroll.ColourStudies', function() {
		_this.scrollHandler();
	} );

	this.getColourUrl();

	this.cont.removeClass( 'loading' );
	this.list.show();

};

ColourStudies.prototype.resizeHandler = function() {

	this.posArr = new Array();

	this.winH = this.win.height();
	var valW = (this.winH * 1920) / 514;

	this.items.css( {height: this.winH} );

	this.extra = this.cont.offset().top;

	for ( var i = 0; i < this.items.length; i++ ) {
		if ( i == 0 ) {
			this.posArr.push( (this.winH * i) );
		}
		else {
			this.posArr.push( (this.winH * i) );
		}

	}

	this.ttH = this.winH * this.nrItems;

	this.cont.css( {height: this.ttH  } );

	for ( var n = 0; n < this.items.length; n++ ) {
		this.items.eq( n ).css( { position: 'absolute', top: this.posArr[n], zIndex: n + 1} );

	}

	this.scrollHandler();

	this.img.css( {height: this.winH, width: valW, marginLeft: -(valW / 2)} );

};

ColourStudies.prototype.scrollHandler = function() {

	var _this = this;

	var sTop = this.win.scrollTop();
	var blockInd = Math.floor( ((sTop - this.extra) / this.ttH) * this.nrItems );

	blockInd = (blockInd >= 0) ? blockInd : 0;

	if ( sTop > this.extra ) {
		this.btUp.css( {bottom: 0} );
		this.menuCont.css( {marginTop: 0 } );
		this.firstBt.css( {marginTop: 0} );
	}
	else {
		this.menuCont.css( {marginTop: this.extra - sTop } );
		this.firstBt.css( {marginBottom: this.extra - sTop } );
		this.btUp.css( {bottom: -30} );
	}

	for ( var i = blockInd; i < this.nrItems; i++ ) {

		var obj = this.items.eq( i );
		var top = parseInt( obj.css( 'top' ), 10 );
		var posInitTop = this.posArr[i];

		if ( sTop >= posInitTop + this.extra && i != this.nrItems - 1 ) {
			obj.css( { top: 0, position: 'fixed' } );
		}
		else {
			obj.css( {top: posInitTop, position: 'absolute' } );
		}

	}


};

ColourStudies.prototype.getColourUrl = function() {

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
				//$('html, body').animate({ scrollTop:  valTop });

			}
		}
	}
	else {
		return false;
	}

};

ColourStudies.prototype.animateToColour = function( colourId ) {

	var obj = this.items.filter( '[data-colourid="' + colourId + '"]' );
	var actTop = this.win.scrollTop();

	this.scrollable.stop( true, false );

	if ( obj.length == 1 ) {

		var valTop = this.extra + ( obj.index() * this.winH );

		var animTime = 750 * Math.ceil( (Math.abs( valTop - actTop ) / this.winH) );

		if ( animTime > 5000 ) animTime = 5000;

		this.scrollable.animate( { scrollTop: valTop }, animTime, "easeInOutQuint" );

	}

};

ColourStudies.prototype.createMenuImages = function( attribute, name, colourId ) {

	this.selMenuImg.push( {imageSource: attribute + "?w=92&h=63&l=960&t=0&r=1", colourName: name, colourId: colourId} );

};


ColourStudies.prototype.createSelectionMenu = function() {

	var _this = this;

	this.menuCont = $( '.colour-sel' );
	this.menu = $( 'ul', this.menuCont );

	for ( var i = 0, n = this.selMenuImg.length; i < n; i++ ) {
		this.menu.append( '<li><a href="#" data-colourid="' + this.selMenuImg[i].colourId + '"><figure><img src="' + this.selMenuImg[i].imageSource + '" alt="' + this.selMenuImg[i].colourName + '" /></figure><div class="name">' + this.selMenuImg[i].colourName + '</div></a></li>' )
	}

	this.menuItems = $( 'li', this.menu );
	this.btPrev = $( '.bt-prev', this.menuCont );
	this.btNext = $( '.bt-next', this.menuCont );
	this.menuWrap = $( '.slid-wrap', this.menuCont );
	this.menuBt = $( 'a', this.menuItems );

	this.extraMar = parseInt( this.menuItems.css( 'marginRight' ), 10 );
	this.menuTotalW = (this.menuItems.width() + this.extraMar) * this.menuItems.length;

	this.menu.css( {width: this.menuTotalW } );

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

			_this.menu.animate( {left: posX + _this.toSlide }, 1200, "easeOutQuad" );

		}

	}

	function slideRight( e ) {

		e.preventDefault();

		_this.menu.stop( true, true );

		var posX = _this.menu.position().left;

		if ( posX > -(_this.menuTotalW - _this.toSlide + _this.extraMar) ) {

			_this.menu.animate( {left: posX - _this.toSlide }, 1200, "easeOutQuad" );

		}

	}


};


function getParameterByName( name ) {
	name = name.replace( /[\[]/, "\\\[" ).replace( /[\]]/, "\\\]" );
	var regex = new RegExp( "[\\?&]" + name + "=([^&#]*)" ),
		results = regex.exec( location.search );
	return results == null ? "" : decodeURIComponent( results[1].replace( /\+/g, " " ) );
}

//SCROLLBAR
function ScrollBarGeneric( containerElemObj, contentContainerSelector, resizableContentSelector, scrollContainerSelector, scrollBarSelector ) {
	// WARNING: Make sure that when container element resizes, a resize event is correctly fired (NOTE: force if needed).

	var that = this;
	this.$body = $( document.body );
	this.$container = $( containerElemObj );

	this.$contentContainer = $( contentContainerSelector, this.$container );
	this.$resizableContent = $( resizableContentSelector, this.$container );

	this.$scrollContainer = $( scrollContainerSelector, this.$container );
	this.$scrollBar = $( scrollBarSelector, this.$scrollContainer );

	this.mouseClickPos = 0;
	this.barClickPos = 0;

	this.updateSize();

	// Register Event Handlers
	this.$contentContainer.scroll( scrollBarHandler );

	this.$scrollBar.bind( 'mousedown.ScrollBarGeneric', scrollStartDrag );
	this.$scrollBar.bind( 'mouseup.ScrollBarGeneric', scrollStopDrag );

	//this.$resizableContent.bind('resize.MuseumBar', onResize)

	function scrollBarHandler( e ) {
		that.$scrollBar.css( { top: ((that.$contentContainer.scrollTop() / that.contentRangeHeight) * that.scrollRangeHeight) } );
	}

	function scrollStartDrag( e ) {
		that.mouseClickPos = e.clientY;
		that.barClickPos = that.$scrollBar.position().top;
		that.$body.bind( 'mousemove.ScrollBarGeneric', scrollMousemove );
		that.$body.bind( 'mouseup.ScrollBarGeneric', scrollStopDrag );
		that.$body.addClass( 'scrolling' );
	}

	function scrollStopDrag( e ) {
		that.$body.unbind( 'mousemove.ScrollBarGeneric', scrollMousemove );
		that.$body.unbind( 'mouseup.ScrollBarGeneric', scrollStopDrag );
		that.$body.removeClass( 'scrolling' );
	}

	function scrollMousemove( e ) {
		var delta = (e.clientY - that.mouseClickPos);
		var scrollPos = that.barClickPos + delta;
		that.update( scrollPos );
	}

	function onResize() {
		that.updateSize();
	}
};

ScrollBarGeneric.prototype =
{
	updateSize: function() {
		// Update Size, based on container size.
		this.scrollRangeHeight = this.$scrollContainer.height() - this.$scrollBar.height();
		this.contentRangeHeight = this.$resizableContent.height() - this.$contentContainer.height();

		// Disable or Enable scrollbar
		if ( this.contentRangeHeight <= 0 )
			this.$scrollContainer.hide();
		else
			this.$scrollContainer.show();

		// Make sure scroll is within the available range
		this.update( this.$scrollBar.position().top );
	},

	update: function( scrollPos ) {
		if ( scrollPos < 0 ) {
			this.$scrollBar.css( { top: 0 } );
			this.$contentContainer.scrollTop( 0 );
		}
		else if ( scrollPos > this.scrollRangeHeight ) {
			this.$scrollBar.css( { top: this.scrollRangeHeight } );
			this.$contentContainer.scrollTop( this.contentRangeHeight );
		}
		else {
			this.$scrollBar.css( { top: scrollPos } );
			this.$contentContainer.scrollTop( this.contentRangeHeight * (scrollPos / this.scrollRangeHeight) );
		}
	}

};

function CheckBoxList( params ) {

	var _this = this;

	this.cont = $( params.group );

	this.chks = $( 'ul > li input[type="checkbox"]', this.cont ).not( params.select_all );

	this.selAll = $( params.select_all, this.cont );
	this.selAll.bind( 'change.CheckBoxList', checkAll );

	this.chks.bind( 'change.CheckBoxList', checkNormal );

	function checkNormal() {

		var chk = $( this );
		if ( _this.selAll.is( ':checked' ) && chk.is( ':checked' ) ) {
			_this.selAll.attr( 'checked', false );
			_this.selAll.trigger( 'change' );
		}
	}

	function checkAll() {

		var chk = $( this );
		if ( chk.is( ':checked' ) ) {
			_this.chks.attr( 'checked', false );
			_this.chks.trigger( 'change' );
		}
	}

};

$.fn.checkbox = function( params ) {

	$( this ).each( function( params ) {

		var chk = $( this );
		var name = (typeof(chk.parent().attr( 'data-checkbox-blc' )) === "undefined") ? "" : chk.parent().attr( 'data-checkbox-blc' );
		var blcs = $( '[data-checkbox="' + name + '"]' );

		var url = window.location.pathname;
		var isParam = url.indexOf( "/c/" );

		blcs = (blcs.length > 0) ? blcs : null;

		chk.wrap( '<span class="checkbox"></span>' );

		var par = chk.parent();

		par.bind( 'click.checkbox', function( e ) {
			if ( $( e.target ).attr( 'type' ) != "checkbox" ) {
				chk.trigger( 'click' );
			}
		} );

		chk.bind( 'change.checkbox', function() {
			validateCheckbox( $( this ), par, blcs );
		} );

		if ( isParam != -1 ) {
			var value = url.substring( isParam + 3 );
			if ( value == name && name != "" ) {
				chk.attr( 'checked', true );
				validateCheckbox( chk, par, blcs );
			}
		}

	} );

	function validateCheckbox( object, parent, blocks ) {
		if ( object.is( ':checked' ) ) {
			if ( blocks != null ) blocks.show();
			parent.addClass( 'checked' );
		}
		else {
			if ( blocks != null ) blocks.hide();
			parent.removeClass( 'checked' );
		}
	}

};

SubMenuFixed.prototype.init = function( pars ) {

	var _this = this;

	var params = ( typeof(pars) === "undefined" ) ? {} : pars;

	this.cont = (typeof(params.content_selector) === "undefined" ) ? $( '.sub-menu' ) : $( params.content_selector );
	this.fixed = (typeof(params.fixed_element_selector) === "undefined" ) ? $( '.mold', this.cont ) : $( params.fixed_element_selector, this.cont );
	this.scrlCtrl = (typeof(params.visible_element_selector) === "undefined" ) ? $( 'span', this.fixed ).eq( 0 ) : $( params.visible_element_selector, this.fixed );
	this.imgs = $( 'img', this.fixed );
	this.win = $( window );

	this.nrLoaded = 0;
	this.nrTotal = this.imgs.length;

	for ( var i = 0; i < this.nrTotal; i++ ) {
		this.imageLoader( this.imgs.eq( i ).attr( 'src' ) );
	}

};

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
	this.contNewH = (newW * this.contH) / this.contW;
	this.cont.css( { height: this.contNewH  } );

	if ( this.win.width() < 1024 ) return false;

	if ( !this.fixed.hasClass( 'fixed' ) ) {
		this.cTop = this.scrlCtrl.offset().top;
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

function VideoModal() {

	var _this = this;

	this.link = $( '.vid-link' );
	this.modal = $( '.vid-modal' );
	this.vidCont = $( '.vid-modal .cont' );
	this.vidWrap = $( '.vid', this.vidCont );

	this.vidId = this.link.attr( 'data-url' );

	this.btClose = $( '.bt-close', this.vidCont );

	this.btClose.bind( 'click.VideoModal', function( e ) {

		e.preventDefault();
		_this.modal.hide();
		_this.vidWrap.html( '' );

	} );


	this.link.bind( 'click.VideoModal', function( e ) {

		e.preventDefault();
		_this.modal.show();
		_this.vidWrap.html( '<iframe width="100%" height="100%" src="http://www.youtube.com/embed/' + _this.vidId + '?controls=0&autoplay=1" frameborder="0" allowfullscreen></iframe>' )

	} );

}

//--- indexOf() Internet Explorer 8/7 ----//

if ( !Array.prototype.indexOf ) {
	Array.prototype.indexOf = function( elt /*, from*/ ) {
		var len = this.length >>> 0;

		var from = Number( arguments[1] ) || 0;
		from = (from < 0)
			? Math.ceil( from )
			: Math.floor( from );
		if ( from < 0 )
			from += len;

		for ( ; from < len; from++ ) {
			if ( from in this &&
				this[from] === elt )
				return from;
		}
		return -1;
	};
}
;


