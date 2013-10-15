/**
 * @projectDescription
 *
 * Spec for:
 *  simulatetouch.js - https://github.com/martinkr/simulatetouch.js
 *
 * Copyright (c) 2010-2013 Martin Krause (public.mkrause.info)
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
	console.log('start',arguments);
	if(
		event_.touches[0].identifier == event_.changedTouches[0].identifier &&
		event_.touches[0].pageY == event_.changedTouches[0].pageY &&
		event_.touches[0].pageX == event_.changedTouches[0].pageX &&
		event_.touches[0].pageY == event_.targetTouches[0].pageY &&
		event_.touches[0].pageX == event_.targetTouches[0].pageX &&
		event_.touches[0].identifier == event_.targetTouches[0].identifier &&
		event_.touches[0].target == _element
	) {
		window.oResults._fnSpyTouchStart  = true;
		window.oResults.identifier = [event_.touches[0].identifier];
	}
};

_fnSpyTouchMove = function (event_) {
	console.log('move',arguments);
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
};

_fnSpyTouchEnd = function (event_) {
	console.log('end',arguments);
	if(
		event_.touches.length == 0 &&
		event_.targetTouches.length == 0 &&
		event_.changedTouches[0].target == _element &&
		event_.changedTouches[0].identifier == window.oResults.identifier[0]
	) {
		window.oResults._fnSpyTouchEnd  = true;
	}
};

describe('simulatetouch.js', function() {

	beforeEach(function() {


		_sId = 'swipe';
		_element = document.getElementById(_sId);

		spyOn(window, '_fnSpyTouchStart').andCallThrough();
		_element.addEventListener('touchstart',_fnSpyTouchStart, false);

		spyOn(window, '_fnSpyTouchMove').andCallThrough();
		_element.addEventListener('touchmove',_fnSpyTouchMove, false);

		spyOn(window, '_fnSpyTouchEnd').andCallThrough();
		_element.addEventListener('touchend',_fnSpyTouchEnd, false);

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

	it('should expose a method called "genericSwipe" ',function () {
		expect(typeof window.simulateTouch.genericSwipe).toBe('function');
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
	 * last
	 */
	it('should trigger touchstart, touchmove and touchend events after swipeUp was called',function () {
		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();

		simulateTouch.swipeUp(_element);

		expect(window.oResults._fnSpyTouchStart).toBeTruthy();
		expect(_fnSpyTouchStart).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchMove).toBeTruthy();
		expect(_fnSpyTouchMove).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
		expect(_fnSpyTouchEnd).toHaveBeenCalled();

		// touchend.pageY has to be smaller thand touchstart.pageY
		expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageY > _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageY).toBeTruthy();

	});

	it('should trigger touchstart, touchmove and touchend events after swipeRight was called',function () {
		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();

		simulateTouch.swipeRight(_element);

		expect(window.oResults._fnSpyTouchStart).toBeTruthy();
		expect(_fnSpyTouchStart).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchMove).toBeTruthy();
		expect(_fnSpyTouchMove).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
		expect(_fnSpyTouchEnd).toHaveBeenCalled();

		// touchend.pageX has to be bigger thand touchstart.pageX
		expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageX < _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageX).toBeTruthy();

	});

	it('should trigger touchstart, touchmove and touchend events after swipeDown was called',function () {
		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();

		simulateTouch.swipeDown(_element);

		expect(window.oResults._fnSpyTouchStart).toBeTruthy();
		expect(_fnSpyTouchStart).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchMove).toBeTruthy();
		expect(_fnSpyTouchMove).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
		expect(_fnSpyTouchEnd).toHaveBeenCalled();

		// touchend.pageY has to be bigger thand touchstart.pageY
		expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageY < _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageY).toBeTruthy();

	});

	it('should trigger touchstart, touchmove and touchend events after swipeLeft was called',function () {
		expect(_fnSpyTouchStart).not.toHaveBeenCalled();
		expect(_fnSpyTouchMove).not.toHaveBeenCalled();

		simulateTouch.swipeLeft(_element);

		expect(window.oResults._fnSpyTouchStart).toBeTruthy();
		expect(_fnSpyTouchStart).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchMove).toBeTruthy();
		expect(_fnSpyTouchMove).toHaveBeenCalled();

		expect(window.oResults._fnSpyTouchEnd).toBeTruthy();
		expect(_fnSpyTouchEnd).toHaveBeenCalled();

		// touchend.pageX has to be smaller thand touchstart.pageX
		expect(_fnSpyTouchStart.mostRecentCall.args[0].changedTouches[0].pageX > _fnSpyTouchEnd.mostRecentCall.args[0].changedTouches[0].pageX).toBeTruthy();

	});


});
