import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Button, Card, message } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import EditableTable from '../../../../components/StandardTable';
import CollectionsPage from './modal';
import { sendOrder } from '../../../../services/order';

@connect(({ storeOrder, loading }) => ({
  storeOrder,
  list: storeOrder.list || [],
  total: storeOrder.total || 0,
  pageSize: storeOrder.pageSize || 10,
  current: storeOrder.current || 1,
  searchValue: storeOrder.searchValue || {},
  selectedRowKeys: storeOrder.selectedRowKeys || [],
  selectedRows: storeOrder.selectedRows || [],
  loading: loading.models.storeOrder,
}))
class TableCard extends Component {
  state = {
    // selectedRowKeys: [],
    selectedRows: [],
  };

  columns = [
    {
      title: <FormattedMessage id="publickey.orderNumber" />,
      dataIndex: 'orderNo',
      render: (text, record) => <a onClick={() => this.hindInfo(record)}>{text}</a>,
    },
    {
      title: <FormattedMessage id="publickey.storeName" />,
      dataIndex: 'shopName',
    },
    {
      title: <FormattedMessage id="publickey.brand" />,
      dataIndex: 'brandName',
    },
    {
      title: <FormattedMessage id="publickey.orderAmount" />,
      dataIndex: 'orderAmount',
    },
    {
      title: <FormattedMessage id="publickey.orderTime" />,
      dataIndex: 'createTime',
    },
  ];

  // 跳转用户详情
  hindInfo = record => {
    router.push({
      pathname: `/order/store/${record.orderId}`,
    });
  };

  // 分页
  handleStandardTableChange = (pageSize, current) => {
    const { searchValue } = this.props;
    searchValue.pageSize = pageSize;
    searchValue.current = current;
    this.props.dispatch({
      type: 'storeOrder/fetch',
      payload: searchValue,
    });
  };

  // 判断数组中是否存在不是待发货的订单
  isWillSend = () => {
    const { selectedRowKeys, selectedRows } = this.props;
    if (selectedRowKeys.length > 0) {
      // 出弹窗，输入快递单号，发货
      for (let i = 0; i < selectedRows.length; i++) {
        if (selectedRows[i].orderStatus != '20') {
          return false;
        }
        // if (selectedRows[i].orderStatusStr != '待发货') {
        //   return false;
        // }
      }
      return true;
    }
  };

  // 发货
  sendOrder = () => {
    const { selectedRowKeys } = this.props;
    if (selectedRowKeys.length > 0) {
      const isWillSend = this.isWillSend();
      if (isWillSend) {
        // 出弹窗，输入快递单号，发货
        // const { showModal } = this.formRef;
        // showModal();
        const data = {
          opType: '1',
          orderId: selectedRowKeys,
        }
        this.handleCreate(data)
      } else {
        message.error('只有待发货订单可以发货');
      }
    } else {
      message.error('请选择发货订单');
    }
  };

  // addSendOrder
  addSendOrder = () => {
    const { selectedRowKeys, selectedRows } = this.props;
    const { showModal } = this.formRef;
    if (selectedRowKeys.length > 1) {
      message.error('一次只能操作一个订单');
      return
    }
    if (selectedRowKeys.length < 1) {
      message.error('请选择操作订单');
      return
    }

    const selectRow = selectedRows[0];
    if (selectRow.orderStatus != '30') {
      message.error('请选择操作已发货订单');
      return
    }
    // 出弹窗，输入快递单号，发货
    showModal();
  };

  // 清除选中
  cleanSelectedKeys = () => {
    const selectedRowKeys = []
    const selectedRows = []
    this.props.dispatch({
      type: 'storeOrder/onSelect',
      payload: { selectedRowKeys, selectedRows },
    });
  };

  // 多选change
  selectChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({
      type: 'storeOrder/onSelect',
      payload: { selectedRowKeys, selectedRows },
    });
  };

  // render table and form 之间的操作项
  renderOpera = () => (
    <div className="tableList">
      <div className="tableListOperator">
        <Button type="primary" onClick={() => this.sendOrder()}>
          发货
        </Button>
        <Button type="primary" onClick={() => this.addSendOrder()}>
          补充快递单
        </Button>
      </div>
    </div>
  );

  saveModelRef = formRef => {
    this.formRef = formRef;
  };

  handleCreate = async value => {
    const resData = await sendOrder(value);
    if (resData.code == '0') {
      if (value.opType == '1') {
        message.success('发货成功')
      }
      if (value.opType == '2') {
        message.success('补发成功')
        this.formRef.handleCancel();
      }
      this.handleStandardTableChange(10, 1)
    }
  };

  render() {
    return (
      <Card style={{ marginTop: '10px' }}>
        {/* {this.renderOpera()} */}
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
          // select
          // cleanSelectedKeys={this.cleanSelectedKeys}
          // selectedRowKeys={this.props.selectedRowKeys}
          // selectChange={this.selectChange}
        />
        <CollectionsPage
          ref={this.saveModelRef}
          handleCreate={this.handleCreate}
          selectedRowKeys={this.props.selectedRowKeys}
        />
      </Card>
    );
  }
}

export default TableCard;
