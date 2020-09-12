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
    //console.log( this.newChildren );
    // if (this.newChildren) {
    //   Tree.trees.push(this);
    // }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      //selected: nextProps.selected,
      checkPart: nextProps._checkPart,
      checked: nextProps._checked,
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    var checkbox = this.checkbox.current;
    if (checkbox) {
      var cls = checkbox.className;
      var checkSt = Tree.treeNodesState[this.props._pos] || {};
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
    var _pos = this.props._pos;
    var checked = !this.state.checked;
    if (this.state.checkPart) {
      checked = false;
    }

    var nSt = {
      checkPart: false,
      checked: checked,
    };
    this.setState(nSt);

    var sortedTree = Tree.trees.sort(function (a, b) {
      return b.props._pos.length - a.props._pos.length;
    });
    // console.log(sortedTree)
    sortedTree.forEach(function (c) {
      var cPos = c.props._pos;
      if (_pos.indexOf(cPos) === 0 && _pos !== cPos) {
        var childArr = toArray(c.props.children),
          len = childArr.length;

        var checkedNumbers = 0;

        console.log("len: ", len);
        //先计算已经选中的节点数
        for (var i = 0; i < len; i++) {
          var checkSt = Tree.treeNodesState[cPos + "-" + i];
          console.log(cPos + "-" + i, " : ", checkSt);
          if (checkSt.checked) {
            checkedNumbers++;
          } else if (checkSt.checkPart) {
            checkedNumbers += 0.5;
          }
        }
        console.log("已选中节点 checkedNumbers", checkedNumbers);
        //点击节点的 直接父级
        if (_pos.length - cPos.length <= 2) {
          //如果原来是半选
          console.log("Tree.treeNodesState[_pos]:", Tree.treeNodesState[_pos]);
          if (Tree.treeNodesState[_pos].checkPart) {
            // checked ? checkedNumbers += 0.5 : checkedNumbers -= 0.5;
            if (checked) {
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
        console.log("父节点 checkedNumbers", checkedNumbers);
        var newSt;
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
        Tree.treeNodesState[cPos] = newSt;
      }
    });

    Tree.treeNodesState[_pos] = nSt;

    if (this.props.onChecked) {
      this.props.onChecked(checked, this);
    }
  };

  componentDidUpdate() {
    //console.log( this.state.checked );
    if (this.newChildren) {
      for (var i = 0; i < Tree.trees.length; i++) {
        var obj = Tree.trees[i];
        if (obj.props._pos === this.props._pos) {
          Tree.trees.splice(i--, 1);
        }
      }
      Tree.trees.push(this);
    }

    //add treeNodes checked state
    Tree.treeNodesState[this.props._pos] = {
      checked: this.state.checked,
      checkPart: this.state.checkPart,
    };
  }

  renderChildren(children) {
    var newChildren = null;
    if (
      children.type === TreeNode ||
      (Array.isArray(children) &&
        children.every(function (item) {
          return item.type === TreeNode;
        }))
    ) {
      var cls = {};
      cls[this.props.prefixCls + "-child-tree"] = true;
      if (this.props.showLine && this.props._index !== this.props._len - 1) {
        cls.line = true;
      }
      var treeProps = {
        _level: this.props._level + 1,
        _pos: this.props._pos,
        _isChildTree: true,
        className: classNames(cls),
        showLine: this.props.showLine,
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
    var props = this.props;
    var state = this.state;

    var prefixCls = props.prefixCls;
    var switchState = state.expanded ? "open" : "close";

    var switcherCls = {};
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

    var checkbox = null;
    var checkboxCls = {};
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

    var iconEleCls = {
      button: true,
      [prefixCls + "-iconEle"]: true,
      [prefixCls + "-icon__" + switchState]: true,
    };

    var content = props.title;
    var newChildren = this.renderChildren(props.children);
    if (newChildren === props.children) {
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
          <span className={classNames(iconEleCls)}></span>
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
