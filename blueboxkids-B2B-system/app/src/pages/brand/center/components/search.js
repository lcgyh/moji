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

@connect(({ brand, loading }) => ({
  brand,
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
      type: 'brand/initState',
    });
  }

  // 初始化搜索条件
  initSearchvalue = () => {
    this.getSupply();
    this.handleSearch();
  };

  // 查询供应商信息
  getSupply = async () => {
    const result = await getSupplys();
    if (result.code == '0') {
      const resData = result.data || [];
      this.setState({
        supplyList: resData,
      });
    } else {
    }
  };

  // 查询品牌
  getBrand = () => {};

  // 查询数据
  handleSearch = (pageSize, current) => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.pageSize = pageSize || 10;
        values.current = current || 1;
        this.props.dispatch({
          type: 'brand/fetch',
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
            <FormItem label="品牌ID">
              {getFieldDecorator('brandId')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="品牌名称">
              {getFieldDecorator('brandName')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="供应商">
              {getFieldDecorator('supplierId')(
                <Select
                  placeholder={`${formatMessage({
                    id: 'publickey.select',
                  })}`}
                >
                  {this.state.supplyList.map(item => <Option value={item.supplierId}>{item.supplierName}</Option>)}
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
