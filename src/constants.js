const templates = {
    'UWP': {
        url: 'github:renmengwo/test-cli#main',
        description: '接入UWP的系统请使用该模板',
    },
    'SUWP': {
        url: 'github:renmengwo/test-cli#main',
        description: '接入SUWP的系统请使用该模板',
    },
    'NONE': {
        url: 'github:renmengwo/test-cli#main',
        description: '不接入UWP/SUWP的系统请使用该模板',
    }
}
const mapAction = {
    init: {
        alias: 'i',
        description: 'create a project',
        command: 'init <projectName>'
    },
    list: {
        alias: 'ls',
        description: '查看所有可用模板',
        command: 'list'
    },
    '*': {
        alias: '',
        description: 'command not found'
    },
}

module.exports ={
    mapAction,
    templates
}
