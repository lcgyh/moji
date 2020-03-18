import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message, Avatar, Divider } from 'antd';
import { connect } from 'dva';
import { switchCase } from '@babel/types';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import EditableTable from '../../../../components/StandardTable';
import { saveGoodsChangeState } from '@/services/goods';

@connect(({ goods, loading }) => ({
    goods,
    list: goods.list || [],
    total: goods.total || 0,
    pageSize: goods.pageSize || 10,
    current: goods.current || 1,
    searchValue: goods.searchValue || {},
    selectedRowKeys: goods.selectedRowKeys || {},
    selectedRows: goods.selectedRows || {},
    loading: loading.models.goods,
}))
class TableCard extends Component {
    state = {
        selectedRowKeys: [],
        selectedRows: [],
    };

    columns = [
        {
            title: <FormattedMessage id="publickey.goodsName" />,
            dataIndex: 'spuName',
            width: '10%',
            render: (text, record) => (<span><a onClick={this.goInfo.bind(this, record)}> {text}</a></span>),
        },
        {
            title: <FormattedMessage id="publickey.skuImg" />,
            dataIndex: 'skuPic',
            width: '10%',
            render: (text, record, index) => (<Avatar size="large" src={text} shape="square" />),
        },
        {
            title: <FormattedMessage id="publickey.SPUID" />,
            dataIndex: 'spuId',
        },
        {
            title: <FormattedMessage id="publickey.SKUID" />,
            dataIndex: 'skuId',
        },
        {
            title: <FormattedMessage id="publickey.goodsSpec" />,
            dataIndex: 'specAttrStr',
        },
        {
            title: <FormattedMessage id="publickey.barCode" />,
            dataIndex: 'skuBarCode',
        },
        {
            title: <FormattedMessage id="publickey.brand" />,
            dataIndex: 'brandName',
        },
        {
            title: <FormattedMessage id="publickey.supplyPrice" />,
            dataIndex: 'skuSupplyPrice',
        },
        {
            title: <FormattedMessage id="publickey.retailPrice" />,
            dataIndex: 'skuRetailPrice',
        },
        {
            title: <FormattedMessage id="publickey.suggestedPrice" />,
            dataIndex: 'skuRecommendPrice',
            // width: '10%',
        },
        {
            title: <FormattedMessage id="publickey.invent" />,
            dataIndex: 'qty',
        },
        {
            title: <FormattedMessage id="publickey.spuState" />,
            dataIndex: 'spuStatusStr',
        },
        {
            title: <FormattedMessage id="publickey.skuState" />,
            dataIndex: 'skuStatusStr',
        },
        {
            title: <FormattedMessage id="publickey.operat" />,
            dataIndex: 'opa',
            width: '10%',
            render: (text, record) => (<span><a onClick={this.hindEdit.bind(this, record)}> <FormattedMessage id="publickey.edit" /></a></span>),
        },
    ];

    // 编辑
    hindEdit = record => {
        router.push({
            pathname: `/goods/center/edit/${record.spuId}`,
        });
    }

    // goinfo
    goInfo = record => {
        router.push({
            pathname: `/goods/center/info/${record.spuId}`,
        });
    }

    // golog
    goLog = record => {
        router.push({
            pathname: `/goods/center/log/${record.skuId}`,
        });
    }

    // 分页
    handleStandardTableChange = (pageSize, current) => {
        const { searchValue } = this.props;
        searchValue.pageSize = pageSize;
        searchValue.current = current;
        this.props.dispatch({
            type: 'goods/fetch',
            payload: searchValue,
        });
    };

    // 新建
    sendOrder = () => {
        router.push({
            pathname: '/goods/center/add',
        });
    };

    // 更改商品状态
    mackGoodsState=async type => {
        const { selectedRowKeys } = this.props
        if (selectedRowKeys.length < 1) {
            message.error('请选择操作的商品')
        }
        const data = {
            opType: type,
            spuSkuIds: selectedRowKeys,
        }
        const result = await saveGoodsChangeState(data)
        if (result.code == '0') {
            this.getMessage(type)
        }
    }

    getMessage=type => {
        let msg = ''
        switch (type) {
            case '1':
               msg = 'SPU售卖成功'
               break;
            case '2':
                msg = 'SPU停售成功'
               break;
            case '3':
                msg = 'SPU上线成功'
               break;
            case '4':
                msg = 'SPU下线成功'
               break;
            default:
                msg = 'SPU售卖成功'
       }

        message.success(msg)
        this.handleStandardTableChange(10, 1)
    }


    // render table and form 之间的操作项
    renderOpera = () => (
        <div className="tableList">
            <div className="tableListOperator">
                <Button type="primary" onClick={() => this.sendOrder()}>
                <FormattedMessage id="publickey.newItem" />
                </Button>
                <Button type="primary" onClick={() => this.mackGoodsState('1')}>
                <FormattedMessage id="publickey.spuSell" />
                </Button>
                <Button type="primary" onClick={() => this.mackGoodsState('2')}>
                <FormattedMessage id="publickey.spuUnsell" />
                </Button>
                <Button type="primary" onClick={() => this.mackGoodsState('3')}>
                <FormattedMessage id="publickey.skuOnline" />
                </Button>
                <Button type="primary" onClick={() => this.mackGoodsState('4')}>
                <FormattedMessage id="publickey.skuOffline" />
                </Button>
            </div>
        </div>
    );


    // 清除选中
    cleanSelectedKeys = () => {
        const selectedRowKeys = []
        const selectedRows = []
        this.props.dispatch({
            type: 'goods/onSelect',
            payload: { selectedRowKeys, selectedRows },
        });
    };

    // 多选change
    selectChange = (selectedRowKeys, selectedRows) => {
        this.props.dispatch({
            type: 'goods/onSelect',
            payload: { selectedRowKeys, selectedRows },
        });
    };

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
                    select
                    cleanSelectedKeys={this.cleanSelectedKeys}
                    selectedRowKeys={this.props.selectedRowKeys}
                    selectChange={this.selectChange}
                    scroll={{ x: '1500px' }}
                />

            </Card>
        );
    }
}

export default TableCard;
