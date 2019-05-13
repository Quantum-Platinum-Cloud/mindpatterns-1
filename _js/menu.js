"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/
var RovingTabIndex = require('makeup-roving-tabindex');

var PreventScrollKeys = require('makeup-prevent-scroll-keys');

function onKeyDown(e) {
  if (e.keyCode === 27) {
    this._el.dispatchEvent(new CustomEvent('menu-escape'));
  } else if (e.keyCode === 13 || e.keyCode === 32) {
    processMenuItemAction(this._el, e.target);
  }
}

function onClick(e) {
  processMenuItemAction(this._el, e.target);
}

function processMenuItemAction(widgetEl, menuItemEl) {
  switch (menuItemEl.getAttribute('role')) {
    case 'menuitemcheckbox':
      doMenuItemCheckbox(widgetEl, menuItemEl);
      break;

    case 'menuitemradio':
      doMenuItemRadio(widgetEl, menuItemEl, widgetEl.querySelectorAll("[data-menuitemradio-name=".concat(menuItemEl.dataset.menuitemradioName, "]")));
      break;

    default:
      doMenuItem(widgetEl, menuItemEl);
      break;
  }
}

function doMenuItem(widgetEl, menuItemEl) {
  widgetEl.dispatchEvent(new CustomEvent('menuitem-select', {
    detail: {
      el: menuItemEl
    }
  }));
}

function doMenuItemCheckbox(widgetEl, menuItemEl) {
  menuItemEl.setAttribute('aria-checked', menuItemEl.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
  widgetEl.dispatchEvent(new CustomEvent('menuitemcheckbox-toggle', {
    detail: {
      el: menuItemEl,
      checked: menuItemEl.getAttribute('aria-checked')
    }
  }));
}

function doMenuItemRadio(widgetEl, menuItemEl, radioGroupEls) {
  radioGroupEls.forEach(function (el) {
    el.setAttribute('aria-checked', 'false');
  });
  menuItemEl.setAttribute('aria-checked', 'true');
  widgetEl.dispatchEvent(new CustomEvent('menuitemradio-change', {
    detail: {
      el: menuItemEl
    }
  }));
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._rovingTabIndex = RovingTabIndex.createLinear(this._el, '[role^=menuitem]');
    PreventScrollKeys.add(this._el);
    this._onKeyDownListener = onKeyDown.bind(this);
    this._onClickListener = onClick.bind(this);

    this._el.classList.add('menu--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._el.removeEventListener('keydown', this._onKeyDownListener);

      this._el.removeEventListener('click', this._onClickListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._el.addEventListener('keydown', this._onKeyDownListener);

        this._el.addEventListener('click', this._onClickListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onKeyDownListener = null;
      this._onClickListener = null;
    }
  }, {
    key: "items",
    get: function get() {
      return this._el.querySelectorAll('[role^=menuitem]');
    }
  }]);

  return _class;
}();