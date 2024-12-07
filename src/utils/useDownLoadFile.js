import { ElMessage, ElMessageBox } from 'element-plus';
import { DoAxios } from '@/api';
import axios from 'axios';

export const useDownloadFile = async (fileId,fileName,onprogress) => {

    // 弹出确认框提示用户下载将开始
    await ElMessageBox.confirm(
      `You are about to download the file: ${fileId}. It will be saved to your default download folder.`,
      'Download File',
      {
        confirmButtonText: 'Start Download',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    // 从后端请求文件
    const res = await DoAxios(`/api/files/download/${fileId}`,'get',{},true)
    const response = await axios.get(res.data,{
      responseType:'blob',
      onDownloadProgress:(progress) => {
        if(progress.lengthComputable) {
          const percentComplete = ((progress.loaded/progress.total) * 100).toFixed(2);
          onprogress(percentComplete)
        } else {
          console.log(`Downloaded ${progress.loaded} bytes (total size unknown)`)
        }
      }
    })
    const fileType = response.headers['content-type'];
    const blob = new Blob([response.data],{type:fileType});
    console.log(fileType);
    const downloadURL = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadURL;
    a.download = fileName || 'download_VitApp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(downloadURL);
    console.log("finish")
  // } catch (error) {
  //   console.log(error)
  //   ElMessage.error(error.message);
  // }
};
