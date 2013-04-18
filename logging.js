module.exports = function logging_function(color) {
    var logging = {
        settings : console.log("Settings loaded."),
        http : console.log(color.fggreen+"HTTP loaded."+color.reset)
    }
    return logging;
}
