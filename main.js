#! /usr/bin/env node

const program = require('commander');
const version = require('./package.json');
const { mapAction, templates } = require('./src/constants.js');
const { interacInquirer } = require('./src/create');
// 原生获取命令行的参数
// console.log(process.argv);
Reflect.ownKeys(mapAction).forEach((action) => {
    program
        .command(action) // 配置命令的名字
        .alias(mapAction[action].alias) // 命令的别名
        .description(mapAction[action].description)// 命令对应的描述
        .action(() => {
            if (action === '*') { // 访问不到对应的命令 就打印找不到命令
                console.log(mapAction[action].description);
            }
            if(action === 'init') {
                const projectName = process.argv.slice(3)[0];
                interacInquirer(projectName);
            }
            if(action === 'list') {
                for (let i in templates){
                    console.log(`${templates[i].url} -- ${templates[i].description}`);
                }
            }
        });
});

program.version(version).parse(process.argv);

