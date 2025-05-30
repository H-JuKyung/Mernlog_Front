import css from './index.module.css';
import { useState, useEffect } from 'react';
import QuillEditor from '@/components/QuillEditor';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createPost } from '@/apis/postApi';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState('');
  const [content, setContent] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFileChange = e => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    if (selectedFiles && selectedFiles[0]) {
      setCurrentImage(URL.createObjectURL(selectedFiles[0]));
    }
  };

  const handleCreatePost = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!title || !summary || !content || !files?.[0]) {
      setIsSubmitting(false);
      setError('제목, 요약, 파일, 내용을 모두 입력해주세요');
      return;
    }

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('files', files[0]);

    try {
      await createPost(data);
      navigate('/');
    } catch (err) {
      console.error('글 등록 실패:', err);
      setError(err?.response?.data?.error || '글 등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={css.createpost}>
      <h2>글쓰기</h2>
      {error && <div className={css.error}>{error}</div>}
      <form className={css.writecon} onSubmit={handleCreatePost}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label htmlFor="summary">요약내용</label>
        <input
          type="text"
          id="summary"
          placeholder="요약내용을 입력해주세요"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          required
        />

        <input type="file" id="files" accept="image/*" onChange={handleFileChange} hidden />
        <div className={css.fileWrapper}>
          <label htmlFor="files">파일 첨부</label>
          <p className={css.imageNote}>이미지를 업로드하면 글에 첨부됩니다.</p>
        </div>

        {currentImage && (
          <img src={currentImage} alt="선택한 이미지" className={css.previewImage} />
        )}

        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor value={content} onChange={setContent} placeholder="내용을 입력해주세요" />
        </div>

        <button type="submit" disabled={isSubmitting} className={css.submitButton}>
          {isSubmitting ? '등록중...' : '등록'}
        </button>
      </form>
    </main>
  );
}
