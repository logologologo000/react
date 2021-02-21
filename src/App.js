import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./screen/auth/login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Master from "./layouts/Master";
import AdminMaster from "./layouts/AdminMaster";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminMaster} />
          <Route exact path="/" component={Master} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;