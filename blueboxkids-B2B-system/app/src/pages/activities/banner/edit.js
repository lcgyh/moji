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
import { saveBanner, getBannerInfo } from '@/services/banner';
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
    bannerId: null,
    bannerPic: [],
  };

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    // 判断参数是有有id,加入有则是编辑
    const params = this.props.match.params || {};
    const bannerId = params.id;
    if (bannerId) {
      this.getInfoData(bannerId);
    }
  };

  // 查询详情
  getInfoData = async bannerId => {
    const result = await getBannerInfo({ bannerId });
    if (result.code == '0') {
      const resData = result.data || {};
      this.setState({
        infoData: resData,
        pageType: '2',
        bannerId,
        bannerPic: this.getUrlToArr([resData.bannerPic]) || [],
      });
    }
  };

  // 提交
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.state.pageType == '2') {
          values.bannerId = this.state.bannerId;
        }
        const { bannerPic } = this.state;
        if (bannerPic.length < 1) {
          message.error('请上传banner图');
          return;
        }
        values.bannerPic = this.state.bannerPic[0].url;
        values.opType = this.state.pageType;
        const result = await saveBanner(values);
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
        bannerPic: data,
      });
    }
  };

  saveModelRef = formRef => {
    this.formRef = formRef;
  };

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
            <FormItem {...formItemLayout} label="banner名称">
              {getFieldDecorator('bannerName', {
                initialValue: infoData.bannerName,
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
            <FormItem label="banner状态" {...formItemLayout}>
              {getFieldDecorator('bannerStatus', {
                initialValue: infoData.bannerStatus ? String(infoData.bannerStatus) : '1',
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
            <FormItem {...formItemLayout} label="banner权重">
              {getFieldDecorator('bannerRank', {
                initialValue: infoData.bannerRank,
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(<InputNumber min={1}
                max={100}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="banner图片">
              {getFieldDecorator('bannerPic')(
                <PicturesWall
                  acceptbrandPicImg={this.acceptbrandPicImg}
                  type="1"
                  pics={this.state.bannerPic}
                  uploadLength={1}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="链接商品">
              {getFieldDecorator('spuId', {
                initialValue: infoData.spuId,
              })(<Input placeholder="请输入" />)}
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
