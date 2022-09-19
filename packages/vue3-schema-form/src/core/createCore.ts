import { Schema, SchemaFormProps } from '../types';
import { resolveSchemaWithSegments } from '../utils/resolver';
import { pick, isJsonSchema } from '../utils';

interface GlobalState {
  disabled: boolean;
  readonly: boolean;
  border: boolean;
  displayType: Schema['disabled'];
}

export type AddonMethods = Record<string, (...params: any[]) => any>;

type FieldScoped = {
  name: string;
  schema: Schema;
  rootSchema: Schema;
  props: Record<string, any>;
};

const calcFieldState = (schema: Schema, globalState: GlobalState) => {
  return {
    border: schema.border ?? globalState.border,
    disabled: schema.disabled ?? globalState.disabled,
    readonly: schema.readonly ?? globalState.readonly,
    displayType: schema.displayType ?? globalState.displayType,
    placeholder: schema.placeholder,
    class: schema.className,
    required: schema.required,
  };
};

const generateSingleSchema = <M extends AddonMethods>(
  schema: Schema,
  globalState,
  rootSchema: Schema,
  methods: M
) => {
  const fieldScoped: (FieldScoped & M & ReturnType<typeof calcFieldState>)[] = [];

  for (const [field, property] of Object.entries(rootSchema.properties ?? {})) {
    if (!property?.hidden) {
      const fieldState = calcFieldState(property, globalState);
      const fieldProps = pick(fieldState, ['readonly', 'disabled', 'class', 'placeholder']);

      const singleField = {
        name: field,
        schema: property,
        rootSchema,
        ...fieldState,
        props: {
          ...fieldProps,
          ...(schema.props ?? {}),
        },
        ...methods,
      };

      fieldScoped.push(singleField);
    }
  }

  return fieldScoped;
};

export const createSchemaCore = ({
  schema,
  modelValue: formData,
  disabled,
  border,
  readonly,
  displayType,
  deps,
}: SchemaFormProps) => {
  if (!isJsonSchema(schema)) {
    console.error('schema irregularities');
    return null;
  }

  const rootSchema = resolveSchemaWithSegments(schema, formData, deps);

  const globalState = {
    border,
    disabled,
    readonly,
    displayType,
  };

  const renderer = <M extends AddonMethods>(methods: M) =>
    generateSingleSchema<M>(schema, globalState, rootSchema, methods);

  return {
    // TODO
    errors: [],
    formData,
    schema: rootSchema,
    globalState,
    renderer,
  };
};
