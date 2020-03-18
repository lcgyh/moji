import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';

@connect(({ brand, loading }) => ({
    brand,
    list: brand.list || [],
    total: brand.total || 0,
    pageSize: brand.pageSize || 10,
    current: brand.current || 1,
    searchValue: brand.searchValue || {},
    loading: loading.models.brand,
}))
class TableCard extends Component {
    state = {};

    columns = [
        {
            title: '品牌ID',
            dataIndex: 'brandId',
        },
        {
            title: '品牌LOGO',
            dataIndex: 'brandPic',
            render: (text, record, index) => (<Avatar size="large" src={text} shape="square"/>),
        },
        {
            title: '品牌名称',
            dataIndex: 'brandName',
        },
        {
            title: '品牌供应商',
            dataIndex: 'supplierName',
        },
        {
            title: 'to C状态',
            dataIndex: 'toCStatusStr',
        },
        {
            title: 'to B状态',
            dataIndex: 'toBStatusStr',
        },
        {
            title: '限制最低购买数量',
            dataIndex: 'brandLimitQty',
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
            pathname: `/cooperation/brand/edit/${record.brandId}`,
        });
    }

    // 分页
    handleStandardTableChange = (pageSize, current) => {
        const { searchValue } = this.props;
        searchValue.pageSize = pageSize;
        searchValue.current = current;
        this.props.dispatch({
            type: 'brand/fetch',
            payload: searchValue,
        });
    };

    // 新建门店
    sendOrder = () => {
        router.push({
            pathname: '/cooperation/brand/add',
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
