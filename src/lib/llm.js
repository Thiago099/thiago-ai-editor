
import axios from 'axios';
import { Color } from "./color.js";
import { Popup } from './popup.js';

async function sendPostRequest(url, data) {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('Error sending POST request:',error);
    Popup.Show("An error occurred while sending the POST request: "+error, Popup.colorError);
    return null
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

        const response = await sendPostRequest(this.chatUrl,
        {
            "messages": this.history,
            "tools": this.functions.map(x=>x.get()),
            "tool_choice": toolChoice
        })

        if(response == null){
            return null
        }


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