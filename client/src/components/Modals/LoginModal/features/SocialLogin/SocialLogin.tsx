import { AuthType } from "src/shared/types/types";
import GoogleAuth from "src/components/shared/SocialLogins/GoogleAuth/GoogleAuth";
import PhoneAuth from "src/components/shared/SocialLogins/PhoneAuth";

interface SocialLoginProps {
  authType?: AuthType;
}

const SocialLogin = (props: SocialLoginProps): JSX.Element => {
  const authType = props.authType || "login";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <GoogleAuth authType={authType} />
      <PhoneAuth authType={authType} />
    </div>
  );
};

export default SocialLogin;
