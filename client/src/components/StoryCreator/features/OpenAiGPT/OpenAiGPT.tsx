import OpenAiGPTContent from "./OpenAiGPTContent";
import { OpenAiGPTContextProvider } from "./domain/Provider";

const OpenAiGPT: React.FC = () => {
  return (
    <OpenAiGPTContextProvider>
      <OpenAiGPTContent />
    </OpenAiGPTContextProvider>
  );
};

export default OpenAiGPT;
