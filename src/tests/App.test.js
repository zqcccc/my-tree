import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import App from "../App";
import Tree, { TreeNode } from "../components/Tree";


describe("test Tree", () => {
  test("renders learn react App without crash", () => {
    const { getByText } = render(<App />);
    const linkElement = getByText("简单tree");
    expect(linkElement).toBeInTheDocument();
  });

  test("render Tree Component", () => {
    const { queryByText } = render(<Tree className="forTest">
        <TreeNode>1</TreeNode>
      </Tree>);
    const notFind = queryByText('forTest')
    expect(notFind).toBe(null)
  });

  test('should select the item', async () => {
    const handleSelect = jest.fn();
    render(<Tree checkable={true} onSelect={handleSelect}>
      <TreeNode title="parent 1">
        <TreeNode>leaf </TreeNode>
        <TreeNode>leaf 1</TreeNode>
      </TreeNode>
    </Tree>)
    const checkbox = screen.getByTitle(/parent 1/i)
    userEvent.click(checkbox)
    expect((checkbox.className).indexOf('-selected') !== -1).toBe(true)
    expect(handleSelect).toHaveBeenCalledTimes(1)
  })
});
