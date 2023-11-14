import { SignUpRequestData, SignUpRequestReturn } from "./LoginSignupMenu";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { LockOutlined } from "@mui/icons-material";
import * as yup from "yup";

interface SignUpFormProps {
  onSubmit: (data: SignUpRequestData) => Promise<SignUpRequestReturn>;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export const SignUpForm = (props: SignUpFormProps) => {
  const onSubmit = (data: any) => {
    console.log(data);
    props.onSubmit(data);
  };
  const formik = useFormik({
          initialValues:{
            userName: "",
            email: "",
            password: "",
          },
          validationSchema, onSubmit });
  return (
    <Box
      sx={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      <Box component="form" sx={{ my: 3, mx: 3 }}>
            <TextField
                fullWidth
                margin="normal"
                id="userName"
                name="userName"
                label="User Name"
                type="text"
                required
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.userName && Boolean(formik.errors.userName)}
                helperText={formik.touched.userName && formik.errors.userName}
                autoFocus
            />
            <TextField
                fullWidth
                margin="normal"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
                fullWidth
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type="password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <Button variant="contained" type="submit">
                Submit
            </Button>
      </Box>
    </Box>
  );
};

//<Field name="userName" />
//{errors.userName && touched.userName ? ( <div>{errors.userName}</div>) : null}
//<Field name="email" type="email" />
//{errors.email && touched.email ? <div>{errors.email}</div> : null}
//<Field name="password" type="password" />
//{errors.password && touched.password ? ( <div>{errors.password}</div>) : null}
