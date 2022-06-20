export type FormData = Record<string, any>;

export type Widgets = Record<string, any>;

export type Options = {
  label: string;
  value: string | number;
  /** 选项组件的props */
  props: Record<string, any>;
};
