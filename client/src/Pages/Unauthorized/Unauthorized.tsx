import "./Unauthorized.scss";

import { ReactComponent as UnauthorizedSVG } from "../../assets/svgs/unauthorized.svg";

const Unauthorized = () => {
  return (
    <div className="background-layer unauthorized-page flex direction--column justify--center align--center">
      <div className="unauthorized-image">
        <UnauthorizedSVG />
      </div>

      <div className="unauthorized-card-wrapper flex direction--column justify--center align--center">
        <h3>Unauthorized</h3>
        <p>
          It looks like you are not authorized to used the Offline File Player
        </p>
        <p>Please contact your administrator</p>
      </div>
    </div>
  );
};

export default Unauthorized;
