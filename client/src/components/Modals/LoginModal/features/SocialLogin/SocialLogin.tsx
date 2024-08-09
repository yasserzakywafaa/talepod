import { AuthType } from "src/shared/types";
import GoogleAuth from "src/components/shared/SocialLogins/GoogleAuth/GoogleAuth";

interface SocialLoginProps {
  authType?: AuthType;
}

const SocialLogin = (props: SocialLoginProps): JSX.Element => {
  return (
    <>
      <GoogleAuth authType={props.authType || "login"} />
    </>
  );
};

export default SocialLogin;
