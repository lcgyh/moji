import { Card, Descriptions, Divider, Button, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getGoodsLog } from '../../../services/goods';
import EditableTable from '../../../components/StandardTable';
import { addKeyForList } from '@/utils/utils';

class Infocon extends Component {
    state = {
        odLogs: [],
        total: 0,
        pageSize: 10,
        current: 1,
        skuId: null,
    };

    logColumns = [
        {
            title: '操作类型',
            dataIndex: 'logOperate',
        },
        {
            title: '操作描述',
            dataIndex: 'logRemark',
        },
        {
            title: '操作时间',
            dataIndex: 'createTime',
        },
        {
            title: '操作人',
            dataIndex: 'logOperator',
        },
    ];

    componentDidMount() {
        this.getParams();
    }

    // 获取参数，请求数据
    getParams = () => {
        const params = this.props.match.params || {};
        console.log(params)
        const { id } = params;
        const skuId = id
        if (skuId) {
            this.setState({
                skuId,
            }, function() {
                this.getOrderData(10, 1);
            })
        } else {
            message.error('无效的id');
        }
    };

    // get orderinfo
    getOrderData = async (pageSize, current) => {
        const data = {
            pageSize,
            current,
            skuId: this.state.skuId,
        }
        const result = await getGoodsLog(data);
        if (result.code == '0') {
            const resData = result.data || {}
            this.setState({
                odLogs: addKeyForList(resData.list) || [],
                total: resData.total || 0,
                pageSize: resData.pageSize || 10,
                current: resData.pageNum || 1,
            });
        }
    };

    handgoback = () => {
        this.props.history.goBack();
    };

    handleStandardTableChange = (pageSize, current) => {
       this.getOrderData(pageSize, current)
    };

    render() {
        const { orderInfo, spAddress } = this.state;
        return (
            <PageHeaderWrapper>
                <Card>
                    <EditableTable
                        dataSource={this.state.odLogs}
                        columns={this.logColumns}
                        pagination
                        bordered
                        pageSize={this.state.pageSize || 10}
                        current={this.state.current || 1}
                        total={this.state.total || 0}
                        pageSizeChange={this.handleStandardTableChange}
                    />
                </Card>
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button onClick={() => this.handgoback()} type="primary">
                        返回
                    </Button>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default Infocon;
