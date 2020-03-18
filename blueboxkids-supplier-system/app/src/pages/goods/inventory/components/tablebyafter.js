import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import EditableTable from '../../../../components/StandardTable';

class TablebyCard extends Component {
    state = {};

    columns = [
        {
            title: <FormattedMessage id="publickey.goodsCode" />,
            dataIndex: 'skuBarCode',
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
            title: <FormattedMessage id="publickey.inventBefore" />,
            dataIndex: 'beforeQty',
        },
        {
            title: <FormattedMessage id="publickey.inventAfter" />,
            dataIndex: 'qty',
        },
    ];

    render() {
        return (
            <Card style={{ marginTop: '10px' }} title={<FormattedMessage id="publickey.inventAfter" />}>
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
