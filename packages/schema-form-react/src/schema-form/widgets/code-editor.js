// import AceEditor from 'pc-components/ace-editor';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

export default class CodeEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    mode: PropTypes.oneOf(['json', 'js'])
  };

  render() {
    const { value, onChange, mode = 'js' } = this.props;
    return <Input value={value} onChange={onChange} />;
  }
}
