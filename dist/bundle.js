/*!
 * rollup-test v0.0.1
 * 
 * 
 * Copyright (c) 2019 ghostlwj
 * https://github.com/ghostLWJ/rollup-test.git
 * 
 * Licensed under the MIT license.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.bundle = factory());
}(this, function () { 'use strict';

    var index = 42;

    function main () {
      console.log("The ".concat(index));
    }

    return main;

}));
