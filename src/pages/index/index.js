import router from '@system.router'
import configuration from '@system.configuration'
import file from '@system.file'
var rd=(Math.floor(Math.random() * (25)) + 1)
var filepath='/Common/'+rd+'.txt'
console.log(filepath)
export default {
    private: {
        title:"一言-卷"+rd,
        HIcolor: 'white',
        hitokotovalue: '感受一句话的力量',
        from: '来源：BlueEve',
        fromwho: '作者：BlueEve'
    },

    routeDetail() {
        router.push({
            uri: '/pages/detail'
        })
    },

    async changeHitokoto() {
        try {
            
            let data = await this.readFile(filepath);
            // var sjdd=(Math.floor(Math.random() * (25))+ 1)
            // filepath="/Common/"+ sjdd +".txt"
            let n = Math.floor(Math.random() * (555)) + 1;
            let fileContent = data.text;

            let tmp1 = this.extractInformation(fileContent, n, 1);
            let tmp2 = this.extractInformation(fileContent, n, 2);
            let tmp3 = this.extractInformation(fileContent, n, 3);
            console.log(tmp1,    tmp2,    tmp3) 
            // this.title="一言-卷"+sjdd
            this.HIcolor = this.selectRandomString();
            this.hitokotovalue = tmp1;
            this.fromwho = tmp2;
            this.from = tmp3;
        } catch (e) {
            console.error('解析文件内容出错:', e);
        }
    },

    readFile(uri) {
        return new Promise((resolve, reject) => {
            file.readText({
                uri: uri,
                encoding: 'UTF-8',
                success: resolve,
                fail: (code) => {
                    reject(`处理失败， 错误码 = ${code}`);
                },
                complete: () => {
                    console.log('操作结束');
                }
            });
        });
    },

    selectRandomString() {
        const strings = [
            "#fff2cc",
            "#f4cccc",
            "#cde0c4",
            "#ffdafe",
            "#f4cccc",
            "white"
        ];

        const randomIndex = Math.floor(Math.random() * strings.length);
        return strings[randomIndex];
    },

    extractField(jsonString, field) {
        let fieldStart = jsonString.indexOf(`"${field}": `);
        if (fieldStart === -1) return null;

        fieldStart += field.length + 3; // 跳过字段名和冒号
        let valueStart = jsonString.indexOf('"', fieldStart) + 1;
        let valueEnd = jsonString.indexOf('"', valueStart);
        if (valueStart === -1 || valueEnd === -1) return null;
        return jsonString.substring(valueStart, valueEnd);
    },

    extractContentBetweenQuotes(str) {
        const firstQuoteIndex = str.indexOf('"');
        if (firstQuoteIndex === -1) return null;

        const secondQuoteIndex = str.indexOf('"', firstQuoteIndex + 1);
        if (secondQuoteIndex === -1) return null;

        return str.substring(firstQuoteIndex + 1, secondQuoteIndex);
    },

    extractInformation(data, n, mode) {
        let start = 0;
        let count = 0;
        let jsonString;

        while ((start = data.indexOf('{', start)) !== -1 && count < n) {
            let end = data.indexOf('}', start) + 1;
            jsonString = data.substring(start, end);
            start = end;
            count++;
        }

        let hitokoto = this.extractField(jsonString, 'hitokoto');
        let from = this.extractField(jsonString, 'from');
        let fromWho =(this.extractField(jsonString, 'from_who'));

        if (mode === 1) {
            return hitokoto;
        }
        if (mode === 2) {
            return `来源：《${from}》`;
        }
        if (mode === 3) {
            //console.log("who:"+fromWho+"4__")
            return fromWho!=="{\r\n        " ? fromWho : "未知";
        } else {
            return;
        }

    }
}
