export const downloadBlob = (blob: Blob, filename: string) : void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; // eslint-disable-line functional/immutable-data
  link.download = filename; // eslint-disable-line functional/immutable-data
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
