import React, { Component, createRef } from "react";
// import { joinClasses, createChainedFunction } from "../../utils";
import classNames from "classnames";
import "./index.less";

// sorted array ['0-0','0-1', '0-0-1', '0-1-1'] => ['0-0', '0-1']
const filterMin = (arr) => {
  const a = [];
  arr.forEach((item) => {
    const b = a.filter((i) => {
      return item.indexOf(i) === 0;
    });
    if (!b.length) {
      a.push(item);
    }
  });
  return a;
};

export default class Tree extends Component {
  static handleCheckState(obj, checkedArr, unCheckEvent) {
    let evt = false;
    if (typeof unCheckEvent === "boolean") {
      evt = true;
    }
    console.log("checkedArr", checkedArr);
    checkedArr.forEach((_pos) => {
      console.log("_pos", _pos);
      Object.keys(obj).forEach((i) => {
        console.log(i);
        if (i.length > _pos.length && i.indexOf(_pos) === 0) {
          // 子节点处理
          obj[i].checkPart = false;
          if (evt) {
            if (unCheckEvent) {
              obj[i].checked = false;
            } else {
              obj[i].checked = true;
            }
          } else {
            obj[i].checked = true;
          }
        }
      });
      const loop = (__pos) => {
        const _posLen = __pos.length;
        if (_posLen <= 3) {
          return;
        }
        let sibling = 0;
        let siblingChecked = 0;
        const parentPos = __pos.substring(0, _posLen - 2);
        Object.keys(obj).forEach((i) => {
          if (
            i.length === _posLen &&
            i.substring(0, _posLen - 2) === parentPos
          ) {
            // 直接父节点处理
            sibling++;
            if (obj[i].checked) {
              siblingChecked++;
            } else if (obj[i].checkPart) {
              siblingChecked += 0.5;
            }
          }
        });
        const parent = obj[parentPos]; // 更新直接的父节点
        // sibling 不会等于0
        // 全不选 - 全选 - 半选
        if (siblingChecked === 0) {
          parent.checked = false;
          parent.checkPart = false;
        } else if (siblingChecked === sibling) {
          parent.checked = true;
          parent.checkPart = false;
        } else {
          parent.checkPart = true;
          parent.checked = false;
        }
        loop(parentPos);
      };
      loop(_pos);
    });
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.tree = createRef();

    const {
      defaultExpandedKeys: expandedKeys,
      defaultCheckedKeys: checkedKeys,
      defaultExpandAll,
    } = props;
    this.defaultExpandAll = defaultExpandAll;
    this.state = {
      expandedKeys,
      checkedKeys,
    };
  }
  getCheckKeys = () => {
    // 获取所有的 check 和 checkPart 节点的 key
    const checkPartKeys = [];
    const checkedKeys = [];
    Object.keys(this.treeNodesChkStates).forEach((item) => {
      const itemObj = this.treeNodesChkStates[item];
      if (itemObj.checked) {
        checkedKeys.push(itemObj.key);
      } else if (itemObj.checkPart) {
        checkPartKeys.push(itemObj.key);
      }
    });
    return {
      checkPartKeys,
      checkedKeys,
    };
  };

  handleChecked = (treeNode) => {
    const tnProps = treeNode.props;
    let checked = !tnProps.checked;
    if (tnProps.checkPart) {
      checked = true;
    }
    let pos;
    console.log("this.treeNodesChkStates", this.treeNodesChkStates);
    Object.keys(this.treeNodesChkStates).forEach((item) => {
      const itemObj = this.treeNodesChkStates[item];
      if (itemObj.key === (treeNode.key || tnProps.eventKey)) {
        pos = item;
        itemObj.checked = checked;
        itemObj.checkPart = false;
      }
    });
    Tree.handleCheckState(this.treeNodesChkStates, [pos], !checked);
    const checkKeys = this.getCheckKeys();
    this.checkPartKeys = checkKeys.checkPartKeys;
    this.setState({
      checkedKeys: checkKeys.checkedKeys,
    });
    if (this.props.onCheck) {
      this.props.onCheck(checked, treeNode, checkKeys.checkedKeys);
    }
  };

