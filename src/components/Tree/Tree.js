import React, { Component, createRef } from "react";
// import { joinClasses, createChainedFunction } from "../../utils";
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
    console.log(e.KeyCode);
  };

  renderTreeNode = (child, index) => {
    const props = this.props;
    const pos = (props._pos || 0) + "-" + index;
    const cloneProps = {
      ref: "treeNode",
      _level: props._level || 0,
      _pos: pos,
      _isChildTree: props._isChildTree || false,
      _index: index,
      _len: this.childrenLength,
      prefixCls: props.prefixCls,
      showLine: props.showLine,
      showIcon: props.showIcon,
      checkable: props.checkable,
      _checked: props._checked,
      _checkPart: props._checkPart,
      expandAll: props.expandAll,
      onChecked: this.handleChecked,
      onSelect: this.handleSelect,
    };
    return React.cloneElement(child, cloneProps);
  };

  render() {
    const props = this.props;

    const domProps = {
      className: classNames(props.className, props.prefixCls),
      onKeyDown: this.handleKeyDown,
      role: "tree-node",
      "aria-activedescendant": "",
      "aria-labelledby": "",
      "aria-expanded": props.expanded ? "true" : "false",
      "aria-selected": props.selected ? "true" : "false",
      "aria-level": "",
    };
    if (props._isChildTree) {
      domProps.style = props.expanded
        ? { display: "block" }
        : { display: "none" };
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
  checkable: false,
  showIcon: true,
  showLine: true,
  expandAll: false,
};
