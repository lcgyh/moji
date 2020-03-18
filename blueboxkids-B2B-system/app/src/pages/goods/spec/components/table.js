import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';
import CollectionsPage from './modal';
import { sendOrder } from '../../../../services/order';
import { getSpec, editSpec } from '@/services/goods'
import { addKeyForList } from '@/utils/utils';


class TableCard extends Component {
    state = {
        list: [],
        modelType: '1',
        specId: null,
        specName: null,
        total: 0,
        pageSize: 10,
        current: 1,
    };

    columns = [
        {
            title: '规格ID',
            dataIndex: 'specId',
        },
        {
            title: '规格名称',
            dataIndex: 'specName',
        },
        {
            title: '操作',
            dataIndex: 'opa',
            render: (text, record) => (<a onClick={this.hindEdit.bind(this, record)}> 编辑</a>),
        },
    ];

    componentDidMount() {
        this.getData(10, 1)
    }

    // 规格查询
    getData = async (pageSize, current) => {
        const data = {
            pageSize,
            current,
        }
        const result = await getSpec(data)
        if (result.code == 0) {
            const resData = result.data || {}
            this.setState({
                list: addKeyForList(resData.list) || [],
                total: resData.total || 0,
                pageSize: resData.pageSize || 10,
                current: resData.pageNum || 1,
            })
        }
    }

    // 分页
    handleStandardTableChange = (pageSize, current) => {
        this.getData(pageSize, current)
    };

    // 编辑规格
    hindEdit = record => {
        this.setState({
            modelType: '2',
            specId: record.specId,
            specName: record.specName,
        }, function () {
            this.openPop()
        })
    }

    // 新增规格
    sendOrder = () => {
        this.setState({
            modelType: '1',
        }, function () {
            this.openPop()
        })
    };

    // 吊起来弹窗
    openPop = () => {
        const { showModal } = this.formRef;
        showModal();
    }

    // close 弹窗
    closePop = () => {
        this.setState({
            specId: null,
            specName: null,
        })
        this.formRef.handleCancel();
    }

    // render table and form 之间的操作项
    renderOpera = () => (
        <div className="tableList">
            <div className="tableListOperator">
                <Button type="primary" onClick={() => this.sendOrder()}>
                    新增规格
                </Button>
            </div>
        </div>
    );

    saveModelRef = formRef => {
        this.formRef = formRef;
    };

    handleCreate = async value => {
        console.log(value)
        const resData = await editSpec(value);
        if (resData.code == '0') {
            let msg = '新建成功'
            if (this.state.modelType == '2') {
                msg = '编辑成功'
            }
            message.success(msg)
            this.closePop()
            this.getData(10, 1)
        }
    };

    render() {
        return (
            <Card style={{ marginTop: '10px' }}>
                {this.renderOpera()}
                <EditableTable
                    dataSource={this.state.list}
                    columns={this.columns}
                    pageSizeChange={this.handleStandardTableChange}
                    pagination
                    total={this.state.total || 0}
                    pageSize={this.state.pageSize || 10}
                    current={this.state.current || 1}
                    bordered
                />
                <CollectionsPage
                    ref={this.saveModelRef}
                    handleCreate={this.handleCreate}
                    modelType={this.state.modelType}
                    specId={this.state.specId}
                    specName={this.state.specName}
                />
            </Card>
        );
    }
}

export default TableCard;
