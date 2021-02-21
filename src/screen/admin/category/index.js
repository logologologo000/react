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

const Category = (props) => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState({
    id: "",
    name: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${config.server}/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCategories(response.data);
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
          ? `${config.server}/category/store`
          : `${config.server}/category/update/${input.id}`,
        { ...input },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCategory();
      Swal.fire(
        isEdit ? `Updated!` : `Added!`,
        isEdit
          ? `Category was updated successfully`
          : `Category was added successfully.`,
        "success"
      );
      setIsEdit(false);
      setIsOpen(false);
      setInput({
        ...input,
        id: "",
        name: "",
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
          `${config.server}/category/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          fetchCategory();
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
          รายการหมวดหมู่
          <span className="float-right">
            <Button color="primary" size="sm" onClick={toggle}>
              + เพิ่มหมวดหมู่
            </Button>
          </span>
        </CardHeader>
        <CardBody>
          {isOpen ? (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>ชื่อหมวดหมู่ : </Label>
                <Input
                  name="name"
                  value={input.name}
                  placeholder="ชื่อหมวดหมู่"
                  required={true}
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
                  <th>ชื่อหมวดหมู่</th>
                  <th className="text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td className="text-right">
                      <Button
                        color="warning"
                        size="sm"
                        onClick={() => {
                          setIsEdit(true);
                          setIsOpen(true);
                          setInput({
                            ...input,
                            id: category.id,
                            name: category.name,
                          });
                        }}
                      >
                        แก้ไข
                      </Button>{" "}
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
export default Category;