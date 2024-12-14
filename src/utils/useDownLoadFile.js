import { ElMessage } from 'element-plus';
import { DoAxios } from '@/api';
import axios from 'axios';

export const useDownloadFile = async (fileId, fileName, onprogress, onCancel) => {
  try {

    // 2. 创建 AbortController，用于取消下+载
    const controller = new AbortController();
    const signal = controller.signal;

    // 3. 提供给外部的取消方法
    if (onCancel) onCancel(controller); // 外部调用 controller.abort() 即可取消请求

    // 4. 发送请求以获取文件的下载链接
    onprogress(-2);
    const res = await DoAxios(`/api/files/download/${fileId}`, 'get', {}, true);
    console.log('get Url');
    // 5. 使用 axios 下载文件
    const response = await axios.get(res.data, {
      responseType: 'blob',
      signal: signal, // 关键：将 signal 传入请求中
      onDownloadProgress: (progress) => {
        if (progress.lengthComputable) {
          const percentComplete = ((progress.loaded / progress.total) * 100).toFixed(2);
          onprogress(Number(percentComplete));
        } else {
          console.log(`Downloaded ${progress.loaded} bytes (total size unknown)`);
        }
      }
    });

    // 6. 处理文件
    const fileType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: fileType });
    const downloadURL = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadURL;
    a.download = fileName || 'download_VitApp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(downloadURL);

  } catch (error) {
    if (error.name === 'CanceledError') {
      console.log('下载被取消');
      ElMessage.info('Download canceled');
    } else {
      console.error('下载失败:', error);
      ElMessage.error('Download failed');
      onprogress(-1);
    }
  }
};
