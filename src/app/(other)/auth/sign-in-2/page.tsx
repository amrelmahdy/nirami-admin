import { Button, Card, CardBody, Col, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

import LogoBox from '@/components/LogoBox'
import PageMetaData from '@/components/PageTitle'
import ThirdPartyAuth from '@/components/ThirdPartyAuth'
import LoginForm from './components/LoginForm'
import Feedback from 'react-bootstrap/esm/Feedback'
import { useState } from 'react'
import { login } from './auth.api'

const SignIn2 = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleOnLogin = async () => {
    console.log('Username:', username);
    console.log('Password:', password);

    await login(username, password)
      .then(async (res) => {
        const accessToken = res.accessToken;
        const refreshToken = res.refreshToken;
        const expiresIn = res.expiresIn;
        const expiresAt = res.expiresAt;
        await localStorage.setItem('access-token', accessToken);
        await localStorage.setItem('refresh-token', refreshToken);
        await localStorage.setItem('expires-in', expiresIn);
        await localStorage.setItem('expires-at', expiresAt);

        navigate('/', { replace: true });

      })
      .catch((error) => {
        console.error('Login failed:', error);
        // Handle login failure, e.g., show an error message
      });
    // Here you would typically handle the login logic, such as calling an API
    // For demonstration, we'll just log the values to the console
    // You can also add validation and error handling as needed
  };

  return (
    <>
      <PageMetaData title="Sign In" />

      <Col xl={5} className="mx-auto">
        <Card className="auth-card">
          <CardBody className="px-3 py-5">
            <LogoBox
              textLogo={{
                height: 24,
                width: 110,
              }}
              squareLogo={{ className: 'me-2', width: 33, height: 28 }}
              containerClassName="mx-auto mb-4 text-center auth-logo"
            />
            <h2 className="fw-bold text-center fs-18">تسجيل الدخول</h2>
            <p className="text-muted text-center mt-1 mb-4">الدخول الي لوحة التحكم</p>
            <div className="px-4">
              <FormGroup className="col-md-12">
                <FormLabel>الإسم بالإنجليزية</FormLabel>
                <FormControl type="text" id="validationCustom02" name='enName' placeholder="الإسم بالإنجليزية" defaultValue="" required onChange={(e) => setUsername(e.target.value)} />
                <Feedback>صحيح</Feedback>
                <Feedback type="invalid">
                  برجاء ادخال الاسم باللغة الإنجليزية
                </Feedback>
              </FormGroup>

              <FormGroup className="col-md-12">
                <FormLabel>الإسم بالإنجليزية</FormLabel>
                <FormControl type="password" id="validationCustom02" name='enName' placeholder="الإسم بالإنجليزية" defaultValue="" required onChange={(e) => setPassword(e.target.value)} />
                <Feedback>صحيح</Feedback>
                <Feedback type="invalid">
                  برجاء ادخال الاسم باللغة الإنجليزية
                </Feedback>
              </FormGroup>
              <div className="mb-3" />
              <div className="mb-1 text-center d-grid">
                <Button variant="primary" type="submit" onClick={handleOnLogin} disabled={false}>
                  تسجيل الدخول
                </Button>
              </div>
              {/* <LoginForm /> */}
              {/* <ThirdPartyAuth /> */}
            </div>
          </CardBody>
        </Card>
        {/* <p className="mb-0 text-center">
          New here?
          <Link to="/auth/sign-up-2" className="fw-bold ms-1">
            Sign Up
          </Link>
        </p> */}
      </Col>
    </>
  )
}

export default SignIn2
