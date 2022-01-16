export interface Metadata {
  [prop: string]: unknown;
}

export function setMeta<T = any>(metadata: Metadata, key: string, value: T) {
  metadata[key] = value;
}

export function getMeta<T = any>(metadata: Metadata, key: string, init?: T) {
  const test = metadata[key] as T;

  if (test === undefined && init !== undefined) {
    setMeta<T>(metadata, key, init);
  }

  return metadata[key] as T;
}

export function deleteMeta(metadata: Metadata, key: string) {
  delete metadata[key];
}

export function addMeta(metadata: Metadata, key: string, value = 1) {
  const ptr = metadata[key];

  if (ptr !== undefined && typeof ptr !== 'number') {
    return;
  }

  metadata[key] = (ptr || 0) + value;
}

export function runMeta<T>(
  metadata: Metadata,
  key: string,
  type: keyof T,
  ...argv: any[]
) {
  const ptr = metadata[key] as T;
  const test = ptr && ptr[type];

  if (typeof test !== 'function') {
    return undefined;
  }

  return test(...argv);
}

export function mergeMeta(target: Metadata, value: Metadata) {
  Object.keys(value).forEach((key) => {
    setMeta(target, key, value[key]);
  });
}
