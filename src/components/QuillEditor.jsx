import { useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Quill from 'quill';
import './QuillEditor.css';
import { AlignClass, AlignStyle } from 'quill/formats/align';

Quill.register(AlignClass, true);
Quill.register(AlignStyle, true);

export default function QuillEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  // Quill 에디터 모듈 설정
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  };

  return (
    <div className="quill-editor-container">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || '내용을 입력해 주세요'}
      />
    </div>
  );
}
