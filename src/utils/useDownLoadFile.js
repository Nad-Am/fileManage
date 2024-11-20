import { ElMessage, ElMessageBox } from 'element-plus';

export const useDownloadFile = async (filename, downloadUrl) => {
  if (!filename) {
    ElMessage.warning('Please enter a filename.');
    return;
  }

  try {
    // 弹出确认框提示用户下载将开始
    await ElMessageBox.confirm(
      `You are about to download the file: ${filename}. It will be saved to your default download folder.`,
      'Download File',
      {
        confirmButtonText: 'Start Download',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    // 从后端请求文件
    const response = await fetch(`${downloadUrl}?filename=${filename}`);

    if (!response.ok) {
      throw new Error('File not found or download failed.');
    }

    // 将文件数据转换为 Blob 格式
    const blob = await response.blob();
    const downloadLink = window.URL.createObjectURL(blob);

    // 创建下载链接并触发下载
    const a = document.createElement('a');
    a.href = downloadLink;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 释放 URL 资源
    window.URL.revokeObjectURL(downloadLink);

    // 成功提示
    ElMessage.success('Download started!');
  } catch (error) {
    ElMessage.error(error.message);
  }
};
