import "./tree.css"
import { FolderNode, FileNode, Node } from "../application/node.js";


let currentNode = null
function generateHtmlTree(data, callback) {
    const tree = document.createElement('div')
    tree.classList.add("tree")
    const contextMenu = document.createElement('div')
    contextMenu.classList.add("context-menu")
    document.body.appendChild(contextMenu)
    
    function renderNodes(nodes, parentElement, root = false) {

        if(!root){
            tree.innerHTML = '';
            parentElement.classList.add("tree-list")
        }
        const sortedNodes = [...nodes].sort((a, b) => {
            if (a.type === 'folder' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'folder') return 1;
            return a.name.localeCompare(b.name);
        });

        sortedNodes.forEach(node => {

            const li = document.createElement('div')
            li.className = node.type

            if(node.type == "file" && node.oldContent != null && node.oldContent != node.Content){
                li.classList.add("file-modified")
            }

            if(node.type == "folder"){
                li.classList.add("folder-open")
            }

            li.draggable = true
            
            const span = document.createElement('span')
            span.textContent = node.name
            li.appendChild(span)
            
            li.dataNode = node
            li.id = node.id
            
            if (node.children && node.children.length > 0) {
                const ul = document.createElement('div')
                renderNodes(node.children, ul)
                li.appendChild(ul)
            }
            
            // Context menu
            li.addEventListener('contextmenu', function(e) {
                e.preventDefault()
                e.stopPropagation()
                contextMenu.style.display = 'block'
                contextMenu.style.left = `${e.pageX}px`
                contextMenu.style.top = `${e.pageY}px`
                
                currentNode = this
                if (this.classList.contains('folder')) {
                    contextMenu.innerHTML = `
                    ${root?``:`
                        <div id="rename"><i class="fas fa-edit"></i> Rename</div>
                        <div id="delete"><i class="fas fa-trash"></i> Delete</div>
                        <hr/>    
                    `}
                        
                        <div id="new-folder"><i class="fas fa-folder-open"></i> Add Folder</div>
                        <div id="new-file"><i class="fas fa-file-alt"></i> Add File</div>
                    `;
                } else {
                    contextMenu.innerHTML = `
                        <div id="rename"><i class="fas fa-edit"></i> Rename</div>
                        <div id="delete"><i class="fas fa-trash"></i> Delete</div>
                    `; 
                }
            })

            // Highlight on click for files, toggle folder children
            if (node.type === 'file') {
                li.addEventListener('click', function(e) {
                    e.stopPropagation()
                    document.querySelectorAll('.file').forEach(file => {
                        file.classList.remove('highlighted');
                    });
                    if(!this.classList.contains('highlighted')){
                        this.classList.add('highlighted');
                        callback(node)
                    }
                });
            }else if (node.type === 'folder'&& node.collapsible !== false) {
                li.addEventListener('click', function(e) {
                    e.stopPropagation()
                    const childrenContainer = this.querySelector('.tree-list');
                    if (childrenContainer) {
                        childrenContainer.style.display = childrenContainer.style.display === 'none' ? 'block' : 'none';
                    }
                    if(childrenContainer.style.display === 'none'){
                        this.classList.remove('folder-open');
                    }
                    else{
                        this.classList.add('folder-open');
                    }
                });
            }
            
            // Drag and drop
            li.addEventListener('dragstart', function(e) {
                const draggedNode = e.target.dataNode;
                let originalParentDataNode = null;
                let currentElement = e.target.parentNode;

                while (currentElement) {
                    if (currentElement?.classList?.contains('folder')) {
                        originalParentDataNode = currentElement.dataNode;
                        break;
                    }
                    currentElement = currentElement.parentNode;
                }

                const dataToTransfer = {
                    draggedNodeId: draggedNode.id,
                    originalParentId: originalParentDataNode ? originalParentDataNode.id : null
                };
                e.dataTransfer.setData("text/plain", JSON.stringify(dataToTransfer));
            });

            parentElement.appendChild(li)
        })
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#context-menu')) {
            contextMenu.style.display = 'none'
            currentNode = null
        }
    })

    contextMenu.addEventListener('click', function(e) {
        const target = e.target
        if (target.tagName === 'DIV') {
            if (target.id === 'rename' && currentNode) {
                const nameSpan = currentNode.querySelector('span')
                const newName = prompt("Enter new name:", nameSpan.textContent)
                if (newName !== null && newName.trim() !== '') {
                    nameSpan.textContent = newName
                    const nodeData = currentNode.dataNode
                    nodeData.name = newName
                }
            } else if (target.id === 'delete' && currentNode) {

                let currentElement = currentNode.parentNode;

                let originalParentDataNode = null;

                while (currentElement) {
                    if (currentElement?.classList?.contains('folder')) {
                        originalParentDataNode = currentElement.dataNode;
                        break;
                    }
                    currentElement = currentElement.parentNode;
                }

                var children = originalParentDataNode.children

                const indexInOriginal = children.findIndex(
                    child => child.id === currentNode.dataNode.id
                );

                if (indexInOriginal !== -1) {
                    children.splice(indexInOriginal, 1);
                }
                
                const parentNode = currentNode.parentNode
                parentNode.removeChild(currentNode)
            } else if (target.id === 'new-file' && currentNode.classList.contains('folder')) {
                const newName = prompt("Enter new file name:")
                if (newName !== null && newName.trim() !== '') {
                    
                    const parentNodeData = currentNode.dataNode
                    const file = new FileNode(newName, '')
                    parentNodeData.children.push(file)
                    renderNodes([data], tree, true)
                    document.getElementById(file.id).click()
                }
            } else if (target.id === 'new-folder' && currentNode.classList.contains('folder')) {
                const newName = prompt("Enter new folder name:")
                if (newName !== null && newName.trim() !== '') {
                    
                    const parentNodeData = currentNode.dataNode
                    const folder = new FolderNode(newName, [])
                    parentNodeData.children.push(folder)
                    renderNodes([data], tree, true)
                }
            }
            contextMenu.style.display = 'none'
        }
    })

    // Drag over and drop handling
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation()
        const targetElement = e.target.closest('.folder');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (event) =>{
                    targetElement.dataNode.children.push(new FileNode(file.name, event.target.result))
                    renderNodes([data], tree, true);
                    console.log(data)
                };
                reader.readAsText(file);
            }
            return
        }

        const dataTransferData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const draggedNodeId = dataTransferData.draggedNodeId;
        const originalParentId = dataTransferData.originalParentId;

        if (targetElement) {
            const newParentDataNode = targetElement.dataNode;

            // Find the dragged node and original parent in the data structure
            const draggedNode = Node.findNodeById([data], draggedNodeId);
            const originalParentDataNode = originalParentId ? Node.findNodeById([data], originalParentId) : null;

            let isDescendant = false;
            function checkDescendants(node, targetId) {
                if (node.id === targetId) {
                    return true;
                }
                if (node.children) {
                    for (const child of node.children) {
                        if (checkDescendants(child, targetId)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            isDescendant = checkDescendants(draggedNode, newParentDataNode.id);
            if (isDescendant) {
                return;
            }


            if (draggedNode && originalParentDataNode) {
                const indexInOriginal = originalParentDataNode.children.findIndex(
                    child => child.id === draggedNodeId
                );
                if (indexInOriginal !== -1) {
                    originalParentDataNode.children.splice(indexInOriginal, 1);
                    newParentDataNode.children.push(draggedNode);
                }

            }

            renderNodes([data], tree, true);
        }
    });

    renderNodes([data], tree, true)
    return tree
}

export { generateHtmlTree }