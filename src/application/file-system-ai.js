import { Folder } from "../lib/folder.js"
import { LLM } from "../lib/llm.js"

const system = `
You will receive zero or more <file> tags (each representing a complete file), and one <task> tag describing the task you must perform.

<file fullPath="full/path/name.ext">
    The full contents of the file
</file>
<task>
    Instructions describing the actions to perform, possibly involving the provided files or the creation of new ones.
</task>

Your response must include only the files that need to be changed or created, using the same <file> XML format. Do not include any other text or explanation.
`

class FileSystemAI{
    static async change(url, ctx, task){
        try{
            const llm = new LLM(system, url)
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