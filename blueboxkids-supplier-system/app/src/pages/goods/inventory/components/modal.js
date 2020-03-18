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
                    title="更新库存"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="更改数值">
                            {getFieldDecorator('qtyChange', {
                                rules: [{ required: true, message: '请输入' }],
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
        modelData: {},
    };

    showModal = () => {
        const { form } = this.formRef.props;
        this.setState({
            visible: true,
        }, () => {
            form.resetFields();
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
            console.log('values', values)
            values.skuId = this.props.skuId;
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
