/**
 *
 * *.simulateTouch - https://github.com/martinkr/simulateTouch
 *
 * *.simulateTouch: enhance your automated tests by simulate touches and gestures!
 *
 *
 * @Version: 1.0
 *
 * @example:
 *
 * Copyright (c) 2010-2013 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (public.mkrause.info)
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
		_iIdentifier = 1,

	/**

	 */
	_genericSwipe = function(element_, aStart_, aEnd_) {

		var _iTouches = aStart_.length || 1,
			_aTouches = [],
			_aProp = ['screenX','screenY','pageX','pageY'],
			_i = _iTouches,
			_j,
			_iProp = _aProp.lenght
		;

		// fire touchstart with all touchpoints
		aStart_.forEach(function (oItem_, i_){
      		aStart_[i_].identifier = ( !aStart_[i_].identifier ) ? _iIdentifier+''+1 : aStart_[i_].identifier;
			_aTouches.push( aStart_[i_] );
 		});

		_triggerTouch(element_, { type:'touchstart', touches : _aTouches, changedTouches : _aTouches, targetTouches : _aTouches });


		// fire touchmove with all touchpoints
 		_aTouches = [];
		aStart_.forEach(function (oItem_, i_){
      		_aProp.forEach(function (sProp_) {
				if(aStart_[i_][sProp_] ) {
					aStart_[i_][sProp_] = (aStart_[i_][sProp_] + aEnd_[i_][sProp_]) / 2;
				}
      		})
			_aTouches.push( aStart_[i_] );
 		});

		_triggerTouch(element_, { type:'touchmove', touches : _aTouches, changedTouches : _aTouches, targetTouches : _aTouches });


		// fire touchend with all touchpoints
		_aTouches = [];
		aEnd_.forEach(function (oItem_, i_){
      		aEnd_[i_].identifier = ( !aEnd_[i_].identifier ) ? aStart_[i_].identifier : aEnd_[i_].identifier;
			_aTouches.push( aEnd_[i_] );
 		});

		_triggerTouch(element_, { type:'touchend', touches : [], changedTouches : _aTouches, targetTouches : [] });

	},


	/**
	 * simulates a gesture
	 * @param  {[type]} element_  [description]
	 * @param  {[type]} oStart_   [description]
	 * @param  {[type]} oEnd_     [description]
	 * @param  {[type]} iTouches_ [description]
	 * @return {[type]}           [description]
	 */
	_eventGesture = function(element_,oStart_,oEnd_,iTouches_) {
		// var _iTouches = iTouches_ || 1
		// ;

		// _triggerTouch(element_, { type:'touchstart', touches : { x: oStart_.x, y: oStart_.y, touches: _iTouches} });
		// _triggerTouch(element_, { type:'touchmove', touches : { x: oStart_.x+(oEnd_.x/2), y:oStart_.y+(oEnd_.y/2), touches: _iTouches} });
		// _triggerTouch(element_, { type:'touchend', touches : { x: oEnd_.x, y: oEnd_.y, touches: _iTouches} });
	},


	/**
	 * Dispatches the created touch event
	 * with all the touches in touchlists
	 * and the additional properties
	 * @param  {DOM-Element} element_  The DOM-Element on which the event will be fired (event.target)
	 * @param  {Object} oOptions_ The properties describing the event.
	 * @return {Void}
	 */
	_triggerTouch = function(element_,oOptions_) {
		var _event = _setupEvent(element_,oOptions_);
		element_.dispatchEvent(_event);
	},



	/**
	 * Creates a touch event and set the given properties
	 * @see https://developer.apple.com/library/safari/documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/javascript/instm/TouchEvent/initTouchEvent
	 * initTouchEvent (
	 * 	type,
	 *	canBubble, // ios: but implemented as "bubbles" ?!
	 *	cancelable,
	 *	view,
	 *	detail,
	 *	screenX, // ios: not implemented ?!
	 *	screenY, // ios: not implemented ?!
	 *	clientX, // ios: not implemented ?!
	 *	clientY, // ios: not implemented ?!
	 *	ctrlKey,
	 *	altKey,
	 *	shiftKey,
	 *	metaKey,
	 *	touches,
	 *	targetTouches,
	 *	changedTouches,
	 *	scale,
	 *	rotation
	 * );
	 *
	 * screenX/Y
	 * coordinate of point relative to the screen in pixels
	 *
	 * clientX/Y
	 * 	coordinate of point relative to the viewport in pixels, excluding any scroll offset
	 *
	 *
	 * @see http://www.w3.org/TR/touch-events/#touchevent-interface
	 *
	 * changedTouches of type TouchList, readonly
 	 *  a list of Touches for every point of contact which contributed to the event.
 	 * 	For the touchstart event this must be a list of the touch points that just became active with the current event.
 	 * 	For the touchmove event this must be a list of the touch points that have moved since the last event.
 	 * 	For the touchend and touchcancel events this must be a list of the touch points that have just been removed from the surface.
 	 *
 	 * targetTouches of type TouchList, readonly
	 *  a list of Touches for every point of contact that is touching the surface and
	 *  started on the element that is the target of the current event.
 	 *
 	 * touches of type TouchList, readonly
	 *  a list of Touches for every point of contact currently touching the surface.
 	 *
	 * @param  {Object} oOptions_ the event properties
	 * @return {TouchEvent}           touch event
	 */
	_setupEvent = function(element_,oOptions_) {

		var _event ,
			_oData = {}
		;


		if (oOptions_.touches) { 
			_oData.touches = _createTouchList(element_,oOptions_.touches);
		}

		if (oOptions_.changedTouches) { 
			_oData.changedTouches = _createTouchList(element_,oOptions_.changedTouches);
		}

		if (oOptions_.targetTouches) { 
			_oData.targetTouches = _createTouchList(element_,oOptions_.targetTouches);
		}

 		_oData.bubbles = oOptions_.bubbles || false;
		_oData.cancelable = oOptions_.cancelable || true;
		_oData.view = oOptions_.view || window ;
		_oData.detail = oOptions_.detail || undefined;
		_oData.screenX = oOptions_.screenX || 0;
		_oData.screenY = oOptions_.screenY || 0;
		_oData.clientX = oOptions_.clientX || 0;
		_oData.clientY = oOptions_.clientY || 0;
		_oData.ctrlKey = oOptions_.ctrlKey || false;
		_oData.altKey = oOptions_.altKey || false;
		_oData.shiftKey = oOptions_.shiftKey || false;
		_oData.metaKey = oOptions_.metaKey || false;
		_oData.scale = oOptions_.scale || 1;
		_oData.rotation = oOptions_.rotation || 0;
		// implemented but not part of the specs
		_oData.pageX = oOptions_.pageX || _oData.clientX  + window.pageXOffset;
		_oData.pageY = oOptions_.pageY || _oData.clientY  + window.pageYOffset;

 		_event = document.createEvent('TouchEvent');

		_event.initTouchEvent(oOptions_.type, _oData.bubbles, _oData.cancelable, _oData.view,
						_oData.detail, _oData.screenX, _oData.screenY, _oData.pageX, _oData.pageY, _oData.ctrlKey,
						_oData.altKey, _oData.shiftKey, _oData.metaKey, _oData.touches, _oData.targetTouches,
						_oData.changedTouches, _oData.scale, _oData.rotation);
		return _event;
	},


	/**
	 * Creates a touchlist of single touch points.
	 * The touch describes the individual touch point for a touch event.
	 * The touchlist describes all touch points for the touch event.
	 *
	 * @see http://www.w3.org/TR/touch-events/#touch-interface
	 * Touch {
	 *	view
	 *	identifier,
	 *	target,
	 *	screenX,
	 *	screenY,
	 *	clientX,
	 *	clientY,
	 *	pageX,
	 *	pageY
	 * };
	 *
	 * screenX/Y
	 * coordinate of point relative to the screen in pixels
	 *
	 * clientX/Y
	 * 	coordinate of point relative to the viewport in pixels, excluding any scroll offset
	 *
	 * pageX/Y
	 * 	coordinate of point relative to the viewport in pixels, including any scroll offset
	 *
	 * TouchList {
	 * 	touches
	 * }
	 *
	 * @see https://developer.apple.com/library/safari/documentation/UserExperience/Reference/DocumentAdditionsReference/DocumentAdditions/DocumentAdditions.html
	 * view
	 * 	The view (DOM window) in which the event occurred.
	 * target
	 * 	The target of this gesture.
	 * identifier
	 * 	The unique identifier for this touch object.
	 * pageX
	 *  The x-coordinate of the touch’s location, in page coordinates.
	 * pageY
	 * 	The y-coordinate of the touch’s location, in page coordinates.
	 * screenX
	 * 	The x-coordinate of the event’s location, in screen coordinates.
	 * screenY
	 * 	The y-coordinate of the event’s location, in screen coordinates.
	 *
	 * iOS7: clientX/Y == pageX/Y
	 *
	 * @param  {Object} oOptions_  Touch options
	 * @return {TouchList}
	 */
	_createTouchList = function(element_,oOptions_) {

		var _oTouches,
			_aTouches = [],
			_i,
			_iLength =  oOptions_.length,
			_oDefault = {
				view: window,
				identifier : oOptions_.identifier || 1,
				target: element_,
				screenX: oOptions_.screenX || 0,
				screenY: oOptions_.screenY || 0,
				pageX: oOptions_.pageX || 0,
				pageY: oOptions_.pageY || 0
				// ,
				// clientX: oOptions_.clientX  + window.pageXOffset || 0 + window.pageXOffset ,
				// clientY: oOptions_.clientY  + window.pageYOffset || 0 + window.pageYOffset
			},
			_sKey
		;

		// enforce properties
		for (_i = 0 ; _i < _iLength; _i++) {
			for (_sKey in _oDefault){
				if (!oOptions_[_i][_sKey]) {
					oOptions_[_i][_sKey] = _oDefault[_sKey];
				}
			}
			// create arguments array
			_aTouches.push(document.createTouch(
				oOptions_[_i].view,
				oOptions_[_i].target,
				oOptions_[_i].identifier,
				oOptions_[_i].pageX,
				oOptions_[_i].pageY,
				oOptions_[_i].screenX,
				oOptions_[_i].screenY
				// ,
				// oOptions_[_i].clientX,
				// oOptions_[_i].clientY
				)
			);
		}

		// create touchlist
		return document.createTouchList.apply(document,_aTouches);
 	};


	/**
	 * Public API
	 */
	return {

		swipeUp : function (element_) {
			_genericSwipe( element_, [{ identifier: 1, pageY:300 }], [{ identifier: 1, pageY: 0 }], {} );
		},

		swipeRight : function (element_) {
			_genericSwipe( element_, [{ identifier: 2, pageX:0 }],  [{ identifier: 2, pageX: 300 }], {} );
		},

		swipeDown :	function (element_) {
			_genericSwipe( element_, [{ identifier: 3, pageY:0 }], [{ identifier: 3, pageY: 300 }], {} );
		},

		swipeLeft :	function (element_) {
			_genericSwipe( element_, [{ identifier: 3, pageX:300 }], [{ identifier: 3, pageX: 0 }], {} );
		},
		/**
		 *
	 	 * screenX/Y
		 * coordinate of point relative to the screen in pixels
		 *
		 * clientX/Y
		 * 	coordinate of point relative to the viewport in pixels, excluding any scroll offset
		 *
		 * pageX/Y
		 * 	coordinate of point relative to the viewport in pixels, including any scroll offset
	 	 *
		 * @return {[type]} [description]
		 */
		genericSwipe : function (element_, _aStart, _aEnd, _oEvent) {
			_genericSwipe(element_, _aStart, _aEnd, _oEvent);
		}

	};

	}();
// use this line if you prefer to extend the jQuery-object
// })(jQuery);
// set root to window
})(window);


