import { Folder } from "../lib/folder.js"
import { LLM } from "../lib/llm.js"

const system = `
You will receive zero or more <file> tags (each representing a complete file), and one <task> tag describing the task you must perform.
<file filePath="The path to the file">
    The full contents of the file
</file>
<task>
    Instructions describing the actions to perform, possibly involving the provided files or the creation of new ones.
</task>
You must reply with the new files or the full new contents of the current files
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
                    'description': 'The path of the modified or created file'
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

            llm.User(`${Folder.FromJson(ctx)}\n<task>\n${task}\n</task>`)
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