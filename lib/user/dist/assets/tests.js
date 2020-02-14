'use strict';

define("dummy/tests/helpers/data-helper", ["exports", "respond/actions/types", "dummy/tests/data/data"], function (_exports, ACTION_TYPES, _data2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // Dispatches a given redux action, wrapping it in Ember.run.
  function _dispatchAction(redux, action) {
    Ember.run(function () {
      redux.dispatch(action);
    });
  } // Dispatches a given redux action type and simulates an async response with the given payload.
  // Both the action dispatch and the promise resolve will be wrapped in Ember.run. Just to be safe!


  function _dispatchActionWithPromisePayload(redux, type, payload) {
    var promise = new Ember.RSVP.Promise(function (resolve) {
      Ember.run(function () {
        resolve(payload);
      });
    });

    _dispatchAction(redux, {
      type: type,
      promise: promise
    });
  }

  var DataHelper =
  /*#__PURE__*/
  function () {
    function DataHelper(redux) {
      _classCallCheck(this, DataHelper);

      this.redux = redux;
    }

    _createClass(DataHelper, [{
      key: "initializeIncident",
      value: function initializeIncident(incidentId) {
        _dispatchAction(this.redux, {
          type: ACTION_TYPES.INITIALIZE_INCIDENT,
          incidentId: incidentId
        });
      }
    }, {
      key: "initializeIncidentSelection",
      value: function initializeIncidentSelection(payload) {
        _dispatchAction(this.redux, {
          type: ACTION_TYPES.SET_INCIDENT_SELECTION,
          payload: payload
        });
      }
    }, {
      key: "fetchIncidentDetails",
      value: function fetchIncidentDetails() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _data2.incidentDetails;

        _dispatchActionWithPromisePayload(this.redux, ACTION_TYPES.FETCH_INCIDENT_DETAILS, {
          code: 0,
          data: data
        });
      }
    }, {
      key: "fetchIncidentStoryline",
      value: function fetchIncidentStoryline() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _data2.storyline;

        _dispatchAction(this.redux, {
          type: ACTION_TYPES.FETCH_INCIDENT_STORYLINE_STARTED
        });

        _dispatchAction(this.redux, {
          type: ACTION_TYPES.FETCH_INCIDENT_STORYLINE_RETRIEVE_BATCH,
          payload: {
            code: 0,
            data: data,
            meta: {
              complete: true
            }
          }
        });

        _dispatchAction(this.redux, {
          type: ACTION_TYPES.FETCH_INCIDENT_STORYLINE_EVENTS_STREAM_INITIALIZED
        });

        _dispatchAction(this.redux, {
          type: ACTION_TYPES.FETCH_INCIDENT_STORYLINE_EVENTS_REQUEST_BATCH
        });

        var _data = _slicedToArray(data, 1),
            firstIndicator = _data[0];

        _dispatchAction(this.redux, {
          type: ACTION_TYPES.FETCH_INCIDENT_STORYLINE_EVENTS_RETRIEVE_BATCH,
          payload: {
            indicatorId: firstIndicator.id,
            events: _data2.events
          }
        });

        _dispatchAction(this.redux, {
          type: ACTION_TYPES.FETCH_INCIDENT_STORYLINE_EVENTS_COMPLETED
        });

        _dispatchAction(this.redux, {
          type: ACTION_TYPES.FETCH_INCIDENT_STORYLINE_COMPLETED
        });
      }
    }, {
      key: "toggleIncidentJournalPanel",
      value: function toggleIncidentJournalPanel() {
        _dispatchAction(this.redux, {
          type: ACTION_TYPES.TOGGLE_JOURNAL_PANEL
        });
      }
    }]);

    return DataHelper;
  }();

  var _default = DataHelper;
  _exports.default = _default;
});
define("dummy/tests/helpers/destroy-app", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = destroyApp;

  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define("dummy/tests/helpers/editable-field", ["exports", "@ember/test-helpers"], function (_exports, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.updateEditableField = updateEditableField;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function updateEditableField(_x, _x2) {
    return _updateEditableField.apply(this, arguments);
  }

  function _updateEditableField() {
    _updateEditableField = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(scopeSelector, newValue) {
      var fieldSelector, inputSelector, confirmButtonSelector;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              fieldSelector = "".concat(scopeSelector, " .editable-field .editable-field__value");
              inputSelector = "".concat(scopeSelector, " .editable-field input, ").concat(scopeSelector, " .editable-field textarea");
              confirmButtonSelector = "".concat(scopeSelector, " .editable-field .confirm-changes button");
              _context.next = 5;
              return (0, _testHelpers.click)(fieldSelector);

            case 5:
              _context.next = 7;
              return (0, _testHelpers.fillIn)(inputSelector, newValue);

            case 7:
              _context.next = 9;
              return (0, _testHelpers.click)(confirmButtonSelector);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _updateEditableField.apply(this, arguments);
  }
});
define("dummy/tests/helpers/find-element", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.findElement = void 0;

  var findElement = function findElement(selector, text) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
      var elementText = element.textContent;
      var trimmedText = elementText && elementText.trim();
      return RegExp(text).test(trimmedText);
    });
  };

  _exports.findElement = findElement;
});
define("dummy/tests/helpers/module-for-acceptance", ["exports", "qunit", "dummy/tests/helpers/start-app", "dummy/tests/helpers/destroy-app"], function (_exports, _qunit, _startApp, _destroyApp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _default(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Ember.RSVP.Promise.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  }
});
define("dummy/tests/helpers/patch-reducer", ["exports", "respond/services/redux"], function (_exports, _redux3) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.applyPatch = applyPatch;
  _exports.revertPatch = revertPatch;

  /* global require, define */
  var _require = require,
      unsee = _require.unsee;

  function applyPatch(initState) {
    unsee('respond/services/redux');
    define('respond/services/redux', ['exports', 'redux', 'ember-redux/services/redux', 'respond/reducers/index', 'redux-thunk', 'redux-pack'], function (exports, _redux, _redux2, _index, _reduxThunk, _reduxPack) {
      'use strict';

      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      var _redux$default = _redux.default,
          createStore = _redux$default.createStore,
          applyMiddleware = _redux$default.applyMiddleware,
          compose = _redux$default.compose;

      var makeStoreInstance = function makeStoreInstance(_ref) {
        var reducers = _ref.reducers,
            enhancers = _ref.enhancers;
        var middleware = applyMiddleware(_reduxThunk.default, _reduxPack.middleware);
        var createStoreWithMiddleware = compose(middleware, enhancers)(createStore);
        return createStoreWithMiddleware(reducers, initState);
      };

      exports.default = _redux2.default.extend({
        reducers: _index.default,
        makeStoreInstance: makeStoreInstance
      });
    });
  }

  function revertPatch() {
    unsee('respond/services/redux');
    define('respond/services/redux', ['exports'], function (exports) {
      exports.default = _redux3.default;
    });
  }
});
define("dummy/tests/helpers/resolver", ["exports", "dummy/resolver", "dummy/config/environment"], function (_exports, _resolver, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };
  var _default = resolver;
  _exports.default = _default;
});
define("dummy/tests/helpers/start-app", ["exports", "dummy/app", "dummy/config/environment", "dummy/tests/helpers/redux-async-helpers"], function (_exports, _app, _environment, _reduxAsyncHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = startApp;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function startApp(attrs) {
    var attributes = _objectSpread({}, _environment.default.APP, {
      autoboot: true
    }, attrs);

    return Ember.run(function () {
      var application = _app.default.create(attributes);

      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define("dummy/tests/helpers/trigger-native-event", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = triggerNativeEvent;

  function triggerNativeEvent(element, eventName) {
    if (document.createEvent) {
      var event = document.createEvent('Events');
      event.initEvent(eventName, true, false);
      element.dispatchEvent(event);
    } else {
      element.fireEvent("on".concat(eventName));
    }
  }
});
define("dummy/tests/helpers/vnext-patch", ["exports", "redux", "redux-thunk", "redux-saga", "respond/sagas/index", "redux-pack", "respond/reducers/index", "ember-redux/services/redux"], function (_exports, _redux, _reduxThunk, _reduxSaga, _index, _reduxPack, _index2, _redux2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.patchReducer = patchReducer;
  var createStore = _redux.default.createStore,
      applyMiddleware = _redux.default.applyMiddleware,
      compose = _redux.default.compose;

  function patchReducer(context, initState) {
    var sagaMiddleware = (0, _reduxSaga.default)();

    var makeStoreInstance = function makeStoreInstance() {
      var middlewares = applyMiddleware(_reduxThunk.default, _reduxPack.middleware, sagaMiddleware);
      var createStoreWithMiddleware = compose(middlewares)(createStore);
      var store = createStoreWithMiddleware(_index2.default, initState);
      sagaMiddleware.run(_index.default);
      return store;
    };

    context.owner.register('service:redux', _redux2.default.extend({
      makeStoreInstance: makeStoreInstance
    }));
  }
});
define("dummy/tests/integration/components/user-table-test", ["qunit", "ember-qunit", "@ember/test-helpers", "htmlbars-inline-precompile"], function (_qunit, _emberQunit, _testHelpers, _htmlbarsInlinePrecompile) {
  "use strict";

  function _templateObject2() {
    var data = _taggedTemplateLiteral(["\n      <UserTable>\n        template block text\n      </UserTable>\n    "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    var data = _taggedTemplateLiteral(["<UserTable />"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  (0, _qunit.module)('Integration | Component | user-table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    (0, _qunit.test)('it renders',
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(assert) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _testHelpers.render)((0, _htmlbarsInlinePrecompile.default)(_templateObject()));

              case 2:
                assert.equal(this.element.textContent.trim(), ''); // Template block usage:

                _context.next = 5;
                return (0, _testHelpers.render)((0, _htmlbarsInlinePrecompile.default)(_templateObject2()));

              case 5:
                assert.equal(this.element.textContent.trim(), 'template block text');

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  });
});
define("dummy/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
});
define("dummy/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('dummy/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'dummy/templates/application.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('dummy/templates/index.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'dummy/templates/index.hbs should pass TemplateLint.\n\n');
  });
});
define("dummy/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('helpers/data-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/data-helper.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/editable-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/editable-field.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/find-element.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/find-element.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/patch-reducer.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/patch-reducer.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/trigger-native-event.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/trigger-native-event.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/vnext-patch.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/vnext-patch.js should pass ESLint\n\n');
  });
  QUnit.test('integration/components/user-table-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/user-table-test.js should pass ESLint\n\n');
  });
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});
define("dummy/tests/page-object", ["exports", "ember-cli-page-object"], function (_exports, _emberCliPageObject) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "alias", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.alias;
    }
  });
  Object.defineProperty(_exports, "attribute", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.attribute;
    }
  });
  Object.defineProperty(_exports, "clickOnText", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.clickOnText;
    }
  });
  Object.defineProperty(_exports, "clickable", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.clickable;
    }
  });
  Object.defineProperty(_exports, "collection", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.collection;
    }
  });
  Object.defineProperty(_exports, "contains", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.contains;
    }
  });
  Object.defineProperty(_exports, "count", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.count;
    }
  });
  Object.defineProperty(_exports, "create", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.create;
    }
  });
  Object.defineProperty(_exports, "fillable", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.fillable;
    }
  });
  Object.defineProperty(_exports, "selectable", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.fillable;
    }
  });
  Object.defineProperty(_exports, "focusable", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.focusable;
    }
  });
  Object.defineProperty(_exports, "hasClass", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.hasClass;
    }
  });
  Object.defineProperty(_exports, "is", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.is;
    }
  });
  Object.defineProperty(_exports, "isHidden", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.isHidden;
    }
  });
  Object.defineProperty(_exports, "isPresent", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.isPresent;
    }
  });
  Object.defineProperty(_exports, "isVisible", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.isVisible;
    }
  });
  Object.defineProperty(_exports, "notHasClass", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.notHasClass;
    }
  });
  Object.defineProperty(_exports, "property", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.property;
    }
  });
  Object.defineProperty(_exports, "text", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.text;
    }
  });
  Object.defineProperty(_exports, "triggerable", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.triggerable;
    }
  });
  Object.defineProperty(_exports, "value", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.value;
    }
  });
  Object.defineProperty(_exports, "visitable", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.visitable;
    }
  });
  Object.defineProperty(_exports, "buildSelector", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.buildSelector;
    }
  });
  Object.defineProperty(_exports, "findElementWithAssert", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.findElementWithAssert;
    }
  });
  Object.defineProperty(_exports, "findElement", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.findElement;
    }
  });
  Object.defineProperty(_exports, "getContext", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.getContext;
    }
  });
  Object.defineProperty(_exports, "fullScope", {
    enumerable: true,
    get: function get() {
      return _emberCliPageObject.fullScope;
    }
  });
  _exports.default = void 0;
  var _default = {
    alias: _emberCliPageObject.alias,
    attribute: _emberCliPageObject.attribute,
    blurrable: _emberCliPageObject.blurrable,
    clickOnText: _emberCliPageObject.clickOnText,
    clickable: _emberCliPageObject.clickable,
    collection: _emberCliPageObject.collection,
    contains: _emberCliPageObject.contains,
    count: _emberCliPageObject.count,
    create: _emberCliPageObject.create,
    fillable: _emberCliPageObject.fillable,
    focusable: _emberCliPageObject.focusable,
    hasClass: _emberCliPageObject.hasClass,
    is: _emberCliPageObject.is,
    isHidden: _emberCliPageObject.isHidden,
    isPresent: _emberCliPageObject.isPresent,
    isVisible: _emberCliPageObject.isVisible,
    notHasClass: _emberCliPageObject.notHasClass,
    property: _emberCliPageObject.property,
    selectable: _emberCliPageObject.fillable,
    text: _emberCliPageObject.text,
    triggerable: _emberCliPageObject.triggerable,
    value: _emberCliPageObject.value,
    visitable: _emberCliPageObject.visitable
  };
  _exports.default = _default;
  (true && !(false) && Ember.deprecate("Importing from \"test-support\" is now deprecated. Please import directly from the \"ember-cli-page-object\" module instead.", false, {
    id: 'ember-cli-page-object.import-from-test-support',
    until: '2.0.0',
    url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#import-from-test-support'
  }));
});
define("dummy/tests/test-helper", ["dummy/tests/helpers/resolver", "ember-qunit", "ember-cli-qunit"], function (_resolver, _emberQunit, _emberCliQunit) {
  "use strict";

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
