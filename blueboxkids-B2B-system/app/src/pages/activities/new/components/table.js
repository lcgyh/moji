import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';

@connect(({ popular, loading }) => ({
    popular,
    list: popular.list || [],
    total: popular.total || 0,
    pageSize: popular.pageSize || 10,
    current: popular.current || 1,
    searchValue: popular.searchValue || {},
    loading: loading.models.popular,
}))
class TableCard extends Component {
    state = {};

    columns = [
        {
            title: '上新ID',
            dataIndex: 'newId',
        },
        {
            title: '上新活动',
            dataIndex: 'newName',
        },
        {
            title: 'SPUID',
            dataIndex: 'spuId',
        },
        {
            title: '商品名称',
            dataIndex: 'spuName',
        },
        {
            title: '状态',
            dataIndex: 'newStatusStr',
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
            pathname: `/activities/new/edit/${record.newId}`,
        });
    }

    // 分页
    handleStandardTableChange = (pageSize, current) => {
        const { searchValue } = this.props;
        searchValue.pageSize = pageSize;
        searchValue.current = current;
        this.props.dispatch({
            type: 'popular/fetch',
            payload: searchValue,
        });
    };

    // 新建门店
    sendOrder = () => {
        router.push({
            pathname: '/activities/new/add',
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
