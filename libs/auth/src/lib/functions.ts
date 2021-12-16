import {
  isExtractableFile,
  extractFiles,
  ExtractableFile,
} from 'extract-files';
import FormDataNode from 'form-data';

const isExtractableFileEnhanced = (
  value: any
): value is ExtractableFile | { pipe: () => any } =>
  isExtractableFile(value) ||
  (value !== null &&
    typeof value === 'object' &&
    typeof value.pipe === 'function');

export const createRequestBody = (
  query: string,
  variables?: { [key: string]: any }
): object | FormData => {
  const { clone, files } = extractFiles(
    { query, variables },
    '',
    isExtractableFileEnhanced
  );

  if (files.size === 0) return clone;

  const Form = typeof FormData === 'undefined' ? FormDataNode : FormData;

  const form = new Form();

  form.append('operations', JSON.stringify(clone));

  const map: { [key: number]: string[] } = {};
  let i = 0;
  files.forEach((paths) => {
    map[++i] = paths;
  });
  form.append('map', JSON.stringify(map));

  i = 0;
  files.forEach((paths, file) => {
    form.append(`${++i}`, file as any);
  });

  return form as FormData;
};
