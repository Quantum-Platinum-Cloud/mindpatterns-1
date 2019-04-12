/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Util = require('./util.js');
const Details = require('./details.js');

const dataSetKey = 'data-makeup-accordion-index';

const defaultOptions = {
    autoCollapse: false
};

function onToggle(e) {
    const itemIndex = e.target.getAttribute(dataSetKey);
    const isOpen = this._detailsWidgets[itemIndex].open === true

    if (this._options.autoCollapse === true && isOpen) {
        const otherWidgets = this._detailsWidgets.filter((item, index) => index != itemIndex);
        otherWidgets.forEach(widget => widget.open = false);
    }
}

function addToggleListener(detailsEl, i) {
    // this event will be fired by browsers that DO NOT support details element
    detailsEl.addEventListener('details-toggle', this._onToggleListener);
    // this event will be fired by browsers that DO support details element
    detailsEl.addEventListener('toggle', this._onToggleListener);
}

function removeToggleListener(detailsEl, i) {
    // this event will be fired by browsers that DO NOT support details element
    detailsEl.removeEventListener('details-toggle', this._onToggleListener);
    // this event will be fired by browsers that DO support details element
    detailsEl.removeEventListener('toggle', this._onToggleListener);
}

function createDetailsWidget(el, i) {
    el.setAttribute(dataSetKey, i);
    this._detailsWidgets.push(new Details(el));
}

module.exports = class {
    constructor(widgetEl, selectedOptions) {
        this._options = Object.assign({}, defaultOptions, selectedOptions);

        // cache the root element
        this._el = widgetEl;

        this._onToggleListener = onToggle.bind(this);

        this._detailsWidgets = [];

        const detailsEls = Util.querySelectorAllToArray('.accordion__details', this._el);

        detailsEls.forEach(createDetailsWidget.bind(this));

        this.enableEvents();

        // mark the widget as progressively enhanced
        this._el.classList.add('accordion--js');
    }

    disableEvents() {
        Util.querySelectorAllToArray('.accordion__details', this._el).forEach(removeToggleListener.bind(this));
    }

    enableEvents() {
        if (this._destroyed !== true) {
            Util.querySelectorAllToArray('.accordion__details', this._el).forEach(addToggleListener.bind(this));
        }
    }

    destroy() {
        this._destroyed = true;

        this.disableEvents();

        this._onToggleListener = null;
    }
}
