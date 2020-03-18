import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';
import { invUpdata } from '@/services/goods';
import CollectionsPage from './modal';

class TableCard extends Component {
    state = {};

    columns = [
        {
            title: 'SKUID',
            dataIndex: 'skuId',
        },
        {
            title: '商品名称',
            dataIndex: 'spuName',
        },
        {
            title: '商品规格',
            dataIndex: 'specAttrStr',
        },
        {
            title: '商品库存',
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
                    增减库存
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
        console.log('000000', values)
        const result = await invUpdata(values)
        if (result.code == '0') {
            const item = [result.data] || []
            this.closePop()
            this.props.getInv(item)
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
