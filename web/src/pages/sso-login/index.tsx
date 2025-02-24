import { useLogin } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'umi';
import styles from './index.less';

const SSOLogin = () => {
  const navigate = useNavigate();
  const { login } = useLogin();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const email = searchParams.get('email');
        const password = searchParams.get('password');

        if (!email || !password) {
          setStatus('error');
          setErrorMessage('Missing email or password in URL parameters');
          return;
        }

        const rsaPassWord = rsaPsw(password) as string;

        const code = await login({
          email: email.trim(),
          password: rsaPassWord,
        });

        if (code === 0) {
          setStatus('success');
          navigate('/knowledge');
        } else {
          setStatus('error');
          setErrorMessage('Login failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An error occurred during login.');
        console.error('SSO Login failed:', error);
      }
    };

    autoLogin();
  }, []);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className={styles.ssoLoginContainer}>
      <div className={styles.loginBox}>
        {status === 'loading' && (
          <>
            <Spin indicator={antIcon} />
            <div className={styles.loadingText}>Logging in...</div>
          </>
        )}
        {status === 'error' && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default SSOLogin;
