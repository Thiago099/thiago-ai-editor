import { Folder } from "../lib/folder.js"
import { LLM } from "../lib/llm.js"

const system = `
You will receive zero or more <file> tags (each representing a complete file), and one <task> tag describing the task you must perform.

<file filePath="path/to/file.ext">
    The full contents of the file
</file>
<task>
    Instructions describing the actions to perform, possibly involving the provided files or the creation of new ones.
</task>

You must provide the full contents of any files in your response.
Reply with files to solve the user issue.
`
const schema = {
    'name': 'file_system',
    'strict': true,
    'schema': {
        'type': 'array',
        'items':  {
        'type': 'object',
            'properties': {
                'path': {
                    'type': 'string',
                    'description': 'The path of the modified or created file'
                },
                'contents': {
                    'type': 'string',
                    'description': 'The full contents of the modified file'
                },
            },
            'required': ['path', 'contents'],
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