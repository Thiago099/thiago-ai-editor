import { XML } from "./src_server/lib/xml.js";

var xml = XML.Parse(`<folder folderName="calculator"><file fileName="styles.css">body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
    font-family: Arial, sans-serif;
}

.calculator {
    width: 300px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

#display {
    width: 100%;
    height: 60px;
    font-size: 24px;
    text-align: right;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

button {
    padding: 20px;
    font-size: 18px;
    background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
}

button:hover {
    box-shadow: 0 0 20px rgba(255,0,0,0.8), 0 0 40px rgba(255,255,0,0.8);
}

button:active {
    transform: scale(0.98);
}</file></folder>`,"file", "folder")

console.log(JSON.stringify(xml, null, 4))