

(function() {
/*!
 * @overview  Ember - JavaScript Application Framework
 * @copyright Copyright 2011-2018 Tilde Inc. and contributors
 *            Portions Copyright 2006-2011 Strobe Inc.
 *            Portions Copyright 2008-2011 Apple Inc. All rights reserved.
 * @license   Licensed under MIT license
 *            See https://raw.github.com/emberjs/ember.js/master/LICENSE
 * @version   3.10.2
 */

/*globals process */
var enifed, requireModule, Ember;

// Used in @ember/-internals/environment/lib/global.js
mainContext = this; // eslint-disable-line no-undef

(function() {
  function missingModule(name, referrerName) {
    if (referrerName) {
      throw new Error('Could not find module ' + name + ' required by: ' + referrerName);
    } else {
      throw new Error('Could not find module ' + name);
    }
  }

  function internalRequire(_name, referrerName) {
    var name = _name;
    var mod = registry[name];

    if (!mod) {
      name = name + '/index';
      mod = registry[name];
    }

    var exports = seen[name];

    if (exports !== undefined) {
      return exports;
    }

    exports = seen[name] = {};

    if (!mod) {
      missingModule(_name, referrerName);
    }

    var deps = mod.deps;
    var callback = mod.callback;
    var reified = new Array(deps.length);

    for (var i = 0; i < deps.length; i++) {
      if (deps[i] === 'exports') {
        reified[i] = exports;
      } else if (deps[i] === 'require') {
        reified[i] = requireModule;
      } else {
        reified[i] = internalRequire(deps[i], name);
      }
    }

    callback.apply(this, reified);

    return exports;
  }

  var isNode =
    typeof window === 'undefined' &&
    typeof process !== 'undefined' &&
    {}.toString.call(process) === '[object process]';

  if (!isNode) {
    Ember = this.Ember = this.Ember || {};
  }

  if (typeof Ember === 'undefined') {
    Ember = {};
  }

  if (typeof Ember.__loader === 'undefined') {
    var registry = Object.create(null);
    var seen = Object.create(null);

    enifed = function(name, deps, callback) {
      var value = {};

      if (!callback) {
        value.deps = [];
        value.callback = deps;
      } else {
        value.deps = deps;
        value.callback = callback;
      }

      registry[name] = value;
    };

    requireModule = function(name) {
      return internalRequire(name, null);
    };

    // setup `require` module
    requireModule['default'] = requireModule;

    requireModule.has = function registryHas(moduleName) {
      return Boolean(registry[moduleName]) || Boolean(registry[moduleName + '/index']);
    };

    requireModule._eak_seen = registry;

    Ember.__loader = {
      define: enifed,
      require: requireModule,
      registry: registry,
    };
  } else {
    enifed = Ember.__loader.define;
    requireModule = Ember.__loader.require;
  }
})();

enifed("@ember/debug/index", ["exports", "@ember/-internals/browser-environment", "@ember/error", "@ember/debug/lib/deprecate", "@ember/debug/lib/testing", "@ember/debug/lib/warn"], function (_exports, _browserEnvironment, _error, _deprecate2, _testing, _warn2) {
  "use strict";

  Object.defineProperty(_exports, "registerDeprecationHandler", {
    enumerable: true,
    get: function () {
      return _deprecate2.registerHandler;
    }
  });
  Object.defineProperty(_exports, "isTesting", {
    enumerable: true,
    get: function () {
      return _testing.isTesting;
    }
  });
  Object.defineProperty(_exports, "setTesting", {
    enumerable: true,
    get: function () {
      return _testing.setTesting;
    }
  });
  Object.defineProperty(_exports, "registerWarnHandler", {
    enumerable: true,
    get: function () {
      return _warn2.registerHandler;
    }
  });
  _exports._warnIfUsingStrippedFeatureFlags = _exports.getDebugFunction = _exports.setDebugFunction = _exports.deprecateFunc = _exports.runInDebug = _exports.debugFreeze = _exports.debugSeal = _exports.deprecate = _exports.debug = _exports.warn = _exports.info = _exports.assert = void 0;

  // These are the default production build versions:
  var noop = function () {};

  var assert = noop;
  _exports.assert = assert;
  var info = noop;
  _exports.info = info;
  var warn = noop;
  _exports.warn = warn;
  var debug = noop;
  _exports.debug = debug;
  var deprecate = noop;
  _exports.deprecate = deprecate;
  var debugSeal = noop;
  _exports.debugSeal = debugSeal;
  var debugFreeze = noop;
  _exports.debugFreeze = debugFreeze;
  var runInDebug = noop;
  _exports.runInDebug = runInDebug;
  var setDebugFunction = noop;
  _exports.setDebugFunction = setDebugFunction;
  var getDebugFunction = noop;
  _exports.getDebugFunction = getDebugFunction;

  var deprecateFunc = function () {
    return arguments[arguments.length - 1];
  };

  _exports.deprecateFunc = deprecateFunc;

  if (true
  /* DEBUG */
  ) {
      _exports.setDebugFunction = setDebugFunction = function (type, callback) {
        switch (type) {
          case 'assert':
            return _exports.assert = assert = callback;

          case 'info':
            return _exports.info = info = callback;

          case 'warn':
            return _exports.warn = warn = callback;

          case 'debug':
            return _exports.debug = debug = callback;

          case 'deprecate':
            return _exports.deprecate = deprecate = callback;

          case 'debugSeal':
            return _exports.debugSeal = debugSeal = callback;

          case 'debugFreeze':
            return _exports.debugFreeze = debugFreeze = callback;

          case 'runInDebug':
            return _exports.runInDebug = runInDebug = callback;

          case 'deprecateFunc':
            return _exports.deprecateFunc = deprecateFunc = callback;
        }
      };

      _exports.getDebugFunction = getDebugFunction = function (type) {
        switch (type) {
          case 'assert':
            return assert;

          case 'info':
            return info;

          case 'warn':
            return warn;

          case 'debug':
            return debug;

          case 'deprecate':
            return deprecate;

          case 'debugSeal':
            return debugSeal;

          case 'debugFreeze':
            return debugFreeze;

          case 'runInDebug':
            return runInDebug;

          case 'deprecateFunc':
            return deprecateFunc;
        }
      };
    }
  /**
  @module @ember/debug
  */


  if (true
  /* DEBUG */
  ) {
      /**
        Verify that a certain expectation is met, or throw a exception otherwise.
           This is useful for communicating assumptions in the code to other human
        readers as well as catching bugs that accidentally violates these
        expectations.
           Assertions are removed from production builds, so they can be freely added
        for documentation and debugging purposes without worries of incuring any
        performance penalty. However, because of that, they should not be used for
        checks that could reasonably fail during normal usage. Furthermore, care
        should be taken to avoid accidentally relying on side-effects produced from
        evaluating the condition itself, since the code will not run in production.
           ```javascript
        import { assert } from '@ember/debug';
           // Test for truthiness
        assert('Must pass a string', typeof str === 'string');
           // Fail unconditionally
        assert('This code path should never be run');
        ```
           @method assert
        @static
        @for @ember/debug
        @param {String} description Describes the expectation. This will become the
          text of the Error thrown if the assertion fails.
        @param {Boolean} condition Must be truthy for the assertion to pass. If
          falsy, an exception will be thrown.
        @public
        @since 1.0.0
      */
      setDebugFunction('assert', function assert(desc, test) {
        if (!test) {
          throw new _error.default("Assertion Failed: " + desc);
        }
      });
      /**
        Display a debug notice.
           Calls to this function are removed from production builds, so they can be
        freely added for documentation and debugging purposes without worries of
        incuring any performance penalty.
           ```javascript
        import { debug } from '@ember/debug';
           debug('I\'m a debug notice!');
        ```
           @method debug
        @for @ember/debug
        @static
        @param {String} message A debug message to display.
        @public
      */

      setDebugFunction('debug', function debug(message) {
        /* eslint-disable no-console */
        if (console.debug) {
          console.debug("DEBUG: " + message);
        } else {
          console.log("DEBUG: " + message);
        }
        /* eslint-ensable no-console */

      });
      /**
        Display an info notice.
           Calls to this function are removed from production builds, so they can be
        freely added for documentation and debugging purposes without worries of
        incuring any performance penalty.
           @method info
        @private
      */

      setDebugFunction('info', function info() {
        var _console;

        (_console = console).info.apply(_console, arguments);
        /* eslint-disable-line no-console */

      });
      /**
       @module @ember/application
       @public
      */

      /**
        Alias an old, deprecated method with its new counterpart.
           Display a deprecation warning with the provided message and a stack trace
        (Chrome and Firefox only) when the assigned method is called.
           Calls to this function are removed from production builds, so they can be
        freely added for documentation and debugging purposes without worries of
        incuring any performance penalty.
           ```javascript
        import { deprecateFunc } from '@ember/application/deprecations';
           Ember.oldMethod = deprecateFunc('Please use the new, updated method', options, Ember.newMethod);
        ```
           @method deprecateFunc
        @static
        @for @ember/application/deprecations
        @param {String} message A description of the deprecation.
        @param {Object} [options] The options object for `deprecate`.
        @param {Function} func The new function called to replace its deprecated counterpart.
        @return {Function} A new function that wraps the original function with a deprecation warning
        @private
      */

      setDebugFunction('deprecateFunc', function deprecateFunc() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (args.length === 3) {
          var message = args[0],
              options = args[1],
              func = args[2];
          return function () {
            deprecate(message, false, options);

            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return func.apply(this, args);
          };
        } else {
          var _message = args[0],
              _func = args[1];
          return function () {
            deprecate(_message);
            return _func.apply(this, arguments);
          };
        }
      });
      /**
       @module @ember/debug
       @public
      */

      /**
        Run a function meant for debugging.
           Calls to this function are removed from production builds, so they can be
        freely added for documentation and debugging purposes without worries of
        incuring any performance penalty.
           ```javascript
        import Component from '@ember/component';
        import { runInDebug } from '@ember/debug';
           runInDebug(() => {
          Component.reopen({
            didInsertElement() {
              console.log("I'm happy");
            }
          });
        });
        ```
           @method runInDebug
        @for @ember/debug
        @static
        @param {Function} func The function to be executed.
        @since 1.5.0
        @public
      */

      setDebugFunction('runInDebug', function runInDebug(func) {
        func();
      });
      setDebugFunction('debugSeal', function debugSeal(obj) {
        Object.seal(obj);
      });
      setDebugFunction('debugFreeze', function debugFreeze(obj) {
        // re-freezing an already frozen object introduces a significant
        // performance penalty on Chrome (tested through 59).
        //
        // See: https://bugs.chromium.org/p/v8/issues/detail?id=6450
        if (!Object.isFrozen(obj)) {
          Object.freeze(obj);
        }
      });
      setDebugFunction('deprecate', _deprecate2.default);
      setDebugFunction('warn', _warn2.default);
    }

  var _warnIfUsingStrippedFeatureFlags;

  _exports._warnIfUsingStrippedFeatureFlags = _warnIfUsingStrippedFeatureFlags;

  if (true
  /* DEBUG */
  && !(0, _testing.isTesting)()) {
    if (typeof window !== 'undefined' && (_browserEnvironment.isFirefox || _browserEnvironment.isChrome) && window.addEventListener) {
      window.addEventListener('load', function () {
        if (document.documentElement && document.documentElement.dataset && !document.documentElement.dataset.emberExtension) {
          var downloadURL;

          if (_browserEnvironment.isChrome) {
            downloadURL = 'https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi';
          } else if (_browserEnvironment.isFirefox) {
            downloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/';
          }

          debug("For more advanced debugging, install the Ember Inspector from " + downloadURL);
        }
      }, false);
    }
  }
});
enifed("@ember/debug/lib/deprecate", ["exports", "@ember/-internals/environment", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _environment, _index, _handlers) {
  "use strict";

  _exports.missingOptionsUntilDeprecation = _exports.missingOptionsIdDeprecation = _exports.missingOptionsDeprecation = _exports.registerHandler = _exports.default = void 0;

  /**
   @module @ember/debug
   @public
  */

  /**
    Allows for runtime registration of handler functions that override the default deprecation behavior.
    Deprecations are invoked by calls to [@ember/application/deprecations/deprecate](https://emberjs.com/api/ember/release/classes/@ember%2Fapplication%2Fdeprecations/methods/deprecate?anchor=deprecate).
    The following example demonstrates its usage by registering a handler that throws an error if the
    message contains the word "should", otherwise defers to the default handler.
  
    ```javascript
    import { registerDeprecationHandler } from '@ember/debug';
  
    registerDeprecationHandler((message, options, next) => {
      if (message.indexOf('should') !== -1) {
        throw new Error(`Deprecation message with should: ${message}`);
      } else {
        // defer to whatever handler was registered before this one
        next(message, options);
      }
    });
    ```
  
    The handler function takes the following arguments:
  
    <ul>
      <li> <code>message</code> - The message received from the deprecation call.</li>
      <li> <code>options</code> - An object passed in with the deprecation call containing additional information including:</li>
        <ul>
          <li> <code>id</code> - An id of the deprecation in the form of <code>package-name.specific-deprecation</code>.</li>
          <li> <code>until</code> - The Ember version number the feature and deprecation will be removed in.</li>
        </ul>
      <li> <code>next</code> - A function that calls into the previously registered handler.</li>
    </ul>
  
    @public
    @static
    @method registerDeprecationHandler
    @for @ember/debug
    @param handler {Function} A function to handle deprecation calls.
    @since 2.1.0
  */
  var registerHandler = function () {};

  _exports.registerHandler = registerHandler;
  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;
  var missingOptionsUntilDeprecation;
  _exports.missingOptionsUntilDeprecation = missingOptionsUntilDeprecation;

  var deprecate = function () {};

  if (true
  /* DEBUG */
  ) {
      _exports.registerHandler = registerHandler = function registerHandler(handler) {
        (0, _handlers.registerHandler)('deprecate', handler);
      };

      var formatMessage = function formatMessage(_message, options) {
        var message = _message;

        if (options && options.id) {
          message = message + (" [deprecation id: " + options.id + "]");
        }

        if (options && options.url) {
          message += " See " + options.url + " for more details.";
        }

        return message;
      };

      registerHandler(function logDeprecationToConsole(message, options) {
        var updatedMessage = formatMessage(message, options);
        console.warn("DEPRECATION: " + updatedMessage); // eslint-disable-line no-console
      });
      var captureErrorForStack;

      if (new Error().stack) {
        captureErrorForStack = function () {
          return new Error();
        };
      } else {
        captureErrorForStack = function () {
          try {
            __fail__.fail();
          } catch (e) {
            return e;
          }
        };
      }

      registerHandler(function logDeprecationStackTrace(message, options, next) {
        if (_environment.ENV.LOG_STACKTRACE_ON_DEPRECATION) {
          var stackStr = '';
          var error = captureErrorForStack();
          var stack;

          if (error.stack) {
            if (error['arguments']) {
              // Chrome
              stack = error.stack.replace(/^\s+at\s+/gm, '').replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
              stack.shift();
            } else {
              // Firefox
              stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
            }

            stackStr = "\n    " + stack.slice(2).join('\n    ');
          }

          var updatedMessage = formatMessage(message, options);
          console.warn("DEPRECATION: " + updatedMessage + stackStr); // eslint-disable-line no-console
        } else {
          next(message, options);
        }
      });
      registerHandler(function raiseOnDeprecation(message, options, next) {
        if (_environment.ENV.RAISE_ON_DEPRECATION) {
          var updatedMessage = formatMessage(message);
          throw new Error(updatedMessage);
        } else {
          next(message, options);
        }
      });
      _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `deprecate` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include `id` and `until` properties.';
      _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `deprecate` you must provide `id` in options.';
      _exports.missingOptionsUntilDeprecation = missingOptionsUntilDeprecation = 'When calling `deprecate` you must provide `until` in options.';
      /**
       @module @ember/application
       @public
       */

      /**
        Display a deprecation warning with the provided message and a stack trace
        (Chrome and Firefox only).
           * In a production build, this method is defined as an empty function (NOP).
        Uses of this method in Ember itself are stripped from the ember.prod.js build.
           @method deprecate
        @for @ember/application/deprecations
        @param {String} message A description of the deprecation.
        @param {Boolean} test A boolean. If falsy, the deprecation will be displayed.
        @param {Object} options
        @param {String} options.id A unique id for this deprecation. The id can be
          used by Ember debugging tools to change the behavior (raise, log or silence)
          for that specific deprecation. The id should be namespaced by dots, e.g.
          "view.helper.select".
        @param {string} options.until The version of Ember when this deprecation
          warning will be removed.
        @param {String} [options.url] An optional url to the transition guide on the
          emberjs.com website.
        @static
        @public
        @since 1.0.0
      */

      deprecate = function deprecate(message, test, options) {
        (0, _index.assert)(missingOptionsDeprecation, Boolean(options && (options.id || options.until)));
        (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options.id));
        (0, _index.assert)(missingOptionsUntilDeprecation, Boolean(options.until));
        (0, _handlers.invoke)('deprecate', message, test, options);
      };
    }

  var _default = deprecate;
  _exports.default = _default;
});
enifed("@ember/debug/lib/handlers", ["exports"], function (_exports) {
  "use strict";

  _exports.invoke = _exports.registerHandler = _exports.HANDLERS = void 0;
  var HANDLERS = {};
  _exports.HANDLERS = HANDLERS;

  var registerHandler = function () {};

  _exports.registerHandler = registerHandler;

  var invoke = function () {};

  _exports.invoke = invoke;

  if (true
  /* DEBUG */
  ) {
      _exports.registerHandler = registerHandler = function registerHandler(type, callback) {
        var nextHandler = HANDLERS[type] || function () {};

        HANDLERS[type] = function (message, options) {
          callback(message, options, nextHandler);
        };
      };

      _exports.invoke = invoke = function invoke(type, message, test, options) {
        if (test) {
          return;
        }

        var handlerForType = HANDLERS[type];

        if (handlerForType) {
          handlerForType(message, options);
        }
      };
    }
});
enifed("@ember/debug/lib/testing", ["exports"], function (_exports) {
  "use strict";

  _exports.isTesting = isTesting;
  _exports.setTesting = setTesting;
  var testing = false;

  function isTesting() {
    return testing;
  }

  function setTesting(value) {
    testing = Boolean(value);
  }
});
enifed("@ember/debug/lib/warn", ["exports", "@ember/debug/index", "@ember/debug/lib/handlers"], function (_exports, _index, _handlers) {
  "use strict";

  _exports.missingOptionsDeprecation = _exports.missingOptionsIdDeprecation = _exports.registerHandler = _exports.default = void 0;

  var registerHandler = function () {};

  _exports.registerHandler = registerHandler;

  var warn = function () {};

  var missingOptionsDeprecation;
  _exports.missingOptionsDeprecation = missingOptionsDeprecation;
  var missingOptionsIdDeprecation;
  /**
  @module @ember/debug
  */

  _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation;

  if (true
  /* DEBUG */
  ) {
      /**
        Allows for runtime registration of handler functions that override the default warning behavior.
        Warnings are invoked by calls made to [@ember/debug/warn](https://emberjs.com/api/ember/release/classes/@ember%2Fdebug/methods/warn?anchor=warn).
        The following example demonstrates its usage by registering a handler that does nothing overriding Ember's
        default warning behavior.
           ```javascript
        import { registerWarnHandler } from '@ember/debug';
           // next is not called, so no warnings get the default behavior
        registerWarnHandler(() => {});
        ```
           The handler function takes the following arguments:
           <ul>
          <li> <code>message</code> - The message received from the warn call. </li>
          <li> <code>options</code> - An object passed in with the warn call containing additional information including:</li>
            <ul>
              <li> <code>id</code> - An id of the warning in the form of <code>package-name.specific-warning</code>.</li>
            </ul>
          <li> <code>next</code> - A function that calls into the previously registered handler.</li>
        </ul>
           @public
        @static
        @method registerWarnHandler
        @for @ember/debug
        @param handler {Function} A function to handle warnings.
        @since 2.1.0
      */
      _exports.registerHandler = registerHandler = function registerHandler(handler) {
        (0, _handlers.registerHandler)('warn', handler);
      };

      registerHandler(function logWarning(message) {
        /* eslint-disable no-console */
        console.warn("WARNING: " + message);
        /* eslint-enable no-console */
      });
      _exports.missingOptionsDeprecation = missingOptionsDeprecation = 'When calling `warn` you ' + 'must provide an `options` hash as the third parameter.  ' + '`options` should include an `id` property.';
      _exports.missingOptionsIdDeprecation = missingOptionsIdDeprecation = 'When calling `warn` you must provide `id` in options.';
      /**
        Display a warning with the provided message.
           * In a production build, this method is defined as an empty function (NOP).
        Uses of this method in Ember itself are stripped from the ember.prod.js build.
           ```javascript
        import { warn } from '@ember/debug';
        import tomsterCount from './tomster-counter'; // a module in my project
           // Log a warning if we have more than 3 tomsters
        warn('Too many tomsters!', tomsterCount <= 3, {
          id: 'ember-debug.too-many-tomsters'
        });
        ```
           @method warn
        @for @ember/debug
        @static
        @param {String} message A warning to display.
        @param {Boolean} test An optional boolean. If falsy, the warning
          will be displayed.
        @param {Object} options An object that can be used to pass a unique
          `id` for this warning.  The `id` can be used by Ember debugging tools
          to change the behavior (raise, log, or silence) for that specific warning.
          The `id` should be namespaced by dots, e.g. "ember-debug.feature-flag-with-features-stripped"
        @public
        @since 1.0.0
      */

      warn = function warn(message, test, options) {
        if (arguments.length === 2 && typeof test === 'object') {
          options = test;
          test = false;
        }

        (0, _index.assert)(missingOptionsDeprecation, Boolean(options));
        (0, _index.assert)(missingOptionsIdDeprecation, Boolean(options && options.id));
        (0, _handlers.invoke)('warn', message, test, options);
      };
    }

  var _default = warn;
  _exports.default = _default;
});
enifed("ember-testing/index", ["exports", "ember-testing/lib/test", "ember-testing/lib/adapters/adapter", "ember-testing/lib/setup_for_testing", "ember-testing/lib/adapters/qunit", "ember-testing/lib/support", "ember-testing/lib/ext/application", "ember-testing/lib/ext/rsvp", "ember-testing/lib/helpers", "ember-testing/lib/initializers"], function (_exports, _test, _adapter, _setup_for_testing, _qunit, _support, _application, _rsvp, _helpers, _initializers) {
  "use strict";

  Object.defineProperty(_exports, "Test", {
    enumerable: true,
    get: function () {
      return _test.default;
    }
  });
  Object.defineProperty(_exports, "Adapter", {
    enumerable: true,
    get: function () {
      return _adapter.default;
    }
  });
  Object.defineProperty(_exports, "setupForTesting", {
    enumerable: true,
    get: function () {
      return _setup_for_testing.default;
    }
  });
  Object.defineProperty(_exports, "QUnitAdapter", {
    enumerable: true,
    get: function () {
      return _qunit.default;
    }
  });
});
enifed("ember-testing/lib/adapters/adapter", ["exports", "@ember/-internals/runtime"], function (_exports, _runtime) {
  "use strict";

  _exports.default = void 0;

  function K() {
    return this;
  }
  /**
   @module @ember/test
  */

  /**
    The primary purpose of this class is to create hooks that can be implemented
    by an adapter for various test frameworks.
  
    @class TestAdapter
    @public
  */


  var _default = _runtime.Object.extend({
    /**
      This callback will be called whenever an async operation is about to start.
       Override this to call your framework's methods that handle async
      operations.
       @public
      @method asyncStart
    */
    asyncStart: K,

    /**
      This callback will be called whenever an async operation has completed.
       @public
      @method asyncEnd
    */
    asyncEnd: K,

    /**
      Override this method with your testing framework's false assertion.
      This function is called whenever an exception occurs causing the testing
      promise to fail.
       QUnit example:
       ```javascript
        exception: function(error) {
          ok(false, error);
        };
      ```
       @public
      @method exception
      @param {String} error The exception to be raised.
    */
    exception: function (error) {
      throw error;
    }
  });

  _exports.default = _default;
});
enifed("ember-testing/lib/adapters/qunit", ["exports", "@ember/-internals/utils", "ember-testing/lib/adapters/adapter"], function (_exports, _utils, _adapter) {
  "use strict";

  _exports.default = void 0;

  /* globals QUnit */

  /**
     @module ember
  */

  /**
    This class implements the methods defined by TestAdapter for the
    QUnit testing framework.
  
    @class QUnitAdapter
    @namespace Ember.Test
    @extends TestAdapter
    @public
  */
  var _default = _adapter.default.extend({
    init: function () {
      this.doneCallbacks = [];
    },
    asyncStart: function () {
      if (typeof QUnit.stop === 'function') {
        // very old QUnit version
        QUnit.stop();
      } else {
        this.doneCallbacks.push(QUnit.config.current ? QUnit.config.current.assert.async() : null);
      }
    },
    asyncEnd: function () {
      // checking for QUnit.stop here (even though we _need_ QUnit.start) because
      // QUnit.start() still exists in QUnit 2.x (it just throws an error when calling
      // inside a test context)
      if (typeof QUnit.stop === 'function') {
        QUnit.start();
      } else {
        var done = this.doneCallbacks.pop(); // This can be null if asyncStart() was called outside of a test

        if (done) {
          done();
        }
      }
    },
    exception: function (error) {
      QUnit.config.current.assert.ok(false, (0, _utils.inspect)(error));
    }
  });

  _exports.default = _default;
});
enifed("ember-testing/lib/events", ["exports", "@ember/runloop", "@ember/polyfills", "ember-testing/lib/helpers/-is-form-control"], function (_exports, _runloop, _polyfills, _isFormControl) {
  "use strict";

  _exports.focus = focus;
  _exports.fireEvent = fireEvent;
  var DEFAULT_EVENT_OPTIONS = {
    canBubble: true,
    cancelable: true
  };
  var KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];
  var MOUSE_EVENT_TYPES = ['click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover'];

  function focus(el) {
    if (!el) {
      return;
    }

    if (el.isContentEditable || (0, _isFormControl.default)(el)) {
      var type = el.getAttribute('type');

      if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
        (0, _runloop.run)(null, function () {
          var browserIsNotFocused = document.hasFocus && !document.hasFocus(); // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event

          el.focus(); // Firefox does not trigger the `focusin` event if the window
          // does not have focus. If the document does not have focus then
          // fire `focusin` event as well.

          if (browserIsNotFocused) {
            // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
            fireEvent(el, 'focus', {
              bubbles: false
            });
            fireEvent(el, 'focusin');
          }
        });
      }
    }
  }

  function fireEvent(element, type) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!element) {
      return;
    }

    var event;

    if (KEYBOARD_EVENT_TYPES.indexOf(type) > -1) {
      event = buildKeyboardEvent(type, options);
    } else if (MOUSE_EVENT_TYPES.indexOf(type) > -1) {
      var rect = element.getBoundingClientRect();
      var x = rect.left + 1;
      var y = rect.top + 1;
      var simulatedCoordinates = {
        screenX: x + 5,
        screenY: y + 95,
        clientX: x,
        clientY: y
      };
      event = buildMouseEvent(type, (0, _polyfills.assign)(simulatedCoordinates, options));
    } else {
      event = buildBasicEvent(type, options);
    }

    element.dispatchEvent(event);
  }

  function buildBasicEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var event = document.createEvent('Events'); // Event.bubbles is read only

    var bubbles = options.bubbles !== undefined ? options.bubbles : true;
    var cancelable = options.cancelable !== undefined ? options.cancelable : true;
    delete options.bubbles;
    delete options.cancelable;
    event.initEvent(type, bubbles, cancelable);
    (0, _polyfills.assign)(event, options);
    return event;
  }

  function buildMouseEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var event;

    try {
      event = document.createEvent('MouseEvents');
      var eventOpts = (0, _polyfills.assign)({}, DEFAULT_EVENT_OPTIONS, options);
      event.initMouseEvent(type, eventOpts.canBubble, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
    } catch (e) {
      event = buildBasicEvent(type, options);
    }

    return event;
  }

  function buildKeyboardEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var event;

    try {
      event = document.createEvent('KeyEvents');
      var eventOpts = (0, _polyfills.assign)({}, DEFAULT_EVENT_OPTIONS, options);
      event.initKeyEvent(type, eventOpts.canBubble, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
    } catch (e) {
      event = buildBasicEvent(type, options);
    }

    return event;
  }
});
enifed("ember-testing/lib/ext/application", ["@ember/application", "ember-testing/lib/setup_for_testing", "ember-testing/lib/test/helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/run", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/adapter"], function (_application, _setup_for_testing, _helpers, _promise, _run, _on_inject_helpers, _adapter) {
  "use strict";

  _application.default.reopen({
    /**
     This property contains the testing helpers for the current application. These
     are created once you call `injectTestHelpers` on your `Application`
     instance. The included helpers are also available on the `window` object by
     default, but can be used from this object on the individual application also.
       @property testHelpers
      @type {Object}
      @default {}
      @public
    */
    testHelpers: {},

    /**
     This property will contain the original methods that were registered
     on the `helperContainer` before `injectTestHelpers` is called.
      When `removeTestHelpers` is called, these methods are restored to the
     `helperContainer`.
       @property originalMethods
      @type {Object}
      @default {}
      @private
      @since 1.3.0
    */
    originalMethods: {},

    /**
    This property indicates whether or not this application is currently in
    testing mode. This is set when `setupForTesting` is called on the current
    application.
     @property testing
    @type {Boolean}
    @default false
    @since 1.3.0
    @public
    */
    testing: false,

    /**
      This hook defers the readiness of the application, so that you can start
      the app when your tests are ready to run. It also sets the router's
      location to 'none', so that the window's location will not be modified
      (preventing both accidental leaking of state between tests and interference
      with your testing framework). `setupForTesting` should only be called after
      setting a custom `router` class (for example `App.Router = Router.extend(`).
       Example:
       ```
      App.setupForTesting();
      ```
       @method setupForTesting
      @public
    */
    setupForTesting: function () {
      (0, _setup_for_testing.default)();
      this.testing = true;
      this.resolveRegistration('router:main').reopen({
        location: 'none'
      });
    },

    /**
      This will be used as the container to inject the test helpers into. By
      default the helpers are injected into `window`.
       @property helperContainer
      @type {Object} The object to be used for test helpers.
      @default window
      @since 1.2.0
      @private
    */
    helperContainer: null,

    /**
      This injects the test helpers into the `helperContainer` object. If an object is provided
      it will be used as the helperContainer. If `helperContainer` is not set it will default
      to `window`. If a function of the same name has already been defined it will be cached
      (so that it can be reset if the helper is removed with `unregisterHelper` or
      `removeTestHelpers`).
       Any callbacks registered with `onInjectHelpers` will be called once the
      helpers have been injected.
       Example:
      ```
      App.injectTestHelpers();
      ```
       @method injectTestHelpers
      @public
    */
    injectTestHelpers: function (helperContainer) {
      if (helperContainer) {
        this.helperContainer = helperContainer;
      } else {
        this.helperContainer = window;
      }

      this.reopen({
        willDestroy: function () {
          this._super.apply(this, arguments);

          this.removeTestHelpers();
        }
      });
      this.testHelpers = {};

      for (var name in _helpers.helpers) {
        this.originalMethods[name] = this.helperContainer[name];
        this.testHelpers[name] = this.helperContainer[name] = helper(this, name);
        protoWrap(_promise.default.prototype, name, helper(this, name), _helpers.helpers[name].meta.wait);
      }

      (0, _on_inject_helpers.invokeInjectHelpersCallbacks)(this);
    },

    /**
      This removes all helpers that have been registered, and resets and functions
      that were overridden by the helpers.
       Example:
       ```javascript
      App.removeTestHelpers();
      ```
       @public
      @method removeTestHelpers
    */
    removeTestHelpers: function () {
      if (!this.helperContainer) {
        return;
      }

      for (var name in _helpers.helpers) {
        this.helperContainer[name] = this.originalMethods[name];
        delete _promise.default.prototype[name];
        delete this.testHelpers[name];
        delete this.originalMethods[name];
      }
    }
  }); // This method is no longer needed
  // But still here for backwards compatibility
  // of helper chaining


  function protoWrap(proto, name, callback, isAsync) {
    proto[name] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (isAsync) {
        return callback.apply(this, args);
      } else {
        return this.then(function () {
          return callback.apply(this, args);
        });
      }
    };
  }

  function helper(app, name) {
    var fn = _helpers.helpers[name].method;
    var meta = _helpers.helpers[name].meta;

    if (!meta.wait) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return fn.apply(app, [app].concat(args));
      };
    }

    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var lastPromise = (0, _run.default)(function () {
        return (0, _promise.resolve)((0, _promise.getLastPromise)());
      }); // wait for last helper's promise to resolve and then
      // execute. To be safe, we need to tell the adapter we're going
      // asynchronous here, because fn may not be invoked before we
      // return.

      (0, _adapter.asyncStart)();
      return lastPromise.then(function () {
        return fn.apply(app, [app].concat(args));
      }).finally(_adapter.asyncEnd);
    };
  }
});
enifed("ember-testing/lib/ext/rsvp", ["exports", "@ember/-internals/runtime", "@ember/runloop", "@ember/debug", "ember-testing/lib/test/adapter"], function (_exports, _runtime, _runloop, _debug, _adapter) {
  "use strict";

  _exports.default = void 0;

  _runtime.RSVP.configure('async', function (callback, promise) {
    // if schedule will cause autorun, we need to inform adapter
    if ((0, _debug.isTesting)() && !_runloop.backburner.currentInstance) {
      (0, _adapter.asyncStart)();

      _runloop.backburner.schedule('actions', function () {
        (0, _adapter.asyncEnd)();
        callback(promise);
      });
    } else {
      _runloop.backburner.schedule('actions', function () {
        return callback(promise);
      });
    }
  });

  var _default = _runtime.RSVP;
  _exports.default = _default;
});
enifed("ember-testing/lib/helpers", ["ember-testing/lib/test/helpers", "ember-testing/lib/helpers/and_then", "ember-testing/lib/helpers/click", "ember-testing/lib/helpers/current_path", "ember-testing/lib/helpers/current_route_name", "ember-testing/lib/helpers/current_url", "ember-testing/lib/helpers/fill_in", "ember-testing/lib/helpers/find", "ember-testing/lib/helpers/find_with_assert", "ember-testing/lib/helpers/key_event", "ember-testing/lib/helpers/pause_test", "ember-testing/lib/helpers/trigger_event", "ember-testing/lib/helpers/visit", "ember-testing/lib/helpers/wait"], function (_helpers, _and_then, _click, _current_path, _current_route_name, _current_url, _fill_in, _find, _find_with_assert, _key_event, _pause_test, _trigger_event, _visit, _wait) {
  "use strict";

  (0, _helpers.registerAsyncHelper)('visit', _visit.default);
  (0, _helpers.registerAsyncHelper)('click', _click.default);
  (0, _helpers.registerAsyncHelper)('keyEvent', _key_event.default);
  (0, _helpers.registerAsyncHelper)('fillIn', _fill_in.default);
  (0, _helpers.registerAsyncHelper)('wait', _wait.default);
  (0, _helpers.registerAsyncHelper)('andThen', _and_then.default);
  (0, _helpers.registerAsyncHelper)('pauseTest', _pause_test.pauseTest);
  (0, _helpers.registerAsyncHelper)('triggerEvent', _trigger_event.default);
  (0, _helpers.registerHelper)('find', _find.default);
  (0, _helpers.registerHelper)('findWithAssert', _find_with_assert.default);
  (0, _helpers.registerHelper)('currentRouteName', _current_route_name.default);
  (0, _helpers.registerHelper)('currentPath', _current_path.default);
  (0, _helpers.registerHelper)('currentURL', _current_url.default);
  (0, _helpers.registerHelper)('resumeTest', _pause_test.resumeTest);
});
enifed("ember-testing/lib/helpers/-is-form-control", ["exports"], function (_exports) {
  "use strict";

  _exports.default = isFormControl;
  var FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is a form control, `false` otherwise
  */

  function isFormControl(element) {
    var tagName = element.tagName,
        type = element.type;

    if (type === 'hidden') {
      return false;
    }

    return FORM_CONTROL_TAGS.indexOf(tagName) > -1;
  }
});
enifed("ember-testing/lib/helpers/and_then", ["exports"], function (_exports) {
  "use strict";

  _exports.default = andThen;

  function andThen(app, callback) {
    return app.testHelpers.wait(callback(app));
  }
});
enifed("ember-testing/lib/helpers/click", ["exports", "ember-testing/lib/events"], function (_exports, _events) {
  "use strict";

  _exports.default = click;

  /**
  @module ember
  */

  /**
    Clicks an element and triggers any actions triggered by the element's `click`
    event.
  
    Example:
  
    ```javascript
    click('.some-jQuery-selector').then(function() {
      // assert something
    });
    ```
  
    @method click
    @param {String} selector jQuery selector for finding element on the DOM
    @param {Object} context A DOM Element, Document, or jQuery to use as context
    @return {RSVP.Promise<undefined>}
    @public
  */
  function click(app, selector, context) {
    var $el = app.testHelpers.findWithAssert(selector, context);
    var el = $el[0];
    (0, _events.fireEvent)(el, 'mousedown');
    (0, _events.focus)(el);
    (0, _events.fireEvent)(el, 'mouseup');
    (0, _events.fireEvent)(el, 'click');
    return app.testHelpers.wait();
  }
});
enifed("ember-testing/lib/helpers/current_path", ["exports", "@ember/-internals/metal"], function (_exports, _metal) {
  "use strict";

  _exports.default = currentPath;

  /**
  @module ember
  */

  /**
    Returns the current path.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentPath(), 'some.path.index', "correct path was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentPath
  @return {Object} The currently active path.
  @since 1.5.0
  @public
  */
  function currentPath(app) {
    var routingService = app.__container__.lookup('service:-routing');

    return (0, _metal.get)(routingService, 'currentPath');
  }
});
enifed("ember-testing/lib/helpers/current_route_name", ["exports", "@ember/-internals/metal"], function (_exports, _metal) {
  "use strict";

  _exports.default = currentRouteName;

  /**
  @module ember
  */

  /**
    Returns the currently active route name.
  
  Example:
  
  ```javascript
  function validateRouteName() {
    equal(currentRouteName(), 'some.path', "correct route was transitioned into.");
  }
  visit('/some/path').then(validateRouteName)
  ```
  
  @method currentRouteName
  @return {Object} The name of the currently active route.
  @since 1.5.0
  @public
  */
  function currentRouteName(app) {
    var routingService = app.__container__.lookup('service:-routing');

    return (0, _metal.get)(routingService, 'currentRouteName');
  }
});
enifed("ember-testing/lib/helpers/current_url", ["exports", "@ember/-internals/metal"], function (_exports, _metal) {
  "use strict";

  _exports.default = currentURL;

  /**
  @module ember
  */

  /**
    Returns the current URL.
  
  Example:
  
  ```javascript
  function validateURL() {
    equal(currentURL(), '/some/path', "correct URL was transitioned into.");
  }
  
  click('#some-link-id').then(validateURL);
  ```
  
  @method currentURL
  @return {Object} The currently active URL.
  @since 1.5.0
  @public
  */
  function currentURL(app) {
    var router = app.__container__.lookup('router:main');

    return (0, _metal.get)(router, 'location').getURL();
  }
});
enifed("ember-testing/lib/helpers/fill_in", ["exports", "ember-testing/lib/events", "ember-testing/lib/helpers/-is-form-control"], function (_exports, _events, _isFormControl) {
  "use strict";

  _exports.default = fillIn;

  /**
  @module ember
  */

  /**
    Fills in an input element with some text.
  
    Example:
  
    ```javascript
    fillIn('#email', 'you@example.com').then(function() {
      // assert something
    });
    ```
  
    @method fillIn
    @param {String} selector jQuery selector finding an input element on the DOM
    to fill text with
    @param {String} text text to place inside the input element
    @return {RSVP.Promise<undefined>}
    @public
  */
  function fillIn(app, selector, contextOrText, text) {
    var $el, el, context;

    if (text === undefined) {
      text = contextOrText;
    } else {
      context = contextOrText;
    }

    $el = app.testHelpers.findWithAssert(selector, context);
    el = $el[0];
    (0, _events.focus)(el);

    if ((0, _isFormControl.default)(el)) {
      el.value = text;
    } else {
      el.innerHTML = text;
    }

    (0, _events.fireEvent)(el, 'input');
    (0, _events.fireEvent)(el, 'change');
    return app.testHelpers.wait();
  }
});
enifed("ember-testing/lib/helpers/find", ["exports", "@ember/-internals/metal", "@ember/debug", "@ember/-internals/views"], function (_exports, _metal, _debug, _views) {
  "use strict";

  _exports.default = find;

  /**
  @module ember
  */

  /**
    Finds an element in the context of the app's container element. A simple alias
    for `app.$(selector)`.
  
    Example:
  
    ```javascript
    var $el = find('.my-selector');
    ```
  
    With the `context` param:
  
    ```javascript
    var $el = find('.my-selector', '.parent-element-class');
    ```
  
    @method find
    @param {String} selector jQuery selector for element lookup
    @param {String} [context] (optional) jQuery selector that will limit the selector
                              argument to find only within the context's children
    @return {Object} DOM element representing the results of the query
    @public
  */
  function find(app, selector, context) {
    if (_views.jQueryDisabled) {
      true && !false && (0, _debug.assert)('If jQuery is disabled, please import and use helpers from @ember/test-helpers [https://github.com/emberjs/ember-test-helpers]. Note: `find` is not an available helper.');
    }

    var $el;
    context = context || (0, _metal.get)(app, 'rootElement');
    $el = app.$(selector, context);
    return $el;
  }
});
enifed("ember-testing/lib/helpers/find_with_assert", ["exports"], function (_exports) {
  "use strict";

  _exports.default = findWithAssert;

  /**
  @module ember
  */

  /**
    Like `find`, but throws an error if the element selector returns no results.
  
    Example:
  
    ```javascript
    var $el = findWithAssert('.doesnt-exist'); // throws error
    ```
  
    With the `context` param:
  
    ```javascript
    var $el = findWithAssert('.selector-id', '.parent-element-class'); // assert will pass
    ```
  
    @method findWithAssert
    @param {String} selector jQuery selector string for finding an element within
    the DOM
    @param {String} [context] (optional) jQuery selector that will limit the
    selector argument to find only within the context's children
    @return {Object} jQuery object representing the results of the query
    @throws {Error} throws error if object returned has a length of 0
    @public
  */
  function findWithAssert(app, selector, context) {
    var $el = app.testHelpers.find(selector, context);

    if ($el.length === 0) {
      throw new Error('Element ' + selector + ' not found.');
    }

    return $el;
  }
});
enifed("ember-testing/lib/helpers/key_event", ["exports"], function (_exports) {
  "use strict";

  _exports.default = keyEvent;

  /**
  @module ember
  */

  /**
    Simulates a key event, e.g. `keypress`, `keydown`, `keyup` with the desired keyCode
    Example:
    ```javascript
    keyEvent('.some-jQuery-selector', 'keypress', 13).then(function() {
     // assert something
    });
    ```
    @method keyEvent
    @param {String} selector jQuery selector for finding element on the DOM
    @param {String} type the type of key event, e.g. `keypress`, `keydown`, `keyup`
    @param {Number} keyCode the keyCode of the simulated key event
    @return {RSVP.Promise<undefined>}
    @since 1.5.0
    @public
  */
  function keyEvent(app, selector, contextOrType, typeOrKeyCode, keyCode) {
    var context, type;

    if (keyCode === undefined) {
      context = null;
      keyCode = typeOrKeyCode;
      type = contextOrType;
    } else {
      context = contextOrType;
      type = typeOrKeyCode;
    }

    return app.testHelpers.triggerEvent(selector, context, type, {
      keyCode: keyCode,
      which: keyCode
    });
  }
});
enifed("ember-testing/lib/helpers/pause_test", ["exports", "@ember/-internals/runtime", "@ember/debug"], function (_exports, _runtime, _debug) {
  "use strict";

  _exports.resumeTest = resumeTest;
  _exports.pauseTest = pauseTest;

  /**
  @module ember
  */
  var resume;
  /**
   Resumes a test paused by `pauseTest`.
  
   @method resumeTest
   @return {void}
   @public
  */

  function resumeTest() {
    true && !resume && (0, _debug.assert)('Testing has not been paused. There is nothing to resume.', resume);
    resume();
    resume = undefined;
  }
  /**
   Pauses the current test - this is useful for debugging while testing or for test-driving.
   It allows you to inspect the state of your application at any point.
   Example (The test will pause before clicking the button):
  
   ```javascript
   visit('/')
   return pauseTest();
   click('.btn');
   ```
  
   You may want to turn off the timeout before pausing.
  
   qunit (timeout available to use as of 2.4.0):
  
   ```
   visit('/');
   assert.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
   mocha (timeout happens automatically as of ember-mocha v0.14.0):
  
   ```
   visit('/');
   this.timeout(0);
   return pauseTest();
   click('.btn');
   ```
  
  
   @since 1.9.0
   @method pauseTest
   @return {Object} A promise that will never resolve
   @public
  */


  function pauseTest() {
    (0, _debug.info)('Testing paused. Use `resumeTest()` to continue.');
    return new _runtime.RSVP.Promise(function (resolve) {
      resume = resolve;
    }, 'TestAdapter paused promise');
  }
});
enifed("ember-testing/lib/helpers/trigger_event", ["exports", "ember-testing/lib/events"], function (_exports, _events) {
  "use strict";

  _exports.default = triggerEvent;

  /**
  @module ember
  */

  /**
    Triggers the given DOM event on the element identified by the provided selector.
    Example:
    ```javascript
    triggerEvent('#some-elem-id', 'blur');
    ```
    This is actually used internally by the `keyEvent` helper like so:
    ```javascript
    triggerEvent('#some-elem-id', 'keypress', { keyCode: 13 });
    ```
   @method triggerEvent
   @param {String} selector jQuery selector for finding element on the DOM
   @param {String} [context] jQuery selector that will limit the selector
                             argument to find only within the context's children
   @param {String} type The event type to be triggered.
   @param {Object} [options] The options to be passed to jQuery.Event.
   @return {RSVP.Promise<undefined>}
   @since 1.5.0
   @public
  */
  function triggerEvent(app, selector, contextOrType, typeOrOptions, possibleOptions) {
    var arity = arguments.length;
    var context, type, options;

    if (arity === 3) {
      // context and options are optional, so this is
      // app, selector, type
      context = null;
      type = contextOrType;
      options = {};
    } else if (arity === 4) {
      // context and options are optional, so this is
      if (typeof typeOrOptions === 'object') {
        // either
        // app, selector, type, options
        context = null;
        type = contextOrType;
        options = typeOrOptions;
      } else {
        // or
        // app, selector, context, type
        context = contextOrType;
        type = typeOrOptions;
        options = {};
      }
    } else {
      context = contextOrType;
      type = typeOrOptions;
      options = possibleOptions;
    }

    var $el = app.testHelpers.findWithAssert(selector, context);
    var el = $el[0];
    (0, _events.fireEvent)(el, type, options);
    return app.testHelpers.wait();
  }
});
enifed("ember-testing/lib/helpers/visit", ["exports", "@ember/runloop"], function (_exports, _runloop) {
  "use strict";

  _exports.default = visit;

  /**
    Loads a route, sets up any controllers, and renders any templates associated
    with the route as though a real user had triggered the route change while
    using your app.
  
    Example:
  
    ```javascript
    visit('posts/index').then(function() {
      // assert something
    });
    ```
  
    @method visit
    @param {String} url the name of the route
    @return {RSVP.Promise<undefined>}
    @public
  */
  function visit(app, url) {
    var router = app.__container__.lookup('router:main');

    var shouldHandleURL = false;
    app.boot().then(function () {
      router.location.setURL(url);

      if (shouldHandleURL) {
        (0, _runloop.run)(app.__deprecatedInstance__, 'handleURL', url);
      }
    });

    if (app._readinessDeferrals > 0) {
      router.initialURL = url;
      (0, _runloop.run)(app, 'advanceReadiness');
      delete router.initialURL;
    } else {
      shouldHandleURL = true;
    }

    return app.testHelpers.wait();
  }
});
enifed("ember-testing/lib/helpers/wait", ["exports", "ember-testing/lib/test/waiters", "@ember/-internals/runtime", "@ember/runloop", "ember-testing/lib/test/pending_requests"], function (_exports, _waiters, _runtime, _runloop, _pending_requests) {
  "use strict";

  _exports.default = wait;

  /**
  @module ember
  */

  /**
    Causes the run loop to process any pending events. This is used to ensure that
    any async operations from other helpers (or your assertions) have been processed.
  
    This is most often used as the return value for the helper functions (see 'click',
    'fillIn','visit',etc). However, there is a method to register a test helper which
    utilizes this method without the need to actually call `wait()` in your helpers.
  
    The `wait` helper is built into `registerAsyncHelper` by default. You will not need
    to `return app.testHelpers.wait();` - the wait behavior is provided for you.
  
    Example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('loginUser', function(app, username, password) {
      visit('secured/path/here')
        .fillIn('#username', username)
        .fillIn('#password', password)
        .click('.submit');
    });
    ```
  
    @method wait
    @param {Object} value The value to be returned.
    @return {RSVP.Promise<any>} Promise that resolves to the passed value.
    @public
    @since 1.0.0
  */
  function wait(app, value) {
    return new _runtime.RSVP.Promise(function (resolve) {
      var router = app.__container__.lookup('router:main'); // Every 10ms, poll for the async thing to have finished


      var watcher = setInterval(function () {
        // 1. If the router is loading, keep polling
        var routerIsLoading = router._routerMicrolib && Boolean(router._routerMicrolib.activeTransition);

        if (routerIsLoading) {
          return;
        } // 2. If there are pending Ajax requests, keep polling


        if ((0, _pending_requests.pendingRequests)()) {
          return;
        } // 3. If there are scheduled timers or we are inside of a run loop, keep polling


        if ((0, _runloop.hasScheduledTimers)() || (0, _runloop.getCurrentRunLoop)()) {
          return;
        }

        if ((0, _waiters.checkWaiters)()) {
          return;
        } // Stop polling


        clearInterval(watcher); // Synchronously resolve the promise

        (0, _runloop.run)(null, resolve, value);
      }, 10);
    });
  }
});
enifed("ember-testing/lib/initializers", ["@ember/application"], function (_application) {
  "use strict";

  var name = 'deferReadiness in `testing` mode';
  (0, _application.onLoad)('Ember.Application', function (Application) {
    if (!Application.initializers[name]) {
      Application.initializer({
        name: name,
        initialize: function (application) {
          if (application.testing) {
            application.deferReadiness();
          }
        }
      });
    }
  });
});
enifed("ember-testing/lib/setup_for_testing", ["exports", "@ember/debug", "@ember/-internals/views", "ember-testing/lib/test/adapter", "ember-testing/lib/test/pending_requests", "ember-testing/lib/adapters/adapter", "ember-testing/lib/adapters/qunit"], function (_exports, _debug, _views, _adapter, _pending_requests, _adapter2, _qunit) {
  "use strict";

  _exports.default = setupForTesting;

  /* global self */

  /**
    Sets Ember up for testing. This is useful to perform
    basic setup steps in order to unit test.
  
    Use `App.setupForTesting` to perform integration tests (full
    application testing).
  
    @method setupForTesting
    @namespace Ember
    @since 1.5.0
    @private
  */
  function setupForTesting() {
    (0, _debug.setTesting)(true);
    var adapter = (0, _adapter.getAdapter)(); // if adapter is not manually set default to QUnit

    if (!adapter) {
      (0, _adapter.setAdapter)(typeof self.QUnit === 'undefined' ? _adapter2.default.create() : _qunit.default.create());
    }

    if (!_views.jQueryDisabled) {
      (0, _views.jQuery)(document).off('ajaxSend', _pending_requests.incrementPendingRequests);
      (0, _views.jQuery)(document).off('ajaxComplete', _pending_requests.decrementPendingRequests);
      (0, _pending_requests.clearPendingRequests)();
      (0, _views.jQuery)(document).on('ajaxSend', _pending_requests.incrementPendingRequests);
      (0, _views.jQuery)(document).on('ajaxComplete', _pending_requests.decrementPendingRequests);
    }
  }
});
enifed("ember-testing/lib/support", ["@ember/debug", "@ember/-internals/views", "@ember/-internals/browser-environment"], function (_debug, _views, _browserEnvironment) {
  "use strict";

  /**
    @module ember
  */
  var $ = _views.jQuery;
  /**
    This method creates a checkbox and triggers the click event to fire the
    passed in handler. It is used to correct for a bug in older versions
    of jQuery (e.g 1.8.3).
  
    @private
    @method testCheckboxClick
  */

  function testCheckboxClick(handler) {
    var input = document.createElement('input');
    $(input).attr('type', 'checkbox').css({
      position: 'absolute',
      left: '-1000px',
      top: '-1000px'
    }).appendTo('body').on('click', handler).trigger('click').remove();
  }

  if (_browserEnvironment.hasDOM && !_views.jQueryDisabled) {
    $(function () {
      /*
        Determine whether a checkbox checked using jQuery's "click" method will have
        the correct value for its checked property.
         If we determine that the current jQuery version exhibits this behavior,
        patch it to work correctly as in the commit for the actual fix:
        https://github.com/jquery/jquery/commit/1fb2f92.
      */
      testCheckboxClick(function () {
        if (!this.checked && !$.event.special.click) {
          $.event.special.click = {
            // For checkbox, fire native event so checked state will be right
            trigger: function () {
              if (this.nodeName === 'INPUT' && this.type === 'checkbox' && this.click) {
                this.click();
                return false;
              }
            }
          };
        }
      }); // Try again to verify that the patch took effect or blow up.

      testCheckboxClick(function () {
        true && (0, _debug.warn)("clicked checkboxes should be checked! the jQuery patch didn't work", this.checked, {
          id: 'ember-testing.test-checkbox-click'
        });
      });
    });
  }
});
enifed("ember-testing/lib/test", ["exports", "ember-testing/lib/test/helpers", "ember-testing/lib/test/on_inject_helpers", "ember-testing/lib/test/promise", "ember-testing/lib/test/waiters", "ember-testing/lib/test/adapter"], function (_exports, _helpers, _on_inject_helpers, _promise, _waiters, _adapter) {
  "use strict";

  _exports.default = void 0;

  /**
    @module ember
  */

  /**
    This is a container for an assortment of testing related functionality:
  
    * Choose your default test adapter (for your framework of choice).
    * Register/Unregister additional test helpers.
    * Setup callbacks to be fired when the test helpers are injected into
      your application.
  
    @class Test
    @namespace Ember
    @public
  */
  var Test = {
    /**
      Hash containing all known test helpers.
       @property _helpers
      @private
      @since 1.7.0
    */
    _helpers: _helpers.helpers,
    registerHelper: _helpers.registerHelper,
    registerAsyncHelper: _helpers.registerAsyncHelper,
    unregisterHelper: _helpers.unregisterHelper,
    onInjectHelpers: _on_inject_helpers.onInjectHelpers,
    Promise: _promise.default,
    promise: _promise.promise,
    resolve: _promise.resolve,
    registerWaiter: _waiters.registerWaiter,
    unregisterWaiter: _waiters.unregisterWaiter,
    checkWaiters: _waiters.checkWaiters
  };
  /**
   Used to allow ember-testing to communicate with a specific testing
   framework.
  
   You can manually set it before calling `App.setupForTesting()`.
  
   Example:
  
   ```javascript
   Ember.Test.adapter = MyCustomAdapter.create()
   ```
  
   If you do not set it, ember-testing will default to `Ember.Test.QUnitAdapter`.
  
   @public
   @for Ember.Test
   @property adapter
   @type {Class} The adapter to be used.
   @default Ember.Test.QUnitAdapter
  */

  Object.defineProperty(Test, 'adapter', {
    get: _adapter.getAdapter,
    set: _adapter.setAdapter
  });
  var _default = Test;
  _exports.default = _default;
});
enifed("ember-testing/lib/test/adapter", ["exports", "@ember/-internals/error-handling"], function (_exports, _errorHandling) {
  "use strict";

  _exports.getAdapter = getAdapter;
  _exports.setAdapter = setAdapter;
  _exports.asyncStart = asyncStart;
  _exports.asyncEnd = asyncEnd;
  var adapter;

  function getAdapter() {
    return adapter;
  }

  function setAdapter(value) {
    adapter = value;

    if (value && typeof value.exception === 'function') {
      (0, _errorHandling.setDispatchOverride)(adapterDispatch);
    } else {
      (0, _errorHandling.setDispatchOverride)(null);
    }
  }

  function asyncStart() {
    if (adapter) {
      adapter.asyncStart();
    }
  }

  function asyncEnd() {
    if (adapter) {
      adapter.asyncEnd();
    }
  }

  function adapterDispatch(error) {
    adapter.exception(error);
    console.error(error.stack); // eslint-disable-line no-console
  }
});
enifed("ember-testing/lib/test/helpers", ["exports", "ember-testing/lib/test/promise"], function (_exports, _promise) {
  "use strict";

  _exports.registerHelper = registerHelper;
  _exports.registerAsyncHelper = registerAsyncHelper;
  _exports.unregisterHelper = unregisterHelper;
  _exports.helpers = void 0;
  var helpers = {};
  /**
   @module @ember/test
  */

  /**
    `registerHelper` is used to register a test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    This helper can later be called without arguments because it will be
    called with `app` as the first parameter.
  
    ```javascript
    import Application from '@ember/application';
  
    App = Application.create();
    App.injectTestHelpers();
    boot();
    ```
  
    @public
    @for @ember/test
    @static
    @method registerHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @param options {Object}
  */

  _exports.helpers = helpers;

  function registerHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: false
      }
    };
  }
  /**
    `registerAsyncHelper` is used to register an async test helper that will be injected
    when `App.injectTestHelpers` is called.
  
    The helper method will always be called with the current Application as
    the first parameter.
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
    import { run } from '@ember/runloop';
  
    registerAsyncHelper('boot', function(app) {
      run(app, app.advanceReadiness);
    });
    ```
  
    The advantage of an async helper is that it will not run
    until the last async helper has completed.  All async helpers
    after it will wait for it complete before running.
  
  
    For example:
  
    ```javascript
    import { registerAsyncHelper } from '@ember/test';
  
    registerAsyncHelper('deletePost', function(app, postId) {
      click('.delete-' + postId);
    });
  
    // ... in your test
    visit('/post/2');
    deletePost(2);
    visit('/post/3');
    deletePost(3);
    ```
  
    @public
    @for @ember/test
    @method registerAsyncHelper
    @param {String} name The name of the helper method to add.
    @param {Function} helperMethod
    @since 1.2.0
  */


  function registerAsyncHelper(name, helperMethod) {
    helpers[name] = {
      method: helperMethod,
      meta: {
        wait: true
      }
    };
  }
  /**
    Remove a previously added helper method.
  
    Example:
  
    ```javascript
    import { unregisterHelper } from '@ember/test';
  
    unregisterHelper('wait');
    ```
  
    @public
    @method unregisterHelper
    @static
    @for @ember/test
    @param {String} name The helper to remove.
  */


  function unregisterHelper(name) {
    delete helpers[name];
    delete _promise.default.prototype[name];
  }
});
enifed("ember-testing/lib/test/on_inject_helpers", ["exports"], function (_exports) {
  "use strict";

  _exports.onInjectHelpers = onInjectHelpers;
  _exports.invokeInjectHelpersCallbacks = invokeInjectHelpersCallbacks;
  _exports.callbacks = void 0;
  var callbacks = [];
  /**
    Used to register callbacks to be fired whenever `App.injectTestHelpers`
    is called.
  
    The callback will receive the current application as an argument.
  
    Example:
  
    ```javascript
    import $ from 'jquery';
  
    Ember.Test.onInjectHelpers(function() {
      $(document).ajaxSend(function() {
        Test.pendingRequests++;
      });
  
      $(document).ajaxComplete(function() {
        Test.pendingRequests--;
      });
    });
    ```
  
    @public
    @for Ember.Test
    @method onInjectHelpers
    @param {Function} callback The function to be called.
  */

  _exports.callbacks = callbacks;

  function onInjectHelpers(callback) {
    callbacks.push(callback);
  }

  function invokeInjectHelpersCallbacks(app) {
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](app);
    }
  }
});
enifed("ember-testing/lib/test/pending_requests", ["exports"], function (_exports) {
  "use strict";

  _exports.pendingRequests = pendingRequests;
  _exports.clearPendingRequests = clearPendingRequests;
  _exports.incrementPendingRequests = incrementPendingRequests;
  _exports.decrementPendingRequests = decrementPendingRequests;
  var requests = [];

  function pendingRequests() {
    return requests.length;
  }

  function clearPendingRequests() {
    requests.length = 0;
  }

  function incrementPendingRequests(_, xhr) {
    requests.push(xhr);
  }

  function decrementPendingRequests(_, xhr) {
    setTimeout(function () {
      for (var i = 0; i < requests.length; i++) {
        if (xhr === requests[i]) {
          requests.splice(i, 1);
          break;
        }
      }
    }, 0);
  }
});
enifed("ember-testing/lib/test/promise", ["exports", "ember-babel", "@ember/-internals/runtime", "ember-testing/lib/test/run"], function (_exports, _emberBabel, _runtime, _run) {
  "use strict";

  _exports.promise = promise;
  _exports.resolve = resolve;
  _exports.getLastPromise = getLastPromise;
  _exports.default = void 0;
  var lastPromise;

  var TestPromise =
  /*#__PURE__*/
  function (_RSVP$Promise) {
    (0, _emberBabel.inheritsLoose)(TestPromise, _RSVP$Promise);

    function TestPromise() {
      var _this;

      _this = _RSVP$Promise.apply(this, arguments) || this;
      lastPromise = (0, _emberBabel.assertThisInitialized)(_this);
      return _this;
    }

    var _proto = TestPromise.prototype;

    _proto.then = function then(_onFulfillment) {
      var _RSVP$Promise$prototy;

      var onFulfillment = typeof _onFulfillment === 'function' ? function (result) {
        return isolate(_onFulfillment, result);
      } : undefined;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_RSVP$Promise$prototy = _RSVP$Promise.prototype.then).call.apply(_RSVP$Promise$prototy, [this, onFulfillment].concat(args));
    };

    return TestPromise;
  }(_runtime.RSVP.Promise);
  /**
    This returns a thenable tailored for testing.  It catches failed
    `onSuccess` callbacks and invokes the `Ember.Test.adapter.exception`
    callback in the last chained then.
  
    This method should be returned by async helpers such as `wait`.
  
    @public
    @for Ember.Test
    @method promise
    @param {Function} resolver The function used to resolve the promise.
    @param {String} label An optional string for identifying the promise.
  */


  _exports.default = TestPromise;

  function promise(resolver, label) {
    var fullLabel = "Ember.Test.promise: " + (label || '<Unknown Promise>');
    return new TestPromise(resolver, fullLabel);
  }
  /**
    Replacement for `Ember.RSVP.resolve`
    The only difference is this uses
    an instance of `Ember.Test.Promise`
  
    @public
    @for Ember.Test
    @method resolve
    @param {Mixed} The value to resolve
    @since 1.2.0
  */


  function resolve(result, label) {
    return TestPromise.resolve(result, label);
  }

  function getLastPromise() {
    return lastPromise;
  } // This method isolates nested async methods
  // so that they don't conflict with other last promises.
  //
  // 1. Set `Ember.Test.lastPromise` to null
  // 2. Invoke method
  // 3. Return the last promise created during method


  function isolate(onFulfillment, result) {
    // Reset lastPromise for nested helpers
    lastPromise = null;
    var value = onFulfillment(result);
    var promise = lastPromise;
    lastPromise = null; // If the method returned a promise
    // return that promise. If not,
    // return the last async helper's promise

    if (value && value instanceof TestPromise || !promise) {
      return value;
    } else {
      return (0, _run.default)(function () {
        return resolve(promise).then(function () {
          return value;
        });
      });
    }
  }
});
enifed("ember-testing/lib/test/run", ["exports", "@ember/runloop"], function (_exports, _runloop) {
  "use strict";

  _exports.default = run;

  function run(fn) {
    if (!(0, _runloop.getCurrentRunLoop)()) {
      return (0, _runloop.run)(fn);
    } else {
      return fn();
    }
  }
});
enifed("ember-testing/lib/test/waiters", ["exports"], function (_exports) {
  "use strict";

  _exports.registerWaiter = registerWaiter;
  _exports.unregisterWaiter = unregisterWaiter;
  _exports.checkWaiters = checkWaiters;

  /**
   @module @ember/test
  */
  var contexts = [];
  var callbacks = [];
  /**
     This allows ember-testing to play nicely with other asynchronous
     events, such as an application that is waiting for a CSS3
     transition or an IndexDB transaction. The waiter runs periodically
     after each async helper (i.e. `click`, `andThen`, `visit`, etc) has executed,
     until the returning result is truthy. After the waiters finish, the next async helper
     is executed and the process repeats.
  
     For example:
  
     ```javascript
     import { registerWaiter } from '@ember/test';
  
     registerWaiter(function() {
       return myPendingTransactions() === 0;
     });
     ```
     The `context` argument allows you to optionally specify the `this`
     with which your callback will be invoked.
  
     For example:
  
     ```javascript
     import { registerWaiter } from '@ember/test';
  
     registerWaiter(MyDB, MyDB.hasPendingTransactions);
     ```
  
     @public
     @for @ember/test
     @static
     @method registerWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */

  function registerWaiter(context, callback) {
    if (arguments.length === 1) {
      callback = context;
      context = null;
    }

    if (indexOf(context, callback) > -1) {
      return;
    }

    contexts.push(context);
    callbacks.push(callback);
  }
  /**
     `unregisterWaiter` is used to unregister a callback that was
     registered with `registerWaiter`.
  
     @public
     @for @ember/test
     @static
     @method unregisterWaiter
     @param {Object} context (optional)
     @param {Function} callback
     @since 1.2.0
  */


  function unregisterWaiter(context, callback) {
    if (!callbacks.length) {
      return;
    }

    if (arguments.length === 1) {
      callback = context;
      context = null;
    }

    var i = indexOf(context, callback);

    if (i === -1) {
      return;
    }

    contexts.splice(i, 1);
    callbacks.splice(i, 1);
  }
  /**
    Iterates through each registered test waiter, and invokes
    its callback. If any waiter returns false, this method will return
    true indicating that the waiters have not settled yet.
  
    This is generally used internally from the acceptance/integration test
    infrastructure.
  
    @public
    @for @ember/test
    @static
    @method checkWaiters
  */


  function checkWaiters() {
    if (!callbacks.length) {
      return false;
    }

    for (var i = 0; i < callbacks.length; i++) {
      var context = contexts[i];
      var callback = callbacks[i];

      if (!callback.call(context)) {
        return true;
      }
    }

    return false;
  }

  function indexOf(context, callback) {
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === callback && contexts[i] === context) {
        return i;
      }
    }

    return -1;
  }
});
/*global enifed, module */
enifed('node-module', ['exports'], function(_exports) {
  var IS_NODE = typeof module === 'object' && typeof module.require === 'function';
  if (IS_NODE) {
    _exports.require = module.require;
    _exports.module = module;
    _exports.IS_NODE = IS_NODE;
  } else {
    _exports.require = null;
    _exports.module = null;
    _exports.IS_NODE = IS_NODE;
  }
});

var testing = requireModule('ember-testing');
Ember.Test = testing.Test;
Ember.Test.Adapter = testing.Adapter;
Ember.Test.QUnitAdapter = testing.QUnitAdapter;
Ember.setupForTesting = testing.setupForTesting;

}());

!function() {
  function merge() {
    var target = arguments[0];
    var sources = Array.prototype.slice.call(arguments, 1);
    var source;

    for(var i = 0; i < sources.length; i++) {
      source = sources[i];

      if (!source) {
        continue;
      }

      for(var attr in source) {
        if (typeof source[attr] !== 'undefined') {
          target[attr] = source[attr];
        }
      }
    }

    return target;
  }

  /**
   * Extends typeof to add the type 'descriptor'
   *
   */
  function typeOf(item) {
    if (item && item.isDescriptor) {
      return 'descriptor';
    }

    if (item === null) {
      return 'null';
    }

    return typeof(item);
  }

  function defineProperty(target, keyName, value, getter) {
    var options = {
      configurable: true,
      enumerable: true,
    };

    if (typeOf(getter) !== 'undefined') {
      options.get = getter;
    } else {
      options.writable = false;
      options.value = value;
    }

    Object.defineProperty(target, keyName, options);
  }

  /**
   * Default `Descriptor` builder
   *
   * @param {TreeNode} node - parent node
   * @param {String} blueprintKey - key to build
   * @param {Descriptor} descriptor - descriptor to build
   * @param {Function} defaultBuilder - default function to build this type of node
   *
   * @return undefined
   */
  function buildDescriptor(node, blueprintKey, descriptor /*, descriptorBuilder*/) {
    if (typeof descriptor.setup === 'function') {
      descriptor.setup(node, blueprintKey);
    }

    if (descriptor.value) {
      defineProperty(node, blueprintKey, descriptor.value);
    } else {
      defineProperty(node, blueprintKey, undefined, function() {
        return descriptor.get.call(this, blueprintKey);
      });
    }
  }

  /**
   * Default `Object` builder
   *
   * @param {TreeNode} node - parent node
   * @param {String} blueprintKey - key to build
   * @param {Object} blueprint - blueprint to build
   * @param {Function} defaultBuilder - default function to build this type of node
   *
   * @return {Array} [node, blueprint] to build
   */
  function buildObject(node, blueprintKey, blueprint /*, defaultBuilder*/) {
    var value = {};

    // Create child component
    defineProperty(node, blueprintKey, value);

    // Set meta to object
    setMeta(value, blueprintKey);

    return [value, blueprint];
  }

  /**
   * Default builder
   *
   * @param {TreeNode} node - parent node
   * @param {String} blueprintKey - key to build
   * @param {Any} value - value to build
   * @param {Function} defaultBuilder - default function to build this type of node
   *
   * @return undefined
   */
  function buildDefault(node, blueprintKey, value /*, defaultBuilder*/) {
    defineProperty(node, blueprintKey, value);
  }

  function setParent(target, parentTree) {
    // We want to delete the parent node if we set null or undefine. Also, this
    // workarounds an issue in phantomjs where we cannot use defineProperty to
    // redefine a property.
    // See. https://github.com/ariya/phantomjs/issues/11856
    delete target['__parentTreeNode'];

    if (parentTree) {
      Object.defineProperty(target, '__parentTreeNode', { value: parentTree, configurable: true, enumerable: false });
    }
  }

  function parent(object) {
    // Be carefull: typeof(null) === 'object'
    if (typeof object === 'object' && object !== null) {
      return object['__parentTreeNode'];
    }
  }

  function setMeta(target, key) {
    Object.defineProperty(target, '__meta', {
      value: {
        key: key,
        type: 'node'
      },
      configurable: false,
      enumerable: false
    });
  }

  function meta(object) {
    // Be carefull: typeof(null) === 'object'
    if (typeof object === 'object' && object !== null) {
      return object['__meta'];
    }
  }

  function TreeBuilder(blueprint, builders) {
    this.blueprint = blueprint;
    this.builders = builders;
  }

  TreeBuilder.prototype = {
    builderFor: function(value) {
      return this.builders[typeOf(value)] || this.builders['default'];
    },

    build: function(parentTree) {
      var root = {},
        node;

      this.processNode({ root: this.blueprint }, root);

      node = root['root'];
      setParent(node, parentTree);

      return node;
    },

    processNode: function(blueprintNode, target, parent) {
      var keys = Object.keys(blueprintNode),
          that = this;

      keys.forEach(function(key) {
        var blueprintAttribute = blueprintNode[key],
            builder,
            defaultBuilder,
            result;

        builder = that.builderFor(blueprintAttribute);
        defaultBuilder = builderFor(blueprintAttribute);

        if (result = builder(target, key, blueprintAttribute, defaultBuilder)) {
          that.processNode(result[1], result[0], target);
        }
      });

      setParent(target, parent);

      return target;
    }
  };

  function builderFor(value) {
    return DEFAULT_BUILDERS[typeOf(value)] || DEFAULT_BUILDERS['default'];
  }

  var DEFAULT_BUILDERS = {
    descriptor: buildDescriptor,
    object: buildObject,
    default: buildDefault
  };

  var Ceibo = {
    defineProperty: defineProperty,

    create: function(blueprint, options) {
      options = options || {};

      var builder = merge({}, DEFAULT_BUILDERS, options.builder);

      return new TreeBuilder(blueprint, builder).build(options.parent);
    },

    parent: function(node) {
      return parent(node);
    },

    meta: function(node) {
      return meta(node);
    }
  };

  if (typeof define === 'function') {
    define('ceibo', ['exports'], function(__exports__) {
      'use strict';
      __exports__.Ceibo = Ceibo;
      __exports__.default = Ceibo;
    });
  } else {
    window.Ceibo = Ceibo;
  }
}();

// Map `jquery` from the app to an amd module called `-jquery` for internal usage
(function() {
  function vendorModule() {
    'use strict';

    var jq = self.jQuery;
    if (!jq) {
      throw new Error('Unable to find jQuery');
    }

    return { 'default': jq };
  }

  define('-jquery', [], vendorModule);
})();

/* globals require, Ember, jQuery */
(function () {
  if (typeof jQuery !== 'undefined') {
    var _Ember;

    if (typeof Ember !== 'undefined') {
      _Ember = Ember;
    } else {
      _Ember = require('ember').default;
    }

    var pendingRequests;

    if (Ember.__loader.registry['ember-testing/test/pending_requests']) {
      // Ember <= 3.1
      pendingRequests = Ember.__loader.require('ember-testing/test/pending_requests');
    } else if (Ember.__loader.registry['ember-testing/lib/test/pending_requests']) {
      // Ember >= 3.2
      pendingRequests = Ember.__loader.require('ember-testing/lib/test/pending_requests');
    }

    if (pendingRequests) {
      // This exists to ensure that the AJAX listeners setup by Ember itself
      // (which as of 2.17 are not properly torn down) get cleared and released
      // when the application is destroyed. Without this, any AJAX requests
      // that happen _between_ acceptance tests will always share
      // `pendingRequests`.
      _Ember.Application.reopen({
        willDestroy: function willDestroy() {
          jQuery(document).off('ajaxSend', pendingRequests.incrementPendingRequests);
          jQuery(document).off('ajaxComplete', pendingRequests.decrementPendingRequests);
          pendingRequests.clearPendingRequests();

          this._super.apply(this, arguments);
        }
      });
    }
  }
})();
/*!
 * QUnit 2.9.3
 * https://qunitjs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2019-10-08T15:49Z
 */
(function (global$1) {
  'use strict';

  global$1 = global$1 && global$1.hasOwnProperty('default') ? global$1['default'] : global$1;

  var window$1 = global$1.window;
  var self$1 = global$1.self;
  var console = global$1.console;
  var setTimeout$1 = global$1.setTimeout;
  var clearTimeout = global$1.clearTimeout;

  var document$1 = window$1 && window$1.document;
  var navigator = window$1 && window$1.navigator;

  var localSessionStorage = function () {
  	var x = "qunit-test-string";
  	try {
  		global$1.sessionStorage.setItem(x, x);
  		global$1.sessionStorage.removeItem(x);
  		return global$1.sessionStorage;
  	} catch (e) {
  		return undefined;
  	}
  }();

  /**
   * Returns a function that proxies to the given method name on the globals
   * console object. The proxy will also detect if the console doesn't exist and
   * will appropriately no-op. This allows support for IE9, which doesn't have a
   * console if the developer tools are not open.
   */
  function consoleProxy(method) {
  	return function () {
  		if (console) {
  			console[method].apply(console, arguments);
  		}
  	};
  }

  var Logger = {
  	warn: consoleProxy("warn")
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };











  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();









































  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var toString = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;
  var now = Date.now || function () {
  	return new Date().getTime();
  };

  var hasPerformanceApi = detectPerformanceApi();
  var performance = hasPerformanceApi ? window$1.performance : undefined;
  var performanceNow = hasPerformanceApi ? performance.now.bind(performance) : now;

  function detectPerformanceApi() {
  	return window$1 && typeof window$1.performance !== "undefined" && typeof window$1.performance.mark === "function" && typeof window$1.performance.measure === "function";
  }

  function measure(comment, startMark, endMark) {

  	// `performance.measure` may fail if the mark could not be found.
  	// reasons a specific mark could not be found include: outside code invoking `performance.clearMarks()`
  	try {
  		performance.measure(comment, startMark, endMark);
  	} catch (ex) {
  		Logger.warn("performance.measure could not be executed because of ", ex.message);
  	}
  }

  var defined = {
  	document: window$1 && window$1.document !== undefined,
  	setTimeout: setTimeout$1 !== undefined
  };

  // Returns a new Array with the elements that are in a but not in b
  function diff(a, b) {
  	var i,
  	    j,
  	    result = a.slice();

  	for (i = 0; i < result.length; i++) {
  		for (j = 0; j < b.length; j++) {
  			if (result[i] === b[j]) {
  				result.splice(i, 1);
  				i--;
  				break;
  			}
  		}
  	}
  	return result;
  }

  /**
   * Determines whether an element exists in a given array or not.
   *
   * @method inArray
   * @param {Any} elem
   * @param {Array} array
   * @return {Boolean}
   */
  function inArray(elem, array) {
  	return array.indexOf(elem) !== -1;
  }

  /**
   * Makes a clone of an object using only Array or Object as base,
   * and copies over the own enumerable properties.
   *
   * @param {Object} obj
   * @return {Object} New object with only the own properties (recursively).
   */
  function objectValues(obj) {
  	var key,
  	    val,
  	    vals = is("array", obj) ? [] : {};
  	for (key in obj) {
  		if (hasOwn.call(obj, key)) {
  			val = obj[key];
  			vals[key] = val === Object(val) ? objectValues(val) : val;
  		}
  	}
  	return vals;
  }

  function extend(a, b, undefOnly) {
  	for (var prop in b) {
  		if (hasOwn.call(b, prop)) {
  			if (b[prop] === undefined) {
  				delete a[prop];
  			} else if (!(undefOnly && typeof a[prop] !== "undefined")) {
  				a[prop] = b[prop];
  			}
  		}
  	}

  	return a;
  }

  function objectType(obj) {
  	if (typeof obj === "undefined") {
  		return "undefined";
  	}

  	// Consider: typeof null === object
  	if (obj === null) {
  		return "null";
  	}

  	var match = toString.call(obj).match(/^\[object\s(.*)\]$/),
  	    type = match && match[1];

  	switch (type) {
  		case "Number":
  			if (isNaN(obj)) {
  				return "nan";
  			}
  			return "number";
  		case "String":
  		case "Boolean":
  		case "Array":
  		case "Set":
  		case "Map":
  		case "Date":
  		case "RegExp":
  		case "Function":
  		case "Symbol":
  			return type.toLowerCase();
  		default:
  			return typeof obj === "undefined" ? "undefined" : _typeof(obj);
  	}
  }

  // Safe object type checking
  function is(type, obj) {
  	return objectType(obj) === type;
  }

  // Based on Java's String.hashCode, a simple but not
  // rigorously collision resistant hashing function
  function generateHash(module, testName) {
  	var str = module + "\x1C" + testName;
  	var hash = 0;

  	for (var i = 0; i < str.length; i++) {
  		hash = (hash << 5) - hash + str.charCodeAt(i);
  		hash |= 0;
  	}

  	// Convert the possibly negative integer hash code into an 8 character hex string, which isn't
  	// strictly necessary but increases user understanding that the id is a SHA-like hash
  	var hex = (0x100000000 + hash).toString(16);
  	if (hex.length < 8) {
  		hex = "0000000" + hex;
  	}

  	return hex.slice(-8);
  }

  // Test for equality any JavaScript type.
  // Authors: Philippe Rathé <prathe@gmail.com>, David Chan <david@troi.org>
  var equiv = (function () {

  	// Value pairs queued for comparison. Used for breadth-first processing order, recursion
  	// detection and avoiding repeated comparison (see below for details).
  	// Elements are { a: val, b: val }.
  	var pairs = [];

  	var getProto = Object.getPrototypeOf || function (obj) {
  		return obj.__proto__;
  	};

  	function useStrictEquality(a, b) {

  		// This only gets called if a and b are not strict equal, and is used to compare on
  		// the primitive values inside object wrappers. For example:
  		// `var i = 1;`
  		// `var j = new Number(1);`
  		// Neither a nor b can be null, as a !== b and they have the same type.
  		if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === "object") {
  			a = a.valueOf();
  		}
  		if ((typeof b === "undefined" ? "undefined" : _typeof(b)) === "object") {
  			b = b.valueOf();
  		}

  		return a === b;
  	}

  	function compareConstructors(a, b) {
  		var protoA = getProto(a);
  		var protoB = getProto(b);

  		// Comparing constructors is more strict than using `instanceof`
  		if (a.constructor === b.constructor) {
  			return true;
  		}

  		// Ref #851
  		// If the obj prototype descends from a null constructor, treat it
  		// as a null prototype.
  		if (protoA && protoA.constructor === null) {
  			protoA = null;
  		}
  		if (protoB && protoB.constructor === null) {
  			protoB = null;
  		}

  		// Allow objects with no prototype to be equivalent to
  		// objects with Object as their constructor.
  		if (protoA === null && protoB === Object.prototype || protoB === null && protoA === Object.prototype) {
  			return true;
  		}

  		return false;
  	}

  	function getRegExpFlags(regexp) {
  		return "flags" in regexp ? regexp.flags : regexp.toString().match(/[gimuy]*$/)[0];
  	}

  	function isContainer(val) {
  		return ["object", "array", "map", "set"].indexOf(objectType(val)) !== -1;
  	}

  	function breadthFirstCompareChild(a, b) {

  		// If a is a container not reference-equal to b, postpone the comparison to the
  		// end of the pairs queue -- unless (a, b) has been seen before, in which case skip
  		// over the pair.
  		if (a === b) {
  			return true;
  		}
  		if (!isContainer(a)) {
  			return typeEquiv(a, b);
  		}
  		if (pairs.every(function (pair) {
  			return pair.a !== a || pair.b !== b;
  		})) {

  			// Not yet started comparing this pair
  			pairs.push({ a: a, b: b });
  		}
  		return true;
  	}

  	var callbacks = {
  		"string": useStrictEquality,
  		"boolean": useStrictEquality,
  		"number": useStrictEquality,
  		"null": useStrictEquality,
  		"undefined": useStrictEquality,
  		"symbol": useStrictEquality,
  		"date": useStrictEquality,

  		"nan": function nan() {
  			return true;
  		},

  		"regexp": function regexp(a, b) {
  			return a.source === b.source &&

  			// Include flags in the comparison
  			getRegExpFlags(a) === getRegExpFlags(b);
  		},

  		// abort (identical references / instance methods were skipped earlier)
  		"function": function _function() {
  			return false;
  		},

  		"array": function array(a, b) {
  			var i, len;

  			len = a.length;
  			if (len !== b.length) {

  				// Safe and faster
  				return false;
  			}

  			for (i = 0; i < len; i++) {

  				// Compare non-containers; queue non-reference-equal containers
  				if (!breadthFirstCompareChild(a[i], b[i])) {
  					return false;
  				}
  			}
  			return true;
  		},

  		// Define sets a and b to be equivalent if for each element aVal in a, there
  		// is some element bVal in b such that aVal and bVal are equivalent. Element
  		// repetitions are not counted, so these are equivalent:
  		// a = new Set( [ {}, [], [] ] );
  		// b = new Set( [ {}, {}, [] ] );
  		"set": function set$$1(a, b) {
  			var innerEq,
  			    outerEq = true;

  			if (a.size !== b.size) {

  				// This optimization has certain quirks because of the lack of
  				// repetition counting. For instance, adding the same
  				// (reference-identical) element to two equivalent sets can
  				// make them non-equivalent.
  				return false;
  			}

  			a.forEach(function (aVal) {

  				// Short-circuit if the result is already known. (Using for...of
  				// with a break clause would be cleaner here, but it would cause
  				// a syntax error on older Javascript implementations even if
  				// Set is unused)
  				if (!outerEq) {
  					return;
  				}

  				innerEq = false;

  				b.forEach(function (bVal) {
  					var parentPairs;

  					// Likewise, short-circuit if the result is already known
  					if (innerEq) {
  						return;
  					}

  					// Swap out the global pairs list, as the nested call to
  					// innerEquiv will clobber its contents
  					parentPairs = pairs;
  					if (innerEquiv(bVal, aVal)) {
  						innerEq = true;
  					}

  					// Replace the global pairs list
  					pairs = parentPairs;
  				});

  				if (!innerEq) {
  					outerEq = false;
  				}
  			});

  			return outerEq;
  		},

  		// Define maps a and b to be equivalent if for each key-value pair (aKey, aVal)
  		// in a, there is some key-value pair (bKey, bVal) in b such that
  		// [ aKey, aVal ] and [ bKey, bVal ] are equivalent. Key repetitions are not
  		// counted, so these are equivalent:
  		// a = new Map( [ [ {}, 1 ], [ {}, 1 ], [ [], 1 ] ] );
  		// b = new Map( [ [ {}, 1 ], [ [], 1 ], [ [], 1 ] ] );
  		"map": function map(a, b) {
  			var innerEq,
  			    outerEq = true;

  			if (a.size !== b.size) {

  				// This optimization has certain quirks because of the lack of
  				// repetition counting. For instance, adding the same
  				// (reference-identical) key-value pair to two equivalent maps
  				// can make them non-equivalent.
  				return false;
  			}

  			a.forEach(function (aVal, aKey) {

  				// Short-circuit if the result is already known. (Using for...of
  				// with a break clause would be cleaner here, but it would cause
  				// a syntax error on older Javascript implementations even if
  				// Map is unused)
  				if (!outerEq) {
  					return;
  				}

  				innerEq = false;

  				b.forEach(function (bVal, bKey) {
  					var parentPairs;

  					// Likewise, short-circuit if the result is already known
  					if (innerEq) {
  						return;
  					}

  					// Swap out the global pairs list, as the nested call to
  					// innerEquiv will clobber its contents
  					parentPairs = pairs;
  					if (innerEquiv([bVal, bKey], [aVal, aKey])) {
  						innerEq = true;
  					}

  					// Replace the global pairs list
  					pairs = parentPairs;
  				});

  				if (!innerEq) {
  					outerEq = false;
  				}
  			});

  			return outerEq;
  		},

  		"object": function object(a, b) {
  			var i,
  			    aProperties = [],
  			    bProperties = [];

  			if (compareConstructors(a, b) === false) {
  				return false;
  			}

  			// Be strict: don't ensure hasOwnProperty and go deep
  			for (i in a) {

  				// Collect a's properties
  				aProperties.push(i);

  				// Skip OOP methods that look the same
  				if (a.constructor !== Object && typeof a.constructor !== "undefined" && typeof a[i] === "function" && typeof b[i] === "function" && a[i].toString() === b[i].toString()) {
  					continue;
  				}

  				// Compare non-containers; queue non-reference-equal containers
  				if (!breadthFirstCompareChild(a[i], b[i])) {
  					return false;
  				}
  			}

  			for (i in b) {

  				// Collect b's properties
  				bProperties.push(i);
  			}

  			// Ensures identical properties name
  			return typeEquiv(aProperties.sort(), bProperties.sort());
  		}
  	};

  	function typeEquiv(a, b) {
  		var type = objectType(a);

  		// Callbacks for containers will append to the pairs queue to achieve breadth-first
  		// search order. The pairs queue is also used to avoid reprocessing any pair of
  		// containers that are reference-equal to a previously visited pair (a special case
  		// this being recursion detection).
  		//
  		// Because of this approach, once typeEquiv returns a false value, it should not be
  		// called again without clearing the pair queue else it may wrongly report a visited
  		// pair as being equivalent.
  		return objectType(b) === type && callbacks[type](a, b);
  	}

  	function innerEquiv(a, b) {
  		var i, pair;

  		// We're done when there's nothing more to compare
  		if (arguments.length < 2) {
  			return true;
  		}

  		// Clear the global pair queue and add the top-level values being compared
  		pairs = [{ a: a, b: b }];

  		for (i = 0; i < pairs.length; i++) {
  			pair = pairs[i];

  			// Perform type-specific comparison on any pairs that are not strictly
  			// equal. For container types, that comparison will postpone comparison
  			// of any sub-container pair to the end of the pair queue. This gives
  			// breadth-first search order. It also avoids the reprocessing of
  			// reference-equal siblings, cousins etc, which can have a significant speed
  			// impact when comparing a container of small objects each of which has a
  			// reference to the same (singleton) large object.
  			if (pair.a !== pair.b && !typeEquiv(pair.a, pair.b)) {
  				return false;
  			}
  		}

  		// ...across all consecutive argument pairs
  		return arguments.length === 2 || innerEquiv.apply(this, [].slice.call(arguments, 1));
  	}

  	return function () {
  		var result = innerEquiv.apply(undefined, arguments);

  		// Release any retained objects
  		pairs.length = 0;
  		return result;
  	};
  })();

  /**
   * Config object: Maintain internal state
   * Later exposed as QUnit.config
   * `config` initialized at top of scope
   */
  var config = {

  	// The queue of tests to run
  	queue: [],

  	// Block until document ready
  	blocking: true,

  	// By default, run previously failed tests first
  	// very useful in combination with "Hide passed tests" checked
  	reorder: true,

  	// By default, modify document.title when suite is done
  	altertitle: true,

  	// HTML Reporter: collapse every test except the first failing test
  	// If false, all failing tests will be expanded
  	collapse: true,

  	// By default, scroll to top of the page when suite is done
  	scrolltop: true,

  	// Depth up-to which object will be dumped
  	maxDepth: 5,

  	// When enabled, all tests must call expect()
  	requireExpects: false,

  	// Placeholder for user-configurable form-exposed URL parameters
  	urlConfig: [],

  	// Set of all modules.
  	modules: [],

  	// The first unnamed module
  	currentModule: {
  		name: "",
  		tests: [],
  		childModules: [],
  		testsRun: 0,
  		unskippedTestsRun: 0,
  		hooks: {
  			before: [],
  			beforeEach: [],
  			afterEach: [],
  			after: []
  		}
  	},

  	callbacks: {},

  	// The storage module to use for reordering tests
  	storage: localSessionStorage
  };

  // take a predefined QUnit.config and extend the defaults
  var globalConfig = window$1 && window$1.QUnit && window$1.QUnit.config;

  // only extend the global config if there is no QUnit overload
  if (window$1 && window$1.QUnit && !window$1.QUnit.version) {
  	extend(config, globalConfig);
  }

  // Push a loose unnamed module to the modules collection
  config.modules.push(config.currentModule);

  // Based on jsDump by Ariel Flesler
  // http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html
  var dump = (function () {
  	function quote(str) {
  		return "\"" + str.toString().replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
  	}
  	function literal(o) {
  		return o + "";
  	}
  	function join(pre, arr, post) {
  		var s = dump.separator(),
  		    base = dump.indent(),
  		    inner = dump.indent(1);
  		if (arr.join) {
  			arr = arr.join("," + s + inner);
  		}
  		if (!arr) {
  			return pre + post;
  		}
  		return [pre, inner + arr, base + post].join(s);
  	}
  	function array(arr, stack) {
  		var i = arr.length,
  		    ret = new Array(i);

  		if (dump.maxDepth && dump.depth > dump.maxDepth) {
  			return "[object Array]";
  		}

  		this.up();
  		while (i--) {
  			ret[i] = this.parse(arr[i], undefined, stack);
  		}
  		this.down();
  		return join("[", ret, "]");
  	}

  	function isArray(obj) {
  		return (

  			//Native Arrays
  			toString.call(obj) === "[object Array]" ||

  			// NodeList objects
  			typeof obj.length === "number" && obj.item !== undefined && (obj.length ? obj.item(0) === obj[0] : obj.item(0) === null && obj[0] === undefined)
  		);
  	}

  	var reName = /^function (\w+)/,
  	    dump = {

  		// The objType is used mostly internally, you can fix a (custom) type in advance
  		parse: function parse(obj, objType, stack) {
  			stack = stack || [];
  			var res,
  			    parser,
  			    parserType,
  			    objIndex = stack.indexOf(obj);

  			if (objIndex !== -1) {
  				return "recursion(" + (objIndex - stack.length) + ")";
  			}

  			objType = objType || this.typeOf(obj);
  			parser = this.parsers[objType];
  			parserType = typeof parser === "undefined" ? "undefined" : _typeof(parser);

  			if (parserType === "function") {
  				stack.push(obj);
  				res = parser.call(this, obj, stack);
  				stack.pop();
  				return res;
  			}
  			return parserType === "string" ? parser : this.parsers.error;
  		},
  		typeOf: function typeOf(obj) {
  			var type;

  			if (obj === null) {
  				type = "null";
  			} else if (typeof obj === "undefined") {
  				type = "undefined";
  			} else if (is("regexp", obj)) {
  				type = "regexp";
  			} else if (is("date", obj)) {
  				type = "date";
  			} else if (is("function", obj)) {
  				type = "function";
  			} else if (obj.setInterval !== undefined && obj.document !== undefined && obj.nodeType === undefined) {
  				type = "window";
  			} else if (obj.nodeType === 9) {
  				type = "document";
  			} else if (obj.nodeType) {
  				type = "node";
  			} else if (isArray(obj)) {
  				type = "array";
  			} else if (obj.constructor === Error.prototype.constructor) {
  				type = "error";
  			} else {
  				type = typeof obj === "undefined" ? "undefined" : _typeof(obj);
  			}
  			return type;
  		},

  		separator: function separator() {
  			if (this.multiline) {
  				return this.HTML ? "<br />" : "\n";
  			} else {
  				return this.HTML ? "&#160;" : " ";
  			}
  		},

  		// Extra can be a number, shortcut for increasing-calling-decreasing
  		indent: function indent(extra) {
  			if (!this.multiline) {
  				return "";
  			}
  			var chr = this.indentChar;
  			if (this.HTML) {
  				chr = chr.replace(/\t/g, "   ").replace(/ /g, "&#160;");
  			}
  			return new Array(this.depth + (extra || 0)).join(chr);
  		},
  		up: function up(a) {
  			this.depth += a || 1;
  		},
  		down: function down(a) {
  			this.depth -= a || 1;
  		},
  		setParser: function setParser(name, parser) {
  			this.parsers[name] = parser;
  		},

  		// The next 3 are exposed so you can use them
  		quote: quote,
  		literal: literal,
  		join: join,
  		depth: 1,
  		maxDepth: config.maxDepth,

  		// This is the list of parsers, to modify them, use dump.setParser
  		parsers: {
  			window: "[Window]",
  			document: "[Document]",
  			error: function error(_error) {
  				return "Error(\"" + _error.message + "\")";
  			},
  			unknown: "[Unknown]",
  			"null": "null",
  			"undefined": "undefined",
  			"function": function _function(fn) {
  				var ret = "function",


  				// Functions never have name in IE
  				name = "name" in fn ? fn.name : (reName.exec(fn) || [])[1];

  				if (name) {
  					ret += " " + name;
  				}
  				ret += "(";

  				ret = [ret, dump.parse(fn, "functionArgs"), "){"].join("");
  				return join(ret, dump.parse(fn, "functionCode"), "}");
  			},
  			array: array,
  			nodelist: array,
  			"arguments": array,
  			object: function object(map, stack) {
  				var keys,
  				    key,
  				    val,
  				    i,
  				    nonEnumerableProperties,
  				    ret = [];

  				if (dump.maxDepth && dump.depth > dump.maxDepth) {
  					return "[object Object]";
  				}

  				dump.up();
  				keys = [];
  				for (key in map) {
  					keys.push(key);
  				}

  				// Some properties are not always enumerable on Error objects.
  				nonEnumerableProperties = ["message", "name"];
  				for (i in nonEnumerableProperties) {
  					key = nonEnumerableProperties[i];
  					if (key in map && !inArray(key, keys)) {
  						keys.push(key);
  					}
  				}
  				keys.sort();
  				for (i = 0; i < keys.length; i++) {
  					key = keys[i];
  					val = map[key];
  					ret.push(dump.parse(key, "key") + ": " + dump.parse(val, undefined, stack));
  				}
  				dump.down();
  				return join("{", ret, "}");
  			},
  			node: function node(_node) {
  				var len,
  				    i,
  				    val,
  				    open = dump.HTML ? "&lt;" : "<",
  				    close = dump.HTML ? "&gt;" : ">",
  				    tag = _node.nodeName.toLowerCase(),
  				    ret = open + tag,
  				    attrs = _node.attributes;

  				if (attrs) {
  					for (i = 0, len = attrs.length; i < len; i++) {
  						val = attrs[i].nodeValue;

  						// IE6 includes all attributes in .attributes, even ones not explicitly
  						// set. Those have values like undefined, null, 0, false, "" or
  						// "inherit".
  						if (val && val !== "inherit") {
  							ret += " " + attrs[i].nodeName + "=" + dump.parse(val, "attribute");
  						}
  					}
  				}
  				ret += close;

  				// Show content of TextNode or CDATASection
  				if (_node.nodeType === 3 || _node.nodeType === 4) {
  					ret += _node.nodeValue;
  				}

  				return ret + open + "/" + tag + close;
  			},

  			// Function calls it internally, it's the arguments part of the function
  			functionArgs: function functionArgs(fn) {
  				var args,
  				    l = fn.length;

  				if (!l) {
  					return "";
  				}

  				args = new Array(l);
  				while (l--) {

  					// 97 is 'a'
  					args[l] = String.fromCharCode(97 + l);
  				}
  				return " " + args.join(", ") + " ";
  			},

  			// Object calls it internally, the key part of an item in a map
  			key: quote,

  			// Function calls it internally, it's the content of the function
  			functionCode: "[code]",

  			// Node calls it internally, it's a html attribute value
  			attribute: quote,
  			string: quote,
  			date: quote,
  			regexp: literal,
  			number: literal,
  			"boolean": literal,
  			symbol: function symbol(sym) {
  				return sym.toString();
  			}
  		},

  		// If true, entities are escaped ( <, >, \t, space and \n )
  		HTML: false,

  		// Indentation unit
  		indentChar: "  ",

  		// If true, items in a collection, are separated by a \n, else just a space.
  		multiline: true
  	};

  	return dump;
  })();

  var SuiteReport = function () {
  	function SuiteReport(name, parentSuite) {
  		classCallCheck(this, SuiteReport);

  		this.name = name;
  		this.fullName = parentSuite ? parentSuite.fullName.concat(name) : [];

  		this.tests = [];
  		this.childSuites = [];

  		if (parentSuite) {
  			parentSuite.pushChildSuite(this);
  		}
  	}

  	createClass(SuiteReport, [{
  		key: "start",
  		value: function start(recordTime) {
  			if (recordTime) {
  				this._startTime = performanceNow();

  				if (performance) {
  					var suiteLevel = this.fullName.length;
  					performance.mark("qunit_suite_" + suiteLevel + "_start");
  				}
  			}

  			return {
  				name: this.name,
  				fullName: this.fullName.slice(),
  				tests: this.tests.map(function (test) {
  					return test.start();
  				}),
  				childSuites: this.childSuites.map(function (suite) {
  					return suite.start();
  				}),
  				testCounts: {
  					total: this.getTestCounts().total
  				}
  			};
  		}
  	}, {
  		key: "end",
  		value: function end(recordTime) {
  			if (recordTime) {
  				this._endTime = performanceNow();

  				if (performance) {
  					var suiteLevel = this.fullName.length;
  					performance.mark("qunit_suite_" + suiteLevel + "_end");

  					var suiteName = this.fullName.join(" – ");

  					measure(suiteLevel === 0 ? "QUnit Test Run" : "QUnit Test Suite: " + suiteName, "qunit_suite_" + suiteLevel + "_start", "qunit_suite_" + suiteLevel + "_end");
  				}
  			}

  			return {
  				name: this.name,
  				fullName: this.fullName.slice(),
  				tests: this.tests.map(function (test) {
  					return test.end();
  				}),
  				childSuites: this.childSuites.map(function (suite) {
  					return suite.end();
  				}),
  				testCounts: this.getTestCounts(),
  				runtime: this.getRuntime(),
  				status: this.getStatus()
  			};
  		}
  	}, {
  		key: "pushChildSuite",
  		value: function pushChildSuite(suite) {
  			this.childSuites.push(suite);
  		}
  	}, {
  		key: "pushTest",
  		value: function pushTest(test) {
  			this.tests.push(test);
  		}
  	}, {
  		key: "getRuntime",
  		value: function getRuntime() {
  			return this._endTime - this._startTime;
  		}
  	}, {
  		key: "getTestCounts",
  		value: function getTestCounts() {
  			var counts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { passed: 0, failed: 0, skipped: 0, todo: 0, total: 0 };

  			counts = this.tests.reduce(function (counts, test) {
  				if (test.valid) {
  					counts[test.getStatus()]++;
  					counts.total++;
  				}

  				return counts;
  			}, counts);

  			return this.childSuites.reduce(function (counts, suite) {
  				return suite.getTestCounts(counts);
  			}, counts);
  		}
  	}, {
  		key: "getStatus",
  		value: function getStatus() {
  			var _getTestCounts = this.getTestCounts(),
  			    total = _getTestCounts.total,
  			    failed = _getTestCounts.failed,
  			    skipped = _getTestCounts.skipped,
  			    todo = _getTestCounts.todo;

  			if (failed) {
  				return "failed";
  			} else {
  				if (skipped === total) {
  					return "skipped";
  				} else if (todo === total) {
  					return "todo";
  				} else {
  					return "passed";
  				}
  			}
  		}
  	}]);
  	return SuiteReport;
  }();

  var focused = false;

  var moduleStack = [];

  function createModule(name, testEnvironment, modifiers) {
  	var parentModule = moduleStack.length ? moduleStack.slice(-1)[0] : null;
  	var moduleName = parentModule !== null ? [parentModule.name, name].join(" > ") : name;
  	var parentSuite = parentModule ? parentModule.suiteReport : globalSuite;

  	var skip = parentModule !== null && parentModule.skip || modifiers.skip;
  	var todo = parentModule !== null && parentModule.todo || modifiers.todo;

  	var module = {
  		name: moduleName,
  		parentModule: parentModule,
  		tests: [],
  		moduleId: generateHash(moduleName),
  		testsRun: 0,
  		unskippedTestsRun: 0,
  		childModules: [],
  		suiteReport: new SuiteReport(name, parentSuite),

  		// Pass along `skip` and `todo` properties from parent module, in case
  		// there is one, to childs. And use own otherwise.
  		// This property will be used to mark own tests and tests of child suites
  		// as either `skipped` or `todo`.
  		skip: skip,
  		todo: skip ? false : todo
  	};

  	var env = {};
  	if (parentModule) {
  		parentModule.childModules.push(module);
  		extend(env, parentModule.testEnvironment);
  	}
  	extend(env, testEnvironment);
  	module.testEnvironment = env;

  	config.modules.push(module);
  	return module;
  }

  function processModule(name, options, executeNow) {
  	var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  	if (objectType(options) === "function") {
  		executeNow = options;
  		options = undefined;
  	}

  	var module = createModule(name, options, modifiers);

  	// Move any hooks to a 'hooks' object
  	var testEnvironment = module.testEnvironment;
  	var hooks = module.hooks = {};

  	setHookFromEnvironment(hooks, testEnvironment, "before");
  	setHookFromEnvironment(hooks, testEnvironment, "beforeEach");
  	setHookFromEnvironment(hooks, testEnvironment, "afterEach");
  	setHookFromEnvironment(hooks, testEnvironment, "after");

  	var moduleFns = {
  		before: setHookFunction(module, "before"),
  		beforeEach: setHookFunction(module, "beforeEach"),
  		afterEach: setHookFunction(module, "afterEach"),
  		after: setHookFunction(module, "after")
  	};

  	var currentModule = config.currentModule;
  	if (objectType(executeNow) === "function") {
  		moduleStack.push(module);
  		config.currentModule = module;
  		executeNow.call(module.testEnvironment, moduleFns);
  		moduleStack.pop();
  		module = module.parentModule || currentModule;
  	}

  	config.currentModule = module;

  	function setHookFromEnvironment(hooks, environment, name) {
  		var potentialHook = environment[name];
  		hooks[name] = typeof potentialHook === "function" ? [potentialHook] : [];
  		delete environment[name];
  	}

  	function setHookFunction(module, hookName) {
  		return function setHook(callback) {
  			module.hooks[hookName].push(callback);
  		};
  	}
  }

  function module$1(name, options, executeNow) {
  	if (focused) {
  		return;
  	}

  	processModule(name, options, executeNow);
  }

  module$1.only = function () {
  	if (focused) {
  		return;
  	}

  	config.modules.length = 0;
  	config.queue.length = 0;

  	module$1.apply(undefined, arguments);

  	focused = true;
  };

  module$1.skip = function (name, options, executeNow) {
  	if (focused) {
  		return;
  	}

  	processModule(name, options, executeNow, { skip: true });
  };

  module$1.todo = function (name, options, executeNow) {
  	if (focused) {
  		return;
  	}

  	processModule(name, options, executeNow, { todo: true });
  };

  var LISTENERS = Object.create(null);
  var SUPPORTED_EVENTS = ["runStart", "suiteStart", "testStart", "assertion", "testEnd", "suiteEnd", "runEnd"];

  /**
   * Emits an event with the specified data to all currently registered listeners.
   * Callbacks will fire in the order in which they are registered (FIFO). This
   * function is not exposed publicly; it is used by QUnit internals to emit
   * logging events.
   *
   * @private
   * @method emit
   * @param {String} eventName
   * @param {Object} data
   * @return {Void}
   */
  function emit(eventName, data) {
  	if (objectType(eventName) !== "string") {
  		throw new TypeError("eventName must be a string when emitting an event");
  	}

  	// Clone the callbacks in case one of them registers a new callback
  	var originalCallbacks = LISTENERS[eventName];
  	var callbacks = originalCallbacks ? [].concat(toConsumableArray(originalCallbacks)) : [];

  	for (var i = 0; i < callbacks.length; i++) {
  		callbacks[i](data);
  	}
  }

  /**
   * Registers a callback as a listener to the specified event.
   *
   * @public
   * @method on
   * @param {String} eventName
   * @param {Function} callback
   * @return {Void}
   */
  function on(eventName, callback) {
  	if (objectType(eventName) !== "string") {
  		throw new TypeError("eventName must be a string when registering a listener");
  	} else if (!inArray(eventName, SUPPORTED_EVENTS)) {
  		var events = SUPPORTED_EVENTS.join(", ");
  		throw new Error("\"" + eventName + "\" is not a valid event; must be one of: " + events + ".");
  	} else if (objectType(callback) !== "function") {
  		throw new TypeError("callback must be a function when registering a listener");
  	}

  	if (!LISTENERS[eventName]) {
  		LISTENERS[eventName] = [];
  	}

  	// Don't register the same callback more than once
  	if (!inArray(callback, LISTENERS[eventName])) {
  		LISTENERS[eventName].push(callback);
  	}
  }

  function objectOrFunction(x) {
    var type = typeof x === 'undefined' ? 'undefined' : _typeof(x);
    return x !== null && (type === 'object' || type === 'function');
  }

  function isFunction(x) {
    return typeof x === 'function';
  }



  var _isArray = void 0;
  if (Array.isArray) {
    _isArray = Array.isArray;
  } else {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = void 0;
  var customSchedulerFn = void 0;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var vertx = Function('return this')().require('vertx');
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = void 0;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && typeof require === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;


    if (_state) {
      var callback = arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:

    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });

    promise.then(function(value){
      // value === 1
    });
    ```

    Instead of writing the above, your code now simply becomes the following:

    ```javascript
    let promise = Promise.resolve(1);

    promise.then(function(value){
      // value === 1
    });
    ```

    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve$1(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(2);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
    try {
      then$$1.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then$$1) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then$$1, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return resolve(promise, value);
      }, function (reason) {
        return reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$1) {
    if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$1 === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$1)) {
        handleForeignThenable(promise, maybeThenable, then$$1);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function resolve(promise, value) {
    if (promise === value) {
      reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      var then$$1 = void 0;
      try {
        then$$1 = value.then;
      } catch (error) {
        reject(promise, error);
        return;
      }
      handleMaybeThenable(promise, value, then$$1);
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;


    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = void 0,
        callback = void 0,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = void 0,
        error = void 0,
        succeeded = true;

    if (hasCallback) {
      try {
        value = callback(detail);
      } catch (e) {
        succeeded = false;
        error = e;
      }

      if (promise === value) {
        reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (succeeded === false) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        resolve(promise, value);
      }, function rejectPromise(reason) {
        reject(promise, reason);
      });
    } catch (e) {
      reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  }

  var Enumerator = function () {
    function Enumerator(Constructor, input) {
      classCallCheck(this, Enumerator);

      this._instanceConstructor = Constructor;
      this.promise = new Constructor(noop);

      if (!this.promise[PROMISE_ID]) {
        makePromise(this.promise);
      }

      if (isArray(input)) {
        this.length = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate(input);
          if (this._remaining === 0) {
            fulfill(this.promise, this._result);
          }
        }
      } else {
        reject(this.promise, validationError());
      }
    }

    createClass(Enumerator, [{
      key: '_enumerate',
      value: function _enumerate(input) {
        for (var i = 0; this._state === PENDING && i < input.length; i++) {
          this._eachEntry(input[i], i);
        }
      }
    }, {
      key: '_eachEntry',
      value: function _eachEntry(entry, i) {
        var c = this._instanceConstructor;
        var resolve$$1 = c.resolve;


        if (resolve$$1 === resolve$1) {
          var _then = void 0;
          var error = void 0;
          var didError = false;
          try {
            _then = entry.then;
          } catch (e) {
            didError = true;
            error = e;
          }

          if (_then === then && entry._state !== PENDING) {
            this._settledAt(entry._state, i, entry._result);
          } else if (typeof _then !== 'function') {
            this._remaining--;
            this._result[i] = entry;
          } else if (c === Promise$2) {
            var promise = new c(noop);
            if (didError) {
              reject(promise, error);
            } else {
              handleMaybeThenable(promise, entry, _then);
            }
            this._willSettleAt(promise, i);
          } else {
            this._willSettleAt(new c(function (resolve$$1) {
              return resolve$$1(entry);
            }), i);
          }
        } else {
          this._willSettleAt(resolve$$1(entry), i);
        }
      }
    }, {
      key: '_settledAt',
      value: function _settledAt(state, i, value) {
        var promise = this.promise;


        if (promise._state === PENDING) {
          this._remaining--;

          if (state === REJECTED) {
            reject(promise, value);
          } else {
            this._result[i] = value;
          }
        }

        if (this._remaining === 0) {
          fulfill(promise, this._result);
        }
      }
    }, {
      key: '_willSettleAt',
      value: function _willSettleAt(promise, i) {
        var enumerator = this;

        subscribe(promise, undefined, function (value) {
          return enumerator._settledAt(FULFILLED, i, value);
        }, function (reason) {
          return enumerator._settledAt(REJECTED, i, reason);
        });
      }
    }]);
    return Enumerator;
  }();

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.

    Example:

    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];

    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```

    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:

    Example:

    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];

    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```

    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.

    Example:

    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });

    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });

    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```

    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:

    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });

    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });

    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```

    An example real-world use case is implementing timeouts:

    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```

    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:

    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });

    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```

    Instead of writing the above, your code now simply becomes the following:

    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));

    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```

    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject$1(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.

    Terminology
    -----------

    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.

    A promise can be in one of three states: pending, fulfilled, or rejected.

    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.

    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.


    Basic Usage:
    ------------

    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);

      // on failure
      reject(reason);
    });

    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```

    Advanced Usage:
    ---------------

    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.

    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();

        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }

    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```

    Unlike callbacks, promises are great composable primitives.

    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON

      return values;
    });
    ```

    @class Promise
    @param {Function} resolver
    Useful for tooling.
    @constructor
  */

  var Promise$2 = function () {
    function Promise(resolver) {
      classCallCheck(this, Promise);

      this[PROMISE_ID] = nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (noop !== resolver) {
        typeof resolver !== 'function' && needsResolver();
        this instanceof Promise ? initializePromise(this, resolver) : needsNew();
      }
    }

    /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
     ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
     Chaining
    --------
     The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
     ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
     findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
     ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
     Assimilation
    ------------
     Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
     ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
     If the assimliated promise rejects, then the downstream promise will also reject.
     ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
     Simple Example
    --------------
     Synchronous Example
     ```javascript
    let result;
     try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
     Errback Example
     ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
     Promise Example;
     ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
     Advanced Example
    --------------
     Synchronous Example
     ```javascript
    let author, books;
     try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
     Errback Example
     ```js
     function foundBooks(books) {
     }
     function failure(reason) {
     }
     findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
     Promise Example;
     ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
     @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
    */

    /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
    ```js
    function findAuthor(){
    throw new Error('couldn't find that author');
    }
    // synchronous
    try {
    findAuthor();
    } catch(reason) {
    // something went wrong
    }
    // async with promises
    findAuthor().catch(function(reason){
    // something went wrong
    });
    ```
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
    */


    createClass(Promise, [{
      key: 'catch',
      value: function _catch(onRejection) {
        return this.then(null, onRejection);
      }

      /**
        `finally` will be invoked regardless of the promise's fate just as native
        try/catch/finally behaves
      
        Synchronous example:
      
        ```js
        findAuthor() {
          if (Math.random() > 0.5) {
            throw new Error();
          }
          return new Author();
        }
      
        try {
          return findAuthor(); // succeed or fail
        } catch(error) {
          return findOtherAuther();
        } finally {
          // always runs
          // doesn't affect the return value
        }
        ```
      
        Asynchronous example:
      
        ```js
        findAuthor().catch(function(reason){
          return findOtherAuther();
        }).finally(function(){
          // author was either found, or not
        });
        ```
      
        @method finally
        @param {Function} callback
        @return {Promise}
      */

    }, {
      key: 'finally',
      value: function _finally(callback) {
        var promise = this;
        var constructor = promise.constructor;

        if (isFunction(callback)) {
          return promise.then(function (value) {
            return constructor.resolve(callback()).then(function () {
              return value;
            });
          }, function (reason) {
            return constructor.resolve(callback()).then(function () {
              throw reason;
            });
          });
        }

        return promise.then(callback, callback);
      }
    }]);
    return Promise;
  }();

  Promise$2.prototype.then = then;
  Promise$2.all = all;
  Promise$2.race = race;
  Promise$2.resolve = resolve$1;
  Promise$2.reject = reject$1;
  Promise$2._setScheduler = setScheduler;
  Promise$2._setAsap = setAsap;
  Promise$2._asap = asap;

  /*global self*/
  function polyfill() {
    var local = void 0;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise$2;
  }

  // Strange compat..
  Promise$2.polyfill = polyfill;
  Promise$2.Promise = Promise$2;

  var Promise$1 = typeof Promise !== "undefined" ? Promise : Promise$2;

  // Register logging callbacks
  function registerLoggingCallbacks(obj) {
  	var i,
  	    l,
  	    key,
  	    callbackNames = ["begin", "done", "log", "testStart", "testDone", "moduleStart", "moduleDone"];

  	function registerLoggingCallback(key) {
  		var loggingCallback = function loggingCallback(callback) {
  			if (objectType(callback) !== "function") {
  				throw new Error("QUnit logging methods require a callback function as their first parameters.");
  			}

  			config.callbacks[key].push(callback);
  		};

  		return loggingCallback;
  	}

  	for (i = 0, l = callbackNames.length; i < l; i++) {
  		key = callbackNames[i];

  		// Initialize key collection of logging callback
  		if (objectType(config.callbacks[key]) === "undefined") {
  			config.callbacks[key] = [];
  		}

  		obj[key] = registerLoggingCallback(key);
  	}
  }

  function runLoggingCallbacks(key, args) {
  	var callbacks = config.callbacks[key];

  	// Handling 'log' callbacks separately. Unlike the other callbacks,
  	// the log callback is not controlled by the processing queue,
  	// but rather used by asserts. Hence to promisfy the 'log' callback
  	// would mean promisfying each step of a test
  	if (key === "log") {
  		callbacks.map(function (callback) {
  			return callback(args);
  		});
  		return;
  	}

  	// ensure that each callback is executed serially
  	return callbacks.reduce(function (promiseChain, callback) {
  		return promiseChain.then(function () {
  			return Promise$1.resolve(callback(args));
  		});
  	}, Promise$1.resolve([]));
  }

  // Doesn't support IE9, it will return undefined on these browsers
  // See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
  var fileName = (sourceFromStacktrace(0) || "").replace(/(:\d+)+\)?/, "").replace(/.+\//, "");

  function extractStacktrace(e, offset) {
  	offset = offset === undefined ? 4 : offset;

  	var stack, include, i;

  	if (e && e.stack) {
  		stack = e.stack.split("\n");
  		if (/^error$/i.test(stack[0])) {
  			stack.shift();
  		}
  		if (fileName) {
  			include = [];
  			for (i = offset; i < stack.length; i++) {
  				if (stack[i].indexOf(fileName) !== -1) {
  					break;
  				}
  				include.push(stack[i]);
  			}
  			if (include.length) {
  				return include.join("\n");
  			}
  		}
  		return stack[offset];
  	}
  }

  function sourceFromStacktrace(offset) {
  	var error = new Error();

  	// Support: Safari <=7 only, IE <=10 - 11 only
  	// Not all browsers generate the `stack` property for `new Error()`, see also #636
  	if (!error.stack) {
  		try {
  			throw error;
  		} catch (err) {
  			error = err;
  		}
  	}

  	return extractStacktrace(error, offset);
  }

  var priorityCount = 0;
  var unitSampler = void 0;

  // This is a queue of functions that are tasks within a single test.
  // After tests are dequeued from config.queue they are expanded into
  // a set of tasks in this queue.
  var taskQueue = [];

  /**
   * Advances the taskQueue to the next task. If the taskQueue is empty,
   * process the testQueue
   */
  function advance() {
  	advanceTaskQueue();

  	if (!taskQueue.length && !config.blocking && !config.current) {
  		advanceTestQueue();
  	}
  }

  /**
   * Advances the taskQueue with an increased depth
   */
  function advanceTaskQueue() {
  	var start = now();
  	config.depth = (config.depth || 0) + 1;

  	processTaskQueue(start);

  	config.depth--;
  }

  /**
   * Process the first task on the taskQueue as a promise.
   * Each task is a function returned by https://github.com/qunitjs/qunit/blob/master/src/test.js#L381
   */
  function processTaskQueue(start) {
  	if (taskQueue.length && !config.blocking) {
  		var elapsedTime = now() - start;

  		if (!defined.setTimeout || config.updateRate <= 0 || elapsedTime < config.updateRate) {
  			var task = taskQueue.shift();
  			Promise$1.resolve(task()).then(function () {
  				if (!taskQueue.length) {
  					advance();
  				} else {
  					processTaskQueue(start);
  				}
  			});
  		} else {
  			setTimeout$1(advance);
  		}
  	}
  }

  /**
   * Advance the testQueue to the next test to process. Call done() if testQueue completes.
   */
  function advanceTestQueue() {
  	if (!config.blocking && !config.queue.length && config.depth === 0) {
  		done();
  		return;
  	}

  	var testTasks = config.queue.shift();
  	addToTaskQueue(testTasks());

  	if (priorityCount > 0) {
  		priorityCount--;
  	}

  	advance();
  }

  /**
   * Enqueue the tasks for a test into the task queue.
   * @param {Array} tasksArray
   */
  function addToTaskQueue(tasksArray) {
  	taskQueue.push.apply(taskQueue, toConsumableArray(tasksArray));
  }

  /**
   * Return the number of tasks remaining in the task queue to be processed.
   * @return {Number}
   */
  function taskQueueLength() {
  	return taskQueue.length;
  }

  /**
   * Adds a test to the TestQueue for execution.
   * @param {Function} testTasksFunc
   * @param {Boolean} prioritize
   * @param {String} seed
   */
  function addToTestQueue(testTasksFunc, prioritize, seed) {
  	if (prioritize) {
  		config.queue.splice(priorityCount++, 0, testTasksFunc);
  	} else if (seed) {
  		if (!unitSampler) {
  			unitSampler = unitSamplerGenerator(seed);
  		}

  		// Insert into a random position after all prioritized items
  		var index = Math.floor(unitSampler() * (config.queue.length - priorityCount + 1));
  		config.queue.splice(priorityCount + index, 0, testTasksFunc);
  	} else {
  		config.queue.push(testTasksFunc);
  	}
  }

  /**
   * Creates a seeded "sample" generator which is used for randomizing tests.
   */
  function unitSamplerGenerator(seed) {

  	// 32-bit xorshift, requires only a nonzero seed
  	// http://excamera.com/sphinx/article-xorshift.html
  	var sample = parseInt(generateHash(seed), 16) || -1;
  	return function () {
  		sample ^= sample << 13;
  		sample ^= sample >>> 17;
  		sample ^= sample << 5;

  		// ECMAScript has no unsigned number type
  		if (sample < 0) {
  			sample += 0x100000000;
  		}

  		return sample / 0x100000000;
  	};
  }

  /**
   * This function is called when the ProcessingQueue is done processing all
   * items. It handles emitting the final run events.
   */
  function done() {
  	var storage = config.storage;

  	ProcessingQueue.finished = true;

  	var runtime = now() - config.started;
  	var passed = config.stats.all - config.stats.bad;

  	if (config.stats.all === 0) {

  		if (config.filter && config.filter.length) {
  			throw new Error("No tests matched the filter \"" + config.filter + "\".");
  		}

  		if (config.module && config.module.length) {
  			throw new Error("No tests matched the module \"" + config.module + "\".");
  		}

  		if (config.moduleId && config.moduleId.length) {
  			throw new Error("No tests matched the moduleId \"" + config.moduleId + "\".");
  		}

  		if (config.testId && config.testId.length) {
  			throw new Error("No tests matched the testId \"" + config.testId + "\".");
  		}

  		throw new Error("No tests were run.");
  	}

  	emit("runEnd", globalSuite.end(true));
  	runLoggingCallbacks("done", {
  		passed: passed,
  		failed: config.stats.bad,
  		total: config.stats.all,
  		runtime: runtime
  	}).then(function () {

  		// Clear own storage items if all tests passed
  		if (storage && config.stats.bad === 0) {
  			for (var i = storage.length - 1; i >= 0; i--) {
  				var key = storage.key(i);

  				if (key.indexOf("qunit-test-") === 0) {
  					storage.removeItem(key);
  				}
  			}
  		}
  	});
  }

  var ProcessingQueue = {
  	finished: false,
  	add: addToTestQueue,
  	advance: advance,
  	taskCount: taskQueueLength
  };

  var TestReport = function () {
  	function TestReport(name, suite, options) {
  		classCallCheck(this, TestReport);

  		this.name = name;
  		this.suiteName = suite.name;
  		this.fullName = suite.fullName.concat(name);
  		this.runtime = 0;
  		this.assertions = [];

  		this.skipped = !!options.skip;
  		this.todo = !!options.todo;

  		this.valid = options.valid;

  		this._startTime = 0;
  		this._endTime = 0;

  		suite.pushTest(this);
  	}

  	createClass(TestReport, [{
  		key: "start",
  		value: function start(recordTime) {
  			if (recordTime) {
  				this._startTime = performanceNow();
  				if (performance) {
  					performance.mark("qunit_test_start");
  				}
  			}

  			return {
  				name: this.name,
  				suiteName: this.suiteName,
  				fullName: this.fullName.slice()
  			};
  		}
  	}, {
  		key: "end",
  		value: function end(recordTime) {
  			if (recordTime) {
  				this._endTime = performanceNow();
  				if (performance) {
  					performance.mark("qunit_test_end");

  					var testName = this.fullName.join(" – ");

  					measure("QUnit Test: " + testName, "qunit_test_start", "qunit_test_end");
  				}
  			}

  			return extend(this.start(), {
  				runtime: this.getRuntime(),
  				status: this.getStatus(),
  				errors: this.getFailedAssertions(),
  				assertions: this.getAssertions()
  			});
  		}
  	}, {
  		key: "pushAssertion",
  		value: function pushAssertion(assertion) {
  			this.assertions.push(assertion);
  		}
  	}, {
  		key: "getRuntime",
  		value: function getRuntime() {
  			return this._endTime - this._startTime;
  		}
  	}, {
  		key: "getStatus",
  		value: function getStatus() {
  			if (this.skipped) {
  				return "skipped";
  			}

  			var testPassed = this.getFailedAssertions().length > 0 ? this.todo : !this.todo;

  			if (!testPassed) {
  				return "failed";
  			} else if (this.todo) {
  				return "todo";
  			} else {
  				return "passed";
  			}
  		}
  	}, {
  		key: "getFailedAssertions",
  		value: function getFailedAssertions() {
  			return this.assertions.filter(function (assertion) {
  				return !assertion.passed;
  			});
  		}
  	}, {
  		key: "getAssertions",
  		value: function getAssertions() {
  			return this.assertions.slice();
  		}

  		// Remove actual and expected values from assertions. This is to prevent
  		// leaking memory throughout a test suite.

  	}, {
  		key: "slimAssertions",
  		value: function slimAssertions() {
  			this.assertions = this.assertions.map(function (assertion) {
  				delete assertion.actual;
  				delete assertion.expected;
  				return assertion;
  			});
  		}
  	}]);
  	return TestReport;
  }();

  var focused$1 = false;

  function Test(settings) {
  	var i, l;

  	++Test.count;

  	this.expected = null;
  	this.assertions = [];
  	this.semaphore = 0;
  	this.module = config.currentModule;
  	this.steps = [];
  	this.timeout = undefined;
  	this.errorForStack = new Error();

  	// If a module is skipped, all its tests and the tests of the child suites
  	// should be treated as skipped even if they are defined as `only` or `todo`.
  	// As for `todo` module, all its tests will be treated as `todo` except for
  	// tests defined as `skip` which will be left intact.
  	//
  	// So, if a test is defined as `todo` and is inside a skipped module, we should
  	// then treat that test as if was defined as `skip`.
  	if (this.module.skip) {
  		settings.skip = true;
  		settings.todo = false;

  		// Skipped tests should be left intact
  	} else if (this.module.todo && !settings.skip) {
  		settings.todo = true;
  	}

  	extend(this, settings);

  	this.testReport = new TestReport(settings.testName, this.module.suiteReport, {
  		todo: settings.todo,
  		skip: settings.skip,
  		valid: this.valid()
  	});

  	// Register unique strings
  	for (i = 0, l = this.module.tests; i < l.length; i++) {
  		if (this.module.tests[i].name === this.testName) {
  			this.testName += " ";
  		}
  	}

  	this.testId = generateHash(this.module.name, this.testName);

  	this.module.tests.push({
  		name: this.testName,
  		testId: this.testId,
  		skip: !!settings.skip
  	});

  	if (settings.skip) {

  		// Skipped tests will fully ignore any sent callback
  		this.callback = function () {};
  		this.async = false;
  		this.expected = 0;
  	} else {
  		if (typeof this.callback !== "function") {
  			var method = this.todo ? "todo" : "test";

  			// eslint-disable-next-line max-len
  			throw new TypeError("You must provide a function as a test callback to QUnit." + method + "(\"" + settings.testName + "\")");
  		}

  		this.assert = new Assert(this);
  	}
  }

  Test.count = 0;

  function getNotStartedModules(startModule) {
  	var module = startModule,
  	    modules = [];

  	while (module && module.testsRun === 0) {
  		modules.push(module);
  		module = module.parentModule;
  	}

  	// The above push modules from the child to the parent
  	// return a reversed order with the top being the top most parent module
  	return modules.reverse();
  }

  Test.prototype = {

  	// generating a stack trace can be expensive, so using a getter defers this until we need it
  	get stack() {
  		return extractStacktrace(this.errorForStack, 2);
  	},

  	before: function before() {
  		var _this = this;

  		var module = this.module,
  		    notStartedModules = getNotStartedModules(module);

  		// ensure the callbacks are executed serially for each module
  		var callbackPromises = notStartedModules.reduce(function (promiseChain, startModule) {
  			return promiseChain.then(function () {
  				startModule.stats = { all: 0, bad: 0, started: now() };
  				emit("suiteStart", startModule.suiteReport.start(true));
  				return runLoggingCallbacks("moduleStart", {
  					name: startModule.name,
  					tests: startModule.tests
  				});
  			});
  		}, Promise$1.resolve([]));

  		return callbackPromises.then(function () {
  			config.current = _this;

  			_this.testEnvironment = extend({}, module.testEnvironment);

  			_this.started = now();
  			emit("testStart", _this.testReport.start(true));
  			return runLoggingCallbacks("testStart", {
  				name: _this.testName,
  				module: module.name,
  				testId: _this.testId,
  				previousFailure: _this.previousFailure
  			}).then(function () {
  				if (!config.pollution) {
  					saveGlobal();
  				}
  			});
  		});
  	},

  	run: function run() {
  		var promise;

  		config.current = this;

  		this.callbackStarted = now();

  		if (config.notrycatch) {
  			runTest(this);
  			return;
  		}

  		try {
  			runTest(this);
  		} catch (e) {
  			this.pushFailure("Died on test #" + (this.assertions.length + 1) + " " + this.stack + ": " + (e.message || e), extractStacktrace(e, 0));

  			// Else next test will carry the responsibility
  			saveGlobal();

  			// Restart the tests if they're blocking
  			if (config.blocking) {
  				internalRecover(this);
  			}
  		}

  		function runTest(test) {
  			promise = test.callback.call(test.testEnvironment, test.assert);
  			test.resolvePromise(promise);

  			// If the test has a "lock" on it, but the timeout is 0, then we push a
  			// failure as the test should be synchronous.
  			if (test.timeout === 0 && test.semaphore !== 0) {
  				pushFailure("Test did not finish synchronously even though assert.timeout( 0 ) was used.", sourceFromStacktrace(2));
  			}
  		}
  	},

  	after: function after() {
  		checkPollution();
  	},

  	queueHook: function queueHook(hook, hookName, hookOwner) {
  		var _this2 = this;

  		var callHook = function callHook() {
  			var promise = hook.call(_this2.testEnvironment, _this2.assert);
  			_this2.resolvePromise(promise, hookName);
  		};

  		var runHook = function runHook() {
  			if (hookName === "before") {
  				if (hookOwner.unskippedTestsRun !== 0) {
  					return;
  				}

  				_this2.preserveEnvironment = true;
  			}

  			// The 'after' hook should only execute when there are not tests left and
  			// when the 'after' and 'finish' tasks are the only tasks left to process
  			if (hookName === "after" && hookOwner.unskippedTestsRun !== numberOfUnskippedTests(hookOwner) - 1 && (config.queue.length > 0 || ProcessingQueue.taskCount() > 2)) {
  				return;
  			}

  			config.current = _this2;
  			if (config.notrycatch) {
  				callHook();
  				return;
  			}
  			try {
  				callHook();
  			} catch (error) {
  				_this2.pushFailure(hookName + " failed on " + _this2.testName + ": " + (error.message || error), extractStacktrace(error, 0));
  			}
  		};

  		return runHook;
  	},


  	// Currently only used for module level hooks, can be used to add global level ones
  	hooks: function hooks(handler) {
  		var hooks = [];

  		function processHooks(test, module) {
  			if (module.parentModule) {
  				processHooks(test, module.parentModule);
  			}

  			if (module.hooks[handler].length) {
  				for (var i = 0; i < module.hooks[handler].length; i++) {
  					hooks.push(test.queueHook(module.hooks[handler][i], handler, module));
  				}
  			}
  		}

  		// Hooks are ignored on skipped tests
  		if (!this.skip) {
  			processHooks(this, this.module);
  		}

  		return hooks;
  	},


  	finish: function finish() {
  		config.current = this;

  		// Release the test callback to ensure that anything referenced has been
  		// released to be garbage collected.
  		this.callback = undefined;

  		if (this.steps.length) {
  			var stepsList = this.steps.join(", ");
  			this.pushFailure("Expected assert.verifySteps() to be called before end of test " + ("after using assert.step(). Unverified steps: " + stepsList), this.stack);
  		}

  		if (config.requireExpects && this.expected === null) {
  			this.pushFailure("Expected number of assertions to be defined, but expect() was " + "not called.", this.stack);
  		} else if (this.expected !== null && this.expected !== this.assertions.length) {
  			this.pushFailure("Expected " + this.expected + " assertions, but " + this.assertions.length + " were run", this.stack);
  		} else if (this.expected === null && !this.assertions.length) {
  			this.pushFailure("Expected at least one assertion, but none were run - call " + "expect(0) to accept zero assertions.", this.stack);
  		}

  		var i,
  		    module = this.module,
  		    moduleName = module.name,
  		    testName = this.testName,
  		    skipped = !!this.skip,
  		    todo = !!this.todo,
  		    bad = 0,
  		    storage = config.storage;

  		this.runtime = now() - this.started;

  		config.stats.all += this.assertions.length;
  		module.stats.all += this.assertions.length;

  		for (i = 0; i < this.assertions.length; i++) {
  			if (!this.assertions[i].result) {
  				bad++;
  				config.stats.bad++;
  				module.stats.bad++;
  			}
  		}

  		notifyTestsRan(module, skipped);

  		// Store result when possible
  		if (storage) {
  			if (bad) {
  				storage.setItem("qunit-test-" + moduleName + "-" + testName, bad);
  			} else {
  				storage.removeItem("qunit-test-" + moduleName + "-" + testName);
  			}
  		}

  		// After emitting the js-reporters event we cleanup the assertion data to
  		// avoid leaking it. It is not used by the legacy testDone callbacks.
  		emit("testEnd", this.testReport.end(true));
  		this.testReport.slimAssertions();
  		var test = this;

  		return runLoggingCallbacks("testDone", {
  			name: testName,
  			module: moduleName,
  			skipped: skipped,
  			todo: todo,
  			failed: bad,
  			passed: this.assertions.length - bad,
  			total: this.assertions.length,
  			runtime: skipped ? 0 : this.runtime,

  			// HTML Reporter use
  			assertions: this.assertions,
  			testId: this.testId,

  			// Source of Test
  			// generating stack trace is expensive, so using a getter will help defer this until we need it
  			get source() {
  				return test.stack;
  			}
  		}).then(function () {
  			if (module.testsRun === numberOfTests(module)) {
  				var completedModules = [module];

  				// Check if the parent modules, iteratively, are done. If that the case,
  				// we emit the `suiteEnd` event and trigger `moduleDone` callback.
  				var parent = module.parentModule;
  				while (parent && parent.testsRun === numberOfTests(parent)) {
  					completedModules.push(parent);
  					parent = parent.parentModule;
  				}

  				return completedModules.reduce(function (promiseChain, completedModule) {
  					return promiseChain.then(function () {
  						return logSuiteEnd(completedModule);
  					});
  				}, Promise$1.resolve([]));
  			}
  		}).then(function () {
  			config.current = undefined;
  		});

  		function logSuiteEnd(module) {

  			// Reset `module.hooks` to ensure that anything referenced in these hooks
  			// has been released to be garbage collected.
  			module.hooks = {};

  			emit("suiteEnd", module.suiteReport.end(true));
  			return runLoggingCallbacks("moduleDone", {
  				name: module.name,
  				tests: module.tests,
  				failed: module.stats.bad,
  				passed: module.stats.all - module.stats.bad,
  				total: module.stats.all,
  				runtime: now() - module.stats.started
  			});
  		}
  	},

  	preserveTestEnvironment: function preserveTestEnvironment() {
  		if (this.preserveEnvironment) {
  			this.module.testEnvironment = this.testEnvironment;
  			this.testEnvironment = extend({}, this.module.testEnvironment);
  		}
  	},

  	queue: function queue() {
  		var test = this;

  		if (!this.valid()) {
  			return;
  		}

  		function runTest() {
  			return [function () {
  				return test.before();
  			}].concat(toConsumableArray(test.hooks("before")), [function () {
  				test.preserveTestEnvironment();
  			}], toConsumableArray(test.hooks("beforeEach")), [function () {
  				test.run();
  			}], toConsumableArray(test.hooks("afterEach").reverse()), toConsumableArray(test.hooks("after").reverse()), [function () {
  				test.after();
  			}, function () {
  				return test.finish();
  			}]);
  		}

  		var previousFailCount = config.storage && +config.storage.getItem("qunit-test-" + this.module.name + "-" + this.testName);

  		// Prioritize previously failed tests, detected from storage
  		var prioritize = config.reorder && !!previousFailCount;

  		this.previousFailure = !!previousFailCount;

  		ProcessingQueue.add(runTest, prioritize, config.seed);

  		// If the queue has already finished, we manually process the new test
  		if (ProcessingQueue.finished) {
  			ProcessingQueue.advance();
  		}
  	},


  	pushResult: function pushResult(resultInfo) {
  		if (this !== config.current) {
  			throw new Error("Assertion occurred after test had finished.");
  		}

  		// Destructure of resultInfo = { result, actual, expected, message, negative }
  		var source,
  		    details = {
  			module: this.module.name,
  			name: this.testName,
  			result: resultInfo.result,
  			message: resultInfo.message,
  			actual: resultInfo.actual,
  			testId: this.testId,
  			negative: resultInfo.negative || false,
  			runtime: now() - this.started,
  			todo: !!this.todo
  		};

  		if (hasOwn.call(resultInfo, "expected")) {
  			details.expected = resultInfo.expected;
  		}

  		if (!resultInfo.result) {
  			source = resultInfo.source || sourceFromStacktrace();

  			if (source) {
  				details.source = source;
  			}
  		}

  		this.logAssertion(details);

  		this.assertions.push({
  			result: !!resultInfo.result,
  			message: resultInfo.message
  		});
  	},

  	pushFailure: function pushFailure(message, source, actual) {
  		if (!(this instanceof Test)) {
  			throw new Error("pushFailure() assertion outside test context, was " + sourceFromStacktrace(2));
  		}

  		this.pushResult({
  			result: false,
  			message: message || "error",
  			actual: actual || null,
  			source: source
  		});
  	},

  	/**
    * Log assertion details using both the old QUnit.log interface and
    * QUnit.on( "assertion" ) interface.
    *
    * @private
    */
  	logAssertion: function logAssertion(details) {
  		runLoggingCallbacks("log", details);

  		var assertion = {
  			passed: details.result,
  			actual: details.actual,
  			expected: details.expected,
  			message: details.message,
  			stack: details.source,
  			todo: details.todo
  		};
  		this.testReport.pushAssertion(assertion);
  		emit("assertion", assertion);
  	},


  	resolvePromise: function resolvePromise(promise, phase) {
  		var then,
  		    resume,
  		    message,
  		    test = this;
  		if (promise != null) {
  			then = promise.then;
  			if (objectType(then) === "function") {
  				resume = internalStop(test);
  				if (config.notrycatch) {
  					then.call(promise, function () {
  						resume();
  					});
  				} else {
  					then.call(promise, function () {
  						resume();
  					}, function (error) {
  						message = "Promise rejected " + (!phase ? "during" : phase.replace(/Each$/, "")) + " \"" + test.testName + "\": " + (error && error.message || error);
  						test.pushFailure(message, extractStacktrace(error, 0));

  						// Else next test will carry the responsibility
  						saveGlobal();

  						// Unblock
  						internalRecover(test);
  					});
  				}
  			}
  		}
  	},

  	valid: function valid() {
  		var filter = config.filter,
  		    regexFilter = /^(!?)\/([\w\W]*)\/(i?$)/.exec(filter),
  		    module = config.module && config.module.toLowerCase(),
  		    fullName = this.module.name + ": " + this.testName;

  		function moduleChainNameMatch(testModule) {
  			var testModuleName = testModule.name ? testModule.name.toLowerCase() : null;
  			if (testModuleName === module) {
  				return true;
  			} else if (testModule.parentModule) {
  				return moduleChainNameMatch(testModule.parentModule);
  			} else {
  				return false;
  			}
  		}

  		function moduleChainIdMatch(testModule) {
  			return inArray(testModule.moduleId, config.moduleId) || testModule.parentModule && moduleChainIdMatch(testModule.parentModule);
  		}

  		// Internally-generated tests are always valid
  		if (this.callback && this.callback.validTest) {
  			return true;
  		}

  		if (config.moduleId && config.moduleId.length > 0 && !moduleChainIdMatch(this.module)) {

  			return false;
  		}

  		if (config.testId && config.testId.length > 0 && !inArray(this.testId, config.testId)) {

  			return false;
  		}

  		if (module && !moduleChainNameMatch(this.module)) {
  			return false;
  		}

  		if (!filter) {
  			return true;
  		}

  		return regexFilter ? this.regexFilter(!!regexFilter[1], regexFilter[2], regexFilter[3], fullName) : this.stringFilter(filter, fullName);
  	},

  	regexFilter: function regexFilter(exclude, pattern, flags, fullName) {
  		var regex = new RegExp(pattern, flags);
  		var match = regex.test(fullName);

  		return match !== exclude;
  	},

  	stringFilter: function stringFilter(filter, fullName) {
  		filter = filter.toLowerCase();
  		fullName = fullName.toLowerCase();

  		var include = filter.charAt(0) !== "!";
  		if (!include) {
  			filter = filter.slice(1);
  		}

  		// If the filter matches, we need to honour include
  		if (fullName.indexOf(filter) !== -1) {
  			return include;
  		}

  		// Otherwise, do the opposite
  		return !include;
  	}
  };

  function pushFailure() {
  	if (!config.current) {
  		throw new Error("pushFailure() assertion outside test context, in " + sourceFromStacktrace(2));
  	}

  	// Gets current test obj
  	var currentTest = config.current;

  	return currentTest.pushFailure.apply(currentTest, arguments);
  }

  function saveGlobal() {
  	config.pollution = [];

  	if (config.noglobals) {
  		for (var key in global$1) {
  			if (hasOwn.call(global$1, key)) {

  				// In Opera sometimes DOM element ids show up here, ignore them
  				if (/^qunit-test-output/.test(key)) {
  					continue;
  				}
  				config.pollution.push(key);
  			}
  		}
  	}
  }

  function checkPollution() {
  	var newGlobals,
  	    deletedGlobals,
  	    old = config.pollution;

  	saveGlobal();

  	newGlobals = diff(config.pollution, old);
  	if (newGlobals.length > 0) {
  		pushFailure("Introduced global variable(s): " + newGlobals.join(", "));
  	}

  	deletedGlobals = diff(old, config.pollution);
  	if (deletedGlobals.length > 0) {
  		pushFailure("Deleted global variable(s): " + deletedGlobals.join(", "));
  	}
  }

  // Will be exposed as QUnit.test
  function test(testName, callback) {
  	if (focused$1) {
  		return;
  	}

  	var newTest = new Test({
  		testName: testName,
  		callback: callback
  	});

  	newTest.queue();
  }

  function todo(testName, callback) {
  	if (focused$1) {
  		return;
  	}

  	var newTest = new Test({
  		testName: testName,
  		callback: callback,
  		todo: true
  	});

  	newTest.queue();
  }

  // Will be exposed as QUnit.skip
  function skip(testName) {
  	if (focused$1) {
  		return;
  	}

  	var test = new Test({
  		testName: testName,
  		skip: true
  	});

  	test.queue();
  }

  // Will be exposed as QUnit.only
  function only(testName, callback) {
  	if (focused$1) {
  		return;
  	}

  	config.queue.length = 0;
  	focused$1 = true;

  	var newTest = new Test({
  		testName: testName,
  		callback: callback
  	});

  	newTest.queue();
  }

  // Resets config.timeout with a new timeout duration.
  function resetTestTimeout(timeoutDuration) {
  	clearTimeout(config.timeout);
  	config.timeout = setTimeout$1(config.timeoutHandler(timeoutDuration), timeoutDuration);
  }

  // Put a hold on processing and return a function that will release it.
  function internalStop(test) {
  	var released = false;
  	test.semaphore += 1;
  	config.blocking = true;

  	// Set a recovery timeout, if so configured.
  	if (defined.setTimeout) {
  		var timeoutDuration = void 0;

  		if (typeof test.timeout === "number") {
  			timeoutDuration = test.timeout;
  		} else if (typeof config.testTimeout === "number") {
  			timeoutDuration = config.testTimeout;
  		}

  		if (typeof timeoutDuration === "number" && timeoutDuration > 0) {
  			clearTimeout(config.timeout);
  			config.timeoutHandler = function (timeout) {
  				return function () {
  					pushFailure("Test took longer than " + timeout + "ms; test timed out.", sourceFromStacktrace(2));
  					released = true;
  					internalRecover(test);
  				};
  			};
  			config.timeout = setTimeout$1(config.timeoutHandler(timeoutDuration), timeoutDuration);
  		}
  	}

  	return function resume() {
  		if (released) {
  			return;
  		}

  		released = true;
  		test.semaphore -= 1;
  		internalStart(test);
  	};
  }

  // Forcefully release all processing holds.
  function internalRecover(test) {
  	test.semaphore = 0;
  	internalStart(test);
  }

  // Release a processing hold, scheduling a resumption attempt if no holds remain.
  function internalStart(test) {

  	// If semaphore is non-numeric, throw error
  	if (isNaN(test.semaphore)) {
  		test.semaphore = 0;

  		pushFailure("Invalid value on test.semaphore", sourceFromStacktrace(2));
  		return;
  	}

  	// Don't start until equal number of stop-calls
  	if (test.semaphore > 0) {
  		return;
  	}

  	// Throw an Error if start is called more often than stop
  	if (test.semaphore < 0) {
  		test.semaphore = 0;

  		pushFailure("Tried to restart test while already started (test's semaphore was 0 already)", sourceFromStacktrace(2));
  		return;
  	}

  	// Add a slight delay to allow more assertions etc.
  	if (defined.setTimeout) {
  		if (config.timeout) {
  			clearTimeout(config.timeout);
  		}
  		config.timeout = setTimeout$1(function () {
  			if (test.semaphore > 0) {
  				return;
  			}

  			if (config.timeout) {
  				clearTimeout(config.timeout);
  			}

  			begin();
  		});
  	} else {
  		begin();
  	}
  }

  function collectTests(module) {
  	var tests = [].concat(module.tests);
  	var modules = [].concat(toConsumableArray(module.childModules));

  	// Do a breadth-first traversal of the child modules
  	while (modules.length) {
  		var nextModule = modules.shift();
  		tests.push.apply(tests, nextModule.tests);
  		modules.push.apply(modules, toConsumableArray(nextModule.childModules));
  	}

  	return tests;
  }

  function numberOfTests(module) {
  	return collectTests(module).length;
  }

  function numberOfUnskippedTests(module) {
  	return collectTests(module).filter(function (test) {
  		return !test.skip;
  	}).length;
  }

  function notifyTestsRan(module, skipped) {
  	module.testsRun++;
  	if (!skipped) {
  		module.unskippedTestsRun++;
  	}
  	while (module = module.parentModule) {
  		module.testsRun++;
  		if (!skipped) {
  			module.unskippedTestsRun++;
  		}
  	}
  }

  var Assert = function () {
  	function Assert(testContext) {
  		classCallCheck(this, Assert);

  		this.test = testContext;
  	}

  	// Assert helpers

  	createClass(Assert, [{
  		key: "timeout",
  		value: function timeout(duration) {
  			if (typeof duration !== "number") {
  				throw new Error("You must pass a number as the duration to assert.timeout");
  			}

  			this.test.timeout = duration;

  			// If a timeout has been set, clear it and reset with the new duration
  			if (config.timeout) {
  				clearTimeout(config.timeout);

  				if (config.timeoutHandler && this.test.timeout > 0) {
  					resetTestTimeout(this.test.timeout);
  				}
  			}
  		}

  		// Documents a "step", which is a string value, in a test as a passing assertion

  	}, {
  		key: "step",
  		value: function step(message) {
  			var assertionMessage = message;
  			var result = !!message;

  			this.test.steps.push(message);

  			if (objectType(message) === "undefined" || message === "") {
  				assertionMessage = "You must provide a message to assert.step";
  			} else if (objectType(message) !== "string") {
  				assertionMessage = "You must provide a string value to assert.step";
  				result = false;
  			}

  			this.pushResult({
  				result: result,
  				message: assertionMessage
  			});
  		}

  		// Verifies the steps in a test match a given array of string values

  	}, {
  		key: "verifySteps",
  		value: function verifySteps(steps, message) {

  			// Since the steps array is just string values, we can clone with slice
  			var actualStepsClone = this.test.steps.slice();
  			this.deepEqual(actualStepsClone, steps, message);
  			this.test.steps.length = 0;
  		}

  		// Specify the number of expected assertions to guarantee that failed test
  		// (no assertions are run at all) don't slip through.

  	}, {
  		key: "expect",
  		value: function expect(asserts) {
  			if (arguments.length === 1) {
  				this.test.expected = asserts;
  			} else {
  				return this.test.expected;
  			}
  		}

  		// Put a hold on processing and return a function that will release it a maximum of once.

  	}, {
  		key: "async",
  		value: function async(count) {
  			var test$$1 = this.test;

  			var popped = false,
  			    acceptCallCount = count;

  			if (typeof acceptCallCount === "undefined") {
  				acceptCallCount = 1;
  			}

  			var resume = internalStop(test$$1);

  			return function done() {
  				if (config.current !== test$$1) {
  					throw Error("assert.async callback called after test finished.");
  				}

  				if (popped) {
  					test$$1.pushFailure("Too many calls to the `assert.async` callback", sourceFromStacktrace(2));
  					return;
  				}

  				acceptCallCount -= 1;
  				if (acceptCallCount > 0) {
  					return;
  				}

  				popped = true;
  				resume();
  			};
  		}

  		// Exports test.push() to the user API
  		// Alias of pushResult.

  	}, {
  		key: "push",
  		value: function push(result, actual, expected, message, negative) {
  			Logger.warn("assert.push is deprecated and will be removed in QUnit 3.0." + " Please use assert.pushResult instead (https://api.qunitjs.com/assert/pushResult).");

  			var currentAssert = this instanceof Assert ? this : config.current.assert;
  			return currentAssert.pushResult({
  				result: result,
  				actual: actual,
  				expected: expected,
  				message: message,
  				negative: negative
  			});
  		}
  	}, {
  		key: "pushResult",
  		value: function pushResult(resultInfo) {

  			// Destructure of resultInfo = { result, actual, expected, message, negative }
  			var assert = this;
  			var currentTest = assert instanceof Assert && assert.test || config.current;

  			// Backwards compatibility fix.
  			// Allows the direct use of global exported assertions and QUnit.assert.*
  			// Although, it's use is not recommended as it can leak assertions
  			// to other tests from async tests, because we only get a reference to the current test,
  			// not exactly the test where assertion were intended to be called.
  			if (!currentTest) {
  				throw new Error("assertion outside test context, in " + sourceFromStacktrace(2));
  			}

  			if (!(assert instanceof Assert)) {
  				assert = currentTest.assert;
  			}

  			return assert.test.pushResult(resultInfo);
  		}
  	}, {
  		key: "ok",
  		value: function ok(result, message) {
  			if (!message) {
  				message = result ? "okay" : "failed, expected argument to be truthy, was: " + dump.parse(result);
  			}

  			this.pushResult({
  				result: !!result,
  				actual: result,
  				expected: true,
  				message: message
  			});
  		}
  	}, {
  		key: "notOk",
  		value: function notOk(result, message) {
  			if (!message) {
  				message = !result ? "okay" : "failed, expected argument to be falsy, was: " + dump.parse(result);
  			}

  			this.pushResult({
  				result: !result,
  				actual: result,
  				expected: false,
  				message: message
  			});
  		}
  	}, {
  		key: "equal",
  		value: function equal(actual, expected, message) {

  			// eslint-disable-next-line eqeqeq
  			var result = expected == actual;

  			this.pushResult({
  				result: result,
  				actual: actual,
  				expected: expected,
  				message: message
  			});
  		}
  	}, {
  		key: "notEqual",
  		value: function notEqual(actual, expected, message) {

  			// eslint-disable-next-line eqeqeq
  			var result = expected != actual;

  			this.pushResult({
  				result: result,
  				actual: actual,
  				expected: expected,
  				message: message,
  				negative: true
  			});
  		}
  	}, {
  		key: "propEqual",
  		value: function propEqual(actual, expected, message) {
  			actual = objectValues(actual);
  			expected = objectValues(expected);

  			this.pushResult({
  				result: equiv(actual, expected),
  				actual: actual,
  				expected: expected,
  				message: message
  			});
  		}
  	}, {
  		key: "notPropEqual",
  		value: function notPropEqual(actual, expected, message) {
  			actual = objectValues(actual);
  			expected = objectValues(expected);

  			this.pushResult({
  				result: !equiv(actual, expected),
  				actual: actual,
  				expected: expected,
  				message: message,
  				negative: true
  			});
  		}
  	}, {
  		key: "deepEqual",
  		value: function deepEqual(actual, expected, message) {
  			this.pushResult({
  				result: equiv(actual, expected),
  				actual: actual,
  				expected: expected,
  				message: message
  			});
  		}
  	}, {
  		key: "notDeepEqual",
  		value: function notDeepEqual(actual, expected, message) {
  			this.pushResult({
  				result: !equiv(actual, expected),
  				actual: actual,
  				expected: expected,
  				message: message,
  				negative: true
  			});
  		}
  	}, {
  		key: "strictEqual",
  		value: function strictEqual(actual, expected, message) {
  			this.pushResult({
  				result: expected === actual,
  				actual: actual,
  				expected: expected,
  				message: message
  			});
  		}
  	}, {
  		key: "notStrictEqual",
  		value: function notStrictEqual(actual, expected, message) {
  			this.pushResult({
  				result: expected !== actual,
  				actual: actual,
  				expected: expected,
  				message: message,
  				negative: true
  			});
  		}
  	}, {
  		key: "throws",
  		value: function throws(block, expected, message) {
  			var actual = void 0,
  			    result = false;

  			var currentTest = this instanceof Assert && this.test || config.current;

  			// 'expected' is optional unless doing string comparison
  			if (objectType(expected) === "string") {
  				if (message == null) {
  					message = expected;
  					expected = null;
  				} else {
  					throw new Error("throws/raises does not accept a string value for the expected argument.\n" + "Use a non-string object value (e.g. regExp) instead if it's necessary.");
  				}
  			}

  			currentTest.ignoreGlobalErrors = true;
  			try {
  				block.call(currentTest.testEnvironment);
  			} catch (e) {
  				actual = e;
  			}
  			currentTest.ignoreGlobalErrors = false;

  			if (actual) {
  				var expectedType = objectType(expected);

  				// We don't want to validate thrown error
  				if (!expected) {
  					result = true;

  					// Expected is a regexp
  				} else if (expectedType === "regexp") {
  					result = expected.test(errorString(actual));

  					// Log the string form of the regexp
  					expected = String(expected);

  					// Expected is a constructor, maybe an Error constructor
  				} else if (expectedType === "function" && actual instanceof expected) {
  					result = true;

  					// Expected is an Error object
  				} else if (expectedType === "object") {
  					result = actual instanceof expected.constructor && actual.name === expected.name && actual.message === expected.message;

  					// Log the string form of the Error object
  					expected = errorString(expected);

  					// Expected is a validation function which returns true if validation passed
  				} else if (expectedType === "function" && expected.call({}, actual) === true) {
  					expected = null;
  					result = true;
  				}
  			}

  			currentTest.assert.pushResult({
  				result: result,

  				// undefined if it didn't throw
  				actual: actual && errorString(actual),
  				expected: expected,
  				message: message
  			});
  		}
  	}, {
  		key: "rejects",
  		value: function rejects(promise, expected, message) {
  			var result = false;

  			var currentTest = this instanceof Assert && this.test || config.current;

  			// 'expected' is optional unless doing string comparison
  			if (objectType(expected) === "string") {
  				if (message === undefined) {
  					message = expected;
  					expected = undefined;
  				} else {
  					message = "assert.rejects does not accept a string value for the expected " + "argument.\nUse a non-string object value (e.g. validator function) instead " + "if necessary.";

  					currentTest.assert.pushResult({
  						result: false,
  						message: message
  					});

  					return;
  				}
  			}

  			var then = promise && promise.then;
  			if (objectType(then) !== "function") {
  				var _message = "The value provided to `assert.rejects` in " + "\"" + currentTest.testName + "\" was not a promise.";

  				currentTest.assert.pushResult({
  					result: false,
  					message: _message,
  					actual: promise
  				});

  				return;
  			}

  			var done = this.async();

  			return then.call(promise, function handleFulfillment() {
  				var message = "The promise returned by the `assert.rejects` callback in " + "\"" + currentTest.testName + "\" did not reject.";

  				currentTest.assert.pushResult({
  					result: false,
  					message: message,
  					actual: promise
  				});

  				done();
  			}, function handleRejection(actual) {
  				var expectedType = objectType(expected);

  				// We don't want to validate
  				if (expected === undefined) {
  					result = true;

  					// Expected is a regexp
  				} else if (expectedType === "regexp") {
  					result = expected.test(errorString(actual));

  					// Log the string form of the regexp
  					expected = String(expected);

  					// Expected is a constructor, maybe an Error constructor
  				} else if (expectedType === "function" && actual instanceof expected) {
  					result = true;

  					// Expected is an Error object
  				} else if (expectedType === "object") {
  					result = actual instanceof expected.constructor && actual.name === expected.name && actual.message === expected.message;

  					// Log the string form of the Error object
  					expected = errorString(expected);

  					// Expected is a validation function which returns true if validation passed
  				} else {
  					if (expectedType === "function") {
  						result = expected.call({}, actual) === true;
  						expected = null;

  						// Expected is some other invalid type
  					} else {
  						result = false;
  						message = "invalid expected value provided to `assert.rejects` " + "callback in \"" + currentTest.testName + "\": " + expectedType + ".";
  					}
  				}

  				currentTest.assert.pushResult({
  					result: result,

  					// leave rejection value of undefined as-is
  					actual: actual && errorString(actual),
  					expected: expected,
  					message: message
  				});

  				done();
  			});
  		}
  	}]);
  	return Assert;
  }();

  // Provide an alternative to assert.throws(), for environments that consider throws a reserved word
  // Known to us are: Closure Compiler, Narwhal
  // eslint-disable-next-line dot-notation


  Assert.prototype.raises = Assert.prototype["throws"];

  /**
   * Converts an error into a simple string for comparisons.
   *
   * @param {Error|Object} error
   * @return {String}
   */
  function errorString(error) {
  	var resultErrorString = error.toString();

  	// If the error wasn't a subclass of Error but something like
  	// an object literal with name and message properties...
  	if (resultErrorString.substring(0, 7) === "[object") {
  		var name = error.name ? error.name.toString() : "Error";
  		var message = error.message ? error.message.toString() : "";

  		if (name && message) {
  			return name + ": " + message;
  		} else if (name) {
  			return name;
  		} else if (message) {
  			return message;
  		} else {
  			return "Error";
  		}
  	} else {
  		return resultErrorString;
  	}
  }

  /* global module, exports, define */
  function exportQUnit(QUnit) {

  	if (defined.document) {

  		// QUnit may be defined when it is preconfigured but then only QUnit and QUnit.config may be defined.
  		if (window$1.QUnit && window$1.QUnit.version) {
  			throw new Error("QUnit has already been defined.");
  		}

  		window$1.QUnit = QUnit;
  	}

  	// For nodejs
  	if (typeof module !== "undefined" && module && module.exports) {
  		module.exports = QUnit;

  		// For consistency with CommonJS environments' exports
  		module.exports.QUnit = QUnit;
  	}

  	// For CommonJS with exports, but without module.exports, like Rhino
  	if (typeof exports !== "undefined" && exports) {
  		exports.QUnit = QUnit;
  	}

  	if (typeof define === "function" && define.amd) {
  		define(function () {
  			return QUnit;
  		});
  		QUnit.config.autostart = false;
  	}

  	// For Web/Service Workers
  	if (self$1 && self$1.WorkerGlobalScope && self$1 instanceof self$1.WorkerGlobalScope) {
  		self$1.QUnit = QUnit;
  	}
  }

  // Handle an unhandled exception. By convention, returns true if further
  // error handling should be suppressed and false otherwise.
  // In this case, we will only suppress further error handling if the
  // "ignoreGlobalErrors" configuration option is enabled.
  function onError(error) {
  	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
  		args[_key - 1] = arguments[_key];
  	}

  	if (config.current) {
  		if (config.current.ignoreGlobalErrors) {
  			return true;
  		}
  		pushFailure.apply(undefined, [error.message, error.stacktrace || error.fileName + ":" + error.lineNumber].concat(args));
  	} else {
  		test("global failure", extend(function () {
  			pushFailure.apply(undefined, [error.message, error.stacktrace || error.fileName + ":" + error.lineNumber].concat(args));
  		}, { validTest: true }));
  	}

  	return false;
  }

  // Handle an unhandled rejection
  function onUnhandledRejection(reason) {
  	var resultInfo = {
  		result: false,
  		message: reason.message || "error",
  		actual: reason,
  		source: reason.stack || sourceFromStacktrace(3)
  	};

  	var currentTest = config.current;
  	if (currentTest) {
  		currentTest.assert.pushResult(resultInfo);
  	} else {
  		test("global failure", extend(function (assert) {
  			assert.pushResult(resultInfo);
  		}, { validTest: true }));
  	}
  }

  var QUnit = {};
  var globalSuite = new SuiteReport();

  // The initial "currentModule" represents the global (or top-level) module that
  // is not explicitly defined by the user, therefore we add the "globalSuite" to
  // it since each module has a suiteReport associated with it.
  config.currentModule.suiteReport = globalSuite;

  var globalStartCalled = false;
  var runStarted = false;

  // Figure out if we're running the tests from a server or not
  QUnit.isLocal = !(defined.document && window$1.location.protocol !== "file:");

  // Expose the current QUnit version
  QUnit.version = "2.9.3";

  extend(QUnit, {
  	on: on,

  	module: module$1,

  	test: test,

  	todo: todo,

  	skip: skip,

  	only: only,

  	start: function start(count) {
  		var globalStartAlreadyCalled = globalStartCalled;

  		if (!config.current) {
  			globalStartCalled = true;

  			if (runStarted) {
  				throw new Error("Called start() while test already started running");
  			} else if (globalStartAlreadyCalled || count > 1) {
  				throw new Error("Called start() outside of a test context too many times");
  			} else if (config.autostart) {
  				throw new Error("Called start() outside of a test context when " + "QUnit.config.autostart was true");
  			} else if (!config.pageLoaded) {

  				// The page isn't completely loaded yet, so we set autostart and then
  				// load if we're in Node or wait for the browser's load event.
  				config.autostart = true;

  				// Starts from Node even if .load was not previously called. We still return
  				// early otherwise we'll wind up "beginning" twice.
  				if (!defined.document) {
  					QUnit.load();
  				}

  				return;
  			}
  		} else {
  			throw new Error("QUnit.start cannot be called inside a test context.");
  		}

  		scheduleBegin();
  	},

  	config: config,

  	is: is,

  	objectType: objectType,

  	extend: extend,

  	load: function load() {
  		config.pageLoaded = true;

  		// Initialize the configuration options
  		extend(config, {
  			stats: { all: 0, bad: 0 },
  			started: 0,
  			updateRate: 1000,
  			autostart: true,
  			filter: ""
  		}, true);

  		if (!runStarted) {
  			config.blocking = false;

  			if (config.autostart) {
  				scheduleBegin();
  			}
  		}
  	},

  	stack: function stack(offset) {
  		offset = (offset || 0) + 2;
  		return sourceFromStacktrace(offset);
  	},

  	onError: onError,

  	onUnhandledRejection: onUnhandledRejection
  });

  QUnit.pushFailure = pushFailure;
  QUnit.assert = Assert.prototype;
  QUnit.equiv = equiv;
  QUnit.dump = dump;

  registerLoggingCallbacks(QUnit);

  function scheduleBegin() {

  	runStarted = true;

  	// Add a slight delay to allow definition of more modules and tests.
  	if (defined.setTimeout) {
  		setTimeout$1(function () {
  			begin();
  		});
  	} else {
  		begin();
  	}
  }

  function unblockAndAdvanceQueue() {
  	config.blocking = false;
  	ProcessingQueue.advance();
  }

  function begin() {
  	var i,
  	    l,
  	    modulesLog = [];

  	// If the test run hasn't officially begun yet
  	if (!config.started) {

  		// Record the time of the test run's beginning
  		config.started = now();

  		// Delete the loose unnamed module if unused.
  		if (config.modules[0].name === "" && config.modules[0].tests.length === 0) {
  			config.modules.shift();
  		}

  		// Avoid unnecessary information by not logging modules' test environments
  		for (i = 0, l = config.modules.length; i < l; i++) {
  			modulesLog.push({
  				name: config.modules[i].name,
  				tests: config.modules[i].tests
  			});
  		}

  		// The test run is officially beginning now
  		emit("runStart", globalSuite.start(true));
  		runLoggingCallbacks("begin", {
  			totalTests: Test.count,
  			modules: modulesLog
  		}).then(unblockAndAdvanceQueue);
  	} else {
  		unblockAndAdvanceQueue();
  	}
  }

  exportQUnit(QUnit);

  (function () {

  	if (typeof window$1 === "undefined" || typeof document$1 === "undefined") {
  		return;
  	}

  	var config = QUnit.config,
  	    hasOwn = Object.prototype.hasOwnProperty;

  	// Stores fixture HTML for resetting later
  	function storeFixture() {

  		// Avoid overwriting user-defined values
  		if (hasOwn.call(config, "fixture")) {
  			return;
  		}

  		var fixture = document$1.getElementById("qunit-fixture");
  		if (fixture) {
  			config.fixture = fixture.cloneNode(true);
  		}
  	}

  	QUnit.begin(storeFixture);

  	// Resets the fixture DOM element if available.
  	function resetFixture() {
  		if (config.fixture == null) {
  			return;
  		}

  		var fixture = document$1.getElementById("qunit-fixture");
  		var resetFixtureType = _typeof(config.fixture);
  		if (resetFixtureType === "string") {

  			// support user defined values for `config.fixture`
  			var newFixture = document$1.createElement("div");
  			newFixture.setAttribute("id", "qunit-fixture");
  			newFixture.innerHTML = config.fixture;
  			fixture.parentNode.replaceChild(newFixture, fixture);
  		} else {
  			var clonedFixture = config.fixture.cloneNode(true);
  			fixture.parentNode.replaceChild(clonedFixture, fixture);
  		}
  	}

  	QUnit.testStart(resetFixture);
  })();

  (function () {

  	// Only interact with URLs via window.location
  	var location = typeof window$1 !== "undefined" && window$1.location;
  	if (!location) {
  		return;
  	}

  	var urlParams = getUrlParams();

  	QUnit.urlParams = urlParams;

  	// Match module/test by inclusion in an array
  	QUnit.config.moduleId = [].concat(urlParams.moduleId || []);
  	QUnit.config.testId = [].concat(urlParams.testId || []);

  	// Exact case-insensitive match of the module name
  	QUnit.config.module = urlParams.module;

  	// Regular expression or case-insenstive substring match against "moduleName: testName"
  	QUnit.config.filter = urlParams.filter;

  	// Test order randomization
  	if (urlParams.seed === true) {

  		// Generate a random seed if the option is specified without a value
  		QUnit.config.seed = Math.random().toString(36).slice(2);
  	} else if (urlParams.seed) {
  		QUnit.config.seed = urlParams.seed;
  	}

  	// Add URL-parameter-mapped config values with UI form rendering data
  	QUnit.config.urlConfig.push({
  		id: "hidepassed",
  		label: "Hide passed tests",
  		tooltip: "Only show tests and assertions that fail. Stored as query-strings."
  	}, {
  		id: "noglobals",
  		label: "Check for Globals",
  		tooltip: "Enabling this will test if any test introduces new properties on the " + "global object (`window` in Browsers). Stored as query-strings."
  	}, {
  		id: "notrycatch",
  		label: "No try-catch",
  		tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging " + "exceptions in IE reasonable. Stored as query-strings."
  	});

  	QUnit.begin(function () {
  		var i,
  		    option,
  		    urlConfig = QUnit.config.urlConfig;

  		for (i = 0; i < urlConfig.length; i++) {

  			// Options can be either strings or objects with nonempty "id" properties
  			option = QUnit.config.urlConfig[i];
  			if (typeof option !== "string") {
  				option = option.id;
  			}

  			if (QUnit.config[option] === undefined) {
  				QUnit.config[option] = urlParams[option];
  			}
  		}
  	});

  	function getUrlParams() {
  		var i, param, name, value;
  		var urlParams = Object.create(null);
  		var params = location.search.slice(1).split("&");
  		var length = params.length;

  		for (i = 0; i < length; i++) {
  			if (params[i]) {
  				param = params[i].split("=");
  				name = decodeQueryParam(param[0]);

  				// Allow just a key to turn on a flag, e.g., test.html?noglobals
  				value = param.length === 1 || decodeQueryParam(param.slice(1).join("="));
  				if (name in urlParams) {
  					urlParams[name] = [].concat(urlParams[name], value);
  				} else {
  					urlParams[name] = value;
  				}
  			}
  		}

  		return urlParams;
  	}

  	function decodeQueryParam(param) {
  		return decodeURIComponent(param.replace(/\+/g, "%20"));
  	}
  })();

  var stats = {
  	passedTests: 0,
  	failedTests: 0,
  	skippedTests: 0,
  	todoTests: 0
  };

  // Escape text for attribute or text content.
  function escapeText(s) {
  	if (!s) {
  		return "";
  	}
  	s = s + "";

  	// Both single quotes and double quotes (for attributes)
  	return s.replace(/['"<>&]/g, function (s) {
  		switch (s) {
  			case "'":
  				return "&#039;";
  			case "\"":
  				return "&quot;";
  			case "<":
  				return "&lt;";
  			case ">":
  				return "&gt;";
  			case "&":
  				return "&amp;";
  		}
  	});
  }

  (function () {

  	// Don't load the HTML Reporter on non-browser environments
  	if (typeof window$1 === "undefined" || !window$1.document) {
  		return;
  	}

  	var config = QUnit.config,
  	    hiddenTests = [],
  	    document = window$1.document,
  	    collapseNext = false,
  	    hasOwn$$1 = Object.prototype.hasOwnProperty,
  	    unfilteredUrl = setUrl({ filter: undefined, module: undefined,
  		moduleId: undefined, testId: undefined }),
  	    modulesList = [];

  	function addEvent(elem, type, fn) {
  		elem.addEventListener(type, fn, false);
  	}

  	function removeEvent(elem, type, fn) {
  		elem.removeEventListener(type, fn, false);
  	}

  	function addEvents(elems, type, fn) {
  		var i = elems.length;
  		while (i--) {
  			addEvent(elems[i], type, fn);
  		}
  	}

  	function hasClass(elem, name) {
  		return (" " + elem.className + " ").indexOf(" " + name + " ") >= 0;
  	}

  	function addClass(elem, name) {
  		if (!hasClass(elem, name)) {
  			elem.className += (elem.className ? " " : "") + name;
  		}
  	}

  	function toggleClass(elem, name, force) {
  		if (force || typeof force === "undefined" && !hasClass(elem, name)) {
  			addClass(elem, name);
  		} else {
  			removeClass(elem, name);
  		}
  	}

  	function removeClass(elem, name) {
  		var set = " " + elem.className + " ";

  		// Class name may appear multiple times
  		while (set.indexOf(" " + name + " ") >= 0) {
  			set = set.replace(" " + name + " ", " ");
  		}

  		// Trim for prettiness
  		elem.className = typeof set.trim === "function" ? set.trim() : set.replace(/^\s+|\s+$/g, "");
  	}

  	function id(name) {
  		return document.getElementById && document.getElementById(name);
  	}

  	function abortTests() {
  		var abortButton = id("qunit-abort-tests-button");
  		if (abortButton) {
  			abortButton.disabled = true;
  			abortButton.innerHTML = "Aborting...";
  		}
  		QUnit.config.queue.length = 0;
  		return false;
  	}

  	function interceptNavigation(ev) {
  		applyUrlParams();

  		if (ev && ev.preventDefault) {
  			ev.preventDefault();
  		}

  		return false;
  	}

  	function getUrlConfigHtml() {
  		var i,
  		    j,
  		    val,
  		    escaped,
  		    escapedTooltip,
  		    selection = false,
  		    urlConfig = config.urlConfig,
  		    urlConfigHtml = "";

  		for (i = 0; i < urlConfig.length; i++) {

  			// Options can be either strings or objects with nonempty "id" properties
  			val = config.urlConfig[i];
  			if (typeof val === "string") {
  				val = {
  					id: val,
  					label: val
  				};
  			}

  			escaped = escapeText(val.id);
  			escapedTooltip = escapeText(val.tooltip);

  			if (!val.value || typeof val.value === "string") {
  				urlConfigHtml += "<label for='qunit-urlconfig-" + escaped + "' title='" + escapedTooltip + "'><input id='qunit-urlconfig-" + escaped + "' name='" + escaped + "' type='checkbox'" + (val.value ? " value='" + escapeText(val.value) + "'" : "") + (config[val.id] ? " checked='checked'" : "") + " title='" + escapedTooltip + "' />" + escapeText(val.label) + "</label>";
  			} else {
  				urlConfigHtml += "<label for='qunit-urlconfig-" + escaped + "' title='" + escapedTooltip + "'>" + val.label + ": </label><select id='qunit-urlconfig-" + escaped + "' name='" + escaped + "' title='" + escapedTooltip + "'><option></option>";

  				if (QUnit.is("array", val.value)) {
  					for (j = 0; j < val.value.length; j++) {
  						escaped = escapeText(val.value[j]);
  						urlConfigHtml += "<option value='" + escaped + "'" + (config[val.id] === val.value[j] ? (selection = true) && " selected='selected'" : "") + ">" + escaped + "</option>";
  					}
  				} else {
  					for (j in val.value) {
  						if (hasOwn$$1.call(val.value, j)) {
  							urlConfigHtml += "<option value='" + escapeText(j) + "'" + (config[val.id] === j ? (selection = true) && " selected='selected'" : "") + ">" + escapeText(val.value[j]) + "</option>";
  						}
  					}
  				}
  				if (config[val.id] && !selection) {
  					escaped = escapeText(config[val.id]);
  					urlConfigHtml += "<option value='" + escaped + "' selected='selected' disabled='disabled'>" + escaped + "</option>";
  				}
  				urlConfigHtml += "</select>";
  			}
  		}

  		return urlConfigHtml;
  	}

  	// Handle "click" events on toolbar checkboxes and "change" for select menus.
  	// Updates the URL with the new state of `config.urlConfig` values.
  	function toolbarChanged() {
  		var updatedUrl,
  		    value,
  		    tests,
  		    field = this,
  		    params = {};

  		// Detect if field is a select menu or a checkbox
  		if ("selectedIndex" in field) {
  			value = field.options[field.selectedIndex].value || undefined;
  		} else {
  			value = field.checked ? field.defaultValue || true : undefined;
  		}

  		params[field.name] = value;
  		updatedUrl = setUrl(params);

  		// Check if we can apply the change without a page refresh
  		if ("hidepassed" === field.name && "replaceState" in window$1.history) {
  			QUnit.urlParams[field.name] = value;
  			config[field.name] = value || false;
  			tests = id("qunit-tests");
  			if (tests) {
  				var length = tests.children.length;
  				var children = tests.children;

  				if (field.checked) {
  					for (var i = 0; i < length; i++) {
  						var test$$1 = children[i];

  						if (test$$1 && test$$1.className.indexOf("pass") > -1) {
  							hiddenTests.push(test$$1);
  						}
  					}

  					var _iteratorNormalCompletion = true;
  					var _didIteratorError = false;
  					var _iteratorError = undefined;

  					try {
  						for (var _iterator = hiddenTests[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  							var hiddenTest = _step.value;

  							tests.removeChild(hiddenTest);
  						}
  					} catch (err) {
  						_didIteratorError = true;
  						_iteratorError = err;
  					} finally {
  						try {
  							if (!_iteratorNormalCompletion && _iterator.return) {
  								_iterator.return();
  							}
  						} finally {
  							if (_didIteratorError) {
  								throw _iteratorError;
  							}
  						}
  					}
  				} else {
  					while ((test$$1 = hiddenTests.pop()) != null) {
  						tests.appendChild(test$$1);
  					}
  				}
  			}
  			window$1.history.replaceState(null, "", updatedUrl);
  		} else {
  			window$1.location = updatedUrl;
  		}
  	}

  	function setUrl(params) {
  		var key,
  		    arrValue,
  		    i,
  		    querystring = "?",
  		    location = window$1.location;

  		params = QUnit.extend(QUnit.extend({}, QUnit.urlParams), params);

  		for (key in params) {

  			// Skip inherited or undefined properties
  			if (hasOwn$$1.call(params, key) && params[key] !== undefined) {

  				// Output a parameter for each value of this key
  				// (but usually just one)
  				arrValue = [].concat(params[key]);
  				for (i = 0; i < arrValue.length; i++) {
  					querystring += encodeURIComponent(key);
  					if (arrValue[i] !== true) {
  						querystring += "=" + encodeURIComponent(arrValue[i]);
  					}
  					querystring += "&";
  				}
  			}
  		}
  		return location.protocol + "//" + location.host + location.pathname + querystring.slice(0, -1);
  	}

  	function applyUrlParams() {
  		var i,
  		    selectedModules = [],
  		    modulesList = id("qunit-modulefilter-dropdown-list").getElementsByTagName("input"),
  		    filter = id("qunit-filter-input").value;

  		for (i = 0; i < modulesList.length; i++) {
  			if (modulesList[i].checked) {
  				selectedModules.push(modulesList[i].value);
  			}
  		}

  		window$1.location = setUrl({
  			filter: filter === "" ? undefined : filter,
  			moduleId: selectedModules.length === 0 ? undefined : selectedModules,

  			// Remove module and testId filter
  			module: undefined,
  			testId: undefined
  		});
  	}

  	function toolbarUrlConfigContainer() {
  		var urlConfigContainer = document.createElement("span");

  		urlConfigContainer.innerHTML = getUrlConfigHtml();
  		addClass(urlConfigContainer, "qunit-url-config");

  		addEvents(urlConfigContainer.getElementsByTagName("input"), "change", toolbarChanged);
  		addEvents(urlConfigContainer.getElementsByTagName("select"), "change", toolbarChanged);

  		return urlConfigContainer;
  	}

  	function abortTestsButton() {
  		var button = document.createElement("button");
  		button.id = "qunit-abort-tests-button";
  		button.innerHTML = "Abort";
  		addEvent(button, "click", abortTests);
  		return button;
  	}

  	function toolbarLooseFilter() {
  		var filter = document.createElement("form"),
  		    label = document.createElement("label"),
  		    input = document.createElement("input"),
  		    button = document.createElement("button");

  		addClass(filter, "qunit-filter");

  		label.innerHTML = "Filter: ";

  		input.type = "text";
  		input.value = config.filter || "";
  		input.name = "filter";
  		input.id = "qunit-filter-input";

  		button.innerHTML = "Go";

  		label.appendChild(input);

  		filter.appendChild(label);
  		filter.appendChild(document.createTextNode(" "));
  		filter.appendChild(button);
  		addEvent(filter, "submit", interceptNavigation);

  		return filter;
  	}

  	function moduleListHtml() {
  		var i,
  		    checked,
  		    html = "";

  		for (i = 0; i < config.modules.length; i++) {
  			if (config.modules[i].name !== "") {
  				checked = config.moduleId.indexOf(config.modules[i].moduleId) > -1;
  				html += "<li><label class='clickable" + (checked ? " checked" : "") + "'><input type='checkbox' " + "value='" + config.modules[i].moduleId + "'" + (checked ? " checked='checked'" : "") + " />" + escapeText(config.modules[i].name) + "</label></li>";
  			}
  		}

  		return html;
  	}

  	function toolbarModuleFilter() {
  		var commit,
  		    reset,
  		    moduleFilter = document.createElement("form"),
  		    label = document.createElement("label"),
  		    moduleSearch = document.createElement("input"),
  		    dropDown = document.createElement("div"),
  		    actions = document.createElement("span"),
  		    applyButton = document.createElement("button"),
  		    resetButton = document.createElement("button"),
  		    allModulesLabel = document.createElement("label"),
  		    allCheckbox = document.createElement("input"),
  		    dropDownList = document.createElement("ul"),
  		    dirty = false;

  		moduleSearch.id = "qunit-modulefilter-search";
  		moduleSearch.autocomplete = "off";
  		addEvent(moduleSearch, "input", searchInput);
  		addEvent(moduleSearch, "input", searchFocus);
  		addEvent(moduleSearch, "focus", searchFocus);
  		addEvent(moduleSearch, "click", searchFocus);

  		label.id = "qunit-modulefilter-search-container";
  		label.innerHTML = "Module: ";
  		label.appendChild(moduleSearch);

  		applyButton.textContent = "Apply";
  		applyButton.style.display = "none";

  		resetButton.textContent = "Reset";
  		resetButton.type = "reset";
  		resetButton.style.display = "none";

  		allCheckbox.type = "checkbox";
  		allCheckbox.checked = config.moduleId.length === 0;

  		allModulesLabel.className = "clickable";
  		if (config.moduleId.length) {
  			allModulesLabel.className = "checked";
  		}
  		allModulesLabel.appendChild(allCheckbox);
  		allModulesLabel.appendChild(document.createTextNode("All modules"));

  		actions.id = "qunit-modulefilter-actions";
  		actions.appendChild(applyButton);
  		actions.appendChild(resetButton);
  		actions.appendChild(allModulesLabel);
  		commit = actions.firstChild;
  		reset = commit.nextSibling;
  		addEvent(commit, "click", applyUrlParams);

  		dropDownList.id = "qunit-modulefilter-dropdown-list";
  		dropDownList.innerHTML = moduleListHtml();

  		dropDown.id = "qunit-modulefilter-dropdown";
  		dropDown.style.display = "none";
  		dropDown.appendChild(actions);
  		dropDown.appendChild(dropDownList);
  		addEvent(dropDown, "change", selectionChange);
  		selectionChange();

  		moduleFilter.id = "qunit-modulefilter";
  		moduleFilter.appendChild(label);
  		moduleFilter.appendChild(dropDown);
  		addEvent(moduleFilter, "submit", interceptNavigation);
  		addEvent(moduleFilter, "reset", function () {

  			// Let the reset happen, then update styles
  			window$1.setTimeout(selectionChange);
  		});

  		// Enables show/hide for the dropdown
  		function searchFocus() {
  			if (dropDown.style.display !== "none") {
  				return;
  			}

  			dropDown.style.display = "block";
  			addEvent(document, "click", hideHandler);
  			addEvent(document, "keydown", hideHandler);

  			// Hide on Escape keydown or outside-container click
  			function hideHandler(e) {
  				var inContainer = moduleFilter.contains(e.target);

  				if (e.keyCode === 27 || !inContainer) {
  					if (e.keyCode === 27 && inContainer) {
  						moduleSearch.focus();
  					}
  					dropDown.style.display = "none";
  					removeEvent(document, "click", hideHandler);
  					removeEvent(document, "keydown", hideHandler);
  					moduleSearch.value = "";
  					searchInput();
  				}
  			}
  		}

  		// Processes module search box input
  		function searchInput() {
  			var i,
  			    item,
  			    searchText = moduleSearch.value.toLowerCase(),
  			    listItems = dropDownList.children;

  			for (i = 0; i < listItems.length; i++) {
  				item = listItems[i];
  				if (!searchText || item.textContent.toLowerCase().indexOf(searchText) > -1) {
  					item.style.display = "";
  				} else {
  					item.style.display = "none";
  				}
  			}
  		}

  		// Processes selection changes
  		function selectionChange(evt) {
  			var i,
  			    item,
  			    checkbox = evt && evt.target || allCheckbox,
  			    modulesList = dropDownList.getElementsByTagName("input"),
  			    selectedNames = [];

  			toggleClass(checkbox.parentNode, "checked", checkbox.checked);

  			dirty = false;
  			if (checkbox.checked && checkbox !== allCheckbox) {
  				allCheckbox.checked = false;
  				removeClass(allCheckbox.parentNode, "checked");
  			}
  			for (i = 0; i < modulesList.length; i++) {
  				item = modulesList[i];
  				if (!evt) {
  					toggleClass(item.parentNode, "checked", item.checked);
  				} else if (checkbox === allCheckbox && checkbox.checked) {
  					item.checked = false;
  					removeClass(item.parentNode, "checked");
  				}
  				dirty = dirty || item.checked !== item.defaultChecked;
  				if (item.checked) {
  					selectedNames.push(item.parentNode.textContent);
  				}
  			}

  			commit.style.display = reset.style.display = dirty ? "" : "none";
  			moduleSearch.placeholder = selectedNames.join(", ") || allCheckbox.parentNode.textContent;
  			moduleSearch.title = "Type to filter list. Current selection:\n" + (selectedNames.join("\n") || allCheckbox.parentNode.textContent);
  		}

  		return moduleFilter;
  	}

  	function appendToolbar() {
  		var toolbar = id("qunit-testrunner-toolbar");

  		if (toolbar) {
  			toolbar.appendChild(toolbarUrlConfigContainer());
  			toolbar.appendChild(toolbarModuleFilter());
  			toolbar.appendChild(toolbarLooseFilter());
  			toolbar.appendChild(document.createElement("div")).className = "clearfix";
  		}
  	}

  	function appendHeader() {
  		var header = id("qunit-header");

  		if (header) {
  			header.innerHTML = "<a href='" + escapeText(unfilteredUrl) + "'>" + header.innerHTML + "</a> ";
  		}
  	}

  	function appendBanner() {
  		var banner = id("qunit-banner");

  		if (banner) {
  			banner.className = "";
  		}
  	}

  	function appendTestResults() {
  		var tests = id("qunit-tests"),
  		    result = id("qunit-testresult"),
  		    controls;

  		if (result) {
  			result.parentNode.removeChild(result);
  		}

  		if (tests) {
  			tests.innerHTML = "";
  			result = document.createElement("p");
  			result.id = "qunit-testresult";
  			result.className = "result";
  			tests.parentNode.insertBefore(result, tests);
  			result.innerHTML = "<div id=\"qunit-testresult-display\">Running...<br />&#160;</div>" + "<div id=\"qunit-testresult-controls\"></div>" + "<div class=\"clearfix\"></div>";
  			controls = id("qunit-testresult-controls");
  		}

  		if (controls) {
  			controls.appendChild(abortTestsButton());
  		}
  	}

  	function appendFilteredTest() {
  		var testId = QUnit.config.testId;
  		if (!testId || testId.length <= 0) {
  			return "";
  		}
  		return "<div id='qunit-filteredTest'>Rerunning selected tests: " + escapeText(testId.join(", ")) + " <a id='qunit-clearFilter' href='" + escapeText(unfilteredUrl) + "'>Run all tests</a></div>";
  	}

  	function appendUserAgent() {
  		var userAgent = id("qunit-userAgent");

  		if (userAgent) {
  			userAgent.innerHTML = "";
  			userAgent.appendChild(document.createTextNode("QUnit " + QUnit.version + "; " + navigator.userAgent));
  		}
  	}

  	function appendInterface() {
  		var qunit = id("qunit");

  		if (qunit) {
  			qunit.innerHTML = "<h1 id='qunit-header'>" + escapeText(document.title) + "</h1>" + "<h2 id='qunit-banner'></h2>" + "<div id='qunit-testrunner-toolbar'></div>" + appendFilteredTest() + "<h2 id='qunit-userAgent'></h2>" + "<ol id='qunit-tests'></ol>";
  		}

  		appendHeader();
  		appendBanner();
  		appendTestResults();
  		appendUserAgent();
  		appendToolbar();
  	}

  	function appendTest(name, testId, moduleName) {
  		var title,
  		    rerunTrigger,
  		    testBlock,
  		    assertList,
  		    tests = id("qunit-tests");

  		if (!tests) {
  			return;
  		}

  		title = document.createElement("strong");
  		title.innerHTML = getNameHtml(name, moduleName);

  		rerunTrigger = document.createElement("a");
  		rerunTrigger.innerHTML = "Rerun";
  		rerunTrigger.href = setUrl({ testId: testId });

  		testBlock = document.createElement("li");
  		testBlock.appendChild(title);
  		testBlock.appendChild(rerunTrigger);
  		testBlock.id = "qunit-test-output-" + testId;

  		assertList = document.createElement("ol");
  		assertList.className = "qunit-assert-list";

  		testBlock.appendChild(assertList);

  		tests.appendChild(testBlock);
  	}

  	// HTML Reporter initialization and load
  	QUnit.begin(function (details) {
  		var i, moduleObj;

  		// Sort modules by name for the picker
  		for (i = 0; i < details.modules.length; i++) {
  			moduleObj = details.modules[i];
  			if (moduleObj.name) {
  				modulesList.push(moduleObj.name);
  			}
  		}
  		modulesList.sort(function (a, b) {
  			return a.localeCompare(b);
  		});

  		// Initialize QUnit elements
  		appendInterface();
  	});

  	QUnit.done(function (details) {
  		var banner = id("qunit-banner"),
  		    tests = id("qunit-tests"),
  		    abortButton = id("qunit-abort-tests-button"),
  		    totalTests = stats.passedTests + stats.skippedTests + stats.todoTests + stats.failedTests,
  		    html = [totalTests, " tests completed in ", details.runtime, " milliseconds, with ", stats.failedTests, " failed, ", stats.skippedTests, " skipped, and ", stats.todoTests, " todo.<br />", "<span class='passed'>", details.passed, "</span> assertions of <span class='total'>", details.total, "</span> passed, <span class='failed'>", details.failed, "</span> failed."].join(""),
  		    test$$1,
  		    assertLi,
  		    assertList;

  		// Update remaining tests to aborted
  		if (abortButton && abortButton.disabled) {
  			html = "Tests aborted after " + details.runtime + " milliseconds.";

  			for (var i = 0; i < tests.children.length; i++) {
  				test$$1 = tests.children[i];
  				if (test$$1.className === "" || test$$1.className === "running") {
  					test$$1.className = "aborted";
  					assertList = test$$1.getElementsByTagName("ol")[0];
  					assertLi = document.createElement("li");
  					assertLi.className = "fail";
  					assertLi.innerHTML = "Test aborted.";
  					assertList.appendChild(assertLi);
  				}
  			}
  		}

  		if (banner && (!abortButton || abortButton.disabled === false)) {
  			banner.className = stats.failedTests ? "qunit-fail" : "qunit-pass";
  		}

  		if (abortButton) {
  			abortButton.parentNode.removeChild(abortButton);
  		}

  		if (tests) {
  			id("qunit-testresult-display").innerHTML = html;
  		}

  		if (config.altertitle && document.title) {

  			// Show ✖ for good, ✔ for bad suite result in title
  			// use escape sequences in case file gets loaded with non-utf-8
  			// charset
  			document.title = [stats.failedTests ? "\u2716" : "\u2714", document.title.replace(/^[\u2714\u2716] /i, "")].join(" ");
  		}

  		// Scroll back to top to show results
  		if (config.scrolltop && window$1.scrollTo) {
  			window$1.scrollTo(0, 0);
  		}
  	});

  	function getNameHtml(name, module) {
  		var nameHtml = "";

  		if (module) {
  			nameHtml = "<span class='module-name'>" + escapeText(module) + "</span>: ";
  		}

  		nameHtml += "<span class='test-name'>" + escapeText(name) + "</span>";

  		return nameHtml;
  	}

  	function getProgressHtml(runtime, stats, total) {
  		var completed = stats.passedTests + stats.skippedTests + stats.todoTests + stats.failedTests;

  		return ["<br />", completed, " / ", total, " tests completed in ", runtime, " milliseconds, with ", stats.failedTests, " failed, ", stats.skippedTests, " skipped, and ", stats.todoTests, " todo."].join("");
  	}

  	QUnit.testStart(function (details) {
  		var running, bad;

  		appendTest(details.name, details.testId, details.module);

  		running = id("qunit-testresult-display");

  		if (running) {
  			addClass(running, "running");

  			bad = QUnit.config.reorder && details.previousFailure;

  			running.innerHTML = [bad ? "Rerunning previously failed test: <br />" : "Running: <br />", getNameHtml(details.name, details.module), getProgressHtml(now() - config.started, stats, Test.count)].join("");
  		}
  	});

  	function stripHtml(string) {

  		// Strip tags, html entity and whitespaces
  		return string.replace(/<\/?[^>]+(>|$)/g, "").replace(/&quot;/g, "").replace(/\s+/g, "");
  	}

  	QUnit.log(function (details) {
  		var assertList,
  		    assertLi,
  		    message,
  		    expected,
  		    actual,
  		    diff$$1,
  		    showDiff = false,
  		    testItem = id("qunit-test-output-" + details.testId);

  		if (!testItem) {
  			return;
  		}

  		message = escapeText(details.message) || (details.result ? "okay" : "failed");
  		message = "<span class='test-message'>" + message + "</span>";
  		message += "<span class='runtime'>@ " + details.runtime + " ms</span>";

  		// The pushFailure doesn't provide details.expected
  		// when it calls, it's implicit to also not show expected and diff stuff
  		// Also, we need to check details.expected existence, as it can exist and be undefined
  		if (!details.result && hasOwn$$1.call(details, "expected")) {
  			if (details.negative) {
  				expected = "NOT " + QUnit.dump.parse(details.expected);
  			} else {
  				expected = QUnit.dump.parse(details.expected);
  			}

  			actual = QUnit.dump.parse(details.actual);
  			message += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" + escapeText(expected) + "</pre></td></tr>";

  			if (actual !== expected) {

  				message += "<tr class='test-actual'><th>Result: </th><td><pre>" + escapeText(actual) + "</pre></td></tr>";

  				if (typeof details.actual === "number" && typeof details.expected === "number") {
  					if (!isNaN(details.actual) && !isNaN(details.expected)) {
  						showDiff = true;
  						diff$$1 = details.actual - details.expected;
  						diff$$1 = (diff$$1 > 0 ? "+" : "") + diff$$1;
  					}
  				} else if (typeof details.actual !== "boolean" && typeof details.expected !== "boolean") {
  					diff$$1 = QUnit.diff(expected, actual);

  					// don't show diff if there is zero overlap
  					showDiff = stripHtml(diff$$1).length !== stripHtml(expected).length + stripHtml(actual).length;
  				}

  				if (showDiff) {
  					message += "<tr class='test-diff'><th>Diff: </th><td><pre>" + diff$$1 + "</pre></td></tr>";
  				}
  			} else if (expected.indexOf("[object Array]") !== -1 || expected.indexOf("[object Object]") !== -1) {
  				message += "<tr class='test-message'><th>Message: </th><td>" + "Diff suppressed as the depth of object is more than current max depth (" + QUnit.config.maxDepth + ").<p>Hint: Use <code>QUnit.dump.maxDepth</code> to " + " run with a higher max depth or <a href='" + escapeText(setUrl({ maxDepth: -1 })) + "'>" + "Rerun</a> without max depth.</p></td></tr>";
  			} else {
  				message += "<tr class='test-message'><th>Message: </th><td>" + "Diff suppressed as the expected and actual results have an equivalent" + " serialization</td></tr>";
  			}

  			if (details.source) {
  				message += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeText(details.source) + "</pre></td></tr>";
  			}

  			message += "</table>";

  			// This occurs when pushFailure is set and we have an extracted stack trace
  		} else if (!details.result && details.source) {
  			message += "<table>" + "<tr class='test-source'><th>Source: </th><td><pre>" + escapeText(details.source) + "</pre></td></tr>" + "</table>";
  		}

  		assertList = testItem.getElementsByTagName("ol")[0];

  		assertLi = document.createElement("li");
  		assertLi.className = details.result ? "pass" : "fail";
  		assertLi.innerHTML = message;
  		assertList.appendChild(assertLi);
  	});

  	QUnit.testDone(function (details) {
  		var testTitle,
  		    time,
  		    testItem,
  		    assertList,
  		    status,
  		    good,
  		    bad,
  		    testCounts,
  		    skipped,
  		    sourceName,
  		    tests = id("qunit-tests");

  		if (!tests) {
  			return;
  		}

  		testItem = id("qunit-test-output-" + details.testId);

  		removeClass(testItem, "running");

  		if (details.failed > 0) {
  			status = "failed";
  		} else if (details.todo) {
  			status = "todo";
  		} else {
  			status = details.skipped ? "skipped" : "passed";
  		}

  		assertList = testItem.getElementsByTagName("ol")[0];

  		good = details.passed;
  		bad = details.failed;

  		// This test passed if it has no unexpected failed assertions
  		var testPassed = details.failed > 0 ? details.todo : !details.todo;

  		if (testPassed) {

  			// Collapse the passing tests
  			addClass(assertList, "qunit-collapsed");
  		} else if (config.collapse) {
  			if (!collapseNext) {

  				// Skip collapsing the first failing test
  				collapseNext = true;
  			} else {

  				// Collapse remaining tests
  				addClass(assertList, "qunit-collapsed");
  			}
  		}

  		// The testItem.firstChild is the test name
  		testTitle = testItem.firstChild;

  		testCounts = bad ? "<b class='failed'>" + bad + "</b>, " + "<b class='passed'>" + good + "</b>, " : "";

  		testTitle.innerHTML += " <b class='counts'>(" + testCounts + details.assertions.length + ")</b>";

  		if (details.skipped) {
  			stats.skippedTests++;

  			testItem.className = "skipped";
  			skipped = document.createElement("em");
  			skipped.className = "qunit-skipped-label";
  			skipped.innerHTML = "skipped";
  			testItem.insertBefore(skipped, testTitle);
  		} else {
  			addEvent(testTitle, "click", function () {
  				toggleClass(assertList, "qunit-collapsed");
  			});

  			testItem.className = testPassed ? "pass" : "fail";

  			if (details.todo) {
  				var todoLabel = document.createElement("em");
  				todoLabel.className = "qunit-todo-label";
  				todoLabel.innerHTML = "todo";
  				testItem.className += " todo";
  				testItem.insertBefore(todoLabel, testTitle);
  			}

  			time = document.createElement("span");
  			time.className = "runtime";
  			time.innerHTML = details.runtime + " ms";
  			testItem.insertBefore(time, assertList);

  			if (!testPassed) {
  				stats.failedTests++;
  			} else if (details.todo) {
  				stats.todoTests++;
  			} else {
  				stats.passedTests++;
  			}
  		}

  		// Show the source of the test when showing assertions
  		if (details.source) {
  			sourceName = document.createElement("p");
  			sourceName.innerHTML = "<strong>Source: </strong>" + escapeText(details.source);
  			addClass(sourceName, "qunit-source");
  			if (testPassed) {
  				addClass(sourceName, "qunit-collapsed");
  			}
  			addEvent(testTitle, "click", function () {
  				toggleClass(sourceName, "qunit-collapsed");
  			});
  			testItem.appendChild(sourceName);
  		}

  		if (config.hidepassed && status === "passed") {

  			// use removeChild instead of remove because of support
  			hiddenTests.push(testItem);

  			tests.removeChild(testItem);
  		}
  	});

  	// Avoid readyState issue with phantomjs
  	// Ref: #818
  	var notPhantom = function (p) {
  		return !(p && p.version && p.version.major > 0);
  	}(window$1.phantom);

  	if (notPhantom && document.readyState === "complete") {
  		QUnit.load();
  	} else {
  		addEvent(window$1, "load", QUnit.load);
  	}

  	// Wrap window.onerror. We will call the original window.onerror to see if
  	// the existing handler fully handles the error; if not, we will call the
  	// QUnit.onError function.
  	var originalWindowOnError = window$1.onerror;

  	// Cover uncaught exceptions
  	// Returning true will suppress the default browser handler,
  	// returning false will let it run.
  	window$1.onerror = function (message, fileName, lineNumber, columnNumber, errorObj) {
  		var ret = false;
  		if (originalWindowOnError) {
  			for (var _len = arguments.length, args = Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
  				args[_key - 5] = arguments[_key];
  			}

  			ret = originalWindowOnError.call.apply(originalWindowOnError, [this, message, fileName, lineNumber, columnNumber, errorObj].concat(args));
  		}

  		// Treat return value as window.onerror itself does,
  		// Only do our handling if not suppressed.
  		if (ret !== true) {
  			var error = {
  				message: message,
  				fileName: fileName,
  				lineNumber: lineNumber
  			};

  			// According to
  			// https://blog.sentry.io/2016/01/04/client-javascript-reporting-window-onerror,
  			// most modern browsers support an errorObj argument; use that to
  			// get a full stack trace if it's available.
  			if (errorObj && errorObj.stack) {
  				error.stacktrace = extractStacktrace(errorObj, 0);
  			}

  			ret = QUnit.onError(error);
  		}

  		return ret;
  	};

  	// Listen for unhandled rejections, and call QUnit.onUnhandledRejection
  	window$1.addEventListener("unhandledrejection", function (event) {
  		QUnit.onUnhandledRejection(event.reason);
  	});
  })();

  /*
   * This file is a modified version of google-diff-match-patch's JavaScript implementation
   * (https://code.google.com/p/google-diff-match-patch/source/browse/trunk/javascript/diff_match_patch_uncompressed.js),
   * modifications are licensed as more fully set forth in LICENSE.txt.
   *
   * The original source of google-diff-match-patch is attributable and licensed as follows:
   *
   * Copyright 2006 Google Inc.
   * https://code.google.com/p/google-diff-match-patch/
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * More Info:
   *  https://code.google.com/p/google-diff-match-patch/
   *
   * Usage: QUnit.diff(expected, actual)
   *
   */
  QUnit.diff = function () {
  	function DiffMatchPatch() {}

  	//  DIFF FUNCTIONS

  	/**
    * The data structure representing a diff is an array of tuples:
    * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
    * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
    */
  	var DIFF_DELETE = -1,
  	    DIFF_INSERT = 1,
  	    DIFF_EQUAL = 0;

  	/**
    * Find the differences between two texts.  Simplifies the problem by stripping
    * any common prefix or suffix off the texts before diffing.
    * @param {string} text1 Old string to be diffed.
    * @param {string} text2 New string to be diffed.
    * @param {boolean=} optChecklines Optional speedup flag. If present and false,
    *     then don't run a line-level diff first to identify the changed areas.
    *     Defaults to true, which does a faster, slightly less optimal diff.
    * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
    */
  	DiffMatchPatch.prototype.DiffMain = function (text1, text2, optChecklines) {
  		var deadline, checklines, commonlength, commonprefix, commonsuffix, diffs;

  		// The diff must be complete in up to 1 second.
  		deadline = new Date().getTime() + 1000;

  		// Check for null inputs.
  		if (text1 === null || text2 === null) {
  			throw new Error("Null input. (DiffMain)");
  		}

  		// Check for equality (speedup).
  		if (text1 === text2) {
  			if (text1) {
  				return [[DIFF_EQUAL, text1]];
  			}
  			return [];
  		}

  		if (typeof optChecklines === "undefined") {
  			optChecklines = true;
  		}

  		checklines = optChecklines;

  		// Trim off common prefix (speedup).
  		commonlength = this.diffCommonPrefix(text1, text2);
  		commonprefix = text1.substring(0, commonlength);
  		text1 = text1.substring(commonlength);
  		text2 = text2.substring(commonlength);

  		// Trim off common suffix (speedup).
  		commonlength = this.diffCommonSuffix(text1, text2);
  		commonsuffix = text1.substring(text1.length - commonlength);
  		text1 = text1.substring(0, text1.length - commonlength);
  		text2 = text2.substring(0, text2.length - commonlength);

  		// Compute the diff on the middle block.
  		diffs = this.diffCompute(text1, text2, checklines, deadline);

  		// Restore the prefix and suffix.
  		if (commonprefix) {
  			diffs.unshift([DIFF_EQUAL, commonprefix]);
  		}
  		if (commonsuffix) {
  			diffs.push([DIFF_EQUAL, commonsuffix]);
  		}
  		this.diffCleanupMerge(diffs);
  		return diffs;
  	};

  	/**
    * Reduce the number of edits by eliminating operationally trivial equalities.
    * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
    */
  	DiffMatchPatch.prototype.diffCleanupEfficiency = function (diffs) {
  		var changes, equalities, equalitiesLength, lastequality, pointer, preIns, preDel, postIns, postDel;
  		changes = false;
  		equalities = []; // Stack of indices where equalities are found.
  		equalitiesLength = 0; // Keeping our own length var is faster in JS.
  		/** @type {?string} */
  		lastequality = null;

  		// Always equal to diffs[equalities[equalitiesLength - 1]][1]
  		pointer = 0; // Index of current position.

  		// Is there an insertion operation before the last equality.
  		preIns = false;

  		// Is there a deletion operation before the last equality.
  		preDel = false;

  		// Is there an insertion operation after the last equality.
  		postIns = false;

  		// Is there a deletion operation after the last equality.
  		postDel = false;
  		while (pointer < diffs.length) {

  			// Equality found.
  			if (diffs[pointer][0] === DIFF_EQUAL) {
  				if (diffs[pointer][1].length < 4 && (postIns || postDel)) {

  					// Candidate found.
  					equalities[equalitiesLength++] = pointer;
  					preIns = postIns;
  					preDel = postDel;
  					lastequality = diffs[pointer][1];
  				} else {

  					// Not a candidate, and can never become one.
  					equalitiesLength = 0;
  					lastequality = null;
  				}
  				postIns = postDel = false;

  				// An insertion or deletion.
  			} else {

  				if (diffs[pointer][0] === DIFF_DELETE) {
  					postDel = true;
  				} else {
  					postIns = true;
  				}

  				/*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
  				if (lastequality && (preIns && preDel && postIns && postDel || lastequality.length < 2 && preIns + preDel + postIns + postDel === 3)) {

  					// Duplicate record.
  					diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);

  					// Change second copy to insert.
  					diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
  					equalitiesLength--; // Throw away the equality we just deleted;
  					lastequality = null;
  					if (preIns && preDel) {

  						// No changes made which could affect previous entry, keep going.
  						postIns = postDel = true;
  						equalitiesLength = 0;
  					} else {
  						equalitiesLength--; // Throw away the previous equality.
  						pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
  						postIns = postDel = false;
  					}
  					changes = true;
  				}
  			}
  			pointer++;
  		}

  		if (changes) {
  			this.diffCleanupMerge(diffs);
  		}
  	};

  	/**
    * Convert a diff array into a pretty HTML report.
    * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
    * @param {integer} string to be beautified.
    * @return {string} HTML representation.
    */
  	DiffMatchPatch.prototype.diffPrettyHtml = function (diffs) {
  		var op,
  		    data,
  		    x,
  		    html = [];
  		for (x = 0; x < diffs.length; x++) {
  			op = diffs[x][0]; // Operation (insert, delete, equal)
  			data = diffs[x][1]; // Text of change.
  			switch (op) {
  				case DIFF_INSERT:
  					html[x] = "<ins>" + escapeText(data) + "</ins>";
  					break;
  				case DIFF_DELETE:
  					html[x] = "<del>" + escapeText(data) + "</del>";
  					break;
  				case DIFF_EQUAL:
  					html[x] = "<span>" + escapeText(data) + "</span>";
  					break;
  			}
  		}
  		return html.join("");
  	};

  	/**
    * Determine the common prefix of two strings.
    * @param {string} text1 First string.
    * @param {string} text2 Second string.
    * @return {number} The number of characters common to the start of each
    *     string.
    */
  	DiffMatchPatch.prototype.diffCommonPrefix = function (text1, text2) {
  		var pointermid, pointermax, pointermin, pointerstart;

  		// Quick check for common null cases.
  		if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
  			return 0;
  		}

  		// Binary search.
  		// Performance analysis: https://neil.fraser.name/news/2007/10/09/
  		pointermin = 0;
  		pointermax = Math.min(text1.length, text2.length);
  		pointermid = pointermax;
  		pointerstart = 0;
  		while (pointermin < pointermid) {
  			if (text1.substring(pointerstart, pointermid) === text2.substring(pointerstart, pointermid)) {
  				pointermin = pointermid;
  				pointerstart = pointermin;
  			} else {
  				pointermax = pointermid;
  			}
  			pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  		}
  		return pointermid;
  	};

  	/**
    * Determine the common suffix of two strings.
    * @param {string} text1 First string.
    * @param {string} text2 Second string.
    * @return {number} The number of characters common to the end of each string.
    */
  	DiffMatchPatch.prototype.diffCommonSuffix = function (text1, text2) {
  		var pointermid, pointermax, pointermin, pointerend;

  		// Quick check for common null cases.
  		if (!text1 || !text2 || text1.charAt(text1.length - 1) !== text2.charAt(text2.length - 1)) {
  			return 0;
  		}

  		// Binary search.
  		// Performance analysis: https://neil.fraser.name/news/2007/10/09/
  		pointermin = 0;
  		pointermax = Math.min(text1.length, text2.length);
  		pointermid = pointermax;
  		pointerend = 0;
  		while (pointermin < pointermid) {
  			if (text1.substring(text1.length - pointermid, text1.length - pointerend) === text2.substring(text2.length - pointermid, text2.length - pointerend)) {
  				pointermin = pointermid;
  				pointerend = pointermin;
  			} else {
  				pointermax = pointermid;
  			}
  			pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  		}
  		return pointermid;
  	};

  	/**
    * Find the differences between two texts.  Assumes that the texts do not
    * have any common prefix or suffix.
    * @param {string} text1 Old string to be diffed.
    * @param {string} text2 New string to be diffed.
    * @param {boolean} checklines Speedup flag.  If false, then don't run a
    *     line-level diff first to identify the changed areas.
    *     If true, then run a faster, slightly less optimal diff.
    * @param {number} deadline Time when the diff should be complete by.
    * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
    * @private
    */
  	DiffMatchPatch.prototype.diffCompute = function (text1, text2, checklines, deadline) {
  		var diffs, longtext, shorttext, i, hm, text1A, text2A, text1B, text2B, midCommon, diffsA, diffsB;

  		if (!text1) {

  			// Just add some text (speedup).
  			return [[DIFF_INSERT, text2]];
  		}

  		if (!text2) {

  			// Just delete some text (speedup).
  			return [[DIFF_DELETE, text1]];
  		}

  		longtext = text1.length > text2.length ? text1 : text2;
  		shorttext = text1.length > text2.length ? text2 : text1;
  		i = longtext.indexOf(shorttext);
  		if (i !== -1) {

  			// Shorter text is inside the longer text (speedup).
  			diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]];

  			// Swap insertions for deletions if diff is reversed.
  			if (text1.length > text2.length) {
  				diffs[0][0] = diffs[2][0] = DIFF_DELETE;
  			}
  			return diffs;
  		}

  		if (shorttext.length === 1) {

  			// Single character string.
  			// After the previous speedup, the character can't be an equality.
  			return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  		}

  		// Check to see if the problem can be split in two.
  		hm = this.diffHalfMatch(text1, text2);
  		if (hm) {

  			// A half-match was found, sort out the return data.
  			text1A = hm[0];
  			text1B = hm[1];
  			text2A = hm[2];
  			text2B = hm[3];
  			midCommon = hm[4];

  			// Send both pairs off for separate processing.
  			diffsA = this.DiffMain(text1A, text2A, checklines, deadline);
  			diffsB = this.DiffMain(text1B, text2B, checklines, deadline);

  			// Merge the results.
  			return diffsA.concat([[DIFF_EQUAL, midCommon]], diffsB);
  		}

  		if (checklines && text1.length > 100 && text2.length > 100) {
  			return this.diffLineMode(text1, text2, deadline);
  		}

  		return this.diffBisect(text1, text2, deadline);
  	};

  	/**
    * Do the two texts share a substring which is at least half the length of the
    * longer text?
    * This speedup can produce non-minimal diffs.
    * @param {string} text1 First string.
    * @param {string} text2 Second string.
    * @return {Array.<string>} Five element Array, containing the prefix of
    *     text1, the suffix of text1, the prefix of text2, the suffix of
    *     text2 and the common middle.  Or null if there was no match.
    * @private
    */
  	DiffMatchPatch.prototype.diffHalfMatch = function (text1, text2) {
  		var longtext, shorttext, dmp, text1A, text2B, text2A, text1B, midCommon, hm1, hm2, hm;

  		longtext = text1.length > text2.length ? text1 : text2;
  		shorttext = text1.length > text2.length ? text2 : text1;
  		if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
  			return null; // Pointless.
  		}
  		dmp = this; // 'this' becomes 'window' in a closure.

  		/**
     * Does a substring of shorttext exist within longtext such that the substring
     * is at least half the length of longtext?
     * Closure, but does not reference any external variables.
     * @param {string} longtext Longer string.
     * @param {string} shorttext Shorter string.
     * @param {number} i Start index of quarter length substring within longtext.
     * @return {Array.<string>} Five element Array, containing the prefix of
     *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
     *     of shorttext and the common middle.  Or null if there was no match.
     * @private
     */
  		function diffHalfMatchI(longtext, shorttext, i) {
  			var seed, j, bestCommon, prefixLength, suffixLength, bestLongtextA, bestLongtextB, bestShorttextA, bestShorttextB;

  			// Start with a 1/4 length substring at position i as a seed.
  			seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
  			j = -1;
  			bestCommon = "";
  			while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
  				prefixLength = dmp.diffCommonPrefix(longtext.substring(i), shorttext.substring(j));
  				suffixLength = dmp.diffCommonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
  				if (bestCommon.length < suffixLength + prefixLength) {
  					bestCommon = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
  					bestLongtextA = longtext.substring(0, i - suffixLength);
  					bestLongtextB = longtext.substring(i + prefixLength);
  					bestShorttextA = shorttext.substring(0, j - suffixLength);
  					bestShorttextB = shorttext.substring(j + prefixLength);
  				}
  			}
  			if (bestCommon.length * 2 >= longtext.length) {
  				return [bestLongtextA, bestLongtextB, bestShorttextA, bestShorttextB, bestCommon];
  			} else {
  				return null;
  			}
  		}

  		// First check if the second quarter is the seed for a half-match.
  		hm1 = diffHalfMatchI(longtext, shorttext, Math.ceil(longtext.length / 4));

  		// Check again based on the third quarter.
  		hm2 = diffHalfMatchI(longtext, shorttext, Math.ceil(longtext.length / 2));
  		if (!hm1 && !hm2) {
  			return null;
  		} else if (!hm2) {
  			hm = hm1;
  		} else if (!hm1) {
  			hm = hm2;
  		} else {

  			// Both matched.  Select the longest.
  			hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  		}

  		// A half-match was found, sort out the return data.
  		if (text1.length > text2.length) {
  			text1A = hm[0];
  			text1B = hm[1];
  			text2A = hm[2];
  			text2B = hm[3];
  		} else {
  			text2A = hm[0];
  			text2B = hm[1];
  			text1A = hm[2];
  			text1B = hm[3];
  		}
  		midCommon = hm[4];
  		return [text1A, text1B, text2A, text2B, midCommon];
  	};

  	/**
    * Do a quick line-level diff on both strings, then rediff the parts for
    * greater accuracy.
    * This speedup can produce non-minimal diffs.
    * @param {string} text1 Old string to be diffed.
    * @param {string} text2 New string to be diffed.
    * @param {number} deadline Time when the diff should be complete by.
    * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
    * @private
    */
  	DiffMatchPatch.prototype.diffLineMode = function (text1, text2, deadline) {
  		var a, diffs, linearray, pointer, countInsert, countDelete, textInsert, textDelete, j;

  		// Scan the text on a line-by-line basis first.
  		a = this.diffLinesToChars(text1, text2);
  		text1 = a.chars1;
  		text2 = a.chars2;
  		linearray = a.lineArray;

  		diffs = this.DiffMain(text1, text2, false, deadline);

  		// Convert the diff back to original text.
  		this.diffCharsToLines(diffs, linearray);

  		// Eliminate freak matches (e.g. blank lines)
  		this.diffCleanupSemantic(diffs);

  		// Rediff any replacement blocks, this time character-by-character.
  		// Add a dummy entry at the end.
  		diffs.push([DIFF_EQUAL, ""]);
  		pointer = 0;
  		countDelete = 0;
  		countInsert = 0;
  		textDelete = "";
  		textInsert = "";
  		while (pointer < diffs.length) {
  			switch (diffs[pointer][0]) {
  				case DIFF_INSERT:
  					countInsert++;
  					textInsert += diffs[pointer][1];
  					break;
  				case DIFF_DELETE:
  					countDelete++;
  					textDelete += diffs[pointer][1];
  					break;
  				case DIFF_EQUAL:

  					// Upon reaching an equality, check for prior redundancies.
  					if (countDelete >= 1 && countInsert >= 1) {

  						// Delete the offending records and add the merged ones.
  						diffs.splice(pointer - countDelete - countInsert, countDelete + countInsert);
  						pointer = pointer - countDelete - countInsert;
  						a = this.DiffMain(textDelete, textInsert, false, deadline);
  						for (j = a.length - 1; j >= 0; j--) {
  							diffs.splice(pointer, 0, a[j]);
  						}
  						pointer = pointer + a.length;
  					}
  					countInsert = 0;
  					countDelete = 0;
  					textDelete = "";
  					textInsert = "";
  					break;
  			}
  			pointer++;
  		}
  		diffs.pop(); // Remove the dummy entry at the end.

  		return diffs;
  	};

  	/**
    * Find the 'middle snake' of a diff, split the problem in two
    * and return the recursively constructed diff.
    * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
    * @param {string} text1 Old string to be diffed.
    * @param {string} text2 New string to be diffed.
    * @param {number} deadline Time at which to bail if not yet complete.
    * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
    * @private
    */
  	DiffMatchPatch.prototype.diffBisect = function (text1, text2, deadline) {
  		var text1Length, text2Length, maxD, vOffset, vLength, v1, v2, x, delta, front, k1start, k1end, k2start, k2end, k2Offset, k1Offset, x1, x2, y1, y2, d, k1, k2;

  		// Cache the text lengths to prevent multiple calls.
  		text1Length = text1.length;
  		text2Length = text2.length;
  		maxD = Math.ceil((text1Length + text2Length) / 2);
  		vOffset = maxD;
  		vLength = 2 * maxD;
  		v1 = new Array(vLength);
  		v2 = new Array(vLength);

  		// Setting all elements to -1 is faster in Chrome & Firefox than mixing
  		// integers and undefined.
  		for (x = 0; x < vLength; x++) {
  			v1[x] = -1;
  			v2[x] = -1;
  		}
  		v1[vOffset + 1] = 0;
  		v2[vOffset + 1] = 0;
  		delta = text1Length - text2Length;

  		// If the total number of characters is odd, then the front path will collide
  		// with the reverse path.
  		front = delta % 2 !== 0;

  		// Offsets for start and end of k loop.
  		// Prevents mapping of space beyond the grid.
  		k1start = 0;
  		k1end = 0;
  		k2start = 0;
  		k2end = 0;
  		for (d = 0; d < maxD; d++) {

  			// Bail out if deadline is reached.
  			if (new Date().getTime() > deadline) {
  				break;
  			}

  			// Walk the front path one step.
  			for (k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
  				k1Offset = vOffset + k1;
  				if (k1 === -d || k1 !== d && v1[k1Offset - 1] < v1[k1Offset + 1]) {
  					x1 = v1[k1Offset + 1];
  				} else {
  					x1 = v1[k1Offset - 1] + 1;
  				}
  				y1 = x1 - k1;
  				while (x1 < text1Length && y1 < text2Length && text1.charAt(x1) === text2.charAt(y1)) {
  					x1++;
  					y1++;
  				}
  				v1[k1Offset] = x1;
  				if (x1 > text1Length) {

  					// Ran off the right of the graph.
  					k1end += 2;
  				} else if (y1 > text2Length) {

  					// Ran off the bottom of the graph.
  					k1start += 2;
  				} else if (front) {
  					k2Offset = vOffset + delta - k1;
  					if (k2Offset >= 0 && k2Offset < vLength && v2[k2Offset] !== -1) {

  						// Mirror x2 onto top-left coordinate system.
  						x2 = text1Length - v2[k2Offset];
  						if (x1 >= x2) {

  							// Overlap detected.
  							return this.diffBisectSplit(text1, text2, x1, y1, deadline);
  						}
  					}
  				}
  			}

  			// Walk the reverse path one step.
  			for (k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
  				k2Offset = vOffset + k2;
  				if (k2 === -d || k2 !== d && v2[k2Offset - 1] < v2[k2Offset + 1]) {
  					x2 = v2[k2Offset + 1];
  				} else {
  					x2 = v2[k2Offset - 1] + 1;
  				}
  				y2 = x2 - k2;
  				while (x2 < text1Length && y2 < text2Length && text1.charAt(text1Length - x2 - 1) === text2.charAt(text2Length - y2 - 1)) {
  					x2++;
  					y2++;
  				}
  				v2[k2Offset] = x2;
  				if (x2 > text1Length) {

  					// Ran off the left of the graph.
  					k2end += 2;
  				} else if (y2 > text2Length) {

  					// Ran off the top of the graph.
  					k2start += 2;
  				} else if (!front) {
  					k1Offset = vOffset + delta - k2;
  					if (k1Offset >= 0 && k1Offset < vLength && v1[k1Offset] !== -1) {
  						x1 = v1[k1Offset];
  						y1 = vOffset + x1 - k1Offset;

  						// Mirror x2 onto top-left coordinate system.
  						x2 = text1Length - x2;
  						if (x1 >= x2) {

  							// Overlap detected.
  							return this.diffBisectSplit(text1, text2, x1, y1, deadline);
  						}
  					}
  				}
  			}
  		}

  		// Diff took too long and hit the deadline or
  		// number of diffs equals number of characters, no commonality at all.
  		return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  	};

  	/**
    * Given the location of the 'middle snake', split the diff in two parts
    * and recurse.
    * @param {string} text1 Old string to be diffed.
    * @param {string} text2 New string to be diffed.
    * @param {number} x Index of split point in text1.
    * @param {number} y Index of split point in text2.
    * @param {number} deadline Time at which to bail if not yet complete.
    * @return {!Array.<!DiffMatchPatch.Diff>} Array of diff tuples.
    * @private
    */
  	DiffMatchPatch.prototype.diffBisectSplit = function (text1, text2, x, y, deadline) {
  		var text1a, text1b, text2a, text2b, diffs, diffsb;
  		text1a = text1.substring(0, x);
  		text2a = text2.substring(0, y);
  		text1b = text1.substring(x);
  		text2b = text2.substring(y);

  		// Compute both diffs serially.
  		diffs = this.DiffMain(text1a, text2a, false, deadline);
  		diffsb = this.DiffMain(text1b, text2b, false, deadline);

  		return diffs.concat(diffsb);
  	};

  	/**
    * Reduce the number of edits by eliminating semantically trivial equalities.
    * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
    */
  	DiffMatchPatch.prototype.diffCleanupSemantic = function (diffs) {
  		var changes, equalities, equalitiesLength, lastequality, pointer, lengthInsertions2, lengthDeletions2, lengthInsertions1, lengthDeletions1, deletion, insertion, overlapLength1, overlapLength2;
  		changes = false;
  		equalities = []; // Stack of indices where equalities are found.
  		equalitiesLength = 0; // Keeping our own length var is faster in JS.
  		/** @type {?string} */
  		lastequality = null;

  		// Always equal to diffs[equalities[equalitiesLength - 1]][1]
  		pointer = 0; // Index of current position.

  		// Number of characters that changed prior to the equality.
  		lengthInsertions1 = 0;
  		lengthDeletions1 = 0;

  		// Number of characters that changed after the equality.
  		lengthInsertions2 = 0;
  		lengthDeletions2 = 0;
  		while (pointer < diffs.length) {
  			if (diffs[pointer][0] === DIFF_EQUAL) {
  				// Equality found.
  				equalities[equalitiesLength++] = pointer;
  				lengthInsertions1 = lengthInsertions2;
  				lengthDeletions1 = lengthDeletions2;
  				lengthInsertions2 = 0;
  				lengthDeletions2 = 0;
  				lastequality = diffs[pointer][1];
  			} else {
  				// An insertion or deletion.
  				if (diffs[pointer][0] === DIFF_INSERT) {
  					lengthInsertions2 += diffs[pointer][1].length;
  				} else {
  					lengthDeletions2 += diffs[pointer][1].length;
  				}

  				// Eliminate an equality that is smaller or equal to the edits on both
  				// sides of it.
  				if (lastequality && lastequality.length <= Math.max(lengthInsertions1, lengthDeletions1) && lastequality.length <= Math.max(lengthInsertions2, lengthDeletions2)) {

  					// Duplicate record.
  					diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);

  					// Change second copy to insert.
  					diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;

  					// Throw away the equality we just deleted.
  					equalitiesLength--;

  					// Throw away the previous equality (it needs to be reevaluated).
  					equalitiesLength--;
  					pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;

  					// Reset the counters.
  					lengthInsertions1 = 0;
  					lengthDeletions1 = 0;
  					lengthInsertions2 = 0;
  					lengthDeletions2 = 0;
  					lastequality = null;
  					changes = true;
  				}
  			}
  			pointer++;
  		}

  		// Normalize the diff.
  		if (changes) {
  			this.diffCleanupMerge(diffs);
  		}

  		// Find any overlaps between deletions and insertions.
  		// e.g: <del>abcxxx</del><ins>xxxdef</ins>
  		//   -> <del>abc</del>xxx<ins>def</ins>
  		// e.g: <del>xxxabc</del><ins>defxxx</ins>
  		//   -> <ins>def</ins>xxx<del>abc</del>
  		// Only extract an overlap if it is as big as the edit ahead or behind it.
  		pointer = 1;
  		while (pointer < diffs.length) {
  			if (diffs[pointer - 1][0] === DIFF_DELETE && diffs[pointer][0] === DIFF_INSERT) {
  				deletion = diffs[pointer - 1][1];
  				insertion = diffs[pointer][1];
  				overlapLength1 = this.diffCommonOverlap(deletion, insertion);
  				overlapLength2 = this.diffCommonOverlap(insertion, deletion);
  				if (overlapLength1 >= overlapLength2) {
  					if (overlapLength1 >= deletion.length / 2 || overlapLength1 >= insertion.length / 2) {

  						// Overlap found.  Insert an equality and trim the surrounding edits.
  						diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlapLength1)]);
  						diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlapLength1);
  						diffs[pointer + 1][1] = insertion.substring(overlapLength1);
  						pointer++;
  					}
  				} else {
  					if (overlapLength2 >= deletion.length / 2 || overlapLength2 >= insertion.length / 2) {

  						// Reverse overlap found.
  						// Insert an equality and swap and trim the surrounding edits.
  						diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlapLength2)]);

  						diffs[pointer - 1][0] = DIFF_INSERT;
  						diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlapLength2);
  						diffs[pointer + 1][0] = DIFF_DELETE;
  						diffs[pointer + 1][1] = deletion.substring(overlapLength2);
  						pointer++;
  					}
  				}
  				pointer++;
  			}
  			pointer++;
  		}
  	};

  	/**
    * Determine if the suffix of one string is the prefix of another.
    * @param {string} text1 First string.
    * @param {string} text2 Second string.
    * @return {number} The number of characters common to the end of the first
    *     string and the start of the second string.
    * @private
    */
  	DiffMatchPatch.prototype.diffCommonOverlap = function (text1, text2) {
  		var text1Length, text2Length, textLength, best, length, pattern, found;

  		// Cache the text lengths to prevent multiple calls.
  		text1Length = text1.length;
  		text2Length = text2.length;

  		// Eliminate the null case.
  		if (text1Length === 0 || text2Length === 0) {
  			return 0;
  		}

  		// Truncate the longer string.
  		if (text1Length > text2Length) {
  			text1 = text1.substring(text1Length - text2Length);
  		} else if (text1Length < text2Length) {
  			text2 = text2.substring(0, text1Length);
  		}
  		textLength = Math.min(text1Length, text2Length);

  		// Quick check for the worst case.
  		if (text1 === text2) {
  			return textLength;
  		}

  		// Start by looking for a single character match
  		// and increase length until no match is found.
  		// Performance analysis: https://neil.fraser.name/news/2010/11/04/
  		best = 0;
  		length = 1;
  		while (true) {
  			pattern = text1.substring(textLength - length);
  			found = text2.indexOf(pattern);
  			if (found === -1) {
  				return best;
  			}
  			length += found;
  			if (found === 0 || text1.substring(textLength - length) === text2.substring(0, length)) {
  				best = length;
  				length++;
  			}
  		}
  	};

  	/**
    * Split two texts into an array of strings.  Reduce the texts to a string of
    * hashes where each Unicode character represents one line.
    * @param {string} text1 First string.
    * @param {string} text2 Second string.
    * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
    *     An object containing the encoded text1, the encoded text2 and
    *     the array of unique strings.
    *     The zeroth element of the array of unique strings is intentionally blank.
    * @private
    */
  	DiffMatchPatch.prototype.diffLinesToChars = function (text1, text2) {
  		var lineArray, lineHash, chars1, chars2;
  		lineArray = []; // E.g. lineArray[4] === 'Hello\n'
  		lineHash = {}; // E.g. lineHash['Hello\n'] === 4

  		// '\x00' is a valid character, but various debuggers don't like it.
  		// So we'll insert a junk entry to avoid generating a null character.
  		lineArray[0] = "";

  		/**
     * Split a text into an array of strings.  Reduce the texts to a string of
     * hashes where each Unicode character represents one line.
     * Modifies linearray and linehash through being a closure.
     * @param {string} text String to encode.
     * @return {string} Encoded string.
     * @private
     */
  		function diffLinesToCharsMunge(text) {
  			var chars, lineStart, lineEnd, lineArrayLength, line;
  			chars = "";

  			// Walk the text, pulling out a substring for each line.
  			// text.split('\n') would would temporarily double our memory footprint.
  			// Modifying text would create many large strings to garbage collect.
  			lineStart = 0;
  			lineEnd = -1;

  			// Keeping our own length variable is faster than looking it up.
  			lineArrayLength = lineArray.length;
  			while (lineEnd < text.length - 1) {
  				lineEnd = text.indexOf("\n", lineStart);
  				if (lineEnd === -1) {
  					lineEnd = text.length - 1;
  				}
  				line = text.substring(lineStart, lineEnd + 1);
  				lineStart = lineEnd + 1;

  				var lineHashExists = lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== undefined;

  				if (lineHashExists) {
  					chars += String.fromCharCode(lineHash[line]);
  				} else {
  					chars += String.fromCharCode(lineArrayLength);
  					lineHash[line] = lineArrayLength;
  					lineArray[lineArrayLength++] = line;
  				}
  			}
  			return chars;
  		}

  		chars1 = diffLinesToCharsMunge(text1);
  		chars2 = diffLinesToCharsMunge(text2);
  		return {
  			chars1: chars1,
  			chars2: chars2,
  			lineArray: lineArray
  		};
  	};

  	/**
    * Rehydrate the text in a diff from a string of line hashes to real lines of
    * text.
    * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
    * @param {!Array.<string>} lineArray Array of unique strings.
    * @private
    */
  	DiffMatchPatch.prototype.diffCharsToLines = function (diffs, lineArray) {
  		var x, chars, text, y;
  		for (x = 0; x < diffs.length; x++) {
  			chars = diffs[x][1];
  			text = [];
  			for (y = 0; y < chars.length; y++) {
  				text[y] = lineArray[chars.charCodeAt(y)];
  			}
  			diffs[x][1] = text.join("");
  		}
  	};

  	/**
    * Reorder and merge like edit sections.  Merge equalities.
    * Any edit section can move as long as it doesn't cross an equality.
    * @param {!Array.<!DiffMatchPatch.Diff>} diffs Array of diff tuples.
    */
  	DiffMatchPatch.prototype.diffCleanupMerge = function (diffs) {
  		var pointer, countDelete, countInsert, textInsert, textDelete, commonlength, changes, diffPointer, position;
  		diffs.push([DIFF_EQUAL, ""]); // Add a dummy entry at the end.
  		pointer = 0;
  		countDelete = 0;
  		countInsert = 0;
  		textDelete = "";
  		textInsert = "";

  		while (pointer < diffs.length) {
  			switch (diffs[pointer][0]) {
  				case DIFF_INSERT:
  					countInsert++;
  					textInsert += diffs[pointer][1];
  					pointer++;
  					break;
  				case DIFF_DELETE:
  					countDelete++;
  					textDelete += diffs[pointer][1];
  					pointer++;
  					break;
  				case DIFF_EQUAL:

  					// Upon reaching an equality, check for prior redundancies.
  					if (countDelete + countInsert > 1) {
  						if (countDelete !== 0 && countInsert !== 0) {

  							// Factor out any common prefixes.
  							commonlength = this.diffCommonPrefix(textInsert, textDelete);
  							if (commonlength !== 0) {
  								if (pointer - countDelete - countInsert > 0 && diffs[pointer - countDelete - countInsert - 1][0] === DIFF_EQUAL) {
  									diffs[pointer - countDelete - countInsert - 1][1] += textInsert.substring(0, commonlength);
  								} else {
  									diffs.splice(0, 0, [DIFF_EQUAL, textInsert.substring(0, commonlength)]);
  									pointer++;
  								}
  								textInsert = textInsert.substring(commonlength);
  								textDelete = textDelete.substring(commonlength);
  							}

  							// Factor out any common suffixies.
  							commonlength = this.diffCommonSuffix(textInsert, textDelete);
  							if (commonlength !== 0) {
  								diffs[pointer][1] = textInsert.substring(textInsert.length - commonlength) + diffs[pointer][1];
  								textInsert = textInsert.substring(0, textInsert.length - commonlength);
  								textDelete = textDelete.substring(0, textDelete.length - commonlength);
  							}
  						}

  						// Delete the offending records and add the merged ones.
  						if (countDelete === 0) {
  							diffs.splice(pointer - countInsert, countDelete + countInsert, [DIFF_INSERT, textInsert]);
  						} else if (countInsert === 0) {
  							diffs.splice(pointer - countDelete, countDelete + countInsert, [DIFF_DELETE, textDelete]);
  						} else {
  							diffs.splice(pointer - countDelete - countInsert, countDelete + countInsert, [DIFF_DELETE, textDelete], [DIFF_INSERT, textInsert]);
  						}
  						pointer = pointer - countDelete - countInsert + (countDelete ? 1 : 0) + (countInsert ? 1 : 0) + 1;
  					} else if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {

  						// Merge this equality with the previous one.
  						diffs[pointer - 1][1] += diffs[pointer][1];
  						diffs.splice(pointer, 1);
  					} else {
  						pointer++;
  					}
  					countInsert = 0;
  					countDelete = 0;
  					textDelete = "";
  					textInsert = "";
  					break;
  			}
  		}
  		if (diffs[diffs.length - 1][1] === "") {
  			diffs.pop(); // Remove the dummy entry at the end.
  		}

  		// Second pass: look for single edits surrounded on both sides by equalities
  		// which can be shifted sideways to eliminate an equality.
  		// e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  		changes = false;
  		pointer = 1;

  		// Intentionally ignore the first and last element (don't need checking).
  		while (pointer < diffs.length - 1) {
  			if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {

  				diffPointer = diffs[pointer][1];
  				position = diffPointer.substring(diffPointer.length - diffs[pointer - 1][1].length);

  				// This is a single edit surrounded by equalities.
  				if (position === diffs[pointer - 1][1]) {

  					// Shift the edit over the previous equality.
  					diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
  					diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
  					diffs.splice(pointer - 1, 1);
  					changes = true;
  				} else if (diffPointer.substring(0, diffs[pointer + 1][1].length) === diffs[pointer + 1][1]) {

  					// Shift the edit over the next equality.
  					diffs[pointer - 1][1] += diffs[pointer + 1][1];
  					diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
  					diffs.splice(pointer + 1, 1);
  					changes = true;
  				}
  			}
  			pointer++;
  		}

  		// If shifts were made, the diff needs reordering and another shift sweep.
  		if (changes) {
  			this.diffCleanupMerge(diffs);
  		}
  	};

  	return function (o, n) {
  		var diff, output, text;
  		diff = new DiffMatchPatch();
  		output = diff.DiffMain(o, n);
  		diff.diffCleanupEfficiency(output);
  		text = diff.diffPrettyHtml(output);

  		return text;
  	};
  }();

}((function() { return this; }())));

/* globals QUnit */

(function() {
  QUnit.config.autostart = false;
  QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container' });
  QUnit.config.urlConfig.push({ id: 'nolint', label: 'Disable Linting' });
  QUnit.config.urlConfig.push({ id: 'dockcontainer', label: 'Dock container' });
  QUnit.config.urlConfig.push({ id: 'devmode', label: 'Development mode' });

  QUnit.config.testTimeout = QUnit.urlParams.devmode ? null : 60000; //Default Test Timeout 60 Seconds
})();

(function () {
  'use strict';

  function exists(options, message) {
      if (typeof options === 'string') {
          message = options;
          options = undefined;
      }
      var elements = this.findElements(this.target);
      var expectedCount = options ? options.count : null;
      if (expectedCount === null) {
          var result = elements.length > 0;
          var expected = format(this.target);
          var actual = result ? expected : format(this.target, 0);
          if (!message) {
              message = expected;
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      }
      else if (typeof expectedCount === 'number') {
          var result = elements.length === expectedCount;
          var actual = format(this.target, elements.length);
          var expected = format(this.target, expectedCount);
          if (!message) {
              message = expected;
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      }
      else {
          throw new TypeError("Unexpected Parameter: " + expectedCount);
      }
  }
  function format(selector, num) {
      if (num === undefined || num === null) {
          return "Element " + selector + " exists";
      }
      else if (num === 0) {
          return "Element " + selector + " does not exist";
      }
      else if (num === 1) {
          return "Element " + selector + " exists once";
      }
      else if (num === 2) {
          return "Element " + selector + " exists twice";
      }
      else {
          return "Element " + selector + " exists " + num + " times";
      }
  }

  // imported from https://github.com/nathanboktae/chai-dom
  function elementToString(el) {
      var desc;
      if (el instanceof NodeList) {
          if (el.length === 0) {
              return 'empty NodeList';
          }
          desc = Array.prototype.slice
              .call(el, 0, 5)
              .map(elementToString)
              .join(', ');
          return el.length > 5 ? desc + "... (+" + (el.length - 5) + " more)" : desc;
      }
      if (!(el instanceof HTMLElement || el instanceof SVGElement)) {
          return String(el);
      }
      desc = el.tagName.toLowerCase();
      if (el.id) {
          desc += "#" + el.id;
      }
      if (el.className && !(el.className instanceof SVGAnimatedString)) {
          desc += "." + String(el.className).replace(/\s+/g, '.');
      }
      Array.prototype.forEach.call(el.attributes, function (attr) {
          if (attr.name !== 'class' && attr.name !== 'id') {
              desc += "[" + attr.name + (attr.value ? "=\"" + attr.value + "\"]" : ']');
          }
      });
      return desc;
  }

  function focused(message) {
      var element = this.findTargetElement();
      if (!element)
          return;
      var result = document.activeElement === element;
      var actual = elementToString(document.activeElement);
      var expected = elementToString(this.target);
      if (!message) {
          message = "Element " + expected + " is focused";
      }
      this.pushResult({ result: result, actual: actual, expected: expected, message: message });
  }

  function notFocused(message) {
      var element = this.findTargetElement();
      if (!element)
          return;
      var result = document.activeElement !== element;
      if (!message) {
          message = "Element " + this.targetDescription + " is not focused";
      }
      this.pushResult({ result: result, message: message });
  }

  function checked(message) {
      var element = this.findTargetElement();
      if (!element)
          return;
      var result = element.checked === true;
      var actual = element.checked === true ? 'checked' : 'not checked';
      var expected = 'checked';
      if (!message) {
          message = "Element " + elementToString(this.target) + " is checked";
      }
      this.pushResult({ result: result, actual: actual, expected: expected, message: message });
  }

  function notChecked(message) {
      var element = this.findTargetElement();
      if (!element)
          return;
      var result = element.checked === false;
      var actual = element.checked === true ? 'checked' : 'not checked';
      var expected = 'not checked';
      if (!message) {
          message = "Element " + elementToString(this.target) + " is not checked";
      }
      this.pushResult({ result: result, actual: actual, expected: expected, message: message });
  }

  function required(message) {
      var element = this.findTargetElement();
      if (!element)
          return;
      if (!(element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement)) {
          throw new TypeError("Unexpected Element Type: " + element.toString());
      }
      var result = element.required === true;
      var actual = result ? 'required' : 'not required';
      var expected = 'required';
      if (!message) {
          message = "Element " + elementToString(this.target) + " is required";
      }
      this.pushResult({ result: result, actual: actual, expected: expected, message: message });
  }

  function notRequired(message) {
      var element = this.findTargetElement();
      if (!element)
          return;
      if (!(element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement)) {
          throw new TypeError("Unexpected Element Type: " + element.toString());
      }
      var result = element.required === false;
      var actual = !result ? 'required' : 'not required';
      var expected = 'not required';
      if (!message) {
          message = "Element " + elementToString(this.target) + " is not required";
      }
      this.pushResult({ result: result, actual: actual, expected: expected, message: message });
  }

  // Visible logic based on jQuery's
  // https://github.com/jquery/jquery/blob/4a2bcc27f9c3ee24b3effac0fbe1285d1ee23cc5/src/css/hiddenVisibleSelectors.js#L11-L13
  function visible(el) {
      if (el === null)
          return false;
      if (el.offsetWidth === 0 || el.offsetHeight === 0)
          return false;
      var clientRects = el.getClientRects();
      if (clientRects.length === 0)
          return false;
      for (var i = 0; i < clientRects.length; i++) {
          var rect = clientRects[i];
          if (rect.width !== 0 && rect.height !== 0)
              return true;
      }
      return false;
  }

  function isVisible(options, message) {
      if (typeof options === 'string') {
          message = options;
          options = undefined;
      }
      var elements = this.findElements(this.target).filter(visible);
      var expectedCount = options ? options.count : null;
      if (expectedCount === null) {
          var result = elements.length > 0;
          var expected = format$1(this.target);
          var actual = result ? expected : format$1(this.target, 0);
          if (!message) {
              message = expected;
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      }
      else if (typeof expectedCount === 'number') {
          var result = elements.length === expectedCount;
          var actual = format$1(this.target, elements.length);
          var expected = format$1(this.target, expectedCount);
          if (!message) {
              message = expected;
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      }
      else {
          throw new TypeError("Unexpected Parameter: " + expectedCount);
      }
  }
  function format$1(selector, num) {
      if (num === undefined || num === null) {
          return "Element " + selector + " is visible";
      }
      else if (num === 0) {
          return "Element " + selector + " is not visible";
      }
      else if (num === 1) {
          return "Element " + selector + " is visible once";
      }
      else if (num === 2) {
          return "Element " + selector + " is visible twice";
      }
      else {
          return "Element " + selector + " is visible " + num + " times";
      }
  }

  function isDisabled(message, options) {
      if (options === void 0) { options = {}; }
      var inverted = options.inverted;
      var element = this.findTargetElement();
      if (!element)
          return;
      if (!(element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLButtonElement ||
          element instanceof HTMLOptGroupElement ||
          element instanceof HTMLOptionElement ||
          element instanceof HTMLFieldSetElement)) {
          throw new TypeError("Unexpected Element Type: " + element.toString());
      }
      var result = element.disabled === !inverted;
      var actual = element.disabled === false
          ? "Element " + this.targetDescription + " is not disabled"
          : "Element " + this.targetDescription + " is disabled";
      var expected = inverted
          ? "Element " + this.targetDescription + " is not disabled"
          : "Element " + this.targetDescription + " is disabled";
      if (!message) {
          message = expected;
      }
      this.pushResult({ result: result, actual: actual, expected: expected, message: message });
  }

  function matchesSelector(elements, compareSelector) {
      var failures = elements.filter(function (it) { return !it.matches(compareSelector); });
      return failures.length;
  }

  function collapseWhitespace(string) {
      return string
          .replace(/[\t\r\n]/g, ' ')
          .replace(/ +/g, ' ')
          .replace(/^ /, '')
          .replace(/ $/, '');
  }

  /**
   * This function can be used to convert a NodeList to a regular array.
   * We should be using `Array.from()` for this, but IE11 doesn't support that :(
   *
   * @private
   */
  function toArray(list) {
      return Array.prototype.slice.call(list);
  }

  var DOMAssertions = /** @class */ (function () {
      function DOMAssertions(target, rootElement, testContext) {
          this.target = target;
          this.rootElement = rootElement;
          this.testContext = testContext;
      }
      /**
       * Assert an {@link HTMLElement} (or multiple) matching the `selector` exists.
       *
       * @param {object?} options
       * @param {string?} message
       *
       * @example
       * assert.dom('#title').exists();
       * assert.dom('.choice').exists({ count: 4 });
       *
       * @see {@link #doesNotExist}
       */
      DOMAssertions.prototype.exists = function (options, message) {
          exists.call(this, options, message);
      };
      /**
       * Assert an {@link HTMLElement} matching the `selector` does not exists.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('.should-not-exist').doesNotExist();
       *
       * @see {@link #exists}
       */
      DOMAssertions.prototype.doesNotExist = function (message) {
          exists.call(this, { count: 0 }, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is currently checked.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input.active').isChecked();
       *
       * @see {@link #isNotChecked}
       */
      DOMAssertions.prototype.isChecked = function (message) {
          checked.call(this, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is currently unchecked.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input.active').isNotChecked();
       *
       * @see {@link #isChecked}
       */
      DOMAssertions.prototype.isNotChecked = function (message) {
          notChecked.call(this, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is currently focused.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input.email').isFocused();
       *
       * @see {@link #isNotFocused}
       */
      DOMAssertions.prototype.isFocused = function (message) {
          focused.call(this, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is not currently focused.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input[type="password"]').isNotFocused();
       *
       * @see {@link #isFocused}
       */
      DOMAssertions.prototype.isNotFocused = function (message) {
          notFocused.call(this, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is currently required.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input[type="text"]').isRequired();
       *
       * @see {@link #isNotRequired}
       */
      DOMAssertions.prototype.isRequired = function (message) {
          required.call(this, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is currently not required.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input[type="text"]').isNotRequired();
       *
       * @see {@link #isRequired}
       */
      DOMAssertions.prototype.isNotRequired = function (message) {
          notRequired.call(this, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` exists and is visible.
       *
       * Visibility is determined by asserting that:
       *
       * - the element's offsetWidth and offsetHeight are non-zero
       * - any of the element's DOMRect objects have a non-zero size
       *
       * Additionally, visibility in this case means that the element is visible on the page,
       * but not necessarily in the viewport.
       *
       * @param {object?} options
       * @param {string?} message
       *
       * @example
       * assert.dom('#title').isVisible();
       * assert.dom('.choice').isVisible({ count: 4 });
       *
       * @see {@link #isNotVisible}
       */
      DOMAssertions.prototype.isVisible = function (options, message) {
          isVisible.call(this, options, message);
      };
      /**
       * Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` does not exist or is not visible on the page.
       *
       * Visibility is determined by asserting that:
       *
       * - the element's offsetWidth or offsetHeight are zero
       * - all of the element's DOMRect objects have a size of zero
       *
       * Additionally, visibility in this case means that the element is visible on the page,
       * but not necessarily in the viewport.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('.foo').isNotVisible();
       *
       * @see {@link #isVisible}
       */
      DOMAssertions.prototype.isNotVisible = function (message) {
          isVisible.call(this, { count: 0 }, message);
      };
      /**
       * Assert that the {@link HTMLElement} has an attribute with the provided `name`
       * and optionally checks if the attribute `value` matches the provided text
       * or regular expression.
       *
       * @param {string} name
       * @param {string|RegExp|object?} value
       * @param {string?} message
       *
       * @example
       * assert.dom('input.password-input').hasAttribute('type', 'password');
       *
       * @see {@link #doesNotHaveAttribute}
       */
      DOMAssertions.prototype.hasAttribute = function (name, value, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          if (arguments.length === 1) {
              value = { any: true };
          }
          var actualValue = element.getAttribute(name);
          if (value instanceof RegExp) {
              var result = value.test(actualValue);
              var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value matching " + value;
              var actual = actualValue === null
                  ? "Element " + this.targetDescription + " does not have attribute \"" + name + "\""
                  : "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(actualValue);
              if (!message) {
                  message = expected;
              }
              this.pushResult({ result: result, actual: actual, expected: expected, message: message });
          }
          else if (value.any === true) {
              var result = actualValue !== null;
              var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\"";
              var actual = result
                  ? expected
                  : "Element " + this.targetDescription + " does not have attribute \"" + name + "\"";
              if (!message) {
                  message = expected;
              }
              this.pushResult({ result: result, actual: actual, expected: expected, message: message });
          }
          else {
              var result = value === actualValue;
              var expected = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(value);
              var actual = actualValue === null
                  ? "Element " + this.targetDescription + " does not have attribute \"" + name + "\""
                  : "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(actualValue);
              if (!message) {
                  message = expected;
              }
              this.pushResult({ result: result, actual: actual, expected: expected, message: message });
          }
      };
      /**
       * Assert that the {@link HTMLElement} has no attribute with the provided `name`.
       *
       * **Aliases:** `hasNoAttribute`, `lacksAttribute`
       *
       * @param {string} name
       * @param {string?} message
       *
       * @example
       * assert.dom('input.username').hasNoAttribute('disabled');
       *
       * @see {@link #hasAttribute}
       */
      DOMAssertions.prototype.doesNotHaveAttribute = function (name, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          var result = !element.hasAttribute(name);
          var expected = "Element " + this.targetDescription + " does not have attribute \"" + name + "\"";
          var actual = expected;
          if (!result) {
              var value = element.getAttribute(name);
              actual = "Element " + this.targetDescription + " has attribute \"" + name + "\" with value " + JSON.stringify(value);
          }
          if (!message) {
              message = expected;
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      };
      DOMAssertions.prototype.hasNoAttribute = function (name, message) {
          this.doesNotHaveAttribute(name, message);
      };
      DOMAssertions.prototype.lacksAttribute = function (name, message) {
          this.doesNotHaveAttribute(name, message);
      };
      /**
       *  Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is disabled.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('.foo').isDisabled();
       *
       * @see {@link #isNotDisabled}
       */
      DOMAssertions.prototype.isDisabled = function (message) {
          isDisabled.call(this, message);
      };
      /**
       *  Assert that the {@link HTMLElement} or an {@link HTMLElement} matching the
       * `selector` is not disabled.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('.foo').isNotDisabled();
       *
       * @see {@link #isDisabled}
       */
      DOMAssertions.prototype.isNotDisabled = function (message) {
          isDisabled.call(this, message, { inverted: true });
      };
      /**
       * Assert that the {@link HTMLElement} has the `expected` CSS class using
       * [`classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).
       *
       * @param {string} expected
       * @param {string?} message
       *
       * @example
       * assert.dom('input[type="password"]').hasClass('secret-password-input');
       *
       * @see {@link #doesNotHaveClass}
       */
      DOMAssertions.prototype.hasClass = function (expected, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          var actual = element.classList.toString();
          var result = element.classList.contains(expected);
          if (!message) {
              message = "Element " + this.targetDescription + " has CSS class \"" + expected + "\"";
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      };
      /**
       * Assert that the {@link HTMLElement} does not have the `expected` CSS class using
       * [`classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).
       *
       * **Aliases:** `hasNoClass`, `lacksClass`
       *
       * @param {string} expected
       * @param {string?} message
       *
       * @example
       * assert.dom('input[type="password"]').doesNotHaveClass('username-input');
       *
       * @see {@link #hasClass}
       */
      DOMAssertions.prototype.doesNotHaveClass = function (expected, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          var result = !element.classList.contains(expected);
          var actual = element.classList.toString();
          if (!message) {
              message = "Element " + this.targetDescription + " does not have CSS class \"" + expected + "\"";
          }
          this.pushResult({ result: result, actual: actual, expected: "not: " + expected, message: message });
      };
      DOMAssertions.prototype.hasNoClass = function (expected, message) {
          this.doesNotHaveClass(expected, message);
      };
      DOMAssertions.prototype.lacksClass = function (expected, message) {
          this.doesNotHaveClass(expected, message);
      };
      /**
       * Assert that the [HTMLElement][] has the `expected` style declarations using
       * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
       *
       * @name hasStyle
       * @param {object} expected
       * @param {string?} message
       *
       * @example
       * assert.dom('.progress-bar').hasStyle({
       *   opacity: 1,
       *   display: 'block'
       * });
       *
       * @see {@link #hasClass}
       */
      DOMAssertions.prototype.hasStyle = function (expected, message) {
          this.hasPseudoElementStyle(null, expected, message);
      };
      /**
       * Assert that the pseudo element for `selector` of the [HTMLElement][] has the `expected` style declarations using
       * [`window.getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle).
       *
       * @name hasPseudoElementStyle
       * @param {string} selector
       * @param {object} expected
       * @param {string?} message
       *
       * @example
       * assert.dom('.progress-bar').hasPseudoElementStyle(':after', {
       *   content: '";"',
       * });
       *
       * @see {@link #hasClass}
       */
      DOMAssertions.prototype.hasPseudoElementStyle = function (selector, expected, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          var computedStyle = window.getComputedStyle(element, selector);
          var expectedProperties = Object.keys(expected);
          var result = expectedProperties.every(function (property) { return computedStyle[property] === expected[property]; });
          var actual = {};
          expectedProperties.forEach(function (property) { return (actual[property] = computedStyle[property]); });
          if (!message) {
              var normalizedSelector = selector ? selector.replace(/^:{0,2}/, '::') : '';
              message = "Element " + this.targetDescription + normalizedSelector + " has style \"" + JSON.stringify(expected) + "\"";
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      };
      /**
       * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
       * matching the `selector` matches the `expected` text, using the
       * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
       * attribute and stripping/collapsing whitespace.
       *
       * `expected` can also be a regular expression.
       *
       * > Note: This assertion will collapse whitespace if the type you pass in is a string.
       * > If you are testing specifically for whitespace integrity, pass your expected text
       * > in as a RegEx pattern.
       *
       * **Aliases:** `matchesText`
       *
       * @param {string|RegExp} expected
       * @param {string?} message
       *
       * @example
       * // <h2 id="title">
       * //   Welcome to <b>QUnit</b>
       * // </h2>
       *
       * assert.dom('#title').hasText('Welcome to QUnit');
       *
       * @example
       * assert.dom('.foo').hasText(/[12]\d{3}/);
       *
       * @see {@link #includesText}
       */
      DOMAssertions.prototype.hasText = function (expected, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          if (expected instanceof RegExp) {
              var result = expected.test(element.textContent);
              var actual = element.textContent;
              if (!message) {
                  message = "Element " + this.targetDescription + " has text matching " + expected;
              }
              this.pushResult({ result: result, actual: actual, expected: expected, message: message });
          }
          else if (expected.any === true) {
              var result = Boolean(element.textContent);
              var expected_1 = "Element " + this.targetDescription + " has a text";
              var actual = result ? expected_1 : "Element " + this.targetDescription + " has no text";
              if (!message) {
                  message = expected_1;
              }
              this.pushResult({ result: result, actual: actual, expected: expected_1, message: message });
          }
          else if (typeof expected === 'string') {
              expected = collapseWhitespace(expected);
              var actual = collapseWhitespace(element.textContent);
              var result = actual === expected;
              if (!message) {
                  message = "Element " + this.targetDescription + " has text \"" + expected + "\"";
              }
              this.pushResult({ result: result, actual: actual, expected: expected, message: message });
          }
          else {
              throw new TypeError("You must pass a string or Regular Expression to \"hasText\". You passed " + expected + ".");
          }
      };
      DOMAssertions.prototype.matchesText = function (expected, message) {
          this.hasText(expected, message);
      };
      /**
       * Assert that the `textContent` property of an {@link HTMLElement} is not empty.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('button.share').hasAnyText();
       *
       * @see {@link #hasText}
       */
      DOMAssertions.prototype.hasAnyText = function (message) {
          this.hasText({ any: true }, message);
      };
      /**
       * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
       * matching the `selector` contains the given `text`, using the
       * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
       * attribute.
       *
       * > Note: This assertion will collapse whitespace in `textContent` before searching.
       * > If you would like to assert on a string that *should* contain line breaks, tabs,
       * > more than one space in a row, or starting/ending whitespace, use the {@link #hasText}
       * > selector and pass your expected text in as a RegEx pattern.
       *
       * **Aliases:** `containsText`, `hasTextContaining`
       *
       * @param {string} text
       * @param {string?} message
       *
       * @example
       * assert.dom('#title').includesText('Welcome');
       *
       * @see {@link #hasText}
       */
      DOMAssertions.prototype.includesText = function (text, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          var collapsedText = collapseWhitespace(element.textContent);
          var result = collapsedText.indexOf(text) !== -1;
          var actual = collapsedText;
          var expected = text;
          if (!message) {
              message = "Element " + this.targetDescription + " has text containing \"" + text + "\"";
          }
          if (!result && text !== collapseWhitespace(text)) {
              console.warn('The `.includesText()`, `.containsText()`, and `.hasTextContaining()` assertions collapse whitespace. The text you are checking for contains whitespace that may have made your test fail incorrectly. Try the `.hasText()` assertion passing in your expected text as a RegExp pattern. Your text:\n' +
                  text);
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      };
      DOMAssertions.prototype.containsText = function (expected, message) {
          this.includesText(expected, message);
      };
      DOMAssertions.prototype.hasTextContaining = function (expected, message) {
          this.includesText(expected, message);
      };
      /**
       * Assert that the text of the {@link HTMLElement} or an {@link HTMLElement}
       * matching the `selector` does not include the given `text`, using the
       * [`textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
       * attribute.
       *
       * **Aliases:** `doesNotContainText`, `doesNotHaveTextContaining`
       *
       * @param {string} text
       * @param {string?} message
       *
       * @example
       * assert.dom('#title').doesNotIncludeText('Welcome');
       */
      DOMAssertions.prototype.doesNotIncludeText = function (text, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          var collapsedText = collapseWhitespace(element.textContent);
          var result = collapsedText.indexOf(text) === -1;
          var expected = "Element " + this.targetDescription + " does not include text \"" + text + "\"";
          var actual = expected;
          if (!result) {
              actual = "Element " + this.targetDescription + " includes text \"" + text + "\"";
          }
          if (!message) {
              message = expected;
          }
          this.pushResult({ result: result, actual: actual, expected: expected, message: message });
      };
      DOMAssertions.prototype.doesNotContainText = function (unexpected, message) {
          this.doesNotIncludeText(unexpected, message);
      };
      DOMAssertions.prototype.doesNotHaveTextContaining = function (unexpected, message) {
          this.doesNotIncludeText(unexpected, message);
      };
      /**
       * Assert that the `value` property of an {@link HTMLInputElement} matches
       * the `expected` text or regular expression.
       *
       * If no `expected` value is provided, the assertion will fail if the
       * `value` is an empty string.
       *
       * @param {string|RegExp|object?} expected
       * @param {string?} message
       *
       * @example
       * assert.dom('input.username').hasValue('HSimpson');
    
       * @see {@link #hasAnyValue}
       * @see {@link #hasNoValue}
       */
      DOMAssertions.prototype.hasValue = function (expected, message) {
          var element = this.findTargetElement();
          if (!element)
              return;
          if (arguments.length === 0) {
              expected = { any: true };
          }
          var value = element.value;
          if (expected instanceof RegExp) {
              var result = expected.test(value);
              var actual = value;
              if (!message) {
                  message = "Element " + this.targetDescription + " has value matching " + expected;
              }
              this.pushResult({ result: result, actual: actual, expected: expected, message: message });
          }
          else if (expected.any === true) {
              var result = Boolean(value);
              var expected_2 = "Element " + this.targetDescription + " has a value";
              var actual = result ? expected_2 : "Element " + this.targetDescription + " has no value";
              if (!message) {
                  message = expected_2;
              }
              this.pushResult({ result: result, actual: actual, expected: expected_2, message: message });
          }
          else {
              var actual = value;
              var result = actual === expected;
              if (!message) {
                  message = "Element " + this.targetDescription + " has value \"" + expected + "\"";
              }
              this.pushResult({ result: result, actual: actual, expected: expected, message: message });
          }
      };
      /**
       * Assert that the `value` property of an {@link HTMLInputElement} is not empty.
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input.username').hasAnyValue();
       *
       * @see {@link #hasValue}
       * @see {@link #hasNoValue}
       */
      DOMAssertions.prototype.hasAnyValue = function (message) {
          this.hasValue({ any: true }, message);
      };
      /**
       * Assert that the `value` property of an {@link HTMLInputElement} is empty.
       *
       * **Aliases:** `lacksValue`
       *
       * @param {string?} message
       *
       * @example
       * assert.dom('input.username').hasNoValue();
       *
       * @see {@link #hasValue}
       * @see {@link #hasAnyValue}
       */
      DOMAssertions.prototype.hasNoValue = function (message) {
          this.hasValue('', message);
      };
      DOMAssertions.prototype.lacksValue = function (message) {
          this.hasNoValue(message);
      };
      /**
       * Assert that the target selector selects only Elements that are also selected by
       * compareSelector.
       *
       * @param {string} compareSelector
       * @param {string?} message
       *
       * @example
       * assert.dom('p.red').matchesSelector('div.wrapper p:last-child')
       */
      DOMAssertions.prototype.matchesSelector = function (compareSelector, message) {
          var targetElements = this.target instanceof Element ? [this.target] : this.findElements();
          var targets = targetElements.length;
          var matchFailures = matchesSelector(targetElements, compareSelector);
          var singleElement = targets === 1;
          var selectedByPart = this.target instanceof Element ? 'passed' : "selected by " + this.target;
          var actual;
          var expected;
          if (matchFailures === 0) {
              // no failures matching.
              if (!message) {
                  message = singleElement
                      ? "The element " + selectedByPart + " also matches the selector " + compareSelector + "."
                      : targets + " elements, selected by " + this.target + ", also match the selector " + compareSelector + ".";
              }
              actual = expected = message;
              this.pushResult({ result: true, actual: actual, expected: expected, message: message });
          }
          else {
              var difference = targets - matchFailures;
              // there were failures when matching.
              if (!message) {
                  message = singleElement
                      ? "The element " + selectedByPart + " did not also match the selector " + compareSelector + "."
                      : matchFailures + " out of " + targets + " elements selected by " + this.target + " did not also match the selector " + compareSelector + ".";
              }
              actual = singleElement ? message : difference + " elements matched " + compareSelector + ".";
              expected = singleElement
                  ? "The element should have matched " + compareSelector + "."
                  : targets + " elements should have matched " + compareSelector + ".";
              this.pushResult({ result: false, actual: actual, expected: expected, message: message });
          }
      };
      /**
       * Assert that the target selector selects only Elements that are not also selected by
       * compareSelector.
       *
       * @param {string} compareSelector
       * @param {string?} message
       *
       * @example
       * assert.dom('input').doesNotMatchSelector('input[disabled]')
       */
      DOMAssertions.prototype.doesNotMatchSelector = function (compareSelector, message) {
          var targetElements = this.target instanceof Element ? [this.target] : this.findElements();
          var targets = targetElements.length;
          var matchFailures = matchesSelector(targetElements, compareSelector);
          var singleElement = targets === 1;
          var selectedByPart = this.target instanceof Element ? 'passed' : "selected by " + this.target;
          var actual;
          var expected;
          if (matchFailures === targets) {
              // the assertion is successful because no element matched the other selector.
              if (!message) {
                  message = singleElement
                      ? "The element " + selectedByPart + " did not also match the selector " + compareSelector + "."
                      : targets + " elements, selected by " + this.target + ", did not also match the selector " + compareSelector + ".";
              }
              actual = expected = message;
              this.pushResult({ result: true, actual: actual, expected: expected, message: message });
          }
          else {
              var difference = targets - matchFailures;
              // the assertion fails because at least one element matched the other selector.
              if (!message) {
                  message = singleElement
                      ? "The element " + selectedByPart + " must not also match the selector " + compareSelector + "."
                      : difference + " elements out of " + targets + ", selected by " + this.target + ", must not also match the selector " + compareSelector + ".";
              }
              actual = singleElement
                  ? "The element " + selectedByPart + " matched " + compareSelector + "."
                  : matchFailures + " elements did not match " + compareSelector + ".";
              expected = singleElement
                  ? message
                  : targets + " elements should not have matched " + compareSelector + ".";
              this.pushResult({ result: false, actual: actual, expected: expected, message: message });
          }
      };
      /**
       * @private
       */
      DOMAssertions.prototype.pushResult = function (result) {
          this.testContext.pushResult(result);
      };
      /**
       * Finds a valid HTMLElement from target, or pushes a failing assertion if a valid
       * element is not found.
       * @private
       * @returns (HTMLElement|null) a valid HTMLElement, or null
       */
      DOMAssertions.prototype.findTargetElement = function () {
          var el = this.findElement();
          if (el === null) {
              var message = "Element " + (this.target || '<unknown>') + " should exist";
              this.pushResult({ message: message, result: false });
              return null;
          }
          return el;
      };
      /**
       * Finds a valid HTMLElement from target
       * @private
       * @returns (HTMLElement|null) a valid HTMLElement, or null
       * @throws TypeError will be thrown if target is an unrecognized type
       */
      DOMAssertions.prototype.findElement = function () {
          if (this.target === null) {
              return null;
          }
          else if (typeof this.target === 'string') {
              return this.rootElement.querySelector(this.target);
          }
          else if (this.target instanceof Element) {
              return this.target;
          }
          else {
              throw new TypeError("Unexpected Parameter: " + this.target);
          }
      };
      /**
       * Finds a collection of HTMLElement instances from target using querySelectorAll
       * @private
       * @returns (HTMLElement[]) an array of HTMLElement instances
       * @throws TypeError will be thrown if target is an unrecognized type
       */
      DOMAssertions.prototype.findElements = function () {
          if (this.target === null) {
              return [];
          }
          else if (typeof this.target === 'string') {
              return toArray(this.rootElement.querySelectorAll(this.target));
          }
          else {
              throw new TypeError("Unexpected Parameter: " + this.target);
          }
      };
      Object.defineProperty(DOMAssertions.prototype, "targetDescription", {
          /**
           * @private
           */
          get: function () {
              return elementToString(this.target);
          },
          enumerable: true,
          configurable: true
      });
      return DOMAssertions;
  }());

  /* global QUnit */
  QUnit.assert.dom = function (target, rootElement) {
      rootElement = rootElement || this.dom.rootElement || document;
      return new DOMAssertions(target || rootElement, rootElement, this);
  };

}());

define('qunit-dom', [], function() {
  return {};
});

Object.defineProperty(QUnit.assert.dom, 'rootElement', {
  get: function() {
    return document.querySelector('#ember-testing');
  },
  enumerable: true,
  configurable: true,
});

define("@ember/test-helpers/-internal/debug-info-helpers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = registerDebugInfoHelper;
  _exports.debugInfoHelpers = void 0;
  var debugInfoHelpers = new Set();
  /**
   * Registers a custom debug info helper to augment the output for test isolation validation.
   *
   * @public
   * @param {DebugInfoHelper} debugHelper a custom debug info helper
   * @example
   *
   * import { registerDebugInfoHelper } from '@ember/test-helpers';
   *
   * registerDebugInfoHelper({
   *   name: 'Date override detection',
   *   log() {
   *     if (dateIsOverridden()) {
   *       console.log(this.name);
   *       console.log('The date object has been overridden');
   *     }
   *   }
   * })
   */

  _exports.debugInfoHelpers = debugInfoHelpers;

  function registerDebugInfoHelper(debugHelper) {
    debugInfoHelpers.add(debugHelper);
  }
});
define("@ember/test-helpers/-internal/debug-info", ["exports", "@ember/test-helpers/-internal/debug-info-helpers", "ember-test-waiters"], function (_exports, _debugInfoHelpers, _emberTestWaiters) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.backburnerDebugInfoAvailable = backburnerDebugInfoAvailable;
  _exports.getDebugInfo = getDebugInfo;
  _exports.TestDebugInfo = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var PENDING_AJAX_REQUESTS = 'Pending AJAX requests';
  var PENDING_TEST_WAITERS = 'Pending test waiters';
  var SCHEDULED_ASYNC = 'Scheduled async';
  var SCHEDULED_AUTORUN = 'Scheduled autorun';
  /**
   * Determins if the `getDebugInfo` method is available in the
   * running verison of backburner.
   *
   * @returns {boolean} True if `getDebugInfo` is present in backburner, otherwise false.
   */

  function backburnerDebugInfoAvailable() {
    return typeof Ember.run.backburner.getDebugInfo === 'function';
  }
  /**
   * Retrieves debug information from backburner's current deferred actions queue (runloop instance).
   * If the `getDebugInfo` method isn't available, it returns `null`.
   *
   * @public
   * @returns {MaybeDebugInfo | null} Backburner debugInfo or, if the getDebugInfo method is not present, null
   */


  function getDebugInfo() {
    return Ember.run.backburner.DEBUG === true && backburnerDebugInfoAvailable() ? Ember.run.backburner.getDebugInfo() : null;
  }
  /**
   * Encapsulates debug information for an individual test. Aggregates information
   * from:
   * - info provided by getSettledState
   *    - hasPendingTimers
   *    - hasRunLoop
   *    - hasPendingWaiters
   *    - hasPendingRequests
   * - info provided by backburner's getDebugInfo method (timers, schedules, and stack trace info)
   *
   */


  var TestDebugInfo =
  /*#__PURE__*/
  function () {
    function TestDebugInfo(settledState) {
      var debugInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDebugInfo();

      _classCallCheck(this, TestDebugInfo);

      this._summaryInfo = undefined;
      this._settledState = settledState;
      this._debugInfo = debugInfo;
    }

    _createClass(TestDebugInfo, [{
      key: "toConsole",
      value: function toConsole() {
        var _console = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : console;

        var summary = this.summary;

        if (summary.hasPendingRequests) {
          _console.log(PENDING_AJAX_REQUESTS);
        }

        if (summary.hasPendingLegacyWaiters) {
          _console.log(PENDING_TEST_WAITERS);
        }

        if (summary.hasPendingTestWaiters) {
          if (!summary.hasPendingLegacyWaiters) {
            _console.log(PENDING_TEST_WAITERS);
          }

          Object.keys(summary.pendingTestWaiterInfo.waiters).forEach(function (waiterName) {
            var waiterDebugInfo = summary.pendingTestWaiterInfo.waiters[waiterName];

            if (Array.isArray(waiterDebugInfo)) {
              _console.group(waiterName);

              waiterDebugInfo.forEach(function (debugInfo) {
                _console.log("".concat(debugInfo.label ? debugInfo.label : 'stack', ": ").concat(debugInfo.stack));
              });

              _console.groupEnd();
            } else {
              _console.log(waiterName);
            }
          });
        }

        if (summary.hasPendingTimers || summary.pendingScheduledQueueItemCount > 0) {
          _console.group(SCHEDULED_ASYNC);

          summary.pendingTimersStackTraces.forEach(function (timerStack) {
            _console.log(timerStack);
          });
          summary.pendingScheduledQueueItemStackTraces.forEach(function (scheduleQueueItemStack) {
            _console.log(scheduleQueueItemStack);
          });

          _console.groupEnd();
        }

        if (summary.hasRunLoop && summary.pendingTimersCount === 0 && summary.pendingScheduledQueueItemCount === 0) {
          _console.log(SCHEDULED_AUTORUN);

          if (summary.autorunStackTrace) {
            _console.log(summary.autorunStackTrace);
          }
        }

        _debugInfoHelpers.debugInfoHelpers.forEach(function (helper) {
          helper.log();
        });
      }
    }, {
      key: "_formatCount",
      value: function _formatCount(title, count) {
        return "".concat(title, ": ").concat(count);
      }
    }, {
      key: "summary",
      get: function get() {
        if (!this._summaryInfo) {
          this._summaryInfo = Ember.assign({}, this._settledState);

          if (this._debugInfo) {
            this._summaryInfo.autorunStackTrace = this._debugInfo.autorun && this._debugInfo.autorun.stack;
            this._summaryInfo.pendingTimersCount = this._debugInfo.timers.length;
            this._summaryInfo.hasPendingTimers = this._settledState.hasPendingTimers && this._summaryInfo.pendingTimersCount > 0;
            this._summaryInfo.pendingTimersStackTraces = this._debugInfo.timers.map(function (timer) {
              return timer.stack;
            });
            this._summaryInfo.pendingScheduledQueueItemCount = this._debugInfo.instanceStack.filter(function (q) {
              return q;
            }).reduce(function (total, item) {
              Object.keys(item).forEach(function (queueName) {
                total += item[queueName].length;
              });
              return total;
            }, 0);
            this._summaryInfo.pendingScheduledQueueItemStackTraces = this._debugInfo.instanceStack.filter(function (q) {
              return q;
            }).reduce(function (stacks, deferredActionQueues) {
              Object.keys(deferredActionQueues).forEach(function (queue) {
                deferredActionQueues[queue].forEach(function (queueItem) {
                  return queueItem.stack && stacks.push(queueItem.stack);
                });
              });
              return stacks;
            }, []);
          }

          if (this._summaryInfo.hasPendingTestWaiters) {
            this._summaryInfo.pendingTestWaiterInfo = (0, _emberTestWaiters.getPendingWaiterState)();
          }
        }

        return this._summaryInfo;
      }
    }]);

    return TestDebugInfo;
  }();

  _exports.TestDebugInfo = TestDebugInfo;
});
define("@ember/test-helpers/-tuple", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = tuple;

  // eslint-disable-next-line require-jsdoc
  function tuple() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  }
});
define("@ember/test-helpers/-utils", ["exports", "@ember/test-helpers/has-ember-version"], function (_exports, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.nextTickPromise = nextTickPromise;
  _exports.runDestroyablesFor = runDestroyablesFor;
  _exports.isNumeric = isNumeric;
  _exports.futureTick = _exports.nextTick = _exports._Promise = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _Promise =
  /*#__PURE__*/
  function (_EmberRSVP$Promise) {
    _inherits(_Promise, _EmberRSVP$Promise);

    function _Promise() {
      _classCallCheck(this, _Promise);

      return _possibleConstructorReturn(this, _getPrototypeOf(_Promise).apply(this, arguments));
    }

    return _Promise;
  }(Ember.RSVP.Promise);

  _exports._Promise = _Promise;
  var ORIGINAL_RSVP_ASYNC = Ember.RSVP.configure('async');
  /*
    Long ago in a galaxy far far away, Ember forced RSVP.Promise to "resolve" on the Ember.run loop.
    At the time, this was meant to help ease pain with folks receiving the dreaded "auto-run" assertion
    during their tests, and to help ensure that promise resolution was coelesced to avoid "thrashing"
    of the DOM. Unfortunately, the result of this configuration is that code like the following behaves
    differently if using native `Promise` vs `RSVP.Promise`:
  
    ```js
    console.log('first');
    Ember.run(() => Promise.resolve().then(() => console.log('second')));
    console.log('third');
    ```
  
    When `Promise` is the native promise that will log `'first', 'third', 'second'`, but when `Promise`
    is an `RSVP.Promise` that will log `'first', 'second', 'third'`. The fact that `RSVP.Promise`s can
    be **forced** to flush synchronously is very scary!
  
    Now, lets talk about why we are configuring `RSVP`'s `async` below...
  
    ---
  
    The following _should_ always be guaranteed:
  
    ```js
    await settled();
  
    isSettled() === true
    ```
  
    Unfortunately, without the custom `RSVP` `async` configuration we cannot ensure that `isSettled()` will
    be truthy. This is due to the fact that Ember has configured `RSVP` to resolve all promises in the run
    loop. What that means practically is this:
  
    1. all checks within `waitUntil` (used by `settled()` internally) are completed and we are "settled"
    2. `waitUntil` resolves the promise that it returned (to signify that the world is "settled")
    3. resolving the promise (since it is an `RSVP.Promise` and Ember has configured RSVP.Promise) creates
      a new Ember.run loop in order to resolve
    4. the presence of that new run loop means that we are no longer "settled"
    5. `isSettled()` returns false 😭😭😭😭😭😭😭😭😭
  
    This custom `RSVP.configure('async`, ...)` below provides a way to prevent the promises that are returned
    from `settled` from causing this "loop" and instead "just use normal Promise semantics".
  
    😩😫🙀
  */

  Ember.RSVP.configure('async', function (callback, promise) {
    if (promise instanceof _Promise) {
      // @ts-ignore - avoid erroring about useless `Promise !== RSVP.Promise` comparison
      // (this handles when folks have polyfilled via Promise = Ember.RSVP.Promise)
      if (typeof Promise !== 'undefined' && Promise !== Ember.RSVP.Promise) {
        // use real native promise semantics whenever possible
        Promise.resolve().then(function () {
          return callback(promise);
        });
      } else {
        // fallback to using RSVP's natural `asap` (**not** the fake
        // one configured by Ember...)
        Ember.RSVP.asap(callback, promise);
      }
    } else {
      // fall back to the normal Ember behavior
      ORIGINAL_RSVP_ASYNC(callback, promise);
    }
  });
  var nextTick = typeof Promise === 'undefined' ? setTimeout : function (cb) {
    return Promise.resolve().then(cb);
  };
  _exports.nextTick = nextTick;
  var futureTick = setTimeout;
  /**
   @private
   @returns {Promise<void>} Promise which can not be forced to be ran synchronously
  */

  _exports.futureTick = futureTick;

  function nextTickPromise() {
    // Ember 3.4 removed the auto-run assertion, in 3.4+ we can (and should) avoid the "psuedo promisey" run loop configuration
    // for our `nextTickPromise` implementation. This allows us to have real microtask based next tick timing...
    if ((0, _hasEmberVersion.default)(3, 4)) {
      return _Promise.resolve();
    } else {
      // on older Ember's fallback to RSVP.Promise + a setTimeout
      return new Ember.RSVP.Promise(function (resolve) {
        nextTick(resolve);
      });
    }
  }
  /**
   Retrieves an array of destroyables from the specified property on the object
   provided, iterates that array invoking each function, then deleting the
   property (clearing the array).
  
   @private
   @param {Object} object an object to search for the destroyable array within
   @param {string} property the property on the object that contains the destroyable array
  */


  function runDestroyablesFor(object, property) {
    var destroyables = object[property];

    if (!destroyables) {
      return;
    }

    for (var i = 0; i < destroyables.length; i++) {
      destroyables[i]();
    }

    delete object[property];
  }
  /**
   Returns whether the passed in string consists only of numeric characters.
  
   @private
   @param {string} n input string
   @returns {boolean} whether the input string consists only of numeric characters
   */


  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(Number(n));
  }
});
define("@ember/test-helpers/application", ["exports", "@ember/test-helpers/resolver"], function (_exports, _resolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setApplication = setApplication;
  _exports.getApplication = getApplication;

  var __application__;
  /**
    Stores the provided application instance so that tests being ran will be aware of the application under test.
  
    - Required by `setupApplicationContext` method.
    - Used by `setupContext` and `setupRenderingContext` when present.
  
    @public
    @param {Ember.Application} application the application that will be tested
  */


  function setApplication(application) {
    __application__ = application;

    if (!(0, _resolver.getResolver)()) {
      var Resolver = application.Resolver;
      var resolver = Resolver.create({
        namespace: application
      });
      (0, _resolver.setResolver)(resolver);
    }
  }
  /**
    Retrieve the application instance stored by `setApplication`.
  
    @public
    @returns {Ember.Application} the previously stored application instance under test
  */


  function getApplication() {
    return __application__;
  }
});
define("@ember/test-helpers/build-owner", ["exports", "ember-test-helpers/legacy-0-6-x/build-registry"], function (_exports, _buildRegistry) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = buildOwner;

  /**
    Creates an "owner" (an object that either _is_ or duck-types like an
    `Ember.ApplicationInstance`) from the provided options.
  
    If `options.application` is present (e.g. setup by an earlier call to
    `setApplication`) an `Ember.ApplicationInstance` is built via
    `application.buildInstance()`.
  
    If `options.application` is not present, we fall back to using
    `options.resolver` instead (setup via `setResolver`). This creates a mock
    "owner" by using a custom created combination of `Ember.Registry`,
    `Ember.Container`, `Ember._ContainerProxyMixin`, and
    `Ember._RegistryProxyMixin`.
  
    @private
    @param {Ember.Application} [application] the Ember.Application to build an instance from
    @param {Ember.Resolver} [resolver] the resolver to use to back a "mock owner"
    @returns {Promise<Ember.ApplicationInstance>} a promise resolving to the generated "owner"
  */
  function buildOwner(application, resolver) {
    if (application) {
      return application.boot().then(function (app) {
        return app.buildInstance().boot();
      });
    }

    if (!resolver) {
      throw new Error('You must set up the ember-test-helpers environment with either `setResolver` or `setApplication` before running any tests.');
    }

    var _legacyBuildRegistry = (0, _buildRegistry.default)(resolver),
        owner = _legacyBuildRegistry.owner;

    return Ember.RSVP.Promise.resolve(owner);
  }
});
define("@ember/test-helpers/dom/-get-element", ["exports", "@ember/test-helpers/dom/get-root-element", "@ember/test-helpers/dom/-target"], function (_exports, _getRootElement, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
    Used internally by the DOM interaction helpers to find one element.
  
    @private
    @param {string|Element} target the element or selector to retrieve
    @returns {Element} the target or selector
  */
  function getElement(target) {
    if (typeof target === 'string') {
      var rootElement = (0, _getRootElement.default)();
      return rootElement.querySelector(target);
    } else if ((0, _target.isElement)(target) || (0, _target.isDocument)(target)) {
      return target;
    } else if (target instanceof Window) {
      return target.document;
    } else {
      throw new Error('Must use an element or a selector string');
    }
  }

  var _default = getElement;
  _exports.default = _default;
});
define("@ember/test-helpers/dom/-get-elements", ["exports", "@ember/test-helpers/dom/get-root-element"], function (_exports, _getRootElement) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = getElements;

  /**
    Used internally by the DOM interaction helpers to find multiple elements.
  
    @private
    @param {string} target the selector to retrieve
    @returns {NodeList} the matched elements
  */
  function getElements(target) {
    if (typeof target === 'string') {
      var rootElement = (0, _getRootElement.default)();
      return rootElement.querySelectorAll(target);
    } else {
      throw new Error('Must use a selector string');
    }
  }
});
define("@ember/test-helpers/dom/-is-focusable", ["exports", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/dom/-target"], function (_exports, _isFormControl, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isFocusable;
  var FOCUSABLE_TAGS = ['A']; // eslint-disable-next-line require-jsdoc

  function isFocusableElement(element) {
    return FOCUSABLE_TAGS.indexOf(element.tagName) > -1;
  }
  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is focusable, `false` otherwise
  */


  function isFocusable(element) {
    if ((0, _target.isDocument)(element)) {
      return false;
    }

    if ((0, _isFormControl.default)(element) || element.isContentEditable || isFocusableElement(element)) {
      return true;
    }

    return element.hasAttribute('tabindex');
  }
});
define("@ember/test-helpers/dom/-is-form-control", ["exports", "@ember/test-helpers/dom/-target"], function (_exports, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = isFormControl;
  var FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
  /**
    @private
    @param {Element} element the element to check
    @returns {boolean} `true` when the element is a form control, `false` otherwise
  */

  function isFormControl(element) {
    return !(0, _target.isDocument)(element) && FORM_CONTROL_TAGS.indexOf(element.tagName) > -1 && element.type !== 'hidden';
  }
});
define("@ember/test-helpers/dom/-target", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isElement = isElement;
  _exports.isDocument = isDocument;

  // eslint-disable-next-line require-jsdoc
  function isElement(target) {
    return target.nodeType === Node.ELEMENT_NODE;
  } // eslint-disable-next-line require-jsdoc


  function isDocument(target) {
    return target.nodeType === Node.DOCUMENT_NODE;
  }
});
define("@ember/test-helpers/dom/-to-array", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = toArray;

  /**
    @private
    @param {NodeList} nodelist the nodelist to convert to an array
    @returns {Array} an array
  */
  function toArray(nodelist) {
    var array = new Array(nodelist.length);

    for (var i = 0; i < nodelist.length; i++) {
      array[i] = nodelist[i];
    }

    return array;
  }
});
define("@ember/test-helpers/dom/blur", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-utils"], function (_exports, _getElement, _fireEvent, _settled, _isFocusable, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__blur__ = __blur__;
  _exports.default = blur;

  /**
    @private
    @param {Element} element the element to trigger events on
  */
  function __blur__(element) {
    var browserIsNotFocused = document.hasFocus && !document.hasFocus(); // makes `document.activeElement` be `body`.
    // If the browser is focused, it also fires a blur event

    element.blur(); // Chrome/Firefox does not trigger the `blur` event if the window
    // does not have focus. If the document does not have focus then
    // fire `blur` event via native event.

    if (browserIsNotFocused) {
      (0, _fireEvent.default)(element, 'blur', {
        bubbles: false
      });
      (0, _fireEvent.default)(element, 'focusout');
    }
  }
  /**
    Unfocus the specified target.
  
    Sends a number of events intending to simulate a "real" user unfocusing an
    element.
  
    The following events are triggered (in order):
  
    - `blur`
    - `focusout`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle unfocusing a given element.
  
    @public
    @param {string|Element} [target=document.activeElement] the element or selector to unfocus
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating blurring an input using `blur`
    </caption>
  
    blur('input');
  */


  function blur() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.activeElement;
    return (0, _utils.nextTickPromise)().then(function () {
      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `blur('".concat(target, "')`."));
      }

      if (!(0, _isFocusable.default)(element)) {
        throw new Error("".concat(target, " is not focusable"));
      }

      __blur__(element);

      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/click", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/focus", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-utils", "@ember/test-helpers/dom/-is-form-control"], function (_exports, _getElement, _fireEvent, _focus, _settled, _isFocusable, _utils, _isFormControl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__click__ = __click__;
  _exports.default = click;

  /**
    @private
    @param {Element} element the element to click on
    @param {Object} options the options to be merged into the mouse events
  */
  function __click__(element, options) {
    (0, _fireEvent.default)(element, 'mousedown', options);

    if ((0, _isFocusable.default)(element)) {
      (0, _focus.__focus__)(element);
    }

    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
  }
  /**
    Clicks on the specified target.
  
    Sends a number of events intending to simulate a "real" user clicking on an
    element.
  
    For non-focusable elements the following events are triggered (in order):
  
    - `mousedown`
    - `mouseup`
    - `click`
  
    For focusable (e.g. form control) elements the following events are triggered
    (in order):
  
    - `mousedown`
    - `focus`
    - `focusin`
    - `mouseup`
    - `click`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle clicking a given element.
  
    Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).
    You can use this to specifiy modifier keys as well.
  
    @public
    @param {string|Element} target the element or selector to click on
    @param {Object} options the options to be merged into the mouse events
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating clicking a button using `click`
    </caption>
    click('button');
  
    @example
    <caption>
      Emulating clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
    </caption>
  
    click('button', { shiftKey: true });
  */


  function click(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `click`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `click('".concat(target, "')`."));
      }

      var isDisabledFormControl = (0, _isFormControl.default)(element) && element.disabled;

      if (!isDisabledFormControl) {
        __click__(element, options);
      }

      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/double-click", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/focus", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-utils"], function (_exports, _getElement, _fireEvent, _focus, _settled, _isFocusable, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__doubleClick__ = __doubleClick__;
  _exports.default = doubleClick;

  /**
    @private
    @param {Element} element the element to double-click on
    @param {Object} options the options to be merged into the mouse events
  */
  function __doubleClick__(element, options) {
    (0, _fireEvent.default)(element, 'mousedown', options);

    if ((0, _isFocusable.default)(element)) {
      (0, _focus.__focus__)(element);
    }

    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
    (0, _fireEvent.default)(element, 'mousedown', options);
    (0, _fireEvent.default)(element, 'mouseup', options);
    (0, _fireEvent.default)(element, 'click', options);
    (0, _fireEvent.default)(element, 'dblclick', options);
  }
  /**
    Double-clicks on the specified target.
  
    Sends a number of events intending to simulate a "real" user clicking on an
    element.
  
    For non-focusable elements the following events are triggered (in order):
  
    - `mousedown`
    - `mouseup`
    - `click`
    - `mousedown`
    - `mouseup`
    - `click`
    - `dblclick`
  
    For focusable (e.g. form control) elements the following events are triggered
    (in order):
  
    - `mousedown`
    - `focus`
    - `focusin`
    - `mouseup`
    - `click`
    - `mousedown`
    - `mouseup`
    - `click`
    - `dblclick`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle clicking a given element.
  
    Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).
  
    @public
    @param {string|Element} target the element or selector to double-click on
    @param {Object} options the options to be merged into the mouse events
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating double clicking a button using `doubleClick`
    </caption>
  
    doubleClick('button');
  
    @example
    <caption>
      Emulating double clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
    </caption>
  
    doubleClick('button', { shiftKey: true });
  */


  function doubleClick(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `doubleClick`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `doubleClick('".concat(target, "')`."));
      }

      __doubleClick__(element, options);

      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/fill-in", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/dom/focus", "@ember/test-helpers/settled", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/-utils"], function (_exports, _getElement, _isFormControl, _focus, _settled, _fireEvent, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = fillIn;

  /**
    Fill the provided text into the `value` property (or set `.innerHTML` when
    the target is a content editable element) then trigger `change` and `input`
    events on the specified target.
  
    @public
    @param {string|Element} target the element or selector to enter text into
    @param {string} text the text to fill into the target element
    @return {Promise<void>} resolves when the application is settled
  
    @example
    <caption>
      Emulating filling an input with text using `fillIn`
    </caption>
  
    fillIn('input', 'hello world');
  */
  function fillIn(target, text) {
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `fillIn`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `fillIn('".concat(target, "')`."));
      }

      var isControl = (0, _isFormControl.default)(element);

      if (!isControl && !element.isContentEditable) {
        throw new Error('`fillIn` is only usable on form controls or contenteditable elements.');
      }

      if (typeof text === 'undefined' || text === null) {
        throw new Error('Must provide `text` when calling `fillIn`.');
      }

      (0, _focus.__focus__)(element);

      if (isControl) {
        element.value = text;
      } else {
        element.innerHTML = text;
      }

      (0, _fireEvent.default)(element, 'input');
      (0, _fireEvent.default)(element, 'change');
      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/find-all", ["exports", "@ember/test-helpers/dom/-get-elements", "@ember/test-helpers/dom/-to-array"], function (_exports, _getElements, _toArray) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = findAll;

  /**
    Find all elements matched by the given selector. Similar to calling
    `querySelectorAll()` on the test root element, but returns an array instead
    of a `NodeList`.
  
    @public
    @param {string} selector the selector to search for
    @return {Array} array of matched elements
  */
  function findAll(selector) {
    if (!selector) {
      throw new Error('Must pass a selector to `findAll`.');
    }

    if (arguments.length > 1) {
      throw new Error('The `findAll` test helper only takes a single argument.');
    }

    return (0, _toArray.default)((0, _getElements.default)(selector));
  }
});
define("@ember/test-helpers/dom/find", ["exports", "@ember/test-helpers/dom/-get-element"], function (_exports, _getElement) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = find;

  /**
    Find the first element matched by the given selector. Equivalent to calling
    `querySelector()` on the test root element.
  
    @public
    @param {string} selector the selector to search for
    @return {Element} matched element or null
  */
  function find(selector) {
    if (!selector) {
      throw new Error('Must pass a selector to `find`.');
    }

    if (arguments.length > 1) {
      throw new Error('The `find` test helper only takes a single argument.');
    }

    return (0, _getElement.default)(selector);
  }
});
define("@ember/test-helpers/dom/fire-event", ["exports", "@ember/test-helpers/dom/-target", "@ember/test-helpers/-tuple"], function (_exports, _target, _tuple) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isKeyboardEventType = isKeyboardEventType;
  _exports.isMouseEventType = isMouseEventType;
  _exports.isFileSelectionEventType = isFileSelectionEventType;
  _exports.isFileSelectionInput = isFileSelectionInput;
  _exports.default = _exports.KEYBOARD_EVENT_TYPES = void 0;

  // eslint-disable-next-line require-jsdoc
  var MOUSE_EVENT_CONSTRUCTOR = function () {
    try {
      new MouseEvent('test');
      return true;
    } catch (e) {
      return false;
    }
  }();

  var DEFAULT_EVENT_OPTIONS = {
    bubbles: true,
    cancelable: true
  };
  var KEYBOARD_EVENT_TYPES = (0, _tuple.default)('keydown', 'keypress', 'keyup'); // eslint-disable-next-line require-jsdoc

  _exports.KEYBOARD_EVENT_TYPES = KEYBOARD_EVENT_TYPES;

  function isKeyboardEventType(eventType) {
    return KEYBOARD_EVENT_TYPES.indexOf(eventType) > -1;
  }

  var MOUSE_EVENT_TYPES = (0, _tuple.default)('click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover'); // eslint-disable-next-line require-jsdoc

  function isMouseEventType(eventType) {
    return MOUSE_EVENT_TYPES.indexOf(eventType) > -1;
  }

  var FILE_SELECTION_EVENT_TYPES = (0, _tuple.default)('change'); // eslint-disable-next-line require-jsdoc

  function isFileSelectionEventType(eventType) {
    return FILE_SELECTION_EVENT_TYPES.indexOf(eventType) > -1;
  } // eslint-disable-next-line require-jsdoc


  function isFileSelectionInput(element) {
    return element.files;
  }
  /**
    Internal helper used to build and dispatch events throughout the other DOM helpers.
  
    @private
    @param {Element} element the element to dispatch the event to
    @param {string} eventType the type of event
    @param {Object} [options] additional properties to be set on the event
    @returns {Event} the event that was dispatched
  */


  function fireEvent(element, eventType) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!element) {
      throw new Error('Must pass an element to `fireEvent`');
    }

    var event;

    if (isKeyboardEventType(eventType)) {
      event = buildKeyboardEvent(eventType, options);
    } else if (isMouseEventType(eventType)) {
      var rect;

      if (element instanceof Window && element.document.documentElement) {
        rect = element.document.documentElement.getBoundingClientRect();
      } else if ((0, _target.isDocument)(element)) {
        rect = element.documentElement.getBoundingClientRect();
      } else if ((0, _target.isElement)(element)) {
        rect = element.getBoundingClientRect();
      } else {
        return;
      }

      var x = rect.left + 1;
      var y = rect.top + 1;
      var simulatedCoordinates = {
        screenX: x + 5,
        screenY: y + 95,
        clientX: x,
        clientY: y
      };
      event = buildMouseEvent(eventType, Ember.assign(simulatedCoordinates, options));
    } else if (isFileSelectionEventType(eventType) && isFileSelectionInput(element)) {
      event = buildFileEvent(eventType, element, options);
    } else {
      event = buildBasicEvent(eventType, options);
    }

    element.dispatchEvent(event);
    return event;
  }

  var _default = fireEvent; // eslint-disable-next-line require-jsdoc

  _exports.default = _default;

  function buildBasicEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var event = document.createEvent('Events');
    var bubbles = options.bubbles !== undefined ? options.bubbles : true;
    var cancelable = options.cancelable !== undefined ? options.cancelable : true;
    delete options.bubbles;
    delete options.cancelable; // bubbles and cancelable are readonly, so they can be
    // set when initializing event

    event.initEvent(type, bubbles, cancelable);
    Ember.assign(event, options);
    return event;
  } // eslint-disable-next-line require-jsdoc


  function buildMouseEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var event;
    var eventOpts = Ember.assign({
      view: window
    }, DEFAULT_EVENT_OPTIONS, options);

    if (MOUSE_EVENT_CONSTRUCTOR) {
      event = new MouseEvent(type, eventOpts);
    } else {
      try {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent(type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
      } catch (e) {
        event = buildBasicEvent(type, options);
      }
    }

    return event;
  } // eslint-disable-next-line require-jsdoc


  function buildKeyboardEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var eventOpts = Ember.assign({}, DEFAULT_EVENT_OPTIONS, options);
    var event;
    var eventMethodName;

    try {
      event = new KeyboardEvent(type, eventOpts); // Property definitions are required for B/C for keyboard event usage
      // If this properties are not defined, when listening for key events
      // keyCode/which will be 0. Also, keyCode and which now are string
      // and if app compare it with === with integer key definitions,
      // there will be a fail.
      //
      // https://w3c.github.io/uievents/#interface-keyboardevent
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent

      Object.defineProperty(event, 'keyCode', {
        get: function get() {
          return parseInt(eventOpts.keyCode);
        }
      });
      Object.defineProperty(event, 'which', {
        get: function get() {
          return parseInt(eventOpts.which);
        }
      });
      return event;
    } catch (e) {// left intentionally blank
    }

    try {
      event = document.createEvent('KeyboardEvents');
      eventMethodName = 'initKeyboardEvent';
    } catch (e) {// left intentionally blank
    }

    if (!event) {
      try {
        event = document.createEvent('KeyEvents');
        eventMethodName = 'initKeyEvent';
      } catch (e) {// left intentionally blank
      }
    }

    if (event && eventMethodName) {
      event[eventMethodName](type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
    } else {
      event = buildBasicEvent(type, options);
    }

    return event;
  } // eslint-disable-next-line require-jsdoc


  function buildFileEvent(type, element) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var event = buildBasicEvent(type);
    var files;

    if (Array.isArray(options)) {
      (true && !(false) && Ember.deprecate('Passing the `options` param as an array to `triggerEvent` for file inputs is deprecated. Please pass an object with a key `files` containing the array instead.', false, {
        id: 'ember-test-helpers.trigger-event.options-blob-array',
        until: '2.0.0'
      }));
      files = options;
    } else {
      files = options.files;
    }

    if (Array.isArray(files)) {
      Object.defineProperty(files, 'item', {
        value: function value(index) {
          return typeof index === 'number' ? this[index] : null;
        }
      });
      Object.defineProperty(element, 'files', {
        value: files,
        configurable: true
      });
    }

    Object.defineProperty(event, 'target', {
      value: element
    });
    return event;
  }
});
define("@ember/test-helpers/dom/focus", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/-utils"], function (_exports, _getElement, _fireEvent, _settled, _isFocusable, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__focus__ = __focus__;
  _exports.default = focus;

  /**
    @private
    @param {Element} element the element to trigger events on
  */
  function __focus__(element) {
    var browserIsNotFocused = document.hasFocus && !document.hasFocus(); // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event

    element.focus(); // Firefox does not trigger the `focusin` event if the window
    // does not have focus. If the document does not have focus then
    // fire `focusin` event as well.

    if (browserIsNotFocused) {
      // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
      (0, _fireEvent.default)(element, 'focus', {
        bubbles: false
      });
      (0, _fireEvent.default)(element, 'focusin');
    }
  }
  /**
    Focus the specified target.
  
    Sends a number of events intending to simulate a "real" user focusing an
    element.
  
    The following events are triggered (in order):
  
    - `focus`
    - `focusin`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle focusing a given element.
  
    @public
    @param {string|Element} target the element or selector to focus
    @return {Promise<void>} resolves when the application is settled
  
    @example
    <caption>
      Emulating focusing an input using `focus`
    </caption>
  
    focus('input');
  */


  function focus(target) {
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `focus`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `focus('".concat(target, "')`."));
      }

      if (!(0, _isFocusable.default)(element)) {
        throw new Error("".concat(target, " is not focusable"));
      }

      __focus__(element);

      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/get-root-element", ["exports", "@ember/test-helpers/setup-context", "@ember/test-helpers/dom/-target"], function (_exports, _setupContext, _target) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = getRootElement;

  /**
    Get the root element of the application under test (usually `#ember-testing`)
  
    @public
    @returns {Element} the root element
  */
  function getRootElement() {
    var context = (0, _setupContext.getContext)();
    var owner = context && context.owner;

    if (!owner) {
      throw new Error('Must setup rendering context before attempting to interact with elements.');
    }

    var rootElement; // When the host app uses `setApplication` (instead of `setResolver`) the owner has
    // a `rootElement` set on it with the element or id to be used

    if (owner && owner._emberTestHelpersMockOwner === undefined) {
      rootElement = owner.rootElement;
    } else {
      rootElement = '#ember-testing';
    }

    if (rootElement instanceof Window) {
      rootElement = rootElement.document;
    }

    if ((0, _target.isElement)(rootElement) || (0, _target.isDocument)(rootElement)) {
      return rootElement;
    } else if (typeof rootElement === 'string') {
      var _rootElement = document.querySelector(rootElement);

      if (_rootElement) {
        return _rootElement;
      }

      throw new Error("Application.rootElement (".concat(rootElement, ") not found"));
    } else {
      throw new Error('Application.rootElement must be an element or a selector string');
    }
  }
});
define("@ember/test-helpers/dom/tap", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/click", "@ember/test-helpers/settled", "@ember/test-helpers/-utils"], function (_exports, _getElement, _fireEvent, _click, _settled, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = tap;

  /**
    Taps on the specified target.
  
    Sends a number of events intending to simulate a "real" user tapping on an
    element.
  
    For non-focusable elements the following events are triggered (in order):
  
    - `touchstart`
    - `touchend`
    - `mousedown`
    - `mouseup`
    - `click`
  
    For focusable (e.g. form control) elements the following events are triggered
    (in order):
  
    - `touchstart`
    - `touchend`
    - `mousedown`
    - `focus`
    - `focusin`
    - `mouseup`
    - `click`
  
    The exact listing of events that are triggered may change over time as needed
    to continue to emulate how actual browsers handle tapping on a given element.
  
    Use the `options` hash to change the parameters of the tap events.
  
    @public
    @param {string|Element} target the element or selector to tap on
    @param {Object} options the options to be merged into the touch events
    @return {Promise<void>} resolves when settled
  
    @example
    <caption>
      Emulating tapping a button using `tap`
    </caption>
  
    tap('button');
  */
  function tap(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `tap`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `tap('".concat(target, "')`."));
      }

      var touchstartEv = (0, _fireEvent.default)(element, 'touchstart', options);
      var touchendEv = (0, _fireEvent.default)(element, 'touchend', options);

      if (!touchstartEv.defaultPrevented && !touchendEv.defaultPrevented) {
        (0, _click.__click__)(element, options);
      }

      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/trigger-event", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/-utils"], function (_exports, _getElement, _fireEvent, _settled, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = triggerEvent;

  /**
   * Triggers an event on the specified target.
   *
   * @public
   * @param {string|Element} target the element or selector to trigger the event on
   * @param {string} eventType the type of event to trigger
   * @param {Object} options additional properties to be set on the event
   * @return {Promise<void>} resolves when the application is settled
   *
   * @example
   * <caption>
   * Using `triggerEvent` to upload a file
   *
   * When using `triggerEvent` to upload a file the `eventType` must be `change` and you must pass the
   * `options` param as an object with a key `files` containing an array of
   * [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
   * </caption>
   *
   * triggerEvent(
   *   'input.fileUpload',
   *   'change',
   *   { files: [new Blob(['Ember Rules!'])] }
   * );
   *
   *
   * @example
   * <caption>
   * Using `triggerEvent` to upload a dropped file
   *
   * When using `triggerEvent` to handle a dropped (via drag-and-drop) file, the `eventType` must be `drop`. Assuming your `drop` event handler uses the [DataTransfer API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer),
   * you must pass the `options` param as an object with a key of `dataTransfer`. The `options.dataTransfer`     object should have a `files` key, containing an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File).
   * </caption>
   *
   * triggerEvent(
   *   '[data-test-drop-zone]',
   *   'drop',
   *   {
   *     dataTransfer: {
   *       files: [new File(['Ember Rules!', 'ember-rules.txt'])]
   *     }
   *   }
   * )
   */
  function triggerEvent(target, eventType, options) {
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `triggerEvent`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `triggerEvent('".concat(target, "', ...)`."));
      }

      if (!eventType) {
        throw new Error("Must provide an `eventType` to `triggerEvent`");
      }

      (0, _fireEvent.default)(element, eventType, options);
      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/trigger-key-event", ["exports", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/settled", "@ember/test-helpers/-utils"], function (_exports, _getElement, _fireEvent, _settled, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.__triggerKeyEvent__ = __triggerKeyEvent__;
  _exports.default = triggerKeyEvent;
  var DEFAULT_MODIFIERS = Object.freeze({
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false
  }); // This is not a comprehensive list, but it is better than nothing.

  var keyFromKeyCode = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'v',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Meta',
    93: 'Meta',
    187: '=',
    189: '-'
  };
  /**
    Calculates the value of KeyboardEvent#key given a keycode and the modifiers.
    Note that this works if the key is pressed in combination with the shift key, but it cannot
    detect if caps lock is enabled.
    @param {number} keycode The keycode of the event.
    @param {object} modifiers The modifiers of the event.
    @returns {string} The key string for the event.
   */

  function keyFromKeyCodeAndModifiers(keycode, modifiers) {
    if (keycode > 64 && keycode < 91) {
      if (modifiers.shiftKey) {
        return String.fromCharCode(keycode);
      } else {
        return String.fromCharCode(keycode).toLocaleLowerCase();
      }
    }

    var key = keyFromKeyCode[keycode];

    if (key) {
      return key;
    }
  }
  /**
   * Infers the keycode from the given key
   * @param {string} key The KeyboardEvent#key string
   * @returns {number} The keycode for the given key
   */


  function keyCodeFromKey(key) {
    var keys = Object.keys(keyFromKeyCode);
    var keyCode = keys.find(function (keyCode) {
      return keyFromKeyCode[Number(keyCode)] === key;
    });

    if (!keyCode) {
      keyCode = keys.find(function (keyCode) {
        return keyFromKeyCode[Number(keyCode)] === key.toLowerCase();
      });
    }

    return keyCode !== undefined ? parseInt(keyCode) : undefined;
  }
  /**
    @private
    @param {Element | Document} element the element to trigger the key event on
    @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
    @param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
    @param {Object} [modifiers] the state of various modifier keys
   */


  function __triggerKeyEvent__(element, eventType, key) {
    var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_MODIFIERS;
    var props;

    if (typeof key === 'number') {
      props = {
        keyCode: key,
        which: key,
        key: keyFromKeyCodeAndModifiers(key, modifiers)
      };
    } else if (typeof key === 'string' && key.length !== 0) {
      var firstCharacter = key[0];

      if (firstCharacter !== firstCharacter.toUpperCase()) {
        throw new Error("Must provide a `key` to `triggerKeyEvent` that starts with an uppercase character but you passed `".concat(key, "`."));
      }

      if ((0, _utils.isNumeric)(key) && key.length > 1) {
        throw new Error("Must provide a numeric `keyCode` to `triggerKeyEvent` but you passed `".concat(key, "` as a string."));
      }

      var keyCode = keyCodeFromKey(key);
      props = {
        keyCode: keyCode,
        which: keyCode,
        key: key
      };
    } else {
      throw new Error("Must provide a `key` or `keyCode` to `triggerKeyEvent`");
    }

    var options = Ember.assign(props, modifiers);
    (0, _fireEvent.default)(element, eventType, options);
  }
  /**
    Triggers a keyboard event of given type in the target element.
    It also requires the developer to provide either a string with the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
    or the numeric [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) of the pressed key.
    Optionally the user can also provide a POJO with extra modifiers for the event.
  
    @public
    @param {string|Element} target the element or selector to trigger the event on
    @param {'keydown' | 'keyup' | 'keypress'} eventType the type of event to trigger
    @param {number|string} key the `keyCode`(number) or `key`(string) of the event being triggered
    @param {Object} [modifiers] the state of various modifier keys
    @param {boolean} [modifiers.ctrlKey=false] if true the generated event will indicate the control key was pressed during the key event
    @param {boolean} [modifiers.altKey=false] if true the generated event will indicate the alt key was pressed during the key event
    @param {boolean} [modifiers.shiftKey=false] if true the generated event will indicate the shift key was pressed during the key event
    @param {boolean} [modifiers.metaKey=false] if true the generated event will indicate the meta key was pressed during the key event
    @return {Promise<void>} resolves when the application is settled unless awaitSettled is false
  
    @example
    <caption>
      Emulating pressing the `ENTER` key on a button using `triggerKeyEvent`
    </caption>
    triggerKeyEvent('button', 'keydown', 'Enter');
  */


  function triggerKeyEvent(target, eventType, key) {
    var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_MODIFIERS;
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `triggerKeyEvent`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `triggerKeyEvent('".concat(target, "', ...)`."));
      }

      if (!eventType) {
        throw new Error("Must provide an `eventType` to `triggerKeyEvent`");
      }

      if (!(0, _fireEvent.isKeyboardEventType)(eventType)) {
        var validEventTypes = _fireEvent.KEYBOARD_EVENT_TYPES.join(', ');

        throw new Error("Must provide an `eventType` of ".concat(validEventTypes, " to `triggerKeyEvent` but you passed `").concat(eventType, "`."));
      }

      __triggerKeyEvent__(element, eventType, key, modifiers);

      return (0, _settled.default)();
    });
  }
});
define("@ember/test-helpers/dom/type-in", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/settled", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-is-form-control", "@ember/test-helpers/dom/focus", "@ember/test-helpers/dom/-is-focusable", "@ember/test-helpers/dom/fire-event", "@ember/test-helpers/dom/trigger-key-event"], function (_exports, _utils, _settled, _getElement, _isFormControl, _focus, _isFocusable, _fireEvent, _triggerKeyEvent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = typeIn;

  /**
   * Mimics character by character entry into the target `input` or `textarea` element.
   *
   * Allows for simulation of slow entry by passing an optional millisecond delay
   * between key events.
  
   * The major difference between `typeIn` and `fillIn` is that `typeIn` triggers
   * keyboard events as well as `input` and `change`.
   * Typically this looks like `focus` -> `focusin` -> `keydown` -> `keypress` -> `keyup` -> `input` -> `change`
   * per character of the passed text (this may vary on some browsers).
   *
   * @public
   * @param {string|Element} target the element or selector to enter text into
   * @param {string} text the test to fill the element with
   * @param {Object} options {delay: x} (default 50) number of milliseconds to wait per keypress
   * @return {Promise<void>} resolves when the application is settled
   *
   * @example
   * <caption>
   *   Emulating typing in an input using `typeIn`
   * </caption>
   *
   * typeIn('hello world');
   */
  function typeIn(target, text) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return (0, _utils.nextTickPromise)().then(function () {
      if (!target) {
        throw new Error('Must pass an element or selector to `typeIn`.');
      }

      var element = (0, _getElement.default)(target);

      if (!element) {
        throw new Error("Element not found when calling `typeIn('".concat(target, "')`"));
      }

      if (!(0, _isFormControl.default)(element)) {
        throw new Error('`typeIn` is only usable on form controls.');
      }

      if (typeof text === 'undefined' || text === null) {
        throw new Error('Must provide `text` when calling `typeIn`.');
      }

      var _options$delay = options.delay,
          delay = _options$delay === void 0 ? 50 : _options$delay;

      if ((0, _isFocusable.default)(element)) {
        (0, _focus.__focus__)(element);
      }

      return fillOut(element, text, delay).then(function () {
        return (0, _fireEvent.default)(element, 'change');
      }).then(_settled.default);
    });
  } // eslint-disable-next-line require-jsdoc


  function fillOut(element, text, delay) {
    var inputFunctions = text.split('').map(function (character) {
      return keyEntry(element, character);
    });
    return inputFunctions.reduce(function (currentPromise, func) {
      return currentPromise.then(function () {
        return delayedExecute(delay);
      }).then(func);
    }, Ember.RSVP.Promise.resolve(undefined));
  } // eslint-disable-next-line require-jsdoc


  function keyEntry(element, character) {
    var shiftKey = character === character.toUpperCase() && character !== character.toLowerCase();
    var options = {
      shiftKey: shiftKey
    };
    var characterKey = character.toUpperCase();
    return function () {
      return (0, _utils.nextTickPromise)().then(function () {
        return (0, _triggerKeyEvent.__triggerKeyEvent__)(element, 'keydown', characterKey, options);
      }).then(function () {
        return (0, _triggerKeyEvent.__triggerKeyEvent__)(element, 'keypress', characterKey, options);
      }).then(function () {
        element.value = element.value + character;
        (0, _fireEvent.default)(element, 'input');
      }).then(function () {
        return (0, _triggerKeyEvent.__triggerKeyEvent__)(element, 'keyup', characterKey, options);
      });
    };
  } // eslint-disable-next-line require-jsdoc


  function delayedExecute(delay) {
    return new Ember.RSVP.Promise(function (resolve) {
      setTimeout(resolve, delay);
    });
  }
});
define("@ember/test-helpers/dom/wait-for", ["exports", "@ember/test-helpers/wait-until", "@ember/test-helpers/dom/-get-element", "@ember/test-helpers/dom/-get-elements", "@ember/test-helpers/dom/-to-array", "@ember/test-helpers/-utils"], function (_exports, _waitUntil, _getElement, _getElements, _toArray, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = waitFor;

  /**
    Used to wait for a particular selector to appear in the DOM. Due to the fact
    that it does not wait for general settledness, this is quite useful for testing
    interim DOM states (e.g. loading states, pending promises, etc).
  
    @param {string} selector the selector to wait for
    @param {Object} [options] the options to be used
    @param {number} [options.timeout=1000] the time to wait (in ms) for a match
    @param {number} [options.count=null] the number of elements that should match the provided selector (null means one or more)
    @return {Promise<Element|Element[]>} resolves when the element(s) appear on the page
  */
  function waitFor(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (0, _utils.nextTickPromise)().then(function () {
      if (!selector) {
        throw new Error('Must pass a selector to `waitFor`.');
      }

      var _options$timeout = options.timeout,
          timeout = _options$timeout === void 0 ? 1000 : _options$timeout,
          _options$count = options.count,
          count = _options$count === void 0 ? null : _options$count,
          timeoutMessage = options.timeoutMessage;

      if (!timeoutMessage) {
        timeoutMessage = "waitFor timed out waiting for selector \"".concat(selector, "\"");
      }

      var callback;

      if (count !== null) {
        callback = function callback() {
          var elements = (0, _getElements.default)(selector);

          if (elements.length === count) {
            return (0, _toArray.default)(elements);
          }

          return;
        };
      } else {
        callback = function callback() {
          return (0, _getElement.default)(selector);
        };
      }

      return (0, _waitUntil.default)(callback, {
        timeout: timeout,
        timeoutMessage: timeoutMessage
      });
    });
  }
});
define("@ember/test-helpers/global", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /* globals global */
  var _default = function () {
    if (typeof self !== 'undefined') {
      return self;
    } else if (typeof window !== 'undefined') {
      return window;
    } else if (typeof global !== 'undefined') {
      return global;
    } else {
      return Function('return this')();
    }
  }();

  _exports.default = _default;
});
define("@ember/test-helpers/has-ember-version", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = hasEmberVersion;

  /**
    Checks if the currently running Ember version is greater than or equal to the
    specified major and minor version numbers.
  
    @private
    @param {number} major the major version number to compare
    @param {number} minor the minor version number to compare
    @returns {boolean} true if the Ember version is >= MAJOR.MINOR specified, false otherwise
  */
  function hasEmberVersion(major, minor) {
    var numbers = Ember.VERSION.split('-')[0].split('.');
    var actualMajor = parseInt(numbers[0], 10);
    var actualMinor = parseInt(numbers[1], 10);
    return actualMajor > major || actualMajor === major && actualMinor >= minor;
  }
});
define("@ember/test-helpers/index", ["exports", "@ember/test-helpers/resolver", "@ember/test-helpers/application", "@ember/test-helpers/setup-context", "@ember/test-helpers/teardown-context", "@ember/test-helpers/setup-rendering-context", "@ember/test-helpers/teardown-rendering-context", "@ember/test-helpers/setup-application-context", "@ember/test-helpers/teardown-application-context", "@ember/test-helpers/settled", "@ember/test-helpers/wait-until", "@ember/test-helpers/validate-error-handler", "@ember/test-helpers/setup-onerror", "@ember/test-helpers/-internal/debug-info", "@ember/test-helpers/-internal/debug-info-helpers", "@ember/test-helpers/test-metadata", "@ember/test-helpers/dom/click", "@ember/test-helpers/dom/double-click", "@ember/test-helpers/dom/tap", "@ember/test-helpers/dom/focus", "@ember/test-helpers/dom/blur", "@ember/test-helpers/dom/trigger-event", "@ember/test-helpers/dom/trigger-key-event", "@ember/test-helpers/dom/fill-in", "@ember/test-helpers/dom/wait-for", "@ember/test-helpers/dom/get-root-element", "@ember/test-helpers/dom/find", "@ember/test-helpers/dom/find-all", "@ember/test-helpers/dom/type-in"], function (_exports, _resolver, _application, _setupContext, _teardownContext, _setupRenderingContext, _teardownRenderingContext, _setupApplicationContext, _teardownApplicationContext, _settled, _waitUntil, _validateErrorHandler, _setupOnerror, _debugInfo, _debugInfoHelpers, _testMetadata, _click, _doubleClick, _tap, _focus, _blur, _triggerEvent, _triggerKeyEvent, _fillIn, _waitFor, _getRootElement, _find, _findAll, _typeIn) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "setResolver", {
    enumerable: true,
    get: function get() {
      return _resolver.setResolver;
    }
  });
  Object.defineProperty(_exports, "getResolver", {
    enumerable: true,
    get: function get() {
      return _resolver.getResolver;
    }
  });
  Object.defineProperty(_exports, "getApplication", {
    enumerable: true,
    get: function get() {
      return _application.getApplication;
    }
  });
  Object.defineProperty(_exports, "setApplication", {
    enumerable: true,
    get: function get() {
      return _application.setApplication;
    }
  });
  Object.defineProperty(_exports, "setupContext", {
    enumerable: true,
    get: function get() {
      return _setupContext.default;
    }
  });
  Object.defineProperty(_exports, "getContext", {
    enumerable: true,
    get: function get() {
      return _setupContext.getContext;
    }
  });
  Object.defineProperty(_exports, "setContext", {
    enumerable: true,
    get: function get() {
      return _setupContext.setContext;
    }
  });
  Object.defineProperty(_exports, "unsetContext", {
    enumerable: true,
    get: function get() {
      return _setupContext.unsetContext;
    }
  });
  Object.defineProperty(_exports, "pauseTest", {
    enumerable: true,
    get: function get() {
      return _setupContext.pauseTest;
    }
  });
  Object.defineProperty(_exports, "resumeTest", {
    enumerable: true,
    get: function get() {
      return _setupContext.resumeTest;
    }
  });
  Object.defineProperty(_exports, "teardownContext", {
    enumerable: true,
    get: function get() {
      return _teardownContext.default;
    }
  });
  Object.defineProperty(_exports, "setupRenderingContext", {
    enumerable: true,
    get: function get() {
      return _setupRenderingContext.default;
    }
  });
  Object.defineProperty(_exports, "render", {
    enumerable: true,
    get: function get() {
      return _setupRenderingContext.render;
    }
  });
  Object.defineProperty(_exports, "clearRender", {
    enumerable: true,
    get: function get() {
      return _setupRenderingContext.clearRender;
    }
  });
  Object.defineProperty(_exports, "teardownRenderingContext", {
    enumerable: true,
    get: function get() {
      return _teardownRenderingContext.default;
    }
  });
  Object.defineProperty(_exports, "setupApplicationContext", {
    enumerable: true,
    get: function get() {
      return _setupApplicationContext.default;
    }
  });
  Object.defineProperty(_exports, "visit", {
    enumerable: true,
    get: function get() {
      return _setupApplicationContext.visit;
    }
  });
  Object.defineProperty(_exports, "currentRouteName", {
    enumerable: true,
    get: function get() {
      return _setupApplicationContext.currentRouteName;
    }
  });
  Object.defineProperty(_exports, "currentURL", {
    enumerable: true,
    get: function get() {
      return _setupApplicationContext.currentURL;
    }
  });
  Object.defineProperty(_exports, "teardownApplicationContext", {
    enumerable: true,
    get: function get() {
      return _teardownApplicationContext.default;
    }
  });
  Object.defineProperty(_exports, "settled", {
    enumerable: true,
    get: function get() {
      return _settled.default;
    }
  });
  Object.defineProperty(_exports, "isSettled", {
    enumerable: true,
    get: function get() {
      return _settled.isSettled;
    }
  });
  Object.defineProperty(_exports, "getSettledState", {
    enumerable: true,
    get: function get() {
      return _settled.getSettledState;
    }
  });
  Object.defineProperty(_exports, "waitUntil", {
    enumerable: true,
    get: function get() {
      return _waitUntil.default;
    }
  });
  Object.defineProperty(_exports, "validateErrorHandler", {
    enumerable: true,
    get: function get() {
      return _validateErrorHandler.default;
    }
  });
  Object.defineProperty(_exports, "setupOnerror", {
    enumerable: true,
    get: function get() {
      return _setupOnerror.default;
    }
  });
  Object.defineProperty(_exports, "resetOnerror", {
    enumerable: true,
    get: function get() {
      return _setupOnerror.resetOnerror;
    }
  });
  Object.defineProperty(_exports, "getDebugInfo", {
    enumerable: true,
    get: function get() {
      return _debugInfo.getDebugInfo;
    }
  });
  Object.defineProperty(_exports, "registerDebugInfoHelper", {
    enumerable: true,
    get: function get() {
      return _debugInfoHelpers.default;
    }
  });
  Object.defineProperty(_exports, "getTestMetadata", {
    enumerable: true,
    get: function get() {
      return _testMetadata.default;
    }
  });
  Object.defineProperty(_exports, "click", {
    enumerable: true,
    get: function get() {
      return _click.default;
    }
  });
  Object.defineProperty(_exports, "doubleClick", {
    enumerable: true,
    get: function get() {
      return _doubleClick.default;
    }
  });
  Object.defineProperty(_exports, "tap", {
    enumerable: true,
    get: function get() {
      return _tap.default;
    }
  });
  Object.defineProperty(_exports, "focus", {
    enumerable: true,
    get: function get() {
      return _focus.default;
    }
  });
  Object.defineProperty(_exports, "blur", {
    enumerable: true,
    get: function get() {
      return _blur.default;
    }
  });
  Object.defineProperty(_exports, "triggerEvent", {
    enumerable: true,
    get: function get() {
      return _triggerEvent.default;
    }
  });
  Object.defineProperty(_exports, "triggerKeyEvent", {
    enumerable: true,
    get: function get() {
      return _triggerKeyEvent.default;
    }
  });
  Object.defineProperty(_exports, "fillIn", {
    enumerable: true,
    get: function get() {
      return _fillIn.default;
    }
  });
  Object.defineProperty(_exports, "waitFor", {
    enumerable: true,
    get: function get() {
      return _waitFor.default;
    }
  });
  Object.defineProperty(_exports, "getRootElement", {
    enumerable: true,
    get: function get() {
      return _getRootElement.default;
    }
  });
  Object.defineProperty(_exports, "find", {
    enumerable: true,
    get: function get() {
      return _find.default;
    }
  });
  Object.defineProperty(_exports, "findAll", {
    enumerable: true,
    get: function get() {
      return _findAll.default;
    }
  });
  Object.defineProperty(_exports, "typeIn", {
    enumerable: true,
    get: function get() {
      return _typeIn.default;
    }
  });
});
define("@ember/test-helpers/resolver", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setResolver = setResolver;
  _exports.getResolver = getResolver;

  var __resolver__;
  /**
    Stores the provided resolver instance so that tests being ran can resolve
    objects in the same way as a normal application.
  
    Used by `setupContext` and `setupRenderingContext` as a fallback when `setApplication` was _not_ used.
  
    @public
    @param {Ember.Resolver} resolver the resolver to be used for testing
  */


  function setResolver(resolver) {
    __resolver__ = resolver;
  }
  /**
    Retrieve the resolver instance stored by `setResolver`.
  
    @public
    @returns {Ember.Resolver} the previously stored resolver
  */


  function getResolver() {
    return __resolver__;
  }
});
define("@ember/test-helpers/settled", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/wait-until", "@ember/test-helpers/setup-application-context", "ember-test-waiters", "@ember/test-helpers/-internal/debug-info"], function (_exports, _utils, _waitUntil, _setupApplicationContext, _emberTestWaiters, _debugInfo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports._teardownAJAXHooks = _teardownAJAXHooks;
  _exports._setupAJAXHooks = _setupAJAXHooks;
  _exports.getSettledState = getSettledState;
  _exports.isSettled = isSettled;
  _exports.default = settled;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  // Ember internally tracks AJAX requests in the same way that we do here for
  // legacy style "acceptance" tests using the `ember-testing.js` asset provided
  // by emberjs/ember.js itself. When `@ember/test-helpers`'s `settled` utility
  // is used in a legacy acceptance test context any pending AJAX requests are
  // not properly considered during the `isSettled` check below.
  //
  // This utilizes a local utility method present in Ember since around 2.8.0 to
  // properly consider pending AJAX requests done within legacy acceptance tests.
  var _internalPendingRequests = function () {
    var loader = Ember.__loader;

    if (loader.registry['ember-testing/test/pending_requests']) {
      // Ember <= 3.1
      return loader.require('ember-testing/test/pending_requests').pendingRequests;
    } else if (loader.registry['ember-testing/lib/test/pending_requests']) {
      // Ember >= 3.2
      return loader.require('ember-testing/lib/test/pending_requests').pendingRequests;
    }

    return function () {
      return 0;
    };
  }();

  var requests;
  /**
    @private
    @returns {number} the count of pending requests
  */

  function pendingRequests() {
    var localRequestsPending = requests !== undefined ? requests.length : 0;

    var internalRequestsPending = _internalPendingRequests();

    return localRequestsPending + internalRequestsPending;
  }
  /**
    @private
    @param {Event} event (unused)
    @param {XMLHTTPRequest} xhr the XHR that has initiated a request
  */


  function incrementAjaxPendingRequests(event, xhr) {
    requests.push(xhr);
  }
  /**
    @private
    @param {Event} event (unused)
    @param {XMLHTTPRequest} xhr the XHR that has initiated a request
  */


  function decrementAjaxPendingRequests(event, xhr) {
    // In most Ember versions to date (current version is 2.16) RSVP promises are
    // configured to flush in the actions queue of the Ember run loop, however it
    // is possible that in the future this changes to use "true" micro-task
    // queues.
    //
    // The entire point here, is that _whenever_ promises are resolved will be
    // before the next run of the JS event loop. Then in the next event loop this
    // counter will decrement. In the specific case of AJAX, this means that any
    // promises chained off of `$.ajax` will properly have their `.then` called
    // _before_ this is decremented (and testing continues)
    (0, _utils.nextTick)(function () {
      for (var i = 0; i < requests.length; i++) {
        if (xhr === requests[i]) {
          requests.splice(i, 1);
        }
      }
    }, 0);
  }
  /**
    Clears listeners that were previously setup for `ajaxSend` and `ajaxComplete`.
  
    @private
  */


  function _teardownAJAXHooks() {
    // jQuery will not invoke `ajaxComplete` if
    //    1. `transport.send` throws synchronously and
    //    2. it has an `error` option which also throws synchronously
    // We can no longer handle any remaining requests
    requests = [];

    if (typeof jQuery === 'undefined') {
      return;
    }

    jQuery(document).off('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).off('ajaxComplete', decrementAjaxPendingRequests);
  }
  /**
    Sets up listeners for `ajaxSend` and `ajaxComplete`.
  
    @private
  */


  function _setupAJAXHooks() {
    requests = [];

    if (typeof jQuery === 'undefined') {
      return;
    }

    jQuery(document).on('ajaxSend', incrementAjaxPendingRequests);
    jQuery(document).on('ajaxComplete', decrementAjaxPendingRequests);
  }

  var _internalCheckWaiters;

  var loader = Ember.__loader;

  if (loader.registry['ember-testing/test/waiters']) {
    // Ember <= 3.1
    _internalCheckWaiters = loader.require('ember-testing/test/waiters').checkWaiters;
  } else if (loader.registry['ember-testing/lib/test/waiters']) {
    // Ember >= 3.2
    _internalCheckWaiters = loader.require('ember-testing/lib/test/waiters').checkWaiters;
  }
  /**
    @private
    @returns {boolean} true if waiters are still pending
  */


  function checkWaiters() {
    var EmberTest = Ember.Test;

    if (_internalCheckWaiters) {
      return _internalCheckWaiters();
    } else if (EmberTest.waiters) {
      if (EmberTest.waiters.some(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            context = _ref2[0],
            callback = _ref2[1];

        return !callback.call(context);
      })) {
        return true;
      }
    }

    return false;
  }
  /**
    Check various settledness metrics, and return an object with the following properties:
  
    - `hasRunLoop` - Checks if a run-loop has been started. If it has, this will
      be `true` otherwise it will be `false`.
    - `hasPendingTimers` - Checks if there are scheduled timers in the run-loop.
      These pending timers are primarily registered by `Ember.run.schedule`. If
      there are pending timers, this will be `true`, otherwise `false`.
    - `hasPendingWaiters` - Checks if any registered test waiters are still
      pending (e.g. the waiter returns `true`). If there are pending waiters,
      this will be `true`, otherwise `false`.
    - `hasPendingRequests` - Checks if there are pending AJAX requests (based on
      `ajaxSend` / `ajaxComplete` events triggered by `jQuery.ajax`). If there
      are pending requests, this will be `true`, otherwise `false`.
    - `hasPendingTransitions` - Checks if there are pending route transitions. If the
      router has not been instantiated / setup for the test yet this will return `null`,
      if there are pending transitions, this will be `true`, otherwise `false`.
    - `pendingRequestCount` - The count of pending AJAX requests.
    - `debugInfo` - Debug information that's combined with info return from backburner's
      getDebugInfo method.
  
    @public
    @returns {Object} object with properties for each of the metrics used to determine settledness
  */


  function getSettledState() {
    var hasPendingTimers = Boolean(Ember.run.hasScheduledTimers());
    var hasRunLoop = Boolean(Ember.run.currentRunLoop);
    var hasPendingLegacyWaiters = checkWaiters();
    var hasPendingTestWaiters = (0, _emberTestWaiters.hasPendingWaiters)();
    var pendingRequestCount = pendingRequests();
    var hasPendingRequests = pendingRequestCount > 0;
    return {
      hasPendingTimers: hasPendingTimers,
      hasRunLoop: hasRunLoop,
      hasPendingWaiters: hasPendingLegacyWaiters || hasPendingTestWaiters,
      hasPendingRequests: hasPendingRequests,
      hasPendingTransitions: (0, _setupApplicationContext.hasPendingTransitions)(),
      pendingRequestCount: pendingRequestCount,
      debugInfo: new _debugInfo.TestDebugInfo({
        hasPendingTimers: hasPendingTimers,
        hasRunLoop: hasRunLoop,
        hasPendingLegacyWaiters: hasPendingLegacyWaiters,
        hasPendingTestWaiters: hasPendingTestWaiters,
        hasPendingRequests: hasPendingRequests
      })
    };
  }
  /**
    Checks various settledness metrics (via `getSettledState()`) to determine if things are settled or not.
  
    Settled generally means that there are no pending timers, no pending waiters,
    no pending AJAX requests, and no current run loop. However, new settledness
    metrics may be added and used as they become available.
  
    @public
    @returns {boolean} `true` if settled, `false` otherwise
  */


  function isSettled() {
    var _getSettledState = getSettledState(),
        hasPendingTimers = _getSettledState.hasPendingTimers,
        hasRunLoop = _getSettledState.hasRunLoop,
        hasPendingRequests = _getSettledState.hasPendingRequests,
        hasPendingWaiters = _getSettledState.hasPendingWaiters,
        hasPendingTransitions = _getSettledState.hasPendingTransitions;

    if (hasPendingTimers || hasRunLoop || hasPendingRequests || hasPendingWaiters || hasPendingTransitions) {
      return false;
    }

    return true;
  }
  /**
    Returns a promise that resolves when in a settled state (see `isSettled` for
    a definition of "settled state").
  
    @public
    @returns {Promise<void>} resolves when settled
  */


  function settled() {
    return (0, _waitUntil.default)(isSettled, {
      timeout: Infinity
    }).then(function () {});
  }
});
define("@ember/test-helpers/setup-application-context", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/setup-context", "@ember/test-helpers/global", "@ember/test-helpers/has-ember-version", "@ember/test-helpers/settled", "@ember/test-helpers/test-metadata"], function (_exports, _utils, _setupContext, _global, _hasEmberVersion, _settled, _testMetadata) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isApplicationTestContext = isApplicationTestContext;
  _exports.hasPendingTransitions = hasPendingTransitions;
  _exports.setupRouterSettlednessTracking = setupRouterSettlednessTracking;
  _exports.visit = visit;
  _exports.currentRouteName = currentRouteName;
  _exports.currentURL = currentURL;
  _exports.default = setupApplicationContext;
  var CAN_USE_ROUTER_EVENTS = (0, _hasEmberVersion.default)(3, 6);
  var routerTransitionsPending = null;
  var ROUTER = new WeakMap();
  var HAS_SETUP_ROUTER = new WeakMap(); // eslint-disable-next-line require-jsdoc

  function isApplicationTestContext(context) {
    return (0, _setupContext.isTestContext)(context);
  }
  /**
    Determines if we have any pending router transtions (used to determine `settled` state)
  
    @public
    @returns {(boolean|null)} if there are pending transitions
  */


  function hasPendingTransitions() {
    if (CAN_USE_ROUTER_EVENTS) {
      return routerTransitionsPending;
    }

    var context = (0, _setupContext.getContext)(); // there is no current context, we cannot check

    if (context === undefined) {
      return null;
    }

    var router = ROUTER.get(context);

    if (router === undefined) {
      // if there is no router (e.g. no `visit` calls made yet), we cannot
      // check for pending transitions but this is explicitly not an error
      // condition
      return null;
    }

    var routerMicrolib = router._routerMicrolib || router.router;

    if (routerMicrolib === undefined) {
      return null;
    }

    return !!routerMicrolib.activeTransition;
  }
  /**
    Setup the current router instance with settledness tracking. Generally speaking this
    is done automatically (during a `visit('/some-url')` invocation), but under some
    circumstances (e.g. a non-application test where you manually call `this.owner.setupRouter()`)
    you may want to call it yourself.
  
    @public
   */


  function setupRouterSettlednessTracking() {
    var context = (0, _setupContext.getContext)();

    if (context === undefined) {
      throw new Error('Cannot setupRouterSettlednessTracking outside of a test context');
    } // avoid setting up many times for the same context


    if (HAS_SETUP_ROUTER.get(context)) {
      return;
    }

    HAS_SETUP_ROUTER.set(context, true);
    var owner = context.owner;
    var router;

    if (CAN_USE_ROUTER_EVENTS) {
      router = owner.lookup('service:router'); // track pending transitions via the public routeWillChange / routeDidChange APIs
      // routeWillChange can fire many times and is only useful to know when we have _started_
      // transitioning, we can then use routeDidChange to signal that the transition has settled

      router.on('routeWillChange', function () {
        return routerTransitionsPending = true;
      });
      router.on('routeDidChange', function () {
        return routerTransitionsPending = false;
      });
    } else {
      router = owner.lookup('router:main');
      ROUTER.set(context, router);
    } // hook into teardown to reset local settledness state


    var ORIGINAL_WILL_DESTROY = router.willDestroy;

    router.willDestroy = function () {
      routerTransitionsPending = null;
      return ORIGINAL_WILL_DESTROY.apply(this, arguments);
    };
  }
  /**
    Navigate the application to the provided URL.
  
    @public
    @param {string} url The URL to visit (e.g. `/posts`)
    @param {object} options app boot options
    @returns {Promise<void>} resolves when settled
  */


  function visit(url, options) {
    var context = (0, _setupContext.getContext)();

    if (!context || !isApplicationTestContext(context)) {
      throw new Error('Cannot call `visit` without having first called `setupApplicationContext`.');
    }

    var owner = context.owner;
    var testMetadata = (0, _testMetadata.default)(context);
    testMetadata.usedHelpers.push('visit');
    return (0, _utils.nextTickPromise)().then(function () {
      var visitResult = owner.visit(url, options);
      setupRouterSettlednessTracking();
      return visitResult;
    }).then(function () {
      if (_global.default.EmberENV._APPLICATION_TEMPLATE_WRAPPER !== false) {
        context.element = document.querySelector('#ember-testing > .ember-view');
      } else {
        context.element = document.querySelector('#ember-testing');
      }
    }).then(_settled.default);
  }
  /**
    @public
    @returns {string} the currently active route name
  */


  function currentRouteName() {
    var context = (0, _setupContext.getContext)();

    if (!context || !isApplicationTestContext(context)) {
      throw new Error('Cannot call `currentRouteName` without having first called `setupApplicationContext`.');
    }

    var router = context.owner.lookup('router:main');
    return Ember.get(router, 'currentRouteName');
  }

  var HAS_CURRENT_URL_ON_ROUTER = (0, _hasEmberVersion.default)(2, 13);
  /**
    @public
    @returns {string} the applications current url
  */

  function currentURL() {
    var context = (0, _setupContext.getContext)();

    if (!context || !isApplicationTestContext(context)) {
      throw new Error('Cannot call `currentURL` without having first called `setupApplicationContext`.');
    }

    var router = context.owner.lookup('router:main');

    if (HAS_CURRENT_URL_ON_ROUTER) {
      return Ember.get(router, 'currentURL');
    } else {
      return Ember.get(router, 'location').getURL();
    }
  }
  /**
    Used by test framework addons to setup the provided context for working with
    an application (e.g. routing).
  
    `setupContext` must have been run on the provided context prior to calling
    `setupApplicationContext`.
  
    Sets up the basic framework used by application tests.
  
    @public
    @param {Object} context the context to setup
    @returns {Promise<Object>} resolves with the context that was setup
  */


  function setupApplicationContext(context) {
    var testMetadata = (0, _testMetadata.default)(context);
    testMetadata.setupTypes.push('setupApplicationContext');
    return (0, _utils.nextTickPromise)();
  }
});
define("@ember/test-helpers/setup-context", ["exports", "@ember/test-helpers/build-owner", "@ember/test-helpers/settled", "@ember/test-helpers/global", "@ember/test-helpers/resolver", "@ember/test-helpers/application", "@ember/test-helpers/-utils", "@ember/test-helpers/test-metadata"], function (_exports, _buildOwner, _settled, _global, _resolver, _application, _utils, _testMetadata) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isTestContext = isTestContext;
  _exports.setContext = setContext;
  _exports.getContext = getContext;
  _exports.unsetContext = unsetContext;
  _exports.pauseTest = pauseTest;
  _exports.resumeTest = resumeTest;
  _exports.default = setupContext;
  _exports.CLEANUP = void 0;

  // eslint-disable-next-line require-jsdoc
  function isTestContext(context) {
    return typeof context.pauseTest === 'function' && typeof context.resumeTest === 'function';
  }

  var __test_context__;
  /**
    Stores the provided context as the "global testing context".
  
    Generally setup automatically by `setupContext`.
  
    @public
    @param {Object} context the context to use
  */


  function setContext(context) {
    __test_context__ = context;
  }
  /**
    Retrive the "global testing context" as stored by `setContext`.
  
    @public
    @returns {Object} the previously stored testing context
  */


  function getContext() {
    return __test_context__;
  }
  /**
    Clear the "global testing context".
  
    Generally invoked from `teardownContext`.
  
    @public
  */


  function unsetContext() {
    __test_context__ = undefined;
  }
  /**
   * Returns a promise to be used to pauses the current test (due to being
   * returned from the test itself).  This is useful for debugging while testing
   * or for test-driving.  It allows you to inspect the state of your application
   * at any point.
   *
   * The test framework wrapper (e.g. `ember-qunit` or `ember-mocha`) should
   * ensure that when `pauseTest()` is used, any framework specific test timeouts
   * are disabled.
   *
   * @public
   * @returns {Promise<void>} resolves _only_ when `resumeTest()` is invoked
   * @example <caption>Usage via ember-qunit</caption>
   *
   * import { setupRenderingTest } from 'ember-qunit';
   * import { render, click, pauseTest } from '@ember/test-helpers';
   *
   *
   * module('awesome-sauce', function(hooks) {
   *   setupRenderingTest(hooks);
   *
   *   test('does something awesome', async function(assert) {
   *     await render(hbs`{{awesome-sauce}}`);
   *
   *     // added here to visualize / interact with the DOM prior
   *     // to the interaction below
   *     await pauseTest();
   *
   *     click('.some-selector');
   *
   *     assert.equal(this.element.textContent, 'this sauce is awesome!');
   *   });
   * });
   */


  function pauseTest() {
    var context = getContext();

    if (!context || !isTestContext(context)) {
      throw new Error('Cannot call `pauseTest` without having first called `setupTest` or `setupRenderingTest`.');
    }

    return context.pauseTest();
  }
  /**
    Resumes a test previously paused by `await pauseTest()`.
  
    @public
  */


  function resumeTest() {
    var context = getContext();

    if (!context || !isTestContext(context)) {
      throw new Error('Cannot call `resumeTest` without having first called `setupTest` or `setupRenderingTest`.');
    }

    context.resumeTest();
  }

  var CLEANUP = Object.create(null);
  /**
    Used by test framework addons to setup the provided context for testing.
  
    Responsible for:
  
    - sets the "global testing context" to the provided context (`setContext`)
    - create an owner object and set it on the provided context (e.g. `this.owner`)
    - setup `this.set`, `this.setProperties`, `this.get`, and `this.getProperties` to the provided context
    - setting up AJAX listeners
    - setting up `pauseTest` (also available as `this.pauseTest()`) and `resumeTest` helpers
  
    @public
    @param {Object} context the context to setup
    @param {Object} [options] options used to override defaults
    @param {Resolver} [options.resolver] a resolver to use for customizing normal resolution
    @returns {Promise<Object>} resolves with the context that was setup
  */

  _exports.CLEANUP = CLEANUP;

  function setupContext(context) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Ember.testing = true;
    setContext(context);
    var contextGuid = Ember.guidFor(context);
    CLEANUP[contextGuid] = [];
    var testMetadata = (0, _testMetadata.default)(context);
    testMetadata.setupTypes.push('setupContext');
    Ember.run.backburner.DEBUG = true;
    return (0, _utils.nextTickPromise)().then(function () {
      var application = (0, _application.getApplication)();

      if (application) {
        return application.boot().then(function () {});
      }

      return;
    }).then(function () {
      var testElementContainer = document.getElementById('ember-testing-container'); // TODO remove "!"

      var fixtureResetValue = testElementContainer.innerHTML; // push this into the final cleanup bucket, to be ran _after_ the owner
      // is destroyed and settled (e.g. flushed run loops, etc)

      CLEANUP[contextGuid].push(function () {
        testElementContainer.innerHTML = fixtureResetValue;
      });
      var resolver = options.resolver; // This handles precendence, specifying a specific option of
      // resolver always trumps whatever is auto-detected, then we fallback to
      // the suite-wide registrations
      //
      // At some later time this can be extended to support specifying a custom
      // engine or application...

      if (resolver) {
        return (0, _buildOwner.default)(null, resolver);
      }

      return (0, _buildOwner.default)((0, _application.getApplication)(), (0, _resolver.getResolver)());
    }).then(function (owner) {
      Object.defineProperty(context, 'owner', {
        configurable: true,
        enumerable: true,
        value: owner,
        writable: false
      });
      Object.defineProperty(context, 'set', {
        configurable: true,
        enumerable: true,
        value: function value(key, _value) {
          var ret = Ember.run(function () {
            return Ember.set(context, key, _value);
          });
          return ret;
        },
        writable: false
      });
      Object.defineProperty(context, 'setProperties', {
        configurable: true,
        enumerable: true,
        value: function value(hash) {
          var ret = Ember.run(function () {
            return Ember.setProperties(context, hash);
          });
          return ret;
        },
        writable: false
      });
      Object.defineProperty(context, 'get', {
        configurable: true,
        enumerable: true,
        value: function value(key) {
          return Ember.get(context, key);
        },
        writable: false
      });
      Object.defineProperty(context, 'getProperties', {
        configurable: true,
        enumerable: true,
        value: function value() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return Ember.getProperties(context, args);
        },
        writable: false
      });
      var resume;

      context.resumeTest = function resumeTest() {
        (true && !(Boolean(resume)) && Ember.assert('Testing has not been paused. There is nothing to resume.', Boolean(resume)));
        resume();
        _global.default.resumeTest = resume = undefined;
      };

      context.pauseTest = function pauseTest() {
        console.info('Testing paused. Use `resumeTest()` to continue.'); // eslint-disable-line no-console

        return new Ember.RSVP.Promise(function (resolve) {
          resume = resolve;
          _global.default.resumeTest = resumeTest;
        }, 'TestAdapter paused promise');
      };

      (0, _settled._setupAJAXHooks)();
      return context;
    });
  }
});
define("@ember/test-helpers/setup-onerror", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = setupOnerror;
  _exports.resetOnerror = void 0;
  var ORIGINAL_EMBER_ONERROR = Ember.onerror;
  /**
   * Sets the `Ember.onerror` function for tests. This value is intended to be reset after
   * each test to ensure correct test isolation. To reset, you should simply call `setupOnerror`
   * without an `onError` argument.
   *
   * @public
   * @param {Function} onError the onError function to be set on Ember.onerror
   *
   * @example <caption>Example implementation for `ember-qunit` or `ember-mocha`</caption>
   *
   * import { setupOnerror } from '@ember/test-helpers';
   *
   * test('Ember.onerror is stubbed properly', function(assert) {
   *   setupOnerror(function(err) {
   *     assert.ok(err);
   *   });
   * });
   */

  function setupOnerror(onError) {
    if (typeof onError !== 'function') {
      onError = ORIGINAL_EMBER_ONERROR;
    }

    Ember.onerror = onError;
  }
  /**
   * Resets `Ember.onerror` to the value it originally was at the start of the test run.
   *
   * @public
   *
   * @example
   *
   * import { resetOnerror } from '@ember/test-helpers';
   *
   * QUnit.testDone(function() {
   *   resetOnerror();
   * })
   */


  var resetOnerror = setupOnerror;
  _exports.resetOnerror = resetOnerror;
});
define("@ember/test-helpers/setup-rendering-context", ["exports", "@ember/test-helpers/global", "@ember/test-helpers/setup-context", "@ember/test-helpers/-utils", "@ember/test-helpers/settled", "@ember/test-helpers/dom/get-root-element", "@ember/test-helpers/test-metadata"], function (_exports, _global, _setupContext, _utils, _settled, _getRootElement, _testMetadata) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isRenderingTestContext = isRenderingTestContext;
  _exports.render = render;
  _exports.clearRender = clearRender;
  _exports.default = setupRenderingContext;
  _exports.RENDERING_CLEANUP = void 0;
  var RENDERING_CLEANUP = Object.create(null);
  _exports.RENDERING_CLEANUP = RENDERING_CLEANUP;
  var OUTLET_TEMPLATE = Ember.HTMLBars.template({
    "id": "E5X1dHTt",
    "block": "{\"symbols\":[],\"statements\":[[1,[23,\"outlet\"],false]],\"hasEval\":false}",
    "meta": {}
  });
  var EMPTY_TEMPLATE = Ember.HTMLBars.template({
    "id": "xOcW61lH",
    "block": "{\"symbols\":[],\"statements\":[],\"hasEval\":false}",
    "meta": {}
  }); // eslint-disable-next-line require-jsdoc

  function isRenderingTestContext(context) {
    return (0, _setupContext.isTestContext)(context) && typeof context.render === 'function' && typeof context.clearRender === 'function';
  }
  /**
    @private
    @param {Ember.ApplicationInstance} owner the current owner instance
    @param {string} templateFullName the fill template name
    @returns {Template} the template representing `templateFullName`
  */


  function lookupTemplate(owner, templateFullName) {
    var template = owner.lookup(templateFullName);
    if (typeof template === 'function') return template(owner);
    return template;
  }
  /**
    @private
    @param {Ember.ApplicationInstance} owner the current owner instance
    @returns {Template} a template representing {{outlet}}
  */


  function lookupOutletTemplate(owner) {
    var OutletTemplate = lookupTemplate(owner, 'template:-outlet');

    if (!OutletTemplate) {
      owner.register('template:-outlet', OUTLET_TEMPLATE);
      OutletTemplate = lookupTemplate(owner, 'template:-outlet');
    }

    return OutletTemplate;
  }
  /**
    @private
    @param {string} [selector] the selector to search for relative to element
    @returns {jQuery} a jQuery object representing the selector (or element itself if no selector)
  */


  function jQuerySelector(selector) {
    (true && !(false) && Ember.deprecate('Using this.$() in a rendering test has been deprecated, consider using this.element instead.', false, {
      id: 'ember-test-helpers.rendering-context.jquery-element',
      until: '2.0.0',
      // @ts-ignore
      url: 'https://emberjs.com/deprecations/v3.x#toc_jquery-apis'
    }));

    var _getContext = (0, _setupContext.getContext)(),
        element = _getContext.element; // emulates Ember internal behavor of `this.$` in a component
    // https://github.com/emberjs/ember.js/blob/v2.5.1/packages/ember-views/lib/views/states/has_element.js#L18


    return selector ? _global.default.jQuery(selector, element) : _global.default.jQuery(element);
  }

  var templateId = 0;
  /**
    Renders the provided template and appends it to the DOM.
  
    @public
    @param {CompiledTemplate} template the template to render
    @returns {Promise<void>} resolves when settled
  */

  function render(template) {
    var context = (0, _setupContext.getContext)();

    if (!template) {
      throw new Error('you must pass a template to `render()`');
    }

    return (0, _utils.nextTickPromise)().then(function () {
      if (!context || !isRenderingTestContext(context)) {
        throw new Error('Cannot call `render` without having first called `setupRenderingContext`.');
      }

      var owner = context.owner;
      var testMetadata = (0, _testMetadata.default)(context);
      testMetadata.usedHelpers.push('render');
      var toplevelView = owner.lookup('-top-level-view:main');
      var OutletTemplate = lookupOutletTemplate(owner);
      templateId += 1;
      var templateFullName = "template:-undertest-".concat(templateId);
      owner.register(templateFullName, template);
      var outletState = {
        render: {
          owner: owner,
          into: undefined,
          outlet: 'main',
          name: 'application',
          controller: undefined,
          ViewClass: undefined,
          template: OutletTemplate
        },
        outlets: {
          main: {
            render: {
              owner: owner,
              into: undefined,
              outlet: 'main',
              name: 'index',
              controller: context,
              ViewClass: undefined,
              template: lookupTemplate(owner, templateFullName),
              outlets: {}
            },
            outlets: {}
          }
        }
      };
      toplevelView.setOutletState(outletState); // returning settled here because the actual rendering does not happen until
      // the renderer detects it is dirty (which happens on backburner's end
      // hook), see the following implementation details:
      //
      // * [view:outlet](https://github.com/emberjs/ember.js/blob/f94a4b6aef5b41b96ef2e481f35e07608df01440/packages/ember-glimmer/lib/views/outlet.js#L129-L145) manually dirties its own tag upon `setOutletState`
      // * [backburner's custom end hook](https://github.com/emberjs/ember.js/blob/f94a4b6aef5b41b96ef2e481f35e07608df01440/packages/ember-glimmer/lib/renderer.js#L145-L159) detects that the current revision of the root is no longer the latest, and triggers a new rendering transaction

      return (0, _settled.default)();
    });
  }
  /**
    Clears any templates previously rendered. This is commonly used for
    confirming behavior that is triggered by teardown (e.g.
    `willDestroyElement`).
  
    @public
    @returns {Promise<void>} resolves when settled
  */


  function clearRender() {
    var context = (0, _setupContext.getContext)();

    if (!context || !isRenderingTestContext(context)) {
      throw new Error('Cannot call `clearRender` without having first called `setupRenderingContext`.');
    }

    return render(EMPTY_TEMPLATE);
  }
  /**
    Used by test framework addons to setup the provided context for rendering.
  
    `setupContext` must have been ran on the provided context
    prior to calling `setupRenderingContext`.
  
    Responsible for:
  
    - Setup the basic framework used for rendering by the
      `render` helper.
    - Ensuring the event dispatcher is properly setup.
    - Setting `this.element` to the root element of the testing
      container (things rendered via `render` will go _into_ this
      element).
  
    @public
    @param {Object} context the context to setup for rendering
    @returns {Promise<Object>} resolves with the context that was setup
  */


  function setupRenderingContext(context) {
    var contextGuid = Ember.guidFor(context);
    RENDERING_CLEANUP[contextGuid] = [];
    var testMetadata = (0, _testMetadata.default)(context);
    testMetadata.setupTypes.push('setupRenderingContext');
    return (0, _utils.nextTickPromise)().then(function () {
      var owner = context.owner; // these methods being placed on the context itself will be deprecated in
      // a future version (no giant rush) to remove some confusion about which
      // is the "right" way to things...

      Object.defineProperty(context, 'render', {
        configurable: true,
        enumerable: true,
        value: render,
        writable: false
      });
      Object.defineProperty(context, 'clearRender', {
        configurable: true,
        enumerable: true,
        value: clearRender,
        writable: false
      });

      if (_global.default.jQuery) {
        Object.defineProperty(context, '$', {
          configurable: true,
          enumerable: true,
          value: jQuerySelector,
          writable: false
        });
      } // When the host app uses `setApplication` (instead of `setResolver`) the event dispatcher has
      // already been setup via `applicationInstance.boot()` in `./build-owner`. If using
      // `setResolver` (instead of `setApplication`) a "mock owner" is created by extending
      // `Ember._ContainerProxyMixin` and `Ember._RegistryProxyMixin` in this scenario we need to
      // manually start the event dispatcher.


      if (owner._emberTestHelpersMockOwner) {
        var dispatcher = owner.lookup('event_dispatcher:main') || Ember.EventDispatcher.create();
        dispatcher.setup({}, '#ember-testing');
      }

      var OutletView = owner.factoryFor ? owner.factoryFor('view:-outlet') : owner._lookupFactory('view:-outlet');
      var toplevelView = OutletView.create();
      owner.register('-top-level-view:main', {
        create: function create() {
          return toplevelView;
        }
      }); // initially render a simple empty template

      return render(EMPTY_TEMPLATE).then(function () {
        Ember.run(toplevelView, 'appendTo', (0, _getRootElement.default)());
        return (0, _settled.default)();
      });
    }).then(function () {
      Object.defineProperty(context, 'element', {
        configurable: true,
        enumerable: true,
        // ensure the element is based on the wrapping toplevel view
        // Ember still wraps the main application template with a
        // normal tagged view
        //
        // In older Ember versions (2.4) the element itself is not stable,
        // and therefore we cannot update the `this.element` until after the
        // rendering is completed
        value: _global.default.EmberENV._APPLICATION_TEMPLATE_WRAPPER !== false ? (0, _getRootElement.default)().querySelector('.ember-view') : (0, _getRootElement.default)(),
        writable: false
      });
      return context;
    });
  }
});
define("@ember/test-helpers/teardown-application-context", ["exports", "@ember/test-helpers/-utils", "@ember/test-helpers/settled"], function (_exports, _utils, _settled) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  /**
    Used by test framework addons to tear down the provided context after testing is completed.
  
    @public
    @param {Object} context the context to setup
    @param {Object} [options] options used to override defaults
    @param {boolean} [options.waitForSettled=true] should the teardown wait for `settled()`ness
    @returns {Promise<void>} resolves when settled
  */
  function _default(context, options) {
    var waitForSettled = true;

    if (options !== undefined && 'waitForSettled' in options) {
      waitForSettled = options.waitForSettled;
    }

    if (waitForSettled) {
      return (0, _settled.default)();
    }

    return (0, _utils.nextTickPromise)();
  }
});
define("@ember/test-helpers/teardown-context", ["exports", "@ember/test-helpers/settled", "@ember/test-helpers/setup-context", "@ember/test-helpers/-utils"], function (_exports, _settled, _setupContext, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = teardownContext;

  /**
    Used by test framework addons to tear down the provided context after testing is completed.
  
    Responsible for:
  
    - un-setting the "global testing context" (`unsetContext`)
    - destroy the contexts owner object
    - remove AJAX listeners
  
    @public
    @param {Object} context the context to setup
    @param {Object} [options] options used to override defaults
    @param {boolean} [options.waitForSettled=true] should the teardown wait for `settled()`ness
    @returns {Promise<void>} resolves when settled
  */
  function teardownContext(context, options) {
    var waitForSettled = true;

    if (options !== undefined && 'waitForSettled' in options) {
      waitForSettled = options.waitForSettled;
    }

    return (0, _utils.nextTickPromise)().then(function () {
      var owner = context.owner;
      (0, _settled._teardownAJAXHooks)();
      Ember.run(owner, 'destroy');
      Ember.testing = false;
      (0, _setupContext.unsetContext)();

      if (waitForSettled) {
        return (0, _settled.default)();
      }

      return (0, _utils.nextTickPromise)();
    }).finally(function () {
      var contextGuid = Ember.guidFor(context);
      (0, _utils.runDestroyablesFor)(_setupContext.CLEANUP, contextGuid);

      if (waitForSettled) {
        return (0, _settled.default)();
      }

      return (0, _utils.nextTickPromise)();
    });
  }
});
define("@ember/test-helpers/teardown-rendering-context", ["exports", "@ember/test-helpers/setup-rendering-context", "@ember/test-helpers/-utils", "@ember/test-helpers/settled"], function (_exports, _setupRenderingContext, _utils, _settled) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = teardownRenderingContext;

  /**
    Used by test framework addons to tear down the provided context after testing is completed.
  
    Responsible for:
  
    - resetting the `ember-testing-container` to its original state (the value
      when `setupRenderingContext` was called).
  
    @public
    @param {Object} context the context to setup
    @param {Object} [options] options used to override defaults
    @param {boolean} [options.waitForSettled=true] should the teardown wait for `settled()`ness
    @returns {Promise<void>} resolves when settled
  */
  function teardownRenderingContext(context, options) {
    var waitForSettled = true;

    if (options !== undefined && 'waitForSettled' in options) {
      waitForSettled = options.waitForSettled;
    }

    return (0, _utils.nextTickPromise)().then(function () {
      var contextGuid = Ember.guidFor(context);
      (0, _utils.runDestroyablesFor)(_setupRenderingContext.RENDERING_CLEANUP, contextGuid);

      if (waitForSettled) {
        return (0, _settled.default)();
      }

      return (0, _utils.nextTickPromise)();
    });
  }
});
define("@ember/test-helpers/test-metadata", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = getTestMetadata;
  _exports.TestMetadata = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var TestMetadata =
  /*#__PURE__*/
  function () {
    function TestMetadata() {
      _classCallCheck(this, TestMetadata);

      this.setupTypes = [];
      this.usedHelpers = [];
    }

    _createClass(TestMetadata, [{
      key: "isRendering",
      get: function get() {
        return this.setupTypes.indexOf('setupRenderingContext') > -1 && this.usedHelpers.indexOf('render') > -1;
      }
    }, {
      key: "isApplication",
      get: function get() {
        return this.setupTypes.indexOf('setupApplicationContext') > -1;
      }
    }]);

    return TestMetadata;
  }();

  _exports.TestMetadata = TestMetadata;
  var TEST_METADATA = new WeakMap();
  /**
   * Gets the test metadata associated with the provided test context. Will create
   * a new test metadata object if one does not exist.
   *
   * @param {BaseContext} context the context to use
   * @returns {ITestMetadata} the test metadata for the provided context
   */

  function getTestMetadata(context) {
    if (!TEST_METADATA.has(context)) {
      TEST_METADATA.set(context, new TestMetadata());
    }

    return TEST_METADATA.get(context);
  }
});
define("@ember/test-helpers/validate-error-handler", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = validateErrorHandler;
  var VALID = Object.freeze({
    isValid: true,
    message: null
  });
  var INVALID = Object.freeze({
    isValid: false,
    message: 'error handler should have re-thrown the provided error'
  });
  /**
   * Validate the provided error handler to confirm that it properly re-throws
   * errors when `Ember.testing` is true.
   *
   * This is intended to be used by test framework hosts (or other libraries) to
   * ensure that `Ember.onerror` is properly configured. Without a check like
   * this, `Ember.onerror` could _easily_ swallow all errors and make it _seem_
   * like everything is just fine (and have green tests) when in reality
   * everything is on fire...
   *
   * @public
   * @param {Function} [callback=Ember.onerror] the callback to validate
   * @returns {Object} object with `isValid` and `message`
   *
   * @example <caption>Example implementation for `ember-qunit`</caption>
   *
   * import { validateErrorHandler } from '@ember/test-helpers';
   *
   * test('Ember.onerror is functioning properly', function(assert) {
   *   let result = validateErrorHandler();
   *   assert.ok(result.isValid, result.message);
   * });
   */

  function validateErrorHandler() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Ember.onerror;

    if (callback === undefined || callback === null) {
      return VALID;
    }

    var error = new Error('Error handler validation error!');
    var originalEmberTesting = Ember.testing;
    Ember.testing = true;

    try {
      callback(error);
    } catch (e) {
      if (e === error) {
        return VALID;
      }
    } finally {
      Ember.testing = originalEmberTesting;
    }

    return INVALID;
  }
});
define("@ember/test-helpers/wait-until", ["exports", "@ember/test-helpers/-utils"], function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = waitUntil;
  var TIMEOUTS = [0, 1, 2, 5, 7];
  var MAX_TIMEOUT = 10;
  /**
    Wait for the provided callback to return a truthy value.
  
    This does not leverage `settled()`, and as such can be used to manage async
    while _not_ settled (e.g. "loading" or "pending" states).
  
    @public
    @param {Function} callback the callback to use for testing when waiting should stop
    @param {Object} [options] options used to override defaults
    @param {number} [options.timeout=1000] the maximum amount of time to wait
    @param {string} [options.timeoutMessage='waitUntil timed out'] the message to use in the reject on timeout
    @returns {Promise} resolves with the callback value when it returns a truthy value
  */

  function waitUntil(callback) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var timeout = 'timeout' in options ? options.timeout : 1000;
    var timeoutMessage = 'timeoutMessage' in options ? options.timeoutMessage : 'waitUntil timed out'; // creating this error eagerly so it has the proper invocation stack

    var waitUntilTimedOut = new Error(timeoutMessage);
    return new _utils._Promise(function (resolve, reject) {
      var time = 0; // eslint-disable-next-line require-jsdoc

      function scheduleCheck(timeoutsIndex) {
        var interval = TIMEOUTS[timeoutsIndex];

        if (interval === undefined) {
          interval = MAX_TIMEOUT;
        }

        (0, _utils.futureTick)(function () {
          time += interval;
          var value;

          try {
            value = callback();
          } catch (error) {
            reject(error);
          }

          if (value) {
            resolve(value);
          } else if (time < timeout) {
            scheduleCheck(timeoutsIndex + 1);
          } else {
            reject(waitUntilTimedOut);
          }
        }, interval);
      }

      scheduleCheck(0);
    });
  }
});
define("ember-asset-loader/test-support/loaded-asset-state", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getLoadedAssetState = getLoadedAssetState;
  _exports.cacheLoadedAssetState = cacheLoadedAssetState;
  _exports.resetLoadedAssetState = resetLoadedAssetState;
  var cachedRequireEntries;
  var cachedScriptTags;
  var cachedLinkTags;
  /**
   * Determines whether an array contains the provided item.
   *
   * @param {Array} array
   * @param {Any} item
   * @return {Boolean}
   */

  function has(array, item) {
    return array.indexOf(item) !== -1;
  }
  /**
   * Removes a DOM Node from the document.
   *
   * @param {Node} node
   * @return {Void}
   */


  function removeNode(node) {
    node.parentNode.removeChild(node);
  }
  /**
   * Converts an iterable object into an actual Array.
   *
   * @param {Iterable} iterable
   * @return {Array}
   */


  function toArray(iterable) {
    return Array.prototype.slice.call(iterable);
  }
  /**
   * Returns all of the HTML Elements matching a given selector as an array.
   *
   * @param {String} selector
   * @return {Array<HTMLElement>}
   */


  function getAll(selector) {
    var htmlCollection = document.querySelectorAll(selector);
    return toArray(htmlCollection);
  }
  /**
   * Deletes an entry from require's list of modules.
   *
   * @param {String} entry
   * @return {Void}
   */


  function resetRequireEntry(entry) {
    delete self.requirejs.entries[entry];
  }
  /**
   * Compares two arrays, if they're different, invokes a callback for each
   * entry that does not appear in the initial array.
   *
   * @param {Array} initial
   * @param {Array} current
   * @param {Function} diffHandler
   * @return {Void}
   */


  function compareAndIterate(initial, current, diffHandler) {
    if (initial.length < current.length) {
      for (var i = 0; i < current.length; i++) {
        var entry = current[i];

        if (!has(initial, entry)) {
          diffHandler(entry);
        }
      }
    }
  }
  /**
   * Gets the current loaded asset state including scripts, links, and require
   * modules.
   *
   * @return {Object}
   */


  function getLoadedAssetState() {
    return {
      requireEntries: Object.keys(self.requirejs.entries),
      scripts: getAll('script'),
      links: getAll('link')
    };
  }
  /**
   * Caches the current loaded asset state with regards to links, scripts, and JS
   * modules currently present.
   *
   * @return {Void}
   */


  function cacheLoadedAssetState() {
    var _getLoadedAssetState = getLoadedAssetState();

    cachedRequireEntries = _getLoadedAssetState.requireEntries;
    cachedScriptTags = _getLoadedAssetState.scripts;
    cachedLinkTags = _getLoadedAssetState.links;
  }
  /**
   * Restores the loaded asset state to the previous cached value with regards to
   * links, scripts, and JS modules.
   *
   * @return {Void}
   */


  function resetLoadedAssetState() {
    var _getLoadedAssetState2 = getLoadedAssetState(),
        currentRequireEntries = _getLoadedAssetState2.requireEntries,
        currentScriptTags = _getLoadedAssetState2.scripts,
        currentLinkTags = _getLoadedAssetState2.links;

    compareAndIterate(cachedRequireEntries, currentRequireEntries, resetRequireEntry);
    compareAndIterate(cachedScriptTags, currentScriptTags, removeNode);
    compareAndIterate(cachedLinkTags, currentLinkTags, removeNode);
  }
});
define("ember-asset-loader/test-support/preload-assets", ["exports", "ember-asset-loader/services/asset-loader"], function (_exports, _assetLoader) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = preloadAssets;
  var Test = Ember.Test,
      RSVP = Ember.RSVP;
  /**
   * Preloads all the bundles specified in an asset manifest
   * to make sure all files are available for testing.
   *
   * Uses the Ember.Test.Promise class to make sure tests
   * wait for the assets to load first.
   *
   * @return {Promise}
   */

  function preloadAssets(manifest) {
    var loader = _assetLoader.default.create();

    loader.pushManifest(manifest);
    var bundlePromises = Object.keys(manifest.bundles).map(function (bundle) {
      return loader.loadBundle(bundle);
    });
    var allBundles = RSVP.all(bundlePromises);
    return Test.resolve(allBundles);
  }
});
define('ember-classy-page-object/-private/page-object', ['exports', 'ember-cli-page-object', 'ember-cli-page-object/extend', 'ember-classy-page-object/-private/utils/descriptors'], function (exports, _emberCliPageObject, _extend, _descriptors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  // pre-emptively turn on native events since we'll need them
  (0, _extend.useNativeEvents)();

  function extendDefinition(definition, extension) {
    (true && !(extension !== null && (typeof extension === 'string' || (typeof extension === 'undefined' ? 'undefined' : _typeof(extension)) === 'object')) && Ember.assert('must provide a string or an object to extend', extension !== null && (typeof extension === 'string' || (typeof extension === 'undefined' ? 'undefined' : _typeof(extension)) === 'object')));
    (true && !(extension && Object.keys(extension).length > 0) && Ember.assert('must provide a definition with atleast one key when extending a PageObject', extension && Object.keys(extension).length > 0));


    var finalizedDefinition = typeof extension === 'string' ? { scope: extension } : extension;

    finalizedDefinition = (0, _descriptors.extractPageObjects)(finalizedDefinition);
    finalizedDefinition = (0, _descriptors.extractGetters)(finalizedDefinition);

    finalizedDefinition = (0, _descriptors.deepMergeDescriptors)(finalizedDefinition, definition);

    return finalizedDefinition;
  }

  var PageObject = function () {
    function PageObject(extension) {
      _classCallCheck(this, PageObject);

      var definition = this.constructor._definition;

      definition = extension ? extendDefinition(definition, extension) : definition;

      return (0, _emberCliPageObject.create)(definition);
    }

    _createClass(PageObject, null, [{
      key: 'extend',
      value: function extend(extension) {
        var Page = function (_ref) {
          _inherits(Page, _ref);

          function Page() {
            _classCallCheck(this, Page);

            return _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).apply(this, arguments));
          }

          return Page;
        }(this);

        Page._definition = extendDefinition(this._definition, extension);

        return Page;
      }
    }]);

    return PageObject;
  }();

  exports.default = PageObject;


  PageObject._definition = {};
});
define('ember-classy-page-object/-private/properties/collection', ['exports', 'ember-cli-page-object'], function (exports, _emberCliPageObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.collection = collection;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var CollectionProxy = function () {
    function CollectionProxy(scope, definition, key, parent) {
      _classCallCheck(this, CollectionProxy);

      this._key = key;
      this._page = (0, _emberCliPageObject.create)(_defineProperty({}, key, (0, _emberCliPageObject.collection)(scope, definition)), { parent: parent });

      // Hack: Trick the page object into thinking it has a different parent
      this._collection.parent = parent;
    }

    _createClass(CollectionProxy, [{
      key: 'objectAt',
      value: function objectAt(index) {
        return this._collection.objectAt(index);
      }
    }, {
      key: 'toArray',
      value: function toArray() {
        return this._collection.toArray();
      }
    }, {
      key: 'filter',
      value: function filter() {
        var _collection;

        return (_collection = this._collection).filter.apply(_collection, arguments);
      }
    }, {
      key: 'filterBy',
      value: function filterBy() {
        var _collection2;

        return (_collection2 = this._collection).filterBy.apply(_collection2, arguments);
      }
    }, {
      key: 'map',
      value: function map() {
        var _collection3;

        return (_collection3 = this._collection).map.apply(_collection3, arguments);
      }
    }, {
      key: 'mapBy',
      value: function mapBy() {
        var _collection4;

        return (_collection4 = this._collection).mapBy.apply(_collection4, arguments);
      }
    }, {
      key: 'forEach',
      value: function forEach() {
        var _toArray;

        return (_toArray = this.toArray()).forEach.apply(_toArray, arguments);
      }
    }, {
      key: 'findOne',
      value: function findOne(query) {
        var result = this.findAll(query);

        (true && !(result.length === 1) && Ember.assert('Expected at most one result from \'findOne\' query in \'' + this._collection.key + '\' collection, but found ' + result.length + ' using query ' + Ember.inspect(query), result.length === 1));


        return result[0];
      }
    }, {
      key: 'findAll',
      value: function findAll(query) {
        var predicate = void 0;

        if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object') {
          predicate = function predicate(item) {
            var isMatch = true;

            for (var key in query) {
              isMatch = isMatch && item[key] === query[key];
            }

            return isMatch;
          };
        } else if (typeof query === 'function') {
          predicate = query;
        } else {
          (true && !(false) && Ember.assert('Expected query for findAll to be either an object or function, received: ' + Ember.inspect(query), false));
        }

        return this.filter(predicate);
      }
    }, {
      key: '_collection',
      get: function get() {
        return this._page[this._key];
      }
    }, {
      key: 'length',
      get: function get() {
        return this._collection.length;
      }
    }]);

    return CollectionProxy;
  }();

  function collection(scopeOrDefinition, definitionOrNull) {
    // Collection proxies need to be created for each of instances of this collection,
    // and there may be many since page objects can be reused in many locations. We use
    // a WeakMap to store each instance relative to its node.
    var collectionProxyMap = new WeakMap();

    var definition = definitionOrNull || scopeOrDefinition;

    if (definition._definition) {
      definition = definition._definition;
    }

    var scope = definitionOrNull ? scopeOrDefinition : definition.scope;

    delete definition.scope;

    return {
      isDescriptor: true,

      setup: function setup(node, key) {
        var collectionProxy = new CollectionProxy(this._scope, this._definition, key, node);

        collectionProxyMap.set(node, collectionProxy);
      },
      get: function get() {
        return collectionProxyMap.get(this);
      },


      _scope: scope,
      _definition: definition
    };
  }
});
define('ember-classy-page-object/-private/utils/descriptors', ['exports', 'ember-cli-page-object/macros'], function (exports, _macros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.extractPageObjects = extractPageObjects;
  exports.extractGetters = extractGetters;
  exports.deepMergeDescriptors = deepMergeDescriptors;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function isObject(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
  }

  function walkObject(obj, fn) {
    Object.getOwnPropertyNames(obj).forEach(function (name) {
      // Copy descriptor
      var descriptor = Object.getOwnPropertyDescriptor(obj, name);

      fn(obj, name, descriptor);
    });
  }

  function extractPageObjects(definition) {
    var finalizedDefinition = {};

    walkObject(definition, function (obj, name, descriptor) {
      if (typeof descriptor.value === 'function' && descriptor.value._definition) {
        descriptor.value = descriptor.value._definition;
      }

      if (isObject(descriptor.value)) {
        descriptor.value = extractPageObjects(descriptor.value);
      }

      Object.defineProperty(finalizedDefinition, name, descriptor);
    });

    return finalizedDefinition;
  }

  function extractGetters(definition) {
    var finalizedDefinition = {};

    walkObject(definition, function (obj, name, descriptor) {
      if (typeof descriptor.get === 'function') {
        descriptor.value = (0, _macros.getter)(descriptor.get);

        descriptor.writable = true;
        delete descriptor.get;
        delete descriptor.set;
      } else if (isObject(descriptor.value)) {
        descriptor.value = extractGetters(descriptor.value);
      }

      Object.defineProperty(finalizedDefinition, name, descriptor);
    });

    return finalizedDefinition;
  }

  function deepMergeDescriptors(dest, src) {
    walkObject(src, function (obj, name, descriptor) {
      var srcValue = descriptor.value;


      // The property exists on both objects
      if (Object.hasOwnProperty.call(dest, name)) {
        var _Object$getOwnPropert = Object.getOwnPropertyDescriptor(dest, name),
            destValue = _Object$getOwnPropert.value;

        // Deep merge if both are objects
        if (isObject(destValue) && isObject(srcValue)) {
          descriptor.value = deepMergeDescriptors(destValue, srcValue);
        } else if (destValue === undefined) {
          descriptor.value = srcValue;
        } else {
          // Defer to the 'dest' value otherwise (ie, do not redefine property)
          return;
        }
      } else if (isObject(srcValue)) {
        // The property only exists on 'src'
        descriptor.value = deepMergeDescriptors({}, srcValue);
      }

      Object.defineProperty(dest, name, descriptor);
    });

    return dest;
  }
});
define("ember-classy-page-object/-private/utils/extract-getters", [], function () {
  "use strict";
});
define('ember-classy-page-object/extend', ['exports', 'ember-cli-page-object/extend'], function (exports, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getContext = exports.fullScope = exports.buildSelector = undefined;
  Object.defineProperty(exports, 'buildSelector', {
    enumerable: true,
    get: function () {
      return _extend.buildSelector;
    }
  });
  Object.defineProperty(exports, 'fullScope', {
    enumerable: true,
    get: function () {
      return _extend.fullScope;
    }
  });
  Object.defineProperty(exports, 'getContext', {
    enumerable: true,
    get: function () {
      return _extend.getContext;
    }
  });
  exports.findElement = findElement;
  exports.findElementWithAssert = findElementWithAssert;
  function findElement(node, selector) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var result = (0, _extend.findElement)(node, selector, options);

    return options.multiple ? result.toArray() : result[0];
  }

  function findElementWithAssert(node, selector) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var result = (0, _extend.findElementWithAssert)(node, selector, options);

    return options.multiple ? result.toArray() : result[0];
  }
});
define('ember-classy-page-object/index', ['exports', 'ember-cli-page-object', 'ember-cli-page-object/macros', 'ember-classy-page-object/-private/properties/collection', 'ember-classy-page-object/-private/page-object'], function (exports, _emberCliPageObject, _macros, _collection, _pageObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'attribute', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.attribute;
    }
  });
  Object.defineProperty(exports, 'blurrable', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.blurrable;
    }
  });
  Object.defineProperty(exports, 'clickOnText', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.clickOnText;
    }
  });
  Object.defineProperty(exports, 'clickable', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.clickable;
    }
  });
  Object.defineProperty(exports, 'contains', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.contains;
    }
  });
  Object.defineProperty(exports, 'count', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.count;
    }
  });
  Object.defineProperty(exports, 'fillable', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.fillable;
    }
  });
  Object.defineProperty(exports, 'hasClass', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.hasClass;
    }
  });
  Object.defineProperty(exports, 'is', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.is;
    }
  });
  Object.defineProperty(exports, 'isHidden', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.isHidden;
    }
  });
  Object.defineProperty(exports, 'isPresent', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.isPresent;
    }
  });
  Object.defineProperty(exports, 'isVisible', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.isVisible;
    }
  });
  Object.defineProperty(exports, 'notHasClass', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.notHasClass;
    }
  });
  Object.defineProperty(exports, 'property', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.property;
    }
  });
  Object.defineProperty(exports, 'text', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.text;
    }
  });
  Object.defineProperty(exports, 'triggerable', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.triggerable;
    }
  });
  Object.defineProperty(exports, 'value', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.value;
    }
  });
  Object.defineProperty(exports, 'visitable', {
    enumerable: true,
    get: function () {
      return _emberCliPageObject.visitable;
    }
  });
  Object.defineProperty(exports, 'alias', {
    enumerable: true,
    get: function () {
      return _macros.alias;
    }
  });
  Object.defineProperty(exports, 'collection', {
    enumerable: true,
    get: function () {
      return _collection.collection;
    }
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _pageObject.default;
    }
  });
});
define('ember-cli-page-object/-private/execution_context', ['exports', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_execution_context).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _execution_context[key];
      }
    });
  });
});
define('ember-cli-page-object/extend', ['exports', 'ember-cli-page-object/test-support/extend'], function (exports, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_extend).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _extend[key];
      }
    });
  });
});
define('ember-cli-page-object/index', ['exports', 'ember-cli-page-object/test-support/index'], function (exports, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_index).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _index[key];
      }
    });
  });
});
define('ember-cli-page-object/macros', ['exports', 'ember-cli-page-object/test-support/macros'], function (exports, _macros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_macros).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _macros[key];
      }
    });
  });
});
define('ember-cli-page-object/test-support/-private/action', ['exports', 'ember-cli-page-object/test-support/-private/execution_context', 'ember-cli-page-object/test-support/-private/helpers', 'ceibo'], function (exports, _execution_context, _helpers, _ceibo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.run = run;
  exports.chainable = chainable;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  /**
   * Run action
   *
   * @param {Ceibo} node Page object node to run action on
   * @param {Function} cb Some async activity callback
   * @returns {Ceibo}
   */
  function run(node, cb) {
    var adapter = (0, _execution_context.getExecutionContext)(node);
    var chainedRoot = (0, _helpers.getRoot)(node)._chainedTree;

    if (typeof adapter.andThen === 'function') {
      // With old ember-testing helpers, we don't make the difference between
      // chanined VS independent action invocations. Awaiting for the previous
      // action settlement, before invoke a new action, is a part of
      // the legacy testing helpers adapters for backward compat reasons
      chainedRoot._promise = adapter.andThen(cb);

      return node;
    } else if (!chainedRoot) {
      // Our root is already the root of the chained tree,
      // we need to wait on its promise if it has one so the
      // previous invocations can resolve before we run ours.
      var root = (0, _helpers.getRoot)(node);
      root._promise = Ember.RSVP.resolve(root._promise).then(function () {
        return cb(adapter);
      });

      return node;
    } else {
      // Store our invocation result on the chained root
      // so that chained calls can find it to wait on it.
      chainedRoot._promise = cb(adapter);

      return chainable(node);
    }
  }

  function chainable(branch) {
    if (isChainedNode(branch)) {
      return branch;
    }

    // See explanation in `create.js` -- here instead of returning the node on
    // which our method was invoked, we find and return our node's mirror in the
    // chained tree so calls to it can be recognized as chained calls, and
    // trigger the chained-call waiting behavior.

    // Collecting node keys to build a path to our node, and then use that
    // to walk back down the chained tree to our mirror node.
    var path = [];
    var node = void 0;

    for (node = branch; node; node = _ceibo.default.parent(node)) {
      path.unshift(_ceibo.default.meta(node).key);
    }
    // The path will end with the root's key, 'root', so shift that back off
    path.shift();

    node = (0, _helpers.getRoot)(branch)._chainedTree;
    path.forEach(function (key) {
      node = getChildNode(node, key);
    });

    return node;
  }

  function isChainedNode(node) {
    var root = (0, _helpers.getRoot)(node);

    return !root._chainedTree;
  }

  function getChildNode(node, key) {
    // Normally an item's key is just its property name, but collection
    // items' keys also include their index. Collection item keys look like
    // `foo[2]` and legacy collection item keys look like `foo(2)`.
    var match = void 0;
    if (match = /\[(\d+)\]$/.exec(key)) {
      var _match = match,
          _match2 = _slicedToArray(_match, 2),
          indexStr = _match2[0],
          index = _match2[1];

      var name = key.slice(0, -indexStr.length);

      return node[name].objectAt(parseInt(index, 10));
    } else if (match = /\((\d+)\)$/.exec(key)) {
      var _match3 = match,
          _match4 = _slicedToArray(_match3, 2),
          _indexStr = _match4[0],
          _index = _match4[1];

      var _name = key.slice(0, -_indexStr.length);

      return node[_name](parseInt(_index, 10));
    } else {
      return node[key];
    }
  }
});
define('ember-cli-page-object/test-support/-private/better-errors', ['exports', 'ceibo'], function (exports, _ceibo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ELEMENT_NOT_FOUND = undefined;
  exports.throwBetterError = throwBetterError;
  var ELEMENT_NOT_FOUND = exports.ELEMENT_NOT_FOUND = 'Element not found.';

  /**
   * Throws an error with a descriptive message.
   *
   * @param {Ceibo} node              PageObject node containing the property that triggered the error
   * @param {string} key              Key of PageObject property tht triggered the error
   * @param {string} msg              Error message
   * @param {Object} options
   * @param {string} options.selector Selector of element targeted by PageObject property
   * @return {Ember.Error}
   */
  function throwBetterError(node, key, msg) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        selector = _ref.selector;

    var path = [key];
    var current = void 0;

    for (current = node; current; current = _ceibo.default.parent(current)) {
      path.unshift(_ceibo.default.meta(current).key);
    }

    path[0] = 'page';

    var fullErrorMessage = msg + '\n\nPageObject: \'' + path.join('.') + '\'';

    if (selector) {
      fullErrorMessage = fullErrorMessage + '\n  Selector: \'' + selector + '\'';
    }

    console.error(fullErrorMessage);
    throw new Ember.Error(fullErrorMessage);
  }
});
define('ember-cli-page-object/test-support/-private/compatibility', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getContext = getContext;
  exports.getRootElement = getRootElement;
  exports.visit = visit;
  exports.click = click;
  exports.fillIn = fillIn;
  exports.triggerEvent = triggerEvent;
  exports.triggerKeyEvent = triggerKeyEvent;
  exports.focus = focus;
  exports.blur = blur;
  var _window = window,
      _require2 = _window.require;


  var helpers = void 0;
  var waitFn = void 0;

  if (_require2.has('@ember/test-helpers')) {
    helpers = _require2('@ember/test-helpers');
  } else {
    helpers = {
      getContext: function getContext() {
        return null;
      }
    };
  }

  if (_require2.has('ember-test-helpers/wait')) {
    // This is implemented as a function that calls `ember-test-helpers/wait`
    // rather than just assigning `helpers.wait = require(...).default` because
    // since this code executes while modules are initially loading, under certain
    // conditions `ember-test-helpers/wait` can still be in the pending state
    // at this point, so its exports are still undefined.
    waitFn = function waitFn() {
      var _require;

      return (_require = _require2('ember-test-helpers/wait')).default.apply(_require, arguments);
    };
  } else {
    waitFn = function waitFn() {
      throw new Error('ember-test-helpers or @ember/test-helpers must be installed');
    };
  }

  function getContext() {
    var _helpers;

    return (_helpers = helpers).getContext.apply(_helpers, arguments);
  }
  function getRootElement() {
    var _helpers2;

    return (_helpers2 = helpers).getRootElement.apply(_helpers2, arguments);
  }
  function visit() {
    var _helpers3;

    return (_helpers3 = helpers).visit.apply(_helpers3, arguments);
  }
  function click() {
    var _helpers4;

    return (_helpers4 = helpers).click.apply(_helpers4, arguments);
  }
  function fillIn() {
    var _helpers5;

    return (_helpers5 = helpers).fillIn.apply(_helpers5, arguments);
  }
  function triggerEvent() {
    var _helpers6;

    return (_helpers6 = helpers).triggerEvent.apply(_helpers6, arguments);
  }
  function triggerKeyEvent() {
    var _helpers7;

    return (_helpers7 = helpers).triggerKeyEvent.apply(_helpers7, arguments);
  }
  function focus() {
    var _helpers8;

    return (_helpers8 = helpers).focus.apply(_helpers8, arguments);
  }
  function blur() {
    var _helpers9;

    return (_helpers9 = helpers).blur.apply(_helpers9, arguments);
  }
  var wait = exports.wait = waitFn;
});
define('ember-cli-page-object/test-support/-private/context', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.render = render;
  exports.setContext = setContext;
  exports.removeContext = removeContext;


  /**
   * @public
   *
   * Render a component's template in the context of a test.
   *
   * Throws an error if a test's context has not been set on the page.
   *
   * Returns the page object, which allows for method chaining.
   *
   * @example
   *
   * page.setContext(this)
   *   .render(hbs`{{my-component}}`)
   *   .clickOnText('Hi!');
   *
   * @param {Object} template - A compiled component template
   * @return {PageObject} - the page object
   */
  function render(template) {
    Ember.deprecate('PageObject.render() is deprecated. Please use "htmlbars-inline-precompile" instead.', false, {
      id: 'ember-cli-page-object.page-render',
      until: '2.0.0',
      url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#page-render'
    });

    if (!this.context) {
      var message = 'You must set a context on the page object before calling calling `render()`';
      var error = new Error(message);

      throw error;
    }

    this.context.render(template);

    return this;
  }

  /**
   * @public
   *
   * Sets the page's test context.
   *
   * Returns the page object, which allows for method chaining.
   *
   * @example
   *
   * page.setContext(this)
   *   .render(hbs`{{my-component}}`)
   *   .clickOnText('Hi!');
   *
   * @param {Object} context - A component integration test's `this` context
   * @return {PageObject} - the page object
   */
  function setContext(context) {
    Ember.deprecate('setContext() is deprecated. Please make sure you use "@ember/test-helpers" of v1 or higher.', false, {
      id: 'ember-cli-page-object.set-context',
      until: '2.0.0',
      url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#set-context'
    });

    if (context) {
      this.context = context;
    }

    return this;
  }

  /**
   * @public
   *
   * Unsets the page's test context.
   *
   * Useful in a component test's `afterEach()` hook, to make sure the context has been cleared after each test.
   *
   * @example
   *
   * page.removeContext();
   *
   * @return {PageObject} - the page object
   */
  function removeContext() {
    if (this.context) {
      delete this.context;
    }

    return this;
  }
});
define('ember-cli-page-object/test-support/-private/dsl', ['exports', 'ember-cli-page-object/test-support/properties/as', 'ember-cli-page-object/test-support/properties/blurrable', 'ember-cli-page-object/test-support/properties/clickable', 'ember-cli-page-object/test-support/properties/click-on-text', 'ember-cli-page-object/test-support/properties/contains', 'ember-cli-page-object/test-support/properties/fillable', 'ember-cli-page-object/test-support/properties/focusable', 'ember-cli-page-object/test-support/properties/is-hidden', 'ember-cli-page-object/test-support/properties/is-present', 'ember-cli-page-object/test-support/properties/is-visible', 'ember-cli-page-object/test-support/properties/text', 'ember-cli-page-object/test-support/properties/value', 'ember-cli-page-object/test-support/-private/helpers'], function (exports, _as, _blurrable, _clickable, _clickOnText, _contains, _fillable, _focusable, _isHidden, _isPresent, _isVisible, _text, _value, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var thenDescriptor = {
    isDescriptor: true,
    value: function value() {
      var _chainedRoot$_promise;

      var root = (0, _helpers.getRoot)(this);
      var chainedRoot = root._chainedTree || root;

      return (_chainedRoot$_promise = chainedRoot._promise).then.apply(_chainedRoot$_promise, arguments);
    }
  };

  var dsl = {
    as: _as.as,
    blur: (0, _blurrable.blurrable)(),
    click: (0, _clickable.clickable)(),
    clickOn: (0, _clickOnText.clickOnText)(),
    contains: (0, _contains.contains)(),
    fillIn: (0, _fillable.fillable)(),
    focus: (0, _focusable.focusable)(),
    isHidden: (0, _isHidden.isHidden)(),
    isPresent: (0, _isPresent.isPresent)(),
    isVisible: (0, _isVisible.isVisible)(),
    select: (0, _fillable.fillable)(),
    text: (0, _text.text)(),
    then: thenDescriptor,
    value: (0, _value.value)()
  };

  exports.default = dsl;
});
define('ember-cli-page-object/test-support/-private/execution_context', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/compatibility', 'ember-cli-page-object/test-support/-private/execution_context/acceptance', 'ember-cli-page-object/test-support/-private/execution_context/integration', 'ember-cli-page-object/test-support/-private/execution_context/rfc268'], function (exports, _helpers, _compatibility, _acceptance, _integration, _rfc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getExecutionContext = getExecutionContext;
  exports.supportsRfc268 = supportsRfc268;
  exports.register = register;


  var executioncontexts = {
    acceptance: _acceptance.default,
    integration: _integration.default,
    rfc268: _rfc.default
  };

  /*
   * @private
   */
  function getExecutionContext(pageObjectNode) {
    // Our `getContext(pageObjectNode)` will return a context only if the test
    // called `page.setContext(this)`, which is only supposed to happen in
    // integration tests (i.e. pre-RFC232/RFC268). However, the integration
    // context does work with RFC232 (`setupRenderingContext()`) tests, and before
    // the RFC268 execution context was implemented, some users may have migrated
    // their tests to RFC232 tests, leaving the `page.setContext(this)` in place.
    // So, in order to not break those tests, we need to check for that case
    // first, and only if that hasn't happened, check to see if we're in an
    // RFC232/RFC268 test, and if not, fall back on assuming a pre-RFC268
    // acceptance test, which is the only remaining supported scenario.
    var integrationTestContext = (0, _helpers.getContext)(pageObjectNode);
    var contextName = void 0;
    if (integrationTestContext) {
      contextName = 'integration';
    } else if (isAcceptanceTest()) {
      contextName = 'acceptance';
    } else if (supportsRfc268()) {
      contextName = 'rfc268';
    }

    if (!contextName) {
      throw new Error('Looks like you attempt to access page object property outside of test context.\nIf that\'s not the case, please make sure you use the latest version of "@ember/test-helpers".');
    }

    return new executioncontexts[contextName](pageObjectNode, integrationTestContext);
  }

  /**
   * @private
   */
  function isAcceptanceTest() {
    return window.visit && window.andThen;
  }

  /**
   * @private
   */
  function supportsRfc268() {
    // `getContext()` returns:
    //  - falsey, if @ember/test-helpers is not available (stubbed in
    //    compatibility.js)
    //  - falsey, if @ember/test-helpers is available but none of the
    //    `ember-qunit` setupTest() methods has been called (e.g.,
    //    `setupRenderingTest()`)
    //  - truthy, if @ember/test-helpers is available and one of the `ember-qunit`
    //    setupTest() methods has been called.
    //
    // Note that if `page.setContext(this)` has been called, we'll never get here
    // and will just be running with the integration context (even if the test is
    // an RFC268 test).
    var hasValidTestContext = Boolean((0, _compatibility.getContext)());
    if (!hasValidTestContext) {
      return false;
    }

    // There are a few versions of `@ember/test-helpers` that have support for
    // `ember-qunit`'s `setupRenderingTest()` method, but do not have the DOM
    // helpers (`click`, `fillIn`, etc.) that the RFC268 execution context uses.
    // `visit` was the last helper to be added to `@ember/test-helpers`, so we
    // check for it, and if we can't find it, we can't use the RFC268 execution
    // context, so we throw an exception.
    var hasExpectedTestHelpers = Boolean(_compatibility.visit);
    if (!hasExpectedTestHelpers) {
      throw new Error(['You are trying to use ember-cli-page-object with RFC232/RFC268 support', '(setupRenderingContext()/setupApplicationContext()) which requires at', 'least ember-qunit@3.2.0 or ember-mocha@0.13.0-beta.3.'].join());
    }

    return true;
  }

  /*
   * @private
   */
  function register(type, definition) {
    executioncontexts[type] = definition;
  }
});
define('ember-cli-page-object/test-support/-private/execution_context/acceptance-native-events', ['exports', 'ember-native-dom-helpers', 'ember-cli-page-object/test-support/-private/execution_context/native-events-context', 'ember-cli-page-object/test-support/-private/compatibility'], function (exports, _emberNativeDomHelpers, _nativeEventsContext, _compatibility) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = AcceptanceNativeEventsExecutionContext;
  function AcceptanceNativeEventsExecutionContext(pageObjectNode) {
    _nativeEventsContext.default.call(this, pageObjectNode);
  }

  AcceptanceNativeEventsExecutionContext.prototype = Object.create(_nativeEventsContext.default.prototype);

  AcceptanceNativeEventsExecutionContext.prototype.visit = function () {
    _emberNativeDomHelpers.visit.apply(undefined, arguments);
  };

  AcceptanceNativeEventsExecutionContext.prototype.andThen = function (cb) {
    var _this = this;

    return (window.wait || _compatibility.wait)().then(function () {
      cb(_this);
    });
  };
});
define('ember-cli-page-object/test-support/-private/execution_context/acceptance', ['exports', 'ember-cli-page-object/test-support/-private/action', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context/helpers', 'ember-cli-page-object/test-support/-private/better-errors'], function (exports, _action, _helpers, _helpers2, _betterErrors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = AcceptanceExecutionContext;
  function AcceptanceExecutionContext(pageObjectNode) {
    this.pageObjectNode = pageObjectNode;
  }

  AcceptanceExecutionContext.prototype = {
    andThen: function andThen(cb) {
      var _this = this;

      return window.wait().then(function () {
        cb(_this);
      });
    },
    runAsync: function runAsync(cb) {
      return (0, _action.run)(this.pageObjectNode, cb);
    },
    visit: function (_visit) {
      function visit(_x) {
        return _visit.apply(this, arguments);
      }

      visit.toString = function () {
        return _visit.toString();
      };

      return visit;
    }(function (path) {
      /* global visit */
      visit(path);
    }),
    click: function (_click) {
      function click(_x2, _x3) {
        return _click.apply(this, arguments);
      }

      click.toString = function () {
        return _click.toString();
      };

      return click;
    }(function (selector, container) {
      /* global click */
      click(selector, container);
    }),
    fillIn: function fillIn(selector, container, options, content) {
      var $selection = find(selector, container || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      /* global focus */
      focus($selection);

      (0, _helpers2.fillElement)($selection, content, {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      /* global triggerEvent */
      triggerEvent(selector, container, 'input');
      triggerEvent(selector, container, 'change');
    },
    triggerEvent: function (_triggerEvent) {
      function triggerEvent(_x4, _x5, _x6, _x7, _x8) {
        return _triggerEvent.apply(this, arguments);
      }

      triggerEvent.toString = function () {
        return _triggerEvent.toString();
      };

      return triggerEvent;
    }(function (selector, container, options, eventName, eventOptions) {
      /* global triggerEvent */
      triggerEvent(selector, container, eventName, eventOptions);
    }),
    focus: function focus(selector, options) {
      var $selection = this.findWithAssert(selector, options);

      (0, _helpers2.assertFocusable)($selection[0], {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      $selection.focus();
    },
    blur: function blur(selector, options) {
      var $selection = this.findWithAssert(selector, options);

      (0, _helpers2.assertFocusable)($selection[0], {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      $selection.blur();
    },
    assertElementExists: function assertElementExists(selector, options) {
      /* global find */
      var result = find(selector, options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }
    },
    find: function (_find) {
      function find(_x9, _x10) {
        return _find.apply(this, arguments);
      }

      find.toString = function () {
        return _find.toString();
      };

      return find;
    }(function (selector, options) {
      var result = void 0;

      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);

      /* global find */
      result = find(selector, options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      return result;
    }),
    findWithAssert: function findWithAssert(selector, options) {
      var result = void 0;

      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);

      /* global find */
      result = find(selector, options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer'));

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      return result;
    }
  };
});
define('ember-cli-page-object/test-support/-private/execution_context/helpers', ['exports', 'ember-cli-page-object/test-support/-private/better-errors', '-jquery'], function (exports, _betterErrors, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fillElement = fillElement;
  exports.assertFocusable = assertFocusable;


  /**
   * @private
   *
   * Fills inputs, textareas, or contenteditable elements with the passed-in content.
   *
   * @param {jQuery} $selection              jQuery object containing collection of DOM elements to fill in
   * @param {string} content                 Content to be inserted into the target element(s)
   * @param {Object} options                 Options for error reporting
   * @param {string} options.selector        jQuery selector used to target element(s) to fill in
   * @param {Ceibo} options.pageObjectNode   PageObject node containing the method which, when invoked, resulted in this call to `fillElement`
   * @param {string} options.pageObjectKey   Key of method on PageObject which, when invoked, resulted in this call to `fillElement`
   * @return
   *
   * @throws Will throw an error if called on a contenteditable element that has `contenteditable="false"`
   */
  function fillElement(selection, content, _ref) {
    var selector = _ref.selector,
        pageObjectNode = _ref.pageObjectNode,
        pageObjectKey = _ref.pageObjectKey;

    var $selection = (0, _jquery.default)(selection);

    if ($selection.is('[contenteditable][contenteditable!="false"]')) {
      $selection.html(content);
    } else if ($selection.is('[contenteditable="false"]')) {
      (0, _betterErrors.throwBetterError)(pageObjectNode, pageObjectKey, 'Element cannot be filled because it has `contenteditable="false"`.', {
        selector: selector
      });
    } else {
      $selection.val(content);
    }
  }

  /**
   * @private
   *
   * Given an element, asserts that element is focusable/blurable
   *
   * @param {Element} element - the element to check
   */
  function assertFocusable(element, _ref2) {
    var selector = _ref2.selector,
        pageObjectNode = _ref2.pageObjectNode,
        pageObjectKey = _ref2.pageObjectKey;

    var $element = (0, _jquery.default)(element);

    var error = void 0;

    if ($element.is(':hidden')) {
      error = 'hidden';
    } else if ($element.is(':disabled')) {
      error = 'disabled';
    } else if ($element.is('[contenteditable="false"]')) {
      error = 'contenteditable="false"';
    } else if (!$element.is(':input, a[href], area[href], iframe, [contenteditable], [tabindex]')) {
      error = 'not a link, input, form element, contenteditable, iframe, or an element with tabindex';
    }

    if (error) {
      (0, _betterErrors.throwBetterError)(pageObjectNode, pageObjectKey, 'Element is not focusable because it is ' + error, {
        selector: selector
      });
    }
  }
});
define('ember-cli-page-object/test-support/-private/execution_context/integration-native-events', ['exports', 'ember-cli-page-object/test-support/-private/execution_context/native-events-context', 'ember-test-helpers/wait'], function (exports, _nativeEventsContext, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = IntegrationNativeEventsExecutionContext;
  function IntegrationNativeEventsExecutionContext(pageObjectNode, testContext) {
    _nativeEventsContext.default.call(this, pageObjectNode, testContext);
  }

  IntegrationNativeEventsExecutionContext.prototype = Object.create(_nativeEventsContext.default.prototype);

  IntegrationNativeEventsExecutionContext.prototype.visit = function () {};

  IntegrationNativeEventsExecutionContext.prototype.andThen = function (cb) {
    var _this = this;

    Ember.run(function () {
      cb(_this);
    });

    return (0, _wait.default)();
  };
});
define('ember-cli-page-object/test-support/-private/execution_context/integration', ['exports', '-jquery', 'ember-cli-page-object/test-support/-private/action', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context/helpers', 'ember-cli-page-object/test-support/-private/better-errors', 'ember-test-helpers/wait'], function (exports, _jquery, _action, _helpers, _helpers2, _betterErrors, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = IntegrationExecutionContext;
  function IntegrationExecutionContext(pageObjectNode, testContext) {
    this.pageObjectNode = pageObjectNode;
    this.testContext = testContext;
  }

  IntegrationExecutionContext.prototype = {
    andThen: function andThen(cb) {
      var _this = this;

      Ember.run(function () {
        cb(_this);
      });

      return (0, _wait.default)();
    },
    runAsync: function runAsync(cb) {
      return (0, _action.run)(this.pageObjectNode, cb);
    },
    visit: function visit() {},
    click: function click(selector, container) {
      this.$(selector, container).click();
    },
    fillIn: function fillIn(selector, container, options, content) {
      var $selection = this.$(selector, container);

      (0, _helpers2.fillElement)($selection, content, {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      $selection.trigger('input');
      $selection.change();
    },
    $: function $(selector, container) {
      if (container) {
        return (0, _jquery.default)(selector, container);
      } else {
        return this.testContext.$(selector);
      }
    },
    triggerEvent: function triggerEvent(selector, container, options, eventName, eventOptions) {
      var event = _jquery.default.Event(eventName, eventOptions);

      if (container) {
        (0, _jquery.default)(selector, container).trigger(event);
      } else {
        this.testContext.$(selector).trigger(event);
      }
    },
    focus: function focus(selector, options) {
      var $selection = this.findWithAssert(selector, options);

      (0, _helpers2.assertFocusable)($selection[0], {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      $selection.focus();
    },
    blur: function blur(selector, options) {
      var $selection = this.findWithAssert(selector, options);

      (0, _helpers2.assertFocusable)($selection[0], {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      $selection.blur();
    },
    assertElementExists: function assertElementExists(selector, options) {
      var result = void 0;
      var container = options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      if (container) {
        result = (0, _jquery.default)(selector, container);
      } else {
        result = this.testContext.$(selector);
      }

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }
    },
    find: function find(selector, options) {
      var result = void 0;
      var container = options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);

      if (container) {
        result = (0, _jquery.default)(selector, container);
      } else {
        result = this.testContext.$(selector);
      }

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      return result;
    },
    findWithAssert: function findWithAssert(selector, options) {
      var result = void 0;
      var container = options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);

      if (container) {
        result = (0, _jquery.default)(selector, container);
      } else {
        result = this.testContext.$(selector);
      }

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }

      return result;
    }
  };
});
define('ember-cli-page-object/test-support/-private/execution_context/native-events-context', ['exports', '-jquery', 'ember-native-dom-helpers', 'ember-cli-page-object/test-support/-private/action', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context/helpers', 'ember-cli-page-object/test-support/-private/better-errors'], function (exports, _jquery, _emberNativeDomHelpers, _action, _helpers, _helpers2, _betterErrors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ExecutionContext;


  var KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];

  function ExecutionContext(pageObjectNode, testContext) {
    this.pageObjectNode = pageObjectNode;
    this.testContext = testContext;
  }

  ExecutionContext.prototype = {
    runAsync: function runAsync(cb) {
      return (0, _action.run)(this.pageObjectNode, cb);
    },
    click: function click(selector, container) {
      var el = this.$(selector, container)[0];
      (0, _emberNativeDomHelpers.click)(el);
    },
    fillIn: function fillIn(selector, container, options, content) {
      var _this = this;

      var elements = this.$(selector, container).toArray();

      elements.forEach(function (el) {
        (0, _helpers2.fillElement)(el, content, {
          selector: selector,
          pageObjectNode: _this.pageObjectNode,
          pageObjectKey: options.pageObjectKey
        });

        (0, _emberNativeDomHelpers.triggerEvent)(el, 'input');
        (0, _emberNativeDomHelpers.triggerEvent)(el, 'change');
      });
    },
    $: function $(selector, container) {
      if (container) {
        return (0, _jquery.default)(selector, container);
      } else {
        // @todo: we should fixed usage of private `_element`
        // after https://github.com/emberjs/ember-test-helpers/issues/184 is resolved
        var testsContainer = this.testContext ? this.testContext._element : '#ember-testing';

        return (0, _jquery.default)(selector, testsContainer);
      }
    },
    triggerEvent: function triggerEvent(selector, container, options, eventName, eventOptions) {
      var element = this.$(selector, container)[0];

      // `keyCode` is a deprecated property.
      // @see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
      // Due to this deprecation `ember-native-dom-helpers` doesn't accept `keyCode` as a `KeyboardEvent` option.
      if (typeof eventOptions.key === 'undefined' && typeof eventOptions.keyCode !== 'undefined') {
        eventOptions.key = eventOptions.keyCode.toString();
        delete eventOptions.keyCode;
      }

      if (KEYBOARD_EVENT_TYPES.indexOf(eventName) > -1) {
        (0, _emberNativeDomHelpers.keyEvent)(element, eventName, eventOptions.key, eventOptions);
      } else {
        (0, _emberNativeDomHelpers.triggerEvent)(element, eventName, eventOptions);
      }
    },
    focus: function focus(selector, options) {
      var element = this.findWithAssert(selector, options)[0];

      (0, _helpers2.assertFocusable)(element, {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      (0, _emberNativeDomHelpers.focus)(element);
    },
    blur: function blur(selector, options) {
      var element = this.findWithAssert(selector, options)[0];

      (0, _helpers2.assertFocusable)(element, {
        selector: selector,
        pageObjectNode: this.pageObjectNode,
        pageObjectKey: options.pageObjectKey
      });

      (0, _emberNativeDomHelpers.blur)(element);
    },
    assertElementExists: function assertElementExists(selector, options) {
      var container = options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      var result = this.$(selector, container);

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }
    },
    find: function find(selector, options) {
      var container = options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);

      var result = this.$(selector, container);

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      return result;
    },
    findWithAssert: function findWithAssert(selector, options) {
      var container = options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer');

      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);

      var result = this.$(selector, container);

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      return result;
    }
  };
});
define('ember-cli-page-object/test-support/-private/execution_context/rfc268', ['exports', '-jquery', 'ember-cli-page-object/test-support/-private/action', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/compatibility', 'ember-cli-page-object/test-support/-private/better-errors'], function (exports, _jquery, _action, _helpers, _compatibility, _betterErrors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ExecutionContext;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function ExecutionContext(pageObjectNode) {
    this.pageObjectNode = pageObjectNode;
  }

  ExecutionContext.prototype = {
    runAsync: function runAsync(cb) {
      return (0, _action.run)(this.pageObjectNode, cb);
    },
    visit: function visit(path) {
      return (0, _compatibility.visit)(path);
    },
    click: function click(selector, container, options) {
      return this.invokeHelper(selector, options, _compatibility.click);
    },
    fillIn: function fillIn(selector, container, options, content) {
      return this.invokeHelper(selector, options, _compatibility.fillIn, content);
    },
    triggerEvent: function triggerEvent(selector, container, options, eventName, eventOptions) {
      if (typeof eventOptions.key !== 'undefined' || typeof eventOptions.keyCode !== 'undefined') {
        var key = eventOptions.key || eventOptions.keyCode;

        return this.invokeHelper(selector, options, _compatibility.triggerKeyEvent, eventName, key, eventOptions);
      }

      return this.invokeHelper(selector, options, _compatibility.triggerEvent, eventName, eventOptions);
    },
    focus: function focus(selector, options) {
      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);
      return this.invokeHelper(selector, options, _compatibility.focus);
    },
    blur: function blur(selector, options) {
      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);
      return this.invokeHelper(selector, options, _compatibility.blur);
    },
    assertElementExists: function assertElementExists(selector, options) {
      var result = this.getElements(selector, options);

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }
    },
    find: function find(selector, options) {
      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);
      var result = this.getElements(selector, options);

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      return result;
    },
    findWithAssert: function findWithAssert(selector, options) {
      selector = (0, _helpers.buildSelector)(this.pageObjectNode, selector, options);
      var result = this.getElements(selector, options);

      (0, _helpers.guardMultiple)(result, selector, options.multiple);

      if (result.length === 0) {
        (0, _betterErrors.throwBetterError)(this.pageObjectNode, options.pageObjectKey, _betterErrors.ELEMENT_NOT_FOUND, { selector: selector });
      }

      return result;
    },
    getElements: function getElements(selector, options) {
      var container = options.testContainer || (0, _helpers.findClosestValue)(this.pageObjectNode, 'testContainer');
      if (container) {
        return (0, _jquery.default)(selector, container);
      } else {
        return (0, _jquery.default)(selector, (0, _compatibility.getRootElement)());
      }
    },
    invokeHelper: function invokeHelper(selector, options, helper) {
      var _this = this;

      var element = this.getElements(selector, options)[0];

      for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }

      return helper.apply(undefined, [element].concat(_toConsumableArray(args))).catch(function (e) {
        (0, _betterErrors.throwBetterError)(_this.pageObjectNode, options.pageObjectKey, e.message || e.toString(), { selector: selector });
      });
    }
  };
});
define('ember-cli-page-object/test-support/-private/helpers', ['exports', 'ceibo', 'ember-cli-page-object/test-support/-private/compatibility', '-jquery'], function (exports, _ceibo, _compatibility, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.assign = undefined;
  exports.guardMultiple = guardMultiple;
  exports.buildSelector = buildSelector;
  exports.normalizeText = normalizeText;
  exports.every = every;
  exports.map = map;
  exports.getRoot = getRoot;
  exports.getContext = getContext;
  exports.fullScope = fullScope;
  exports.findClosestValue = findClosestValue;
  exports.objectHasProperty = objectHasProperty;
  exports.getProperty = getProperty;
  exports.isPageObject = isPageObject;
  exports.getPageObjectDefinition = getPageObjectDefinition;
  exports.storePageObjectDefinition = storePageObjectDefinition;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var assign = exports.assign = Ember.assign;

  var Selector = function () {
    function Selector(node, scope, selector, filters) {
      _classCallCheck(this, Selector);

      this.targetNode = node;
      this.targetScope = scope || '';
      this.targetSelector = selector || '';
      this.targetFilters = filters;
    }

    _createClass(Selector, [{
      key: 'toString',
      value: function toString() {
        var scope = void 0;
        var filters = void 0;

        if (this.targetFilters.resetScope) {
          scope = this.targetScope;
        } else {
          scope = this.calculateScope(this.targetNode, this.targetScope);
        }

        filters = this.calculateFilters(this.targetFilters);

        var selector = _jquery.default.trim(scope + ' ' + this.targetSelector + filters);

        if (!selector.length) {
          // When an empty selector is resolved take the first direct child of the
          // testing container.
          selector = ':first';
        }

        Ember.deprecate('Usage of comma separated selectors is deprecated in ember-cli-page-object', selector.indexOf(',') === -1, {
          id: 'ember-cli-page-object.comma-separated-selectors',
          until: "2.0.0",
          url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#comma-separated-selectors'
        });

        return selector;
      }
    }, {
      key: 'calculateFilters',
      value: function calculateFilters() {
        var filters = [];

        if (this.targetFilters.visible) {
          filters.push(':visible');
        }

        if (this.targetFilters.contains) {
          filters.push(':contains("' + this.targetFilters.contains + '")');
        }

        if (typeof this.targetFilters.at === 'number') {
          filters.push(':eq(' + this.targetFilters.at + ')');
        } else if (this.targetFilters.last) {
          filters.push(':last');
        }

        return filters.join('');
      }
    }, {
      key: 'calculateScope',
      value: function calculateScope(node, targetScope) {
        var scopes = this.getScopes(node);

        scopes.reverse();
        scopes.push(targetScope);

        return _jquery.default.trim(scopes.join(' '));
      }
    }, {
      key: 'getScopes',
      value: function getScopes(node) {
        var scopes = [];

        if (node.scope) {
          scopes.push(node.scope);
        }

        if (!node.resetScope && _ceibo.default.parent(node)) {
          scopes = scopes.concat(this.calculateScope(_ceibo.default.parent(node)));
        }

        return scopes;
      }
    }]);

    return Selector;
  }();

  function guardMultiple(items, selector, supportMultiple) {
    (true && !(supportMultiple || items.length <= 1) && Ember.assert('"' + selector + '" matched more than one element. If this is not an error use { multiple: true }', supportMultiple || items.length <= 1));
  }

  /**
   * @public
   *
   * Builds a CSS selector from a target selector and a PageObject or a node in a PageObject, along with optional parameters.
   *
   * @example
   *
   * const component = PageObject.create({ scope: '.component'});
   *
   * buildSelector(component, '.my-element');
   * // returns '.component .my-element'
   *
   * @example
   *
   * const page = PageObject.create({});
   *
   * buildSelector(page, '.my-element', { at: 0 });
   * // returns '.my-element:eq(0)'
   *
   * @example
   *
   * const page = PageObject.create({});
   *
   * buildSelector(page, '.my-element', { contains: "Example" });
   * // returns ".my-element :contains('Example')"
   *
   * @example
   *
   * const page = PageObject.create({});
   *
   * buildSelector(page, '.my-element', { last: true });
   * // returns '.my-element:last'
   *
   * @param {Ceibo} node - Node of the tree
   * @param {string} targetSelector - CSS selector
   * @param {Object} options - Additional options
   * @param {boolean} options.resetScope - Do not use inherited scope
   * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
   * @param {number} options.at - Filter by index using :eq(x) pseudo-class
   * @param {boolean} options.last - Filter by using :last pseudo-class
   * @param {boolean} options.visible - Filter by using :visible pseudo-class
   * @return {string} Fully qualified selector
   */
  function buildSelector(node, targetSelector, options) {
    return new Selector(node, options.scope, targetSelector, options).toString();
  }

  /**
   * @private
   *
   * Trim whitespaces at both ends and normalize whitespaces inside `text`
   *
   * Due to variations in the HTML parsers in different browsers, the text
   * returned may vary in newlines and other white space.
   *
   * @see http://api.jquery.com/text/
   */
  function normalizeText(text) {
    return _jquery.default.trim(text).replace(/\n/g, ' ').replace(/\s\s*/g, ' ');
  }

  function every(jqArray, cb) {
    var arr = jqArray.get();

    return Ember.A(arr).every(function (element) {
      return cb((0, _jquery.default)(element));
    });
  }

  function map(jqArray, cb) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var arr = jqArray.get();

    var values = Ember.A(arr).map(function (element) {
      return cb((0, _jquery.default)(element));
    });

    return options.multiple ? values : values[0];
  }

  /**
   * @public
   *
   * Return the root of a node's tree
   *
   * @param {Ceibo} node - Node of the tree
   * @return {Ceibo} node - Root node of the tree
   */
  function getRoot(node) {
    var parent = _ceibo.default.parent(node);
    var root = node;

    while (parent) {
      root = parent;
      parent = _ceibo.default.parent(parent);
    }

    return root;
  }

  /**
   * @public
   *
   * Return a test context if one was provided during `create()` or via `setContext()`
   *
   * @param {Ceibo} node - Node of the tree
   * @return {Object} `moduleForComponent` test's `this` context, or null
   */
  function getContext(node) {
    var root = getRoot(node);
    var context = root.context;


    if ((typeof context === 'undefined' ? 'undefined' : _typeof(context)) === 'object' && context !== null && typeof context.$ === 'function') {
      return context;
    }

    context = (0, _compatibility.getContext)();
    if ((typeof context === 'undefined' ? 'undefined' : _typeof(context)) === 'object' && context !== null && typeof context.$ === 'function' && !context.element) {
      return context;
    }

    return null;
  }

  function getAllValuesForProperty(node, property) {
    var iterator = node;
    var values = [];

    while (Ember.isPresent(iterator)) {
      if (Ember.isPresent(iterator[property])) {
        values.push(iterator[property]);
      }

      iterator = _ceibo.default.parent(iterator);
    }

    return values;
  }

  /**
   * @public
   *
   * Return full scope of node (includes all ancestors scopes)
   *
   * @param {Ceibo} node - Node of the tree
   * @return {string} Full scope of node
   */
  function fullScope(node) {
    var scopes = getAllValuesForProperty(node, 'scope');

    return scopes.reverse().join(' ');
  }

  /**
   * @public
   *
   * Returns the value of property defined on the closest ancestor of given
   * node.
   *
   * @param {Ceibo} node - Node of the tree
   * @param {string} property - Property to look for
   * @return {?Object} The value of property on closest node to the given node
   */
  function findClosestValue(node, property) {
    if (Ember.isPresent(node[property])) {
      return node[property];
    }

    var parent = _ceibo.default.parent(node);

    if (Ember.isPresent(parent)) {
      return findClosestValue(parent, property);
    }
  }

  /**
   * @public
   *
   * Returns a boolean indicating whether an object contains a given property.
   * The path to a nested property should be indicated by a dot-separated string.
   *
   * @param {Object} object - object to check for the target property
   * @param {string} pathToProp - dot-separated path to property
   * @return {Boolean}
   */
  function objectHasProperty(object, pathToProp) {
    var pathSegments = pathToProp.split('.');

    for (var i = 0; i < pathSegments.length; i++) {
      var key = pathSegments[i];
      if (object === null || object === undefined || !object.hasOwnProperty(key)) {
        return false;
      } else {
        object = object[key];
      }
    }

    return true;
  }

  /**
   * @public
   *
   * Returns the value of an object property. If the property is a function,
   * the return value is that function bound to its "owner."
   *
   * @param {Object} object - object on which to look up the target property
   * @param {string} pathToProp - dot-separated path to property
   * @return {Boolean|String|Number|Function|Null|Undefined} - value of property
   */
  function getProperty(object, pathToProp) {
    var pathSegments = pathToProp.split('.');

    if (pathSegments.length === 1) {
      var _value = Ember.get(object, pathToProp);
      return typeof _value === 'function' ? _value.bind(object) : _value;
    }

    var pathToPropOwner = pathSegments.slice(0, -1).join('.');
    var propOwner = Ember.get(object, pathToPropOwner);

    if (propOwner === null || propOwner === undefined) {
      return undefined;
    }

    var propKey = pathSegments[pathSegments.length - 1];
    var value = Ember.get(propOwner, propKey);

    return typeof value === 'function' ? value.bind(propOwner) : value;
  }

  function isPageObject(property) {
    if (property && (typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'object') {
      var meta = _ceibo.default.meta(property);
      return meta && meta.__poDef__;
    } else {
      return false;
    }
  }

  function getPageObjectDefinition(node) {
    if (!isPageObject(node)) {
      throw new Error('cannot get the page object definition from a node that is not a page object');
    } else {
      return _ceibo.default.meta(node).__poDef__;
    }
  }

  function storePageObjectDefinition(node, definition) {
    _ceibo.default.meta(node).__poDef__ = definition;
  }
});
define('ember-cli-page-object/test-support/create', ['exports', 'ceibo', 'ember-cli-page-object/test-support/-private/context', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/properties/visitable', 'ember-cli-page-object/test-support/-private/dsl'], function (exports, _ceibo, _context, _helpers, _visitable, _dsl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.create = create;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  //
  // When running RFC268 tests, we have to play some tricks to support chaining.
  // RFC268 helpers don't wait for things to settle by defaut, but return a
  // promise that will resolve when everything settles. So this means
  //
  // page.clickOn('.foo');
  // page.clickOn('.bar');
  //
  // will not wait after either of the clicks, whereas
  //
  // await page.clickOn('.foo');
  // await page.clickOn('.bar');
  //
  // will wait after each of them. However, to preserve chaining behavior,
  //
  // page
  //   .clickOn('.foo')
  //   .clickOn('.bar');
  //
  // would need to wait between the clicks. However, if `clickOn()` just returned
  // `page` this would be impossible because then it would be exactly the same as
  // the first example, which must not wait between clicks.
  //
  // So the solution is to return something other than `page` from,
  // `page.clickOn('.foo')`, but something that behaves just like `page` except
  // waits for things to settle before invoking any async methods.
  //
  // To accomplish this, when building our Ceibo tree, we build a mirror copy of
  // it (the "chained tree"). Anytime a chainable method is invoked, instead of
  // returning the node whose method was invoked, we can return its mirror node in
  // the chained tree. Then, anytime an async method is invoked on that node
  // (meaning we are in a chaining scenario), the execution context can recognize
  // it as a chained node and wait before invoking the target method.
  //

  // See https://github.com/san650/ceibo#examples for more info on how Ceibo
  // builders work.

  // This builder builds the primary tree
  function buildObject(node, blueprintKey, blueprint, defaultBuilder) {
    var definition = void 0;

    // to allow page objects to exist in definitions, we store the definition that
    // created the page object, allowing us to substitute a page object with its
    // definition during creation
    if ((0, _helpers.isPageObject)(blueprint)) {
      definition = (0, _helpers.getPageObjectDefinition)(blueprint);
    } else {
      definition = blueprint;
    }
    var blueprintToStore = (0, _helpers.assign)({}, definition);
    //the _chainedTree is an implementation detail that shouldn't make it into the stored
    if (blueprintToStore._chainedTree) {
      delete blueprintToStore._chainedTree;
    }
    blueprint = (0, _helpers.assign)({}, _dsl.default, definition);

    var _defaultBuilder = defaultBuilder(node, blueprintKey, blueprint, defaultBuilder),
        _defaultBuilder2 = _slicedToArray(_defaultBuilder, 2),
        instance = _defaultBuilder2[0],
        blueprintToApply = _defaultBuilder2[1];

    // persist definition once we have an instance
    (0, _helpers.storePageObjectDefinition)(instance, blueprintToStore);

    return [instance, blueprintToApply];
  }

  /**
   * Creates a new PageObject.
   *
   * By default, the resulting PageObject will respond to:
   *
   * - **Actions**: click, clickOn, fillIn, select
   * - **Predicates**: contains, isHidden, isPresent, isVisible
   * - **Queries**: text
   *
   * `definition` can include a key `context`, which is an
   * optional integration test `this` context.
   *
   * If a context is passed, it is used by actions, queries, etc.,
   * as the `this` in `this.$()`.
   *
   * If no context is passed, the global Ember acceptence test
   * helpers are used.
   *
   * @example
   *
   * // <div class="title">My title</div>
   *
   * import PageObject, { text } from 'ember-cli-page-object';
   *
   * const page = PageObject.create({
   *   title: text('.title')
   * });
   *
   * assert.equal(page.title, 'My title');
   *
   * @example
   *
   * // <div id="my-page">
   * //   My super text
   * //   <button>Press Me</button>
   * // </div>
   *
   * const page = PageObject.create({
   *   scope: '#my-page'
   * });
   *
   * assert.equal(page.text, 'My super text');
   * assert.ok(page.contains('super'));
   * assert.ok(page.isPresent);
   * assert.ok(page.isVisible);
   * assert.notOk(page.isHidden);
   * assert.equal(page.value, 'my input value');
   *
   * // clicks div#my-page
   * page.click();
   *
   * // clicks button
   * page.clickOn('Press Me');
   *
   * // fills an input
   * page.fillIn('name', 'John Doe');
   *
   * // selects an option
   * page.select('country', 'Uruguay');
   *
   * @example Defining path
   *
   * const usersPage = PageObject.create('/users');
   *
   * // visits user page
   * usersPage.visit();
   *
   * const userTasksPage = PageObject.create('/users/tasks', {
   *  tasks: collection({
   *    itemScope: '.tasks li',
   *    item: {}
   *  });
   * });
   *
   * // get user's tasks
   * userTasksPage.visit();
   * userTasksPage.tasks().count
   *
   * @public
   *
   * @param {Object} definition - PageObject definition
   * @param {Object} [definition.context] - A test's `this` context
   * @param {Object} options - [private] Ceibo options. Do not use!
   * @return {PageObject}
   */
  function create(definitionOrUrl, definitionOrOptions, optionsOrNothing) {
    var definition = void 0;
    var url = void 0;
    var options = void 0;

    if (typeof definitionOrUrl === 'string') {
      url = definitionOrUrl;
      definition = definitionOrOptions || {};
      options = optionsOrNothing || {};
    } else {
      url = false;
      definition = definitionOrUrl || {};
      options = definitionOrOptions || {};
    }

    var _definition = definition,
        context = _definition.context;

    // in the instance where the definition is a page object, we must use the stored definition directly
    // or else we will fire off the Ceibo created getters which will error
    definition = (0, _helpers.assign)({}, (0, _helpers.isPageObject)(definition) ? (0, _helpers.getPageObjectDefinition)(definition) : definition);
    delete definition.context;

    if (url) {
      definition.visit = (0, _visitable.visitable)(url);
    }

    // Build the chained tree
    var chainedBuilder = {
      object: buildObject
    };
    var chainedTree = _ceibo.default.create(definition, (0, _helpers.assign)({ builder: chainedBuilder }, options));

    // Attach it to the root in the definition of the primary tree
    definition._chainedTree = {
      isDescriptor: true,

      get: function get() {
        return chainedTree;
      }
    };

    // Build the primary tree
    var builder = {
      object: buildObject
    };

    var page = _ceibo.default.create(definition, (0, _helpers.assign)({ builder: builder }, options));

    if (page) {
      page.render = _context.render;
      page.setContext = _context.setContext;
      page.removeContext = _context.removeContext;

      if (typeof context !== 'undefined') {
        page.setContext(context);
      }
    }

    return page;
  }
});
define('ember-cli-page-object/test-support/extend/find-element-with-assert', ['exports', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findElementWithAssert = findElementWithAssert;


  /**
   * @public
   *
   * Returns a jQuery element matched by a selector built from parameters
   *
   * @example
   *
   * import { findElementWithAssert } from 'ember-cli-page-object/extend';
   *
   * export default function isDisabled(selector, options = {}) {
   *   return {
   *     isDescriptor: true,
   *
   *     get() {
   *       return findElementWithAssert(this, selector, options).is(':disabled');
   *     }
   *   };
   * }
   *
   * @param {Ceibo} pageObjectNode - Node of the tree
   * @param {string} targetSelector - Specific CSS selector
   * @param {Object} options - Additional options
   * @param {boolean} options.resetScope - Do not use inherited scope
   * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
   * @param {number} options.at - Filter by index using :eq(x) pseudo-class
   * @param {boolean} options.last - Filter by using :last pseudo-class
   * @param {boolean} options.visible - Filter by using :visible pseudo-class
   * @param {boolean} options.multiple - Specify if built selector can match multiple elements.
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @param {string} options.pageObjectKey - Used in the error message when the element is not found
   * @return {Object} jQuery object
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function findElementWithAssert(pageObjectNode, targetSelector) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return (0, _execution_context.getExecutionContext)(pageObjectNode).findWithAssert(targetSelector, options);
  }
});
define('ember-cli-page-object/test-support/extend/find-element', ['exports', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findElement = findElement;


  /**
   * @public
   *
   * Returns a jQuery element (can be an empty jQuery result)
   *
   * @example
   *
   * import { findElement } from 'ember-cli-page-object/extend';
   *
   * export default function isDisabled(selector, options = {}) {
   *   return {
   *     isDescriptor: true,
   *
   *     get() {
   *       return findElement(this, selector, options).is(':disabled');
   *     }
   *   };
   * }
   *
   * @param {Ceibo} pageObjectNode - Node of the tree
   * @param {string} targetSelector - Specific CSS selector
   * @param {Object} options - Additional options
   * @param {boolean} options.resetScope - Do not use inherited scope
   * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
   * @param {number} options.at - Filter by index using :eq(x) pseudo-class
   * @param {boolean} options.last - Filter by using :last pseudo-class
   * @param {boolean} options.visible - Filter by using :visible pseudo-class
   * @param {boolean} options.multiple - Specify if built selector can match multiple elements.
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Object} jQuery object
   *
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function findElement(pageObjectNode, targetSelector) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return (0, _execution_context.getExecutionContext)(pageObjectNode).find(targetSelector, options);
  }
});
define('ember-cli-page-object/test-support/extend/index', ['exports', 'ember-cli-page-object/test-support/extend/find-element', 'ember-cli-page-object/test-support/extend/find-element-with-assert', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context', 'ember-cli-page-object/test-support/-private/execution_context/integration-native-events', 'ember-cli-page-object/test-support/-private/execution_context/acceptance-native-events', 'ember-cli-page-object/test-support/-private/execution_context/integration', 'ember-cli-page-object/test-support/-private/execution_context/acceptance'], function (exports, _findElement, _findElementWithAssert, _helpers, _execution_context, _integrationNativeEvents, _acceptanceNativeEvents, _integration, _acceptance) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.useNativeEvents = exports.registerExecutionContext = exports.fullScope = exports.getContext = exports.buildSelector = exports.findElementWithAssert = exports.findElement = undefined;
  Object.defineProperty(exports, 'findElement', {
    enumerable: true,
    get: function () {
      return _findElement.findElement;
    }
  });
  Object.defineProperty(exports, 'findElementWithAssert', {
    enumerable: true,
    get: function () {
      return _findElementWithAssert.findElementWithAssert;
    }
  });
  Object.defineProperty(exports, 'buildSelector', {
    enumerable: true,
    get: function () {
      return _helpers.buildSelector;
    }
  });
  Object.defineProperty(exports, 'getContext', {
    enumerable: true,
    get: function () {
      return _helpers.getContext;
    }
  });
  Object.defineProperty(exports, 'fullScope', {
    enumerable: true,
    get: function () {
      return _helpers.fullScope;
    }
  });


  function useNativeEvents() {
    var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (flag) {
      (0, _execution_context.register)('integration', _integrationNativeEvents.default);
      (0, _execution_context.register)('acceptance', _acceptanceNativeEvents.default);
    } else {
      (0, _execution_context.register)('integration', _integration.default);
      (0, _execution_context.register)('acceptance', _acceptance.default);
    }
  }

  exports.registerExecutionContext = _execution_context.register;
  exports.useNativeEvents = useNativeEvents;
});
define('ember-cli-page-object/test-support/index', ['exports', 'ember-cli-page-object/test-support/extend/find-element', 'ember-cli-page-object/test-support/extend/find-element-with-assert', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/create', 'ember-cli-page-object/test-support/properties/attribute', 'ember-cli-page-object/test-support/properties/blurrable', 'ember-cli-page-object/test-support/properties/click-on-text', 'ember-cli-page-object/test-support/properties/clickable', 'ember-cli-page-object/test-support/properties/collection', 'ember-cli-page-object/test-support/properties/contains', 'ember-cli-page-object/test-support/properties/count', 'ember-cli-page-object/test-support/properties/fillable', 'ember-cli-page-object/test-support/properties/focusable', 'ember-cli-page-object/test-support/properties/has-class', 'ember-cli-page-object/test-support/properties/is', 'ember-cli-page-object/test-support/properties/is-hidden', 'ember-cli-page-object/test-support/properties/is-present', 'ember-cli-page-object/test-support/properties/is-visible', 'ember-cli-page-object/test-support/properties/not-has-class', 'ember-cli-page-object/test-support/properties/property', 'ember-cli-page-object/test-support/properties/text', 'ember-cli-page-object/test-support/properties/triggerable', 'ember-cli-page-object/test-support/properties/value', 'ember-cli-page-object/test-support/properties/visitable'], function (exports, _findElement, _findElementWithAssert, _helpers, _create, _attribute, _blurrable, _clickOnText, _clickable, _collection, _contains, _count, _fillable, _focusable, _hasClass, _is, _isHidden, _isPresent, _isVisible, _notHasClass, _property, _text, _triggerable, _value, _visitable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getContext = exports.buildSelector = exports.findElementWithAssert = exports.findElement = exports.visitable = exports.value = exports.triggerable = exports.text = exports.property = exports.notHasClass = exports.isVisible = exports.isPresent = exports.isHidden = exports.is = exports.hasClass = exports.focusable = exports.selectable = exports.fillable = exports.count = exports.contains = exports.collection = exports.clickable = exports.clickOnText = exports.blurrable = exports.attribute = exports.create = undefined;
  Object.defineProperty(exports, 'findElement', {
    enumerable: true,
    get: function () {
      return _findElement.findElement;
    }
  });
  Object.defineProperty(exports, 'findElementWithAssert', {
    enumerable: true,
    get: function () {
      return _findElementWithAssert.findElementWithAssert;
    }
  });
  Object.defineProperty(exports, 'buildSelector', {
    enumerable: true,
    get: function () {
      return _helpers.buildSelector;
    }
  });
  Object.defineProperty(exports, 'getContext', {
    enumerable: true,
    get: function () {
      return _helpers.getContext;
    }
  });
  exports.create = _create.create;
  exports.attribute = _attribute.attribute;
  exports.blurrable = _blurrable.blurrable;
  exports.clickOnText = _clickOnText.clickOnText;
  exports.clickable = _clickable.clickable;
  exports.collection = _collection.collection;
  exports.contains = _contains.contains;
  exports.count = _count.count;
  exports.fillable = _fillable.fillable;
  var selectable = exports.selectable = _fillable.fillable;
  exports.focusable = _focusable.focusable;
  exports.hasClass = _hasClass.hasClass;
  exports.is = _is.is;
  exports.isHidden = _isHidden.isHidden;
  exports.isPresent = _isPresent.isPresent;
  exports.isVisible = _isVisible.isVisible;
  exports.notHasClass = _notHasClass.notHasClass;
  exports.property = _property.property;
  exports.text = _text.text;
  exports.triggerable = _triggerable.triggerable;
  exports.value = _value.value;
  exports.visitable = _visitable.visitable;
  exports.default = {
    attribute: _attribute.attribute,
    blurrable: _blurrable.blurrable,
    clickOnText: _clickOnText.clickOnText,
    clickable: _clickable.clickable,
    collection: _collection.collection,
    contains: _contains.contains,
    count: _count.count,
    create: _create.create,
    fillable: _fillable.fillable,
    focusable: _focusable.focusable,
    hasClass: _hasClass.hasClass,
    is: _is.is,
    isHidden: _isHidden.isHidden,
    isPresent: _isPresent.isPresent,
    isVisible: _isVisible.isVisible,
    notHasClass: _notHasClass.notHasClass,
    property: _property.property,
    selectable: selectable,
    text: _text.text,
    value: _value.value,
    visitable: _visitable.visitable,
    triggerable: _triggerable.triggerable
  };
});
define('ember-cli-page-object/test-support/macros/alias', ['exports', 'ember-cli-page-object/test-support/-private/better-errors', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/action', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _betterErrors, _helpers, _action, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.alias = alias;


  var ALIASED_PROP_NOT_FOUND = 'PageObject does not contain aliased property';

  /**
   * Returns the value of some other property on the PageObject.
   *
   * @example
   *
   * import { create } from 'ember-cli-page-object';
   * import { alias } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   submitButton: {
   *     scope: '.submit-button'
   *   },
   *   submit: alias('submitButton.click')
   * });
   *
   * // calls `page.submitButton.click`
   * page.submit();
   *
   * @example
   *
   * import { create } from 'ember-cli-page-object';
   * import { alias } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   submitButton: {
   *     scope: '.submit-button'
   *   },
   *   isSubmitButtonVisible: alias('submitButton.isVisible')
   * });
   *
   * // checks value of `page.submitButton.isVisible`
   * assert.ok(page.isSubmitButtonVisible);
   *
   * @example
   *
   * import { create } from 'ember-cli-page-object';
   * import { alias } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   form: {
   *     input: {
   *       scope: 'input'
   *     },
   *     submitButton: {
   *       scope: '.submit-button'
   *     }
   *   },
   *   fillFormInput: alias('form.input.fillIn', { chainable: true }),
   *   submitForm: alias('form.submitButton.click', { chainable: true })
   * });
   *
   * // executes `page.form.input.fillIn` then `page.form.submitButton.click`
   * // and causes both methods to return `page` (instead of `page.form.input`
   * // and `page.form.submitButton` respectively) so that the aliased methods
   * // can be chained off `page`.
   * page
   *   .fillFormInput('foo')
   *   .submitForm();
   *
   * @public
   *
   * @param {string} pathToProp - dot-separated path to a property specified on the PageObject
   * @param {Object} options
   * @param {Boolean} options.chainable - when this is true, an aliased
   * method returns the PageObject node on which the alias is defined, rather
   * than the PageObject node on which the aliased property is defined.
   * @return {Descriptor}
   *
   * @throws Will throw an error if the PageObject does not have the specified property.
   */
  function alias(pathToProp) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        if (!(0, _helpers.objectHasProperty)(this, pathToProp)) {
          (0, _betterErrors.throwBetterError)(this, key, ALIASED_PROP_NOT_FOUND + ' `' + pathToProp + '`.');
        }

        var value = (0, _helpers.getProperty)(this, pathToProp);

        if (typeof value !== 'function' || !options.chainable) {
          return value;
        }

        return function () {
          // We can't just return value(...args) here because if the alias points
          // to a property on a child node, then the return value would be that
          // child node rather than this node.
          value.apply(undefined, arguments);

          return typeof (0, _execution_context.getExecutionContext)(this).andThen === 'function' ? this : (0, _action.chainable)(this);
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/macros/getter', ['exports', 'ember-cli-page-object/test-support/-private/better-errors'], function (exports, _betterErrors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getter = getter;


  var NOT_A_FUNCTION_ERROR = 'Argument passed to `getter` must be a function.';

  /**
   * Creates a Descriptor whose value is determined by the passed-in function.
   * The passed-in function must not be bound and must not be an arrow function,
   * as this would prevent it from running with the correct context.
   *
   * @example
   *
   * // <input type="text">
   * // <button disabled>Submit</button>
   *
   * import { create, value, property } from 'ember-cli-page-object';
   * import { getter } from 'ember-cli-page-object/macros';
   *
   * const page = create({
   *   inputValue: value('input'),
   *   isSubmitButtonDisabled: property('disabled', 'button'),
   *
   *   // with the `getter` macro
   *   isFormEmpty: getter(function() {
   *     return !this.inputValue && this.isSubmitButtonDisabled;
   *   }),
   *
   *   // without the `getter` macro
   *   _isFormEmpty: {
   *     isDescriptor: true,
   *     get() {
   *       return !this.inputValue && this.isSubmitButtonDisabled;
   *     }
   *   }
   * });
   *
   * // checks the value returned by the function passed into `getter`
   * assert.ok(page.isFormEmpty);
   *
   * @public
   *
   * @param {Function} fn - determines what value is returned when the Descriptor is accessed
   * @return {Descriptor}
   *
   * @throws Will throw an error if a function is not passed in as the first argument
   */
  function getter(fn) {
    return {
      isDescriptor: true,

      get: function get(key) {
        if (typeof fn !== 'function') {
          (0, _betterErrors.throwBetterError)(this, key, NOT_A_FUNCTION_ERROR);
        }

        return fn.call(this, key);
      }
    };
  }
});
define('ember-cli-page-object/test-support/macros/index', ['exports', 'ember-cli-page-object/test-support/macros/alias', 'ember-cli-page-object/test-support/macros/getter'], function (exports, _alias, _getter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'alias', {
    enumerable: true,
    get: function () {
      return _alias.alias;
    }
  });
  Object.defineProperty(exports, 'getter', {
    enumerable: true,
    get: function () {
      return _getter.getter;
    }
  });
  exports.default = 1;
});
define("ember-cli-page-object/test-support/properties/as", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.as = as;
  /**
   * @public
   *
   * Allow to perform operations on intermediate results within the chain.
   *
   * Useful for grouping what's being tested.
   *
   * @example
   * page.users(1).as(user => {
   *   assert.equal(user.name, 'John');
   *   assert.equal(user.lastName, 'Doe');
   *   assert.equal(user.email, 'john@doe');
   * });
   *
   * page.users(2).as(user => {
   *   assert.equal(user.name, 'John');
   *   assert.equal(user.lastName, 'Doe');
   *   assert.equal(user.email, 'john@doe');
   * });
   *
   * page.users(3).as(user => {
   *   assert.equal(user.name, 'John');
   *   assert.equal(user.lastName, 'Doe');
   *   assert.equal(user.email, 'john@doe');
   * });
   *
   * @example
   * // Lorem <span>ipsum <strong>dolor</strong></span>
   *
   * let page = create({
   *   scope: 'span',
   *   foo: {
   *     bar: {
   *       scope: 'strong'
   *     }
   *   }
   * });
   *
   * page.foo.bar.as(element => {
   *   assert.equal(element.text, 'dolor');
   * });
   *
   * @param {function} callback - Function to be called with the current object as the parameter
   * @return {object} this
   *
   */
  function as(callback) {
    callback(this);
    return this;
  }
});
define('ember-cli-page-object/test-support/properties/attribute', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.attribute = attribute;


  /**
   * @public
   *
   * Returns the value of an attribute from the matched element, or an array of
   * values from multiple matched elements.
   *
   * @example
   * // <input placeholder="a value">
   *
   * import { create, attribute } from 'ember-cli-page-object';
   *
   * const page = create({
   *   inputPlaceholder: attribute('placeholder', 'input')
   * });
   *
   * assert.equal(page.inputPlaceholder, 'a value');
   *
   * @example
   *
   * // <input placeholder="a value">
   * // <input placeholder="other value">
   *
   * import { create, attribute } from 'ember-cli-page-object';
   *
   * const page = create({
   *   inputPlaceholders: attribute('placeholder', ':input', { multiple: true })
   * });
   *
   * assert.deepEqual(page.inputPlaceholders, ['a value', 'other value']);
   *
   * @example
   *
   * // <div><input></div>
   * // <div class="scope"><input placeholder="a value"></div>
   * // <div><input></div>
   *
   * import { create, attribute } from 'ember-cli-page-object';
   *
   * const page = create({
   *   inputPlaceholder: attribute('placeholder', ':input', { scope: '.scope' })
   * });
   *
   * assert.equal(page.inputPlaceholder, 'a value');
   *
   * @example
   *
   * // <div><input></div>
   * // <div class="scope"><input placeholder="a value"></div>
   * // <div><input></div>
   *
   * import { create, attribute } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: 'scope',
   *   inputPlaceholder: attribute('placeholder', ':input')
   * });
   *
   * assert.equal(page.inputPlaceholder, 'a value');
   *
   * @public
   *
   * @param {string} attributeName - Name of the attribute to get
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.multiple - If set, the function will return an array of values
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function attribute(attributeName, selector) {
    var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElementWithAssert)(this, selector, options);

        return (0, _helpers.map)(elements, function (element) {
          return element.attr(attributeName);
        }, options);
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/blurrable', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _helpers, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.blurrable = blurrable;


  /**
   *
   * Blurs element matched by selector.
   *
   * @example
   *
   * // <input class="name">
   * // <input class="email">
   *
   * import { create, blurrable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   blur: blurrable('.name')
   * });
   *
   * // blurs on element with selector '.name'
   * page.blur();
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * import { create, blurrable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   blur: blurrable('.name', { scope: '.scope' })
   * });
   *
   * // blurs on element with selector '.scope .name'
   * page.blur();
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * import { create, blurrable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   blur: blurrable('.name')
   * });
   *
   * // blurs on element with selector '.scope .name'
   * page.blur();
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element which will be blurred
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
  */
  function blurrable(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        return function () {
          var executionContext = (0, _execution_context.getExecutionContext)(this);
          var options = (0, _helpers.assign)({ pageObjectKey: key + '()' }, userOptions);

          return executionContext.runAsync(function (context) {
            return context.blur(selector, options);
          });
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/click-on-text', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context', 'ember-cli-page-object/test-support/properties/click-on-text/helpers'], function (exports, _helpers, _execution_context, _helpers2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.clickOnText = clickOnText;


  /**
   * Clicks on an element containing specified text.
   *
   * The element can either match a specified selector,
   * or be inside an element matching the specified selector.
   *
   * @example
   *
   * // <fieldset>
   * //  <button>Lorem</button>
   * //  <button>Ipsum</button>
   * // </fieldset>
   *
   * import { create, clickOnText } from 'ember-cli-page-object';
   *
   * const page = create({
   *   clickOnFieldset: clickOnText('fieldset'),
   *   clickOnButton: clickOnText('button')
   * });
   *
   * // queries the DOM with selector 'fieldset :contains("Lorem"):last'
   * page.clickOnFieldset('Lorem');
   *
   * // queries the DOM with selector 'button:contains("Ipsum")'
   * page.clickOnButton('Ipsum');
   *
   * @example
   *
   * // <div class="scope">
   * //   <fieldset>
   * //    <button>Lorem</button>
   * //    <button>Ipsum</button>
   * //   </fieldset>
   * // </div>
   *
   * import { create, clickOnText } from 'ember-cli-page-object';
   *
   * const page = create({
   *   clickOnFieldset: clickOnText('fieldset', { scope: '.scope' }),
   *   clickOnButton: clickOnText('button', { scope: '.scope' })
   * });
   *
   * // queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
   * page.clickOnFieldset('Lorem');
   *
   * // queries the DOM with selector '.scope button:contains("Ipsum")'
   * page.clickOnButton('Ipsum');
   *
   * @example
   *
   * // <div class="scope">
   * //   <fieldset>
   * //    <button>Lorem</button>
   * //    <button>Ipsum</button>
   * //   </fieldset>
   * // </div>
   *
   * import { create, clickOnText } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   clickOnFieldset: clickOnText('fieldset'),
   *   clickOnButton: clickOnText('button')
   * });
   *
   * // queries the DOM with selector '.scope fieldset :contains("Lorem"):last'
   * page.clickOnFieldset('Lorem');
   *
   * // queries the DOM with selector '.scope button:contains("Ipsum")'
   * page.clickOnButton('Ipsum');
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element in which to look for text
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.visible - Make the action to raise an error if the element is not visible
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */
  function clickOnText(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        return function (textToClick) {
          var _this = this;

          var executionContext = (0, _execution_context.getExecutionContext)(this);
          var options = (0, _helpers.assign)({ pageObjectKey: key + '("' + textToClick + '")', contains: textToClick }, userOptions);

          return executionContext.runAsync(function (context) {
            var fullSelector = (0, _helpers2.buildSelector)(_this, context, selector, options);
            var container = options.testContainer || (0, _helpers.findClosestValue)(_this, 'testContainer');

            context.assertElementExists(fullSelector, options);

            return context.click(fullSelector, container, options);
          });
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/click-on-text/helpers', ['exports', 'ember-cli-page-object/test-support/-private/helpers'], function (exports, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.buildSelector = buildSelector;


  function childSelector(pageObjectNode, context, selector, options) {
    // Suppose that we have something like `<form><button>Submit</button></form>`
    // In this case <form> and <button> elements contains "Submit" text, so, we'll
    // want to __always__ click on the __last__ element that contains the text.
    var selectorWithSpace = (selector || '') + ' ';
    var opts = (0, _helpers.assign)({ last: true, multiple: true }, options);

    if (context.find(selectorWithSpace, opts).length) {
      return (0, _helpers.buildSelector)(pageObjectNode, selectorWithSpace, opts);
    }
  }

  function buildSelector(pageObjectNode, context, selector, options) {
    var childSel = childSelector(pageObjectNode, context, selector, options);

    if (childSel) {
      return childSel;
    } else {
      return (0, _helpers.buildSelector)(pageObjectNode, selector, options);
    }
  }
});
define('ember-cli-page-object/test-support/properties/clickable', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _helpers, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.clickable = clickable;


  /**
   * Clicks elements matched by a selector.
   *
   * @example
   *
   * // <button class="continue">Continue<button>
   * // <button>Cancel</button>
   *
   * import { create, clickable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   continue: clickable('button.continue')
   * });
   *
   * // clicks on element with selector 'button.continue'
   * page.continue();
   *
   * @example
   *
   * // <div class="scope">
   * //   <button>Continue<button>
   * // </div>
   * // <button>Cancel</button>
   *
   * import { create, clickable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   continue: clickable('button.continue', { scope: '.scope' })
   * });
   *
   * // clicks on element with selector '.scope button.continue'
   * page.continue();
   *
   * @example
   *
   * // <div class="scope">
   * //   <button>Continue<button>
   * // </div>
   * // <button>Cancel</button>
   *
   * import { create, clickable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   continue: clickable('button.continue')
   * });
   *
   * // clicks on element with selector '.scope button.continue'
   * page.continue();
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to click
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.visible - Make the action to raise an error if the element is not visible
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */
  function clickable(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        return function () {
          var _this = this;

          var executionContext = (0, _execution_context.getExecutionContext)(this);
          var options = (0, _helpers.assign)({ pageObjectKey: key + '()' }, userOptions);

          return executionContext.runAsync(function (context) {
            var fullSelector = (0, _helpers.buildSelector)(_this, selector, options);
            var container = options.testContainer || (0, _helpers.findClosestValue)(_this, 'testContainer');

            context.assertElementExists(fullSelector, options);

            return context.click(fullSelector, container, options);
          });
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/collection', ['exports', 'ember-cli-page-object/test-support/properties/collection/main', 'ember-cli-page-object/test-support/properties/collection/legacy'], function (exports, _main, _legacy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.collection = collection;


  /**
   *  <div class="alert alert-warning" role="alert">
   *   <strong>Note:</strong> v1.14.x introduces the new collection API.
   *   You can see the legacy collection API in the <a href="/docs/v1.13.x/api/collection">v1.13.x docs</a>
   * </div>
   *
   * Creates a enumerable that represents a collection of items. The collection is zero-indexed
   * and has the following public methods and properties:
   *
   * - `length` - The number of items in the collection.
   * - `objectAt()` - Returns the page for the item at the specified index.
   * - `filter()` - Filters the items in the array and returns the ones which match the predicate function.
   * - `filterBy()` - Filters the items of the array by the specified property, returning all that are truthy or that match an optional value.
   * - `forEach()` - Runs a function for each item in the collection
   * - `map()` - maps over the elements of the collection
   * - `mapBy()` - maps over the elements of the collecton by the specified property
   * - `find()` - finds first item of the array with assert by specified function
   * - `findBy()` - finds first item of the array with assert by property
   * - `toArray()` - returns an array containing all the items in the collection
   * - `[Symbol.iterator]()` - if supported by the environment, this allows the collection to be iterated with `for/of` and spread with `...` like a normal array
   *
   * @example
   *
   * // <table>
   * //   <tbody>
   * //     <tr>
   * //       <td>Mary<td>
   * //       <td>Watson</td>
   * //     </tr>
   * //     <tr>
   * //       <td>John<td>
   * //       <td>Doe</td>
   * //     </tr>
   * //   </tbody>
   * // </table>
   *
   * import { create, collection, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   users: collection('table tr', {
   *     firstName: text('td', { at: 0 }),
   *     lastName: text('td', { at: 1 })
   *   })
   * });
   *
   * assert.equal(page.users.length, 2);
   * assert.equal(page.users.objectAt(1).firstName, 'John');
   * assert.equal(page.users.objectAt(1).lastName, 'Doe');
   *
   * @example
   *
   * // <div class="admins">
   * //   <table>
   * //     <tbody>
   * //       <tr>
   * //         <td>Mary<td>
   * //         <td>Watson</td>
   * //       </tr>
   * //       <tr>
   * //         <td>John<td>
   * //         <td>Doe</td>
   * //       </tr>
   * //     </tbody>
   * //   </table>
   * // </div>
   *
   * // <div class="normal">
   * //   <table>
   * //   </table>
   * // </div>
   *
   * import { create, collection, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.admins',
   *
   *   users: collection('table tr', {
   *     firstName: text('td', { at: 0 }),
   *     lastName: text('td', { at: 1 })
   *   })
   * });
   *
   * assert.equal(page.users.length, 2);
   *
   * @example
   *
   * // <table>
   * //   <caption>User Index</caption>
   * //   <tbody>
   * //     <tr>
   * //         <td>Mary<td>
   * //         <td>Watson</td>
   * //       </tr>
   * //       <tr>
   * //         <td>John<td>
   * //         <td>Doe</td>
   * //       </tr>
   * //   </tbody>
   * // </table>
   *
   * import { create, collection, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: 'table',
   *
   *   users: collection('tr', {
   *     firstName: text('td', { at: 0 }),
   *     lastName: text('td', { at: 1 }),
   *   })
   * });
   *
   * let john = page.users.filter((item) => item.firstName === 'John' )[0];
   * assert.equal(john.lastName, 'Doe');
   *
   * @example
   * <caption>If the browser you run tests [supports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility) Proxy, you can use array accessors to access elements by index</caption>
   *
   * // <table>
   * //   <tr>
   * //       <td>Mary<td>
   * //   </tr>
   * //   <tr>
   * //     <td>John<td>
   * //   </tr>
   * // </table>
   *
   * import { create, collection } from 'ember-cli-page-object';
   *
   * const page = create({
   *   users: collection('tr')
   * });
   *
   * // This only works on browsers that support `Proxy`
   * assert.equal(page.users[0].text, 'Mary');
   * assert.equal(page.users[1].text, 'John');
   *
   *
   * @param {String} scopeOrDefinition - Selector to define the items of the collection
   * @param {Object} [definitionOrNothing] - Object with the definition of item properties
   * @param {boolean} definition.resetScope - Override parent's scope
   * @return {Descriptor}
   */
  function collection(scopeOrDefinition, definitionOrNothing) {

    if (typeof scopeOrDefinition === 'string') {
      return (0, _main.collection)(scopeOrDefinition, definitionOrNothing);
    }

    Ember.deprecate('You are currently using the legacy collection API, check the documentation to see how to upgrade to the new API.', false, {
      id: 'ember-cli-page-object.old-collection-api',
      until: '2.0.0',
      url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#old-collection-api'
    });

    (true && Ember.warn('Legacy page object collection definition is invalid. Please, make sure you include a `itemScope` selector.', scopeOrDefinition.itemScope, {
      id: 'ember-cli-page-object.legacy-collection-missing-item-scope'
    }));


    return (0, _legacy.collection)(scopeOrDefinition);
  }
});
define('ember-cli-page-object/test-support/properties/collection/legacy', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/create', 'ember-cli-page-object/test-support/properties/count', 'ceibo'], function (exports, _helpers, _create, _count, _ceibo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.collection = collection;


  var arrayDelegateMethods = ['map', 'filter', 'mapBy', 'filterBy', 'forEach'];

  function merge(target) {
    for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      objects[_key - 1] = arguments[_key];
    }

    objects.forEach(function (o) {
      return (0, _helpers.assign)(target, o);
    });

    return target;
  }

  function generateEnumerable(node, definition, item, key) {
    var enumerable = merge({}, definition);

    if (typeof enumerable.count === 'undefined') {
      enumerable.count = (0, _count.count)(item.itemScope);
    }

    if (typeof enumerable.toArray === 'undefined') {
      enumerable.toArray = toArrayMethod(node, item, key);
      arrayDelegateMethods.forEach(function (method) {
        return delegateToArray(enumerable, method);
      });
    }

    var collection = (0, _create.create)(enumerable, { parent: node });

    if (typeof Symbol !== 'undefined' && Symbol.iterator) {
      collection[Symbol.iterator] = iteratorMethod;
    }

    // Change the key of the root node
    _ceibo.default.meta(collection).key = key + '()';

    return collection;
  }

  function generateItem(node, index, definition, key) {
    var filters = merge({}, { scope: definition.scope, at: index });
    var scope = (0, _helpers.buildSelector)({}, definition.itemScope, filters);

    var tree = (0, _create.create)(merge({
      testContainer: definition.testContainer
    }, definition.item, {
      scope: scope,
      resetScope: definition.resetScope
    }), { parent: node });

    // Change the key of the root node
    _ceibo.default.meta(tree).key = key + '(' + index + ')';

    return tree;
  }

  function toArrayMethod(node, definition, key) {
    return function () {
      var array = Ember.A();
      var index = void 0;
      var count = void 0;

      for (index = 0, count = this.count; index < count; index++) {
        array.push(generateItem(node, index, definition, key));
      }

      return array;
    };
  }

  function delegateToArray(enumerable, method) {
    if (typeof enumerable[method] === 'undefined') {
      enumerable[method] = function () {
        var _toArray;

        return (_toArray = this.toArray())[method].apply(_toArray, arguments);
      };
    }
  }

  function iteratorMethod() {
    var i = 0;
    var items = this.toArray();
    var next = function next() {
      return { done: i >= items.length, value: items[i++] };
    };

    return { next: next };
  }

  function collection(definition) {
    definition = (0, _helpers.assign)({}, definition);

    var item = {
      scope: definition.scope,
      itemScope: definition.itemScope,
      resetScope: definition.resetScope,
      item: definition.item,
      testContainer: definition.testContainer
    };

    delete definition.item;
    delete definition.itemScope;

    return {
      isDescriptor: true,

      get: function get(key) {
        var _this = this;

        return function (index) {
          if (typeof index === 'number') {
            return generateItem(_this, index, item, key);
          } else {
            return generateEnumerable(_this, definition, item, key);
          }
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/collection/main', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/create', 'ember-cli-page-object/test-support/properties/count', 'ceibo', 'ember-cli-page-object/test-support/-private/better-errors'], function (exports, _helpers, _create, _count, _ceibo, _betterErrors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Collection = undefined;
  exports.collection = collection;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Collection = exports.Collection = function () {
    function Collection(scope, definition, parent, key) {
      _classCallCheck(this, Collection);

      this.scope = scope;
      this.definition = definition || {};
      this.parent = parent;
      this.key = key;

      this._itemCounter = (0, _create.create)({
        count: (0, _count.count)(scope, {
          resetScope: this.definition.resetScope,
          testContainer: this.definition.testContainer
        })
      }, { parent: parent });

      this._items = [];
    }

    _createClass(Collection, [{
      key: 'objectAt',
      value: function objectAt(index) {
        var key = this.key;


        if (typeof this._items[index] === 'undefined') {
          var scope = this.scope,
              definition = this.definition,
              parent = this.parent;

          var itemScope = (0, _helpers.buildSelector)({}, scope, { at: index });

          var finalizedDefinition = (0, _helpers.assign)({}, definition);

          finalizedDefinition.scope = itemScope;

          var tree = (0, _create.create)(finalizedDefinition, { parent: parent });

          // Change the key of the root node
          _ceibo.default.meta(tree).key = key + '[' + index + ']';

          this._items[index] = tree;
        }

        return this._items[index];
      }
    }, {
      key: 'filter',
      value: function filter() {
        var _toArray;

        return (_toArray = this.toArray()).filter.apply(_toArray, arguments);
      }
    }, {
      key: 'filterBy',
      value: function filterBy() {
        var _toArray2;

        return (_toArray2 = this.toArray()).filterBy.apply(_toArray2, arguments);
      }
    }, {
      key: 'forEach',
      value: function forEach() {
        var _toArray3;

        return (_toArray3 = this.toArray()).forEach.apply(_toArray3, arguments);
      }
    }, {
      key: 'map',
      value: function map() {
        var _toArray4;

        return (_toArray4 = this.toArray()).map.apply(_toArray4, arguments);
      }
    }, {
      key: 'mapBy',
      value: function mapBy() {
        var _toArray5;

        return (_toArray5 = this.toArray()).mapBy.apply(_toArray5, arguments);
      }
    }, {
      key: 'findOneBy',
      value: function findOneBy() {
        var _toArray6;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var elements = (_toArray6 = this.toArray()).filterBy.apply(_toArray6, args);
        this._assertFoundElements.apply(this, [elements].concat(args));
        return elements[0];
      }
    }, {
      key: 'findOne',
      value: function findOne() {
        var _toArray7;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var elements = (_toArray7 = this.toArray()).filter.apply(_toArray7, args);
        this._assertFoundElements.apply(this, [elements].concat(args));
        return elements[0];
      }
    }, {
      key: '_assertFoundElements',
      value: function _assertFoundElements(elements) {
        var argsToText = (arguments.length <= 1 ? 0 : arguments.length - 1) === 1 ? 'condition' : (arguments.length <= 1 ? undefined : arguments[1]) + ': "' + (arguments.length <= 2 ? undefined : arguments[2]) + '"';
        if (elements.length > 1) {
          (0, _betterErrors.throwBetterError)(this.parent, this.key, elements.length + ' elements found by ' + argsToText + ', but expected 1');
        }

        if (elements.length === 0) {
          (0, _betterErrors.throwBetterError)(this.parent, this.key, 'cannot find element by ' + argsToText);
        }
      }
    }, {
      key: 'toArray',
      value: function toArray() {
        var length = this.length;


        var array = Ember.A();

        for (var i = 0; i < length; i++) {
          array.push(this.objectAt(i));
        }

        return array;
      }
    }, {
      key: 'length',
      get: function get() {
        return this._itemCounter.count;
      }
    }]);

    return Collection;
  }();

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    Collection.prototype[Symbol.iterator] = function () {
      var i = 0;
      var items = this.toArray();
      var next = function next() {
        return { done: i >= items.length, value: items[i++] };
      };

      return { next: next };
    };
  }

  function proxyIfSupported(instance) {
    if (window.Proxy) {
      return new window.Proxy(instance, {
        get: function get(target, name) {
          if (typeof name === 'number' || typeof name === 'string') {
            var index = parseInt(name, 10);

            if (!isNaN(index)) {
              return target.objectAt(index);
            }
          }

          return target[name];
        }
      });
    } else {
      return instance;
    }
  }

  function collection(scope, definition) {

    if ((0, _helpers.isPageObject)(definition)) {
      //extract the stored definition from the page object
      definition = (0, _helpers.getPageObjectDefinition)(definition);
    }
    var descriptor = {
      isDescriptor: true,

      setup: function setup(node, key) {
        // Set the value on the descriptor so that it will be picked up and applied by Ceibo.
        // This does mutate the descriptor, but because `setup` is always called before the
        // value is assigned we are guaranteed to get a new, unique Collection instance each time.
        descriptor.value = proxyIfSupported(new Collection(scope, definition, node, key));
      }
    };

    return descriptor;
  }
});
define('ember-cli-page-object/test-support/properties/contains', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.contains = contains;


  /**
   * Returns a boolean representing whether an element or a set of elements contains the specified text.
   *
   * @example
   *
   * // Lorem <span>ipsum</span>
   *
   * import { create, contains } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanContains: contains('span')
   * });
   *
   * assert.ok(page.spanContains('ipsum'));
   *
   * @example
   *
   * // <span>lorem</span>
   * // <span>ipsum</span>
   * // <span>dolor</span>
   *
   * const page = PageObject.create({
   *   spansContain: PageObject.contains('span', { multiple: true })
   * });
   *
   * // not all spans contain 'lorem'
   * assert.notOk(page.spansContain('lorem'));
   *
   * @example
   *
   * // <span>super text</span>
   * // <span>regular text</span>
   *
   * import { create, contains } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spansContain: contains('span', { multiple: true })
   * });
   *
   * // all spans contain 'text'
   * assert.ok(page.spansContain('text'));
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span>ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * import { create, contains } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanContains: contains('span', { scope: '.scope' })
   * });
   *
   * assert.notOk(page.spanContains('lorem'));
   * assert.ok(page.spanContains('ipsum'));
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span>ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * import { create, contains } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
  
   *   spanContains: contains('span')
   * });
   *
   * assert.notOk(page.spanContains('lorem'));
   * assert.ok(page.spanContains('ipsum'));
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector contain the subtext
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function contains(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        return function (textToSearch) {
          var options = (0, _helpers.assign)({ pageObjectKey: key + '("' + textToSearch + '")' }, userOptions);

          var elements = (0, _extend.findElementWithAssert)(this, selector, options);

          return (0, _helpers.every)(elements, function (element) {
            return element.text().indexOf(textToSearch) >= 0;
          });
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/count', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.count = count;


  /**
   * @public
   *
   * Returns the number of elements matched by a selector.
   *
   * @example
   *
   * // <span>1</span>
   * // <span>2</span>
   *
   * import { create, count } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanCount: count('span')
   * });
   *
   * assert.equal(page.spanCount, 2);
   *
   * @example
   *
   * // <div>Text</div>
   *
   * import { create, count } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanCount: count('span')
   * });
   *
   * assert.equal(page.spanCount, 0);
   *
   * @example
   *
   * // <div><span></span></div>
   * // <div class="scope"><span></span><span></span></div>
   *
   * import { create, count } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanCount: count('span', { scope: '.scope' })
   * });
   *
   * assert.equal(page.spanCount, 2)
   *
   * @example
   *
   * // <div><span></span></div>
   * // <div class="scope"><span></span><span></span></div>
   *
   * import { create, count } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   spanCount: count('span')
   * });
   *
   * assert.equal(page.spanCount, 2)
   *
   * @example
   *
   * // <div><span></span></div>
   * // <div class="scope"><span></span><span></span></div>
   *
   * import { create, count } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   spanCount: count('span', { resetScope: true })
   * });
   *
   * assert.equal(page.spanCount, 1);
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element or elements to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Add scope
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */
  function count(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        options = (0, _helpers.assign)(options, { multiple: true });

        return (0, _extend.findElement)(this, selector, options).length;
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/fillable', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _helpers, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fillable = fillable;


  /**
   * Alias for `fillable`, which works for inputs, HTML select menus, and
   * contenteditable elements.
   *
   * [See `fillable` for usage examples.](#fillable)
   *
   * @name selectable
   * @function
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to look for text
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */

  /**
   * Fills in an input matched by a selector.
   *
   * @example
   *
   * // <input value="">
   *
   * import { create, fillable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   fillIn: fillable('input')
   * });
   *
   * // result: <input value="John Doe">
   * page.fillIn('John Doe');
   *
   * @example
   *
   * // <div class="name">
   * //   <input value="">
   * // </div>
   * // <div class="last-name">
   * //   <input value= "">
   * // </div>
   *
   * import { create, fillable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   fillInName: fillable('input', { scope: '.name' })
   * });
   *
   * page.fillInName('John Doe');
   *
   * // result
   * // <div class="name">
   * //   <input value="John Doe">
   * // </div>
   *
   * @example
   *
   * // <div class="name">
   * //   <input value="">
   * // </div>
   * // <div class="last-name">
   * //   <input value= "">
   * // </div>
   *
   * import { create, fillable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: 'name',
   *   fillInName: fillable('input')
   * });
   *
   * page.fillInName('John Doe');
   *
   * // result
   * // <div class="name">
   * //   <input value="John Doe">
   * // </div>
   *
   * @example <caption>Filling different inputs with the same property</caption>
   *
   * // <input id="name">
   * // <input name="lastname">
   * // <input data-test="email">
   * // <textarea aria-label="address"></textarea>
   * // <input placeholder="phone">
   * // <div contenteditable="true" id="bio"></div>
   *
   * const page = create({
   *   fillIn: fillable('input, textarea, [contenteditable]')
   * });
   *
   * page
   *   .fillIn('name', 'Doe')
   *   .fillIn('lastname', 'Doe')
   *   .fillIn('email', 'john@doe')
   *   .fillIn('address', 'A street')
   *   .fillIn('phone', '555-000')
   *   .fillIn('bio', 'The story of <b>John Doe</b>');
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to look for text
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   */
  function fillable(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        return function (contentOrClue, content) {
          var _this = this;

          var clue = void 0;

          if (content === undefined) {
            content = contentOrClue;
          } else {
            clue = contentOrClue;
          }

          var executionContext = (0, _execution_context.getExecutionContext)(this);
          var options = (0, _helpers.assign)({ pageObjectKey: key + '()' }, userOptions);

          return executionContext.runAsync(function (context) {
            var fullSelector = (0, _helpers.buildSelector)(_this, selector, options);
            var container = options.testContainer || (0, _helpers.findClosestValue)(_this, 'testContainer');

            if (clue) {
              fullSelector = ['input', 'textarea', 'select', '[contenteditable]'].map(function (tag) {
                return [fullSelector + ' ' + tag + '[data-test="' + clue + '"]', fullSelector + ' ' + tag + '[aria-label="' + clue + '"]', fullSelector + ' ' + tag + '[placeholder="' + clue + '"]', fullSelector + ' ' + tag + '[name="' + clue + '"]', fullSelector + ' ' + tag + '#' + clue];
              }).reduce(function (total, other) {
                return total.concat(other);
              }, []).join(',');
            }

            context.assertElementExists(fullSelector, options);

            return context.fillIn(fullSelector, container, options, content);
          });
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/focusable', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _helpers, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.focusable = focusable;


  /**
   *
   * Focuses element matched by selector.
   *
   * @example
   *
   * // <input class="name">
   * // <input class="email">
   *
   * import { create, focusable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   focus: focusable('.name')
   * });
   *
   * // focuses on element with selector '.name'
   * page.focus();
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * import { create, focusable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   focus: focusable('.name', { scope: '.scope' })
   * });
   *
   * // focuses on element with selector '.scope .name'
   * page.focus();
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * import { create, focusable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   focus: focusable('.name')
   * });
   *
   * // focuses on element with selector '.scope .name'
   * page.focus();
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element which will be focused
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
  */
  function focusable(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        return function () {
          var executionContext = (0, _execution_context.getExecutionContext)(this);
          var options = (0, _helpers.assign)({ pageObjectKey: key + '()' }, userOptions);

          return executionContext.runAsync(function (context) {
            return context.focus(selector, options);
          });
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/has-class', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.hasClass = hasClass;


  /**
   * Validates if an element or a set of elements have a given CSS class.
   *
   * @example
   *
   * // <em class="lorem"></em><span class="success">Message!</span>
   *
   * import { create, hasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   messageIsSuccess: hasClass('success', 'span')
   * });
   *
   * assert.ok(page.messageIsSuccess);
   *
   * @example
   *
   * // <span class="success"></span>
   * // <span class="error"></span>
   *
   * import { create, hasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   messagesAreSuccessful: hasClass('success', 'span', { multiple: true })
   * });
   *
   * assert.notOk(page.messagesAreSuccessful);
   *
   * @example
   *
   * // <span class="success"></span>
   * // <span class="success"></span>
   *
   * import { create, hasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   messagesAreSuccessful: hasClass('success', 'span', { multiple: true })
   * });
   *
   * assert.ok(page.messagesAreSuccessful);
   *
   * @example
   *
   * // <div>
   * //   <span class="lorem"></span>
   * // </div>
   * // <div class="scope">
   * //   <span class="ipsum"></span>
   * // </div>
   *
   * import { create, hasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanHasClass: hasClass('ipsum', 'span', { scope: '.scope' })
   * });
   *
   * assert.ok(page.spanHasClass);
   *
   * @example
   *
   * // <div>
   * //   <span class="lorem"></span>
   * // </div>
   * // <div class="scope">
   * //   <span class="ipsum"></span>
   * // </div>
   *
   * import { create, hasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   spanHasClass: hasClass('ipsum', 'span')
   * });
   *
   * assert.ok(page.spanHasClass);
   *
   * @public
   *
   * @param {string} cssClass - CSS class to be validated
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector have the CSS class
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function hasClass(cssClass, selector) {
    var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElementWithAssert)(this, selector, options);

        return (0, _helpers.every)(elements, function (element) {
          return element.hasClass(cssClass);
        });
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/is-hidden', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isHidden = isHidden;


  /**
   * Validates if an element or set of elements is hidden or does not exist in the DOM.
   *
   * @example
   *
   * // Lorem <span style="display:none">ipsum</span>
   *
   * import { create, isHidden } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanIsHidden: isHidden('span')
   * });
   *
   * assert.ok(page.spanIsHidden);
   *
   * @example
   *
   * // <span>ipsum</span>
   * // <span style="display:none">dolor</span>
   *
   * import { create, isHidden } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spansAreHidden: isHidden('span', { multiple: true })
   * });
   *
   * // not all spans are hidden
   * assert.notOk(page.spansAreHidden);
   *
   * @example
   *
   * // <span style="display:none">dolor</span>
   * // <span style="display:none">dolor</span>
   *
   * import { create, isHidden } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spansAreHidden: isHidden('span', { multiple: true })
   * });
   *
   * // all spans are hidden
   * assert.ok(page.spansAreHidden);
   *
   * @example
   *
   * // Lorem <strong>ipsum</strong>
   *
   * import { create, isHidden } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanIsHidden: isHidden('span')
   * });
   *
   * // returns true when element doesn't exist in DOM
   * assert.ok(page.spanIsHidden);
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span style="display:none">ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * import { create, isHidden } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scopedSpanIsHidden: isHidden('span', { scope: '.scope' })
   * });
   *
   * assert.ok(page.scopedSpanIsHidden);
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span style="display:none">ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * import { create, isHidden } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   scopedSpanIsHidden: isHidden('span')
   * });
   *
   * assert.ok(page.scopedSpanIsHidden);
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector are hidden
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function isHidden(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElement)(this, selector, options);

        return (0, _helpers.every)(elements, function (element) {
          return element.is(':hidden');
        });
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/is-present', ['exports', 'ember-cli-page-object'], function (exports, _emberCliPageObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isPresent = isPresent;


  /**
   * Validates if any element matching the target selector is rendered in the DOM.
   *
   * `isPresent` vs. `isVisible`:
   *   - Both validate that an element matching the target selector can be found in the DOM
   *   - `isVisible` additionally validates that all matching elements are visible
   *
   * Some uses cases for `isPresent` over `isVisible`:
   *   - To check for the presence of a tag that is never visible in the DOM (e.g. `<meta>`).
   *   - To validate that, even though an element may not currently be visible, it is still in the DOM.
   *   - To validate that an element has not merely been hidden but has in fact been removed from the DOM.
   *
   * @example
   *
   * // Lorem <span>ipsum</span>
   *
   * import { create, isPresent } from 'ember-cli-page-object';
   * 
   * const page = create({
   *   spanIsPresent: isPresent('span')
   * });
   *
   * assert.ok(page.spanIsPresent);
   *
   * @example
   *
   * // <span>ipsum</span>
   * // <span style="display:none">dolor</span>
   *
   * import { create, isPresent } from 'ember-cli-page-object';
   * 
   * const page = create({
   *   spanIsPresent: isPresent('span', { multiple: true })
   * });
   *
   * assert.ok(page.spanIsPresent);
   *
   * @example
   *
   * // <head>
   * //   <meta name='robots' content='noindex'>
   * // </head>
   *
   * import { create, isPresent } from 'ember-cli-page-object';
   * 
   * const page = create({
   *   notIndexed: isPresent(`meta[name='robots'][content='noindex']`, {
   *     testContainer: 'head'
   *   })
   * });
   *
   * assert.ok(page.notIndexed);
   *
   * @example
   *
   * // Lorem <strong>ipsum</strong>
   *
   * import { create, isPresent } from 'ember-cli-page-object';
   * 
   * const page = create({
   *   spanIsPresent: isPresent('span')
   * });
   *
   * // returns false when element doesn't exist in DOM
   * assert.notOk(page.spanIsPresent);
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector are visible
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function isPresent(selector, options) {
    return {
      isDescriptor: true,
      get: function get() {
        return !!(0, _emberCliPageObject.findElement)(this, selector, options).length;
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/is-visible', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isVisible = isVisible;


  /**
   * Validates if an element or set of elements are visible.
   *
   * @example
   *
   * // Lorem <span>ipsum</span>
   *
   * import { create, isVisible } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanIsVisible: isVisible('span')
   * });
   *
   * assert.ok(page.spanIsVisible);
   *
   * @example
   *
   * // <span>ipsum</span>
   * // <span style="display:none">dolor</span>
   *
   * import { create, isVisible } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spansAreVisible: isVisible('span', { multiple: true })
   * });
   *
   * // not all spans are visible
   * assert.notOk(page.spansAreVisible);
   *
   * @example
   *
   * // <span>ipsum</span>
   * // <span>dolor</span>
   *
   * import { create, isVisible } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spansAreVisible: isVisible('span', { multiple: true })
   * });
   *
   * // all spans are visible
   * assert.ok(page.spansAreVisible);
   *
   * @example
   *
   * // Lorem <strong>ipsum</strong>
   *
   * import { create, isVisible } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanIsVisible: isVisible('span')
   * });
   *
   * // returns false when element doesn't exist in DOM
   * assert.notOk(page.spanIsVisible);
   *
   * @example
   *
   * // <div>
   * //   <span style="display:none">lorem</span>
   * // </div>
   * // <div class="scope">
   * //   <span>ipsum</span>
   * // </div>
   *
   * import { create, isVisible } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanIsVisible: isVisible('span', { scope: '.scope' })
   * });
   *
   * assert.ok(page.spanIsVisible);
   *
   * @example
   *
   * // <div>
   * //   <span style="display:none">lorem</span>
   * // </div>
   * // <div class="scope">
   * //   <span>ipsum</span>
   * // </div>
   *
   * import { create, isVisible } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   spanIsVisible: isVisible('span')
   * });
   *
   * assert.ok(page.spanIsVisible);
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector are visible
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function isVisible(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElement)(this, selector, options);

        if (elements.length === 0) {
          return false;
        }

        return (0, _helpers.every)(elements, function (element) {
          return element.is(':visible');
        });
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/is', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.is = is;


  /**
   * @public
   *
   * Validates if an element (or elements) matches a given selector.
   *
   * Useful for checking if an element (or elements) matches a selector like
   * `:disabled` or `:checked`, which can be the result of either an attribute
   * (`disabled="disabled"`, `disabled=true`) or a property (`disabled`).
   *
   * @example
   * // <input type="checkbox" checked="checked">
   * // <input type="checkbox" checked>
   *
   * import { create, is } from 'ember-cli-page-object';
   *
   * const page = create({
   *   areInputsChecked: is(':checked', 'input', { multiple: true })
   * });
   *
   * assert.equal(page.areInputsChecked, true, 'Inputs are checked');
   *
   * @example
   * // <button class="toggle-button active" disabled>Toggle something</button>
   *
   * import { create, is } from 'ember-cli-page-object';
   *
   * const page = create({
   *   isToggleButtonActive: is('.active:disabled', '.toggle-button')
   * });
   *
   * assert.equal(page.isToggleButtonActive, true, 'Button is active');
   *
   * @param {string} testSelector - CSS selector to test
   * @param {string} targetSelector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.multiple - If set, the function will return an array of values
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function is(testSelector, targetSelector) {
    var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        Ember.deprecate(':is property is deprecated', false, {
          id: 'ember-cli-page-object.is-property',
          until: '2.0.0',
          url: 'https://ember-cli-page-object.js.org/docs/v1.16.x/deprecations/#is-property'
        });

        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElementWithAssert)(this, targetSelector, options);

        return (0, _helpers.every)(elements, function (element) {
          return element.is(testSelector);
        });
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/not-has-class', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.notHasClass = notHasClass;


  /**
   * @public
   *
   * Validates if an element or a set of elements don't have a given CSS class.
   *
   * @example
   *
   * // <em class="lorem"></em><span class="success">Message!</span>
   *
   * import { create, notHasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   messageIsSuccess: notHasClass('error', 'span')
   * });
   *
   * assert.ok(page.messageIsSuccess);
   *
   * @example
   *
   * // <span class="success"></span>
   * // <span class="error"></span>
   *
   * import { create, notHasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   messagesAreSuccessful: notHasClass('error', 'span', { multiple: true })
   * });
   *
   * // one span has error class
   * assert.notOk(page.messagesAreSuccessful);
   *
   * @example
   *
   * // <span class="success"></span>
   * // <span class="success"></span>
   *
   * import { create, notHasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   messagesAreSuccessful: notHasClass('error', 'span', { multiple: true })
   * });
   *
   * // no spans have error class
   * assert.ok(page.messagesAreSuccessful);
   *
   * @example
   *
   * // <div>
   * //   <span class="lorem"></span>
   * // </div>
   * // <div class="scope">
   * //   <span class="ipsum"></span>
   * // </div>
   *
   * import { create, notHasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   spanNotHasClass: notHasClass('lorem', 'span', { scope: '.scope' })
   * });
   *
   * assert.ok(page.spanNotHasClass);
   *
   * @example
   *
   * // <div>
   * //   <span class="lorem"></span>
   * // </div>
   * // <div class="scope">
   * //   <span class="ipsum"></span>
   * // </div>
   *
   * import { create, notHasClass } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   spanNotHasClass: notHasClass('lorem', 'span')
   * });
   *
   * assert.ok(page.spanNotHasClass);
   *
   * @public
   *
   * @param {string} cssClass - CSS class to be validated
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Check if all elements matched by selector don't have the CSS class
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function notHasClass(cssClass, selector) {
    var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElementWithAssert)(this, selector, options);

        return (0, _helpers.every)(elements, function (element) {
          return !element.hasClass(cssClass);
        });
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/property', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.property = property;


  /**
   * @public
   *
   * Returns the value of a property from the matched element, or an array of
   * values from multiple matched elements.
   *
   * @example
   * // <input type="checkbox" checked="checked">
   *
   * import { create, property } from 'ember-cli-page-object';
   *
   * const page = create({
   *   isChecked: property('checked', 'input')
   * });
   *
   * assert.ok(page.isChecked);
   *
   * @example
   *
   * // <input type="checkbox" checked="checked">
   * // <input type="checkbox" checked="">
   *
   * import { create, property } from 'ember-cli-page-object';
   *
   * const page = create({
   *   inputsChecked: property('checked', 'input', { multiple: true })
   * });
   *
   * assert.deepEqual(page.inputsChecked, [true, false]);
   *
   * @example
   *
   * // <div><input></div>
   * // <div class="scope"><input type="checkbox" checked="checked"></div>
   * // <div><input></div>
   *
   * import { create, property } from 'ember-cli-page-object';
   *
   * const page = create({
   *   isChecked: property('checked', 'input', { scope: '.scope' })
   * });
   *
   * assert.ok(page.isChecked);
   *
   * @public
   *
   * @param {string} propertyName - Name of the property to get
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.multiple - If set, the function will return an array of values
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function property(propertyName, selector) {
    var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElementWithAssert)(this, selector, options);

        return (0, _helpers.map)(elements, function (element) {
          return element.prop(propertyName);
        }, options);
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/text', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.text = text;


  function identity(v) {
    return v;
  }

  /**
   * @public
   *
   * Returns text of the element or Array of texts of all matched elements by selector.
   *
   * @example
   *
   * // Hello <span>world!</span>
   *
   * import { create, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   text: text('span')
   * });
   *
   * assert.equal(page.text, 'world!');
   *
   * @example
   *
   * // <span>lorem</span>
   * // <span> ipsum </span>
   * // <span>dolor</span>
   *
   * import { create, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   texts: text('span', { multiple: true })
   * });
   *
   * assert.deepEqual(page.texts, ['lorem', 'ipsum', 'dolor']);
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span>ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * import { create, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   text: text('span', { scope: '.scope' })
   * });
   *
   * assert.equal(page.text, 'ipsum');
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope"><span>ipsum</span></div>
   * // <div><span>dolor</span></div>
   *
   * import { create, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   text: text('span')
   * });
   *
   * // returns 'ipsum'
   * assert.equal(page.text, 'ipsum');
   *
   * @example
   *
   * // <div><span>lorem</span></div>
   * // <div class="scope">
   * //  ipsum
   * // </div>
   * // <div><span>dolor</span></div>
   *
   * import { create, text } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   text: text('span', { normalize: false })
   * });
   *
   * // returns 'ipsum'
   * assert.equal(page.text, '\n ipsum\n');
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {boolean} options.multiple - Return an array of values
   * @param {boolean} options.normalize - Set to `false` to avoid text normalization
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function text(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElementWithAssert)(this, selector, options);

        var f = options.normalize === false ? identity : _helpers.normalizeText;

        return (0, _helpers.map)(elements, function (element) {
          return f(element.text());
        }, options);
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/triggerable', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context'], function (exports, _helpers, _execution_context) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.triggerable = triggerable;


  /**
   *
   * Triggers event on element matched by selector.
   *
   * @example
   *
   * // <input class="name">
   * // <input class="email">
   *
   * import { create, triggerable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   enter: triggerable('keypress', '.name', { eventProperties: { keyCode: 13 } })
   * });
   *
   * // triggers keypress using enter key on element with selector '.name'
   * page.enter();
   *
   * @example
   *
   * // <input class="name">
   * // <input class="email">
   *
   * import { create, triggerable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   keydown: triggerable('keypress', '.name')
   * });
   *
   * // triggers keypress using enter key on element with selector '.name'
   * page.keydown({ which: 13 });
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * import { create, triggerable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   keydown: triggerable('keypress', '.name', { scope: '.scope' })
   * });
   *
   * // triggers keypress using enter key on element with selector '.name'
   * page.keydown({ which: 13 });
   *
   * @example
   *
   * // <div class="scope">
   * //   <input class="name">
   * // </div>
   * // <input class="email">
   *
   * import { create, triggerable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   keydown: triggerable('keypress', '.name')
   * });
   *
   * // triggers keypress using enter key on element with selector '.name'
   * page.keydown({ which: 13 });
   *
   * @public
   *
   * @param {string} event - Event to be triggered
   * @param {string} selector - CSS selector of the element on which the event will be triggered
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.resetScope - Ignore parent scope
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @param {string} options.eventProperties - Event properties that will be passed to trigger function
   * @return {Descriptor}
  */
  function triggerable(event, selector) {
    var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        return function () {
          var _this = this;

          var eventProperties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          var executionContext = (0, _execution_context.getExecutionContext)(this);
          var options = (0, _helpers.assign)({ pageObjectKey: key + '()' }, userOptions);
          var staticEventProperties = (0, _helpers.assign)({}, options.eventProperties);

          return executionContext.runAsync(function (context) {
            var fullSelector = (0, _helpers.buildSelector)(_this, selector, options);
            var container = options.testContainer || (0, _helpers.findClosestValue)(_this, 'testContainer');

            context.assertElementExists(fullSelector, options);

            var mergedEventProperties = (0, _helpers.assign)(staticEventProperties, eventProperties);
            return context.triggerEvent(fullSelector, container, options, event, mergedEventProperties);
          });
        };
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/value', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/extend'], function (exports, _helpers, _extend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.value = value;


  /**
   * @public
   *
   * Returns the value of a matched element, or an array of values of all
   * matched elements. If a matched element is contenteditable, this helper
   * will return the html content of the element.
   *
   * @example
   *
   * // <input value="Lorem ipsum">
   *
   * import { create, value } from 'ember-cli-page-object';
   *
   * const page = create({
   *   value: value('input')
   * });
   *
   * assert.equal(page.value, 'Lorem ipsum');
   *
   * @example
   *
   * // <div contenteditable="true"><b>Lorem ipsum</b></div>
   *
   * import { create, value } from 'ember-cli-page-object';
   *
   * const page = create({
   *   value: value('[contenteditable]')
   * });
   *
   * assert.equal(page.value, '<b>Lorem ipsum</b>');
   *
   * @example
   *
   * // <input value="lorem">
   * // <input value="ipsum">
   *
   * import { create, value } from 'ember-cli-page-object';
   *
   * const page = create({
   *   value: value('input', { multiple: true })
   * });
   *
   * assert.deepEqual(page.value, ['lorem', 'ipsum']);
   *
   * @example
   *
   * // <div><input value="lorem"></div>
   * // <div class="scope"><input value="ipsum"></div>
   *
   * import { create, value } from 'ember-cli-page-object';
   *
   * const page = create({
   *   value: value('input', { scope: '.scope' })
   * });
   *
   * assert.equal(page.value, 'ipsum');
   *
   * @example
   *
   * // <div><input value="lorem"></div>
   * // <div class="scope"><input value="ipsum"></div>
   *
   * import { create, value } from 'ember-cli-page-object';
   *
   * const page = create({
   *   scope: '.scope',
   *   value: value('input')
   * });
   *
   * assert.equal(page.value, 'ipsum');
   *
   * @public
   *
   * @param {string} selector - CSS selector of the element to check
   * @param {Object} options - Additional options
   * @param {string} options.scope - Nests provided scope within parent's scope
   * @param {boolean} options.resetScope - Override parent's scope
   * @param {number} options.at - Reduce the set of matched elements to the one at the specified index
   * @param {boolean} options.multiple - If set, the function will return an array of values
   * @param {string} options.testContainer - Context where to search elements in the DOM
   * @return {Descriptor}
   *
   * @throws Will throw an error if no element matches selector
   * @throws Will throw an error if multiple elements are matched by selector and multiple option is not set
   */
  function value(selector) {
    var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      isDescriptor: true,

      get: function get(key) {
        var options = (0, _helpers.assign)({ pageObjectKey: key }, userOptions);

        var elements = (0, _extend.findElementWithAssert)(this, selector, options);

        return (0, _helpers.map)(elements, function (element) {
          if (element.is('[contenteditable]')) {
            return element.html();
          } else {
            return element.val();
          }
        }, options);
      }
    };
  }
});
define('ember-cli-page-object/test-support/properties/visitable', ['exports', 'ember-cli-page-object/test-support/-private/helpers', 'ember-cli-page-object/test-support/-private/execution_context', '-jquery'], function (exports, _helpers, _execution_context, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.visitable = visitable;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function fillInDynamicSegments(path, params) {
    return path.split('/').map(function (segment) {
      var match = segment.match(/^:(.+)$/);

      if (match) {
        var _match = _slicedToArray(match, 2),
            key = _match[1];

        var value = params[key];

        if (typeof value === 'undefined') {
          throw new Error('Missing parameter for \'' + key + '\'');
        }

        // Remove dynamic segment key from params
        delete params[key];

        return encodeURIComponent(value);
      }

      return segment;
    }).join('/');
  }

  function appendQueryParams(path, queryParams) {
    if (Object.keys(queryParams).length) {
      path += '?' + _jquery.default.param(queryParams);
    }

    return path;
  }

  /**
   * @public
   *
   * Loads a given route.
   *
   * The resulting descriptor can be called with dynamic segments and parameters.
   *
   * @example
   *
   * import { create, visitable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   visit: visitable('/users')
   * });
   *
   * // visits '/users'
   * page.visit();
   *
   * @example
   *
   * import { create, visitable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   visit: visitable('/users/:user_id')
   * });
   *
   * // visits '/users/10'
   * page.visit({ user_id: 10 });
   *
   * @example
   *
   * import { create, visitable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   visit: visitable('/users')
   * });
   *
   * // visits '/users?name=john'
   * page.visit({ name: 'john' });
   *
   * @example
   *
   * import { create, visitable } from 'ember-cli-page-object';
   *
   * const page = create({
   *   visit: visitable('/users/:user_id')
   * });
   *
   * // visits '/users/1?name=john'
   * page.visit({ user_id: 1, name: 'john' });
   *
   * @param {string} path - Full path of the route to visit
   * @return {Descriptor}
   *
   * @throws Will throw an error if dynamic segments are not filled
   */
  function visitable(path) {
    return {
      isDescriptor: true,

      get: function get() {
        return function () {
          var dynamicSegmentsAndQueryParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          var executionContext = (0, _execution_context.getExecutionContext)(this);

          return executionContext.runAsync(function (context) {
            var params = (0, _helpers.assign)({}, dynamicSegmentsAndQueryParams);
            var fullPath = fillInDynamicSegments(path, params);

            fullPath = appendQueryParams(fullPath, params);

            return context.visit(fullPath);
          });
        };
      }
    };
  }
});
define('ember-cli-test-loader/test-support/index', ['exports'], function (exports) {
  /* globals requirejs, require */
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.addModuleIncludeMatcher = addModuleIncludeMatcher;
  exports.addModuleExcludeMatcher = addModuleExcludeMatcher;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var moduleIncludeMatchers = [];
  var moduleExcludeMatchers = [];

  function addModuleIncludeMatcher(fn) {
    moduleIncludeMatchers.push(fn);
  }

  function addModuleExcludeMatcher(fn) {
    moduleExcludeMatchers.push(fn);
  }

  function checkMatchers(matchers, moduleName) {
    return matchers.some(function (matcher) {
      return matcher(moduleName);
    });
  }

  var TestLoader = function () {
    _createClass(TestLoader, null, [{
      key: 'load',
      value: function load() {
        new TestLoader().loadModules();
      }
    }]);

    function TestLoader() {
      _classCallCheck(this, TestLoader);

      this._didLogMissingUnsee = false;
    }

    _createClass(TestLoader, [{
      key: 'shouldLoadModule',
      value: function shouldLoadModule(moduleName) {
        return moduleName.match(/[-_]test$/);
      }
    }, {
      key: 'listModules',
      value: function listModules() {
        return Object.keys(requirejs.entries);
      }
    }, {
      key: 'listTestModules',
      value: function listTestModules() {
        var moduleNames = this.listModules();
        var testModules = [];
        var moduleName = void 0;

        for (var i = 0; i < moduleNames.length; i++) {
          moduleName = moduleNames[i];

          if (checkMatchers(moduleExcludeMatchers, moduleName)) {
            continue;
          }

          if (checkMatchers(moduleIncludeMatchers, moduleName) || this.shouldLoadModule(moduleName)) {
            testModules.push(moduleName);
          }
        }

        return testModules;
      }
    }, {
      key: 'loadModules',
      value: function loadModules() {
        var testModules = this.listTestModules();
        var testModule = void 0;

        for (var i = 0; i < testModules.length; i++) {
          testModule = testModules[i];
          this.require(testModule);
          this.unsee(testModule);
        }
      }
    }, {
      key: 'require',
      value: function (_require) {
        function require(_x) {
          return _require.apply(this, arguments);
        }

        require.toString = function () {
          return _require.toString();
        };

        return require;
      }(function (moduleName) {
        try {
          require(moduleName);
        } catch (e) {
          this.moduleLoadFailure(moduleName, e);
        }
      })
    }, {
      key: 'unsee',
      value: function unsee(moduleName) {
        if (typeof require.unsee === 'function') {
          require.unsee(moduleName);
        } else if (!this._didLogMissingUnsee) {
          this._didLogMissingUnsee = true;
          if (typeof console !== 'undefined') {
            console.warn('unable to require.unsee, please upgrade loader.js to >= v3.3.0');
          }
        }
      }
    }, {
      key: 'moduleLoadFailure',
      value: function moduleLoadFailure(moduleName, error) {
        console.error('Error loading: ' + moduleName, error.stack);
      }
    }]);

    return TestLoader;
  }();

  exports.default = TestLoader;
  ;
});
define("ember-engines/test-support/engine-resolver-for", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = engineResolverFor;

  /* global require */

  /**
   * Gets the resolver class used by an Engine and creates an instance to be used
   * with test modules. Ex:
   *
   *   moduleForComponent('some-component', 'Integration Test', {
   *     resolver: engineResolverFor('ember-blog')
   *   });
   *
   * Uses the module found at `<engine-name>/resolver` as the class. If no module
   * exists at that path, then a default EmberResolver instance is created.
   *
   * You can optionally specify a modulePrefix in the event that the modulePrefix
   * differs from the engineName.
   *
   * @method engineResolverFor
   * @param {String} engineName
   * @param {String} [modulePrefix]
   * @return {Resolver}
   */
  function engineResolverFor(engineName) {
    var modulePrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : engineName;
    var Resolver;

    if (require.has("".concat(engineName, "/resolver"))) {
      Resolver = require("".concat(engineName, "/resolver")).default;
    } else {
      Resolver = _emberResolver.default;
    }

    return Resolver.create({
      namespace: {
        modulePrefix: modulePrefix
      }
    });
  }
});
define('ember-native-dom-helpers/-private/get-element-with-assert', ['exports', 'ember-native-dom-helpers/-private/get-element'], function (exports, _getElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getElementWithAssert;


  /*
    @method getElementWithAssert
    @param {String|HTMLElement} selectorOrElement
    @param {HTMLElement} contextEl to query within, query from its contained DOM
    @return {Error|HTMLElement} element if found, or raises an error
    @private
  */
  function getElementWithAssert(selectorOrElement, contextEl) {
    var el = (0, _getElement.default)(selectorOrElement, contextEl);
    if (el) {
      return el;
    }
    throw new Error('Element ' + selectorOrElement + ' not found.');
  }
});
define('ember-native-dom-helpers/-private/get-element', ['exports', 'ember-native-dom-helpers/settings'], function (exports, _settings) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getElement;


  /*
    @method getElement
    @param {String|HTMLElement} selectorOrElement
    @param {HTMLElement} contextEl to query within, query from its contained DOM
    @return HTMLElement
    @private
  */
  function getElement() {
    var selectorOrElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var contextEl = arguments[1];

    if (selectorOrElement instanceof Window || selectorOrElement instanceof Document || selectorOrElement instanceof HTMLElement || selectorOrElement instanceof SVGElement) {
      return selectorOrElement;
    }
    var result = void 0;
    if (contextEl instanceof HTMLElement) {
      result = contextEl.querySelector(selectorOrElement);
    } else {
      result = document.querySelector(_settings.default.rootElement + ' ' + selectorOrElement);
    }
    return result;
  }
});
define('ember-native-dom-helpers/-private/is-focusable', ['exports', 'ember-native-dom-helpers/-private/is-form-control'], function (exports, _isFormControl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFocusable;
  function isFocusable(el) {
    var focusableTags = ['LINK', 'A'];

    if ((0, _isFormControl.default)(el) || el.isContentEditable || focusableTags.indexOf(el.tagName) > -1) {
      return true;
    }

    return el.hasAttribute('tabindex');
  }
});
define('ember-native-dom-helpers/-private/is-form-control', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFormControl;
  function isFormControl(el) {
    var formControlTags = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
    var tagName = el.tagName,
        type = el.type;


    if (type === 'hidden') {
      return false;
    }

    return formControlTags.indexOf(tagName) > -1;
  }
});
define('ember-native-dom-helpers/blur', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-native-dom-helpers/-private/is-focusable', 'ember-native-dom-helpers/fire-event', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _isFocusable, _fireEvent, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.blur = blur;


  /*
    @method blur
    @param {String|HTMLElement} selector
    @return {RSVP.Promise}
    @public
  */
  function blur(selector) {
    if (!selector) {
      return;
    }

    var el = (0, _getElementWithAssert.default)(selector);

    if ((0, _isFocusable.default)(el)) {
      Ember.run(null, function () {
        var browserIsNotFocused = document.hasFocus && !document.hasFocus();

        // makes `document.activeElement` be `body`.
        // If the browser is focused, it also fires a blur event
        el.blur();

        // Chrome/Firefox does not trigger the `blur` event if the window
        // does not have focus. If the document does not have focus then
        // fire `blur` event via native event.
        if (browserIsNotFocused) {
          (0, _fireEvent.fireEvent)(el, 'blur', { bubbles: false });
        }
      });
    }

    return (window.wait || _wait.default)();
  }
});
define('ember-native-dom-helpers/click', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-native-dom-helpers/fire-event', 'ember-native-dom-helpers/focus', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _fireEvent, _focus, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.clickEventSequence = clickEventSequence;
  exports.click = click;


  /*
    @method clickEventSequence
    @private
  */
  function clickEventSequence(el, options) {
    Ember.run(function () {
      return (0, _fireEvent.fireEvent)(el, 'mousedown', options);
    });
    (0, _focus.focus)(el);
    Ember.run(function () {
      return (0, _fireEvent.fireEvent)(el, 'mouseup', options);
    });
    Ember.run(function () {
      return (0, _fireEvent.fireEvent)(el, 'click', options);
    });
  }

  /*
    @method click
    @param {String|HTMLElement} selector
    @param {HTMLElement} context
    @param {Object} options
    @return {RSVP.Promise}
    @public
  */
  function click(selector, context, options) {
    (true && !(false) && Ember.deprecate('Importing `click` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { click } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-click' }));

    var element = void 0;
    if (context instanceof HTMLElement) {
      element = (0, _getElementWithAssert.default)(selector, context);
    } else {
      options = context || {};
      element = (0, _getElementWithAssert.default)(selector);
    }
    clickEventSequence(element, options);
    return (window.wait || _wait.default)();
  }
});
define('ember-native-dom-helpers/current-path', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.currentPath = currentPath;
  function currentPath() {
    var _window;

    (true && !(false) && Ember.deprecate('Importing `currentPath` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { currentPath } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-current-path' }));

    if (!window.currentPath) {
      throw new Error('currentPath is only available during acceptance tests');
    }

    return (_window = window).currentPath.apply(_window, arguments);
  }
});
define('ember-native-dom-helpers/current-route-name', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.currentRouteName = currentRouteName;
  function currentRouteName() {
    var _window;

    (true && !(false) && Ember.deprecate('Importing `currentRouteName` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { currentRouteName } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-current-route-name' }));

    if (!window.currentRouteName) {
      throw new Error('currentRouteName is only available during acceptance tests');
    }

    return (_window = window).currentRouteName.apply(_window, arguments);
  }
});
define('ember-native-dom-helpers/current-url', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.currentURL = currentURL;
  function currentURL() {
    var _window;

    (true && !(false) && Ember.deprecate('Importing `currentURL` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { currentURL } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-current-url' }));

    if (!window.currentURL) {
      throw new Error('currentURL is only available during acceptance tests');
    }

    return (_window = window).currentURL.apply(_window, arguments);
  }
});
define('ember-native-dom-helpers/fill-in', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-native-dom-helpers/-private/is-form-control', 'ember-native-dom-helpers/focus', 'ember-native-dom-helpers/fire-event', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _isFormControl, _focus, _fireEvent, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fillIn = fillIn;


  /*
    @method fillIn
    @param {String|HTMLElement} selector
    @param {String} text
    @return {RSVP.Promise}
    @public
  */
  function fillIn(selector, text) {
    (true && !(false) && Ember.deprecate('Importing `fillIn` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { fillIn } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-fill-in' }));


    var el = (0, _getElementWithAssert.default)(selector);

    if (!(0, _isFormControl.default)(el) && !el.isContentEditable) {
      throw new Error('Unable to fill element');
    }

    Ember.run(function () {
      return (0, _focus.focus)(el);
    });
    Ember.run(function () {
      if (el.isContentEditable) {
        el.innerHTML = text;
      } else {
        el.value = text;
      }
    });
    Ember.run(function () {
      return (0, _fireEvent.fireEvent)(el, 'input');
    });
    Ember.run(function () {
      return (0, _fireEvent.fireEvent)(el, 'change');
    });
    return (window.wait || _wait.default)();
  }
});
define('ember-native-dom-helpers/find-all', ['exports', 'ember-native-dom-helpers/settings'], function (exports, _settings) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findAll = findAll;


  /*
    The findAll test helper uses `querySelectorAll` to search inside the test
    DOM (based on app configuration for the rootElement).
  
    Alternatively, a second argument may be passed which is an element as the
    DOM context to search within.
  
    @method findAll
    @param {String} CSS selector to find elements in the test DOM
    @param {Element} context to query within, query from its contained DOM
    @return {Array} An array of zero or more HTMLElement objects
    @public
  */
  function findAll(selector, context) {
    var result = void 0;
    if (context instanceof Element) {
      result = context.querySelectorAll(selector);
    } else {
      result = document.querySelectorAll(_settings.default.rootElement + ' ' + selector);
    }
    return toArray(result);
  }

  function toArray(nodelist) {
    var array = new Array(nodelist.length);
    for (var i = 0; i < nodelist.length; i++) {
      array[i] = nodelist[i];
    }
    return array;
  }
});
define('ember-native-dom-helpers/find-with-assert', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert'], function (exports, _getElementWithAssert) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.findWithAssert = findWithAssert;


  /*
    @method findWithAssert
    @param {String} CSS selector to find elements in the test DOM
    @param {HTMLElement} contextEl to query within, query from its contained DOM
    @return {Error|HTMLElement} element if found, or raises an error
    @public
  */
  function findWithAssert(selector, contextEl) {
    return (0, _getElementWithAssert.default)(selector, contextEl);
  }
});
define('ember-native-dom-helpers/find', ['exports', 'ember-native-dom-helpers/-private/get-element'], function (exports, _getElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.find = find;


  /*
    The find test helper uses `querySelector` to search inside the test
    DOM (based on app configuration for the rootElement).
  
    Alternalively, a second argument may be passed which is an element as the
    DOM context to search within.
  
    @method find
    @param {String} CSS selector to find one or more elements in the test DOM
    @param {HTMLElement} contextEl to query within, query from its contained DOM
    @return {null|HTMLElement} null or an element
    @public
  */
  function find(selector, contextEl) {
    return (0, _getElement.default)(selector, contextEl);
  }
});
define('ember-native-dom-helpers/fire-event', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fireEvent = fireEvent;

  var DEFAULT_EVENT_OPTIONS = { bubbles: true, cancelable: true };
  var KEYBOARD_EVENT_TYPES = ['keydown', 'keypress', 'keyup'];
  var MOUSE_EVENT_TYPES = ['click', 'mousedown', 'mouseup', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover'];
  var FILE_SELECTION_EVENT_TYPES = ['change'];

  /*
    @method fireEvent
    @param {HTMLElement} element
    @param {String} type
    @param {Object} (optional) options
    @return {Event} The dispatched event
    @private
  */
  function fireEvent(element, type) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (!element) {
      return;
    }
    var event = void 0;
    if (KEYBOARD_EVENT_TYPES.indexOf(type) > -1) {
      event = buildKeyboardEvent(type, options);
    } else if (MOUSE_EVENT_TYPES.indexOf(type) > -1) {
      var rect = void 0;
      if (element instanceof Window) {
        rect = element.document.documentElement.getBoundingClientRect();
      } else if (element instanceof Document) {
        rect = element.documentElement.getBoundingClientRect();
      } else if (element instanceof HTMLElement || element instanceof SVGElement) {
        rect = element.getBoundingClientRect();
      } else {
        return;
      }
      var x = rect.left + 1;
      var y = rect.top + 1;
      var simulatedCoordinates = {
        screenX: x + 5, // Those numbers don't really mean anything.
        screenY: y + 95, // They're just to make the screenX/Y be different of clientX/Y..
        clientX: x,
        clientY: y
      };
      event = buildMouseEvent(type, Ember.assign(simulatedCoordinates, options));
    } else if (FILE_SELECTION_EVENT_TYPES.indexOf(type) > -1 && element.files) {
      event = buildFileEvent(type, element, options);
    } else {
      event = buildBasicEvent(type, options);
    }
    element.dispatchEvent(event);
    return event;
  }

  /*
    @method buildBasicEvent
    @param {String} type
    @param {Object} (optional) options
    @return {Event}
    @private
  */
  function buildBasicEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var event = document.createEvent('Events');

    var bubbles = options.bubbles !== undefined ? options.bubbles : true;
    var cancelable = options.cancelable !== undefined ? options.cancelable : true;

    delete options.bubbles;
    delete options.cancelable;

    // bubbles and cancelable are readonly, so they can be
    // set when initializing event
    event.initEvent(type, bubbles, cancelable);
    Ember.assign(event, options);
    return event;
  }

  /*
    @method buildMouseEvent
    @param {String} type
    @param {Object} (optional) options
    @return {Event}
    @private
  */
  function buildMouseEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var event = void 0;
    try {
      event = document.createEvent('MouseEvents');
      var eventOpts = Ember.assign(Ember.assign({}, DEFAULT_EVENT_OPTIONS), options);
      event.initMouseEvent(type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.detail, eventOpts.screenX, eventOpts.screenY, eventOpts.clientX, eventOpts.clientY, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.button, eventOpts.relatedTarget);
    } catch (e) {
      event = buildBasicEvent(type, options);
    }
    return event;
  }

  /*
    @method buildKeyboardEvent
    @param {String} type
    @param {Object} (optional) options
    @return {Event}
    @private
  */
  function buildKeyboardEvent(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var eventOpts = Ember.assign(Ember.assign({}, DEFAULT_EVENT_OPTIONS), options);
    var event = void 0,
        eventMethodName = void 0;

    try {
      event = new KeyboardEvent(type, eventOpts);

      // Property definitions are required for B/C for keyboard event usage
      // If this properties are not defined, when listening for key events
      // keyCode/which will be 0. Also, keyCode and which now are string
      // and if app compare it with === with integer key definitions,
      // there will be a fail.
      //
      // https://w3c.github.io/uievents/#interface-keyboardevent
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
      Object.defineProperty(event, 'keyCode', {
        get: function get() {
          return parseInt(this.key);
        }
      });

      Object.defineProperty(event, 'which', {
        get: function get() {
          return parseInt(this.key);
        }
      });

      return event;
    } catch (e) {
      // left intentionally blank
    }

    try {
      event = document.createEvent('KeyboardEvents');
      eventMethodName = 'initKeyboardEvent';
    } catch (e) {
      // left intentionally blank
    }

    if (!event) {
      try {
        event = document.createEvent('KeyEvents');
        eventMethodName = 'initKeyEvent';
      } catch (e) {
        // left intentionally blank
      }
    }

    if (event) {
      event[eventMethodName](type, eventOpts.bubbles, eventOpts.cancelable, window, eventOpts.ctrlKey, eventOpts.altKey, eventOpts.shiftKey, eventOpts.metaKey, eventOpts.keyCode, eventOpts.charCode);
    } else {
      event = buildBasicEvent(type, options);
    }

    return event;
  }

  /*
    @method buildFileEvent
    @param {String} type
    @param {Array} array of files
    @param {HTMLElement} element
    @return {Event}
    @private
  */
  function buildFileEvent(type, element) {
    var files = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    var event = buildBasicEvent(type);

    if (files.length > 0) {
      Object.defineProperty(files, 'item', {
        value: function value(index) {
          return typeof index === 'number' ? this[index] : null;
        }
      });
      Object.defineProperty(element, 'files', {
        value: files
      });
    }

    Object.defineProperty(event, 'target', {
      value: element
    });

    return event;
  }
});
define('ember-native-dom-helpers/focus', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-native-dom-helpers/-private/is-focusable', 'ember-native-dom-helpers/fire-event', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _isFocusable, _fireEvent, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.focus = focus;


  /*
    @method focus
    @param {String|HTMLElement} selector
    @return {RSVP.Promise}
    @public
  */
  function focus(selector) {
    if (!selector) {
      return;
    }

    var el = (0, _getElementWithAssert.default)(selector);

    if ((0, _isFocusable.default)(el)) {
      Ember.run(null, function () {
        var browserIsNotFocused = document.hasFocus && !document.hasFocus();

        // Firefox does not trigger the `focusin` event if the window
        // does not have focus. If the document does not have focus then
        // fire `focusin` event as well.
        if (browserIsNotFocused) {
          (0, _fireEvent.fireEvent)(el, 'focusin', {
            bubbles: false
          });
        }

        // makes `document.activeElement` be `el`. If the browser is focused, it also fires a focus event
        el.focus();

        // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
        if (browserIsNotFocused) {
          (0, _fireEvent.fireEvent)(el, 'focus', {
            bubbles: false
          });
        }
      });
    }

    return (window.wait || _wait.default)();
  }
});
define('ember-native-dom-helpers/index', ['exports', 'ember-native-dom-helpers/find', 'ember-native-dom-helpers/find-all', 'ember-native-dom-helpers/find-with-assert', 'ember-native-dom-helpers/click', 'ember-native-dom-helpers/tap', 'ember-native-dom-helpers/fill-in', 'ember-native-dom-helpers/key-event', 'ember-native-dom-helpers/trigger-event', 'ember-native-dom-helpers/visit', 'ember-native-dom-helpers/wait-until', 'ember-native-dom-helpers/wait-for', 'ember-native-dom-helpers/current-url', 'ember-native-dom-helpers/current-path', 'ember-native-dom-helpers/focus', 'ember-native-dom-helpers/blur', 'ember-native-dom-helpers/scroll-to', 'ember-native-dom-helpers/current-route-name', 'ember-native-dom-helpers/select-files', 'ember-native-dom-helpers/settings'], function (exports, _find, _findAll, _findWithAssert, _click, _tap, _fillIn, _keyEvent, _triggerEvent, _visit, _waitUntil, _waitFor, _currentUrl, _currentPath, _focus, _blur, _scrollTo, _currentRouteName, _selectFiles, _settings) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'find', {
    enumerable: true,
    get: function () {
      return _find.find;
    }
  });
  Object.defineProperty(exports, 'findAll', {
    enumerable: true,
    get: function () {
      return _findAll.findAll;
    }
  });
  Object.defineProperty(exports, 'findWithAssert', {
    enumerable: true,
    get: function () {
      return _findWithAssert.findWithAssert;
    }
  });
  Object.defineProperty(exports, 'click', {
    enumerable: true,
    get: function () {
      return _click.click;
    }
  });
  Object.defineProperty(exports, 'tap', {
    enumerable: true,
    get: function () {
      return _tap.tap;
    }
  });
  Object.defineProperty(exports, 'fillIn', {
    enumerable: true,
    get: function () {
      return _fillIn.fillIn;
    }
  });
  Object.defineProperty(exports, 'keyEvent', {
    enumerable: true,
    get: function () {
      return _keyEvent.keyEvent;
    }
  });
  Object.defineProperty(exports, 'triggerEvent', {
    enumerable: true,
    get: function () {
      return _triggerEvent.triggerEvent;
    }
  });
  Object.defineProperty(exports, 'visit', {
    enumerable: true,
    get: function () {
      return _visit.visit;
    }
  });
  Object.defineProperty(exports, 'waitUntil', {
    enumerable: true,
    get: function () {
      return _waitUntil.waitUntil;
    }
  });
  Object.defineProperty(exports, 'waitFor', {
    enumerable: true,
    get: function () {
      return _waitFor.waitFor;
    }
  });
  Object.defineProperty(exports, 'currentURL', {
    enumerable: true,
    get: function () {
      return _currentUrl.currentURL;
    }
  });
  Object.defineProperty(exports, 'currentPath', {
    enumerable: true,
    get: function () {
      return _currentPath.currentPath;
    }
  });
  Object.defineProperty(exports, 'focus', {
    enumerable: true,
    get: function () {
      return _focus.focus;
    }
  });
  Object.defineProperty(exports, 'blur', {
    enumerable: true,
    get: function () {
      return _blur.blur;
    }
  });
  Object.defineProperty(exports, 'scrollTo', {
    enumerable: true,
    get: function () {
      return _scrollTo.scrollTo;
    }
  });
  Object.defineProperty(exports, 'currentRouteName', {
    enumerable: true,
    get: function () {
      return _currentRouteName.currentRouteName;
    }
  });
  Object.defineProperty(exports, 'selectFiles', {
    enumerable: true,
    get: function () {
      return _selectFiles.selectFiles;
    }
  });
  Object.defineProperty(exports, 'settings', {
    enumerable: true,
    get: function () {
      return _settings.default;
    }
  });
});
define('ember-native-dom-helpers/key-event', ['exports', 'ember-native-dom-helpers/trigger-event'], function (exports, _triggerEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.keyEvent = keyEvent;


  /**
   * @public
   * @param selector
   * @param type
   * @param keyCode
   * @param modifiers
   * @return {*}
   */
  function keyEvent(selector, type, keyCode) {
    var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { ctrlKey: false, altKey: false, shiftKey: false, metaKey: false };
    (true && !(false) && Ember.deprecate('Importing `keyEvent` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { triggerKeyEvent } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-key-event' }));

    return (0, _triggerEvent.triggerEvent)(selector, type, Ember.assign({ keyCode: keyCode, which: keyCode, key: keyCode }, modifiers));
  }
});
define('ember-native-dom-helpers/scroll-to', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.scrollTo = scrollTo;


  var rAF = window.requestAnimationFrame || function (cb) {
    setTimeout(cb, 17);
  };

  /*
    Triggers a paint (and therefore flushes any queued up scroll events).
  
    @method triggerFlushWithPromise
    @return {RSVP.Promise}
    @private
  */
  function waitForScrollEvent() {
    var waitForEvent = new Ember.RSVP.Promise(function (resolve) {
      rAF(resolve);
    });
    return waitForEvent.then(function () {
      return (0, _wait.default)();
    });
  }

  /*
    Scrolls DOM element or selector to the given coordinates (if the DOM element is currently overflowed).
    The promise resolves after the scroll event has been triggered.
    @method scrollTo
    @param {String|HTMLElement} selector
    @param {Number} x
    @param {Number} y
    @return {RSVP.Promise}
    @public
  */
  function scrollTo(selector, x, y) {
    var el = (0, _getElementWithAssert.default)(selector);
    if (el instanceof HTMLElement) {
      el.scrollTop = y;
      el.scrollLeft = x;
    } else if (el instanceof Window) {
      el.scrollTo(x, y);
    }
    return waitForScrollEvent();
  }
});
define('ember-native-dom-helpers/select-files', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-native-dom-helpers/fire-event', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _fireEvent, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.selectFiles = selectFiles;


  /*
    @method selectFiles
    @param {String|HTMLElement} selector
    @param {Array} files
    @return {RSVP.Promise}
    @public
  */
  function selectFiles(selector) {
    var files = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var element = (0, _getElementWithAssert.default)(selector);

    (true && !(element.type === 'file') && Ember.assert('This is only used with file inputs.\n          Either change to a \'type="file"\' or use the \'triggerEvent\' helper.', element.type === 'file'));


    if (!Ember.isArray(files)) {
      files = [files];
    }

    (true && !(element.multiple || files.length <= 1) && Ember.assert('Can only handle multiple selection when an input is set to allow for multiple files.\n          Please add the property "multiple" to your file input.', element.multiple || files.length <= 1));


    Ember.run(function () {
      return (0, _fireEvent.fireEvent)(element, 'change', files);
    });
    return (window.wait || _wait.default)();
  }
});
define('ember-native-dom-helpers/settings', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var TestSupportSettings = function () {
    function TestSupportSettings() {
      var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { rootElement: '#ember-testing' };

      _classCallCheck(this, TestSupportSettings);

      this._rootElement = init.rootElement;
    }

    /*
      Setting for Ember app root element, default is #ember-testing
       @public rootElement
      @type String
    */


    _createClass(TestSupportSettings, [{
      key: 'rootElement',
      get: function get() {
        return this._rootElement;
      },
      set: function set(value) {
        this._rootElement = value;
      }
    }]);

    return TestSupportSettings;
  }();

  var settings = new TestSupportSettings();

  exports.default = settings;
});
define('ember-native-dom-helpers/tap', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-native-dom-helpers/fire-event', 'ember-native-dom-helpers/click', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _fireEvent, _click, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.tap = tap;


  /*
    @method tap
    @param {String|HTMLElement} selector
    @param {Object} options
    @return {RSVP.Promise}
    @public
  */
  function tap(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var el = (0, _getElementWithAssert.default)(selector);
    var touchstartEv = void 0,
        touchendEv = void 0;
    Ember.run(function () {
      return touchstartEv = (0, _fireEvent.fireEvent)(el, 'touchstart', options);
    });
    Ember.run(function () {
      return touchendEv = (0, _fireEvent.fireEvent)(el, 'touchend', options);
    });
    if (!touchstartEv.defaultPrevented && !touchendEv.defaultPrevented) {
      (0, _click.clickEventSequence)(el);
    }
    return (window.wait || _wait.default)();
  }
});
define('ember-native-dom-helpers/trigger-event', ['exports', 'ember-native-dom-helpers/-private/get-element-with-assert', 'ember-native-dom-helpers/fire-event', 'ember-test-helpers/wait'], function (exports, _getElementWithAssert, _fireEvent, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.triggerEvent = triggerEvent;


  /*
    @method triggerEvent
    @param {String|HTMLElement} selector
    @param {String} type
    @param {Object} options
    @return {RSVP.Promise}
    @public
  */
  function triggerEvent(selector, type, options) {
    var el = (0, _getElementWithAssert.default)(selector);
    Ember.run(function () {
      return (0, _fireEvent.fireEvent)(el, type, options);
    });
    return (window.wait || _wait.default)();
  }
});
define('ember-native-dom-helpers/visit', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.visit = visit;
  function visit() {
    var _window;

    (true && !(false) && Ember.deprecate('Importing `visit` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { visit } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-visit' }));


    if (!window.visit) {
      throw new Error('visit is only available during acceptance tests');
    }

    return (_window = window).visit.apply(_window, arguments);
  }
});
define('ember-native-dom-helpers/wait-for', ['exports', 'ember-native-dom-helpers/wait-until', 'ember-native-dom-helpers/find', 'ember-native-dom-helpers/find-all'], function (exports, _waitUntil, _find, _findAll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.waitFor = waitFor;
  function waitFor(selector) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 1000 : _ref$timeout,
        _ref$count = _ref.count,
        count = _ref$count === undefined ? null : _ref$count;

    var callback = void 0;
    if (count) {
      callback = function callback() {
        var elements = (0, _findAll.findAll)(selector);
        if (elements.length === count) {
          return elements;
        }
      };
    } else {
      callback = function callback() {
        return (0, _find.find)(selector);
      };
    }
    return (0, _waitUntil.waitUntil)(callback, { timeout: timeout });
  }
});
define('ember-native-dom-helpers/wait-until', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.waitUntil = waitUntil;
  function waitUntil(callback) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === undefined ? 1000 : _ref$timeout;

    (true && !(false) && Ember.deprecate('Importing `waitUntil` from "ember-native-dom-helpers" is deprecated. Since `ember-cli-qunit` 4.3 and `ember-cli-mocha` 0.15.0 you can use `import { waitUntil } from "@ember/test-helpers";`', false, { until: '0.7', id: 'ember-native-dom-helpers-wait-until' }));


    return new Ember.RSVP.Promise(function (resolve, reject) {
      var value = Ember.run(callback);
      if (value) {
        resolve(value);
        return;
      }
      var time = 0;
      var tick = function tick() {
        time += 10;
        var value = Ember.run(callback);
        if (value) {
          resolve(value);
        } else if (time < timeout) {
          setTimeout(tick, 10);
        } else {
          reject('waitUntil timed out');
        }
      };
      setTimeout(tick, 10);
    });
  }
});
define("ember-qunit/adapter", ["exports", "qunit", "@ember/test-helpers/has-ember-version"], function (_exports, _qunit, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.nonTestDoneCallback = nonTestDoneCallback;
  _exports.default = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function unhandledRejectionAssertion(current, error) {
    var message, source;

    if (_typeof(error) === 'object' && error !== null) {
      message = error.message;
      source = error.stack;
    } else if (typeof error === 'string') {
      message = error;
      source = 'unknown source';
    } else {
      message = 'unhandledRejection occured, but it had no message';
      source = 'unknown source';
    }

    current.assert.pushResult({
      result: false,
      actual: false,
      expected: true,
      message: message,
      source: source
    });
  }

  function nonTestDoneCallback() {}

  var Adapter = Ember.Test.Adapter.extend({
    init: function init() {
      this.doneCallbacks = [];
      this.qunit = this.qunit || _qunit.default;
    },
    asyncStart: function asyncStart() {
      var currentTest = this.qunit.config.current;
      var done = currentTest && currentTest.assert ? currentTest.assert.async() : nonTestDoneCallback;
      this.doneCallbacks.push({
        test: currentTest,
        done: done
      });
    },
    asyncEnd: function asyncEnd() {
      var currentTest = this.qunit.config.current;

      if (this.doneCallbacks.length === 0) {
        throw new Error('Adapter asyncEnd called when no async was expected. Please create an issue in ember-qunit.');
      }

      var _this$doneCallbacks$p = this.doneCallbacks.pop(),
          test = _this$doneCallbacks$p.test,
          done = _this$doneCallbacks$p.done; // In future, we should explore fixing this at a different level, specifically
      // addressing the pairing of asyncStart/asyncEnd behavior in a more consistent way.


      if (test === currentTest) {
        done();
      }
    },
    // clobber default implementation of `exception` will be added back for Ember
    // < 2.17 just below...
    exception: null
  }); // Ember 2.17 and higher do not require the test adapter to have an `exception`
  // method When `exception` is not present, the unhandled rejection is
  // automatically re-thrown and will therefore hit QUnit's own global error
  // handler (therefore appropriately causing test failure)

  if (!(0, _hasEmberVersion.default)(2, 17)) {
    Adapter = Adapter.extend({
      exception: function exception(error) {
        unhandledRejectionAssertion(_qunit.default.config.current, error);
      }
    });
  }

  var _default = Adapter;
  _exports.default = _default;
});
define("ember-qunit/index", ["exports", "ember-qunit/legacy-2-x/module-for", "ember-qunit/legacy-2-x/module-for-component", "ember-qunit/legacy-2-x/module-for-model", "ember-qunit/adapter", "qunit", "ember-qunit/test-loader", "@ember/test-helpers", "ember-qunit/test-isolation-validation"], function (_exports, _moduleFor, _moduleForComponent, _moduleForModel, _adapter, _qunit, _testLoader, _testHelpers, _testIsolationValidation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setupTest = setupTest;
  _exports.setupRenderingTest = setupRenderingTest;
  _exports.setupApplicationTest = setupApplicationTest;
  _exports.setupTestContainer = setupTestContainer;
  _exports.startTests = startTests;
  _exports.setupTestAdapter = setupTestAdapter;
  _exports.setupEmberTesting = setupEmberTesting;
  _exports.setupEmberOnerrorValidation = setupEmberOnerrorValidation;
  _exports.setupResetOnerror = setupResetOnerror;
  _exports.setupTestIsolationValidation = setupTestIsolationValidation;
  _exports.start = start;
  Object.defineProperty(_exports, "moduleFor", {
    enumerable: true,
    get: function get() {
      return _moduleFor.default;
    }
  });
  Object.defineProperty(_exports, "moduleForComponent", {
    enumerable: true,
    get: function get() {
      return _moduleForComponent.default;
    }
  });
  Object.defineProperty(_exports, "moduleForModel", {
    enumerable: true,
    get: function get() {
      return _moduleForModel.default;
    }
  });
  Object.defineProperty(_exports, "QUnitAdapter", {
    enumerable: true,
    get: function get() {
      return _adapter.default;
    }
  });
  Object.defineProperty(_exports, "nonTestDoneCallback", {
    enumerable: true,
    get: function get() {
      return _adapter.nonTestDoneCallback;
    }
  });
  Object.defineProperty(_exports, "module", {
    enumerable: true,
    get: function get() {
      return _qunit.module;
    }
  });
  Object.defineProperty(_exports, "test", {
    enumerable: true,
    get: function get() {
      return _qunit.test;
    }
  });
  Object.defineProperty(_exports, "skip", {
    enumerable: true,
    get: function get() {
      return _qunit.skip;
    }
  });
  Object.defineProperty(_exports, "only", {
    enumerable: true,
    get: function get() {
      return _qunit.only;
    }
  });
  Object.defineProperty(_exports, "todo", {
    enumerable: true,
    get: function get() {
      return _qunit.todo;
    }
  });
  Object.defineProperty(_exports, "loadTests", {
    enumerable: true,
    get: function get() {
      return _testLoader.loadTests;
    }
  });
  var waitForSettled = true;

  function setupTest(hooks, _options) {
    var options = _options === undefined ? {
      waitForSettled: waitForSettled
    } : Ember.assign({
      waitForSettled: waitForSettled
    }, _options);
    hooks.beforeEach(function (assert) {
      var _this = this;

      var testMetadata = (0, _testHelpers.getTestMetadata)(this);
      testMetadata.framework = 'qunit';
      return (0, _testHelpers.setupContext)(this, options).then(function () {
        var originalPauseTest = _this.pauseTest;

        _this.pauseTest = function QUnit_pauseTest() {
          assert.timeout(-1); // prevent the test from timing out
          // This is a temporary work around for
          // https://github.com/emberjs/ember-qunit/issues/496 this clears the
          // timeout that would fail the test when it hits the global testTimeout
          // value.

          clearTimeout(_qunit.default.config.timeout);
          return originalPauseTest.call(this);
        };
      });
    });
    hooks.afterEach(function () {
      return (0, _testHelpers.teardownContext)(this, options);
    });
  }

  function setupRenderingTest(hooks, _options) {
    var options = _options === undefined ? {
      waitForSettled: waitForSettled
    } : Ember.assign({
      waitForSettled: waitForSettled
    }, _options);
    setupTest(hooks, options);
    hooks.beforeEach(function () {
      return (0, _testHelpers.setupRenderingContext)(this);
    });
    hooks.afterEach(function () {
      return (0, _testHelpers.teardownRenderingContext)(this, options);
    });
  }

  function setupApplicationTest(hooks, _options) {
    var options = _options === undefined ? {
      waitForSettled: waitForSettled
    } : Ember.assign({
      waitForSettled: waitForSettled
    }, _options);
    setupTest(hooks, options);
    hooks.beforeEach(function () {
      return (0, _testHelpers.setupApplicationContext)(this);
    });
    hooks.afterEach(function () {
      return (0, _testHelpers.teardownApplicationContext)(this, options);
    });
  }
  /**
     Uses current URL configuration to setup the test container.
  
     * If `?nocontainer` is set, the test container will be hidden.
     * If `?dockcontainer` or `?devmode` are set the test container will be
       absolutely positioned.
     * If `?devmode` is set, the test container will be made full screen.
  
     @method setupTestContainer
   */


  function setupTestContainer() {
    var testContainer = document.getElementById('ember-testing-container');

    if (!testContainer) {
      return;
    }

    var params = _qunit.default.urlParams;
    var containerVisibility = params.nocontainer ? 'hidden' : 'visible';
    var containerPosition = params.dockcontainer || params.devmode ? 'fixed' : 'relative';

    if (params.devmode) {
      testContainer.className = ' full-screen';
    }

    testContainer.style.visibility = containerVisibility;
    testContainer.style.position = containerPosition;
    var qunitContainer = document.getElementById('qunit');

    if (params.dockcontainer) {
      qunitContainer.style.marginBottom = window.getComputedStyle(testContainer).height;
    }
  }
  /**
     Instruct QUnit to start the tests.
     @method startTests
   */


  function startTests() {
    _qunit.default.start();
  }
  /**
     Sets up the `Ember.Test` adapter for usage with QUnit 2.x.
  
     @method setupTestAdapter
   */


  function setupTestAdapter() {
    Ember.Test.adapter = _adapter.default.create();
  }
  /**
    Ensures that `Ember.testing` is set to `true` before each test begins
    (including `before` / `beforeEach`), and reset to `false` after each test is
    completed. This is done via `QUnit.testStart` and `QUnit.testDone`.
  
   */


  function setupEmberTesting() {
    _qunit.default.testStart(function () {
      Ember.testing = true;
    });

    _qunit.default.testDone(function () {
      Ember.testing = false;
    });
  }
  /**
    Ensures that `Ember.onerror` (if present) is properly configured to re-throw
    errors that occur while `Ember.testing` is `true`.
  */


  function setupEmberOnerrorValidation() {
    _qunit.default.module('ember-qunit: Ember.onerror validation', function () {
      _qunit.default.test('Ember.onerror is functioning properly', function (assert) {
        assert.expect(1);
        var result = (0, _testHelpers.validateErrorHandler)();
        assert.ok(result.isValid, "Ember.onerror handler with invalid testing behavior detected. An Ember.onerror handler _must_ rethrow exceptions when `Ember.testing` is `true` or the test suite is unreliable. See https://git.io/vbine for more details.");
      });
    });
  }

  function setupResetOnerror() {
    _qunit.default.testDone(_testHelpers.resetOnerror);
  }

  function setupTestIsolationValidation(delay) {
    waitForSettled = false;
    Ember.run.backburner.DEBUG = true;

    _qunit.default.on('testStart', function () {
      return (0, _testIsolationValidation.installTestNotIsolatedHook)(delay);
    });
  }
  /**
     @method start
     @param {Object} [options] Options to be used for enabling/disabling behaviors
     @param {Boolean} [options.loadTests] If `false` tests will not be loaded automatically.
     @param {Boolean} [options.setupTestContainer] If `false` the test container will not
     be setup based on `devmode`, `dockcontainer`, or `nocontainer` URL params.
     @param {Boolean} [options.startTests] If `false` tests will not be automatically started
     (you must run `QUnit.start()` to kick them off).
     @param {Boolean} [options.setupTestAdapter] If `false` the default Ember.Test adapter will
     not be updated.
     @param {Boolean} [options.setupEmberTesting] `false` opts out of the
     default behavior of setting `Ember.testing` to `true` before all tests and
     back to `false` after each test will.
     @param {Boolean} [options.setupEmberOnerrorValidation] If `false` validation
     of `Ember.onerror` will be disabled.
     @param {Boolean} [options.setupTestIsolationValidation] If `false` test isolation validation
     will be disabled.
     @param {Number} [options.testIsolationValidationDelay] When using
     setupTestIsolationValidation this number represents the maximum amount of
     time in milliseconds that is allowed _after_ the test is completed for all
     async to have been completed. The default value is 50.
   */


  function start() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (options.loadTests !== false) {
      (0, _testLoader.loadTests)();
    }

    if (options.setupTestContainer !== false) {
      setupTestContainer();
    }

    if (options.setupTestAdapter !== false) {
      setupTestAdapter();
    }

    if (options.setupEmberTesting !== false) {
      setupEmberTesting();
    }

    if (options.setupEmberOnerrorValidation !== false) {
      setupEmberOnerrorValidation();
    }

    if (typeof options.setupTestIsolationValidation !== 'undefined' && options.setupTestIsolationValidation !== false) {
      setupTestIsolationValidation(options.testIsolationValidationDelay);
    }

    if (options.startTests !== false) {
      startTests();
    }

    setupResetOnerror();
  }
});
define("ember-qunit/legacy-2-x/module-for-component", ["exports", "ember-qunit/legacy-2-x/qunit-module", "ember-test-helpers"], function (_exports, _qunitModule, _emberTestHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = moduleForComponent;

  function moduleForComponent(name, description, callbacks) {
    (0, _qunitModule.createModule)(_emberTestHelpers.TestModuleForComponent, name, description, callbacks);
    (true && !(false) && Ember.deprecate("The usage \"moduleForComponent\" is deprecated. Please migrate the \"".concat(name, "\" module to use \"setupRenderingTest\"."), false, {
      id: 'ember-qunit.deprecate-legacy-apis',
      until: '5.0.0',
      url: 'https://github.com/emberjs/ember-qunit/blob/master/docs/migration.md'
    }));
  }
});
define("ember-qunit/legacy-2-x/module-for-model", ["exports", "ember-qunit/legacy-2-x/qunit-module", "ember-test-helpers"], function (_exports, _qunitModule, _emberTestHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = moduleForModel;

  function moduleForModel(name, description, callbacks) {
    (true && !(false) && Ember.deprecate("The usage \"moduleForModel\" is deprecated. Please migrate the \"".concat(name, "\" module to the new test APIs."), false, {
      id: 'ember-qunit.deprecate-legacy-apis',
      until: '5.0.0',
      url: 'https://github.com/emberjs/ember-qunit/blob/master/docs/migration.md'
    }));
    (0, _qunitModule.createModule)(_emberTestHelpers.TestModuleForModel, name, description, callbacks);
  }
});
define("ember-qunit/legacy-2-x/module-for", ["exports", "ember-qunit/legacy-2-x/qunit-module", "ember-test-helpers"], function (_exports, _qunitModule, _emberTestHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = moduleFor;

  function moduleFor(name, description, callbacks) {
    (true && !(false) && Ember.deprecate("The usage \"moduleFor\" is deprecated. Please migrate the \"".concat(name, "\" module to use \"module\""), false, {
      id: 'ember-qunit.deprecate-legacy-apis',
      until: '5.0.0',
      url: 'https://github.com/emberjs/ember-qunit/blob/master/docs/migration.md'
    }));
    (0, _qunitModule.createModule)(_emberTestHelpers.TestModule, name, description, callbacks);
  }
});
define("ember-qunit/legacy-2-x/qunit-module", ["exports", "qunit"], function (_exports, _qunit) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createModule = createModule;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function noop() {}

  function callbackFor(name, callbacks) {
    if (_typeof(callbacks) !== 'object') {
      return noop;
    }

    if (!callbacks) {
      return noop;
    }

    var callback = noop;

    if (callbacks[name]) {
      callback = callbacks[name];
      delete callbacks[name];
    }

    return callback;
  }

  function createModule(Constructor, name, description, callbacks) {
    if (!callbacks && _typeof(description) === 'object') {
      callbacks = description;
      description = name;
    }

    var _before = callbackFor('before', callbacks);

    var _beforeEach = callbackFor('beforeEach', callbacks);

    var _afterEach = callbackFor('afterEach', callbacks);

    var _after = callbackFor('after', callbacks);

    var module;
    var moduleName = typeof description === 'string' ? description : name;
    (0, _qunit.module)(moduleName, {
      before: function before() {
        // storing this in closure scope to avoid exposing these
        // private internals to the test context
        module = new Constructor(name, description, callbacks);
        return _before.apply(this, arguments);
      },
      beforeEach: function beforeEach() {
        var _module,
            _arguments = arguments,
            _this = this;

        // provide the test context to the underlying module
        module.setContext(this);
        return (_module = module).setup.apply(_module, arguments).then(function () {
          return _beforeEach.apply(_this, _arguments);
        });
      },
      afterEach: function afterEach() {
        var _arguments2 = arguments;

        var result = _afterEach.apply(this, arguments);

        return Ember.RSVP.resolve(result).then(function () {
          var _module2;

          return (_module2 = module).teardown.apply(_module2, _toConsumableArray(_arguments2));
        });
      },
      after: function after() {
        try {
          return _after.apply(this, arguments);
        } finally {
          _after = _afterEach = _before = _beforeEach = callbacks = module = null;
        }
      }
    });
  }
});
define("ember-qunit/test-isolation-validation", ["exports", "qunit", "@ember/test-helpers"], function (_exports, _qunit, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.detectIfTestNotIsolated = detectIfTestNotIsolated;
  _exports.installTestNotIsolatedHook = installTestNotIsolatedHook;

  /* eslint-disable no-console */

  /**
   * Detects if a specific test isn't isolated. A test is considered
   * not isolated if it:
   *
   * - has pending timers
   * - is in a runloop
   * - has pending AJAX requests
   * - has pending test waiters
   *
   * @function detectIfTestNotIsolated
   * @param {Object} testInfo
   * @param {string} testInfo.module The name of the test module
   * @param {string} testInfo.name The test name
   */
  function detectIfTestNotIsolated(test) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (!(0, _testHelpers.isSettled)()) {
      var _getSettledState = (0, _testHelpers.getSettledState)(),
          debugInfo = _getSettledState.debugInfo;

      console.group("".concat(test.module.name, ": ").concat(test.testName));
      debugInfo.toConsole();
      console.groupEnd();
      test.expected++;
      test.assert.pushResult({
        result: false,
        message: "".concat(message, " \nMore information has been printed to the console. Please use that information to help in debugging.\n\n")
      });
    }
  }
  /**
   * Installs a hook to detect if a specific test isn't isolated.
   * This hook is installed by patching into the `test.finish` method,
   * which allows us to be very precise as to when the detection occurs.
   *
   * @function installTestNotIsolatedHook
   * @param {number} delay the delay delay to use when checking for isolation validation
   */


  function installTestNotIsolatedHook() {
    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;

    if (!(0, _testHelpers.getDebugInfo)()) {
      return;
    }

    var test = _qunit.default.config.current;
    var finish = test.finish;
    var pushFailure = test.pushFailure;

    test.pushFailure = function (message) {
      if (message.indexOf('Test took longer than') === 0) {
        detectIfTestNotIsolated(this, message);
      } else {
        return pushFailure.apply(this, arguments);
      }
    }; // We're hooking into `test.finish`, which utilizes internal ordering of
    // when a test's hooks are invoked. We do this mainly becuase we need
    // greater precision as to when to detect and subsequently report if the
    // test is isolated.
    //
    // We looked at using:
    // - `afterEach`
    //    - the ordering of when the `afterEach` is called is not easy to guarantee
    //      (ancestor `afterEach`es have to be accounted for too)
    // - `QUnit.on('testEnd')`
    //    - is executed too late; the test is already considered done so
    //      we're unable to push a new assert to fail the current test
    // - 'QUnit.done'
    //    - it detatches the failure from the actual test that failed, making it
    //      more confusing to the end user.


    test.finish = function () {
      var _arguments = arguments,
          _this = this;

      var doFinish = function doFinish() {
        return finish.apply(_this, _arguments);
      };

      if ((0, _testHelpers.isSettled)()) {
        return doFinish();
      } else {
        return (0, _testHelpers.waitUntil)(_testHelpers.isSettled, {
          timeout: delay
        }).catch(function () {// we consider that when waitUntil times out, you're in a state of
          // test isolation violation. The nature of the error is irrelevant
          // in this case, and we want to allow the error to fall through
          // to the finally, where cleanup occurs.
        }).finally(function () {
          detectIfTestNotIsolated(_this, 'Test is not isolated (async execution is extending beyond the duration of the test).'); // canceling timers here isn't perfect, but is as good as we can do
          // to attempt to prevent future tests from failing due to this test's
          // leakage

          Ember.run.cancelTimers();
          return doFinish();
        });
      }
    };
  }
});
define("ember-qunit/test-loader", ["exports", "qunit", "ember-cli-test-loader/test-support/index"], function (_exports, _qunit, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.loadTests = loadTests;
  _exports.TestLoader = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  (0, _index.addModuleExcludeMatcher)(function (moduleName) {
    return _qunit.default.urlParams.nolint && moduleName.match(/\.(jshint|lint-test)$/);
  });
  (0, _index.addModuleIncludeMatcher)(function (moduleName) {
    return moduleName.match(/\.jshint$/);
  });
  var moduleLoadFailures = [];

  _qunit.default.done(function () {
    var length = moduleLoadFailures.length;

    try {
      if (length === 0) {// do nothing
      } else if (length === 1) {
        throw moduleLoadFailures[0];
      } else {
        throw new Error('\n' + moduleLoadFailures.join('\n'));
      }
    } finally {
      // ensure we release previously captured errors.
      moduleLoadFailures = [];
    }
  });

  var TestLoader =
  /*#__PURE__*/
  function (_AbstractTestLoader) {
    _inherits(TestLoader, _AbstractTestLoader);

    function TestLoader() {
      _classCallCheck(this, TestLoader);

      return _possibleConstructorReturn(this, _getPrototypeOf(TestLoader).apply(this, arguments));
    }

    _createClass(TestLoader, [{
      key: "moduleLoadFailure",
      value: function moduleLoadFailure(moduleName, error) {
        moduleLoadFailures.push(error);

        _qunit.default.module('TestLoader Failures');

        _qunit.default.test(moduleName + ': could not be loaded', function () {
          throw error;
        });
      }
    }]);

    return TestLoader;
  }(_index.default);
  /**
     Load tests following the default patterns:
  
     * The module name ends with `-test`
     * The module name ends with `.jshint`
  
     Excludes tests that match the following
     patterns when `?nolint` URL param is set:
  
     * The module name ends with `.jshint`
     * The module name ends with `-lint-test`
  
     @method loadTests
   */


  _exports.TestLoader = TestLoader;

  function loadTests() {
    new TestLoader().loadModules();
  }
});
define('ember-raf-scheduler/test-support/register-waiter', ['exports', 'ember-raf-scheduler'], function (exports, _emberRafScheduler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = registerWaiter;
  function registerWaiter() {
    // We can't rely on the importable Ember since shims are no
    // longer included by default, so use the global instance.
    // eslint-disable-next-line
    Ember.Test.registerWaiter(function () {
      return _emberRafScheduler.default.jobs === 0;
    });
  }
});
define("ember-table/test-support/helpers/element", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getScale = getScale;

  function getScale(element) {
    var rect = element.getBoundingClientRect();

    if (element.offsetHeight === rect.height || rect.height === 0) {
      return 1;
    } else {
      return element.offsetHeight / rect.height;
    }
  }
});
define("ember-table/test-support/helpers/mouse", ["exports", "ember-native-dom-helpers"], function (_exports, _emberNativeDomHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.mouseDown = mouseDown;
  _exports.mouseMove = mouseMove;
  _exports.mouseUp = mouseUp;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function mouseDown(_x, _x2, _x3) {
    return _mouseDown.apply(this, arguments);
  }

  function _mouseDown() {
    _mouseDown = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(target, x, y) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _emberNativeDomHelpers.triggerEvent)(target, 'pointerdown', {
                clientX: x,
                clientY: y,
                button: 0
              });

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _mouseDown.apply(this, arguments);
  }

  function mouseMove(_x4, _x5, _x6) {
    return _mouseMove.apply(this, arguments);
  }

  function _mouseMove() {
    _mouseMove = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(target, x, y) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _emberNativeDomHelpers.triggerEvent)(target, 'pointermove', {
                clientX: x,
                clientY: y,
                button: 0
              });

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _mouseMove.apply(this, arguments);
  }

  function mouseUp(_x7, _x8, _x9) {
    return _mouseUp.apply(this, arguments);
  }

  function _mouseUp() {
    _mouseUp = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(target, x, y) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _emberNativeDomHelpers.triggerEvent)(target, 'pointerup', {
                clientX: x,
                clientY: y,
                button: 0
              });

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _mouseUp.apply(this, arguments);
  }
});
define("ember-table/test-support/index", ["exports", "ember-table/test-support/pages/ember-table"], function (_exports, _emberTable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "TablePage", {
    enumerable: true,
    get: function get() {
      return _emberTable.default;
    }
  });
});
define("ember-table/test-support/pages/-private/ember-table-body", ["exports", "ember-classy-page-object", "ember-classy-page-object/extend", "ember-native-dom-helpers"], function (_exports, _emberClassyPageObject, _extend, _emberNativeDomHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  var _default = _emberClassyPageObject.default.extend({
    scope: 'tbody',

    /**
      Returns the number of rows in the body.
    */
    get rowCount() {
      return Number((0, _extend.findElement)(this).getAttribute('data-test-row-count'));
    },

    /**
      List of rows in table body. Each of property/function in this collections is the property/func
      of a single row selected by using calling rows.objectAt(index).
    */
    rows: (0, _emberClassyPageObject.collection)({
      scope: 'tr',

      /**
        List of all cells for the selected row.
      */
      cells: (0, _emberClassyPageObject.collection)({
        scope: 'td',
        doubleClick: (0, _emberClassyPageObject.triggerable)('dblclick')
      }),

      /**
        Returns the height of selected row.
      */
      get height() {
        return (0, _extend.findElement)(this).offsetHeight;
      },

      checkbox: {
        scope: '[data-test-select-row]',
        isChecked: (0, _emberClassyPageObject.property)('checked'),
        clickWith: function () {
          var _clickWith = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(options) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _emberNativeDomHelpers.click)((0, _extend.findElement)(this), options);

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function clickWith(_x) {
            return _clickWith.apply(this, arguments);
          }

          return clickWith;
        }()
      },
      checkboxContainer: {
        scope: '[data-test-select-row-container]',
        isHidden: (0, _emberClassyPageObject.hasClass)('et-speech-only')
      },
      toggleSelect: (0, _emberClassyPageObject.alias)('checkbox.click'),
      collapse: {
        scope: '[data-test-collapse-row]',
        isCollapsed: (0, _emberClassyPageObject.property)('checked')
      },
      toggleCollapse: (0, _emberClassyPageObject.alias)('collapse.click'),
      isSelected: (0, _emberClassyPageObject.hasClass)('is-selected'),

      /**
        Helper function to click with options like the meta key and ctrl key set
         @param {Object} options - click event options
      */
      clickWith: function () {
        var _clickWith2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(options) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return (0, _emberNativeDomHelpers.click)((0, _extend.findElement)(this), options);

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function clickWith(_x2) {
          return _clickWith2.apply(this, arguments);
        }

        return clickWith;
      }(),
      doubleClick: (0, _emberClassyPageObject.triggerable)('dblclick')
    }),

    /**
      A shortcut to return cell page object specified by row & column indexes.
    */
    getCell: function getCell(rowIndex, columnIndex) {
      return this.rows.objectAt(rowIndex).cells.objectAt(columnIndex);
    }
  });

  _exports.default = _default;
});
define("ember-table/test-support/pages/-private/ember-table-footer", ["exports", "ember-classy-page-object", "ember-table/test-support/pages/-private/ember-table-body"], function (_exports, _emberClassyPageObject, _emberTableBody) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _emberTableBody.default.extend({
    scope: 'tfoot',
    footers: (0, _emberClassyPageObject.collection)({
      scope: 'td'
    })
  });

  _exports.default = _default;
});
define("ember-table/test-support/pages/-private/ember-table-header", ["exports", "ember-classy-page-object", "ember-classy-page-object/extend", "ember-native-dom-helpers", "ember-table/test-support/helpers/mouse", "ember-table/test-support/helpers/element"], function (_exports, _emberClassyPageObject, _extend, _emberNativeDomHelpers, _mouse, _element) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.ResizePage = _exports.SortPage = void 0;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  var SortPage = _emberClassyPageObject.default.extend({
    indicator: {
      scope: '[data-test-sort-indicator]',
      isAscending: (0, _emberClassyPageObject.hasClass)('is-ascending'),
      isDescending: (0, _emberClassyPageObject.hasClass)('is-descending')
    },
    toggle: {
      scope: '[data-test-sort-toggle]'
    }
  });

  _exports.SortPage = SortPage;

  var ResizePage = _emberClassyPageObject.default.extend({
    scope: '[data-test-resize-handle]'
  });

  _exports.ResizePage = ResizePage;

  var Header = _emberClassyPageObject.default.extend({
    get text() {
      return (0, _extend.findElement)(this).innerText.replace(/\s+/g, ' ').trim();
    },

    /**
     * Retrieves selected header cell width.
     */
    get width() {
      return (0, _extend.findElement)(this).offsetWidth;
    },

    /**
     * Retrieves selected header cell height.
     */
    get height() {
      return (0, _extend.findElement)(this).offsetHeight;
    },

    get isLeaf() {
      return (0, _extend.findElement)(this).dataset.testLeafHeader;
    },

    isFixedLeft: (0, _emberClassyPageObject.hasClass)('is-fixed-left'),
    isFixedRight: (0, _emberClassyPageObject.hasClass)('is-fixed-right'),
    contextMenu: (0, _emberClassyPageObject.triggerable)('contextmenu'),

    /**
     * Resizes this column by dragging right border several pixels.
     */
    resize: function () {
      var _resize = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(targetSize) {
        var resizeHandle, box, startX, deltaX;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                resizeHandle = (0, _extend.findElement)(this, '.et-header-resize-area');

                if (resizeHandle) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                box = resizeHandle.getBoundingClientRect();
                startX = (box.right + box.left) / 2;
                deltaX = (targetSize - this.width) / (0, _element.getScale)(resizeHandle);

                if (this.isFixedRight) {
                  deltaX = -deltaX;
                }

                _context.next = 9;
                return (0, _mouse.mouseDown)(resizeHandle, startX, resizeHandle.clientHeight / 2);

              case 9:
                _context.next = 11;
                return (0, _mouse.mouseMove)(resizeHandle, startX + 20, resizeHandle.clientHeight / 2);

              case 11:
                _context.next = 13;
                return (0, _mouse.mouseMove)(resizeHandle, startX + deltaX, resizeHandle.clientHeight / 2);

              case 13:
                _context.next = 15;
                return (0, _mouse.mouseUp)(resizeHandle, startX + deltaX, resizeHandle.clientHeight / 2);

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resize(_x) {
        return _resize.apply(this, arguments);
      }

      return resize;
    }(),

    /**
     * Moves this header to left (or right).
     *
     * @params deltaPosition Indicates how many index this column should move. This is a positive
     *    number if the column is moved to its right and negative if it's moved to its left.
     */
    reorderBy: function () {
      var _reorderBy = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(deltaPosition) {
        var header, targetElement, headerBox, targetBox, deltaX, startX;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                header = (0, _extend.findElement)(this);
                targetElement = header;

                while (deltaPosition !== 0) {
                  if (deltaPosition < 0) {
                    deltaPosition++;
                    targetElement = targetElement.previousElementSibling ? targetElement.previousElementSibling : targetElement;
                  } else {
                    deltaPosition--;
                    targetElement = targetElement.nextElementSibling ? targetElement.nextElementSibling : targetElement;
                  }
                }

                headerBox = header.getBoundingClientRect();
                targetBox = targetElement.getBoundingClientRect();
                deltaX = targetBox.left - headerBox.left;
                startX = (headerBox.right + headerBox.left) / 2;
                _context2.next = 9;
                return (0, _mouse.mouseDown)(header, startX - 20, header.clientHeight / 2);

              case 9:
                _context2.next = 11;
                return (0, _mouse.mouseMove)(header, startX, header.clientHeight / 2);

              case 11:
                _context2.next = 13;
                return (0, _mouse.mouseMove)(header, startX + deltaX, header.clientHeight / 2);

              case 13:
                _context2.next = 15;
                return (0, _mouse.mouseUp)(header, startX + deltaX, header.clientHeight / 2);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function reorderBy(_x2) {
        return _reorderBy.apply(this, arguments);
      }

      return reorderBy;
    }(),

    /**
      Helper function to click with options like the meta key and ctrl key set
       @param {Object} options - click event options
    */
    clickWith: function () {
      var _clickWith = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(options) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _emberNativeDomHelpers.click)((0, _extend.findElement)(this), options);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function clickWith(_x3) {
        return _clickWith.apply(this, arguments);
      }

      return clickWith;
    }(),
    isSortable: (0, _emberClassyPageObject.hasClass)('is-sortable'),
    sort: SortPage,
    sortIndicator: (0, _emberClassyPageObject.alias)('sort.indicator'),
    sortToggle: (0, _emberClassyPageObject.alias)('sort.toggle'),
    resizeHandle: ResizePage
  });

  var _default = {
    scope: 'thead',

    /**
     * List of columns in the header.
     */
    headers: (0, _emberClassyPageObject.collection)('th', Header),

    /**
      Returns the number of rows in the footer.
    */
    get rowCount() {
      return Number((0, _extend.findElement)(this).getAttribute('data-test-row-count'));
    },

    rows: (0, _emberClassyPageObject.collection)({
      scope: 'tr'
    })
  };
  _exports.default = _default;
});
define("ember-table/test-support/pages/ember-table", ["exports", "ember-classy-page-object", "ember-classy-page-object/extend", "ember-table/test-support/pages/-private/ember-table-body", "ember-table/test-support/pages/-private/ember-table-footer", "ember-table/test-support/pages/-private/ember-table-header"], function (_exports, _emberClassyPageObject, _extend, _emberTableBody, _emberTableFooter, _emberTableHeader) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  /**
   * Ember Table page object. Use this page object and its nested header/body object to retrieve table
   * data and manipulate table in test.
   */
  var _default = _emberClassyPageObject.default.extend({
    scope: '[data-test-ember-table]',

    /**
     * Page object for table header.
     */
    header: _emberTableHeader.default,

    /**
     * Page object for table body.
     */
    body: _emberTableBody.default,

    /**
     * Page object for table footer.
     */
    footer: _emberTableFooter.default,
    rows: (0, _emberClassyPageObject.alias)('body.rows'),
    getCell: (0, _emberClassyPageObject.alias)('body.getCell'),
    headers: (0, _emberClassyPageObject.alias)('header.headers'),
    footers: (0, _emberClassyPageObject.alias)('footer.footers'),

    /**
     * Returns the table width.
     */
    get width() {
      return (0, _extend.findElement)(this, 'table').offsetWidth;
    },

    /**
     * Returns the table container width.
     */
    get containerWidth() {
      return (0, _extend.findElement)(this).offsetWidth;
    },

    /**
     * Selects a row in the body
     *
     * @param {number} index
     */
    selectRow: function () {
      var _selectRow = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(index) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.body.rows.objectAt(index).click();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function selectRow(_x) {
        return _selectRow.apply(this, arguments);
      }

      return selectRow;
    }(),

    /**
     * Toggles a row in the body
     *
     * @param {number} index
     */
    toggleRow: function () {
      var _toggleRow = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(index) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.body.rows.objectAt(index).clickWith({
                  metaKey: true
                });

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function toggleRow(_x2) {
        return _toggleRow.apply(this, arguments);
      }

      return toggleRow;
    }(),

    /**
     * Selects a range of rows in the body
     *
     * @param {number} beginIndex
     * @param {number} endIndex
     */
    selectRange: function () {
      var _selectRange = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(beginIndex, endIndex) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.body.rows.objectAt(beginIndex).click();

              case 2:
                _context3.next = 4;
                return this.body.rows.objectAt(endIndex).clickWith({
                  shiftKey: true
                });

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function selectRange(_x3, _x4) {
        return _selectRange.apply(this, arguments);
      }

      return selectRange;
    }()
  });

  _exports.default = _default;
});
define("ember-test-helpers/has-ember-version", ["exports", "@ember/test-helpers/has-ember-version"], function (_exports, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function get() {
      return _hasEmberVersion.default;
    }
  });
});
define("ember-test-helpers/index", ["exports", "@ember/test-helpers", "ember-test-helpers/legacy-0-6-x/test-module", "ember-test-helpers/legacy-0-6-x/test-module-for-acceptance", "ember-test-helpers/legacy-0-6-x/test-module-for-component", "ember-test-helpers/legacy-0-6-x/test-module-for-model"], function (_exports, _testHelpers, _testModule, _testModuleForAcceptance, _testModuleForComponent, _testModuleForModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    TestModule: true,
    TestModuleForAcceptance: true,
    TestModuleForComponent: true,
    TestModuleForModel: true
  };
  Object.defineProperty(_exports, "TestModule", {
    enumerable: true,
    get: function get() {
      return _testModule.default;
    }
  });
  Object.defineProperty(_exports, "TestModuleForAcceptance", {
    enumerable: true,
    get: function get() {
      return _testModuleForAcceptance.default;
    }
  });
  Object.defineProperty(_exports, "TestModuleForComponent", {
    enumerable: true,
    get: function get() {
      return _testModuleForComponent.default;
    }
  });
  Object.defineProperty(_exports, "TestModuleForModel", {
    enumerable: true,
    get: function get() {
      return _testModuleForModel.default;
    }
  });
  Object.keys(_testHelpers).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _testHelpers[key];
      }
    });
  });
});
define("ember-test-helpers/legacy-0-6-x/-legacy-overrides", ["exports", "ember-test-helpers/has-ember-version"], function (_exports, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.preGlimmerSetupIntegrationForComponent = preGlimmerSetupIntegrationForComponent;

  function preGlimmerSetupIntegrationForComponent() {
    var module = this;
    var context = this.context;
    this.actionHooks = {};
    context.dispatcher = this.container.lookup('event_dispatcher:main') || Ember.EventDispatcher.create();
    context.dispatcher.setup({}, '#ember-testing');
    context.actions = module.actionHooks;
    (this.registry || this.container).register('component:-test-holder', Ember.Component.extend());

    context.render = function (template) {
      // in case `this.render` is called twice, make sure to teardown the first invocation
      module.teardownComponent();

      if (!template) {
        throw new Error('in a component integration test you must pass a template to `render()`');
      }

      if (Ember.isArray(template)) {
        template = template.join('');
      }

      if (typeof template === 'string') {
        template = Ember.Handlebars.compile(template);
      }

      module.component = module.container.lookupFactory('component:-test-holder').create({
        layout: template
      });
      module.component.set('context', context);
      module.component.set('controller', context);
      Ember.run(function () {
        module.component.appendTo('#ember-testing');
      });
      context._element = module.component.element;
    };

    context.$ = function () {
      return module.component.$.apply(module.component, arguments);
    };

    context.set = function (key, value) {
      var ret = Ember.run(function () {
        return Ember.set(context, key, value);
      });

      if ((0, _hasEmberVersion.default)(2, 0)) {
        return ret;
      }
    };

    context.setProperties = function (hash) {
      var ret = Ember.run(function () {
        return Ember.setProperties(context, hash);
      });

      if ((0, _hasEmberVersion.default)(2, 0)) {
        return ret;
      }
    };

    context.get = function (key) {
      return Ember.get(context, key);
    };

    context.getProperties = function () {
      var args = Array.prototype.slice.call(arguments);
      return Ember.getProperties(context, args);
    };

    context.on = function (actionName, handler) {
      module.actionHooks[actionName] = handler;
    };

    context.send = function (actionName) {
      var hook = module.actionHooks[actionName];

      if (!hook) {
        throw new Error('integration testing template received unexpected action ' + actionName);
      }

      hook.apply(module, Array.prototype.slice.call(arguments, 1));
    };

    context.clearRender = function () {
      module.teardownComponent();
    };
  }
});
define("ember-test-helpers/legacy-0-6-x/abstract-test-module", ["exports", "ember-test-helpers/legacy-0-6-x/ext/rsvp", "@ember/test-helpers/settled", "@ember/test-helpers"], function (_exports, _rsvp, _settled, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _default =
  /*#__PURE__*/
  function () {
    function _default(name, options) {
      _classCallCheck(this, _default);

      this.context = undefined;
      this.name = name;
      this.callbacks = options || {};
      this.initSetupSteps();
      this.initTeardownSteps();
    }

    _createClass(_default, [{
      key: "setup",
      value: function setup(assert) {
        var _this = this;

        Ember.testing = true;
        Ember.run.backburner.DEBUG = true;
        return this.invokeSteps(this.setupSteps, this, assert).then(function () {
          _this.contextualizeCallbacks();

          return _this.invokeSteps(_this.contextualizedSetupSteps, _this.context, assert);
        });
      }
    }, {
      key: "teardown",
      value: function teardown(assert) {
        var _this2 = this;

        return this.invokeSteps(this.contextualizedTeardownSteps, this.context, assert).then(function () {
          return _this2.invokeSteps(_this2.teardownSteps, _this2, assert);
        }).then(function () {
          _this2.cache = null;
          _this2.cachedCalls = null;
        }).finally(function () {
          Ember.testing = false;
        });
      }
    }, {
      key: "initSetupSteps",
      value: function initSetupSteps() {
        this.setupSteps = [];
        this.contextualizedSetupSteps = [];

        if (this.callbacks.beforeSetup) {
          this.setupSteps.push(this.callbacks.beforeSetup);
          delete this.callbacks.beforeSetup;
        }

        this.setupSteps.push(this.setupContext);
        this.setupSteps.push(this.setupTestElements);
        this.setupSteps.push(this.setupAJAXListeners);
        this.setupSteps.push(this.setupPromiseListeners);

        if (this.callbacks.setup) {
          this.contextualizedSetupSteps.push(this.callbacks.setup);
          delete this.callbacks.setup;
        }
      }
    }, {
      key: "invokeSteps",
      value: function invokeSteps(steps, context, assert) {
        steps = steps.slice();

        function nextStep() {
          var step = steps.shift();

          if (step) {
            // guard against exceptions, for example missing components referenced from needs.
            return new Ember.RSVP.Promise(function (resolve) {
              resolve(step.call(context, assert));
            }).then(nextStep);
          } else {
            return Ember.RSVP.resolve();
          }
        }

        return nextStep();
      }
    }, {
      key: "contextualizeCallbacks",
      value: function contextualizeCallbacks() {}
    }, {
      key: "initTeardownSteps",
      value: function initTeardownSteps() {
        this.teardownSteps = [];
        this.contextualizedTeardownSteps = [];

        if (this.callbacks.teardown) {
          this.contextualizedTeardownSteps.push(this.callbacks.teardown);
          delete this.callbacks.teardown;
        }

        this.teardownSteps.push(this.teardownContext);
        this.teardownSteps.push(this.teardownTestElements);
        this.teardownSteps.push(this.teardownAJAXListeners);
        this.teardownSteps.push(this.teardownPromiseListeners);

        if (this.callbacks.afterTeardown) {
          this.teardownSteps.push(this.callbacks.afterTeardown);
          delete this.callbacks.afterTeardown;
        }
      }
    }, {
      key: "setupTestElements",
      value: function setupTestElements() {
        var testElementContainer = document.querySelector('#ember-testing-container');

        if (!testElementContainer) {
          testElementContainer = document.createElement('div');
          testElementContainer.setAttribute('id', 'ember-testing-container');
          document.body.appendChild(testElementContainer);
        }

        var testEl = document.querySelector('#ember-testing');

        if (!testEl) {
          var element = document.createElement('div');
          element.setAttribute('id', 'ember-testing');
          testElementContainer.appendChild(element);
          this.fixtureResetValue = '';
        } else {
          this.fixtureResetValue = testElementContainer.innerHTML;
        }
      }
    }, {
      key: "setupContext",
      value: function setupContext(options) {
        var context = this.getContext();
        Ember.assign(context, {
          dispatcher: null,
          inject: {}
        }, options);
        this.setToString();
        (0, _testHelpers.setContext)(context);
        this.context = context;
      }
    }, {
      key: "setContext",
      value: function setContext(context) {
        this.context = context;
      }
    }, {
      key: "getContext",
      value: function getContext() {
        if (this.context) {
          return this.context;
        }

        return this.context = (0, _testHelpers.getContext)() || {};
      }
    }, {
      key: "setToString",
      value: function setToString() {
        var _this3 = this;

        this.context.toString = function () {
          if (_this3.subjectName) {
            return "test context for: ".concat(_this3.subjectName);
          }

          if (_this3.name) {
            return "test context for: ".concat(_this3.name);
          }
        };
      }
    }, {
      key: "setupAJAXListeners",
      value: function setupAJAXListeners() {
        (0, _settled._setupAJAXHooks)();
      }
    }, {
      key: "teardownAJAXListeners",
      value: function teardownAJAXListeners() {
        (0, _settled._teardownAJAXHooks)();
      }
    }, {
      key: "setupPromiseListeners",
      value: function setupPromiseListeners() {
        (0, _rsvp._setupPromiseListeners)();
      }
    }, {
      key: "teardownPromiseListeners",
      value: function teardownPromiseListeners() {
        (0, _rsvp._teardownPromiseListeners)();
      }
    }, {
      key: "teardownTestElements",
      value: function teardownTestElements() {
        document.getElementById('ember-testing-container').innerHTML = this.fixtureResetValue; // Ember 2.0.0 removed Ember.View as public API, so only do this when
        // Ember.View is present

        if (Ember.View && Ember.View.views) {
          Ember.View.views = {};
        }
      }
    }, {
      key: "teardownContext",
      value: function teardownContext() {
        var context = this.context;
        this.context = undefined;
        (0, _testHelpers.unsetContext)();

        if (context && context.dispatcher && !context.dispatcher.isDestroyed) {
          Ember.run(function () {
            context.dispatcher.destroy();
          });
        }
      }
    }]);

    return _default;
  }();

  _exports.default = _default;
});
define("ember-test-helpers/legacy-0-6-x/build-registry", ["exports", "require"], function (_exports, _require) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function exposeRegistryMethodsWithoutDeprecations(container) {
    var methods = ['register', 'unregister', 'resolve', 'normalize', 'typeInjection', 'injection', 'factoryInjection', 'factoryTypeInjection', 'has', 'options', 'optionsForType'];

    function exposeRegistryMethod(container, method) {
      if (method in container) {
        container[method] = function () {
          return container._registry[method].apply(container._registry, arguments);
        };
      }
    }

    for (var i = 0, l = methods.length; i < l; i++) {
      exposeRegistryMethod(container, methods[i]);
    }
  }

  var Owner = function () {
    if (Ember._RegistryProxyMixin && Ember._ContainerProxyMixin) {
      return Ember.Object.extend(Ember._RegistryProxyMixin, Ember._ContainerProxyMixin, {
        _emberTestHelpersMockOwner: true
      });
    }

    return Ember.Object.extend({
      _emberTestHelpersMockOwner: true
    });
  }();

  function _default(resolver) {
    var fallbackRegistry, registry, container;
    var namespace = Ember.Object.create({
      Resolver: {
        create: function create() {
          return resolver;
        }
      }
    });

    function register(name, factory) {
      var thingToRegisterWith = registry || container;

      if (!(container.factoryFor ? container.factoryFor(name) : container.lookupFactory(name))) {
        thingToRegisterWith.register(name, factory);
      }
    }

    if (Ember.Application.buildRegistry) {
      fallbackRegistry = Ember.Application.buildRegistry(namespace);
      fallbackRegistry.register('component-lookup:main', Ember.ComponentLookup);
      registry = new Ember.Registry({
        fallback: fallbackRegistry
      });

      if (Ember.ApplicationInstance && Ember.ApplicationInstance.setupRegistry) {
        Ember.ApplicationInstance.setupRegistry(registry);
      } // these properties are set on the fallback registry by `buildRegistry`
      // and on the primary registry within the ApplicationInstance constructor
      // but we need to manually recreate them since ApplicationInstance's are not
      // exposed externally


      registry.normalizeFullName = fallbackRegistry.normalizeFullName;
      registry.makeToString = fallbackRegistry.makeToString;
      registry.describe = fallbackRegistry.describe;
      var owner = Owner.create({
        __registry__: registry,
        __container__: null
      });
      container = registry.container({
        owner: owner
      });
      owner.__container__ = container;
      exposeRegistryMethodsWithoutDeprecations(container);
    } else {
      container = Ember.Application.buildContainer(namespace);
      container.register('component-lookup:main', Ember.ComponentLookup);
    } // Ember 1.10.0 did not properly add `view:toplevel` or `view:default`
    // to the registry in Ember.Application.buildRegistry :(
    //
    // Ember 2.0.0 removed Ember.View as public API, so only do this when
    // Ember.View is present


    if (Ember.View) {
      register('view:toplevel', Ember.View.extend());
    } // Ember 2.0.0 removed Ember._MetamorphView from the Ember global, so only
    // do this when present


    if (Ember._MetamorphView) {
      register('view:default', Ember._MetamorphView);
    }

    var globalContext = (typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object' && global || self;

    if (requirejs.entries['ember-data/setup-container']) {
      // ember-data is a proper ember-cli addon since 2.3; if no 'import
      // 'ember-data'' is present somewhere in the tests, there is also no `DS`
      // available on the globalContext and hence ember-data wouldn't be setup
      // correctly for the tests; that's why we import and call setupContainer
      // here; also see https://github.com/emberjs/data/issues/4071 for context
      var setupContainer = (0, _require.default)("ember-data/setup-container")['default'];
      setupContainer(registry || container);
    } else if (globalContext.DS) {
      var DS = globalContext.DS;

      if (DS._setupContainer) {
        DS._setupContainer(registry || container);
      } else {
        register('transform:boolean', DS.BooleanTransform);
        register('transform:date', DS.DateTransform);
        register('transform:number', DS.NumberTransform);
        register('transform:string', DS.StringTransform);
        register('serializer:-default', DS.JSONSerializer);
        register('serializer:-rest', DS.RESTSerializer);
        register('adapter:-rest', DS.RESTAdapter);
      }
    }

    return {
      registry: registry,
      container: container,
      owner: owner
    };
  }
});
define("ember-test-helpers/legacy-0-6-x/ext/rsvp", ["exports", "ember-test-helpers/has-ember-version"], function (_exports, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports._setupPromiseListeners = _setupPromiseListeners;
  _exports._teardownPromiseListeners = _teardownPromiseListeners;
  var originalAsync;
  /**
    Configures `RSVP` to resolve promises on the run-loop's action queue. This is
    done by Ember internally since Ember 1.7 and it is only needed to
    provide a consistent testing experience for users of Ember < 1.7.
  
    @private
  */

  function _setupPromiseListeners() {
    if (!(0, _hasEmberVersion.default)(1, 7)) {
      originalAsync = Ember.RSVP.configure('async');
      Ember.RSVP.configure('async', function (callback, promise) {
        Ember.run.backburner.schedule('actions', function () {
          callback(promise);
        });
      });
    }
  }
  /**
    Resets `RSVP`'s `async` to its prior value.
  
    @private
  */


  function _teardownPromiseListeners() {
    if (!(0, _hasEmberVersion.default)(1, 7)) {
      Ember.RSVP.configure('async', originalAsync);
    }
  }
});
define("ember-test-helpers/legacy-0-6-x/test-module-for-acceptance", ["exports", "ember-test-helpers/legacy-0-6-x/abstract-test-module", "@ember/test-helpers"], function (_exports, _abstractTestModule, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _default =
  /*#__PURE__*/
  function (_AbstractTestModule) {
    _inherits(_default, _AbstractTestModule);

    function _default() {
      _classCallCheck(this, _default);

      return _possibleConstructorReturn(this, _getPrototypeOf(_default).apply(this, arguments));
    }

    _createClass(_default, [{
      key: "setupContext",
      value: function setupContext() {
        _get(_getPrototypeOf(_default.prototype), "setupContext", this).call(this, {
          application: this.createApplication()
        });
      }
    }, {
      key: "teardownContext",
      value: function teardownContext() {
        Ember.run(function () {
          (0, _testHelpers.getContext)().application.destroy();
        });

        _get(_getPrototypeOf(_default.prototype), "teardownContext", this).call(this);
      }
    }, {
      key: "createApplication",
      value: function createApplication() {
        var _this$callbacks = this.callbacks,
            Application = _this$callbacks.Application,
            config = _this$callbacks.config;
        var application;
        Ember.run(function () {
          application = Application.create(config);
          application.setupForTesting();
          application.injectTestHelpers();
        });
        return application;
      }
    }]);

    return _default;
  }(_abstractTestModule.default);

  _exports.default = _default;
});
define("ember-test-helpers/legacy-0-6-x/test-module-for-component", ["exports", "ember-test-helpers/legacy-0-6-x/test-module", "ember-test-helpers/has-ember-version", "ember-test-helpers/legacy-0-6-x/-legacy-overrides"], function (_exports, _testModule, _hasEmberVersion, _legacyOverrides) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setupComponentIntegrationTest = _setupComponentIntegrationTest;
  _exports.default = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var ACTION_KEY;

  if ((0, _hasEmberVersion.default)(2, 0)) {
    ACTION_KEY = 'actions';
  } else {
    ACTION_KEY = '_actions';
  }

  var isPreGlimmer = !(0, _hasEmberVersion.default)(1, 13);

  var _default =
  /*#__PURE__*/
  function (_TestModule) {
    _inherits(_default, _TestModule);

    function _default(componentName, description, callbacks) {
      var _this2;

      _classCallCheck(this, _default);

      // Allow `description` to be omitted
      if (!callbacks && _typeof(description) === 'object') {
        callbacks = description;
        description = null;
      } else if (!callbacks) {
        callbacks = {};
      }

      var integrationOption = callbacks.integration;
      var hasNeeds = Array.isArray(callbacks.needs);
      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, 'component:' + componentName, description, callbacks));
      _this2.componentName = componentName;

      if (hasNeeds || callbacks.unit || integrationOption === false) {
        _this2.isUnitTest = true;
      } else if (integrationOption) {
        _this2.isUnitTest = false;
      } else {
        (true && !(false) && Ember.deprecate('the component:' + componentName + ' test module is implicitly running in unit test mode, ' + 'which will change to integration test mode by default in an upcoming version of ' + 'ember-test-helpers. Add `unit: true` or a `needs:[]` list to explicitly opt in to unit ' + 'test mode.', false, {
          id: 'ember-test-helpers.test-module-for-component.test-type',
          until: '0.6.0'
        }));
        _this2.isUnitTest = true;
      }

      if (!_this2.isUnitTest && !_this2.isLegacy) {
        callbacks.integration = true;
      }

      if (_this2.isUnitTest || _this2.isLegacy) {
        _this2.setupSteps.push(_this2.setupComponentUnitTest);
      } else {
        _this2.callbacks.subject = function () {
          throw new Error("component integration tests do not support `subject()`. Instead, render the component as if it were HTML: `this.render('<my-component foo=true>');`. For more information, read: http://guides.emberjs.com/current/testing/testing-components/");
        };

        _this2.setupSteps.push(_this2.setupComponentIntegrationTest);

        _this2.teardownSteps.unshift(_this2.teardownComponent);
      }

      if (Ember.View && Ember.View.views) {
        _this2.setupSteps.push(_this2._aliasViewRegistry);

        _this2.teardownSteps.unshift(_this2._resetViewRegistry);
      }

      return _this2;
    }

    _createClass(_default, [{
      key: "initIntegration",
      value: function initIntegration(options) {
        this.isLegacy = options.integration === 'legacy';
        this.isIntegration = options.integration !== 'legacy';
      }
    }, {
      key: "_aliasViewRegistry",
      value: function _aliasViewRegistry() {
        this._originalGlobalViewRegistry = Ember.View.views;
        var viewRegistry = this.container.lookup('-view-registry:main');

        if (viewRegistry) {
          Ember.View.views = viewRegistry;
        }
      }
    }, {
      key: "_resetViewRegistry",
      value: function _resetViewRegistry() {
        Ember.View.views = this._originalGlobalViewRegistry;
      }
    }, {
      key: "setupComponentUnitTest",
      value: function setupComponentUnitTest() {
        var _this = this;

        var resolver = this.resolver;
        var context = this.context;
        var layoutName = 'template:components/' + this.componentName;
        var layout = resolver.resolve(layoutName);
        var thingToRegisterWith = this.registry || this.container;

        if (layout) {
          thingToRegisterWith.register(layoutName, layout);
          thingToRegisterWith.injection(this.subjectName, 'layout', layoutName);
        }

        var eventDispatcher = resolver.resolve('event_dispatcher:main');

        if (eventDispatcher) {
          thingToRegisterWith.register('event_dispatcher:main', eventDispatcher);
        }

        context.dispatcher = this.container.lookup('event_dispatcher:main') || Ember.EventDispatcher.create();
        context.dispatcher.setup({}, '#ember-testing');
        context._element = null;

        this.callbacks.render = function () {
          var subject;
          Ember.run(function () {
            subject = context.subject();
            subject.appendTo('#ember-testing');
          });
          context._element = subject.element;

          _this.teardownSteps.unshift(function () {
            Ember.run(function () {
              Ember.tryInvoke(subject, 'destroy');
            });
          });
        };

        this.callbacks.append = function () {
          (true && !(false) && Ember.deprecate('this.append() is deprecated. Please use this.render() or this.$() instead.', false, {
            id: 'ember-test-helpers.test-module-for-component.append',
            until: '0.6.0'
          }));
          return context.$();
        };

        context.$ = function () {
          this.render();
          var subject = this.subject();
          return subject.$.apply(subject, arguments);
        };
      }
    }, {
      key: "setupComponentIntegrationTest",
      value: function setupComponentIntegrationTest() {
        if (isPreGlimmer) {
          return _legacyOverrides.preGlimmerSetupIntegrationForComponent.apply(this, arguments);
        } else {
          return _setupComponentIntegrationTest.apply(this, arguments);
        }
      }
    }, {
      key: "setupContext",
      value: function setupContext() {
        _get(_getPrototypeOf(_default.prototype), "setupContext", this).call(this); // only setup the injection if we are running against a version
        // of Ember that has `-view-registry:main` (Ember >= 1.12)


        if (this.container.factoryFor ? this.container.factoryFor('-view-registry:main') : this.container.lookupFactory('-view-registry:main')) {
          (this.registry || this.container).injection('component', '_viewRegistry', '-view-registry:main');
        }

        if (!this.isUnitTest && !this.isLegacy) {
          this.context.factory = function () {};
        }
      }
    }, {
      key: "teardownComponent",
      value: function teardownComponent() {
        var component = this.component;

        if (component) {
          Ember.run(component, 'destroy');
          this.component = null;
        }
      }
    }]);

    return _default;
  }(_testModule.default);

  _exports.default = _default;

  function getOwnerFromModule(module) {
    return Ember.getOwner && Ember.getOwner(module.container) || module.container.owner;
  }

  function lookupTemplateFromModule(module, templateFullName) {
    var template = module.container.lookup(templateFullName);
    if (typeof template === 'function') template = template(getOwnerFromModule(module));
    return template;
  }

  function _setupComponentIntegrationTest() {
    var module = this;
    var context = this.context;
    this.actionHooks = context[ACTION_KEY] = {};
    context.dispatcher = this.container.lookup('event_dispatcher:main') || Ember.EventDispatcher.create();
    context.dispatcher.setup({}, '#ember-testing');
    var hasRendered = false;
    var OutletView = module.container.factoryFor ? module.container.factoryFor('view:-outlet') : module.container.lookupFactory('view:-outlet');
    var OutletTemplate = lookupTemplateFromModule(module, 'template:-outlet');
    var toplevelView = module.component = OutletView.create();
    var hasOutletTemplate = !!OutletTemplate;
    var outletState = {
      render: {
        owner: getOwnerFromModule(module),
        into: undefined,
        outlet: 'main',
        name: 'application',
        controller: module.context,
        ViewClass: undefined,
        template: OutletTemplate
      },
      outlets: {}
    };
    var element = document.getElementById('ember-testing');
    var templateId = 0;

    if (hasOutletTemplate) {
      Ember.run(function () {
        toplevelView.setOutletState(outletState);
      });
    }

    context.render = function (template) {
      if (!template) {
        throw new Error('in a component integration test you must pass a template to `render()`');
      }

      if (Ember.isArray(template)) {
        template = template.join('');
      }

      if (typeof template === 'string') {
        template = Ember.Handlebars.compile(template);
      }

      var templateFullName = 'template:-undertest-' + ++templateId;
      this.registry.register(templateFullName, template);
      var stateToRender = {
        owner: getOwnerFromModule(module),
        into: undefined,
        outlet: 'main',
        name: 'index',
        controller: module.context,
        ViewClass: undefined,
        template: lookupTemplateFromModule(module, templateFullName),
        outlets: {}
      };

      if (hasOutletTemplate) {
        stateToRender.name = 'index';
        outletState.outlets.main = {
          render: stateToRender,
          outlets: {}
        };
      } else {
        stateToRender.name = 'application';
        outletState = {
          render: stateToRender,
          outlets: {}
        };
      }

      Ember.run(function () {
        toplevelView.setOutletState(outletState);
      });

      if (!hasRendered) {
        Ember.run(module.component, 'appendTo', '#ember-testing');
        hasRendered = true;
      }

      if (EmberENV._APPLICATION_TEMPLATE_WRAPPER !== false) {
        // ensure the element is based on the wrapping toplevel view
        // Ember still wraps the main application template with a
        // normal tagged view
        context._element = element = document.querySelector('#ember-testing > .ember-view');
      } else {
        context._element = element = document.querySelector('#ember-testing');
      }
    };

    context.$ = function (selector) {
      // emulates Ember internal behavor of `this.$` in a component
      // https://github.com/emberjs/ember.js/blob/v2.5.1/packages/ember-views/lib/views/states/has_element.js#L18
      return selector ? jQuery(selector, element) : jQuery(element);
    };

    context.set = function (key, value) {
      var ret = Ember.run(function () {
        return Ember.set(context, key, value);
      });

      if ((0, _hasEmberVersion.default)(2, 0)) {
        return ret;
      }
    };

    context.setProperties = function (hash) {
      var ret = Ember.run(function () {
        return Ember.setProperties(context, hash);
      });

      if ((0, _hasEmberVersion.default)(2, 0)) {
        return ret;
      }
    };

    context.get = function (key) {
      return Ember.get(context, key);
    };

    context.getProperties = function () {
      var args = Array.prototype.slice.call(arguments);
      return Ember.getProperties(context, args);
    };

    context.on = function (actionName, handler) {
      module.actionHooks[actionName] = handler;
    };

    context.send = function (actionName) {
      var hook = module.actionHooks[actionName];

      if (!hook) {
        throw new Error('integration testing template received unexpected action ' + actionName);
      }

      hook.apply(module.context, Array.prototype.slice.call(arguments, 1));
    };

    context.clearRender = function () {
      Ember.run(function () {
        toplevelView.setOutletState({
          render: {
            owner: module.container,
            into: undefined,
            outlet: 'main',
            name: 'application',
            controller: module.context,
            ViewClass: undefined,
            template: undefined
          },
          outlets: {}
        });
      });
    };
  }
});
define("ember-test-helpers/legacy-0-6-x/test-module-for-model", ["exports", "require", "ember-test-helpers/legacy-0-6-x/test-module"], function (_exports, _require, _testModule) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _default =
  /*#__PURE__*/
  function (_TestModule) {
    _inherits(_default, _TestModule);

    function _default(modelName, description, callbacks) {
      var _this;

      _classCallCheck(this, _default);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, 'model:' + modelName, description, callbacks));
      _this.modelName = modelName;

      _this.setupSteps.push(_this.setupModel);

      return _this;
    }

    _createClass(_default, [{
      key: "setupModel",
      value: function setupModel() {
        var container = this.container;
        var defaultSubject = this.defaultSubject;
        var callbacks = this.callbacks;
        var modelName = this.modelName;
        var adapterFactory = container.factoryFor ? container.factoryFor('adapter:application') : container.lookupFactory('adapter:application');

        if (!adapterFactory) {
          if (requirejs.entries['ember-data/adapters/json-api']) {
            adapterFactory = (0, _require.default)("ember-data/adapters/json-api")['default'];
          } // when ember-data/adapters/json-api is provided via ember-cli shims
          // using Ember Data 1.x the actual JSONAPIAdapter isn't found, but the
          // above require statement returns a bizzaro object with only a `default`
          // property (circular reference actually)


          if (!adapterFactory || !adapterFactory.create) {
            adapterFactory = DS.JSONAPIAdapter || DS.FixtureAdapter;
          }

          var thingToRegisterWith = this.registry || this.container;
          thingToRegisterWith.register('adapter:application', adapterFactory);
        }

        callbacks.store = function () {
          var container = this.container;
          return container.lookup('service:store') || container.lookup('store:main');
        };

        if (callbacks.subject === defaultSubject) {
          callbacks.subject = function (options) {
            var container = this.container;
            return Ember.run(function () {
              var store = container.lookup('service:store') || container.lookup('store:main');
              return store.createRecord(modelName, options);
            });
          };
        }
      }
    }]);

    return _default;
  }(_testModule.default);

  _exports.default = _default;
});
define("ember-test-helpers/legacy-0-6-x/test-module", ["exports", "ember-test-helpers/legacy-0-6-x/abstract-test-module", "@ember/test-helpers", "ember-test-helpers/legacy-0-6-x/build-registry", "@ember/test-helpers/has-ember-version"], function (_exports, _abstractTestModule, _testHelpers, _buildRegistry, _hasEmberVersion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var _default =
  /*#__PURE__*/
  function (_AbstractTestModule) {
    _inherits(_default, _AbstractTestModule);

    function _default(subjectName, description, callbacks) {
      var _this2;

      _classCallCheck(this, _default);

      // Allow `description` to be omitted, in which case it should
      // default to `subjectName`
      if (!callbacks && _typeof(description) === 'object') {
        callbacks = description;
        description = subjectName;
      }

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, description || subjectName, callbacks));
      _this2.subjectName = subjectName;
      _this2.description = description || subjectName;
      _this2.resolver = _this2.callbacks.resolver || (0, _testHelpers.getResolver)();

      if (_this2.callbacks.integration && _this2.callbacks.needs) {
        throw new Error("cannot declare 'integration: true' and 'needs' in the same module");
      }

      if (_this2.callbacks.integration) {
        _this2.initIntegration(callbacks);

        delete callbacks.integration;
      }

      _this2.initSubject();

      _this2.initNeeds();

      return _this2;
    }

    _createClass(_default, [{
      key: "initIntegration",
      value: function initIntegration(options) {
        if (options.integration === 'legacy') {
          throw new Error("`integration: 'legacy'` is only valid for component tests.");
        }

        this.isIntegration = true;
      }
    }, {
      key: "initSubject",
      value: function initSubject() {
        this.callbacks.subject = this.callbacks.subject || this.defaultSubject;
      }
    }, {
      key: "initNeeds",
      value: function initNeeds() {
        this.needs = [this.subjectName];

        if (this.callbacks.needs) {
          this.needs = this.needs.concat(this.callbacks.needs);
          delete this.callbacks.needs;
        }
      }
    }, {
      key: "initSetupSteps",
      value: function initSetupSteps() {
        this.setupSteps = [];
        this.contextualizedSetupSteps = [];

        if (this.callbacks.beforeSetup) {
          this.setupSteps.push(this.callbacks.beforeSetup);
          delete this.callbacks.beforeSetup;
        }

        this.setupSteps.push(this.setupContainer);
        this.setupSteps.push(this.setupContext);
        this.setupSteps.push(this.setupTestElements);
        this.setupSteps.push(this.setupAJAXListeners);
        this.setupSteps.push(this.setupPromiseListeners);

        if (this.callbacks.setup) {
          this.contextualizedSetupSteps.push(this.callbacks.setup);
          delete this.callbacks.setup;
        }
      }
    }, {
      key: "initTeardownSteps",
      value: function initTeardownSteps() {
        this.teardownSteps = [];
        this.contextualizedTeardownSteps = [];

        if (this.callbacks.teardown) {
          this.contextualizedTeardownSteps.push(this.callbacks.teardown);
          delete this.callbacks.teardown;
        }

        this.teardownSteps.push(this.teardownSubject);
        this.teardownSteps.push(this.teardownContainer);
        this.teardownSteps.push(this.teardownContext);
        this.teardownSteps.push(this.teardownTestElements);
        this.teardownSteps.push(this.teardownAJAXListeners);
        this.teardownSteps.push(this.teardownPromiseListeners);

        if (this.callbacks.afterTeardown) {
          this.teardownSteps.push(this.callbacks.afterTeardown);
          delete this.callbacks.afterTeardown;
        }
      }
    }, {
      key: "setupContainer",
      value: function setupContainer() {
        if (this.isIntegration || this.isLegacy) {
          this._setupIntegratedContainer();
        } else {
          this._setupIsolatedContainer();
        }
      }
    }, {
      key: "setupContext",
      value: function setupContext() {
        var subjectName = this.subjectName;
        var container = this.container;

        var factory = function factory() {
          return container.factoryFor ? container.factoryFor(subjectName) : container.lookupFactory(subjectName);
        };

        _get(_getPrototypeOf(_default.prototype), "setupContext", this).call(this, {
          container: this.container,
          registry: this.registry,
          factory: factory,
          register: function register() {
            var target = this.registry || this.container;
            return target.register.apply(target, arguments);
          }
        });

        if (Ember.setOwner) {
          Ember.setOwner(this.context, this.container.owner);
        }

        this.setupInject();
      }
    }, {
      key: "setupInject",
      value: function setupInject() {
        var module = this;
        var context = this.context;

        if (Ember.inject) {
          var keys = (Object.keys || keys)(Ember.inject);
          keys.forEach(function (typeName) {
            context.inject[typeName] = function (name, opts) {
              var alias = opts && opts.as || name;
              Ember.run(function () {
                Ember.set(context, alias, module.container.lookup(typeName + ':' + name));
              });
            };
          });
        }
      }
    }, {
      key: "teardownSubject",
      value: function teardownSubject() {
        var subject = this.cache.subject;

        if (subject) {
          Ember.run(function () {
            Ember.tryInvoke(subject, 'destroy');
          });
        }
      }
    }, {
      key: "teardownContainer",
      value: function teardownContainer() {
        var container = this.container;
        Ember.run(function () {
          container.destroy();
        });
      }
    }, {
      key: "defaultSubject",
      value: function defaultSubject(options, factory) {
        return factory.create(options);
      } // allow arbitrary named factories, like rspec let

    }, {
      key: "contextualizeCallbacks",
      value: function contextualizeCallbacks() {
        var callbacks = this.callbacks;
        var context = this.context;
        this.cache = this.cache || {};
        this.cachedCalls = this.cachedCalls || {};
        var keys = (Object.keys || keys)(callbacks);
        var keysLength = keys.length;

        if (keysLength) {
          var deprecatedContext = this._buildDeprecatedContext(this, context);

          for (var i = 0; i < keysLength; i++) {
            this._contextualizeCallback(context, keys[i], deprecatedContext);
          }
        }
      }
    }, {
      key: "_contextualizeCallback",
      value: function _contextualizeCallback(context, key, callbackContext) {
        var _this = this;

        var callbacks = this.callbacks;
        var factory = context.factory;

        context[key] = function (options) {
          if (_this.cachedCalls[key]) {
            return _this.cache[key];
          }

          var result = callbacks[key].call(callbackContext, options, factory());
          _this.cache[key] = result;
          _this.cachedCalls[key] = true;
          return result;
        };
      }
      /*
        Builds a version of the passed in context that contains deprecation warnings
        for accessing properties that exist on the module.
      */

    }, {
      key: "_buildDeprecatedContext",
      value: function _buildDeprecatedContext(module, context) {
        var deprecatedContext = Object.create(context);
        var keysForDeprecation = Object.keys(module);

        for (var i = 0, l = keysForDeprecation.length; i < l; i++) {
          this._proxyDeprecation(module, deprecatedContext, keysForDeprecation[i]);
        }

        return deprecatedContext;
      }
      /*
        Defines a key on an object to act as a proxy for deprecating the original.
      */

    }, {
      key: "_proxyDeprecation",
      value: function _proxyDeprecation(obj, proxy, key) {
        if (typeof proxy[key] === 'undefined') {
          Object.defineProperty(proxy, key, {
            get: function get() {
              (true && !(false) && Ember.deprecate('Accessing the test module property "' + key + '" from a callback is deprecated.', false, {
                id: 'ember-test-helpers.test-module.callback-context',
                until: '0.6.0'
              }));
              return obj[key];
            }
          });
        }
      }
    }, {
      key: "_setupContainer",
      value: function _setupContainer(isolated) {
        var resolver = this.resolver;
        var items = (0, _buildRegistry.default)(!isolated ? resolver : Object.create(resolver, {
          resolve: {
            value: function value() {}
          }
        }));
        this.container = items.container;
        this.registry = items.registry;

        if ((0, _hasEmberVersion.default)(1, 13)) {
          var thingToRegisterWith = this.registry || this.container;
          var router = resolver.resolve('router:main');
          router = router || Ember.Router.extend();
          thingToRegisterWith.register('router:main', router);
        }
      }
    }, {
      key: "_setupIsolatedContainer",
      value: function _setupIsolatedContainer() {
        var resolver = this.resolver;

        this._setupContainer(true);

        var thingToRegisterWith = this.registry || this.container;

        for (var i = this.needs.length; i > 0; i--) {
          var fullName = this.needs[i - 1];
          var normalizedFullName = resolver.normalize(fullName);
          thingToRegisterWith.register(fullName, resolver.resolve(normalizedFullName));
        }

        if (!this.registry) {
          this.container.resolver = function () {};
        }
      }
    }, {
      key: "_setupIntegratedContainer",
      value: function _setupIntegratedContainer() {
        this._setupContainer();
      }
    }]);

    return _default;
  }(_abstractTestModule.default);

  _exports.default = _default;
});
define("ember-test-helpers/wait", ["exports", "@ember/test-helpers/settled", "@ember/test-helpers"], function (_exports, _settled, _testHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = wait;
  Object.defineProperty(_exports, "_setupAJAXHooks", {
    enumerable: true,
    get: function get() {
      return _settled._setupAJAXHooks;
    }
  });
  Object.defineProperty(_exports, "_teardownAJAXHooks", {
    enumerable: true,
    get: function get() {
      return _settled._teardownAJAXHooks;
    }
  });

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
    Returns a promise that resolves when in a settled state (see `isSettled` for
    a definition of "settled state").
  
    @private
    @deprecated
    @param {Object} [options={}] the options to be used for waiting
    @param {boolean} [options.waitForTimers=true] should timers be waited upon
    @param {boolean} [options.waitForAjax=true] should $.ajax requests be waited upon
    @param {boolean} [options.waitForWaiters=true] should test waiters be waited upon
    @returns {Promise<void>} resolves when settled
  */
  function wait() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (_typeof(options) !== 'object' || options === null) {
      options = {};
    }

    return (0, _testHelpers.waitUntil)(function () {
      var waitForTimers = 'waitForTimers' in options ? options.waitForTimers : true;
      var waitForAJAX = 'waitForAJAX' in options ? options.waitForAJAX : true;
      var waitForWaiters = 'waitForWaiters' in options ? options.waitForWaiters : true;

      var _getSettledState = (0, _testHelpers.getSettledState)(),
          hasPendingTimers = _getSettledState.hasPendingTimers,
          hasRunLoop = _getSettledState.hasRunLoop,
          hasPendingRequests = _getSettledState.hasPendingRequests,
          hasPendingWaiters = _getSettledState.hasPendingWaiters;

      if (waitForTimers && (hasPendingTimers || hasRunLoop)) {
        return false;
      }

      if (waitForAJAX && hasPendingRequests) {
        return false;
      }

      if (waitForWaiters && hasPendingWaiters) {
        return false;
      }

      return true;
    }, {
      timeout: Infinity
    });
  }
});
define("qunit/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.todo = _exports.only = _exports.skip = _exports.test = _exports.module = void 0;

  /* globals QUnit */
  var module = QUnit.module;
  _exports.module = module;
  var test = QUnit.test;
  _exports.test = test;
  var skip = QUnit.skip;
  _exports.skip = skip;
  var only = QUnit.only;
  _exports.only = only;
  var todo = QUnit.todo;
  _exports.todo = todo;
  var _default = QUnit;
  _exports.default = _default;
});
runningTests = true;

if (window.Testem) {
  window.Testem.hookIntoTestFramework();
}


//# sourceMappingURL=test-support.map
