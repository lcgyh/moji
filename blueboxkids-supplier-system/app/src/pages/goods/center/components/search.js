import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { getBrands } from '@/services/brand';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss';
const gutter = {
  md: 8,
  lg: 24,
  xl: 48,
};

@connect(({ goods, loading }) => ({
  goods,
}))
class SearchCard extends Component {
  state = {
    brandList: [],
  };

  // 调用查询显示数据
  componentDidMount() {
    this.getBrands();
    this.initSearchvalue();
  }

  // 注销数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'goods/initState',
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
          type: 'goods/fetch',
          payload: values,
        });
      }
    });
  };

  // handleFormReset
  handleFormReset = () => {
    this.props.form.resetFields();
  };

  // 获取品牌
  getBrands = async () => {
    const result = await getBrands();
    if (result.code == '0') {
      const resData = result.data || [];
      this.setState({
        brandList: resData,
      });
    } else {
    }
  };

  // form 搜索项
  renderForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row gutter={gutter}>
          <Col md={7} sm={24}>
            <FormItem label={<FormattedMessage id="publickey.SPUID" />}>
              {getFieldDecorator('spuId')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
            <FormItem label={<FormattedMessage id="publickey.barCode" />}>
              {getFieldDecorator('barCode')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
            <FormItem label={<FormattedMessage id="publickey.goodsName" />}>
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
            <FormItem label={<FormattedMessage id="publickey.goodsBrand" />}>
              {getFieldDecorator('brandId')(
                <Select
                  placeholder={`${formatMessage({
                    id: 'publickey.select',
                  })}`}
                >
                  {this.state.brandList.map(item => (
                    <Option value={item.brandId} key={item.brandId}>
                      {item.brandName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label={<FormattedMessage id="publickey.SKUID" />}>
              {getFieldDecorator('skuId')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
            <FormItem label={<FormattedMessage id="publickey.onlineState" />}>
              {getFieldDecorator('skuStatus')(
                <Select
                  placeholder={`${formatMessage({
                    id: 'publickey.select',
                  })}`}
                >
                  <Option value="1">
                    <FormattedMessage id="publickey.online" />
                  </Option>
                  <Option value="2">
                    <FormattedMessage id="publickey.Offline" />
                  </Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label={<FormattedMessage id="publickey.saleStatus" />}>
              {getFieldDecorator('spuStatus')(
                <Select
                  placeholder={`${formatMessage({
                    id: 'publickey.select',
                  })}`}
                >
                  <Option value="1">
                    <FormattedMessage id="publickey.sell" />
                  </Option>
                  <Option value="2">
                    <FormattedMessage id="publickey.discontinued" />
                  </Option>
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
        <FormattedMessage id="publickey.search" />
        </Button>
        <Button
          style={{
            marginLeft: 8,
          }}
          onClick={this.handleFormReset}
        >
          <FormattedMessage id="publickey.clearSearch" />
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
