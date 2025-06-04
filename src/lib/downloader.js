import JSZip from "jszip"
import { saveAs } from 'file-saver';
function processNode(node, zip, currentPath) {
  if (node.type === 'folder') {
    for (const child of node.children) {
      const newPath = `${currentPath}${node.name}/`;
      processNode(child, zip, newPath);
    }
  } else if (node.type === 'file') {
    zip.file(`${currentPath}${node.name}`, node.content);
  }
}
async function generateZipAndDownload(name, json) {
  const zip = new JSZip();
  for(const item of json){
      processNode(item, zip, '');
  }
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, name);
}




export { generateZipAndDownload }