/**
 *
 * *.simulateTouch - https://github.com/martinkr/simulateTouch
 *
 * *.simulateTouch: enhance your automated tests by simulate touches and gestures!
 *
 *
 * @Version: 0.9
 *
 * @example:
 *
 * Copyright (c) 2010-2013 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jquery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 *
 */

/* jshint browser:true, jquery:true, strict: false, smarttabs:true, onevar:true, undef:true, unused:true, curly:true, latedef: true, sub:true */
/* global jQuery:true, $:true */

(function(root_) {
  root_.simulateTouch = function() {
	var

	_eventSwipe = function(element_,oStart_,oEnd_,iTouches_) {

		var _iTouches = iTouches_ || 1,
			_aTouches = [],
			_n = _iTouches
		;

		while(_n--) {
			_aTouches.push( { x: oStart_.x, y: oStart_.y});
		}

		_triggerTouch(element_, { type:'touchstart', touches : _aTouches});

		_n = _iTouches;
		_aTouches = [];

		while(_n--) {
			_aTouches.push( { x: oStart_.x+(oEnd_.x/2), y:oStart_.y+(oEnd_.y/2) });
		}
		_triggerTouch(element_, { type:'touchmove', changedTouches :_aTouches });

		_n = _iTouches;
		_aTouches = [];

		while(_n--) {
			_aTouches.push( { x: oEnd_.x, y: oEnd_.y, touches: iTouches_} );
		}
		_triggerTouch(element_, { type:'touchend', changedTouches : _aTouches });

	},

	_eventGesture = function(element_,oStart_,oEnd_,iTouches_) {
		var _iTouches = iTouches_ || 1
		;

		_triggerTouch(element_, { type:'touchstart', touches : { x: oStart_.x, y: oStart_.y, touches: _iTouches} });
		_triggerTouch(element_, { type:'touchmove', touches : { x: oStart_.x+(oEnd_.x/2), y:oStart_.y+(oEnd_.y/2), touches: _iTouches} });
		_triggerTouch(element_, { type:'touchend', touches : { x: oEnd_.x, y: oEnd_.y, touches: _iTouches} });
	},

	_triggerTouch= function(element_,oOptions_) {

		var _event ,
			_oData = {}
		;

		if (oOptions_.touches) { _oData.touches = _createTouch(oOptions_.touches); }
		if (oOptions_.changedTouches) { _oData.changedTouches = _createTouch(oOptions_.changedTouches); }
		if (oOptions_.targetTouches) { _oData.targetTouches = _createTouch(oOptions_.targetTouches); }


		_oData.bubbles = oOptions_.bubbles || undefined;
		_oData.cancelable = oOptions_.cancelable || true;
		_oData.view = oOptions_.view || undefined;
		_oData.detail = oOptions_.detail || undefined;
		_oData.screenX = oOptions_.screenX || 0;
		_oData.screenY = oOptions_.screenY || 0;
		_oData.pageX = oOptions_.pageX || 0;
		_oData.pageY = oOptions_.pageY || 0;
		_oData.ctrlKey = oOptions_.ctrlKey || false;
		_oData.altKey = oOptions_.altKey || false;
		_oData.shiftKey = oOptions_.shiftKey || false;
		_oData.metaKey = oOptions_.metaKey || false;
		_oData.scale = oOptions_.scale || 1;
		_oData.rotation = oOptions_.rotation || 1;

		_event = document.createEvent('TouchEvent');

		_event.initTouchEvent(oOptions_.type, _oData.bubbles, _oData.cancelable, _oData.view,
						_oData.detail, _oData.screenX, _oData.screenY, _oData.pageX, _oData.pageY, _oData.ctrlKey,
						_oData.altKey, _oData.shiftKey, _oData.metaKey, _oData.touches, _oData.targetTouches,
						_oData.changedTouches, _oData.scale, _oData.rotation);

		element_.dispatchEvent(_event);

	},

	_createTouch = function(oOptions_) {

		var _oTouches
		;

		if(!document.createTouch) {
			return {};
		}

		switch( oOptions_.length ) {
		  case 1 :
			_oTouches = document.createTouchList(
			  document.createTouch(null,null,null,null,null,oOptions_[0].x,oOptions_[0].y)
			);
		  break;

		  case 2 :
			_oTouches = document.createTouchList(
			  document.createTouch(null,null,null,null,null,oOptions_[0].x,oOptions_[0].y),
			  document.createTouch(null,null,null,null,null,oOptions_[1].x,oOptions_[1].y)
			);
		  break;

		  case 3 :
			_oTouches = document.createTouchList(
			  document.createTouch(null,null,null,null,null,oOptions_[0].x,oOptions_[0].y),
			  document.createTouch(null,null,null,null,null,oOptions_[1].x,oOptions_[1].y),
			  document.createTouch(null,null,null,null,null,oOptions_[2].x,oOptions_[2].y)
			);
		  break;

		  case 4 :
			_oTouches = document.createTouchList(
			  document.createTouch(null,null,null,null,null,oOptions_[0].x,oOptions_[0].y),
			  document.createTouch(null,null,null,null,null,oOptions_[1].x,oOptions_[1].y),
			  document.createTouch(null,null,null,null,null,oOptions_[2].x,oOptions_[2].y),
			  document.createTouch(null,null,null,null,null,oOptions_[3].x,oOptions_[3].y)
			);
		  break;

		  case 5 :
			_oTouches = document.createTouchList(
			  document.createTouch(null,null,null,null,null,oOptions_[0].x,oOptions_[0].y),
			  document.createTouch(null,null,null,null,null,oOptions_[1].x,oOptions_[1].y),
			  document.createTouch(null,null,null,null,null,oOptions_[2].x,oOptions_[2].y),
			  document.createTouch(null,null,null,null,null,oOptions_[3].x,oOptions_[3].y),
			  document.createTouch(null,null,null,null,null,oOptions_[4].x,oOptions_[4].y)
			);
		  break;
	  }

	  return _oTouches;
	};


	/**
	 * Public API
	 */
	return {
	  swipeUp :  function (element_) {
		_eventSwipe(element_,{x:0,y:0},{x:0,y:-300});
	  },
	  swipeRight :  function (element_) {
		_eventSwipe(element_,{x:0,y:0},{x:300,y:0});
	  },
	  swipeDown :  function (element_) {
		_eventSwipe(element_,{x:0,y:0},{x:0,y:300});
	  },
	  swipeLeft :  function (element_) {
		_eventSwipe(element_,{x:0,y:0},{x:-300,y:0});
	  },

	  swipe :  function (element_,oOptions_) {
	//    _triggerTouch(element_.get(0), oOptions_ });
	  },
	  pinch : _eventGesture,
	  rotate : _eventGesture

	};

  }();
// use this line if you prefer to extend the jQuery-object
// })(jQuery);
// set roo to window
})(window);


