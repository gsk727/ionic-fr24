xiecheng = require("./xiecheng.js")
fs = require("fs");
//console.info(xiecheng.suggestion)
var new_datas= []
function get_array(_object) {
    if (_object instanceof Object) {
        for (var k in _object) {
            get_array(_object[k])
        }
    }
    if (_object instanceof Array) {
        for(var index in _object) {
            var value = _object[index];
            var iata = value.data.split("||")[1].split(",")[1] || value.data.split("||")[1].split(",")[0];
            new_datas.push({display:value.display, iata:iata});
        }
    }
};

function get_new_datas() {
    get_array(xiecheng.suggestion);
    JSON.stringify(new_datas);
    var iata_obj  = {};
    for (var index  in new_datas) {
        iata_obj[new_datas[index].iata] = new_datas[index].display;
    }
    fs.writeFileSync("iatalist.json",  JSON.stringify(new_datas));
    fs.writeFileSync("iataobj.json",  JSON.stringify(iata_obj));

    console.info(new_datas);
};

get_new_datas();