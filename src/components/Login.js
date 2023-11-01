import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleInput = (e) => {
        const [key, value] = [e.target.name, e.target.value];
        setFormData((nextFormData) => ({ ...nextFormData, [key]: value }));
    };
    const login = async (formData) => {
        // console.log("hello login")
        if (!validateInput(formData)) return;
        setLoading(true);
        try {
            console.log(formData,'=====')
            formData["email"] = formData["username"]
            delete formData["username"]
            const response = await axios.post(
                `${config.endpoint}/auth/login`,
                formData
            );
            console.log(response,"=====response")
            
            persistLogin(
                response.data.token,
                response.data.username,
                response.data.balance
            );

            setFormData({
                username: "",
                password: "",
            });
            setLoading(false);

            enqueueSnackbar("Logged in successfully", { variant: "success" });
            history.push("/");
        } catch (err) {
            setLoading(false);

            if (err.response && err.response.status === 400) {
                // console.log(err.response.data.message)
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                });
            } else {
                enqueueSnackbar(
                    "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
                    { varient: "error" }
                );
            }
        }
    };


    const validateInput = (data) => {
        if (!data.username) {
            enqueueSnackbar("Username is a required field", {
                variant: "warning",
            });
            return false;
        }
        if (!data.password) {
            enqueueSnackbar("Password is a required field", {
                varient: "warning",
            });
            return false;
        }
        return true;
    };
    const persistLogin = (token, username, balance) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("balance", balance);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            minHeight="100vh"
        >
            <Header hasHiddenAuthButtons />
            <Box className="content">
                <Stack spacing={2} className="form">
                    <h2 className="title">Login</h2>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        title="Username"
                        name="username"
                        placeholder="Enter Username"
                        fullWidth
                        value={formData.username}
                        onChange={handleInput}
                    />
                    <TextField
                        id="password"
                        variant="outlined"
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        placeholder="Enter a password"
                        value={formData.password}
                        onChange={handleInput}
                    />
                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <CircularProgress size={25} color="primary" />
                        </Box>
                    ) : (
                        <Button
                            className="button"
                            variant="contained"
                            onClick={() => login(formData)}
                        >
                            LOGIN TO QKART
                        </Button>
                    )}
                    <p className="secondary-action">
                        Don't have an account?{" "}
                        {/* <Link to="/#">Register Now</Link> */}
                        <a className="link" href="/register">
                            Register Now
                        </a>
                    </p>
                </Stack>
            </Box>
            <Footer />
        </Box>
    );
};

export default Login;
