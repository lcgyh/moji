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
            const { visible, onCancel, onCreate, form, modelType } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title={modelType == '1' ? '新增规格' : '编辑规格'}
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="规格名称">
                            {getFieldDecorator('specName', {
                                rules: [{ required: true, message: '请输入规格名称' }],
                            })(<Input placeholder={`${formatMessage({
                                id: 'publickey.input',
                            })}`} />)}
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
        this.setState({ visible: true }, function () {
            this.initModel();
        });
    };

    // 初始化弹窗数据
    initModel = () => {
        const { form } = this.formRef.props;
        form.setFieldsValue({
            specName: this.props.specName,
          });
    };

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
            values.opType = this.props.modelType;
            if (this.props.modelType == '2') {
                values.specId = this.props.specId;
            }
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
                    modelType={this.props.modelType}
                />
            </div>
        );
    }
}

export default CollectionsPage;
