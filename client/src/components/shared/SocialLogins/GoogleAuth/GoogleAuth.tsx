// import { GoogleLogin } from "@react-oauth/google";
// import { useApplicationContext } from "src/application/store/Provider";
// import { useGoogleAuthContext } from "./store/Provider";

const GoogleAuth = () => {
  // const {
  //   manager: { handleOnLoginSuccess, handleOnLoginError },
  // } = useGoogleAuthContext();

  // const {
  //   manager: { handleIsFetching },
  // } = useApplicationContext();

  // const handleClickListener = () => handleIsFetching(true);
  // const handleCloseCallback = () => handleIsFetching(false);

  // const handleCallback = (response: { id: string; password: string }) => {
  //   debugger;
  //   console.log("Google Login Response :>>> handleCallback:>>>", {
  //     response,
  //   });
  // };

  return (
    <>
      {/* <GoogleLogin
      size="large"
      shape="square"
      context="use"
      ux_mode="popup"
      theme="filled_blue"
      text="continue_with"
      logo_alignment="left"
      onError={handleOnLoginError}
      onSuccess={handleOnLoginSuccess}
      // onSuccess={() => true}
      native_callback={handleCallback}
      click_listener={handleClickListener}
      intermediate_iframe_close_callback={handleCloseCallback}
    /> */}
    </>
  );
};

export default GoogleAuth;
