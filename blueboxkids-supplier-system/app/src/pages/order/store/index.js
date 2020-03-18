import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchCard from './components/search';
import TableCard from './components/table';

function EmployList() {
  return (
    <PageHeaderWrapper title={() => ''}>
      <SearchCard />
      <TableCard />
    </PageHeaderWrapper>
  );
}

export default EmployList;
