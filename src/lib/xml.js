function parseXML(xml, ...tags) {
    let root = {children:[]}
    let stack = [root]
    for(let i = 0; i < xml.length;i++) {
        let processedTags = false
        for(const tag of tags){
            let c = i
            if(xml[c] == "<"){
                c++
                let open = true
                if(xml[c] == "/"){
                    c++
                    open = false
                }
                let found = true;
                for(let j = 0; j < tag.length; j++){
                    if(xml[c+j] != tag[j]){
                        found = false
                        break
                    }
                }
                if(found){
                    if(open){
                        let rawParameters = ""
                        while(c < xml.length && xml[c] != ">"){
                            rawParameters += xml[c]
                            c++
                        }
                        i = c

                        const parameters = {}
                        for (const part of rawParameters.trim().split(/\s+/)) {
                            const [key, value] = part.split("=")
                            if (key && value) {
                                parameters[key] = value.replace(/^['"]|['"]$/g, "")
                            }
                        }

                        const current = {tag}

                        if(Object.keys(parameters).length > 0){
                            current.parameters = parameters
                        }

                        const top = stack.at(-1)
                        if(!top.children){
                            top.children = []
                        }
                        top.children.push(current)
                        stack.push(current)

                    }
                    else{
                        while(c < xml.length && xml[c] != ">"){
                            c++
                        }
                        i = c
                        
                        const top = stack.at(-1)
                        const content = top.content.trim()

                        if(content == ""){
                            delete top.content
                        }
                        else{
                            top.content = content
                        }

                        stack.pop()
                    }
                    processedTags = true
                    break
                }
            }
        }
        const top = stack.at(-1)
        if(!top.content){
            top.content = ""
        }
        
        if(!processedTags){
            top.content += xml[i]
        }
    }
    return root.children
}

class XML{
    static Parse(content, ...tags){
        return parseXML(content, ...tags)
    }
}
export {XML}