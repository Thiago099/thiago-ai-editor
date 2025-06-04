import { Folder } from "../lib/folder.js"
import { LLM } from "../lib/llm.js"

const system = `The file system structure is an unrestricted windows file system structure that contains nested folders with files on them 
The user will provide you the relevant file system structure represented in the following format:
<context>
<folder folderName="The name of the folder">
<file fileName="The name of the file with extension">
The full contents of the file
</file>
</folder>
</context>
<task>
Actions the user want you to perform involving the file or creation of new files.
</task>
If you provide a file that does not exist it will be created.
You must reply with only the files that must be changed, represented in the same path the user provided you, following the same xml pattern and no other text
`

let moq = '<think>\n\n</think>\n\n<folder folderName="src">\n<file fileName="user.cpp">\n#include "User.h" \n#include <iostream> \n \nUser::User() : id(0), name("Unknown"), age(0) { \n} \n \nUser::User(int id, const std::string& name, int age) : id(id), name(name), age(age) { \n} \n \nUser::~User() { \n} \n \nint User::getId() const { \n return id; \n} \n \nvoid User::setId(int id) { \n this->id = id; \n} \n \nstd::string User::getName() const { \n return name; \n} \n \nvoid User::setName(const std::string& name) { \n this->name = name; \n} \n \nint User::getAge() const { \n return age; \n} \n \nvoid User::setAge(int age) { \n this->age = age; \n}\n</file>\n<file fileName="user.h">\n#include <string> \n#pragma once \n \nclass User { \nprivate: \n int id; \n std::string name; \n int age; \npublic: \n User(); \n User(int id, const std::string& name, int age); \n ~User(); \n int getId() const; \n void setId(int id); \n std::string getName() const; \n void setName(const std::string& name); \n int getAge() const; \n void setAge(int age); \n};\n</file>\n</folder>'
moq = null
class FileSystemAI{
    static async change(url, ctx, task){
        try{
            const llm = new LLM(system, url)
            llm.User(`<context>\n${Folder.FromJson(ctx)}\n</context>\n<task>\n${task}\n</task>`)
            const message = moq ?? await llm.Continue()
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