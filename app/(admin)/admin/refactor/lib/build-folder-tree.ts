export type FolderTreeNode = {
  name: string;
  path: string;
  files: string[];
  children: FolderTreeNode[];
};

export function buildFolderTree(paths: string[]): FolderTreeNode[] {
  const root: FolderTreeNode = {
    name: "",
    path: "",
    files: [],
    children: [],
  };

  for (const filePath of paths) {
    const segments = filePath.split("/");
    const fileName = segments.pop();
    if (!fileName) continue;

    let current = root;
    let dirPath = "";

    for (const segment of segments) {
      dirPath = dirPath ? `${dirPath}/${segment}` : segment;
      let child = current.children.find((node) => node.name === segment);
      if (!child) {
        child = { name: segment, path: dirPath, files: [], children: [] };
        current.children.push(child);
      }
      current = child;
    }

    current.files.push(filePath);
  }

  const sortTree = (node: FolderTreeNode) => {
    node.files.sort((a, b) => a.localeCompare(b));
    node.children.sort((a, b) => a.name.localeCompare(b.name));
    node.children.forEach(sortTree);
  };

  sortTree(root);
  return root.children;
}

export function countFilesInTree(nodes: FolderTreeNode[]): number {
  return nodes.reduce((sum, node) => sum + countFilesInNode(node), 0);
}

export function countFilesInNode(node: FolderTreeNode): number {
  return (
    node.files.length +
    node.children.reduce((sum, child) => sum + countFilesInNode(child), 0)
  );
}

export function countCheckedInTree(
  nodes: FolderTreeNode[],
  checked: Record<string, boolean>,
): number {
  return nodes.reduce(
    (sum, node) => sum + countCheckedInNode(node, checked),
    0,
  );
}

export function countCheckedInNode(
  node: FolderTreeNode,
  checked: Record<string, boolean>,
): number {
  const fileCount = node.files.filter((file) => checked[file]).length;
  const childCount = node.children.reduce(
    (sum, child) => sum + countCheckedInNode(child, checked),
    0,
  );
  return fileCount + childCount;
}
