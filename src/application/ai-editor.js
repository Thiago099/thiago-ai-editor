import {Editor} from "../lib/editor.js"
import { generateHtmlTree } from "../lib/tree.js"
import { generateZipAndDownload } from "../lib/downloader.js"
import { FolderNode, Node } from "./node.js";
function merge(newV, oldV){
    const add = []
    for(const item2 of oldV){
        let found = false
        for(const item of newV) {
            if(item.type == item2.type && item.name == item2.name){
                if(item.type == "folder"){
                    item.id = item2.id
                    merge(item.children, item2.children)
                }
                else{
                    item.oldContent = item2.content
                    item.id = item2.id
                }
                found = true;
                break;
            }
        }
        if(!found){
            add.push(item2)
        }
    }
    for(const item of add){
        newV.push(item)
    }
}
function buildTree(self, children){
    const treeContainer = document.querySelector('#tree')

    const root = new FolderNode("workspace", children)
    root.collapsible = false
    const tree = generateHtmlTree(root, x=> {
        self.editor.detectLanguage(x.name)
        self.load(x.id)
    })

    treeContainer.innerHTML = ""
    treeContainer.appendChild(tree)
}

class AIEditor{
    selected = null
    context = [{dir:[], prompt:""}, {dir:[], prompt:"Initial state"}]
    constructor(editorElement, historyElement) {
        this.top = -1
        this.historyElement = historyElement
        this.editor = new Editor(editorElement)
        this.editor.addEventListener(content=>{
            const node = Node.findNodeById(this.back().dir, this.selected)
            node.content = content
        })
        buildTree(this, this.context.at(this.top).dir)
        this.buildHistory()
    }
    Download(){
        generateZipAndDownload("workspace.zip", this.back().dir)
    }
    conform(){
        const newContent = this.context.at(this.top)
        const old = this.context.at(this.top-1)
        merge(newContent.dir, old.dir)
        buildTree(this, newContent.dir)
        this.load(this.selected)
        this.buildHistory()
    }
    replace(newContent){
        this.context = [{dir:[], prompt:""}, {dir:[], prompt:"Initial state"}]
        this.context.push({dir:newContent, prompt:""})
        this.top = -1
        this.conform()
    }
    push(newContent, prompt){
        this.context = this.context.slice(0, this.context.length + this.top + 1)
        this.context.push({dir:newContent, prompt})
        this.top = -1
        this.conform()
    }
    buildHistory(){
        this.historyElement.innerHTML = ""
        for(const item of this.context){
            const current = document.createElement("a")
            if(this.context.at(this.top) == item){
                current.classList.add("selected")
            }
            else{
                current.addEventListener("click", () =>{
                    this.top = -1
                    while(this.context.at(this.top) != item&&this.context.at(this.top) != null){
                        this.top--
                    }
                    this.conform()
                })
            }
            current.classList.add("history-item")
            current.innerHTML = `<h3>${item.prompt}</h3>`
            this.historyElement.appendChild(current)
        }
    }
    back(){
        return this.context.at(this.top)
    }
    load(x){
        if(x == null){
            return
        }
        this.selected = x

        const node = Node.findNodeById(this.back().dir, x)

        if(node != null){
            this.editor.original = node.oldContent ?? node.content
            this.editor.modified = node.content
        }

    }

}

export { AIEditor }