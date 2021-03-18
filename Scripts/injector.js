(function(window) {
    'use strict';
    var modules = {},
        maxDependencyDeep = 99,
        deep = 0,
        checkModule = function(name, deps, callback) {
            if (!(deps instanceof Array)) {
                throw new Error('Dependencies introducing error for module ' + name);
            }
            if (typeof callback !== "function") {
                throw new Error('Module isn\'t function: ' + name);
            }
        },
        chechDeclaration = function(name, deps, callback) {
            if (modules[name]) {
                throw new Error('Duplicate declaration for module ' + name);
            }
            checkModule(name, deps, callback);
        }
    window.mslc = {
        define: function(name, deps, callback) {
            chechDeclaration(name, deps, callback);
            modules[name] = {
                deps: deps,
                callback: callback,
                module: null
            };
        },
        resolve: function(deps, callback, name) {
            var args = [];
            deep++;
            name = name || ':anonymous-module:';
            checkModule(name, deps, callback);
            if (deep > maxDependencyDeep) {
                throw new Error('Possible circular dependency for module: ' + name);
            }
            for (var i = 0; i < deps.length; i++) {
                var dep = deps[i],
                    wrap = modules[dep];
                if (wrap) {
                    if (wrap.module === null) {
                        wrap.module = this.resolve(wrap.deps, wrap.callback, dep);
                    }
                    args.push(wrap.module);
                } else {
                    throw new Error('Can\'t resolve module \'' + name + '\'. Dependency \'' + dep + '\' is undefined.');
                }
            }
            deep--;

            var result = null;

            try {
                result = callback.apply(callback, args.concat(Array.prototype.slice.call(arguments, 0)));
            } catch (e) {
                console.error(e.message, e.stack);
            }

            return result;
        }
    };
})(window);