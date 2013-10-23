/**
 * @projectDescription
 *
 * Spec for:
 *  simulatetouch.js - https://github.com/martinkr/simulatetouch.js
 *
 * Copyright (c) 2010-2013 Martin Krause (martinkr.github.com)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jquery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @requires
 *
 *  Jasmine A JavaScript Testing Framework - https://github.com/pivotal/jasmine
 *    Copyright (c) 2008-2011 Pivotal Labs
 *    Licensed under the MIT license - https://github.com/pivotal/jasmine/MIT.LICENSE
 */

 _fnSpyTouchStart = function (event_) {
	// console.log('### start',arguments, 'ID:',event_.changedTouches[0].identifier)
	if(
		event_.touches[0].identifier == event_.changedTouches[0].identifier &&
		event_.touches[0].pageY == event_.changedTouches[0].pageY &&
		event_.touches[0].pageX == event_.changedTouches[0].pageX &&
		event_.touches[0].pageY == event_.targetTouches[0].pageY &&
		event_.touches[0].pageX == event_.targetTouches[0].pageX &&
		event_.touches[0].identifier == event_.targetTouches[0].identifier &&
		event_.touches[0].target == _element
	) {
		window.oResults._fnSpyTouchStart = true;
	}
	window.oResults.identifier = [event_.touches[0].identifier];
	window.oResults.eventStart = event_;

};

_fnSpyTouchMove = function (event_) {
	// console.log('### move',arguments, 'ID:',event_.changedTouches[0].identifier)
	if(
		event_.touches[0].identifier == event_.changedTouches[0].identifier &&
		event_.touches[0].pageY == event_.changedTouches[0].pageY &&
		event_.touches[0].pageX == event_.changedTouches[0].pageX &&
		event_.touches[0].pageY == event_.targetTouches[0].pageY &&
		event_.touches[0].pageX == event_.targetTouches[0].pageX &&
		event_.touches[0].identifier == event_.targetTouches[0].identifier &&
		event_.touches[0].target == _element &&
		event_.touches[0].identifier == window.oResults.identifier[0]
	) {
		window.oResults._fnSpyTouchMove  = true;
	}
	window.oResults.eventMove = event_;
};

_fnSpyTouchEnd = function (event_) {
	// console.log('### end',arguments, 'ID:',event_.changedTouches[0].identifier)
 	if(
		event_.touches.length == 0 &&
		event_.targetTouches.length == 0 &&
		event_.changedTouches[0].target == _element &&
		event_.changedTouches[0].identifier == window.oResults.identifier[0]
	) {
		window.oResults._fnSpyTouchEnd  = true;
	}
	window.oResults.eventEnd = event_;
};

