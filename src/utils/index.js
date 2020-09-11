import React from "react";

export function toArray(children) {
  var ret = [];
  React.Children.forEach(children, function (c) {
    ret.push(c);
  });
  return ret;
}
export function joinClasses(className /*, ... */) {
  if (!className) {
    className = "";
  }
  var nextClass;
  var argLength = arguments.length;
  if (argLength > 1) {
    for (var ii = 1; ii < argLength; ii++) {
      nextClass = arguments[ii];
      if (nextClass) {
        className = (className ? className + " " : "") + nextClass;
      }
    }
  }
  return className;
}

export function createChainedFunction() {
  var args = arguments;

  return function chainedFunction() {
    for (var i = 0; i < args.length; i++) {
      if (args[i] && args[i].apply) {
        args[i].apply(this, arguments);
      }
    }
  };
}
