import { Row, Modal, Form, Input, Col } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="补充快递单"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form {...formItemLayout}>

            <Form.Item label="快递单号">
              {getFieldDecorator('expressNo', {
                rules: [{ required: true, message: '请输入快递单号!' }],
              })(
                <Input
                  placeholder={`${formatMessage({
                    id: 'publickey.input',
                  })}`}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

class CollectionsPage extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true }, function() {
      this.initModel();
    });
  };

  // 初始化弹窗数据
  initModel = () => {};

  handleCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.orderId = this.props.selectedRowKeys;
      values.opType = '2'
      this.props.handleCreate(values);
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default CollectionsPage;
