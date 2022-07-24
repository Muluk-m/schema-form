import RawAsyncValidator from 'async-validator';

import { defaultValidateMessagesCN } from '../constants/locale/cn';
import { Schema } from '../types';
import { isObject, isEmptyValue } from '@/utils';

/**
 * Replace with template.
 *   `I'm ${name}` + { name: 'bamboo' } = I'm bamboo
 */
const replaceMessage = (template: string, kv: Record<string, any>): string => {
  return template.replace(/\$\{\w+\}/g, (str: string) => {
    const key = str.slice(2, -1);
    return kv[key] ?? key;
  });
};

const flattenRules = (rules: any[]) => {
  let result: Record<string, any> = {};

  if (Array.isArray(rules)) {
    result = rules.reduce((res, { message: _, ...other }) => ({ ...res, ...other }), {});
  } else if (isObject(rules)) {
    result = rules;
  }

  return result;
};

const getDescriptorSimple = (schema: Record<string, unknown> = {}, path) => {
  let result: Record<string, any> = {};
  if (isObject(schema)) {
    if (schema.type) {
      switch (schema.type) {
        case 'range':
          result.type = 'array';
          break;
        case 'html':
          result.type = 'string';
          break;
        default:
          result.type = schema.type;
          break;
      }
    }
    ['pattern', 'min', 'max', 'len', 'required'].forEach((key) => {
      if (Object.keys(schema).indexOf(key) > -1) {
        result[key] = schema[key];
      }
    });

    switch (schema.format) {
      case 'email':
      case 'url':
        result.type = schema.format;
        break;
      default:
        break;
    }

    const handleRegex = (desc) => {
      if (desc.pattern && typeof desc.pattern === 'string') {
        desc.pattern = new RegExp(desc.pattern);
      }
      return desc;
    };
    // result be array
    if (schema.rules) {
      if (Array.isArray(schema.rules)) {
        const requiredRule = schema.rules.find((rule) => rule.required === true);
        if (requiredRule) {
          result = { ...result, ...requiredRule };
        }
        result = [result, ...schema.rules];
        result = result.map(handleRegex);
      } else if (isObject(schema.rules)) {
        result = [result, schema.rules];
        result = result.map(handleRegex);
      }
    } else {
      result = [result];
    }
  }

  return { [path]: result };
};

export const validateSingle = async (data: any, schema: Schema = {}, path: string) => {
  const descriptor = getDescriptorSimple(schema, path);
  const cn = defaultValidateMessagesCN;
  const messageFeed = Object.assign(cn);
  let validator: any;
  let result: string[] = [];

  try {
    validator = new RawAsyncValidator(descriptor);
  } catch (error) {
    return Promise.resolve([]);
  }

  validator.messages(messageFeed);

  try {
    await Promise.resolve(validator.validate({ [path]: data }));
  } catch (err: any) {
    if (err.errors) {
      result = err.errors.map(({ message }) => message ?? messageFeed.default);
    }
  }

  // Replace message with variables
  const kv = {
    name: path,
    ...schema,
    ...flattenRules(schema.rules as any[]),
  };

  const fillVariableResult = result.map((error) => {
    if (typeof error === 'string') {
      return replaceMessage(error, kv);
    }
    return error;
  });

  return fillVariableResult;
};

export const validateAll = ({ formData, descriptor }) => {
  const paths = Object.keys(formData);

  return Promise.all(
    paths.map(async (path) => {
      if (descriptor[path]) {
        const schema = descriptor[path];
        const singleData = formData[path];
        const error = await validateSingle(singleData, schema, path);

        return {
          name: path,
          error,
        };
      }
      return Promise.resolve({
        name: path,
        error: [],
      });
    })
  ).then((results) => results.filter(({ error }) => !isEmptyValue(error)));
};
