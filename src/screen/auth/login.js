import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,



  Label,
  Row
} from "reactstrap";
import config from "../../config";

const Login = (prop) => {
  const history = useHistory();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    message: "",
    errors: [],
  });

  const checkLogin = () => {
    if (localStorage.getItem("token") !== null) {
      history.push("/admin");
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const submitLogin = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      await axios.get(`${config.serverRoot}/sanctum/csrf-cookie`);
      const response = await axios.post(`${config.server}/login`, {
        email: input.email,
        password: input.password,
      });
      localStorage.setItem("token", response.data);
      setLoading(false);
      history.push("/admin");
    } catch (err) {
      setLoading(false);
      setError({
        ...error,
        message: err.response?.data?.message,
        errors: err.response?.data?.errors,
      });
      console.log(err);
    }
  };

  const handleChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 2 }}>
            <Card>
              <CardBody>
                <h1>โปรดกรอกข้อมูลให้ครบถ้วน</h1>
                {error.message ? (
                  <Alert color="danger">{error.message}</Alert>
                ) : null}
                <Form onSubmit={submitLogin}>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      value={input.email}
                      type="email"
                      name="email"
                      onChange={handleChangeInput}
                      placeholder="with a placeholder"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input
                      value={input.password}
                      type="password"
                      name="password"
                      onChange={handleChangeInput}
                      placeholder="password placeholder"
                    />
                  </FormGroup>
                  <Button color="primary" disabled={loading}>
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;