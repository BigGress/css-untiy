var fs = require("fs");
var path = require("path");
var cheerio = require("cheerio");
require("./basic/forKey");

//获取css文件
var css = fs.readFileSync(path.join(__dirname, "./src/style.css")).toString();
//把css变成数组
// css = css.replace(/[\n}]/g,"").replace(/{/g,";").split(";");
css = css.split("}");

//获取html文件
var html = fs.readFileSync(path.join(__dirname, "./src/index.html")).toString();
var $ = cheerio.load(html, { decodeEntities: false });

//css转成css对象
var cssobj = {};
//以类作为cssobj属性的key
css.forEach((val, i, arr) => {
    val = val.replace(/\n/g,"");
    var key = val.split("{");

    if (!!key[1]) {

        if (key[0] in cssobj) {
            var attArr = key[1].split(";");
            if (key[1].indexOf(";") > 0) {
                attArr.forEach((att) => {
                    if (att.length > 0) {
                        addAttribute(att, key[0]);
                    }
                })
            }
        } else {
            cssobj[key[0]] = {
                name: ""
            }

            var attArr = key[1].split(";");
            if (key[1].indexOf(";") > 0) {
                attArr.forEach((att) => {
                    if (att.length > 0) {
                        addAttribute(att, key[0]);
                    }
                })
            }
        }
    }

    // if(!/[:@]/.test(val)){
    //     if(val.length>0){
    //         cssobj[val] = {
    //             name:""
    //         };
    //     }
    // }else{
    //     var key = findKeyValue(i,arr)

    //     addAttribute(val,key);
    // }
});
//把类名拆开
cssobj.forKey((val, i) => {
    //如果名字包含逗号就把属性拆分
    if (i.indexOf(",") > 0) {
        var arr = i.split(",");

        //拆分出来的类名
        arr.forEach((key) => {
            //如果类已经存在cssobj里面,如果不存在就创建
            if (key in cssobj) {
                //验证是否有对应的属性
                val.forKey((val2, att) => {
                    if (att in cssobj[key]) {
                        //判断cssobj里面对应的值是否相等，不等就赋值成最后的值
                        if (cssobj[key][att] !== val2) {
                            cssobj[key][att] = val2;
                        }
                        // cssobj[key]
                    } else {
                        cssobj[key][att] = val2;
                    }
                })
            } else {

                cssobj[key] = val;
            }
        })

        //删除属性
        delete cssobj[i]
    }
})

//不是类的就作为cssobj对于key的子元素
/**
 * @description 把属性添加到对于的键值里面
 * @param {String} = obj 输入属性的字符串
 * @param {String} = key 对应的属性键值
 * 
 */
function addAttribute(obj, key) {
    //确定没有after和before
    if (obj.indexOf("after") < 0 && obj.indexOf("before") < 0 && obj.indexOf("hover") < 0 &&
        obj.indexOf("first-child") < 0) {
        var attriKey = obj.split(":")[0];
        var attriValue = obj.split(":")[1]
        if (key in cssobj) {
            cssobj[key][attriKey] = attriValue;
        }
    }
}

/**
 * @description 找到属性对应的key值
 * @param {Number} = i 属性的编号
 * @param {Array} = arr cssobj数组
 * 
 * @return {String} = val 属性对应的key
 *  */
function findKeyValue(i, arr) {
    var val;
    if (arr[i].indexOf(":") < 0) {
        val = arr[i]
    } else {
        val = findKeyValue(i - 1, arr);
    }

    return val;
}


//写入到文件中变量,一个是cssOut是输出的变量，cssOutObj是记录已经写入的属性;
var cssOut = "", cssOutObj = {}, cssLength = 0, test = 0;

cssobj.forKey((val1)=>{

    val1.forKey((val2,key)=>{
        if(key !== "name"){
            if (typeof val2 == "string") {
                 key = key.replace(/\s/g, "");
                //检测是否有对应的key
                if (key in cssOutObj) {
                    var has = false;
                    cssOutObj[key]["value"].forEach((attr)=>{
                        attr == val2 && (has=true);
                    })
                    if(!has){
                        cssOutObj[key]["value"].push(val2);
                    }
                }else{
                        cssOutObj[key] = {
                            value:[val2]
                        };
                }
            }
        }
    })
})

// cssobj.forKey((val1) => {

//     val1.forKey((val2, key) => {
//         if (key !== "name") {
//             if (typeof val2 == "string") {
//                 key = key.replace(/\s/g, "");
//                 //检测是否有对应的key
//                 if (key in cssOutObj) {
//                     //如果对于的key和值相等
//                     if (cssOutObj[key]  == val2) {
//                         //寻找对应的类名
//                         var num = cssOut.indexOf(key), cssNum = "";
//                         if (typeof cssOut[num - 3] === "number") {
//                             cssNum += cssOut[num - 3] + cssOut[num - 2];
//                         } else {
//                             cssNum += cssOut[num - 2];
//                         }

//                         if (val1["name"].indexOf(`cssUntiy${cssNum}`) < 0) {
//                             val1["name"] += ` cssUntiy${cssNum}`;
//                         }
//                     }else{
//                         makecssString(key, val2, val1);
//                     }
//                 } else {
//                     makecssString(key, val2, val1);
//                 }
//             }
//         }
//     })
// })
cssOutObj.forKey((val,key)=>{
    if(key!=="forKey"){
        console.log(val.value);
        val.value.forEach((attr)=>{
            cssOut += `.cssUnity${cssLength}{${key}:${attr};}`;
            if(!!val.num){
                val.num.push(cssLength);
            }else{
                val.num = [cssLength];
            }
            cssLength++;
        })
    }
})
// console.log(cssobj)
cssobj.forKey((val1)=>{

    val1.forKey((val2,key)=>{

        cssOutObj.forKey((valAttr,attr)=>{
            key = key.replace(/\s/g,"");
            if(attr == key && attr != "forKey"){
                console.log(attr)
                if(!!valAttr.value){

                    valAttr.value.forEach((valAttr1,i)=>{
                        valAttr1 === val2  && val1.name.indexOf(` cssUnity${valAttr["num"][i]}`)<0 && (val1.name += ` cssUnity${valAttr["num"][i]}`);
                    })
                }
            }

            // val2 === valAttr.value && val1.name.indexOf(` cssUnity${valAttr.num}`)<0 && (val1.name += ` cssUnity${valAttr.num}`);
        })
    })
})

fs.writeFileSync("./output1.js", JSON.stringify(cssobj), "utf-8");


function makecssString(key, val2, val1) {
    if (key.indexOf("@") < 0) {
        if (val2.length > 0) {

            cssOut += `.cssUntiy${cssLength}{${key}:${val2};}`;

            cssOutObj[key] = val2;

            val1["name"] += ` cssUntiy${cssLength}`;

            cssLength++;
        }
    }
}
//删除forKey这个方法
delete Object.prototype.forKey;
// console.log(cssobj)
//添加className
for (var i in cssobj) {
    if(!/[:@]/.test(i)){
    // console.log(i)
    var name = cssobj[i]["name"];
    $(i).addClass(name);
    }
    
}

fs.writeFileSync("./dist/style.css", cssOut, "utf-8");
fs.writeFileSync("./dist/output1.html", $.html(), "utf-8");

console.log("运行结束");