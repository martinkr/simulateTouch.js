/**
 *
 * *.simulateTouch - https://github.com/martinkr/simulateTouch.js
 *
 * *.simulateTouch: enhance your automated tests by simulate touches and gestures!
 *
 *
 * @Version: 2.0.0-alpha
 *
 * @example:
 *
 * Copyright (c) 2010-2014 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 *
 */

/* add duration via settimeout */
/* tap double tap lond press two finger tap*/
/* jshint browser:true, strict: false, smarttabs:true, onevar:true, undef:true, unused:true, curly:true, latedef: true, sub:true */
/* global jQuery:true, $:true */

(function(root_) {

	root_.simulateTouch = function() {

	"use strict";

	var
		_iIdentifier = 9999, //new Date().getTime(),
		_id = 1,
		_oQueue = {},
		_timer =null,

	/**
	 * Entry point for all swipe gestures.
	 * Prepares the options and pushes this specific
	 * gesture to the queue
	 * @param  {HTML-Element} element_	Element to trigger the event on
	 * @param  {Array} _aStart	Array of Objects. Each object contains the details for a single touchpoint's start position.
	 * @param  {Array} _aEnd	Array of Objects. Each object contains the details for a single touchpoint's end position.
	 * @param  {Object} _oEvent	Contains the details for the event itself.
	 * @return {Void}
	 */
	_genericEvent = function(element_, aStart_, aEnd_, oEvent_) {

		var _iDuration  = oEvent_.duration || 60,
			_sType  = oEvent_.type || 'touch' ;

		// check for necessary information
		if(!aStart_.length) { throw new Error('simulateTouch.js: no touches specified');}
		if(aStart_.length !== aEnd_.length) { throw new Error('simulateTouch.js: start and end need same amount of touches');}

		delete oEvent_.duration;
		delete oEvent_.type;

		// construct queue for all events
		_oQueue[++_id] =  {
			id: _id,
			type : _sType,
			phase : 0,
			counter: Math.ceil(_iDuration / 20) ,
			duration : _iDuration,
			steps :  Math.ceil(_iDuration / 20) ,
			fn: 'doGenericEvent',
			args : {
				element : element_,
				aStart : aStart_,
				aEnd : aEnd_,
				oEvent : oEvent_
			}
		};
		// _doGenericEvent.apply(this,_oQueue[_id].args);
		// _doGenericEvent(element_, aStart_, aEnd_, oEvent_,_id);
		_setInterval();
	},

	/**
	 * Set the interval if necessary and
	 * executes the swipe functions periodically
	 * @return {Void}
	 */
	_setInterval = function () {
		if (_timer) { return; }
		_timer = setInterval(function(){
			// console.log('tick item in queue: ', Object.keys(_oQueue).length)
			if (Object.keys(_oQueue).length) {
				Object.keys(_oQueue).forEach(function(id_) {
					// console.log('tick item #',_oQueue[id_], ' with function : ',_oQueue[id_].fn)
					root_.simulateTouch[_oQueue[id_].fn](_oQueue[id_]);
				});
			} else {
				_timer = window.clearInterval(_timer);
			}
		}, 20);
	},

	/**
	 * Triggers a generic swipe gesture.
	 * @param  {HTML-Element}	element_ Element to trigger events on
	 * @param  {Array} _aStart	Array of Objects. Each object contains the details for a single touchpoint's start position.
	 * @param  {Array} _aEnd	Array of Objects. Each object contains the details for a single touchpoint's end position.
	 * @param  {Object} _oEvent	Contains the details for the event itself.
	 */
	_doGenericEvent = function(oOptions_) {

		var
			_aTouches = [],
			_aPropCalculation = ['screenX','screenY','pageX','pageY','rotation','scale'],
			_oEvent = oOptions_.args.oEvent || {},
			_aStart = oOptions_.args.aStart,
			_aEnd = oOptions_.args.aEnd,
			_aMove = [],
			element_ = oOptions_.args.element,
			_sType = oOptions_.type
		;

		// decrease calls
		oOptions_.counter--;

		// decide which touch should be fired
		switch (oOptions_.phase) {

			// start: once
			case 0:
				// check for necessary information
				if(!_aStart.length) { throw new Error('simulateTouch.js: no touches specified');}
				if(_aStart.length !== _aEnd.length) { throw new Error('simulateTouch.js: start and end need same amount of touches');}

				// fire touchstart with all touchpoints
				_aStart.forEach(function (oItem_, i_){
					_aStart[i_].identifier = ( !_aStart[i_].identifier ) ? _iIdentifier+''+1 : _aStart[i_].identifier;
					_aTouches.push( _aStart[i_] );
				});

				// clone current for calculating the movements
				_aStart.forEach(function (oItem_, i_){
					var _elTarget;
					// remove cyclic reference
					if( _aStart[i_].target){
						_elTarget = _aStart[i_].target;
						_aStart[i_].target = null;
					}
					// clone
					_aMove[i_] = JSON.parse(JSON.stringify(oItem_));
					// set target again
					if( _elTarget ) {
						_aMove[i_].target = _elTarget;
						_aStart[i_].target = _elTarget;
					}
				});

				// cache clone
				oOptions_._aMove = _aMove  ;

				// touchstart: toches == changedTouches == targetTouches
				if(_sType === 'touch') {
					_oEvent.type = 'touchstart';
					_oEvent.touches = _aTouches;
					_oEvent.changedTouches = _aTouches;
					_oEvent.targetTouches = _aTouches;
				}

				// gesture events doesn't have touchlists -
				// we're taking the rotation & scale from the first array
				if(_sType === 'gesture') {
					_oEvent.type = 'gesturestart';
					_oEvent.rotation = _aStart[0].rotation;
					_oEvent.scale = _aStart[0].scale;
				}

				// one call left, send *move next
				oOptions_.trigger = true;
				oOptions_.phase++;

			break;

			// move: multiple times
			case 1:
				// fire touchmove with all touchpoints
				_aTouches = [];
				// grab clone
				_aMove = oOptions_._aMove;

				// calculate movement
				_aMove.forEach(function (oItem_, i_){
					_aPropCalculation.forEach(function (sProp_) {
						var _iStepDelta = 0,
							_iDirection
						;
						if(_aStart[i_][sProp_] !== undefined  && _aEnd[i_][sProp_] !== undefined ) {
							_iDirection = (_aStart[i_][sProp_] > _aEnd[i_][sProp_]) ? -1 : +1 ;
							_iStepDelta = Math.abs(_aStart[i_][sProp_] - _aEnd[i_][sProp_]) / oOptions_.steps;
							_aMove[i_][sProp_] += ( _iDirection * (_iStepDelta) );
							// console.log(' ---- ')
							// console.log('counter', oOptions_.counter,'_aStart', sProp_, _aStart[i_][sProp_] , '_aEnd', sProp_, _aEnd[i_][sProp_], ' ---- move in _iDirection', _iDirection , 'by ',(_iStepDelta), ' - current position: ', _aMove[i_][sProp_])
						}
					});
					_aTouches.push( _aMove[i_] );
				});

				// touchmove: toches == changedTouches == targetTouches
				if(_sType === 'touch') {
					_oEvent.type = 'touchmove';
					_oEvent.touches = _aTouches;
					_oEvent.changedTouches = _aTouches;
					_oEvent.targetTouches = _aTouches;
					oOptions_.trigger = true;
				}

				// gesture events doesn't have a move event
				if(_sType === 'gesture') {
					oOptions_.trigger = false;
				}

				// one call left, send *end next
				if (oOptions_.counter === 1 ) {oOptions_.phase++;}

			break;

			// end: once
			case 2:
				// fire touchend with all touchpoints
				_aTouches = [];
				_aEnd.forEach(function (oItem_, i_){
					_aEnd[i_].identifier = ( !_aEnd[i_].identifier ) ? _aStart[i_].identifier : _aEnd[i_].identifier;
					_aTouches.push( _aEnd[i_] );
				});

				// touchend: changedTouches only
				if(_sType === 'touch') {
					_oEvent.type = 'touchend';
					_oEvent.touches = [];
					_oEvent.changedTouches = _aTouches;
					_oEvent.targetTouches = [];
				} 

				// gesture events doesn't have touchlists -
				// we're taking the rotation & scale from the first array
				if(_sType === 'gesture') {
					_oEvent.type = 'gestureend';
					_oEvent.rotation = _aEnd[0].rotation;
					_oEvent.scale = _aEnd[0].scale;
				}

				// done for this id
				oOptions_.trigger = true;
				delete _oQueue[oOptions_.id];

			break;

		}

		// fire!
		if ( oOptions_.trigger === true ) {
			_triggerEvent(element_, _oEvent);
		}

	},



	/**
	 * Dispatches the created touch event
	 * with all the touches in touchlists
	 * and the additional properties
	 * @param  {DOM-Element} element_  The DOM-Element on which the event will be fired (event.target)
	 * @param  {Object} oOptions_ The properties describing the event.
	 * @return {Void}
	 */
	_triggerEvent = function(element_,oOptions_) {
		// touchend: changedTouches only
		// console.log('## TRIGGER TOUCH', oOptions_.type,arguments)
		var _event = _setupEvent(element_,oOptions_);
		element_.dispatchEvent(_event);
	},



	/**
	 * Creates a touch event and set the given properties
	 * @see https://developer.apple.com/library/safari/documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/javascript/instm/TouchEvent/initTouchEvent
	 * initTouchEvent (
	 *	type,
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
	 *	coordinate of point relative to the viewport in pixels, excluding any scroll offset
	 *
	 *
	 * @see http://www.w3.org/TR/touch-events/#touchevent-interface
	 *
	 * changedTouches of type TouchList, readonly
	 *  a list of Touches for every point of contact which contributed to the event.
	 *	For the touchstart event this must be a list of the touch points that just became active with the current event.
	 *	For the touchmove event this must be a list of the touch points that have moved since the last event.
	 *	For the touchend and touchcancel events this must be a list of the touch points that have just been removed from the surface.
	 *
	 * targetTouches of type TouchList, readonly
	 *  a list of Touches for every point of contact that is touching the surface and
	 *  started on the element that is the target of the current event.
	 *
	 * touches of type TouchList, readonly
	 *  a list of Touches for every point of contact currently touching the surface.
	 *
	 * @param  {Object} oOptions_ the event properties
	 * @return {TouchEvent}	touch event
	 */
	_setupEvent = function(element_,oOptions_) {

		var _event ,
			_oData = {}
		;


		_oData.bubbles = oOptions_.bubbles || false;
		_oData.cancelable = true;
		_oData.view = window ;
		_oData.detail = oOptions_.detail || -1;
		_oData.ctrlKey = oOptions_.ctrlKey || false;
		_oData.altKey = oOptions_.altKey || false;
		_oData.shiftKey = oOptions_.shiftKey || false;
		_oData.metaKey = oOptions_.metaKey || false;
		_oData.scale = oOptions_.scale || 1;
		_oData.rotation = oOptions_.rotation || 0;
		_oData.clientX = _oData.clientX || 0;
		_oData.clientY = _oData.clientY || 0;
		// implemented but not part of the specs
		_oData.pageX = oOptions_.pageX || _oData.clientX  + window.pageXOffset;
		_oData.pageY = oOptions_.pageY || _oData.clientY  + window.pageYOffset;

		// touch events
		if(oOptions_.type.indexOf('touch')!==-1){

			// set touchlists containing single touches

			if (oOptions_.touches) {
				_oData.touches = _createTouchList(element_,oOptions_.touches);
			}

			if (oOptions_.changedTouches) {
				_oData.changedTouches = _createTouchList(element_,oOptions_.changedTouches);
			}

			if (oOptions_.targetTouches) {
				_oData.targetTouches = _createTouchList(element_,oOptions_.targetTouches);
			}

			// create event
			_event = document.createEvent('TouchEvent');
			// initialize event with all necessary options
			_event.initTouchEvent(oOptions_.type, _oData.bubbles, _oData.cancelable, _oData.view,
							_oData.detail, _oData.screenX, _oData.screenY, _oData.pageX, _oData.pageY, _oData.ctrlKey,
							_oData.altKey, _oData.shiftKey, _oData.metaKey, _oData.touches, _oData.targetTouches,
							_oData.changedTouches, _oData.scale, _oData.rotation);
		}

		// gesture events: no touchlists!
		if(oOptions_.type.indexOf('gesture')!==-1){
			// create event
			_event = document.createEvent('GestureEvent');
			// initialize event with all necessary options
			_event.initGestureEvent(oOptions_.type, _oData.bubbles, _oData.cancelable, _oData.view,
							_oData.detail, _oData.screenX, _oData.screenY, _oData.pageX, _oData.pageY, _oData.ctrlKey,
							_oData.altKey, _oData.shiftKey, _oData.metaKey, _oData.target, _oData.scale, _oData.rotation);
		}

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
	 *	coordinate of point relative to the viewport in pixels, excluding any scroll offset
	 *
	 * pageX/Y
	 *	coordinate of point relative to the viewport in pixels, including any scroll offset
	 *
	 * TouchList {
	 *	touches
	 * }
	 *
	 * @see https://developer.apple.com/library/safari/documentation/UserExperience/Reference/DocumentAdditionsReference/DocumentAdditions/DocumentAdditions.html
	 * view
	 *	The view (DOM window) in which the event occurred.
	 * target
	 *	The target of this gesture.
	 * identifier
	 *	The unique identifier for this touch object.
	 * pageX
	 *  The x-coordinate of the touch’s location, in page coordinates.
	 * pageY
	 *	The y-coordinate of the touch’s location, in page coordinates.
	 * screenX
	 *	The x-coordinate of the event’s location, in screen coordinates.
	 * screenY
	 *	The y-coordinate of the event’s location, in screen coordinates.
	 *
	 * iOS7: clientX/Y == pageX/Y
	 *
	 * @param  {Object} oOptions_  Touch options
	 * @return {TouchList}
	 */
	_createTouchList = function(element_,oOptions_) {

		var _aTouches = [],
			_i,
			_iLength =  oOptions_.length,
			_oDefault = {
				identifier : oOptions_.identifier || false,
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

		/**
		 * Process a generic event. API for the timeout etc
		 */
		doGenericEvent:_doGenericEvent,

		/**
		 * Triggers a predefined swipe gesture.
		 * Direction: up
		 * Distance: 300px
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		swipeUp : function (element_) {
			_genericEvent( element_, [{ pageY:300 }], [{ pageY: 0 }], { duration : 500 } );
		},

		/**
		 * Triggers a predefined swipe gesture.
		 * Direction: right
		 * Distance: 300px
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		swipeRight : function (element_) {
			_genericEvent( element_, [{ pageX:0 }],  [{ pageX: 300 }], { duration : 500 } );
		},

		/**
		 * Triggers a predefined swipe gesture.
		 * Direction: down
		 * Distance: 300px
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		swipeDown :	function (element_) {
			_genericEvent( element_, [{ pageY:0 }], [{ pageY: 300 }], { duration : 500 } );
		},

		/**
		 * Triggers a predefined swipe gesture.
		 * Direction: left
		 * Distance: 300px
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		swipeLeft :	function (element_) {
			_genericEvent( element_, [{ pageX:300 }], [{ pageX: 0 }], { duration : 500 } );
		},

		/**
		 * Triggers a generic touch event (touchstart, touchmove, touchend)
		 * @param  {HTML-Element}	element_ Element to trigger events on
		 * @param  {Array} _aStart	Array of Objects. Each object contains the details for a single touchpoint's start position.
		 * @param  {Array} _aEnd	Array of Objects. Each object contains the details for a single touchpoint's end position.
		 * @param  {Object} _oEvent	Contains the details for the event itself.
		 *
		 * properties for a single touchpoint
		 * target
		 *	The target of this gesture.
		 * identifier
		 *	The unique identifier for this touch object.
		 * pageX
		 *  The x-coordinate of the touch’s location, in page coordinates.
		 * pageY
		 *	The y-coordinate of the touch’s location, in page coordinates.
		 * screenX
		 *	The x-coordinate of the event’s location, in screen coordinates.
		 * screenY
		 *	The y-coordinate of the event’s location, in screen coordinates.
		 *
		 * Note: on iOS clientX/Y equals pageX/Y so you can not set them
		 *
		 * properties for the event
		 * bubbles
		 * detail
		 * ctrlKey
		 * altKey
		 * shiftKey
		 * metaKey
		 * scale
		 * rotation
		 * pageX
		 * pageY
		 * duration in ms
		 * @return {Void}
		 */
		touch : function (element_, _aStart, _aEnd, _oEvent) {
			_oEvent.type = 'touch';
			_genericEvent(element_, _aStart, _aEnd, _oEvent);
		},

		/**
		 * Triggers a predefined rotation gesture.
		 * Direction: left
		 * Distance: 90deg
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		rotateLeft: function(element_) {
			_genericEvent( element_, [{ rotation:0 }], [{ rotation: 270}], { duration : 500, type:'gesture'} );
		},

		/**
		 * Triggers a predefined rotation gesture.
		 * Direction: right
		 * Distance: 90deg
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		rotateRight: function(element_) {
			_genericEvent( element_, { rotation:0 }, { rotation: 90 }, { duration : 500, type:'gesture'} );
		},

		/**
		 * Triggers a predefined pinch gesture.
		 * Direction: move touchpoints away
		 * Distance: 0.5
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		pinchOpen: function(element_) {
			_genericEvent( element_, { scale:1 }, { scale: 1.5 }, { duration : 500, type:'gesture'} );
		},

		/**
		 * Triggers a predefined pinch gesture.
		 * Direction: move touchpoints together
		 * Distance: 0.5
		 * @param  {HTML-Element} element_ Element to trigger events on
		 * @return {Void}
		 */
		pinchClose: function(element_) {
			_genericEvent( element_, { scale:1 }, { scale: 0.5 }, { duration : 500, type:'gesture' } );
		},

		/**
		 * Triggers a generic gesture.
		 * @param  {HTML-Element}	element_ Element to trigger events on
		 * @param  {Array} _aStart	Array with one Object which contains the gestures start position.
		 * @param  {Array} _aEnd	Array one Objects which contains the gestures end position.
		 * @param  {Object} _oEvent	Contains the details for the event itself.
		 *
		 * properties for the gesture
		 * rotation
		 * scale
		 *
		 * properties for the event
		 * bubbles
		 * detail
		 * ctrlKey
		 * altKey
		 * shiftKey
		 * metaKey
		 * pageX
		 * pageY
		 *
		 * @return {Void}
		 */
		gesture: function (element_, oStart_, oEnd_, oEvent_ ) {
			oEvent_.type = 'gesture';
			_genericEvent( element_, oStart_, oEnd_, oEvent_);
		}

	};

	}();
// use this line if you prefer to extend the jQuery-object
// })(jQuery);
// set root to window
})(window);


