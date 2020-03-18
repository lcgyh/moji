import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { getSupplys } from '@/services/supply';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss';
const gutter = {
  md: 8,
  lg: 24,
  xl: 48,
};

const bannerState = [{
  label: '上线',
  value: '1',
}, {
  label: '下线',
  value: '2',
}]


@connect(({ banner, loading }) => ({
  banner,
}))
class SearchCard extends Component {
  state = {
    supplyList: [],
  };

  // 调用查询显示数据
  componentDidMount() {
    this.initSearchvalue();
  }

  // 注销数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'banner/initState',
    });
  }

  // 初始化搜索条件
  initSearchvalue = () => {
    this.handleSearch();
  };

  // 查询数据
  handleSearch = (pageSize, current) => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.pageSize = pageSize || 10;
        values.current = current || 1;
        this.props.dispatch({
          type: 'banner/fetch',
          payload: values,
        });
      }
    });
  };

  // handleFormReset
  handleFormReset = () => {
    this.props.form.resetFields();
  };

  // form 搜索项
  renderForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={gutter}>
          <Col md={7} sm={24}>
            <FormItem label="banner名称">
              {getFieldDecorator('bannerName')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="banner状态">
              {getFieldDecorator('bannerStatus')(
                <Select
                  placeholder={`${formatMessage({
                    id: 'publickey.select',
                  })}`}
                >
                  {bannerState.map(item => <Option value={item.value}>{item.label}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        {this.renderSubmit()}
      </Form>
    );
  };

  // 查询 重置行
  renderSubmit = () => (
    <Row gutter={gutter}>
      <Col md={24} sm={24} align="center">
        <Button type="primary" onClick={() => this.handleSearch(10, 1)}>
          查询
        </Button>
        <Button
          style={{
            marginLeft: 8,
          }}
          onClick={this.handleFormReset}
        >
          重置
        </Button>
      </Col>
    </Row>
  );

  render() {
    return (
      <Card>
        <div className="tableListForm">{this.renderForm()}</div>
      </Card>
    );
  }
}

export default Form.create()(SearchCard);
