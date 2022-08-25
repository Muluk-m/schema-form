import { defineComponent, computed, provide, watch, unref, ref } from 'vue';
import { useChildren } from '../hooks/useRelation';
import { createNamespace } from '../utils';

import { SFPropsKey, SFDataKey, SFRelationKey } from '../constants';
import { schemaFormProps } from '../types/props';
import { validateAll, validateSingle } from './validator';
import { getFieldConfigs, handleRemoveHiddenData } from './handleField';
import FieldItem from './Field';

const [name] = createNamespace('schema-form');

/**
 * schema-form 组件
 */
export default defineComponent({
  name,

  props: schemaFormProps,

  emits: ['update:modelValue'],

  setup: (props, { emit, expose }) => {
    const fieldConfigList = computed(() => getFieldConfigs(props));
    const errorFields = ref({});
    const { children, linkChildren } = useChildren(SFRelationKey);

    linkChildren();

    provide(
      SFPropsKey,
      computed(() => props)
    );
    provide(
      SFDataKey,
      computed({
        get: () => unref(props.modelValue),
        set: (value: any) => {
          emit('update:modelValue', value);
        },
      })
    );

    const getFilteredFormData = () =>
      handleRemoveHiddenData(unref(props.modelValue), fieldConfigList.value);

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
      const fieldSchema = props.schema.properties?.[fieldName];

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
        console.log('%cConfig:', 'color: #1E80FF; font-weight: 700;', fieldConfigList.value);
        console.groupEnd();
      }
    });

    /** 获取表单值，如果配置removeHiddenData 则过滤掉hidden字段 */
    const getFormData = () =>
      props.removeHiddenData ? getFilteredFormData() : unref(props.modelValue);

    /**
     * 触发整个表单校验
     * @param {boolean} scrollToError 是否在提交表单且校验不通过时滚动至错误的表单项
     */
    const validate = (scrollToError = true) =>
      validateAll({
        formData: getFilteredFormData(),
        descriptor: props.schema.properties!,
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

    expose({
      getFormData,
      validate,
      validateField,
    });

    return () => (
      <div class={name}>
        {fieldConfigList.value.map((config) => (
          <FieldItem
            name={config.name}
            key={config.name}
            addon={{ ...config, getFormData }}
            errorMessage={errorFields.value[config.name] ?? ''}
          />
        ))}
      </div>
    );
  },
});
