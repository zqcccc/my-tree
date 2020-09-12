/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, createRef } from "react";
import { joinClasses, toArray } from "../../utils";
import Tree from "./Tree";
import classNames from "classnames";

import "./index.less";

export default class TreeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expandAll || props.expanded || props.defaultExpanded,
      selected: props.selected || false,
      checkPart: props._checkPart || false,
      checked: props._checked || false,
    };
    this.checkbox = createRef();
    this.selectHandle = createRef();
  }
  componentDidMount() {
    this.componentDidUpdate();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      //selected: nextProps.selected,
      checkPart: nextProps._checkPart,
      checked: nextProps._checked,
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    const checkbox = this.checkbox.current;
    if (checkbox) {
      const cls = checkbox.className;
      const checkSt = Tree.treeNodesState[this.props._pos] || {};
      checkSt.checkPart = nextState.checkPart;
      checkSt.checked = nextState.checked;
      if (nextState.checkPart) {
        checkbox.className =
          cls.indexOf("checkbox_true_part") > -1
            ? cls
            : cls + " checkbox_true_part";
        return false;
      } else {
        checkbox.className = cls.replace(/checkbox_true_part/g, "");
      }
    }
    return true;
  }
  switchExpandedState = (newState, onStateChangeComplete) => {
    this.setState(
      {
        expanded: newState,
      },
      onStateChangeComplete
    );
  };

  handleExpandedState = () => {
    this.switchExpandedState(!this.state.expanded);
  };

  handleSelect = () => {
    this.setState({
      selected: !this.state.selected,
    });
    if (this.props.onSelect) {
      this.props.onSelect(!this.state.selected, this);
    }
  };

  handleChecked = () => {
    const _pos = this.props._pos;
    console.log(
      `************** 当前check的节点位置_pos: ${_pos} *************`
    );
    let checked = !this.state.checked;
    if (this.state.checkPart) {
      checked = false;
    }

    const nSt = {
      checkPart: false,
      checked: checked,
    };
    this.setState(nSt);

    const sortedTree = Tree.trees.sort(function (a, b) {
      // 排序保证从最深的有子树的节点开始遍历
      return b.props._pos.length - a.props._pos.length;
    });
    // console.log(sortedTree)
    sortedTree.forEach(function (c) {
      const cPos = c.props._pos;
      console.log("--------------排序后的 tree 操作中的 cPos: ", cPos);
      if (_pos.indexOf(cPos) === 0 && _pos !== cPos) {
        // 父节点才进的来
        console.log(
          "--------------该 tree 属于所 check 节点的父节点或者祖先节点, cPos: ",
          cPos
        );
        const childArr = toArray(c.props.children),
          len = childArr.length;

        let checkedNumbers = 0;

        console.log("该 tree children 数组 length: ", len);
        console.log(`开始计算上一状态下的${cPos}所有子节点的checkedNumbers`);
        //先计算已经选中的节点数
        for (let i = 0; i < len; i++) {
          const checkSt = Tree.treeNodesState[cPos + "-" + i];
          console.log("该 tree 子节点", cPos + "-" + i, "的状态: ", checkSt);
          if (checkSt.checked) {
            checkedNumbers++;
          } else if (checkSt.checkPart) {
            checkedNumbers += 0.5;
          }
        }
        console.log("该 tree 所有子节点 checkedNumbers", checkedNumbers);
        //点击节点的 直接父级
        if (_pos.length - cPos.length <= 2) {
          //如果原来是半选
          console.log("该 tree 是直接父级，位置：", cPos);
          console.log("所点击check节点上一个的状态", Tree.treeNodesState[_pos]);
          console.log(`所点击check节点即将变成的状态checked: ${checked}`);
          if (Tree.treeNodesState[_pos].checkPart) {
            // checked ? checkedNumbers += 0.5 : checkedNumbers -= 0.5;
            if (checked) {
              // 这个分支情况不会发生，因为最前面的判断的当前节点 checkPart 是 true 时，checked 无论是什么值就会变成 false
              checkedNumbers += 0.5;
            } else {
              checkedNumbers -= 0.5;
            }
          } else if (checked) {
            checkedNumbers++;
          } else {
            checkedNumbers--;
          }
        }
        console.log("最后 该 tree checkedNumbers", checkedNumbers);
        let newSt;
        if (checkedNumbers <= 0) {
          //都不选
          newSt = {
            checkPart: false,
            checked: false,
          };
        } else if (checkedNumbers === len) {
          //全选
          newSt = {
            checkPart: false,
            checked: true,
          };
        } else {
          //部分选择
          newSt = {
            checkPart: true,
            checked: false,
          };
        }
        c.setState(newSt);
        console.log("最后 该 tree 设置的新状态newSt: ", newSt);
        Tree.treeNodesState[cPos] = newSt;
      }
    });

    Tree.treeNodesState[_pos] = nSt;
    console.log(
      "全部祖先树节点更新完成，所check的节点更新状态到Tree.treeNodesState的 nSt: ",
      nSt
    );

    if (this.props.onChecked) {
      console.log("接下来是来自自定义的 onChecked handle: ");
      this.props.onChecked(checked, this);
    }
  };

  componentDidUpdate() {
    //console.log( this.state.checked );
    if (this.newChildren) {
      for (let i = 0; i < Tree.trees.length; i++) {
        const obj = Tree.trees[i];
        if (obj.props._pos === this.props._pos) {
          console.log(`数组第${i}个元素重复,树位置: ${this.props._pos}`);
          Tree.trees.splice(i--, 1);
          console.log('删除')
        }
      }
      console.log(
        `push 进 trees 新的位置为 ${this.props._pos} 的`,
        this
      );
      Tree.trees.push(this);
    }

    //add treeNodes checked state
    Tree.treeNodesState[this.props._pos] = {
      checked: this.state.checked,
      checkPart: this.state.checkPart,
    };
    console.log(`Tree.treeNodesState[${this.props._pos}]: `, Tree.treeNodesState[this.props._pos]);
  }

  renderChildren(children) {
    let newChildren = null;
    if (
      children.type === TreeNode ||
      (Array.isArray(children) &&
        children.every(function (item) {
          return item.type === TreeNode;
        }))
    ) {
      const cls = {};
      cls[this.props.prefixCls + "-child-tree"] = true;
      if (this.props.showLine && this.props._index !== this.props._len - 1) {
        cls.line = true;
      }
      const treeProps = {
        _level: this.props._level + 1,
        _pos: this.props._pos,
        _isChildTree: true,
        className: classNames(cls),
        showLine: this.props.showLine,
        showIcon: this.props.showIcon,
        expanded: this.state.expanded,
        expandAll: this.props.expandAll,
        //selected: this.state.checked,
        _checked: this.state.checked,
        _checkPart: this.state.checkPart,
        checkable: this.props.checkable, //只是为了传递根节点上的checkable设置,是否有更好做法?
        onChecked: this.props.onChecked,
        onSelect: this.props.onSelect,
      };
      // newChildren = <Tree {...treeProps}>{children}</Tree>;
      newChildren = this.newChildren = <Tree {...treeProps}>{children}</Tree>;
    } else {
      newChildren = children;
    }

    return newChildren;
  }
  render() {
    const props = this.props;
    const state = this.state;

    const prefixCls = props.prefixCls;
    const switchState = state.expanded ? "open" : "close";

    const switcherCls = {};
    switcherCls.button = true;
    switcherCls[prefixCls + "-treenode-switcher"] = true;
    switcherCls[prefixCls + "-switcher__" + switchState] = true;
    if (!props.showLine) {
      switcherCls["noline_" + switchState] = true;
    } else if (props._isChildTree && props._index === 0) {
      if (props._len !== 1) {
        switcherCls["center_" + switchState] = true;
      } else {
        switcherCls["bottom_" + switchState] = true;
      }
    } else if (props._index === 0) {
      switcherCls["roots_" + switchState] = true;
    } else if (props._index === props._len - 1) {
      switcherCls["bottom_" + switchState] = true;
    } else {
      switcherCls["center_" + switchState] = true;
    }

    let checkbox = null;
    const checkboxCls = {};
    if (props.checkable) {
      checkboxCls.button = true;
      checkboxCls.chk = true;
      /* jshint ignore:start */
      if (state.checkPart) {
        checkboxCls.checkbox_true_part = true;
      } else if (state.checked) {
        checkboxCls.checkbox_true_full = true;
      } else {
        checkboxCls.checkbox_false_full = true;
      }
      /* jshint ignore:end */
      checkbox = (
        <span
          ref={this.checkbox}
          className={classNames(checkboxCls)}
          onClick={this.handleChecked}
        ></span>
      );
    }

    const iconEleCls = {
      button: true,
      [prefixCls + "-iconEle"]: true,
      [prefixCls + "-icon__" + switchState]: true,
    };

    let content = props.title;
    let newChildren = this.renderChildren(props.children);
    if (newChildren === props.children) {
      // 如果 children 不全部是 TreeNode，那 this.props.children 就会直接渲染成 content
      content = newChildren;
      newChildren = null;
    }

    return (
      <li
        className={joinClasses(
          props.className,
          "level" + props._level,
          "pos-" + props._pos
        )}
      >
        <span
          className={classNames(switcherCls)}
          onClick={this.handleExpandedState}
        ></span>
        {checkbox}
        <a
          ref={this.selectHandle}
          title={content}
          className={state.selected ? prefixCls + "-selected" : ""}
          onClick={this.handleSelect}
        >
          {props.showIcon ? (
            <span className={classNames(iconEleCls)}></span>
          ) : null}
          <span className="title">{content}</span>
        </a>
        {newChildren}
      </li>
    );
  }
}
TreeNode.defaultProps = {
  title: "---",
  defaultExpanded: false,
  expanded: false,
};
