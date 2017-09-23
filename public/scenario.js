// scenario.js
define(function(){
    // line regexp
    // #label|label desc  [1]-label [3]-label description
    let REGEXP_LABEL = /^#([^|]+)(\|(.*))?$/;
    // command name param1=val1 param2=val2...  [1]-command [3]-name [5]-params and vals
    let REGEXP_COMMAND = /^([^\s:]+)(\s+([^\s:=]+))?(\s+([^:]+))?$/;
    // sayer behaviour: text content  [1]-sayer and behaviour  [2]-text content
    let REGEXP_TEXT = /^([^:]+):\s+(.*)$/

    // command name
    let CMD_LABEL = "label";
    let CMD_BG = "bg";
    let CMD_LH = "lh";
    let CMD_TEXT = "text";
    let CMD_HIDE = "wait";

    // private functions
    // generate line data
    function genData(cmd, name, content, ex){
        let params = {};
        if (cmd!="label" && cmd!="text" && content!=null && content.length>0){
            let paramsArr = content.split(" ");
            for (let i in paramsArr){
                let kev = paramsArr[i];
                let rs = /^([^=]+)=([^=]+)$/.exec(kev);
                params[rs[1]]=rs[2];
            }
        }
        let data = {"cmd":cmd, "name":name?name:"", "content":content?content:"", "params":params};
        if (ex){
            for (let k in ex){
                data[k] = ex[k];
            }
        }
        return data;
    }

    // methods
    var analyze = function (txt){
        let scriptData = {lines:[]};
        let lines = txt.replace("\r","").split("\n");
        for (let i in lines){
            let line = lines[i];
            if (line.trim().length==0) continue;
            console.log(i+". "+line);

            if (REGEXP_LABEL.test(line)){
                // label line
                let rs = REGEXP_LABEL.exec(line);
                console.log("*label*");
                scriptData.lines.push(genData(CMD_LABEL, rs[1], rs[3], null));
            } else if (REGEXP_COMMAND.test(line)){
                // command line
                let rs = REGEXP_COMMAND.exec(line);
                console.log("*command*");
                scriptData.lines.push(genData(rs[1], rs[3], rs[5], null));
            } else if (REGEXP_TEXT.test(line)){
                // text line
                console.log("*text*");
                let rs = REGEXP_TEXT.exec(line);
                let bhReg = /^(\S+)\s+(\S+)$/
                if (bhReg.test(rs[1])){
                    let cmdAndName = bhReg.exec(rs[1]);
                    scriptData.lines.push(genData(CMD_TEXT, cmdAndName[1], rs[2], {"behaviour":cmdAndName[2]}));
                } else{
                    scriptData.lines.push(genData(CMD_TEXT, rs[1], rs[2], null));
                }
            }
        }
        return scriptData;
    };

    return {
        analyze: analyze
    };
});
