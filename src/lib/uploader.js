import JSZip from "jszip"
import { FolderNode, FileNode } from "../application/node";
function processDirectory(path, entry, current) {
  const parts = path.split('/').filter(p => p !== '');
  let node = current;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // Check if the folder already exists in current's children
    let foundFolder = null;
    for (const child of node.children) {
      if (child.type === 'folder' && child.name === part) {
        foundFolder = child;
        break;
      }
    }

    if (!foundFolder) {
      // Create new folder
      const newFolder = new FolderNode(part, []);
      node.children.push(newFolder);
      node = newFolder;
    } else {
      node = foundFolder;
    }
  }
}

async function processFile(path, content, current) {
  const parts = path.split('/').filter(p => p !== '');
  let node = current;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    // Find the folder to navigate into
    let foundFolder = null;
    for (const child of node.children) {
      if (child.type === 'folder' && child.name === part) {
        foundFolder = child;
        break;
      }
    }

    if (!foundFolder) {
      // Create a new folder, since the file path implies it exists
      const newFolder = new FolderNode(part, []);
      node.children.push(newFolder);
      node = newFolder;
    } else {
      node = foundFolder;
    }
  }

  const fileName = parts[parts.length - 1];
  node.children.push(new FileNode(fileName, content));
}

async function readZipAndConvertToJson(file) {
  const zip = await JSZip.loadAsync(file);
  let tree = new FolderNode('', [])

  const entries = [];
  zip.forEach((relativePath, entry) => {
    entries.push({ path: relativePath, entry });
  });

  for (const { path, entry } of entries) {
    if (entry.dir) {
      await processDirectory(path, entry, tree);
    } else {
      const content = await entry.async('text');
      await processFile(path, content, tree);
    }
  }

  return tree.children;
}

export { readZipAndConvertToJson }