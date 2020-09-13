import React, { Component, createRef } from "react";
// import { joinClasses, createChainedFunction } from "../../utils";
import classNames from "classnames";
import "./index.less";

// function handleKeyDown(e) {
//   e.preventDefault();
// }

let id = 1;
function uuid() {
  return id++;
}

const rootTrees = {};
export default class Tree extends Component {
  static rootTrees = rootTrees;
  static handleObj = (obj, unCheckEvent, pos) => { // 主要处理 treeNodesState 里每个节点应该有的状态
    if (unCheckEvent) {
      Object.keys(obj).forEach((i) => {
        if (i.indexOf(pos) === 0) { // 如果原来是 checked，现在是 unChecked,需要将自己和所有子项都 unchecked
          obj[i].checked = false;
          obj[i].checkPart = false;
        }
      });
      // return;
    } else if (pos) { // 和上一个条件相反
      Object.keys(obj).forEach((i) => {
        if (i.indexOf(pos) === 0) {
          obj[i].checked = true;
          obj[i].checkPart = false;
        }
      });
    }
    const checkedArr = Object.keys(obj).filter((key) => {
      return obj[key].checked;
    });
    // console.log('checkedArr: ', checkedArr);
    // todo 过滤掉checkedArr中的重复项
    const loop = (len, key) => { // 这个递归循环主要是处理随着前面的处理后，处理其他节点应该有的状态
      if (len <= 3) { // 根节点，在这退出递归
        Object.keys(obj).forEach((i) => {
          if (i.indexOf(key) === 0) { // 根节点如果选中了的话，就把所有的子节点都选上
            obj[i].checked = true;
            obj[i].checkPart = false;
          }
        });
        return;
      }
      let lenIndex = 0; // 同级，且同父节点的节点数
      let chkIndex = 0; // 同级，且同父节点的 check 节点数
      Object.keys(obj).forEach((i) => {
        if (
          i.length === len &&
          i.substring(0, len - 2) === key.substring(0, len - 2)
        ) { // 同级，且同父节点
          lenIndex++;
          if (obj[i].checked) {
            chkIndex++;
          }
        } else if (i.length > len && i.indexOf(key) === 0) { // 所有子节点
          obj[i].checked = true;
        }
      });
      // 子项全选，向上递归
      const parent = obj[key.substring(0, len - 2)];
      if (chkIndex === lenIndex) {
        parent.checked = true;
        loop(len - 2, key);
      } else {
        parent.checkPart = true;
        loop(len - 2, key);
      }
    };
    checkedArr.forEach((key) => {
      const keyLen = key.length;
      loop(keyLen, key);
    });
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.tree = createRef();

    // get root tree, run one time
    if (!props._childTreeNode && !props._childTree) {
      // console.log('root tree', this);
      this._rootTreeId = uuid();
      const rootConfig = {
        prefixCls: props.prefixCls,
        showLine: props.showLine,
        showIcon: props.showIcon,
        expandAll: props.expandAll,
        checkable: props.checkable,
        defaultSelectedKeys: props.defaultSelectedKeys,
        selectedKeys: props.selectedKeys,
        onChecked: this.handleChecked,
        onSelect: this.handleSelect,
      };
      rootTrees[this._rootTreeId] = {
        _rootTreeId: this._rootTreeId,
        rootConfig: rootConfig,
        treeNodesState: {},
        trees: [],
        selectedKeys:
          (props.selectedKeys.length && props.selectedKeys) ||
          props.defaultSelectedKeys,
      };
    }
  }
  handleSelect = (isSel, c, selectedKeys) => {
    if (this.props.onSelect) {
      this.props.onSelect(isSel, c, selectedKeys);
    }
  }
  handleChecked = (isChk, c) => {
    if (this.props.onChecked) {
      this.props.onChecked(isChk, c);
    }
  }

  // all keyboard events callbacks run from here at first
  // todo
  handleKeyDown = (e) => {
    e.preventDefault();
    console.log(e.KeyCode);
  };

  renderTreeNode = (child, index) => {
    const props = this.props;
    const pos = (props._pos || 0) + "-" + index;
    const _rootTreeId = this._rootTreeId || props._rootTreeId;
    const cloneProps = {
      ref: "treeNode",
      _rootTreeId: _rootTreeId,
      _key: child.key || pos,
      _level: props._level || 0,
      _pos: pos,
      _index: index,
      _len: this.childrenLength,
      checked: child.props.checked || props.checked,
      checkPart: props.checkPart,
    };
    Object.keys(rootTrees[_rootTreeId].rootConfig).forEach((item) => {
      cloneProps[item] = rootTrees[_rootTreeId].rootConfig[item];
    });

    if (rootTrees[_rootTreeId].selectedKeys.indexOf(child.key) > -1) {
      cloneProps.selected = true;
    }
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
    if (props._childTree) {
      domProps.style = props.expanded
        ? { display: "block" }
        : { display: "none" };
    }

    if (!props._childTreeNode && !props._childTree) { // 创建树的时候
      this._obj = {};
      this.handleChildren(props.children); // 这里会初始化一遍状态_obj
      // Object.keys(this._obj).forEach(i=>console.log(`${i}:`, this._obj[i]))
      // console.log('------------------');
      Tree.handleObj(this._obj);
      // Object.keys(this._obj).forEach(i=>console.log(`${i}:`, this._obj[i]))
      rootTrees[this._rootTreeId].treeNodesState = this._obj;
    }

    this.childrenLength = React.Children.count(props.children);
    this.newChildren = React.Children.map(props.children, this.renderTreeNode);

    return (
      <ul {...domProps} ref={this.tree}>
        {this.newChildren}
      </ul>
    );
  }

  handleChildren = (children, level) => { // 只在一开始调用来初始化一些状态
    React.Children.forEach(children, (child, index) => {
      const pos = (level || 0) + "-" + index;
      // console.log(child.props.checkbox);
      let props = child.props;
      if (child.props.checkbox) {
        props = child.props.checkbox.props;
      }
      this._obj[pos] = {
        checkPart: child.props.checkPart || false,
        checked: props.checked || props.defaultChecked || false,
      };
      let childChildren = child.props.children;
      if (
        childChildren &&
        typeof childChildren.type === "function" &&
        typeof childChildren.type.TreeNode === "function"
      ) {
        childChildren = [childChildren];
      }
      if (Array.isArray(childChildren)) {
        return this.handleChildren(childChildren, pos);
      }
      return null;
    });
  }
}
Tree.defaultProps = {
  prefixCls: "rc-tree",
  checkable: false,
  showIcon: true,
  showLine: true,
  expandAll: false,
  defaultSelectedKeys: [],
  selectedKeys: [],
};
