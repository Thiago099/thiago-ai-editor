import { Folder } from "../lib/folder.js"
import { LLM } from "../lib/llm.js"


class Schema{
    constructor(name, schema) {
        this.name = name
        this.strict = true
        this.schema = schema
    }
}

class NumberSchema{
    constructor(description) {
        this.type = "number"
        this.description = description
    }
}
class StringSchema{
    constructor(description) {
        this.type = "string"
        this.description = description
    }
}

class EnumSchema{
    constructor(description, ...options) {
        this.type = "string"
        this.enum = options
        this.description = description
    }
}

class ObjectSchema{
    constructor(description, properties) {
        this.type = "object"
        this.description = description
        this.properties = properties
        this.required = Object.keys(properties);
    }
}
class ArraySchema{
    constructor(description, items) {
        this.type = "array"
        this.description = description
        this.items = items
    }
}


const system = `
The user will provide you with the current state of the file system: <fileSystem></fileSystem>, and a task: <task></task>
you must modify the files in order to do what the user wants
`
const schema = {
    'name': 'file_system',
    'strict': true,
    'schema': {
        'type': 'array',
        'items':  {
        'type': 'object',
            'properties': {
                'filePath': {
                    'type': 'string',
                    'description': 'The path inside the project folder of the modified or created file'
                },
                'fileContent': {
                    'type': 'string',
                    'description': 'The full contents of the modified file'
                },
            },
            'description': 'A file that must be created or modified',
            'required': ['filePath', 'fileContent'],
        },
        'description': 'A list of all the files that must be created or modified'
    }
}

class FileSystemAI{
    static async change(url, ctx, task){
        try{
            const llm = new LLM(system, url)

            llm["json_schema"] = schema
            llm.User(`<fileSystem>${Folder.FromJson(ctx)}</fileSystem>\n<task>\n${task}\n</task>`)
            const message = await llm.Continue()
            if(message == null){
                return message
            }
            return Folder.Parse(message)
        }
        catch(e){
            console.error(e)
        }
    }
}

export { FileSystemAI }