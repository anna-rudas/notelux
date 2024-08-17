import * as Yup from "yup";

export const signUpSchema = Yup.object({
  username: Yup.string()
    .max(17, "Username is too long")
    .min(1, "Username is too short")
    .required("This field is required"),
  email: Yup.string()
    .email("Not a valid email address")
    .required("This field is required"),
  password: Yup.string()
    .min(6, "Password is too short")
    .required("This field is required"),
});

export const signInSchema = Yup.object({
  email: Yup.string()
    .email("Not a valid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
});

export const settingsSchema = Yup.object({
  username: Yup.string()
    .max(17, "Username is too long")
    .min(1, "Username is too short")
    .required("This field is required"),
});

export const resetPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Not a valid email address")
    .required("This field is required"),
});

export const changePasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password is too short")
    .required("This field is required"),
  oldPassword: Yup.string().required("This field is required"),
});

export const changeEmailSchema = Yup.object({
  newEmail: Yup.string()
    .email("Not a valid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
});

export const deleteUserSchema = Yup.object({
  password: Yup.string().required("This field is required"),
});

export const deleteNoteSchema = Yup.object({});

export const shareNoteSchema = Yup.object({
  newUserEmail: Yup.string()
    .email("Not a valid email address")
    .required("This field is required"),
});
