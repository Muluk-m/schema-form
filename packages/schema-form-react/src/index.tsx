import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// export {
//   useForm,
//   connectForm,
//   createWidget,
//   mapping,
// } from './form-render-core/src';

const FR = ({ widgets, configProvider, ...rest }) => (
  <ConfigProvider locale={zhCN} {...configProvider}>
    {/* <FRCore widgets={{ ...defaultWidgets, ...widgets }} {...rest} /> */}
  </ConfigProvider>
);

export default FR;
