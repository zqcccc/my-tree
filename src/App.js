import React from "react";
import Tree, { TreeNode } from "./components/Tree";
// import "./components/Tree/index.less";
import "./App.less";

function handleSelect(selected, c) {
  console.log(selected, c);
}

export default function App() {
  return (
    <div className="App">
      <h2>简单tree</h2>
      <Tree className="myCls" onSelect={handleSelect} checkable={true}>
        <TreeNode title="parent 1" expanded={false}>
          <TreeNode>leaf </TreeNode>
          <TreeNode title="parent 1-1">
            <TreeNode title="parent 2-1">
              <TreeNode>leaf </TreeNode>
              <TreeNode>leaf </TreeNode>
            </TreeNode>
            <TreeNode>leaf </TreeNode>
            <TreeNode>leaf </TreeNode>
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
