export function downloadFile(blob: Blob, filename: string) {
  const cleanName = filename.startsWith('STUDKIT_') ? filename : `STUDKIT_${filename}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cleanName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const downloadBlob = downloadFile;

export function downloadText(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  downloadFile(blob, filename);
}

export function downloadJSON(data: unknown, filename: string) {
  const content = JSON.stringify(data, null, 2);
  downloadText(content, filename.endsWith('.json') ? filename : `${filename}.json`, 'application/json');
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
