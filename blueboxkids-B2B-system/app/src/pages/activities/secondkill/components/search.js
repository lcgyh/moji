import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD';
const gutter = {
  md: 8,
  lg: 24,
  xl: 48,
};

@connect(({ secondkill, loading }) => ({
  secondkill,
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
      type: 'secondkill/initState',
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
        values.skillDate = values.time ? moment(values.time).format(format):null
        this.props.dispatch({
          type: 'secondkill/fetch',
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
            <FormItem label="SPUID">
              {getFieldDecorator('spuId')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('spuName')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="秒杀日期">
              {getFieldDecorator('time')(
                 <DatePicker/>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col md={7} sm={24}>
            <FormItem label="秒杀状态">
              {getFieldDecorator('skillStatus')(
                 <Select placeholder={`${formatMessage({
                  id: 'publickey.select',
              })}`}>
                  <Option value="1">展示</Option>
                  <Option value="2">不展示</Option>
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
