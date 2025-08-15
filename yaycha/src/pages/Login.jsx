import { Alert, Box, Button, TextField, Typography } from "@mui/material";

import { useRef, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemeApp";
import { postLogin } from "../libs/fetcher";

export default function Login() {
    const [ error, setError ] = useState(null);
    const usernameInput = useRef();
    const passwordInput = useRef();
    const navigate = useNavigate();
    const { setAuth } = useApp();

    const handleSubmit = () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        if (!username || !password) {
            setError("username and password required");
            return false;
        }
        login.mutate({ username, password });
    };

    const login = useMutation(
        async ({ username, password }) => postLogin ({ username, password}), {
            onError: async () => {
                setError("Incorrect username or password");
            },
            onSuccess: async (result) => {
                setAuth(result.user);
                localStorage.setItem("token", result.token);
                navigate("/");
            },
        }
    );

    return (
        <Box>
            <Typography variant="h3">Login</Typography>

            {error && (<Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>)}

            <Alert severity="warning" sx={{ mt: 2 }}>All fields required</Alert>

            <form onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}>
                <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: 2,
                }}>
                    <TextField 
                        inputRef={usernameInput}
                        placeholder="Username" 
                        fullWidth />
                    <TextField 
                        type="password" 
                        inputRef={passwordInput}
                        placeholder="Password" 
                        fullWidth/>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth>
                            Login
                    </Button>
                </Box>
            </form>
        </Box>
    );
}