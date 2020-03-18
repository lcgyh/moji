import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar } from 'antd';
import { connect } from 'dva';
import EditableTable from '../../../../components/StandardTable';


class TablebyCard extends Component {
    state = {};

    columns = [
        {
            title: '商品编码',
            dataIndex: 'skuBarCode',
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
            title: '修改前售卖库存',
            dataIndex: 'beforeQty',
        },
        {
            title: '修改后售卖库存',
            dataIndex: 'qty',
        },
    ];

    render() {
        return (
            <Card style={{ marginTop: '10px' }} title="修改后库存">
                <EditableTable
                    bordered
                    loading={this.props.loading}
                    dataSource={this.props.list}
                    columns={this.columns}
                    pagination={false}
                />
            </Card>
        );
    }
}

export default TablebyCard;
