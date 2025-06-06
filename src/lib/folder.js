import { FileNode, FolderNode } from "../application/node.js"


function parseAST(input) {
  const root = new FolderNode("root", [])
  for (const item of input) {
    const fullPath = item.path
    const parts = fullPath.split("/")
    const fileName = parts.pop()

    let current = root
    for (const part of parts) {
      let next = current.children.find(child => child instanceof FolderNode && child.name === part)
      if (!next) {
        next = new FolderNode(part, [])
        current.children.push(next)
      }
      current = next
    }

    current.children.push(new FileNode(fileName, item.contents))
  }

  return root.children
}

function jsonToXml(node, currentPath = "") {
  if (node.type === "file") {
    const filePath = (currentPath ? currentPath + "/" : "") + node.name
    return `<file filePath="${filePath}">${node.content}</file>`
  }

  if (node.type === "folder") {
    const newPath = (currentPath ? currentPath + "/" : "") + node.name
    return node.children.map(child => jsonToXml(child, newPath)).join("")
  }

  return ""
}

class Folder {
  static FromJson(json) {
    return json.map(jsonToXml)
  }
  static Parse(str) {
    return parseAST(JSON.parse(str))
  }
}

export { Folder }
