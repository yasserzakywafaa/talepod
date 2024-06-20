import OpenAiGPTContent from "./OpenAiGPTContent";
import { OpenAiGPTContextProvider } from "./store/Provider";

const OpenAiGPT: React.FC = () => {
  return (
    <OpenAiGPTContextProvider>
      <OpenAiGPTContent />
    </OpenAiGPTContextProvider>
  );
};

export default OpenAiGPT;
