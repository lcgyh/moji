import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { getStore } from '@/services/store';
import { getBrands } from '@/services/brand';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss';
const gutter = {
  md: 8,
  lg: 24,
  xl: 48,
};

@connect(({ storeOrder, loading }) => ({
  storeOrder,
}))
class SearchCard extends Component {
  state = {
    storeList: [],
    brandList: [],
  };

  // 调用查询显示数据
  componentDidMount() {
    this.getStore();
    this.getBrand();
    this.initSearchvalue();
  }

  // 注销数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'storeOrder/initState',
    });
  }

  // 初始化搜索条件
  initSearchvalue = () => {
    this.handleSearch();
  };

  // 查询门店信息
  getStore = async () => {
    const data = {
      pageSize: 9999,
      current: 1,
    };
    const result = await getStore(data);
    if (result.code == '0') {
      const resData = result.data || {};
      this.setState({
        storeList: resData.list || [],
      });
    } else {
    }
  };

  // 查询品牌
  getBrand = async () => {
    const result = await getBrands();
    if (result.code == '0') {
      const resData = result.data || [];
      this.setState({
        brandList: resData,
      });
    } else {
    }
  };

  // 查询数据
  handleSearch = (pageSize, current) => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.pageSize = pageSize || 10;
        values.current = current || 1;
        values.orderTimeStart =
          values.time1 && values.time1.length > 0 ? moment(values.time1[0]).format(format) : null;
        values.orderTimeEnd =
          values.time1 && values.time1.length > 0 ? moment(values.time1[1]).format(format) : null;
        values.deliverTimeStart =
          values.time2 && values.time2.length > 0 ? moment(values.time2[0]).format(format) : null;
        values.deliverTimeEnd =
          values.time2 && values.time2.length > 0 ? moment(values.time2[1]).format(format) : null;
        console.log('values', values);
        this.props.dispatch({
          type: 'storeOrder/fetch',
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
            <FormItem label="门店名称">
              {/* {getFieldDecorator('shopName')(
                // <Select
                //   placeholder={`${formatMessage({
                //     id: 'publickey.select',
                //   })}`}
                //   optionFilterProp="children"
                //   filterOption={(input, option) =>
                //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                //   }
                // >
                //   {this.state.storeList.map(item => (
                //     <Option value={item.shopId} key={item.shopId}>
                //       {item.shopName}
                //     </Option>
                //   ))}
                // </Select>,

              )} */}
              {getFieldDecorator('shopName')(
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
            <FormItem label="品牌">
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
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col md={7} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderNo')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus')(
                <Select
                  placeholder={`${formatMessage({
                    id: 'publickey.select',
                  })}`}
                >
                  <Option value="10">待支付</Option>
                  <Option value="20">待发货</Option>
                  <Option value="30">已发货</Option>
                  <Option value="70">已取消</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={gutter}>
          <Col md={12} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('time1')(
                <RangePicker format={format} style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发货时间">
              {getFieldDecorator('time2')(
                <RangePicker format={format} style={{ width: '100%' }} />,
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
