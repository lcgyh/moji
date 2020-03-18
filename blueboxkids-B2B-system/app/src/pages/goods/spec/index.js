import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableCard from './components/table';

function EmployList() {
  return (
    <PageHeaderWrapper title={() => ''}>
      <TableCard />
    </PageHeaderWrapper>
  );
}

export default EmployList;
