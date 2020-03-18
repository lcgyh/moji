import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import EditableTable from '../../../../components/StandardTable';
import { invUpdata } from '@/services/goods';
import CollectionsPage from './modal';

class TableCard extends Component {
    state = {};

    columns = [
        {
            title: <FormattedMessage id="publickey.SKUID" />,
            dataIndex: 'skuId',
        },
        {
            title: <FormattedMessage id="publickey.goodsName" />,
            dataIndex: 'spuName',
        },
        {
            title: <FormattedMessage id="publickey.goodsSpec" />,
            dataIndex: 'specAttrStr',
        },
        {
            title: <FormattedMessage id="publickey.goodsInvent" />,
            dataIndex: 'qty',
        },
    ];

    // 更新
    sendOrder = () => {
        this.openPop()
    };


    saveModelRef = formRef => {
        this.formRef = formRef;
    };

    // render table and form 之间的操作项
    renderOpera = () => (
        <div className="tableList">
            <div className="tableListOperator">
                <Button type="primary" onClick={() => this.sendOrder()}>
                <FormattedMessage id="publickey.updataInvent" />
                </Button>
            </div>
        </div>
    );


    // 吊起来弹窗
    openPop = () => {
        const { showModal } = this.formRef;
        showModal();
    }

    // close 弹窗
    closePop=() => {
        this.formRef.handleCancel();
    }

    handleCreate= async values => {
        const result = await invUpdata(values)
        if (result.code == '0') {
            this.closePop()
            const item = result.data || {}
            this.props.getInv([item])
        } else {

        }
    }

    render() {
        return (
            <Card style={{ marginTop: '10px' }}>
                {this.renderOpera()}
                <EditableTable
                    bordered
                    loading={this.props.loading}
                    dataSource={this.props.list}
                    columns={this.columns}
                    pagination={false}
                />
                <CollectionsPage
                    ref={this.saveModelRef}
                    handleCreate={this.handleCreate}
                    skuId={this.props.skuId}
                />
            </Card>
        );
    }
}

export default TableCard;
