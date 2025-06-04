function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}
function findNodeById(nodes, id) {
    if(nodes == null){
        return null
    }
    for (let node of nodes) {
        if (node.id === id) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            const found = findNodeById(node.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
}


class Node {
    constructor(name, type) {
        this.type = type
        this.name = name
        this.id = uuidv4()
    }
    findNodeById(id){
        if(this.children){
            return findNodeById(this.children, id)
        }
    }
    static findNodeById(nodes, id){
        return findNodeById(nodes, id)
    }
}

class FolderNode extends Node{
    constructor(name, children) {
        super(name, "folder");
        this.children = children
    }
}

class FileNode extends Node{
    constructor(name, content) {
        super(name, "file");
        this.content = content
    }
}

export { FolderNode, FileNode, Node }