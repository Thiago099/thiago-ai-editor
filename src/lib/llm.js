import fs from "fs"
import axios from 'axios';
import { Color } from "./color.js";
async function sendPostRequest(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error sending POST request:', error);
    throw error;
  }
}

class LLM {
    verbose = true
    constructor(system, url, ...functions) {

        this.callbacks = []

        for(const item of functions){
            this.callbacks[item.name] = item.callback
        }
        this.functions = functions
        this.chatUrl = url + "/v1/chat/completions" 
        this.history = [
            {
                "role": "system",
                "content": system // "/no_think\n"+
            }
        ]
    }
    PromptForget(prompt){
        const llm = new LLM(this.system, ...this.functions)
        llm["json_schema"] = this["json_schema"]
        llm.User(prompt)
        return llm.Continue()
    }
    Tool({name, id, message}){
        if(this.verbose) {
            console.log(Color.FgCyan("Result from command "+name+" to ai: \n" + message))
        }
        this.history.push({
            "role": "tool",
            "name": name,
            "tool_call_id": id,
            "content": message
        })
    }

    User(message){
        if(this.verbose) {
            console.log(Color.FgGreen("--------------User\n" + message))
        }
        this.history.push({
            "role": "user",
            "content": message
        })
    }

    async Continue(toolChoice="auto"){
        const request = {
            "messages": this.history,
            "tools": this.functions.map(x=>x.get()),
            "tool_choice": toolChoice
        }
        if(this["json_schema"]){
            request["response_format"] = {
                'type': 'json_schema',
                'json_schema': this["json_schema"]
            }
        }

        const response = await sendPostRequest(this.chatUrl,request)


        const calls = response?.choices?.at(0)?.message?.tool_calls ?? []
        const toolResult = []
        for(const call of calls){
            const fn = call?.function;
            toolResult.push({
                id: call.id,
                name: fn.name,
                message: await this.callbacks[fn.name](JSON.parse(fn.arguments)),
            })
        }

        if(toolResult.length > 0){
            for(const item of toolResult){
                this.Tool(item)
            }
            return await this.Continue("none")
        }

        const result = response?.choices[0]?.message?.content?.replace(/<think>.*?<\/think>/gmis,"")?.trim()

        if(result!=null){
            this.history.push({
                "role":"assistant",
                "message": result
            })
            if(this.verbose) {
                console.log(Color.FgYellow("--------------Assistant\n" + result))
            }
        }



        return result
    }
}

export { LLM }