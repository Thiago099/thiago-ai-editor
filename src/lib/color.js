const Reset = "\x1b[0m"
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const Underscore = "\x1b[4m"
const Blink = "\x1b[5m"
const Reverse = "\x1b[7m"
const Hidden = "\x1b[8m"

const FgBlack = "\x1b[30m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"
const FgGray = "\x1b[90m"

const BgBlack = "\x1b[40m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"
const BgGray = "\x1b[100m"
class Color{
    static FgBlack(str){
        return FgBlack + str + Reset;
    } 
    static FgRed(str){
        return FgRed + str + Reset;
    } 
    static FgGreen(str){
        return FgGreen + str + Reset;
    } 
    static FgYellow(str){
        return FgYellow + str + Reset;
    } 
    static FgBlue(str){
        return FgBlue + str + Reset;
    } 
    static FgMagenta(str){
        return FgMagenta + str + Reset;
    } 
    static FgCyan(str){
        return FgCyan + str + Reset;
    } 
    static FgWhite(str){
        return FgWhite + str + Reset;
    } 
    static FgGray(str){
        return FgGray + str + Reset;
    } 
}

export { Color }