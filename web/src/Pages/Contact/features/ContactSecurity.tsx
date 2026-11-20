import { Honeypot, Turnstile, useFormStartedAt } from "@yasserzakywafaa/client-core/web/security";

import { Box } from "@mui/material";
import { useContactContext } from "../store/Provider";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";

/** Public Turnstile site key. Empty locally: no widget, and the server skips the check outside production. */
export const TURNSTILE_SITE_KEY: string = import.meta.env.REACT_APP_TURNSTILE_SITE_KEY ?? "";

/** True when the form may be sent: a Turnstile token is present (or Turnstile is off). */
export const useContactVerified = () => {
  const { store } = useContactContext();
  return !TURNSTILE_SITE_KEY || Boolean(store.state.security.turnstileToken);
};

/** Honeypot + Cloudflare Turnstile for the contact form (shared client-core pieces). */
const ContactSecurity = () => {
  const { store } = useContactContext();
  const { startedAt } = useFormStartedAt();
  const mode = useTheme().palette.mode;
  const { updateSecurity, turnstileRef } = store;

  useEffect(() => {
    if (startedAt) updateSecurity({ startedAt });
    // updateSecurity is recreated each render; startedAt is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt]);

  return (
    <>
      <Honeypot value={store.state.security.website} onChange={(website) => updateSecurity({ website })} />
      {TURNSTILE_SITE_KEY && (
        <Box sx={{ minHeight: 65 }}>
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            action="contact"
            theme={mode}
            size="flexible"
            onToken={(turnstileToken) => updateSecurity({ turnstileToken })}
            onExpire={() => updateSecurity({ turnstileToken: "" })}
            onError={() => updateSecurity({ turnstileToken: "" })}
          />
        </Box>
      )}
    </>
  );
};

export default ContactSecurity;
