import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import React from "react";
import { ThemeProvider } from '@mui/system';
import theme from "./theme";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
    endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
            <BrowserRouter>
                <div className="App">
                    <Switch>
                        <Route exact path="/">
                            <Products />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/products">
                            <Products />
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
            </ThemeProvider>
        </React.StrictMode>
    );
}

export default App;
