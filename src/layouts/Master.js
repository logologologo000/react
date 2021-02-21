import { Route, Switch } from "react-router-dom";
import Home from "../screen/home";
import { Container } from "reactstrap";

const Master = (props) => {
  return (
    <div>
      <Container>
        <Switch>
          <Route path="/" render={(props) => <Home {...props} />} />
        </Switch>
      </Container>
    </div>
  );
};

export default Master;