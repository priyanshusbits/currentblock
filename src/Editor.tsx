import React, { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import SimpleImage from "@editorjs/simple-image";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
const Editor = ({ onChange, initialData, reload,setEditorData  }) => {
  const editorRef = useRef(null);
  let editorInstance = null;

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    editorInstance = new EditorJS({
      holder: editorRef.current,
      data: initialData,
      // Define the tools here
      tools: {
        // Example: Header, List, etc.
        header: Header,
        image: SimpleImage,
        
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        embed: Embed,
        quote: Quote,
        code: CodeTool,
      },
      onChange: async () => {
        const data = await editorInstance.save();
        onChange(data);
      },
    });
  
    return () => {
      if (editorInstance && typeof editorInstance.destroy === "function") {
        editorInstance.destroy();
      }
    };
    
  }, [reload]);

  return <div ref={editorRef}></div>;
};

export default Editor;
