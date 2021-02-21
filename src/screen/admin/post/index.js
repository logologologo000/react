import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";
import "bootstrap/js/dist/tooltip";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/dropdown";
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

const Post = (props) => {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState({
    id: "",
    title: "",
    thumbnail: "",
    category_id: "",
    description: "",
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
    fetchPost();
    fetchCategory();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${config.server}/post`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPosts(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        history.push("/login");
      }
      console.log();
    }
  };

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

  const handleFileChange = (e) => {
    e.preventDefault();
    setInput({ ...input, thumbnail: e.target.files[0] });
  };

  const handleSummernoteChange = (content) => {
    setInput({ ...input, description: content });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formdata = new FormData();
      formdata.append("id", input.id);
      formdata.append("thumbnail", input.thumbnail);
      formdata.append("title", input.title);
      formdata.append("description", input.description);
      formdata.append("category_id", input.category_id);
      const response = await axios.post(
        !isEdit
          ? `${config.server}/post/store`
          : `${config.server}/post/update/${input.id}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-type": "multipart/form-data",
          },
        }
      );
      fetchPost();
      Swal.fire(
        isEdit ? `Updated!` : `Added!`,
        isEdit
          ? `Post was updated successfully`
          : `Post was added successfully.`,
        "success"
      );
      setIsEdit(false);
      setIsOpen(false);
      setInput({
        ...input,
        id: "",
        title: "",
        thumbnail: "",
        category_id: "",
        description: "",
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
          `${config.server}/post/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status == 200) {
          fetchPost();
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
          รายการข่าว
          <span className="float-right">
            <Button color="primary" size="sm" onClick={toggle}>
              + เพิ่มข่าว
            </Button>
          </span>
        </CardHeader>
        <CardBody>
          {isOpen ? (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>หัวข้อข่าว : </Label>
                <Input
                  name="title"
                  value={input.title}
                  placeholder="หัวข้อข่าว"
                  required={true}
                  onChange={handleChangeInput}
                />
              </FormGroup>
              <FormGroup>
                <Label>หมวดหมู่ข่าว : </Label>
                <Input
                  type="select"
                  name="category_id"
                  required={true}
                  value={input.category_id}
                  placeholder="หมวดหมู่ข่าว"
                  onChange={handleChangeInput}
                >
                  <option>==โปรดเลือกหมวดหมู่ข่าว==</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label>รูปประจำข่าว : </Label>
                <Input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleText">รายละเอียด</Label>
                <ReactSummernote
                  options={{
                    height: 350,
                    dialogsInBody: true,
                    toolbar: [
                      ["style", ["style"]],
                      ["font", ["bold", "underline", "clear"]],
                      ["fontname", ["fontname"]],
                      ["para", ["ul", "ol", "paragraph"]],
                      ["table", ["table"]],
                      ["insert", ["link", "picture", "video"]],
                      ["view", ["fullscreen", "codeview"]],
                    ],
                  }}
                  value={input.description}
                  onChange={handleSummernoteChange}
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
                  <th>รูปประจำข่าว</th>
                  <th>หัวข้อข่าว</th>
                  <th>หมวดหมู่ข่าว</th>
                  <th>ผู้เขียน</th>
                  <th className="text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={`${config.serverRoot}/${post.thumbnail}`}
                        width="64"
                        alt={post.name}
                      />
                    </td>
                    <td>{post.title}</td>
                    <td>{post.category.name}</td>
                    <td>{post.user.name}</td>
                    <td className="text-right">
                      <Button
                        color="warning"
                        size="sm"
                        onClick={() => {
                          setIsEdit(true);
                          setIsOpen(true);
                          setInput({
                            ...input,
                            id: post.id,
                            title: post.title,
                            category_id: post.category_id,
                            description: post.description,
                          });
                        }}
                      >
                        แก้ไข
                      </Button>{" "}
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() =>{ handleDelete(post.id)}}
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
export default Post;