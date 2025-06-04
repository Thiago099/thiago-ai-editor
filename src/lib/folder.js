import { FolderNode, FileNode } from "../application/node.js";
import fs from "fs"
import path from "path"
import {XML} from "./xml.js"
function getFolderAsXML(folderPath) {
  const result = [];
  try {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const fullPath = path.join(folderPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        result.push(`<folder folderName="${item}">`);
        result.push(getFolderAsXML(fullPath));
        result.push(`</folder>`);
      } else {
        const content = fs.readFileSync(fullPath, 'utf-8');
        result.push(`<file fileName="${item}">`);
        result.push(content);
        result.push(`</file>`);
      }
    }
  } catch (err) {
    console.log(err)
    return '';
  }

  return result.join('\n');
}

function parseAST(input){
  console.log(input)
  const result = []
  for(const item of input){
    if(item.tag == "folder"){
      result.push(new FolderNode(item.parameters.folderName, parseAST(item.children)))
    }
    else if(item.tag == "file"){
      result.push(new FileNode(item.parameters.fileName, item.content))
    }
  }
  return result
}
function jsonToXml(node) {
  let result = "";

  // Start tag with appropriate attribute based on type
  if (node.type === "file") {
    result += `<file fileName="${node.name}">`;
    result += node.content;
    result += `</file>`;
  } else if (node.type === "folder") {
    result += `<folder folderName="${node.name}">`;

    // Process each child recursively
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        result += jsonToXml(child);
      }
    }

    result += `</folder>`;
  }

  return result;
}

class Folder{
    static GetRaw(path){
      return getFolderAsXML(path)
    }
    static Get(path){
        return this.Parse(getFolderAsXML(path))
    }
    static FromJson(json){
      return json.map(jsonToXml)
    }
    static Parse(str){
      return parseAST(XML.Parse(str, "file", "folder"))
    }
}

export { Folder }