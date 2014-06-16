var dirApi, dirExamples, dirProperties, apiContent,
    exampleContent, propertiesContent, subPropertiesContent;

dirApi = "/config/apis";
dirExamples = "/config/examples";
dirProperties = "/config/properties";

apiContent = {};
exampleContent = {};
propertiesContent = {};
subPropertiesContent = {};

var pages = [{
    page : "About",
    url : "/about.jag"
}, {
    page : "Quickstart",
    url : "/quickstart.jag"
}, {
    page : "Documentation",
    url : "/documentation.jag"
}, {
    page : "Tools",
    url : "/tools.jag"
}, {
    page : "Samples",
    url : "/samples.jag"
}, {
    page : "Try it!",
    url : "/tryit.jag"
}];
var log = new Log();
function readExamples () {
    var file, fileName;
    var dir = new File(dirExamples);
    if (dir.isDirectory()) {
        var listFiles = dir.listFiles();
        var fileCount = listFiles.length;

        for (var i = 0; i < fileCount; i++) {
            file = listFiles[i];
            file.open("r");
            fileName = (file.getName()).split(".");
            exampleContent[fileName[0]] = file.readAll(); //check object assignment is right
            file.close();
        }
    }
}


//need to change this.it has dir inside dir
function readProperties () {
    var file, subDirFile, fileName, subDirFileSet;
    var dir = new File(dirProperties);
    if (dir.isDirectory()) {
        var listFiles = dir.listFiles();
        var fileCount = listFiles.length;

        for (var i = 0; i < fileCount; i++) {
            file = listFiles[i];

            if (file.isDirectory()) {

                var subListFiles = file.listFiles();
                var subFileCount = subListFiles.length;
                subDirFileSet = {};
                subPropertiesContent[file.getName()] = subDirFileSet;

                for (var k = 0; k < subFileCount; k++) {
                    subDirFile = subListFiles[k];
                    subDirFile.open("r");
                    fileName = (subDirFile.getName()).split(".");
                    //subPropertiesContent[fileName[0]] = subDirFile.readAll();
                    subDirFileSet[fileName[0]] = subDirFile.readAll();
                    subDirFile.close();

                }
            } else {
                file.open("r");
                fileName = (file.getName()).split(".");
                propertiesContent[fileName[0]] = file.readAll();
                file.close();
            }
        }
    }
}

function readApis () {
    var file, fileName;
    var dir = new File(dirApi);
    if (dir.isDirectory()) {
        var listFiles = dir.listFiles();
        var fileCount = listFiles.length;

        for (var i = 0; i < fileCount; i++) {
            file = listFiles[i];
            file.open("r");
            var jsonApi = JSON.parse(file.readAll());
            fileName = (file.getName()).split(".");
            apiContent[fileName[0]] = jsonApi.overview;
        }
    }
}

function hasOwnProperty (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

var fullContents = {};

function fullContent() {
    var subContent;
    var apiKeys = Object.keys(apiContent);

    apiKeys.every(function(value) {
        value = value.toString();

        fullContents[value] = apiContent[value];

        if(hasOwnProperty(exampleContent, value)) {
            fullContents[value] = fullContents[value].concat("*******").
                concat(exampleContent[value]);
        }

        if(hasOwnProperty(propertiesContent, value)) {
            fullContents[value] = fullContents[value].concat("*******").
                concat(propertiesContent[value]);
        }

        if(hasOwnProperty(subPropertiesContent, value)) {
            subContent = subPropertiesContent[value];

            for (var key in subContent) {
                fullContents[value] = fullContents[value].concat("********").
                    concat(subContent[key]);
            }
        }
        return true;
    });
}


var read = function () {
    readExamples();
    readProperties();
    readApis();

    fullContent();

    var k = Object.keys(fullContents);
    var log = new Log();
    log.info("((((((((((((((((((((((((((((((("+ k.length);
    log.info("&&&&&&&&&&&&");
    log.info(fullContents["file"]);

}
