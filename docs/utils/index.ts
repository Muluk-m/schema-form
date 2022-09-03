import { Schema } from 'v3-schema-form';

export const createDataBySchema = (schema: Schema) => {
  const { properties = {} } = schema;

  const typeMapping = {
    string: '',
    number: 0,
    array: [],
    boolean: false,
    date: [Date.now(), Date.now()],
    object: {},
  };

  const fields = Object.fromEntries(
    Object.entries(properties).map(([key, { type = '' }]) => [key, typeMapping[type] ?? ''])
  );

  return fields;
};
