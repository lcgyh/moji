import { Icon, Tooltip, Dropdown, Menu } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';

const menuClick = value => {
  const itemKey = value.key;
  if (itemKey == '1') {
    window.open('https://brands.blueboxkids.com/pdf/Blue_Box_Wholesale_System_Manual.pdf');
  }
  if (itemKey == '2') {
    window.open('https://youtu.be/Wgshsa9FWWQ');
  }
};

const menu = (
  <Menu onClick={menuClick}>
    <Menu.Item key="1">
      <a>
        <FormattedMessage id="publickey.Helpmanual" />
      </a>
    </Menu.Item>
    <Menu.Item key="2">
      <a>
        <FormattedMessage id="publickey.Videotutorial" />
      </a>
    </Menu.Item>
  </Menu>
);

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder={formatMessage({
          id: 'component.globalHeader.search',
        })}
        dataSource={[
          formatMessage({
            id: 'component.globalHeader.search.example1',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example2',
          }),
          formatMessage({
            id: 'component.globalHeader.search.example3',
          }),
        ]}
        onSearch={value => {
          console.log('input', value);
        }}
        onPressEnter={value => {
          console.log('enter', value);
        }}
      />
      <Tooltip
        title={formatMessage({
          id: 'component.globalHeader.help',
        })}
      >
        <a
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <Icon type="question-circle-o" />
        </a>
      </Tooltip> */}

      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link">
          <FormattedMessage id="publickey.Guidetouse" />
        </a>
      </Dropdown>
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
