var Publisher = require('../util/Publisher')

_focusables = {}

module.exports = Class(Publisher, function(supr) {
	
	this._domTag = 'div'
	this._domType = null
	this._className = null
	
	this._initialize = function(domTag) {
		supr(this, '_initialize')
		if (domTag) { this._domTag = domTag }
		this._finSubs = {}
	}
	
	this.getElement = function() {
		if (!this._element) { 
			this._element = document.createElement(this._domTag)
			if (this._domType) { this._element.type = this._domType }
			if (this._className) { this.addClassName(this._className) }
			this._createContent() // subclasses should implement _createContent
		}
		return this._element
	}
	this._createContent = function() {}
	
	this.show = function() {
		this.getElement().style.display = 'block'
		return this
	}
	this.hide = function() {
		this.getElement().style.display = 'none'
		return this
	}
	
	this.appendTo = function(element) {
		if (element.getElement) { element = element.getElement() }
		element.appendChild(this.getElement())
		return this
	}
	this.prependTo = function(element) {
		element.insertBefore(this.getElement(), element.firstChild)
		return this
	}
	this.remove = function(element) { 
		element = element || this._element
		if (!element || !element.parentNode) { return this } 
		element.parentNode.removeChild(element)
		return this
	}
	this.createLabel = function(text) {
		this.addClassName('withLabel')
		this._insertElement(this._create({ tag: 'label', text: text }), 0)
		return this
	}

	this._insertElement = function (parentElement, insertItem, position) {
		if (arguments.length == 2) {
			position = insertItem
			insertItem = parentElement
			parentElement = this._element
		}
		
		var childNodes = this._element.childNodes,
			nextItem = childNodes[position]
		
		if (nextItem) {
			parentElement.insertBefore(insertItem, nextItem)
		} else {
			parentElement.appendChild(insertItem)
		}
	}
	
	this._create = function(params) {
		var el = document.createElement(params.tag || 'div')
		if (params.className) { el.className = params.className }
		if (params.html) { el.innerHTML = params.html }
		if (params.src) { el.src = params.src }
		if (params.href) { el.href = params.href }
		if (params.text) { el.appendChild(document.createTextNode(params.text)) }
		if (params.type) { el.type = params.type }
		if (params.style) { this.setStyle(el, params.style) }
		if (params.parent) { (params.parent.getElement ? params.parent.getElement() : params.parent).appendChild(el) }
		return el
	}
	
	this.setStyle = function(el, styleProps) {
		if (!styleProps) {
			styleProps = el
			el = this.getElement()
		}
		var elStyle = el.style
		for (var key in styleProps) {
			var value = styleProps[key]
			if (typeof value == 'number') { value += 'px' }
			elStyle[key] = value
		}
		return this
	}
/***************************
 * Focusable UI Components *
 ***************************/
	// UI Components need to be made focusable for fan.tasks.KeyboardFocus to find them
	this._makeFocusable = function(el) {
		if (!el) { el = this._element }
		var focusableId = el['fan-focusableId'] = unique()
		_focusables[focusableId] = this
		this.addClassName(el, 'fan-focusable')
	}
	this._getFocusableComponent = function(el) {
		var focusableId = el['fan-focusableId']
		return _focusables[focusableId]
	}
/******************************
 * Unselectable UI Components *
 ******************************/
	this._makeUnselectable = function(el) {
		this.addClassName(el || this.getElement(), 'unselectable')
		return this
	}

/***************
 * Class names *
 ***************/

	this.addClassName = function(element, className) { 
		if (typeof element == 'string') {
			className = element
			element = this.getElement()
		}
		if (!(' ' + element.className + ' ').match(' ' + className + ' ')) {
			element.className += ' ' + className + ' '
		}
		return this
	}
	
	this.removeClassName = function(element, className) { 
		if (typeof element == 'string') {
			className = element
			element = this.getElement()
		}
		if (element.className) {
			className += ' '
			var current = element.className
			var index = current.indexOf(className)
			if (index != -1) {
				element.className = current.slice(0, index) + current.slice(index + className.length)
			}
		}
		return this
	}
	
	this.toggleClassName = function(el, className, shouldHave) {
		if (arguments.length == 2) {
			shouldHave = className
			className = el
			el = this._element
		}
		if (shouldHave) { this.addClassName(el, className) }
		else { this.removeClassName(el, className) }
		return this
	}
	
	this._hasClassName = function(element, className) {
		if (arguments.length == 1) {
			className = element
			element = this._element
		}
		return !!this._element.className.match(' ' + className + ' ')
	}

/*************************
 * fin data observations *
 *************************/
	this._observe = function(itemId, propName, handler) {
		var id = '_fan::' + itemId + '::' + propName,
			subs = this._finSubs
		
		if (this._finSubs[id]) {
			throw logger.error("Attempted to observe same item/prop twice", itemId, propName)
		}
		this._finSubs[id] = fin.observe(itemId, propName, handler)
		return this
	}
	this._release = function(itemId, propName) {
		var id = '_fan::' + itemId + '::' + propName,
			subs = this._finSubs
		
		if (!subs[id]) {
			throw logger.error("Attempted to release unobserved item/prop", itemId, propName)
		}
		fin.release(subs[id])
		delete subs[id]
		return this
	}
	this.reflect = function(itemID, property, params) {
		params = params || {}
		var pre = params.pre || '',
			post = params.post || ''
		
		this._observe(itemID, property, bind(this, function(mutation, value) {
			this._element.innerHTML = pre + value + post
		}))
		return this
	}
	this.release = function() {
		var id, subs = this._finSubs
		for (id in subs) {
			fin.release(subs[id])
			delete subs[id]
		}
		return this
	}
	
/**********
 * Events *
 **********/

	// this._on('click', function(e){})
	// this._on(element, 'click', function(e){})
	this._on = function(element, eventName, handler) {
		if (arguments.length == 2) { 
			handler = eventName
			eventName = element
			element = this._element
		}
		
		// Is removeEvent going to work properly when we wrap the handler in another function?
		function normalizeEvent(e) {
			e = e || event
			var eventObj = { keyCode: e.keyCode, metaKey: e.metaKey, target: e.target || e.srcElement }
			eventObj.cancel = function() {
				if (e.preventDefault) { e.preventDefault() }
				else { e.returnValue = false }
			}
			if (e.type == 'keypress') {
				eventObj.charCode = (eventObj.charCode == 13 && eventObj.keyCode == 13) 
					? 0 // in Webkit, return gives a charCode as well as a keyCode. Should only be a keyCode
					: e.charCode
			}
			handler(eventObj)
		}
		
		if (element.addEventListener) {
			element.addEventListener(eventName, normalizeEvent, false)
		} else if (element.attachEvent){
			element.attachEvent("on"+eventName, normalizeEvent)
		}
		return this
	}

	// I don't think this code works...
	// this._removeOn = function(element, eventName, handler) {
	// 	if (arguments.length == 2) {
	// 		handler = element
	// 		element = this._element
	// 	}
	// 	if (element.removeEventListener) {
	// 		element.removeEventListener(eventName, handler, false)
	// 		return true
	// 	} else if (element.detachEvent) {
	// 		return element.detachEvent("on"+eventName, handler)
	// 	}
	// }
	
	this._delegateOn = function(element, eventName, handler) {
		if (arguments.length == 2) {
			handler = eventName
			eventName = element
			element = this._element
		}
		this._on(element, eventName, bind(this, '_onDelegatedEvent', handler))
	}
	
	this._onDelegatedEvent = function(handler, e) {
		var target = e.target
		while(target) {
			if (!target.delegateID) {
				target = target.parentNode
				continue
			}
			handler(target.delegateID, target)
			return
		}
	}
	
/********************
 * Style and Layout *
 ********************/
	
	this.getStyle = function(element, styleProp) {
		if (arguments.length == 1) {
			styleProp = element
			element = this._element
		}
		if (element.currentStyle) {
			return element.currentStyle[styleProp]
		} else if (window.getComputedStyle) {
			return document.defaultView.getComputedStyle(element, null).getPropertyValue(styleProp)
		}
	}

	// this.layout({ width: 100, height: 100, top: 10, left: 10 })
	// this.layout(anElement, { width: 10, height: 10 })
	this.layout = function(el, dim) {
		if (!dim) { 
			dim = el
			el = this._element
		}
		var style = el.style
		if (typeof dim.x != 'undefined') { style.left = dim.x + 'px' }
		if (typeof dim.y != 'undefined') { style.top = dim.y + 'px' }
		if (typeof dim.w != 'undefined') { style.width = dim.w + 'px' }
		if (typeof dim.h != 'undefined') { style.height = dim.h + 'px' }
		return this
	}
	
	// dom offset code adopted from jQuery JavaScript Library v1.3.2
	/*!
	 * jQuery JavaScript Library v1.3.2
	 * http://jquery.com/
	 *
	 * Copyright (c) 2009 John Resig
	 * Dual licensed under the MIT and GPL licenses.
	 * http://docs.jquery.com/License
	 *
	 * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
	 * Revision: 6246
	 */
	this.getLayout = function(elem) {
		if (!elem) { elem = this._element }
		var win = window;

		if (elem.getBoundingClientRect) {
			var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
				clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
				top  = box.top  + (win.pageYOffset || docElem.scrollTop  || body.scrollTop ) - clientTop,
				left = box.left + (win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
			return { y: top, x: left, w: box.right - box.left, h: box.bottom - box.top };

		} else {
			var offset = arguments.callee.offset;
			if (!offset) {
				var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, td, rules, prop, bodyMarginTop = body.style.marginTop,
					html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';

				rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' };
				for (prop in rules) container.style[prop] = rules[prop];

				container.innerHTML = html;
				body.insertBefore(container, body.firstChild);
				innerDiv = container.firstChild, checkDiv = innerDiv.firstChild, td = innerDiv.nextSibling.firstChild.firstChild;

				var offset = {};
				offset.doesNotAddBorder = (checkDiv.offsetTop !== 5);
				offset.doesAddBorderForTableAndCells = (td.offsetTop === 5);

				innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
				offset.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

				body.style.marginTop = '1px';
				offset.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
				body.style.marginTop = bodyMarginTop;

				body.removeChild(container);
				arguments.callee.offset = offset;
			}

			var height = elem.offsetHeight;
			var width = elem.offsetWidth;

			var offsetParent = elem.offsetParent, prevOffsetParent = elem,
				doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
				body = doc.body, defaultView = doc.defaultView,
				prevComputedStyle = defaultView.getComputedStyle(elem, null),
				top = elem.offsetTop, left = elem.offsetLeft;

			while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
				computedStyle = defaultView.getComputedStyle(elem, null);
				top -= elem.scrollTop, left -= elem.scrollLeft;
				if (elem === offsetParent) {
					top += elem.offsetTop, left += elem.offsetLeft;
					if (offset.doesNotAddBorder && !(offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName))) {
						top += parseInt(computedStyle.borderTopWidth, 10) || 0;
						left += parseInt(computedStyle.borderLeftWidth, 10) || 0;
					}
					prevOffsetParent = offsetParent;
					offsetParent = elem.offsetParent;
				}
				if (offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
					top += parseInt(computedStyle.borderTopWidth, 10) || 0;
					left += parseInt(computedStyle.borderLeftWidth, 10) || 0;
				}
				prevComputedStyle = computedStyle;
			}

			if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
				top += body.offsetTop;
				left += body.offsetLeft;
			}

			if (prevComputedStyle.position === "fixed") {
				top  += Math.max(docElem.scrollTop, body.scrollTop);
				left += Math.max(docElem.scrollLeft, body.scrollLeft);
			}

			return { y: top, x: left, w: width, h: height };
		}
	}
	// end jQuery positioning code
	
