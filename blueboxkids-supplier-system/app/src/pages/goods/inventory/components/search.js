import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { getInv, invUpdata } from '@/services/goods';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss';
const gutter = {
  md: 8,
  lg: 24,
  xl: 48,
};


class SearchCard extends Component {
  state = {};

  // 查询数据
  handleSearch = () => {
    const { form } = this.props;
    form.validateFields(async(err, values) => {
      if (!err) {
        const result = await getInv(values)
        if (result.code == '0') {
          const list = [result.data] || []
          this.props.getInvbeforeData(list)
        } else {

        }
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
            <FormItem label="SKUID">
              {getFieldDecorator('skuId')(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
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
