import '@fortawesome/fontawesome-free/css/all.min.css';
import { readZipAndConvertToJson } from './lib/uploader.js';
import { FileSystemAI } from './application/file-system-ai.js';
import {AIEditor} from "./application/ai-editor.js"
const chat = document.querySelector('#chat')
const editorElement = document.querySelector('#editor')
const download = document.querySelector('#download')
const upload = document.querySelector('#upload')
const address = document.querySelector('#address')
const history = document.querySelector('#history')

const editor = new AIEditor(editorElement, history)


const savedAddress = localStorage.getItem('editorAddress');
if (savedAddress) {
address.value = savedAddress;
}

address.addEventListener('input', () => {
localStorage.setItem('editorAddress', address.value);
});



chat.addEventListener("click", async e=>{
    const current = document.querySelector('#chatInput').value
    const newContent = await FileSystemAI.change(address.value, editor.back().dir, current)
    if(newContent != null){
        editor.push(newContent, current)
    }
})

download.addEventListener("click", ()=>{
    editor.Download();
})


upload.addEventListener("click", ()=>{
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.click();
    input.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        const result = await readZipAndConvertToJson(file);
        editor.replace(result)
    });
})