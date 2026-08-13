import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import FileUploadAdapter from "./FileUploadAdapter";

const editorConfiguration = {
  toolbar: [
    "bold",
    "italic",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "imageUpload",
    "insertTable",
    "|",
    "alignment:left",
    "alignment:right",
    "alignment:center",
    "alignment:justify",
    "link",
    // "|",
    // "undo",
    // "redo",
  ],
};

export default function WebEditor({content, setContent}: {content: any; setContent: any}) {
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={content}
        onReady={(editor: any) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
            return new FileUploadAdapter(loader);
          };
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          setContent(data);
        }}
        onBlur={(event: any, editor: any) => {
          // console.log("Blur.", editor);
        }}
        onFocus={(event: any, editor: any) => {
          // console.log("Focus.", editor);
        }}
      />
    </>
  );
}
