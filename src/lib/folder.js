import { FileNode, FolderNode } from "../application/node.js"
import { XML } from "./xml.js"


function parseAST(input) {
  const root = new FolderNode("root", [])

  for (const item of input) {
    if (item.tag !== "file") continue

    const fullPath = item.parameters.fullPath
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

    current.children.push(new FileNode(fileName, item.content))
  }

  return root.children
}

function jsonToXml(node, currentPath = "") {
  if (node.type === "file") {
    const filePath = (currentPath ? currentPath + "/" : "") + node.name
    return `<file fullPath="${filePath}">${node.content}</file>`
  }

  if (node.type === "folder") {
    const newPath = (currentPath ? currentPath + "/" : "") + node.name
    return node.children.map(child => jsonToXml(child, newPath)).join("")
  }

  return ""
}

class Folder {
  static GetRaw(path) {
    return getFilesAsXML(path)
  }
  static Get(path) {
    return this.Parse(getFilesAsXML(path))
  }
  static FromJson(json) {
    return json.map(jsonToXml)
  }
  static Parse(str) {
    return parseAST(XML.Parse(str, "file"))
  }
}

export { Folder }
