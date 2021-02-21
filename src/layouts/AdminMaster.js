import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import {
  Jumbotron,
  Button,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";
import Swal from "sweetalert2";
import config from "../config";
import Category from "../screen/admin/category";
import Post from "../screen/admin/post";
import User from "../screen/admin/user";

const AdminMaster = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [me, setMe] = useState({ id: "", name: "", email: "" });
  const toggle = () => setIsOpen(!isOpen);
  const checkLogin = async () => {
    if (localStorage.getItem("token") == null) {
      history.push("/login");
    }
    const response = await axios.get(`${config.server}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 401) {
      localStorage.clear();
      history.push("/login");
    }
    if (response.status === 200) {
      setMe({ ...me, ...response.data });
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure you want to log out?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          `${config.server}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          localStorage.clear();
          history.push("/login");
        }
      }
    });
  };
  return (
    <div>
      <Container>
        <Jumbotron className="mb-0 bg-gradient">
          <div className="d-flex">
            <div>
              <img src="https://via.placeholder.com/150x150" />
            </div>
            <div className="pl-3">
              <h1 className="display-3">ระบบหลังบ้าน</h1>
              <p>v1.0.0</p>
            </div>
          </div>
        </Jumbotron>
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/admin">ADMIN</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href="/admin/post">ข่าว</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/admin/banner">แบนเนอร์</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/admin/category">หมวดหมู่ข่าว</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/admin/user">ผู้ใช้งาน</NavLink>
                </NavItem>
              </Nav>
              <NavbarText>สวัสดี, {me.name}</NavbarText>
              <Nav>
                <NavItem>
                  <Button
                    onClick={handleLogout}
                    color="text"
                    href="/admin/user"
                  >
                    ออกจากระบบ
                  </Button>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
        <div className="bg-white p-3">
          <Switch>
            <Route
              path="/admin"
              exact
              render={(props) => <Post {...props} />}
            />
            <Route path="/admin/post" render={(props) => <Post {...props} />} />
            <Route path="/admin/user" render={(props) => <User {...props} />} />
            <Route
              path="/admin/category"
              render={(props) => <Category {...props} />}
            />
          </Switch>
        </div>
        &copy; 2021 Mywebsite
      </Container>
    </div>
  );
};
export default AdminMaster;