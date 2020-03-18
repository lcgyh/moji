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
import { getSupplyInfo, saveSupply, supplyPassReset } from '@/services/supply';
import CollectionsPage from './components/modal';

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
    supplierId: null,
    modelData: {},
  };

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    // 判断参数是有有id,加入有则是编辑
    const params = this.props.match.params || {};
    const supplierId = params.id;
    if (supplierId) {
      this.getInfoData(supplierId);
    }
  };

  // 查询用户信息
  getInfoData = async supplierId => {
    const result = await getSupplyInfo({ supplierId });
    if (result.code == '0') {
      this.setState({
        infoData: result.data || {},
        pageType: '2',
        supplierId,
      });
    }
  };

  // 提交
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.state.pageType == '2') {
          values.supplierId = this.state.supplierId;
        }
        values.opType = this.state.pageType
        const result = await saveSupply(values);
        if (result.code == '0') {
          if (this.state.pageType == '1') {
            this.setState(
              {
                modelData: result.data || {},
              },
              function() {
                this.openPop();
              },
            );
          } else {
            this.handgoback();
          }
        }
      }
    });
  };

  // 返回
  handgoback = () => {
    this.props.history.goBack();
  };

  // 重置密码
  resetPass = async () => {
    const { supplierId } = this.state;
    const result = await supplyPassReset({ supplierId });
    if (result.code == '0') {
      this.setState(
        {
          modelData: result.data || {},
        },
        function() {
          this.openPop();
        },
      );
    }
  };

  saveModelRef = formRef => {
    this.formRef = formRef;
  };

  // 弹窗确认
  handleCreate = () => {
    this.formRef.handleCancel();
  };

  // open 弹窗
  openPop = () => {
    const { showModal } = this.formRef;
    showModal();
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
            <FormItem {...formItemLayout} label="供应商名称">
              {getFieldDecorator('supplierName', {
                initialValue: infoData.supplierName,
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
            <FormItem {...formItemLayout} label="联系人">
              {getFieldDecorator('supplierContacts', {
                initialValue: infoData.supplierContacts,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    max: 20,
                    message: '最大只能输入20个字符',
                   },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系邮箱">
              {getFieldDecorator('supplierEmail', {
                initialValue: infoData.supplierEmail,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    max: 100,
                    message: '最大只能输入100个字符',
                   },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="合作状态" {...formItemLayout}>
              {getFieldDecorator('supplierStatus', {
                initialValue: infoData.supplierStatus ? String(infoData.supplierStatus) : '1',
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="1">开启</Radio>
                  <Radio value="2">关闭</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('supplierRemark', {
                initialValue: infoData.supplierRemark,
              })(<TextArea rows={4} maxLength={100}/>)}
            </FormItem>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button onClick={() => this.handgoback()}>返回</Button>
              {this.state.pageType == '2' ? (
                <Button
                  onClick={() => this.handgoback()}
                  style={{
                    marginLeft: 8,
                  }}
                  type="danger"
                  onClick={this.resetPass.bind(this)}
                >
                  重置密码
                </Button>
              ) : null}

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
          <CollectionsPage
            ref={this.saveModelRef}
            handleCreate={this.handleCreate}
            modelData={this.state.modelData}
          />
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
