import { Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { UserName, Password, Submit } = LoginComponents;

@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values },
      });
    }
  };

  render() {
    const { submitting } = this.props;
    const { autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="account"
            placeholder={`${formatMessage({
              id: 'publickey.input',
            })}`}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'publickey.input',
                }),
              },
            ]}
          />
          <Password
            name="passWord"
            placeholder={`${formatMessage({
              id: 'publickey.input',
            })}`}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'publickey.input',
                }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />

          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
