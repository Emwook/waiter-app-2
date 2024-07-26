import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { fetchAllExistingUsers, getAllUsers, signIn, User } from "../../../store/reducers/userReducer";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllExistingUsers() as any);
  }, [dispatch]);

  const allUsers = useSelector(getAllUsers);
  const [username, setUsername] = useState(allUsers[0]?.name);
  const [displayedPassword, setDisplayedPassword] = useState('');

  // const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //e.preventDefault();
    const newCurrentUser: User = {
      name: username,
      password: allUsers.find((user:User) => user.name === username).password,
    }
    dispatch(signIn(newCurrentUser) as any);
    console.log('logging as :', newCurrentUser)
};
  return (
    <Row className="d-flex mt-5">
      <Col xs={4} className="mx-auto border border-dark px-3 py-5 rounded">
      <Form onSubmit={handleSubmit}>
      <Form.Label className="h4">To continue choose a profile</Form.Label>
      <Form.Label className="text-secondary">all passwords are set to '1234'</Form.Label>
            <Form.Select 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="my-3 w-75"
          >
          {allUsers?.map((user: User) => (
            <option key={user.name} value={user.name}>
                {user.name}
            </option>
        ))}
        </Form.Select>
        <Form.Control 
            type="password"
            value={displayedPassword}
            onChange={(e) => setDisplayedPassword(e.target.value)}
            placeholder="Password"
            className="my-3 w-75"
          />
          <Button type="submit" className="mt-2">Log in</Button>
      </Form>
      </Col>
    </Row>
  );
};

export default Login;
