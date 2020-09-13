import React from "react";
import Tree, { TreeNode } from "./components/Tree";
// import "./components/Tree/index.less";
import "./App.less";

function handleSelect(selected, c, selectedKeys) {
  console.log("from App select handle: ", selected, c, selectedKeys);
}
function handleChecked(checked, c) {
  console.log("from App check handle: ", checked, c);
}

export default function App() {
  return (
    <div className="App">
      <div>
        <h2>simple</h2>
        <Tree onSelect={handleSelect} expandAll={true} showIcon={false}>
          <TreeNode title="parent 1">
            <TreeNode>leaf </TreeNode>
            <TreeNode title="parent 1-1">
              <TreeNode>leaf </TreeNode>
              <TreeNode>leaf </TreeNode>
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>

      <div>
        <h2>expanded</h2>
        <Tree className="myCls">
          <TreeNode title="parent 1" expanded={true}>
            <TreeNode>leaf </TreeNode>
            <TreeNode title="parent 1-1" defaultExpanded={true}>
              <TreeNode>leaf </TreeNode>
              <TreeNode>
                <TreeNode>leaf </TreeNode>
                <TreeNode>leaf </TreeNode>
              </TreeNode>
            </TreeNode>
            <TreeNode title="parent 1-2" defaultExpanded={false}>
              <TreeNode>leaf </TreeNode>
              <TreeNode>leaf </TreeNode>
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>

      <div>
        <h2>select</h2>
        <Tree
          expandAll={true}
          onSelect={handleSelect}
          defaultSelectedKeys={["p1", "p22"]}
        >
          <TreeNode title="parent 1" key="p1">
            <TreeNode key="p10">leaf </TreeNode>
            <TreeNode title="parent 1-1" key="p11" disabled>
              <TreeNode title="parent 2-1" key="p21">
                <TreeNode>leaf </TreeNode>
                <TreeNode>leaf </TreeNode>
              </TreeNode>
              <TreeNode key="p22">leaf</TreeNode>
              <TreeNode>leaf </TreeNode>
            </TreeNode>
          </TreeNode>
          <TreeNode>leaf </TreeNode>
          <TreeNode>
            <TreeNode>leaf </TreeNode>
          </TreeNode>
        </Tree>
      </div>

      <div>
        <h2>checkbox</h2>
        <Tree expandAll={true} checkable={true} onChecked={handleChecked}>
          <TreeNode title="parent 1">
            <TreeNode title="child1" defaultChecked={true}>
              <TreeNode>child11 </TreeNode>
              <TreeNode>child12 </TreeNode>
            </TreeNode>
            <TreeNode title="child2">
              <TreeNode title="child21">
                <TreeNode>child211 </TreeNode>
                <TreeNode>child212 </TreeNode>
              </TreeNode>
              <TreeNode checked={true}>child22 </TreeNode>
              <TreeNode checked={true}>child23 </TreeNode>
            </TreeNode>
          </TreeNode>
          <TreeNode title="parent 2">
            <TreeNode checked={true}>child2 </TreeNode>
          </TreeNode>
        </Tree>
      </div>

      <div>
        <h2>custom checkbox</h2>
        <Tree expandAll={true} checkable={true} onChecked={handleChecked}>
          <TreeNode
            title="parent 1"
            checkbox={<input type="checkbox" defaultChecked={false} />}
          >
            <TreeNode>child1 </TreeNode>
            <TreeNode
              title="parent 1-1"
              checkbox={<input type="checkbox" defaultChecked={false} />}
            >
              <TreeNode>leaf </TreeNode>
              <TreeNode>leaf </TreeNode>
            </TreeNode>
          </TreeNode>
          <TreeNode>leaf </TreeNode>
        </Tree>
      </div>
    </div>
  );
}