/********
 * Keys *
 ********/
	this.keys = {
		'backspace': 8,
		'tab': 9,
		'enter': 13,
		'shift': 16,
		'ctrl': 17,
		'alt': 18,
		'pause/break': 19,
		'caps lock': 20,
		'escape': 27,
		'page up': 33,
		'page down': 34,
		'end': 35,
		'home': 36,
		'left arrow': 37,
		'up arrow': 38,
		'right arrow': 39,
		'down arrow': 40,
		'insert': 45,
		'delete': 46,
		'0': 48,
		'1': 49,
		'2': 50,
		'3': 51,
		'4': 52,
		'5': 53,
		'6': 54,
		'7': 55,
		'8': 56,
		'9': 57,
		'a': 65,
		'b': 66,
		'c': 67,
		'd': 68,
		'e': 69,
		'f': 70,
		'g': 71,
		'h': 72,
		'i': 73,
		'j': 74,
		'k': 75,
		'l': 76,
		'm': 77,
		'n': 78,
		'o': 79,
		'p': 80,
		'q': 81,
		'r': 82,
		's': 83,
		't': 84,
		'u': 85,
		'v': 86,
		'w': 87,
		'x': 88,
		'y': 89,
		'z': 90,
		'left window key': 91,
		'right window key': 92,
		'select key': 93,
		'numpad 0': 96,
		'numpad 1': 97,
		'numpad 2': 98,
		'numpad 3': 99,
		'numpad 4': 100,
		'numpad 5': 101,
		'numpad 6': 102,
		'numpad 7': 103,
		'numpad 8': 104,
		'numpad 9': 105,
		'multiply': 106,
		'add': 107,
		'subtract': 109,
		'decimal point': 110,
		'divide': 111,
		'f1': 112,
		'f2': 113,
		'f3': 114,
		'f4': 115,
		'f5': 116,
		'f6': 117,
		'f7': 118,
		'f8': 119,
		'f9': 120,
		'f10': 121,
		'f11': 122,
		'f12': 123,
		'num lock': 144,
		'scroll lock': 145,
		'semi-colon': 186,
		'equal sign': 187,
		'comma': 188,
		'dash': 189,
		'period': 190,
		'forward slash': 191,
		'`': 192,
		'open bracket': 219,
		'back slash': 220,
		'close braket': 221,
		'single quote': 222
	}
})
