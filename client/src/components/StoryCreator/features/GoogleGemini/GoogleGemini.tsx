import { GoogleGeminiContent } from "./GoogleGeminiContent";
import { GoogleGeminiContextProvider } from "./domain/Provider";

const GoogleGemini: React.FC = () => {
  return (
    <GoogleGeminiContextProvider>
      <GoogleGeminiContent />
    </GoogleGeminiContextProvider>
  );
};

export default GoogleGemini;