  handleExpanded = (treeNode) => {
    const thisProps = this.props;
    const tnProps = treeNode.props;
    const expandedKeys = this.state.expandedKeys.concat([]);
    const expanded = !tnProps.expanded;
    if (this.defaultExpandAll) {
      this.loopAllChildren(thisProps.children, (item, index, pos) => {
        const key = item.key || pos;
        if (expandedKeys.indexOf(key) === -1) {
          expandedKeys.push(key);
        }
      });
      this.defaultExpandAll = false;
    }
    const index = expandedKeys.indexOf(tnProps.eventKey);
    if (expanded) {
      if (index === -1) {
        expandedKeys.push(tnProps.eventKey);
      }
    } else {
      expandedKeys.splice(index, 1);
    }
    this.setState({
      expandedKeys: expandedKeys,
    });
  };

  // all keyboard events callbacks run from here at first
  // todo
  handleKeyDown = (e) => {
    e.preventDefault();
    console.log(e.KeyCode);
  };

  renderTreeNode = (child, index, level = 0) => {
    const key = child.key || `${level}-${index}`;
    const { expandedKeys } = this.state;
    const { prefixCls, showLine, showIcon, checkable } = this.props;
    const cloneProps = {
      ref: "treeNode",
      root: this, // 将 Tree 组件实例的方法传给子 TreeNode
      eventKey: key,
      pos: `${level}-${index}`,
      prefixCls,
      showLine,
      showIcon,
      checkable,
      expanded: this.defaultExpandAll || expandedKeys.indexOf(key) !== -1,
      checked: this.checkedKeys.indexOf(key) !== -1,
      checkPart: this.checkPartKeys.indexOf(key) !== -1,
    };
    return React.cloneElement(child, cloneProps);
  };

  render() {
    const props = this.props;

    const domProps = {
      className: classNames(props.className, props.prefixCls),
      role: "tree-node",
    };

    if (props.focusable) {
      domProps.tabIndex = "0";
      domProps.onKeyDown = this.handleKeyDown;
    }

    const checkedKeys = this.state.checkedKeys;
    const checkedPos = [];
    this.treeNodesChkStates = {}; // 整棵树的状态都保存在这里了，这样在创建多个树的时候不需要去维护多个树的逻辑，各管各的
    this.loopAllChildren(props.children, (item, index, pos) => {
      // 初步形成 check 状态
      const key = item.key || pos;
      let checked = false;
      if (checkedKeys.indexOf(key) !== -1) {
        checked = true;
        checkedPos.push(pos);
      }
      this.treeNodesChkStates[pos] = {
        key: key,
        checked: checked,
        checkPart: false,
      };
    });
    Tree.handleCheckState(
      this.treeNodesChkStates,
      filterMin(checkedPos.sort())
    );
    const checkKeys = this.getCheckKeys();
    this.checkPartKeys = checkKeys.checkPartKeys;
    this.checkedKeys = checkKeys.checkedKeys;

    this.newChildren = React.Children.map(props.children, this.renderTreeNode);

    return (
      <ul {...domProps} ref={this.tree}>
        {this.newChildren}
      </ul>
    );
  }

  loopAllChildren = (childs, callback) => {
    // 递归获取节点的位置 pos
    const loop = (children, level) => {
      React.Children.forEach(children, (item, index) => {
        const pos = `${level}-${index}`;
        const newChildren = item.props.children;
        if (Array.isArray(newChildren)) {
          loop(newChildren, pos);
        } else if (newChildren.type && newChildren.type.name === "TreeNode") {
          loop([newChildren], pos);
        }
        callback(item, index, pos);
      });
    };
    loop(childs, 0);
  };

  handleChildren = (children, _obj, _propsCheckedArray, level) => {
    // 只在一开始调用来初始化一些状态
    React.Children.forEach(children, (child, index) => {
      const pos = (level || 0) + "-" + index;
      // console.log(child.props.checkbox);
      let props = child.props;
      if (child.props.checkbox) {
        props = child.props.checkbox.props;
      }
      _obj[pos] = {
        checkPart: child.props.checkPart || false,
        checked: props.checked || props.defaultChecked || false,
      };
      if (_obj[pos].checked) {
        _propsCheckedArray.push(pos);
      }
      let childChildren = child.props.children;
      if (
        childChildren &&
        typeof childChildren.type === "function" &&
        typeof childChildren.type.TreeNode === "function"
      ) {
        childChildren = [childChildren];
      }
      if (Array.isArray(childChildren)) {
        return this.handleChildren(
          childChildren,
          _obj,
          _propsCheckedArray,
          pos
        );
      }
      return null;
    });
  };
}
Tree.defaultProps = {
  prefixCls: "rc-tree",
  checkable: false,
  showLine: false,
  showIcon: true,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
};
