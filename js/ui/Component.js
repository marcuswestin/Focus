jsio('from common.javascript import Class');
jsio('import common.Publisher');

exports = Class(common.Publisher, function(supr) {
	
	this._domType = 'div'
	this._className = null
	
	this.getElement = function() {
		if (!this._element) { 
			this._element = this.create({ type: this._domType })
			if (this._className) { this.addClassName(this._className) }
			this.createContent()
		}
		return this._element
	}
	
	this.createContent = function() {} // abstract method
	
	this.show = function() { this.getElement().style.display = 'block'; }
	this.hide = function() { this.getElement().style.display = 'none'; }
	
	this.appendTo = function(element) { element.appendChild(this.getElement()); }
	this.prependTo = function(element) { element.insertBefore(this.getElement(), element.firstChild); }
	
	this.create = function(params) {
		var el = document.createElement(params.type || 'div');
		if (params.className) { el.className = params.className; }
		if (params.html) { el.innerHTML = params.html; }
		if (params.src) { el.src = params.src; }
		if (params.href) { el.href = params.href; }
		if (params.text) { el.appendChild(document.createTextNode(params.text)); }
		if (params.style) { exports.setStyle(el, params.style); }
		if (params.parent) { params.parent.appendChild(el); }
		return el;
	}

/***************
 * Class names *
 ***************/

	this.addClassName = function(className) { 
		var element = this._element
		if (!(' ' + element.className + ' ').match(' ' + className + ' ')) {
			element.className += ' ' + className + ' ';
		}
	}
	
	this.removeClassName = function(className) { 
		var element = this._element
		className += ' ';
		var current = element.className;
		var index = current.indexOf(className);
		if (index != -1) {
			element.className = current.slice(0, index) + current.slice(index + className.length);
		}
	}
	
	this.hasClassName = function(className) {
		return !!this._element.className.match(' ' + className + ' ');
	}
	
/**********
 * Events *
 **********/

	// this.on('click', function(e){})
	// this.on('click', element, function(e){})
	this.on = function(eventName, element, handler) {
		if (arguments.length == 2) { 
			handler = element
			element = this._element
		}
		
		// Is removeEvent going to work properly when we wrap the handler in another function?
		function normalizeEvent(e) {
			e = e || event
			if (!e.target) { e.target = e.srcElement }
			var eventObj = { keyCode: e.keyCode, metaKey: e.metaKey }
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
		return handler
	}

	// I don't think this code works...
	events.removeOn = function(eventName, element, handler) {
		if (arguments.length == 2) {
			handler = element
			element = this._element
		}
		if (element.removeEventListener) {
			element.removeEventListener(eventName, handler, false)
			return true
		} else if (element.detachEvent) {
			return element.detachEvent("on"+eventName, handler)
		}
	} 
	
/*******************
 * Layout and size *
 *******************/
	
	// this.layout({ width: 100, height: 100, top: 10, left: 10 })
	// this.layout(anElement, { width: 10, height: 10 })
	this.layout = function(el, dim) {
		if (!dim) { 
			el = this._element
			dim = el
		}
		for (var key in dim) {
			this._element.style[key] = dim[key] + 'px'
		}
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
			return { top: top, left: left, width: box.right - box.left, height: box.bottom - box.top };

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

			return { top: top, left: left, width: width, height: height };
		}
	}
	// end jQuery positioning code
})
