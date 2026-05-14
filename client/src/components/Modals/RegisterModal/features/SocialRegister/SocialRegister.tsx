import { AuthType } from "src/shared/types/types";
import GoogleAuth from "src/components/shared/SocialLogins/GoogleAuth/GoogleAuth";
import PhoneAuth from "src/components/shared/SocialLogins/PhoneAuth";

interface SocialRegisterProps {
  authType?: AuthType;
}

const SocialRegister = (props: SocialRegisterProps): JSX.Element => {
  const authType = props.authType || "register";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <GoogleAuth authType={authType} />
      <PhoneAuth authType="register" />
    </div>
  );
};

export default SocialRegister;
