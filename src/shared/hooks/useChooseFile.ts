import { useCallback, useEffect, useState } from "react";

interface IChooseFileProps {
  accept: string;
  callback: (file: any) => void;
}

const useChooseFile = (props: IChooseFileProps) => {
  const { accept = "*", callback } = props;
  const [open, setOpen] = useState(false);
  const [input] = useState(
    (() => {
      const input = window.document.createElement("input");
      input.accept = accept;
      input.type = "file";
      return input;
    })()
  );

  const Callback = useCallback(callback, [callback]);

  const onFileButtonClicked = () => {
    console.log("<<<: onFileButtonClicked :>>> 1");
    if (!open) {
      setTimeout(setOpen.bind(null, false), 1000);
      setOpen(true);
      input.click();
    }
  };

  const onFileChanged = useCallback(
    (event: Event) => {
      const files: FileList = event.target?.["files"];
      if (files && files.length) Callback(files);
    },
    [Callback]
  );

  useEffect(() => {
    input.addEventListener("change", onFileChanged);
    return () => input.removeEventListener("change", onFileChanged);
  }, [input, onFileChanged]);

  return onFileButtonClicked;
};

export default useChooseFile;
