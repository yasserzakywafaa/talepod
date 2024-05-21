import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuthContext } from "./domain/Provider";

const GoogleAuth = () => {
  const {
    manager: { handleIsFetching, handleOnLoginSuccess, handleOnLoginError },
  } = useGoogleAuthContext();

  const handleClickListener = () => handleIsFetching(true);

  return (
    <GoogleLogin
      size="large"
      logo_alignment="left"
      onError={handleOnLoginError}
      onSuccess={handleOnLoginSuccess}
      click_listener={handleClickListener}
    />
  );
};

export default GoogleAuth;
