import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Label,
  Table,
} from "reactstrap";
import Swal from "sweetalert2";
import config from "../../../config";

const User = (props) => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState({
    message: "",
    errors: [],
  });

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${config.server}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        history.push("/login");
      }
      console.log();
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        !isEdit
          ? `${config.server}/user/store`
          : `${config.server}/user/update/${input.id}`,
        { ...input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUser();
      Swal.fire(
        isEdit ? `Updated!` : `Added!`,
        isEdit
          ? `User was updated successfully`
          : `User was added successfully.`,
        "success"
      );
      setIsEdit(false);
      setIsOpen(false);
      setInput({
        ...input,
        id: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          `${config.server}/user/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          fetchUser();
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      }
    });
  };

  const handleChangeInput = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          รายการผู้ใช้งาน
          <span className="float-right">
            <Button color="primary" size="sm" onClick={toggle}>
              + เพิ่มผู้ใช้งาน
            </Button>
          </span>
        </CardHeader>
        <CardBody>
          {isOpen ? (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>ชื่อ-สกุล : </Label>
                <Input
                  name="name"
                  value={input.name}
                  placeholder="กรอกชื่อ-สกุล"
                  required={true}
                  onChange={handleChangeInput}
                />
              </FormGroup>
              <FormGroup>
                <Label>อีเมล์ : </Label>
                <Input
                  type="email"
                  name="email"
                  required={true}
                  value={input.email}
                  placeholder="อีเมล์"
                  onChange={handleChangeInput}
                />
              </FormGroup>
              <FormGroup>
                <Label>รหัสผ่าน : </Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  placeholder="รหัสผ่าน"
                  onChange={handleChangeInput}
                />
              </FormGroup>
              <FormGroup>
                <Label>รหัสผ่าน : </Label>
                <Input
                  type="password"
                  name="password_confirmation"
                  value={input.password_confirmation}
                  placeholder="รหัสผ่านอีกครั้ง"
                  onChange={handleChangeInput}
                />
              </FormGroup>
              <Button color="primary" type="submit">
                บันทึก
              </Button>
            </Form>
          ) : (
            <Table striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อ-สกุล</th>
                  <th>อีเมล์</th>
                  <th className="text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="text-right">
                      <Button
                        color="warning"
                        size="sm"
                        onClick={() => {
                          setIsEdit(true);
                          setIsOpen(true);
                          setInput({
                            ...input,
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            password: "",
                            password_confirmation: "",
                          });
                        }}
                      >
                        แก้ไข
                      </Button>{" "}
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
export default User;
