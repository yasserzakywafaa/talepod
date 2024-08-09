import { AuthType } from "src/shared/types";
import GoogleAuth from "src/components/shared/SocialLogins/GoogleAuth/GoogleAuth";

interface SocialRegisterProps {
  authType?: AuthType;
}

const SocialRegister = (props: SocialRegisterProps): JSX.Element => {
  return (
    <>
      <GoogleAuth authType={props.authType || "register"} />
    </>
  );
};

export default SocialRegister;
