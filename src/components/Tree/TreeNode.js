/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, createRef } from "react";
import { joinClasses, toArray } from "../../utils";
import Tree from "./Tree";
import classNames from "classnames";

import "./index.less";

const rootTrees = Tree.rootTrees;
export default class TreeNode extends Component {
  constructor(props) {
    super(props);
    const tnState = this.getTreeNodesState() || {};
    this.state = {
      expanded: props.expandAll || props.expanded || props.defaultExpanded,
      selected: props.selected || false,
      checkPart: tnState.checkPart || false,
      checked: tnState.checked || false
    };
    this.checkbox = createRef();
    this.selectHandle = createRef();
  }
  getTreeNodesState = () => {
    return rootTrees[this.props._rootTreeId].treeNodesState[this.props._pos];
  };
  // componentDidMount() {
  //   this.componentDidUpdate();
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const tnState = this.getTreeNodesState() || {};
    this.setState({
      checkPart: tnState.checkPart,
      checked: tnState.checked
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   const checkbox = this.checkbox.current;
  //   if (checkbox && this.state.checkPart !== nextState.checkPart) {
  //     const cls = checkbox.className;
  //     const checkSt =
  //       rootTrees[this.props._rootTreeId].treeNodesState[this.props._pos] || {};
  //     checkSt.checkPart = nextState.checkPart;
  //     checkSt.checked = nextState.checked;
  //     const checkPartCls = `${this.props.prefixCls}-checkbox_true_part`;
  //     if (nextState.checkPart) {
  //       checkbox.className =
  //         cls.indexOf(checkPartCls) > -1 ? cls : `${cls} ${checkPartCls}`;
  //       return false;
  //     }
  //     checkbox.className = cls.replace(new RegExp(checkPartCls, "g"), "");
  //   }
  //   return true;
  // }
  // switchExpandedState = (newState, onStateChangeComplete) => {
  //   this.setState(
  //     {
  //       expanded: newState,
  //     },
  //     onStateChangeComplete
  //   );
  // };

  handleExpandedState = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };

  handleSelect = () => {
    const selected = !this.state.selected;
    const arr = rootTrees[this.props._rootTreeId].selectedKeys;
    console.log("this.props._rootTreeId: ", this.props._rootTreeId);
    console.log("rootTrees: ", rootTrees);
    const index = arr.indexOf(this.props._key);
    if (selected) {
      if (index < 0) {
        arr.push(this.props._key);
      }
    } else {
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
    this.setState({
      selected: selected
    });
    if (this.props.onSelect) {
      this.props.onSelect(selected, this, arr);
    }
  };

  handleChecked = () => {
    const props = this.props;
    let checked = !this.state.checked;

    if (this.state.checkPart) {
      checked = true;
    }

    const nSt = {
      checkPart: false,
      checked: checked
    };

    rootTrees[props._rootTreeId].treeNodesState[props._pos] = nSt;
    // console.log(rootTrees[props._rootTreeId].treeNodesState);
    Tree.handleCheckState(
      rootTrees[props._rootTreeId].treeNodesState,
      [props._pos],
      !checked
    );
    // console.log(rootTrees[props._rootTreeId].treeNodesState);
    rootTrees[props._rootTreeId]._rootTree.forceUpdate();

    if (props.onChecked) {
      props.onChecked(checked, this);
    }
  };

  // // set parent treeNodes's state
  // newTNState = (props, checked) => {
  //   const _pos = props._pos;
  //   rootTrees[this.props._rootTreeId].trees.sort((a, b) => {
  //     return b.props._pos.length - a.props._pos.length;
  //   }).forEach((c) => {
  //     const cPos = c.props._pos;
  //     // console.log('cPos: ', cPos);
  //     if (_pos.indexOf(cPos) === 0 && _pos !== cPos) {
  //       const childArr = toArray(c.props.children);
  //       const len = childArr.length;
  //       let checkedNumbers = 0;
  //       // 先计算已经选中的节点数
  //       // console.log(this);
  //       for (let i = 0; i < len; i++) {
  //         const checkSt = rootTrees[this.props._rootTreeId].treeNodesState[cPos + '-' + i];
  //         if (checkSt.checked) {
  //           checkedNumbers++;
  //         } else if (checkSt.checkPart) {
  //           checkedNumbers += 0.5;
  //         }
  //       }
  //       // 点击节点的 直接父级
  //       if (_pos.length - cPos.length <= 2) {
  //         // 如果原来是半选
  //         if (rootTrees[this.props._rootTreeId].treeNodesState[_pos].checkPart) {
  //           // checked ? checkedNumbers += 0.5 : checkedNumbers -= 0.5;
  //           if (checked) {
  //             checkedNumbers += 0.5;
  //           } else {
  //             checkedNumbers -= 0.5;
  //           }
  //         } else if (checked) {
  //           checkedNumbers++;
  //         } else {
  //           checkedNumbers--;
  //         }
  //       }

  //       let newSt;
  //       if (checkedNumbers <= 0) {
  //         // 都不选
  //         newSt = {
  //           checkPart: false,
  //           checked: false,
  //         };
  //       } else if (checkedNumbers === len) {
  //         // 全选
  //         newSt = {
  //           checkPart: false,
  //           checked: true,
  //         };
  //       } else {
  //         // 部分选择
  //         newSt = {
  //           checkPart: true,
  //           checked: false,
  //         };
  //       }
  //       c.setState(newSt);
  //       rootTrees[this.props._rootTreeId].treeNodesState[cPos] = newSt;
  //     }
  //   });
  // }

  // keyboard event support
  handleKeyDown = (e) => {
    e.preventDefault();
  };

  componentDidUpdate() {
    //console.log( this.state.checked );
    if (this.newChildren) {
      const trees = rootTrees[this.props._rootTreeId].trees;
      for (let i = 0; i < trees.length; i++) {
        if (trees[i].props._pos === this.props._pos) {
          // console.log(`数组第${i}个元素重复,树位置: ${this.props._pos}`);
          trees.splice(i--, 1);
          // console.log("删除");
        }
      }
      // console.log(`push 进 trees 新的位置为 ${this.props._pos} 的`, this);
      trees.push(this);
    }

    //add treeNodes checked state
    const tnState =
      rootTrees[this.props._rootTreeId].treeNodesState[this.props._pos] || {};
    rootTrees[this.props._rootTreeId].treeNodesState[this.props._pos] = {
      // checked: this.state.checked,
      // checkPart: this.state.checkPart,
      checkPart: tnState.checkPart,
      checked: tnState.checked
    };
    // console.log(`Tree.treeNodesState[${this.props._pos}]: `, tnState);
  }

  renderSwitcher = (props, prefixCls, switchState) => {
    const switcherCls = {
      [`${prefixCls}-button`]: true,
      [`${prefixCls}-switcher`]: true
    };
    if (props.disabled) {
      switcherCls[`${prefixCls}-switcher-disabled`] = true;
      return <span className={classNames(switcherCls)}></span>;
    }

    if (!props.showLine) {
      switcherCls[prefixCls + "-noline_" + switchState] = true;
    } else if (props._isChildTree && props._index === 0) {
      if (props._len !== 1) {
        switcherCls[prefixCls + "-center_" + switchState] = true;
      } else {
        switcherCls[prefixCls + "-bottom_" + switchState] = true;
      }
    } else if (props._index === 0) {
      switcherCls[prefixCls + "-roots_" + switchState] = true;
    } else if (props._index === props._len - 1) {
      switcherCls[prefixCls + "-bottom_" + switchState] = true;
    } else {
      switcherCls[prefixCls + "-center_" + switchState] = true;
    }
    return (
      <span
        className={classNames(switcherCls)}
        onClick={this.handleExpandedState}
      ></span>
    );
  };
  renderCheckbox = (props, prefixCls, state) => {
    const checkboxCls = {
      [`${prefixCls}-button`]: true,
      [`${prefixCls}-chk`]: true
    };
    if (!props.checkable) {
      return null;
    }
    if (props.disabled) {
      checkboxCls[`${prefixCls}-chk-disabled`] = true;
      return <span ref="checkbox" className={classNames(checkboxCls)}></span>;
    }
    if (state.checkPart) {
      checkboxCls[`${prefixCls}-checkbox_true_part`] = true;
    } else if (state.checked) {
      checkboxCls[`${prefixCls}-checkbox_true_full`] = true;
    } else {
      checkboxCls[`${prefixCls}-checkbox_false_full`] = true;
    }
    if (props.checkbox) {
      console.log(props.checkbox);
      // checkbox 上的属性都是只读的
      // TODO 修改自定义 checkbox 状态
      // props.checkbox.setState({ checked: state.checked });
    }
    return (
      <span
        ref="checkbox"
        className={classNames(checkboxCls)}
        onClick={this.handleChecked}
      >
        {props.checkbox ? props.checkbox : null}
      </span>
    );
  };

  renderChildren = (props, children) => {
    let newChildren = null;
    if (
      children.type === TreeNode ||
      (Array.isArray(children) &&
        children.every((item) => {
          return item.type === TreeNode;
        }))
    ) {
      const cls = {};
      cls[props.prefixCls + "-child-tree"] = true;
      if (props.showLine && props._index !== props._len - 1) {
        cls[props.prefixCls + "-line"] = true;
      }
      const treeProps = {
        _rootTreeId: props._rootTreeId,
        _pos: props._pos,
        _level: props._level + 1,
        _childTree: true,
        checked: this.state.checked,
        checkPart: this.state.checkPart,
        className: classNames(cls),
        expanded: this.state.expanded
      };
      // newChildren = <Tree {...treeProps}>{children}</Tree>;
      newChildren = this.newChildren = <Tree {...treeProps}>{children}</Tree>;
    } else {
      newChildren = children;
    }

    return newChildren;
  };
  render() {
    const props = this.props;
    const state = this.state;
    const prefixCls = props.prefixCls;
    const switchState = state.expanded ? "open" : "close";

    const iconEleCls = {
      [`${prefixCls}-button`]: true,
      [`${prefixCls}-iconEle`]: true,
      [`${prefixCls}-icon__${switchState}`]: true
    };

    let content = props.title;
    let newChildren = this.renderChildren(props, props.children);
    if (newChildren === props.children) {
      // 如果 children 不全部是 TreeNode，那 this.props.children 就会直接渲染成 content
      content = newChildren;
      newChildren = null;
    }

    const selectHandle = () => {
      const icon = props.showIcon ? (
        <span className={classNames(iconEleCls)}></span>
      ) : null;
      if (props.disabled) {
        return (
          <a ref="selectHandle" title={content}>
            {icon}
            <span className="title">{content}</span>
          </a>
        );
      }

      return (
        <a
          ref="selectHandle"
          title={content}
          className={state.selected ? `${prefixCls}-selected` : ""}
          onClick={this.handleSelect}
        >
          {icon}
          <span className="title">{content}</span>
        </a>
      );
    };

    return (
      <li
        className={joinClasses(
          props.className,
          `level-${props._level}`,
          `pos-${props._pos}`,
          props.disabled ? `${prefixCls}-treenode-disabled` : ""
        )}
      >
        {this.renderSwitcher(props, prefixCls, switchState)}
        {this.renderCheckbox(props, prefixCls, state)}
        {selectHandle()}
        {newChildren}
      </li>
    );
  }
}
TreeNode.defaultProps = {
  _childTreeNode: true,
  title: "---",
  defaultExpanded: false,
  expanded: false
};
