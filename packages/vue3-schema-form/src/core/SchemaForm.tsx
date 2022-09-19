import { defineComponent, computed, watch, unref, ref } from 'vue';
import { useChildren } from '../hooks/useRelation';
import { createNamespace } from '../utils';

import { SFRelationKey } from '../constants';
import { schemaFormProps, ErrorMessage } from '../types';
import { validateAll, validateSingle } from './validator';
import { handleRemoveHiddenData } from './handleField';
import { createSchemaCore } from './createCore';
import FieldItem from './Field';
import './index.scss';

const [name] = createNamespace('schema-form');

/**
 * schema-form 组件
 */
export default defineComponent({
  name,

  props: schemaFormProps,

  emits: ['update:modelValue'],

  setup: (props, { emit, expose }) => {
    const schemaCore = computed(() => createSchemaCore(props));
    const schemaRenderer = computed(() =>
      schemaCore.value?.renderer({
        validate,
        validateFields,
        getFormData,
        setFormData,
      })
    );
    const errorFields = ref({});
    const { children, linkChildren } = useChildren(SFRelationKey);
    const formData = computed({
      get: () => unref(props.modelValue),
      set: (value: unknown) => {
        emit('update:modelValue', value);
      },
    });

    linkChildren({
      props: computed(() => props),
      formData,
    });

    const getFilteredFormData = () =>
      handleRemoveHiddenData(
        unref(props.modelValue),
        schemaRenderer.value?.map(({ name }) => name) ?? []
      );

    /** 获取表单值，如果配置removeHiddenData 则过滤掉hidden字段 */
    const getFormData = () =>
      props.removeHiddenData ? getFilteredFormData() : unref(props.modelValue);

    const setValueByName = (name: string, value: unknown) => {
      if (formData) {
        formData[name] = value;
      }
    };

    const setFormData = (values: Partial<FormData>) => {
      for (const [key, value] of Object.entries(values)) {
        setValueByName(key, value);
      }
    };

    /** 视口滚动到指定字段 */
    const scrollToField = (
      name: string,
      // eslint-disable-next-line no-undef
      options?: boolean | ScrollIntoViewOptions
    ) => {
      children.some((item) => {
        if (item.name === name) {
          item.$el.scrollIntoView(options);
          return true;
        }
        return false;
      });
    };

    /**
     * 校验单个字段
     * @param {string} fieldName 要校验的字段名
     * @param {boolean} scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项
     */
    const validateField = (fieldName: string, scrollToError = true) => {
      const formData = getFilteredFormData();
      const fieldData = formData[fieldName];
      const fieldSchema = schemaCore.value?.schema.properties?.[fieldName];

      if (fieldData && fieldSchema) {
        return validateSingle(fieldData, fieldSchema, fieldName).then((errors) => {
          // scroll to error position
          if (scrollToError) {
            scrollToField(fieldName);
          }

          if (props.inlineErrorMessage) {
            return errors;
          }

          if (errors.length) {
            errorFields.value = {
              ...errorFields.value,
              [fieldName]: errors[0],
            };
          } else {
            errorFields.value = Object.fromEntries(
              Object.entries(errorFields.value).filter(([key]) => key !== fieldName)
            );
          }
          return errors;
        });
      }
      return Promise.resolve([]);
    };

    /**
     * 触发整个表单校验
     * @param {boolean} scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项
     */
    const validate = (scrollToError = true) =>
      validateAll({
        formData: getFilteredFormData(),
        descriptor: schemaCore.value?.schema.properties,
      }).then((errors) => {
        // scroll to error position
        if (scrollToError && errors.length) {
          scrollToField(errors[0].name);
        }

        if (props.inlineErrorMessage) {
          return errors;
        }

        if (errors.length) {
          if (scrollToError) {
            scrollToField(errors[0].name);
          }
          errorFields.value = errors.reduce(
            (errorFields, { name, error }) => ({
              ...errorFields,
              [name]: error[0],
            }),
            {}
          );
        } else {
          errorFields.value = {};
        }

        return errors;
      });

    /**
     * 校验一组字段
     * @param {string[]} fieldNames 要校验的字段名
     * @param {boolean} scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项
     */
    const validateFields = async (fields: string[], scrollToError = true) => {
      const errors: ErrorMessage[] = [];

      for (const [, field] of fields.entries()) {
        // eslint-disable-next-line no-await-in-loop
        const error = await validateField(field, scrollToError);
        if (error.length) {
          errors.push({
            name: field,
            error,
          });
        }
      }

      return errors;
    };

    watch(props.modelValue, (value) => {
      const errorKeys = Object.keys(errorFields.value);

      if (errorKeys.length > 0) {
        for (const key of errorKeys) {
          validateField(key, false);
        }
      }

      if (props.debug && process.env.NODE_ENV !== 'production') {
        console.group('Action');
        console.log('%cNext:', 'color: #47B04B; font-weight: 700;', value);
        console.log('%cConfig:', 'color: #1E80FF; font-weight: 700;', schemaRenderer.value);
        console.groupEnd();
      }
    });

    expose({
      getFormData,
      validate,
      validateFields,
    });

    return () => (
      <div class={name}>
        {schemaRenderer.value?.map((scoped) => (
          <FieldItem
            name={scoped.name}
            key={scoped.name}
            addon={scoped}
            errorMessage={errorFields.value[scoped.name] ?? ''}
          />
        ))}
      </div>
    );
  },
});
