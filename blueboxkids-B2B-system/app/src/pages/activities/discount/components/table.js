import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';

@connect(({ discount, loading }) => ({
    discount,
    list: discount.list || [],
    total: discount.total || 0,
    pageSize: discount.pageSize || 10,
    current: discount.current || 1,
    searchValue: discount.searchValue || {},
    loading: loading.models.discount,
}))
class TableCard extends Component {
    state = {};

    columns = [
        {
            title: '折扣ID',
            dataIndex: 'discountId',
        },
        {
            title: '折扣活动',
            dataIndex: 'discountName',
        },
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
            title: '原价',
            dataIndex: 'skuRetailPrice',
        },
        {
            title: '折扣价',
            dataIndex: 'discoutPrice',
        },
        {
            title: '状态',
            dataIndex: 'discountStatusStr',
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
            pathname: `/activities/discount/edit/${record.discountId}`,
        });
    }

    // 分页
    handleStandardTableChange = (pageSize, current) => {
        const { searchValue } = this.props;
        searchValue.pageSize = pageSize;
        searchValue.current = current;
        this.props.dispatch({
            type: 'discount/fetch',
            payload: searchValue,
        });
    };

    // 新建门店
    sendOrder = () => {
        router.push({
            pathname: '/activities/discount/add',
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
