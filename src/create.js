const {compile} = require('handlebars');
const { readFileSync, writeFileSync } = require('fs');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require("ora");
const { templates } = require('./constants.js');
const { red } = require('chalk')
const { error } = require('log-symbols')
/**
 * 读取文件并将内容写入到文件中
 * @param {Object} content 写入的内容
 * @param {string} fileUrl 文件路径
 */
const readAndWriteFile = (fileUrl, content) => {
    const fileContent = readFileSync(fileUrl, 'utf8');
    const fileResult = compile(fileContent)(content);
    writeFileSync(fileUrl, fileResult);
};

/**
 * 从git上远程下载项目模板
 * @param {string} templateUrl 项目模板路径
 * @param {string} projectName 创建的项目名称
 * @returns Promise
 */
const downloadTemplate = async (templateUrl, projectName) => {
    return await new Promise((resolve, reject) => {
        download(templateUrl, projectName, {clone: false}, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
};

/**
 * 用户与命令行交互
 * @param {string} projectName 创建的项目名称
 */
const interacInquirer = (projectName) => {
    inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: '请输入项目的title'
    }, {
        type: 'input',
        name: 'name',
        message: '请输入项目的name'
    }, {
        type: "confirm",
        message: "是否知道项目的systemId？",
        name: "isKnown"
    }, {
        type: 'input',
        name: 'systemId',
        message: '请输入项目的systemId',
        default: '',
        when: function (answers) {
            return answers.isKnown
        }
    }, {
        type: 'list',
        name: 'type',
        message: '请选择对接的系统',
        choices: [
            'UWP',
            'SUWP',
            'NONE'
        ]
    }]).then((answers) => {
        let spinner = ora('正在初始化模板').start();
        const {name, title, type, isKnown, systemId} = answers;
        const { url:templateUrl } = templates[type];
        downloadTemplate(templateUrl, projectName).then(r => {
            if (r) {
                const packageUrl = `${projectName}/package.json`;
                const content = {name, title};
                readAndWriteFile(packageUrl, content);
                let setContent = content;
                if (isKnown) {
                    setContent = {...content, systemId};
                }
                let settingPath = `${projectName}/src/settings.js`;
                readAndWriteFile(settingPath, setContent);
                spinner.succeed('初始化模板成功');
            } else {
                spinner.fail();
                console.log(error, red('初始化模板失败'));
            }
        });
    })
};

module.exports = { interacInquirer };
