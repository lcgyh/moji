import { Card, Descriptions, Divider, Button, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getStoreOrderInfo } from '../../../services/order';
import EditableTable from '../../../components/StandardTable';
import { addKeyForList } from '@/utils/utils';

class Infocon extends Component {
  state = {
    orderInfo: {},
    odDetails: [],
    odLogs: [],
    spAddress: {},
  };

  odColumns = [
    {
      title: '商品名称',
      dataIndex: 'spuName',
    },
    {
      title: '规格',
      dataIndex: 'specs',
    },
    {
      title: '商品条码',
      dataIndex: 'barcode',
    },
    {
      title: '预定数量',
      dataIndex: 'qty',
    },
    {
      title: '零售价',
      dataIndex: 'price',
    },
    {
      title: '折扣价',
      dataIndex: 'disprice',
    },
  ];

  logColumns = [
    {
      title: '操作',
      dataIndex: 'logOperate',
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
    const { orderId } = params;
    if (orderId) {
      this.getOrderData(orderId);
    } else {
      message.error('无效的id');
    }
  };

  // get orderinfo
  getOrderData = async orderId => {
    const result = await getStoreOrderInfo(orderId);
    if (result.code == '0') {
      const resData = result.data || {}
      this.setState({
        orderInfo: resData,
        odDetails: addKeyForList(resData.odDetails) || [],
        odLogs: addKeyForList(resData.odLogs) || [],
        spAddress: resData.spAddress || {},
      });
    }
  };

  handgoback = () => {
    this.props.history.goBack();
  };

  render() {
    const { orderInfo, spAddress } = this.state;
    return (
      <PageHeaderWrapper title={() => ''}>
        <Card bordered={false} style={{
          marginBottom: 32,
        }}>
          <Divider
            style={{
              marginBottom: 32,
            }}
          />
          <Descriptions
            title="订单信息"
            style={{
              marginBottom: 32,
            }}
          >
            <Descriptions.Item label="订单号">{orderInfo.orderNo}</Descriptions.Item>
            <Descriptions.Item label="下单时间">{orderInfo.createTime}</Descriptions.Item>
            <Descriptions.Item label="订单状态">{orderInfo.orderStatusStr}</Descriptions.Item>
            <Descriptions.Item label="门店名称">{orderInfo.shopName}</Descriptions.Item>
            <Descriptions.Item label="收货人">{spAddress.recName}</Descriptions.Item>
            <Descriptions.Item label="收货电话">{spAddress.recMobile}</Descriptions.Item>
            <Descriptions.Item label="收货地址">{spAddress.recAddress}</Descriptions.Item>
            <Descriptions.Item label="订单总价">{orderInfo.orderAmount}</Descriptions.Item>
            <Descriptions.Item label="发货时间">{orderInfo.createTime}</Descriptions.Item>
            <Descriptions.Item label="快递单号">{orderInfo.orderExpressNo}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          bordered={false}
          title="订单商品"
          style={{
            marginBottom: 32,
          }}>

          <EditableTable
            bordered
            dataSource={this.state.odDetails}
            columns={this.odColumns}
            pagination={false}
          />
        </Card>
        <Card title="订单商品" bordered={false}>
          <EditableTable
            dataSource={this.state.odLogs}
            columns={this.logColumns}
            pagination={false}
            bordered
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
