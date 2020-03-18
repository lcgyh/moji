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
import { getBrandInfo, saveBrand } from '@/services/brand';
// import CollectionsPage from './components/modal';
import { getSupplys } from '@/services/supply';
import PicturesWall from './components/upload';

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
    brandId: null,
    modelData: {},
    supplyList: [],
    brandPic: [],
    brandDescPic: [],
  };

  componentDidMount() {
    this.getSupply();
    this.initData();
  }

  // 针对url的转化
  getUrlToArr = urls => {
    const arr = [];
    if (urls) {
      for (let i = 0; i < urls.length; i++) {
        arr.push({
          uid: i,
          status: 'done',
          url: urls[i],
        });
      }
    }
    console.log('arr', arr);
    return arr;
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

  initData = () => {
    // 判断参数是有有id,加入有则是编辑
    const params = this.props.match.params || {};
    const brandId = params.id;
    if (brandId) {
      this.getInfoData(brandId);
    }
  };

  // 查询详情
  getInfoData = async brandId => {
    const result = await getBrandInfo({ brandId });
    if (result.code == '0') {
      const resData = result.data || {};
      this.setState({
        infoData: resData,
        pageType: '2',
        brandId,
        brandPic: this.getUrlToArr([resData.brandPic]) || [],
        brandDescPic: this.getUrlToArr([resData.brandDescPic]) || [],
      });
    }
  };

  // 提交
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.state.pageType == '2') {
          values.brandId = this.state.brandId;
        }
        values.brandPic = this.state.brandPic[0].url
        values.brandDescPic = this.state.brandDescPic[0].url
        values.opType = this.state.pageType
        const result = await saveBrand(values);
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

  // 接收图片
  acceptbrandPicImg = (data, type) => {
    if (type == '1') {
      this.setState({
        brandPic: data,
      });
    }
    if (type == '2') {
      this.setState({
        brandDescPic: data,
      });
    }
  };

  saveModelRef = formRef => {
    this.formRef = formRef;
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
            <FormItem {...formItemLayout} label="品牌名称">
              {getFieldDecorator('brandName', {
                initialValue: infoData.brandName,
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
            <FormItem {...formItemLayout} label="对应供应商">
              {getFieldDecorator('supplierId', {
                initialValue: infoData.supplierId,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {this.state.supplyList.map(item => (
                    <Option value={item.supplierId}>{item.supplierName}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="品牌logo">
              {getFieldDecorator('brandName1')(
                <PicturesWall acceptbrandPicImg={this.acceptbrandPicImg} type="1" pics={this.state.brandPic} uploadLength={1}/>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="品牌宣传图">
              {getFieldDecorator('brandName11')(
                <PicturesWall
                  acceptbrandPicImg={this.acceptbrandPicImg}
                  type="2"
                  pics={this.state.brandDescPic}
                  uploadLength={1}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="品牌宣传语">
              {getFieldDecorator('brandDesc', {
                initialValue: infoData.brandDesc,
              })(<TextArea rows={4} maxLength={100}/>)}
            </FormItem>
            <FormItem label="ToB状态" {...formItemLayout}>
              {getFieldDecorator('toBStatus', {
                initialValue: infoData.toBStatus ? String(infoData.toBStatus) : '1',
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
            <FormItem label="ToC状态" {...formItemLayout}>
              {getFieldDecorator('toCStatus', {
                initialValue: infoData.toCStatus ? String(infoData.toCStatus) : '1',
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
            <FormItem {...formItemLayout} label="限制购物最低数量">
              {getFieldDecorator('brandLimitQty', {
                initialValue: infoData.brandLimitQty,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<InputNumber min={0}
                max={99999}/>)}
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
