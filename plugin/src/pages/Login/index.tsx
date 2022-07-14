import * as React from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "components/commons";
import { Marginer } from "components/marginer";
import { AccountContext } from "utils/hooks/AccountContext";
import { useMutation } from "react-query";
import { postLoginApi } from "./api";

const Login = (props: any) => {
  const { switchToSignup } = React.useContext(AccountContext);
  const loginMutation = useMutation(postLoginApi, {
    onSuccess: (data: any) => {
      const { token } = data;
      localStorage.setItem("authKey", token);
      // chrome.runtime.sendMessage({ type: "TOKEN", token: token });
      props.onLoginSuccess();
    },
    onError: (error: any) => {

    }
  })
  const [values, setValues] = React.useState({
    username: "",
    password: ""
  })

  const handleLoginClick = () => {
    loginMutation.mutate(values);
  }

  const onValueChange = (e: any) => {
    setValues(values => ({
      ...values,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <BoxContainer>
      <FormContainer>
        <Input type="email" placeholder="Email" name="username" onChange={onValueChange}/>
        <Input type="password" placeholder="Password" name="password" onChange={onValueChange}/>
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <MutedLink href="#">Forget your password?</MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton onClick={handleLoginClick} type="submit">Signin</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Don't have an accoun?{" "}
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}

export default Login;