describe('simulatetouch.js: touch events', function() {

	beforeEach(function() {

		_sId = 'swipe';
		_element = document.getElementById(_sId);

		spyOn(window, '_fnSpyTouchStart').andCallThrough();
		_element.addEventListener('touchstart',_fnSpyTouchStart, false);

		spyOn(window, '_fnSpyTouchMove').andCallThrough();
		_element.addEventListener('touchmove',_fnSpyTouchMove, false);

		spyOn(window, '_fnSpyTouchEnd').andCallThrough();
		_element.addEventListener('touchend',_fnSpyTouchEnd, false);

		window.oResults = {};
		window.oResults._fnSpyTouchStart  = false;
		window.oResults._fnSpyTouchMove  = false;
		window.oResults._fnSpyTouchEnd  = false;


	});

	afterEach(function() {

		window.oResults = {};
		window.oResults._fnSpyTouchStart  = false;
		window.oResults._fnSpyTouchMove  = false;

		_fnSpyTouchStart.reset();
		_element.removeEventListener('touchstart',_fnSpyTouchStart);

		_fnSpyTouchMove.reset();
		_element.removeEventListener('touchmove',_fnSpyTouchMove);

		_fnSpyTouchEnd.reset();
		_element.removeEventListener('touchend',_fnSpyTouchEnd);

	});

	/**
	 * Interface
	 */

	it('should expose a method called "swipe" ',function () {
		expect(typeof window.simulateTouch.swipe).toBe('function');
	});

	it('should expose a method called "swipeUp" ',function () {
		expect(typeof window.simulateTouch.swipeUp).toBe('function');
	});

	it('should expose a method called "swipeRight" ',function () {
		expect(typeof window.simulateTouch.swipeRight).toBe('function');
	});

	it('should expose a method called "swipeDown" ',function () {
		expect(typeof window.simulateTouch.swipeDown).toBe('function');
	});

	it('should expose a method called "swipeLeft" ',function () {
		expect(typeof window.simulateTouch.swipeLeft).toBe('function');
	});


	/**
	 * generic: swipe
	 */
	it('should throw an Error if there are no touchpoints on swipe',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		var _aStart = [],
			_aEnd = [],
			_oEvent = {};

		expect(simulateTouch.swipe).toThrow();
	});

	it('should throw an Error if there are different amounts of touches on swipe start & end',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		var _aStart = [{},{}],
			_aEnd = [{}],
			_oEvent = {};

		expect(simulateTouch.swipe).toThrow();
	});

	it('should trigger touchstart, touchmove and touchend events after swipe was called and set all default properties',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		var _aStart = [{}],
			_aEnd = [{}],
			_oEvent = {};

		simulateTouch.swipe(_element,_aStart,_aEnd,_oEvent);

		waits(750);

		runs(function () {

			// start
			expect(window.oResults._fnSpyTouchStart).toBeTruthy();
			expect(_fnSpyTouchStart).toHaveBeenCalled();
			console.log(_fnSpyTouchStart.callCount)
			// event properties
	 		expect(window.oResults.eventStart.bubbles).toBe(false);
			expect(window.oResults.eventStart.cancelable).toBe(true);
			expect(window.oResults.eventStart.view).toBe(window);
			expect(window.oResults.eventStart.detail).toBe(-1);
	 		expect(window.oResults.eventStart.ctrlKey).toBe(false);
			expect(window.oResults.eventStart.altKey).toBe(false);
			expect(window.oResults.eventStart.shiftKey).toBe(false);
			expect(window.oResults.eventStart.metaKey).toBe(false);
			expect(window.oResults.eventStart.scale).toBe(1);
			expect(window.oResults.eventStart.rotation).toBe(0);
			expect(window.oResults.eventStart.type).toBe('touchstart');
			expect(window.oResults.eventStart.target).toBe(_element);
			// implemented but not part of the specs
			expect(window.oResults.eventStart.pageX).toBe(window.pageXOffset);
			expect(window.oResults.eventStart.pageY).toBe(window.pageYOffset);

			// touches properties
			expect(window.oResults.eventStart.touches.length).toBe(1);
	 		expect(window.oResults.eventStart.touches[0].identifier).toBe(99991);
			expect(window.oResults.eventStart.touches[0].target).toBe(_element);
			expect(window.oResults.eventStart.touches[0].screenX).toBe(0);
			expect(window.oResults.eventStart.touches[0].screenY).toBe(0);
			expect(window.oResults.eventStart.touches[0].pageX).toBe(0);
			expect(window.oResults.eventStart.touches[0].pageY).toBe(0);
			expect(window.oResults.eventStart.touches[0].clientX).toBe(window.oResults.eventStart.touches[0].pageX);
			expect(window.oResults.eventStart.touches[0].clientY).toBe(window.oResults.eventStart.touches[0].pageY);

			// changedTouches properties should be the same as touches
			expect(window.oResults.eventStart.changedTouches.length).toBe(window.oResults.eventStart.touches.length);
			expect(window.oResults.eventStart.changedTouches[0].identifier).toBe(window.oResults.eventStart.touches[0].identifier);
			expect(window.oResults.eventStart.changedTouches[0].target).toBe(window.oResults.eventStart.touches[0].target);
			expect(window.oResults.eventStart.changedTouches[0].screenX).toBe(window.oResults.eventStart.touches[0].screenX);
			expect(window.oResults.eventStart.changedTouches[0].screenY).toBe(window.oResults.eventStart.touches[0].screenY);
			expect(window.oResults.eventStart.changedTouches[0].pageX).toBe(window.oResults.eventStart.touches[0].pageX);
			expect(window.oResults.eventStart.changedTouches[0].pageY).toBe(window.oResults.eventStart.touches[0].pageY);
			expect(window.oResults.eventStart.changedTouches[0].clientX).toBe(window.oResults.eventStart.touches[0].clientX);
			expect(window.oResults.eventStart.changedTouches[0].clientY).toBe(window.oResults.eventStart.touches[0].clientY);

			// targetTouches properties should be the same as touches
			expect(window.oResults.eventStart.targetTouches.length).toBe(window.oResults.eventStart.targetTouches.length);
			expect(window.oResults.eventStart.targetTouches[0].identifier).toBe(window.oResults.eventStart.targetTouches[0].identifier);
			expect(window.oResults.eventStart.targetTouches[0].target).toBe(window.oResults.eventStart.targetTouches[0].target);
			expect(window.oResults.eventStart.targetTouches[0].screenX).toBe(window.oResults.eventStart.targetTouches[0].screenX);
			expect(window.oResults.eventStart.targetTouches[0].screenY).toBe(window.oResults.eventStart.targetTouches[0].screenY);
			expect(window.oResults.eventStart.targetTouches[0].pageX).toBe(window.oResults.eventStart.targetTouches[0].pageX);
			expect(window.oResults.eventStart.targetTouches[0].pageY).toBe(window.oResults.eventStart.targetTouches[0].pageY);
			expect(window.oResults.eventStart.targetTouches[0].clientX).toBe(window.oResults.eventStart.targetTouches[0].clientX);
			expect(window.oResults.eventStart.targetTouches[0].clientY).toBe(window.oResults.eventStart.targetTouches[0].clientY);


			// move
			expect(window.oResults._fnSpyTouchMove).toBeTruthy();
			expect(_fnSpyTouchMove).toHaveBeenCalled();
			// event properties
			expect(window.oResults.eventMove.bubbles).toBe(false);
			expect(window.oResults.eventMove.cancelable).toBe(true);
			expect(window.oResults.eventMove.view).toBe(window);
			expect(window.oResults.eventMove.detail).toBe(-1);
	 		expect(window.oResults.eventMove.ctrlKey).toBe(false);
			expect(window.oResults.eventMove.altKey).toBe(false);
			expect(window.oResults.eventMove.shiftKey).toBe(false);
			expect(window.oResults.eventMove.metaKey).toBe(false);
			expect(window.oResults.eventMove.scale).toBe(1);
			expect(window.oResults.eventMove.rotation).toBe(0);
			expect(window.oResults.eventMove.type).toBe('touchmove');
			expect(window.oResults.eventMove.target).toBe(_element);
			// implemented but not part of the specs
			expect(window.oResults.eventMove.pageX).toBe(window.pageXOffset);
			expect(window.oResults.eventMove.pageY).toBe(window.pageYOffset);

			// touches properties
			expect(window.oResults.eventMove.touches.length).toBe(1);
	 		expect(window.oResults.eventMove.touches[0].identifier).toBe(99991);
			expect(window.oResults.eventMove.touches[0].target).toBe(_element);
			expect(window.oResults.eventMove.touches[0].screenX).toBe(0);
			expect(window.oResults.eventMove.touches[0].screenY).toBe(0);
			expect(window.oResults.eventMove.touches[0].pageX).toBe(0);
			expect(window.oResults.eventMove.touches[0].pageY).toBe(0);
			expect(window.oResults.eventMove.touches[0].clientX).toBe(window.oResults.eventMove.touches[0].pageX);
			expect(window.oResults.eventMove.touches[0].clientY).toBe(window.oResults.eventMove.touches[0].pageY);

			// changedTouches properties should be the same as touches
			expect(window.oResults.eventStart.changedTouches.length).toBe(window.oResults.eventStart.touches.length);
			expect(window.oResults.eventStart.changedTouches[0].identifier).toBe(window.oResults.eventStart.touches[0].identifier);
			expect(window.oResults.eventStart.changedTouches[0].target).toBe(window.oResults.eventStart.touches[0].target);
			expect(window.oResults.eventStart.changedTouches[0].screenX).toBe(window.oResults.eventStart.touches[0].screenX);
			expect(window.oResults.eventStart.changedTouches[0].screenY).toBe(window.oResults.eventStart.touches[0].screenY);
			expect(window.oResults.eventStart.changedTouches[0].pageX).toBe(window.oResults.eventStart.touches[0].pageX);
			expect(window.oResults.eventStart.changedTouches[0].pageY).toBe(window.oResults.eventStart.touches[0].pageY);
			expect(window.oResults.eventStart.changedTouches[0].clientX).toBe(window.oResults.eventStart.touches[0].clientX);
			expect(window.oResults.eventStart.changedTouches[0].clientY).toBe(window.oResults.eventStart.touches[0].clientY);

			// targetTouches properties should be the same as touches
			expect(window.oResults.eventStart.targetTouches.length).toBe(window.oResults.eventStart.targetTouches.length);
			expect(window.oResults.eventStart.targetTouches[0].identifier).toBe(window.oResults.eventStart.targetTouches[0].identifier);
			expect(window.oResults.eventStart.targetTouches[0].target).toBe(window.oResults.eventStart.targetTouches[0].target);
			expect(window.oResults.eventStart.targetTouches[0].screenX).toBe(window.oResults.eventStart.targetTouches[0].screenX);
			expect(window.oResults.eventStart.targetTouches[0].screenY).toBe(window.oResults.eventStart.targetTouches[0].screenY);
			expect(window.oResults.eventStart.targetTouches[0].pageX).toBe(window.oResults.eventStart.targetTouches[0].pageX);
			expect(window.oResults.eventStart.targetTouches[0].pageY).toBe(window.oResults.eventStart.targetTouches[0].pageY);
			expect(window.oResults.eventStart.targetTouches[0].clientX).toBe(window.oResults.eventStart.targetTouches[0].clientX);
			expect(window.oResults.eventStart.targetTouches[0].clientY).toBe(window.oResults.eventStart.targetTouches[0].clientY);

			// end
			expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
			expect(_fnSpyTouchEnd).toHaveBeenCalled();
			// event properties
	 		expect(window.oResults.eventEnd.bubbles).toBe(false);
			expect(window.oResults.eventEnd.cancelable).toBe(true);
			expect(window.oResults.eventEnd.view).toBe(window);
			expect(window.oResults.eventEnd.detail).toBe(-1);
	 		expect(window.oResults.eventEnd.ctrlKey).toBe(false);
			expect(window.oResults.eventEnd.altKey).toBe(false);
			expect(window.oResults.eventEnd.shiftKey).toBe(false);
			expect(window.oResults.eventEnd.metaKey).toBe(false);
			expect(window.oResults.eventEnd.scale).toBe(1);
			expect(window.oResults.eventEnd.rotation).toBe(0);
			expect(window.oResults.eventEnd.type).toBe('touchend');
			expect(window.oResults.eventEnd.target).toBe(_element);
			// implemented but not part of the specs
			expect(window.oResults.eventEnd.pageX).toBe(window.pageXOffset);
			expect(window.oResults.eventEnd.pageY).toBe(window.pageYOffset);

			// touches properties are gone
			expect(window.oResults.eventEnd.touches.length).toBe(0);

			// changedTouches properties are the only ones remaining
			expect(window.oResults.eventEnd.changedTouches.length).toBe(1);
	 		expect(window.oResults.eventEnd.changedTouches[0].identifier).toBe(99991);
			expect(window.oResults.eventEnd.changedTouches[0].target).toBe(_element);
			expect(window.oResults.eventEnd.changedTouches[0].screenX).toBe(0);
			expect(window.oResults.eventEnd.changedTouches[0].screenY).toBe(0);
			expect(window.oResults.eventEnd.changedTouches[0].pageX).toBe(0);
			expect(window.oResults.eventEnd.changedTouches[0].pageY).toBe(0);
			expect(window.oResults.eventEnd.changedTouches[0].clientX).toBe(window.oResults.eventEnd.changedTouches[0].pageX);
			expect(window.oResults.eventEnd.changedTouches[0].clientY).toBe(window.oResults.eventEnd.changedTouches[0].pageY);

			// targetTouches properties are gone
			expect(window.oResults.eventEnd.targetTouches.length).toBe(0);

			// duration related
			// duration: at least 60ms
			expect(window.oResults.eventEnd.timeStamp-window.oResults.eventStart.timeStamp > 60).toBeTruthy();
			// touchstart: once
			expect(_fnSpyTouchStart.callCount).toBe(1);
			// touchmove: multiple times: 60ms / 10 - (1+1)
			expect(_fnSpyTouchMove.callCount).toBe(60/20-(1+1));
			// touchend: once
			expect(_fnSpyTouchEnd.callCount).toBe(1);

		});

	});

	it('should trigger touchstart, touchmove and touchend events after swipe was called and set all supplied properties',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		var _aStart = [
				{
					identifier: 100,
					target: document,
					screenX: 10,
					screenY: 12,
					pageX: 20,
					pageY: 22
				},
				{
					identifier: 200,
					target: document,
					screenX: 30,
					screenY: 32,
					pageX: 40,
					pageY: 42
				}
			],
		_aEnd = [
				{
					identifier: 100,
					target: document,
					screenX: 110,
					screenY: 112,
					pageX: 220,
					pageY: 222
				},
				{
					identifier: 200,
					target: document,
					screenX: 130,
					screenY: 132,
					pageX: 240,
					pageY: 242
				}
			],

		_oEvent = {
			bubbles: true,
			detail: 1,
			ctrlKey: true,
			altKey: true,
			shiftKey: true,
			metaKey: true,
			scale: 2,
			rotation: 1,
			pageX: 110,
			pageY: 120,
			duration:2000
		};


		simulateTouch.swipe(_element,_aStart,_aEnd,_oEvent);

		waits(2500);

		runs(function () {
			// start
			expect(_fnSpyTouchStart).toHaveBeenCalled();

			// event properties
	 		expect(window.oResults.eventStart.bubbles).toBe(_oEvent.bubbles);
			expect(window.oResults.eventStart.detail).toBe(_oEvent.detail);
	 		expect(window.oResults.eventStart.ctrlKey).toBe(_oEvent.ctrlKey);
			expect(window.oResults.eventStart.altKey).toBe(_oEvent.altKey);
			expect(window.oResults.eventStart.shiftKey).toBe(_oEvent.shiftKey);
			expect(window.oResults.eventStart.metaKey).toBe(_oEvent.metaKey);
			expect(window.oResults.eventStart.scale).toBe(_oEvent.scale);
			expect(window.oResults.eventStart.rotation).toBe(_oEvent.rotation);
			expect(window.oResults.eventStart.type).toBe('touchstart');
	 		expect(window.oResults.eventStart.target).toBe(_element);
			// implemented but not part of the specs
			expect(window.oResults.eventStart.pageX).toBe(_oEvent.pageX+window.pageXOffset);
			expect(window.oResults.eventStart.pageY).toBe(_oEvent.pageY+window.pageYOffset);

			// touches properties
			expect(window.oResults.eventStart.touches.length).toBe(2);

			expect(window.oResults.eventStart.touches[0].identifier).toBe(_aStart[0].identifier);
			expect(window.oResults.eventStart.touches[0].target).toBe(_aStart[0].target);
			expect(window.oResults.eventStart.touches[0].screenX).toBe(_aStart[0].screenX);

	 		expect(window.oResults.eventStart.touches[0].screenY).toBe(_aStart[0].screenY);
			expect(window.oResults.eventStart.touches[0].pageX).toBe(_aStart[0].pageX);
			expect(window.oResults.eventStart.touches[0].pageY).toBe(_aStart[0].pageY);
			expect(window.oResults.eventStart.touches[0].clientX).toBe(window.oResults.eventStart.touches[0].pageX);
			expect(window.oResults.eventStart.touches[0].clientY).toBe(window.oResults.eventStart.touches[0].pageY);

			expect(window.oResults.eventStart.touches[1].identifier).toBe(_aStart[1].identifier);
			expect(window.oResults.eventStart.touches[1].target).toBe(_aStart[1].target);
			expect(window.oResults.eventStart.touches[1].screenX).toBe(_aStart[1].screenX);
			expect(window.oResults.eventStart.touches[1].pageY).toBe(_aStart[1].pageY);
			expect(window.oResults.eventStart.touches[1].pageX).toBe(_aStart[1].pageX);
			expect(window.oResults.eventStart.touches[1].pageY).toBe(_aStart[1].pageY);
			expect(window.oResults.eventStart.touches[1].clientX).toBe(window.oResults.eventStart.touches[1].pageX);
			expect(window.oResults.eventStart.touches[1].clientY).toBe(window.oResults.eventStart.touches[1].pageY);

			// changedTouches properties are the same as touches
			expect(window.oResults.eventStart.changedTouches.length).toBe(2);

			expect(window.oResults.eventStart.changedTouches[0].identifier).toBe(window.oResults.eventStart.touches[0].identifier);
			expect(window.oResults.eventStart.changedTouches[0].target).toBe(window.oResults.eventStart.touches[0].target);
			expect(window.oResults.eventStart.changedTouches[0].screenX).toBe(window.oResults.eventStart.touches[0].screenX);
			expect(window.oResults.eventStart.changedTouches[0].screenY).toBe(window.oResults.eventStart.touches[0].screenY);
			expect(window.oResults.eventStart.changedTouches[0].pageX).toBe(window.oResults.eventStart.touches[0].pageX);
			expect(window.oResults.eventStart.changedTouches[0].pageY).toBe(window.oResults.eventStart.touches[0].pageY);
			expect(window.oResults.eventStart.changedTouches[0].clientX).toBe(window.oResults.eventStart.touches[0].clientX);
			expect(window.oResults.eventStart.changedTouches[0].clientY).toBe(window.oResults.eventStart.touches[0].clientY);

			expect(window.oResults.eventStart.changedTouches[1].identifier).toBe(window.oResults.eventStart.touches[1].identifier);
			expect(window.oResults.eventStart.changedTouches[1].target).toBe(window.oResults.eventStart.touches[1].target);
			expect(window.oResults.eventStart.changedTouches[1].screenX).toBe(window.oResults.eventStart.touches[1].screenX);
			expect(window.oResults.eventStart.changedTouches[1].screenY).toBe(window.oResults.eventStart.touches[1].screenY);
			expect(window.oResults.eventStart.changedTouches[1].pageX).toBe(window.oResults.eventStart.touches[1].pageX);
			expect(window.oResults.eventStart.changedTouches[1].pageY).toBe(window.oResults.eventStart.touches[1].pageY);
			expect(window.oResults.eventStart.changedTouches[1].clientX).toBe(window.oResults.eventStart.touches[1].clientX);
			expect(window.oResults.eventStart.changedTouches[1].clientY).toBe(window.oResults.eventStart.touches[1].clientY);

			// targetTouches properties are the same as touches
			expect(window.oResults.eventStart.targetTouches.length).toBe(2);

			expect(window.oResults.eventStart.targetTouches[0].identifier).toBe(window.oResults.eventStart.touches[0].identifier);
			expect(window.oResults.eventStart.targetTouches[0].target).toBe(window.oResults.eventStart.touches[0].target);
			expect(window.oResults.eventStart.targetTouches[0].screenX).toBe(window.oResults.eventStart.touches[0].screenX);
			expect(window.oResults.eventStart.targetTouches[0].screenY).toBe(window.oResults.eventStart.touches[0].screenY);
			expect(window.oResults.eventStart.targetTouches[0].pageX).toBe(window.oResults.eventStart.touches[0].pageX);
			expect(window.oResults.eventStart.targetTouches[0].pageY).toBe(window.oResults.eventStart.touches[0].pageY);
			expect(window.oResults.eventStart.targetTouches[0].clientX).toBe(window.oResults.eventStart.touches[0].clientX);
			expect(window.oResults.eventStart.targetTouches[0].clientY).toBe(window.oResults.eventStart.touches[0].clientY);

			expect(window.oResults.eventStart.targetTouches[1].identifier).toBe(window.oResults.eventStart.touches[1].identifier);
			expect(window.oResults.eventStart.targetTouches[1].target).toBe(window.oResults.eventStart.touches[1].target);
			expect(window.oResults.eventStart.targetTouches[1].screenX).toBe(window.oResults.eventStart.touches[1].screenX);
			expect(window.oResults.eventStart.targetTouches[1].screenY).toBe(window.oResults.eventStart.touches[1].screenY);
			expect(window.oResults.eventStart.targetTouches[1].pageX).toBe(window.oResults.eventStart.touches[1].pageX);
			expect(window.oResults.eventStart.targetTouches[1].pageY).toBe(window.oResults.eventStart.touches[1].pageY);
			expect(window.oResults.eventStart.targetTouches[1].clientX).toBe(window.oResults.eventStart.touches[1].clientX);
			expect(window.oResults.eventStart.targetTouches[1].clientY).toBe(window.oResults.eventStart.touches[1].clientY)

	 		// move
			expect(_fnSpyTouchMove).toHaveBeenCalled();

			// event properties stay the same
	 		expect(window.oResults.eventMove.bubbles).toBe(_oEvent.bubbles);
			expect(window.oResults.eventMove.detail).toBe(_oEvent.detail);
	 		expect(window.oResults.eventMove.ctrlKey).toBe(_oEvent.ctrlKey);
			expect(window.oResults.eventMove.altKey).toBe(_oEvent.altKey);
			expect(window.oResults.eventMove.shiftKey).toBe(_oEvent.shiftKey);
			expect(window.oResults.eventMove.metaKey).toBe(_oEvent.metaKey);
			expect(window.oResults.eventMove.scale).toBe(_oEvent.scale);
			expect(window.oResults.eventMove.rotation).toBe(_oEvent.rotation);
			expect(window.oResults.eventMove.type).toBe('touchmove');
	 		expect(window.oResults.eventMove.target).toBe(_element);
			// implemented but not part of the specs
			expect(window.oResults.eventMove.pageX).toBe(_oEvent.pageX+window.pageXOffset);
			expect(window.oResults.eventMove.pageY).toBe(_oEvent.pageY+window.pageYOffset);

			// touches properties
			expect(window.oResults.eventMove.touches.length).toBe(2);

			expect(window.oResults.eventMove.touches[0].identifier).toBe(_aStart[0].identifier);
			expect(window.oResults.eventMove.touches[0].target).toBe(_aStart[0].target);
			expect(window.oResults.eventMove.touches[0].clientX).toBe(window.oResults.eventMove.touches[0].pageX);
			expect(window.oResults.eventMove.touches[0].clientY).toBe(window.oResults.eventMove.touches[0].pageY);

			expect(window.oResults.eventMove.touches[1].identifier).toBe(_aStart[1].identifier);
			expect(window.oResults.eventMove.touches[1].target).toBe(_aStart[1].target);
			expect(window.oResults.eventMove.touches[1].clientX).toBe(window.oResults.eventMove.touches[1].pageX);
			expect(window.oResults.eventMove.touches[1].clientY).toBe(window.oResults.eventMove.touches[1].pageY);

			// changedTouches properties are the same as touches
			expect(window.oResults.eventMove.changedTouches.length).toBe(2);

			expect(window.oResults.eventMove.changedTouches[0].identifier).toBe(window.oResults.eventMove.touches[0].identifier);
			expect(window.oResults.eventMove.changedTouches[0].target).toBe(window.oResults.eventMove.touches[0].target);
			expect(window.oResults.eventMove.changedTouches[0].screenX).toBe(window.oResults.eventMove.touches[0].screenX);
			expect(window.oResults.eventMove.changedTouches[0].screenY).toBe(window.oResults.eventMove.touches[0].screenY);
			expect(window.oResults.eventMove.changedTouches[0].pageX).toBe(window.oResults.eventMove.touches[0].pageX);
			expect(window.oResults.eventMove.changedTouches[0].pageY).toBe(window.oResults.eventMove.touches[0].pageY);
			expect(window.oResults.eventMove.changedTouches[0].clientX).toBe(window.oResults.eventMove.touches[0].clientX);
			expect(window.oResults.eventMove.changedTouches[0].clientY).toBe(window.oResults.eventMove.touches[0].clientY);

			expect(window.oResults.eventMove.changedTouches[1].identifier).toBe(window.oResults.eventMove.touches[1].identifier);
			expect(window.oResults.eventMove.changedTouches[1].target).toBe(window.oResults.eventMove.touches[1].target);
			expect(window.oResults.eventMove.changedTouches[1].screenX).toBe(window.oResults.eventMove.touches[1].screenX);
			expect(window.oResults.eventMove.changedTouches[1].screenY).toBe(window.oResults.eventMove.touches[1].screenY);
			expect(window.oResults.eventMove.changedTouches[1].pageX).toBe(window.oResults.eventMove.touches[1].pageX);
			expect(window.oResults.eventMove.changedTouches[1].pageY).toBe(window.oResults.eventMove.touches[1].pageY);
			expect(window.oResults.eventMove.changedTouches[1].clientX).toBe(window.oResults.eventMove.touches[1].clientX);
			expect(window.oResults.eventMove.changedTouches[1].clientY).toBe(window.oResults.eventMove.touches[1].clientY);

			// targetTouches properties are the same as touches
			expect(window.oResults.eventMove.targetTouches.length).toBe(2);

			expect(window.oResults.eventMove.targetTouches[0].identifier).toBe(window.oResults.eventMove.touches[0].identifier);
			expect(window.oResults.eventMove.targetTouches[0].target).toBe(window.oResults.eventMove.touches[0].target);
			expect(window.oResults.eventMove.targetTouches[0].screenX).toBe(window.oResults.eventMove.touches[0].screenX);
			expect(window.oResults.eventMove.targetTouches[0].screenY).toBe(window.oResults.eventMove.touches[0].screenY);
			expect(window.oResults.eventMove.targetTouches[0].pageX).toBe(window.oResults.eventMove.touches[0].pageX);
			expect(window.oResults.eventMove.targetTouches[0].pageY).toBe(window.oResults.eventMove.touches[0].pageY);
			expect(window.oResults.eventMove.targetTouches[0].clientX).toBe(window.oResults.eventMove.touches[0].clientX);
			expect(window.oResults.eventMove.targetTouches[0].clientY).toBe(window.oResults.eventMove.touches[0].clientY);

			expect(window.oResults.eventMove.targetTouches[1].identifier).toBe(window.oResults.eventMove.touches[1].identifier);
			expect(window.oResults.eventMove.targetTouches[1].target).toBe(window.oResults.eventMove.touches[1].target);
			expect(window.oResults.eventMove.targetTouches[1].screenX).toBe(window.oResults.eventMove.touches[1].screenX);
			expect(window.oResults.eventMove.targetTouches[1].screenY).toBe(window.oResults.eventMove.touches[1].screenY);
			expect(window.oResults.eventMove.targetTouches[1].pageX).toBe(window.oResults.eventMove.touches[1].pageX);
			expect(window.oResults.eventMove.targetTouches[1].pageY).toBe(window.oResults.eventMove.touches[1].pageY);
			expect(window.oResults.eventMove.targetTouches[1].clientX).toBe(window.oResults.eventMove.touches[1].clientX);
			expect(window.oResults.eventMove.targetTouches[1].clientY).toBe(window.oResults.eventMove.touches[1].clientY)

			// end
			expect(_fnSpyTouchEnd).toHaveBeenCalled();

			// event properties stay the same
	 		expect(window.oResults.eventEnd.bubbles).toBe(_oEvent.bubbles);
			expect(window.oResults.eventEnd.detail).toBe(_oEvent.detail);
			expect(window.oResults.eventEnd.ctrlKey).toBe(_oEvent.ctrlKey);
			expect(window.oResults.eventEnd.altKey).toBe(_oEvent.altKey);
			expect(window.oResults.eventEnd.shiftKey).toBe(_oEvent.shiftKey);
			expect(window.oResults.eventEnd.metaKey).toBe(_oEvent.metaKey);
			expect(window.oResults.eventEnd.scale).toBe(_oEvent.scale);
			expect(window.oResults.eventEnd.rotation).toBe(_oEvent.rotation);
			expect(window.oResults.eventEnd.type).toBe('touchend');
			expect(window.oResults.eventEnd.target).toBe(_element);
			expect(window.oResults.eventEnd.pageX).toBe(_oEvent.pageX+window.pageXOffset);
			expect(window.oResults.eventEnd.pageY).toBe(_oEvent.pageY+window.pageYOffset);

			// touches are gone
			expect(window.oResults.eventEnd.touches.length).toBe(0);


			// changedTouches properties are the same as touches
			expect(window.oResults.eventEnd.changedTouches.length).toBe(2);

			expect(window.oResults.eventEnd.changedTouches[0].identifier).toBe(_aEnd[0].identifier);
			expect(window.oResults.eventEnd.changedTouches[0].target).toBe(_aEnd[0].target);
			expect(window.oResults.eventEnd.changedTouches[0].screenX).toBe(_aEnd[0].screenX);
			expect(window.oResults.eventEnd.changedTouches[0].screenY).toBe(_aEnd[0].screenY);
			expect(window.oResults.eventEnd.changedTouches[0].pageX).toBe(_aEnd[0].pageX);
			expect(window.oResults.eventEnd.changedTouches[0].pageY).toBe(_aEnd[0].pageY);
			expect(window.oResults.eventEnd.changedTouches[0].clientX).toBe(window.oResults.eventEnd.changedTouches[0].pageX);
			expect(window.oResults.eventEnd.changedTouches[0].clientY).toBe(window.oResults.eventEnd.changedTouches[0].pageY);

			expect(window.oResults.eventEnd.changedTouches[1].identifier).toBe(_aEnd[1].identifier);
			expect(window.oResults.eventEnd.changedTouches[1].target).toBe(_aEnd[1].target);
			expect(window.oResults.eventEnd.changedTouches[1].screenX).toBe(_aEnd[1].screenX);
			expect(window.oResults.eventEnd.changedTouches[1].screenY).toBe(_aEnd[1].screenY);
			expect(window.oResults.eventEnd.changedTouches[1].pageX).toBe(_aEnd[1].pageX);
			expect(window.oResults.eventEnd.changedTouches[1].pageY).toBe(_aEnd[1].pageY);
			expect(window.oResults.eventEnd.changedTouches[1].clientX).toBe(window.oResults.eventEnd.changedTouches[1].pageX);
			expect(window.oResults.eventEnd.changedTouches[1].clientY).toBe(window.oResults.eventEnd.changedTouches[1].pageY);

			// targetTouches are gone
			expect(window.oResults.eventEnd.targetTouches.length).toBe(0);


			// duration related
			// duration: at least 60ms
			expect(window.oResults.eventEnd.timeStamp-window.oResults.eventStart.timeStamp > 60).toBeTruthy();
			// touchstart: once
			expect(_fnSpyTouchStart.callCount).toBe(1);
			// touchmove: multiple times: 60ms / 10 - (1+1)
			expect(_fnSpyTouchMove.callCount).toBe(2000/20-(1+1));
			// touchend: once
			expect(_fnSpyTouchEnd.callCount).toBe(1);

		});

	});


	/**
	 * predefined: swipeUp
	 */
	it('should trigger one touchstart, 23 touchmoves and one touchend events after swipeUp was called with a duration of 500ms (20ms/tick)',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		simulateTouch.swipeUp(_element);

		waits(1000);

		runs(function () {

			// touchstart
			expect(window.oResults._fnSpyTouchStart).toBeTruthy();
			expect(_fnSpyTouchStart).toHaveBeenCalled();

			// once
			expect(_fnSpyTouchStart.callCount).toBe(1);

			// touchmove
			expect(window.oResults._fnSpyTouchMove).toBeTruthy();
			// multiple times: 500ms / tick-ms - (start+end)
			expect(_fnSpyTouchMove.callCount).toBe(500/20-(1+1));

			// touchend
			expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
			expect(_fnSpyTouchEnd).toHaveBeenCalled();
			// once
			expect(_fnSpyTouchEnd.callCount).toBe(1);

			// duration: at least 500ms
			expect(window.oResults.eventEnd.timeStamp-window.oResults.eventStart.timeStamp > 500).toBeTruthy();
			// touchend.pageY has to be smaller thand touchstart.pageY
			expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageY > _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageY).toBeTruthy();

		});
	});

	/**
	 * predefined: swipeRight
	 */
	it('should trigger one touchstart, 23 touchmoves and one touchend events after swipeRight was called with a duration of 500ms (20ms/tick)',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		simulateTouch.swipeRight(_element);

		waits(1000);

		runs(function () {

			// touchstart
			expect(window.oResults._fnSpyTouchStart).toBeTruthy();
			expect(_fnSpyTouchStart).toHaveBeenCalled();
			// once
			expect(_fnSpyTouchStart.callCount).toBe(1);

			// touchmove
			expect(window.oResults._fnSpyTouchMove).toBeTruthy();
			// multiple times: 500ms / tick-ms - (start+end)
			expect(_fnSpyTouchMove.callCount).toBe(500/20-(1+1));

			// touchend
			expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
			expect(_fnSpyTouchEnd).toHaveBeenCalled();
			// once
			expect(_fnSpyTouchEnd.callCount).toBe(1);

			// duration: at least 500ms
			expect(window.oResults.eventEnd.timeStamp-window.oResults.eventStart.timeStamp > 500).toBeTruthy();
			// touchend.pageX has to be bigger thand touchstart.pageX
			expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageX < _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageX).toBeTruthy();

		});

	});

	/**
	 * predefined: swipeDown
	 */
	it('should trigger one touchstart, 23 touchmoves and one touchend events after swipeDown was called with a duration of 500ms (20ms/tick)',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		simulateTouch.swipeDown(_element);

		waits(1000);

		runs(function () {

			// touchstart
			expect(window.oResults._fnSpyTouchStart).toBeTruthy();
			expect(_fnSpyTouchStart).toHaveBeenCalled();
			// once
			expect(_fnSpyTouchStart.callCount).toBe(1);

			// touchmove
			expect(window.oResults._fnSpyTouchMove).toBeTruthy();
			// multiple times: 500ms / tick-ms - (start+end)
			expect(_fnSpyTouchMove.callCount).toBe(500/20-(1+1));

			// touchend
			expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
			expect(_fnSpyTouchEnd).toHaveBeenCalled();
			// once
			expect(_fnSpyTouchEnd.callCount).toBe(1);

			// duration: at least 500ms
			expect(window.oResults.eventEnd.timeStamp-window.oResults.eventStart.timeStamp > 500).toBeTruthy();
			// touchend.pageY has to be bigger thand touchstart.pageY
			expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageY < _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageY).toBeTruthy();


		});

	});

	/**
	 * predefined: swipeLeft
	 */
		it('should trigger one touchstart, 23 touchmoves and one touchend events after swipeLeft was called with a duration of 500ms (20ms/tick)',function () {

		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();
		expect(_fnSpyTouchEnd).not.toHaveBeenCalled();

		simulateTouch.swipeLeft(_element);

		waits(1000);

		runs(function () {

			// touchstart
			expect(window.oResults._fnSpyTouchStart).toBeTruthy();
			expect(_fnSpyTouchStart).toHaveBeenCalled();
			// once
			expect(_fnSpyTouchStart.callCount).toBe(1);

			// touchmove
			expect(window.oResults._fnSpyTouchMove).toBeTruthy();
			// multiple times: 500ms / tick-ms - (start+end)
			expect(_fnSpyTouchMove.callCount).toBe(500/20-(1+1));

			// touchend
			expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
			expect(_fnSpyTouchEnd).toHaveBeenCalled();
			// once
			expect(_fnSpyTouchEnd.callCount).toBe(1);

			// duration: at least 500ms
			expect(window.oResults.eventEnd.timeStamp-window.oResults.eventStart.timeStamp > 500).toBeTruthy();
			// touchend.pageX has to be smaller thand touchstart.pageX
			expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageX > _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageX).toBeTruthy();

		});
	});

});
