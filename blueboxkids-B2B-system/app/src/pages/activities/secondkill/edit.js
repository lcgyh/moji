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
import { saveSkill, getSkillInfo } from '@/services/activities';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const format = 'YYYY-MM-DD HH:mm';
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
    const skillId = params.id;
    if (skillId) {
      this.getInfoData(skillId);
    }
  };

  // 查询详情
  getInfoData = async skillId => {
    const result = await getSkillInfo({ skillId });
    if (result.code == '0') {
      const resData = result.data || {};
      this.setState({
        infoData: resData,
        pageType: '2',
        skillId,
      });
    }
  };

  // 提交
  handleSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        if (this.state.pageType == '2') {
          values.skillId = this.state.skillId;
        }
        values.opType = this.state.pageType
        values.startTime = values.time1 && values.time1.length > 0 ? moment(values.time1[0]).format(format) : null
        values.endTime = values.time1 && values.time1.length > 0 ? moment(values.time1[1]).format(format) : null
        const result = await saveSkill(values);
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
            <FormItem {...formItemLayout} label="秒杀名称">
              {getFieldDecorator('skillName', {
                initialValue: infoData.skillName,
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
            <FormItem {...formItemLayout} label="秒杀时间段">
              {getFieldDecorator('time1', {
                initialValue: infoData.startTime ? [moment(infoData.startTime), moment(infoData.endTime)] : [],
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="SPUId">
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
