import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';

@connect(({ supply, loading }) => ({
    supply,
    list: supply.list || [],
    total: supply.total || 0,
    pageSize: supply.pageSize || 10,
    current: supply.current || 1,
    searchValue: supply.searchValue || {},
    loading: loading.models.supply,
}))
class TableCard extends Component {
    state = {};

    columns = [
        {
            title: '供应商名称',
            dataIndex: 'supplierName',
        },
        {
            title: '联系人',
            dataIndex: 'supplierContacts',
        },
        {
            title: '联系邮箱',
            dataIndex: 'supplierEmail',
        },
        {
            title: '合作状态',
            dataIndex: 'supplierStatusStr',
        },
        {
            title: '操作',
            dataIndex: 'opa',
            render: (text, record) => (<a onClick={this.hindEdit.bind(this, record)}> 编辑</a>),
        },
    ];


    // 编辑
    hindEdit = record => {
        router.push({
            pathname: `/cooperation/supply/edit/${record.supplierId}`,
        });
    }

    // 分页
    handleStandardTableChange = (pageSize, current) => {
        const { searchValue } = this.props;
        searchValue.pageSize = pageSize;
        searchValue.current = current;
        this.props.dispatch({
            type: 'supply/fetch',
            payload: searchValue,
        });
    };

    // 新建门店
    sendOrder = () => {
        router.push({
            pathname: '/cooperation/supply/add',
        });
    };

    // render table and form 之间的操作项
    renderOpera = () => (
        <div className="tableList">
            <div className="tableListOperator">
                <Button type="primary" onClick={() => this.sendOrder()}>
                    新建
                </Button>
            </div>
        </div>
    );

    render() {
        return (
            <Card style={{ marginTop: '10px' }}>
                {this.renderOpera()}
                <EditableTable
                    bordered
                    loading={this.props.loading}
                    dataSource={this.props.list}
                    columns={this.columns}
                    pageSizeChange={this.handleStandardTableChange}
                    pagination
                    total={this.props.total || 0}
                    pageSize={this.props.pageSize || 10}
                    current={this.props.current || 1}
                />

            </Card>
        );
    }
}

export default TableCard;
