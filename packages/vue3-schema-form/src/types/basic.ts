export type Options = {
  label: string;
  value: string | number;
  /** 选项组件的props */
  props: Record<string, any>;
};

export type ErrorMessage = {
  name: string;
  error: string[];
};

export type Deps = Record<string, any>;
