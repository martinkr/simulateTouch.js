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

 _fnSpyGestureStart = function (event_) {
	console.log('### start',arguments, 'ID:',arguments)
 	window.oResults.eventStart = event_;

};

_fnSpyGestureChange = function (event_) {
	console.log('### move',arguments, 'ID:',arguments)

	window.oResults.eventMove = event_;
};

_fnSpyGestureEnd = function (event_) {
	console.log('### end',arguments, 'ID:',arguments)
	window.oResults.eventEnd = event_;
};

describe('simulatetouch.js: gesture events', function() {

	beforeEach(function() {

		_sId = 'swipe';
		_element = document.getElementById(_sId);

		spyOn(window, '_fnSpyGestureStart').andCallThrough();
		_element.addEventListener('gesturestart',_fnSpyGestureStart, false);

		spyOn(window, '_fnSpyGestureChange').andCallThrough();
		_element.addEventListener('gesturechange',_fnSpyGestureChange, false);

		spyOn(window, '_fnSpyGestureEnd').andCallThrough();
		_element.addEventListener('gestureend',_fnSpyGestureEnd, false);

		window.oResults = {};
		window.oResults._fnSpyGestureStart  = false;
		window.oResults._fnSpyGestureChange  = false;
		window.oResults._fnSpyGestureEnd  = false;


	});

	afterEach(function() {

		window.oResults = {};
		window.oResults._fnSpyGestureStart  = false;
		window.oResults._fnSpyGestureChange  = false;

		_fnSpyGestureStart.reset();
		_element.removeEventListener('gesturestart',_fnSpyGestureStart);

		_fnSpyGestureChange.reset();
		_element.removeEventListener('gesturechange',_fnSpyGestureChange);

		_fnSpyGestureEnd.reset();
		_element.removeEventListener('gestureend',_fnSpyGestureEnd);

	});

	/**
	 * Interface
	 */

	it('should expose a method called "gesture" ',function () {
		expect(typeof window.simulateTouch.gesture).toBe('function');
	});

	it('should expose a method called "rotateLeft" ',function () {
		expect(typeof window.simulateTouch.rotateLeft).toBe('function');
	});

	it('should expose a method called "rotateRight" ',function () {
		expect(typeof window.simulateTouch.rotateRight).toBe('function');
	});

	it('should expose a method called "pinchOpen" ',function () {
		expect(typeof window.simulateTouch.pinchOpen).toBe('function');
	});

	it('should expose a method called "pinchClose" ',function () {
		expect(typeof window.simulateTouch.pinchClose).toBe('function');
	});


	/**
	 * generic: swipe
	 */

	/**
	 * predefined: rotateLeft
	 */
	it('should trigger one gesturestart, 23 gesturemoves and one gestureend events after rotateLeft was called with a duration of 500ms (20ms/tick)',function () {

		expect(_fnSpyGestureStart).not.toHaveBeenCalled();
		expect(_fnSpyGestureChange).not.toHaveBeenCalled();
		expect(_fnSpyGestureEnd).not.toHaveBeenCalled();

		simulateTouch.rotateLeft(_element);

		waits(1000);

		runs(function () {

			// gesturestart
			expect(_fnSpyGestureStart).toHaveBeenCalled();
			// once
			expect(_fnSpyGestureStart.callCount).toBe(1);

			// gesturemove
			expect(_fnSpyGestureChange).toHaveBeenCalled();
			// multiple times: 500ms / tick-ms - (start+end)
			expect(_fnSpyGestureChange.callCount).toBe(500/20-(1+1));

			// gestureend
			expect(_fnSpyGestureEnd).toHaveBeenCalled();
			// once
			expect(_fnSpyGestureEnd.callCount).toBe(1);

			// duration: at least 500ms
			expect(window.oResults.eventEnd.timeStamp-window.oResults.eventStart.timeStamp > 500).toBeTruthy();
			// gestureend.pageY has to be smaller thand gesturestart.pageY
			// expect(_fnSpyGestureStart.mostRecentCall.args[0].changedTouches[0].pageY > _fnSpyGestureEnd.mostRecentCall.args[0].changedTouches[0].pageY).toBeTruthy();

		});
	});



});
