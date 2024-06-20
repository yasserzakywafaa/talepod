import { GoogleGeminiContent } from "./GoogleGeminiContent";
import { GoogleGeminiContextProvider } from "./store/Provider";

const GoogleGemini: React.FC = () => {
  return (
    <GoogleGeminiContextProvider>
      <GoogleGeminiContent />
    </GoogleGeminiContextProvider>
  );
};

export default GoogleGemini;
