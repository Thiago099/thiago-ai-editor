import { Folder } from "../lib/folder.js"
import { LLM } from "../lib/llm.js"

const system = `
The user will provide you with the current state of the file system <fileSystem></fileSystem> and a <task></task>
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