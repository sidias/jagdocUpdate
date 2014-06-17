var dirApi, dirExamples, dirProperties, dirHbs, hbsFileSet, apiContent,
    exampleContent, propertiesContent, subPropertiesContent;

dirApi = "/config/apis";
dirExamples = "/config/examples";
dirProperties = "/config/properties";
dirHbs = "/themes/ROOT/partials/";

apiContent = {};
exampleContent = {};
propertiesContent = {};
subPropertiesContent = {};

var pages = [{
    page : "about.hbs",
    url : "/about.jag"
}, {
    page : "documentation.hbs",
    url : "/documentation.jag"
}, {
    page : "quickstart.hbs",
    url : "/quickstart.jag"
}, {
    page : "tools.hbs",
    url : "/tools.jag"
}, {
    page : "samples.hbs",
    url : "/samples.jag"
}, {
    page : "tryit.hbs",
    url : "/tryit.jag"
}];


var fullContents = {};

function readHbs () {
    var file, hbsFile, hbsContent, fileName, fn;

    hbsFileSet = [];

    for(var i = 0; i < pages.length; i++) {
        //hbsFileSet.push(hbsFile);
        hbsFile = {};
        fileName = (dirHbs + (pages[i]).page);
        fn = ((pages[i]).page).split(".");

        file = new File(fileName);
        file.open("r");
        hbsContent = file.readAll();
        file.close();

        hbsFile.key = fn[0];
        hbsFile.content = hbsContent;
        hbsFile.url = pages[i].url;

        hbsFileSet[i] = hbsFile;
    }
    return hbsFileSet;
}

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

(function fullContent() {
    readExamples();
    readProperties();
    readApis();

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
})();

function pageSet() {
    var page, pageSet = [];

    for(var key in fullContents) {
        page = {};
        page.key = key;
        page.content = fullContents[key];
        page.url = "/documentation.jag?api="+key;

        pageSet.push(page);
    }

    var hbsPageSets = readHbs();
    pageSet = pageSet.concat(hbsPageSets);

    var log = new Log();
    for(var k = 0; k<(pageSet.length)-3; k++){
    log.info(pageSet[k].key+"----------------");
    log.info(pageSet[k].content+"**************");
    }

    return pageSet;
}

var read = function () {
    return pageSet();
}
