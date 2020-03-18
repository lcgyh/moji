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
            const { visible, onCancel, onCreate, form, modelData } = this.props;
            const { getFieldDecorator } = form;
            console.log('modelData',modelData)
            return (
                <Modal
                    visible={visible}
                    title=""
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="门店名称">
                            <span>{modelData.shopName}</span>
                        </Form.Item>
                        <Form.Item label="账户">
                            <span>{modelData.shoperAccount}</span>
                        </Form.Item>
                        <Form.Item label="密码">
                            <span>{modelData.passWord}</span>
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
        modelData:{}
    };

    showModal = () => {
        this.setState({
            visible: true,
            modelData: this.props.modelData || {}
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
            values.orderId = this.props.selectedRowKeys;
            values.opType = this.props.modelType;
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
                    modelData={this.state.modelData}
                />
            </div>
        );
    }
}

export default CollectionsPage;
