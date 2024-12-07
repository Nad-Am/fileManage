import * as Icons from '@element-plus/icons-vue';
export const catrgoryConfig = (target,body) => {
    if(+target === 0 || ['','all'].includes(target) || !target) {
        return {
            component: Icons['Folder'] || null,
            fileType: '文件夹',
            axiosConfig:[
                '/api/files/list',
                'post',
                body,
                true
            ]
        }
    }
    if(+target < 6) {
        return {
            component: Icons['Picture'] || null,
            mainType:'image',
            fileType:'图片',
            axiosConfig:[
                '/api/files/listByMainType',
                'get',
                body,
                true
            ]
        }
    }
    if(+target < 10) {
        return {
            component: Icons['Headset'] || null,
            mainType:'audio',
            fileType:'音频',
            axiosConfig:[
                '/api/files/listByMainType',
                'get',
                body,
                true
            ]
        }
    }
    if(+target < 14) {
        return {
            component: Icons['VideoCamera'] || null,
            mainType:'video',
            fileType:'视频',
            axiosConfig:[
                '/api/files/listByMainType',
                'get',
                body,
                true
            ]
        }
    }
    if(+target < 23) {
        return {
            component: Icons['Document'] || null,
            mainType:'application',
            fileType:'文档',
            axiosConfig:[
                '/api/files/listByMainType',
                'get',
                body,
                true
            ]
        }
    }
    return {
        component: Icons['Promotion'] || null,
        mainType:'other',
        fileType:'其他',
        axiosConfig:[
            '/api/files/listByMainType',
            'get',
            body,
            true
        ]
    }
}