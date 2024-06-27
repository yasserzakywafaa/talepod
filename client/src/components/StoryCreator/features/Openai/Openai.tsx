import OpenaiContent from "./OpenaiContent";
import { OpenaiContextProvider } from "./store/Provider";

const OpenAiGPT: React.FC = () => {
  return (
    <OpenaiContextProvider>
      <OpenaiContent />
    </OpenaiContextProvider>
  );
};

export default OpenAiGPT;
