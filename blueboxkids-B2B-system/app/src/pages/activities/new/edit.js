import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  message,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { connect } from 'dva';
import { saveNew, getNewInfo } from '@/services/activities';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 10,
    },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 7,
    },
  },
};

class BasicForm extends Component {
  state = {
    infoData: {},
    pageType: '1',
    skillId: null,
  };

  componentDidMount() {
    this.initData();
  }


  initData = () => {
    // 判断参数是有有id,加入有则是编辑
    const params = this.props.match.params || {};
    const newId = params.id;
    if (newId) {
      this.getInfoData(newId);
    }
  };

  // 查询详情
  getInfoData = async newId => {
    const result = await getNewInfo({ newId });
    if (result.code == '0') {
      const resData = result.data || {};
      this.setState({
        infoData: resData,
        pageType: '2',
        newId,
      });
    }
  };

  // 提交
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.state.pageType == '2') {
          values.newId = this.state.newId;
        }
        values.opType = this.state.pageType
        const result = await saveNew(values);
        if (result.code == '0') {
          this.handgoback();
        }
      }
    });
  };

  // 返回
  handgoback = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { infoData } = this.state;

    return (
      <PageHeaderWrapper title={() => ''}>
        <Card bordered={false}>
          <Form
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="上新名称">
              {getFieldDecorator('newName', {
                initialValue: infoData.newName,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    max: 50,
                    message: '最大只能输入50个字符',
                   },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="上新商品">
              {getFieldDecorator('spuId', {
                initialValue: infoData.spuId,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="上新状态" {...formItemLayout}>
              {getFieldDecorator('newStatus', {
                initialValue: infoData.newStatus ? String(infoData.newStatus) : '1',
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="1">上线</Radio>
                  <Radio value="2">下线</Radio>
                </Radio.Group>,
              )}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button onClick={() => this.handgoback()}>返回</Button>
              <Button
                type="primary"
                style={{
                  marginLeft: 8,
                }}
                onClick={() => this.handleSubmit()}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading }) => ({
    submitting: loading.effects['formBasicForm/submitRegularForm'],
  }))(BasicForm),
);
