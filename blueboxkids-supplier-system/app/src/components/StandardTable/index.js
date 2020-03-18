import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class EditableTable extends React.Component {
  onChange = (page, filters, sorter) => {
    this.props.pageSizeChange(page.pageSize, page.current, sorter);
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.selectChange(selectedRowKeys, selectedRows);
  };

  cleanSelectedKeys = () => {
    this.props.cleanSelectedKeys();
  };

  renderSelect = () => (
    <Alert
      message={
        <Fragment>
          已选择{' '}
          <a
            style={{
              fontWeight: 600,
            }}
          >
            {this.props.selectedRowKeys.length}
          </a>{' '}
          项&nbsp;&nbsp;
          <a
            onClick={this.cleanSelectedKeys}
            style={{
              marginLeft: 24,
            }}
          >
            清空
          </a>
        </Fragment>
      }
      type="info"
      showIcon
    />
  );

  render() {
    const rowSelection = {
      selectedRowKeys: this.props.selectedRowKeys ? this.props.selectedRowKeys : [],
      onChange: this.onSelectChange,
      type: this.props.selectType, // radio//checkbox
    };

    return (
      <div className={styles.standardTable}>
        {this.props.select ? this.renderSelect() : null}
        <Table
          {...this.props}
          onChange={this.onChange.bind(this)}
          rowSelection={this.props.select ? rowSelection : null}
          pagination={
            this.props.pagination
              ? {
                  showSizeChanger: true,
                  total: this.props.total,
                  pageSize: this.props.pageSize,
                  current: this.props.current,
                }
              : false
          }
        />
      </div>
    );
  }
}

export default EditableTable;
