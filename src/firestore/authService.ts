import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
  signInAnonymously,
  linkWithCredential,
} from "firebase/auth";

const auth = getAuth();

export const signInUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const signInResult = await signInWithEmailAndPassword(auth, email, password);
  return signInResult;
};

export const signInAnonymousUser = async (): Promise<UserCredential> => {
  const signInResult = await signInAnonymously(auth);
  return signInResult;
};

export const reauthenticateUser = async (
  email: string,
  password: string
): Promise<UserCredential | null> => {
  if (auth.currentUser) {
    const credential = EmailAuthProvider.credential(email, password);
    const authResult = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    );
    return authResult;
  }
  return null;
};

export const signUpUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const signUpResult = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return signUpResult;
};

export const upgradeUserAccountToPermanent = async (
  email: string,
  password: string
): Promise<UserCredential | null> => {
  if (auth.currentUser) {
    const credential = EmailAuthProvider.credential(email, password);
    const createAccountResult = await linkWithCredential(
      auth.currentUser,
      credential
    );
    return createAccountResult;
  }
  return null;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const isUserEmailVerified = (signInResult: UserCredential): boolean => {
  return signInResult.user.emailVerified;
};

export const isUserAnonymous = (signInResult: UserCredential): boolean => {
  return signInResult.user.isAnonymous;
};

export const sendVerificationEmail = async () => {
  if (auth.currentUser && process.env.REACT_APP_FIREBASE_REDIRECT_URL) {
    await sendEmailVerification(auth.currentUser, {
      url: process.env.REACT_APP_FIREBASE_REDIRECT_URL,
    });
  }
};

export const resetUserPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const changeUserEmail = async (newEmail: string): Promise<void> => {
  if (auth.currentUser) {
    await updateEmail(auth.currentUser, newEmail);
  }
};

export const changeUserPassword = async (
  newPassword: string
): Promise<void> => {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  }
};

export const deleteUserAccount = async (): Promise<void> => {
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
};
