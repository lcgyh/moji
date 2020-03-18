import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';

@connect(({ store, loading }) => ({
    store,
    list: store.list || [],
    total: store.total || 0,
    pageSize: store.pageSize || 10,
    current: store.current || 1,
    searchValue: store.searchValue || {},
    loading: loading.models.store,
}))
class TableCard extends Component {
    state = {};

    columns = [
        {
            title: '门店名称',
            dataIndex: 'shopName',
        },
        {
            title: '联系电话',
            dataIndex: 'shopMobile',
        },
        {
            title: '联系人',
            dataIndex: 'shoperName',
        },
        {
            title: '门店状态',
            dataIndex: 'shopStatusStr',
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
            pathname: `/cooperation/store/edit/${record.shopId}`,
        });
    }

    // 分页
    handleStandardTableChange = (pageSize, current) => {
        const { searchValue } = this.props;
        searchValue.pageSize = pageSize;
        searchValue.current = current;
        this.props.dispatch({
            type: 'store/fetch',
            payload: searchValue,
        });
    };

    // 新建门店
    sendOrder = () => {
        router.push({
            pathname: '/cooperation/store/add',
        });
    };

    // render table and form 之间的操作项
    renderOpera = () => (
        <div className="tableList">
            <div className="tableListOperator">
                <Button type="primary" onClick={() => this.sendOrder()}>
                    新建门店
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
