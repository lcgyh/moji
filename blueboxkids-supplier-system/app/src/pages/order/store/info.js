import { Card, Descriptions, Divider, Button, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { getStoreOrderInfo } from '../../../services/order';
import EditableTable from '../../../components/StandardTable';
import { addKeyForList } from '@/utils/utils';

class Infocon extends Component {
  state = {
    orderInfo: {},
    odDetails: [],
  };

  odColumns = [
    {
      title: <FormattedMessage id="publickey.goodsName" />,
      dataIndex: 'spuName',
    },
    {
      title: <FormattedMessage id="publickey.goodsSpec" />,
      dataIndex: 'specs',
    },
    {
      title: <FormattedMessage id="publickey.barCode" />,
      dataIndex: 'barcode',
    },
    {
      title: <FormattedMessage id="publickey.bookNum" />,
      dataIndex: 'qty',
    },
    {
      title: <FormattedMessage id="publickey.retailPrice" />,
      dataIndex: 'price',
    },
    {
      title: <FormattedMessage id="publickey.discountPrice" />,
      dataIndex: 'disprice',
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
      const resData = result.data || {};
      this.setState({
        orderInfo: resData,
        odDetails: addKeyForList(resData.odDetails) || [],
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
        <Card
          bordered={false}
          style={{
            marginBottom: 32,
          }}
        >
          <Divider
            style={{
              marginBottom: 32,
            }}
          />
          <Descriptions
            title={<FormattedMessage id="publickey.orderInfo" />}
            style={{
              marginBottom: 32,
            }}
          >
            <Descriptions.Item label={<FormattedMessage id="publickey.orderNumber" />}>
              {orderInfo.orderNo}
            </Descriptions.Item>
            <Descriptions.Item label={<FormattedMessage id="publickey.orderTime" />}>
              {orderInfo.createTime}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card
          bordered={false}
          title={<FormattedMessage id="publickey.orderGoods" />}
          style={{
            marginBottom: 32,
          }}
        >
          <EditableTable
            bordered
            dataSource={this.state.odDetails}
            columns={this.odColumns}
            pagination={false}
          />
        </Card>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Button onClick={() => this.handgoback()} type="primary">
            <FormattedMessage id="publickey.back" />
          </Button>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Infocon;
