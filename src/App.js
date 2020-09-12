import React from "react";
import Tree, { TreeNode } from "./components/Tree";
// import "./components/Tree/index.less";
import "./App.less";

function handleSelect(selected, c) {
  console.log(selected, c);
}
function handleChecked(checked, c) {
  console.log("from App checked handle: ", checked, c);
}

export default function App() {
  return (
    <div className="App">
      <h2>simple</h2>
      <Tree onSelect={handleSelect}>
        <TreeNode title="parent 1">
          <TreeNode>leaf </TreeNode>
          <TreeNode title="parent 1-1">
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
        </TreeNode>
      </Tree>

      <h2>checkbox</h2>
      <Tree
        className="myCls"
        onSelect={handleSelect}
        onChecked={handleChecked}
        checkable={true}
        showLine={false}
        expandAll={false}
      >
        <TreeNode title="parent 1" expanded={true}>
          <TreeNode>leaf </TreeNode>
          <TreeNode title="parent 1-1" expanded={true} defaultExpanded={false}>
            <TreeNode title="parent 2-1">
              <TreeNode>leaf </TreeNode>
              <TreeNode>leaf </TreeNode>
            </TreeNode>
            <TreeNode>leaf </TreeNode>
            <TreeNode>
              <TreeNode>leaf </TreeNode>
            </TreeNode>
          </TreeNode>
        </TreeNode>
        <TreeNode>leaf </TreeNode>
        <TreeNode>
          <TreeNode>leaf </TreeNode>
        </TreeNode>
      </Tree>
    </div>
  );
}
