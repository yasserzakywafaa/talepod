import { Auth, google, webmasters_v3 } from "googleapis";

import CONFIG from "src/config";

const credentials = {
  type: CONFIG.GOOGLE_TYPE,
  project_id: CONFIG.GOOGLE_PROJECT_ID,
  private_key_id: CONFIG.GOOGLE_PRIVATE_KEY_ID,
  private_key: CONFIG.GOOGLE_PRIVATE_KEY,
  client_email: CONFIG.GOOGLE_CLIENT_EMAIL,
  client_id: CONFIG.GOOGLE_CLIENT_ID,
  //   auth_uri: CONFIG.GOOGLE_AUTH_URI,
  //   token_uri: CONFIG.GOOGLE_TOKEN_URI,
  //   auth_provider_x509_cert_url: CONFIG.GOOGLE_AUTH_PROVIDER_CERT_URL,
  //   client_x509_cert_url: CONFIG.GOOGLE_CLIENT_CERT_URL,
  universe_domain: CONFIG.GOOGLE_UNIVERSE_DOMAIN,
};

export const handleSubmitSitemapToGoogle = async (siteMapFileName: string) => {
  // Initialize authentication
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });

  // Create client instance
  const client: Auth.JWT = (await auth.getClient()) as Auth.JWT;
  if (!(client instanceof google.auth.JWT)) {
    throw new Error("❌ Unexpected authentication client type!");
  }

  // Configure the Search Console API
  const webmasters: webmasters_v3.Webmasters = google.webmasters({
    version: "v3",
    auth: client,
  });

  // Specify your site URL (as registered in Search Console)
  const siteUrl = "https://www.talepod.com"; // Ensure this matches exactly
  const sitemapUrl = `https://www.talepod.com/${siteMapFileName}`; // Full URL of your sitemap

  console.log("🛠️  Submitting   🛠️");

  try {
    // Submit the sitemap
    await webmasters.sitemaps.submit({
      siteUrl: siteUrl,
      feedpath: sitemapUrl,
    });
    console.log("✅ Sitemap submitted successfully!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error submitting sitemap:", error.message);
      if (error.message.includes("Permission denied")) {
        console.error("Verify service account has Search Console ownership");
      }
    } else {
      console.error("❌ Unknown error:", error);
    }
  }
};
