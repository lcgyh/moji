import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from './components/search';
import TableCard from './components/table';
import TablebyCard from './components/tablebyafter'
import { getInv } from '@/services/goods';


class EmployList extends Component {
  state = {
    brforeList: [],
    afterList: [],
    skuId: null,
  }

  getInvbeforeData = data => {
    this.setState({
      brforeList: data,
      skuId: data[0].skuId,
    })
  }


  // 查询slku修改后数据,
  getInv = data => {
      const afterList = this.state.afterList || []
      this.setState({
        afterList: afterList.concat(data),
      })
  }

  render() {
    return (
      <PageHeaderWrapper title={() => ''}>
        <SearchCard getInvbeforeData={this.getInvbeforeData.bind(this)} />
        <TableCard list={this.state.brforeList} skuId={this.state.skuId} getInv={this.getInv.bind(this)} />
        <TablebyCard list={this.state.afterList} />
      </PageHeaderWrapper>
    )
  }
}


export default EmployList;
