<a name="README">[*.simulateTouch.js](https://github.com/martinkr/simulateTouch.js)</a>
=======
Enhance your automated tests by simulate touches and gestures!

Works like a charm with Jasmine (http://pivotal.github.com/jasmine/) the a behavior-driven development framework for testing JavaScript code.

## Example
<pre>
	simulateTouch.swipeUp(element);
	simulateTouch.swipeRight(element);
	simulateTouch.swipeDown(element);
	simulateTouch.swipeLeft(element);
	simulateTouch.touch(element,aStart,aEnd,oEvent);
	simulateTouch.rotateLeft(element_)
	simulateTouch.rotateRight(element_)
	simulateTouch.pinchOpen(element_)
	simulateTouch.pinchClose(element_)
	simulateTouch.gesture(element_, aStart_, aEnd_, oEvent_ )
</pre>


## Prefedined Swipes

### simulateTouch.swipeUp
 - Direction: up
 - Distance: 300px
 - @param  {HTML-Element} element_ Element to trigger events on
 - @return {Void}

### simulateTouch.swipeRight
- Direction: right
- Distance: 300px
- @param  {HTML-Element} element_ Element to trigger events on
- @return {Void}

### simulateTouch.swipeDown
- Direction: down
- Distance: 300px
- @param  {HTML-Element} element_ Element to trigger events on
- @return {Void}

### simulateTouch.swipeLeft
- Direction: left
- Distance: 300px
- @param  {HTML-Element} element_ Element to trigger events on
- @return {Void}

## Generic Swipe

### simulateTouch.touch
- @param  {HTML-Element} element_ Element to trigger events on
- @param  {Array} _aStart Array of Objects. Each object contains the details for a single touchpoint's start position.
- @param  {Array} _aEnd Array of Objects. Each object contains the details for a single touchpoint's end position.
- @param  {Object} _oEvent Contains the details for the event itself.

#### properties for a single touchpoint
 - target: The target of this gesture.
 - identifier: The unique identifier for this touch object.
 - pageX: The x-coordinate of the touch’s location, in page coordinates.
 - pageY: The y-coordinate of the touch’s location, in page coordinates.
 - screenX: The x-coordinate of the event’s location, in screen coordinates.
 - screenY: The y-coordinate of the event’s location, in screen coordinates.
 -  Note: on iOS clientX/Y equals pageX/Y so you can not set them

#### properties for the event
 - bubbles
 - detail
 - ctrlKey
 - altKey
 - shiftKey
 - metaKey
 - scale
 - rotation
 - pageX
 - pageY


### simulateTouch.rotateLeft
 - Direction: left
 - Distance: 90deg
 - @param  {HTML-Element} element_ Element to trigger events on

### simulateTouch.rotateRight
 - Direction: right
 - Distance: 90deg
 - @param  {HTML-Element} element_ Element to trigger events on

### simulateTouch.pinchOpen
 - Direction: move touchpoints away
 - Distance: 0.5
 - @param  {HTML-Element} element_ Element to trigger events on

### simulateTouch.pinchOpen
 - Direction: move touchpoints together
 - Distance: 0.5
 - @param  {HTML-Element} element_ Element to trigger events on

### simulateTouch.gesture
 - @param  {HTML-Element}	element_ Element to trigger events on
 - @param  {Array} _aStart	Array with one Object which contains the gestures start position.
 - @param  {Array} _aEnd	Array one Objects which contains the gestures end position.
 - @param  {Object} _oEvent	Contains the details for the event itself.

#### properties for the  start / end Object
 - rotation
 - scale

#### properties for the event
 - bubbles
 - detail
 - ctrlKey
 - altKey
 - shiftKey
 - metaKey
 - pageX
 - pageY

## Requires
- Safari and iOS

## License
Dual licensed under the MIT and GPL licenses.

* MIT - http://www.opensource.org/licenses/mit-license.php
* GNU - http://www.gnu.org/licenses/gpl-3.0.html

Copyright (c) 2010 - 2013 Martin Krause (martinkr.github.com)