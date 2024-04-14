import { useRef } from "react";

import { Editor } from "@tinymce/tinymce-react";

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from "tinymce/tinymce";
// DOM model
import "tinymce/models/dom/model";
// Theme
import "tinymce/themes/silver";
// Toolbar icons
import "tinymce/icons/default";
// Editor styles
import "tinymce/skins/ui/oxide/skin.min.css";

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/autosave";
import "tinymce/plugins/charmap";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/directionality";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/help";
import "tinymce/plugins/image";
import "tinymce/plugins/importcss";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/preview";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/save";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/table";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/wordcount";

// importing plugin resources
import "tinymce/plugins/emoticons/js/emojis";

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
// import contentCss from "!!raw-loader!tinymce/skins/content/default/content.min.css";
// import contentUiCss from "!!raw-loader!tinymce/skins/ui/oxide/content.min.css";

export interface TinyMCEProps {
  initialValue?: string;
  value?: string;
}

const TinyMCE = (params: TinyMCEProps) => {
  const editorRef = useRef(null);

  console.log("tinymce:>>>", {
    tinymce,
  });

  return (
    <>
      <Editor
        disabled
        value={params.value}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={params.initialValue}
        init={{
          kin: false,
          content_css: false,
          content_style: [
            // contentCss,
            // contentUiCss,
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          ].join("\n"),
          min_height: 250,
          height: 250,
          menubar: false,
          readonly: 1 as never,
          inline: true,
          plugins: [
            "advlist",
            "anchor",
            "autolink",
            "help",
            "image",
            "link",
            "lists",
            "searchreplace",
            "table",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
        }}
      />
    </>
  );
};

export default TinyMCE;
