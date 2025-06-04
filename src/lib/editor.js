import * as monaco from 'monaco-editor'

class Editor {
    constructor(element, language, value = "", readOnly = false) {

        this.originalModel = monaco.editor.createModel(
            "",
            "text/plain"
        );
        this.modifiedModel = monaco.editor.createModel(
            "",
            "text/plain"
        );

        this.editor = monaco.editor.createDiffEditor(element, {
            value: value,
            language: language,
            theme: 'vs-dark',
            readOnly: readOnly,
            automaticLayout: true,
            showUnused:false,

            enableSplitViewResizing: false,
            renderSideBySide: false,

        })
        this.editor.setModel({
            original: this.originalModel,
            modified: this.modifiedModel,
        });

        this.editor.updateOptions({renderValidationDecorations: 'off', showDeprecated: false});
        this.decorationsCollection = null; 
    }
    detectLanguage(filename){
        const ext = filename.split('.').pop()
        const language = monaco.languages.getLanguages().find(lang => lang.extensions?.includes('.' + ext))?.id

        if (language) {
            monaco.editor.setModelLanguage(this.originalModel, language)
            monaco.editor.setModelLanguage(this.modifiedModel, language)
        }
    }
    set language(value){
        const model = this.editor.getModel();
        monaco.editor.setModelLanguage(model, value);
    }
    get language(){
        const model = this.editor.getModel();
        return model.getLanguageId();
    }
    set original(value) {
        this.originalModel.setValue(value)
    }
    set modified(value) {
        this.modifiedModel.setValue(value)
    }
    static get languages(){
        return monaco.languages.getLanguages();
    }
    static GetLanguageName(input){
        if(input == null){
            return null
        }
        for(const language of this.languages){
            if(language.id == input){
                if(language.aliases){
                    return language.aliases[0]
                }
                return language.id
            }
        }
        return null
    }
    addEventListener(callback) {
        this.modifiedModel.onDidChangeContent((e) => {
            callback(this.modifiedModel.getValue())
        });
    }
}

export { Editor }