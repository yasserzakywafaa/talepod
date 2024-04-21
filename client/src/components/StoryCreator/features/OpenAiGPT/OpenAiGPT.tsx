import OpenAiGPTContent from "./OpenAiGPTContent";
import { OpenAiGPTContextProvider } from "./domain/Provider";

const OpenAiGPT = () => {
  return (
    <OpenAiGPTContextProvider>
      <OpenAiGPTContent />
    </OpenAiGPTContextProvider>
  );
};

export default OpenAiGPT;
