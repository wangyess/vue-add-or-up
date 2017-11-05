;(function () {
    'use strict';
    window.s={};
    s.get=function (a) {
        var json=localStorage.getItem(a);
        return JSON.parse(json);
    };
    s.set=function (a,b) {
        b=JSON.stringify(b);
        return localStorage.setItem(a,b)
    }
})();