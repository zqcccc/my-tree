import React, { Component, createRef } from "react";
import { joinClasses, createChainedFunction } from "../../utils";
import classNames from "classnames";
import "./index.less";

// function handleKeyDown(e) {
//   e.preventDefault();
// }

export default class Tree extends Component {
  static trees = [];
  static treeNodesState = {};
  constructor(props) {
    super(props);
    this.state = {};
    this.tree = createRef();
  }
  handleSelect = (isSel, c, e) => {
    if (this.props.onSelect) {
      this.props.onSelect(isSel, c, e);
    }
  };
  handleChecked = (isChk, c, e) => {
    if (this.props.onChecked) {
      this.props.onChecked(isChk, c, e);
    }
  };

  // all keyboard events callbacks run from here at first
  // todo
  handleKeyDown = (e) => {
    e.preventDefault();
  };

  renderTreeNode = (child, index) => {
    var props = this.props;
    var pos = (props._pos || 0) + "-" + index;
    var cloneProps = {
      ref: "treeNode",
      _level: props._level || 0,
      _pos: pos,
      _isChildTree: props._isChildTree || false,
      _index: index,
      _len: this.childrenLength,
      prefixCls: props.prefixCls,
      showLine: props.showLine,
      checkable: props.checkable,
      _checked: props._checked,
      _checkPart: props._checkPart,
      onChecked: this.handleChecked,
      onSelect: this.handleSelect
    };
    return React.cloneElement(child, cloneProps);
  };

  render() {
    var props = this.props;

    var domProps = {
      className: classNames(props.className, props.prefixCls),
      style: props.expanded ? { display: "block" } : { display: "none" },
      role: "tree-node",
      "aria-activedescendant": "",
      "aria-labelledby": "",
      "aria-expanded": props.expanded ? "true" : "false",
      "aria-selected": props.selected ? "true" : "false",
      "aria-level": ""
    };
    if (props.id) {
      domProps.id = props.id;
    }
    if (props.focusable) {
      domProps.tabIndex = "0";
      domProps.onKeyDown = this.handleKeyDown;
    }

    this.childrenLength = React.Children.count(props.children);
    this.newChildren = React.Children.map(props.children, this.renderTreeNode);

    return (
      <ul {...domProps} ref={this.tree}>
        {this.newChildren}
      </ul>
    );
  }
}
Tree.defaultProps = {
  prefixCls: "rc-tree",
  expanded: true,
  showLine: true
};
