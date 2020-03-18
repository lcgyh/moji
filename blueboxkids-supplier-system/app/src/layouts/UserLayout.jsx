import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import logo_title from '../assets/logo_title.png';
import styles from './UserLayout.less';
import bg from '../assets/bg.png';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.bg_l}>
          <div className={styles.bg_l_item}>欢迎来到</div>
          <div className={styles.bg_l_item}>Blue Box Wholesale</div>
        </div>
        <div className={styles.bg_r}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo_title} />
                  {/* <span className={styles.title}>Blue Box Wholesale</span> */}
                </Link>
              </div>
              {/* <div className={styles.desc}>B2B system</div> */}
            </div>
            {children}
          </div>
        </div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
