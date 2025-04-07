import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { AuthType } from "src/shared/types";
import { Notify } from "../../Notification/Notification";
import { useApplicationContext } from "src/application/store/Provider";
import { useGoogleAuthContext } from "./store/Provider";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

interface GoogleAuthProps {
  authType: AuthType;
  onSuccessCallbackFn?: () => void;
}

const GoogleAuth = (props: GoogleAuthProps) => {
  const { authType, onSuccessCallbackFn } = props;
  const isRegister = authType === "register";

  const {
    manager: { handleOnGoogleAuthSuccess, handleOnGoogleAuthError },
  } = useGoogleAuthContext();

  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();
  const { store: registerStore } = useRegisterModalContext();
  const { store: loginStore } = useLoginModalContext();

  const handleClickListener = () => toggleIsFetching(true);
  const handleCloseCallback = () => toggleIsFetching(false);

  const onSuccessCallback = async (credentialResponse: CredentialResponse) => {
    const authInfo = await handleOnGoogleAuthSuccess(credentialResponse);

    if (authInfo) {
      handleSetAuthInfo(authInfo);
      Notify({
        type: "success",
        content: `Hi ${authInfo.user?.name.givenName} 👋🏻`,
      });
    } else {
      Notify({
        type: "error",
        content: isRegister ? "Failed to register!" : `Failed to login!`,
      });
    }

    toggleIsModalVisible();
    toggleIsFetching(false);
    toggleIsFetching(false);
    onSuccessCallbackFn?.();
  };

  const onErrorCallback = () => {
    handleOnGoogleAuthError();
    toggleIsFetching(false);
  };

  const toggleIsFetching = (isFetching: boolean) => {
    if (isRegister) {
      registerStore.handleIsFetching(isFetching);
    } else {
      loginStore.handleIsFetching(isFetching);
    }
  };

  const toggleIsModalVisible = () => {
    if (isRegister) {
      registerStore.handleToggleRegisterModal();
    } else {
      loginStore.handleToggleLoginModal();
    }
  };

  return (
    <>
      <GoogleLogin
        size="large"
        shape="square"
        context="use"
        ux_mode="popup"
        theme="filled_blue"
        text="continue_with"
        logo_alignment="left"
        cancel_on_tap_outside={false}
        onError={onErrorCallback}
        onSuccess={onSuccessCallback}
        click_listener={handleClickListener}
        intermediate_iframe_close_callback={handleCloseCallback}
      />
    </>
  );
};

export default GoogleAuth;
