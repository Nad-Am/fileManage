import { DoAxios, DoAxiosWithErro } from "."


export const getList = async (fetchInfor,hasErro) => {
    const fetchconfig = ['/api/files/list','post',fetchInfor,true]

    return hasErro ? await DoAxiosWithErro(...fetchconfig) : await DoAxios(...fetchconfig);
}

export const getTypeList = async (fetchInfor,hasErro) => {
    const fetchconfig = ['/api/files/listByMainType','get',fetchInfor,true]

    return hasErro ? await DoAxiosWithErro(...fetchconfig) : await DoAxios(...fetchconfig);
}

export const createFile = async (fetchInfor,hasErro) => {
    const fetchconfig = ['/api/files/create','post',fetchInfor,true]

    return hasErro ? await DoAxiosWithErro(...fetchconfig) : await DoAxios(...fetchconfig);
}


export const deleteFile = async (fetchInfor,hasErro) => {
    const fetchconfig = ['/api/files/recycle/delete','put',fetchInfor,true]

    return hasErro ? await DoAxiosWithErro(...fetchconfig) : await DoAxios(...fetchconfig);
}