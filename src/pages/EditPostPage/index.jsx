import css from './index.module.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPostDetail, updatePost } from '@/apis/postApi';
import QuillEditor from '@/components/QuillEditor';

export default function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [currentImage, setCurrentImage] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.userId) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const postData = await getPostDetail(postId);
        if (postData.author !== user.userId) {
          setError('자신의 글만 수정할 수 있습니다');
          navigate('/');
          return;
        }

        setTitle(postData.title);
        setSummary(postData.summary);
        setContent(postData.content);
        if (postData.cover) {
          setCurrentImage(`${import.meta.env.VITE_BACK_URL}/${postData.cover}`);
        }
      } catch (err) {
        console.error('글 정보 불러오기 실패:', err);
        setError('글 정보를 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, user?.userId, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !summary || !content) {
      setError('모든 필드를 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('summary', summary);
      formData.set('content', content);
      if (files?.[0]) formData.set('files', files[0]);

      await updatePost(postId, formData);
      navigate(`/detail/${postId}`);
    } catch (err) {
      console.error('글 수정 실패:', err);
      setError(err?.response?.data?.error || '글 수정에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={css.loading}>글 정보를 불러오는 중...</div>;
  }

  return (
    <main className={css.editpost}>
      <h2>글 수정하기</h2>
      {error && <div className={css.error}>{error}</div>}

      <form className={css.writecon} onSubmit={handleSubmit}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          required
        />

        <label htmlFor="summary">요약내용</label>
        <input
          type="text"
          id="summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="요약내용을 입력해주세요"
          required
        />

        <input
          type="file"
          id="files"
          accept="image/*"
          onChange={e => setFiles(e.target.files)}
          hidden
        />
        <label htmlFor="files">파일첨부</label>

        {currentImage && (
          <>
            <label>현재 이미지:</label>
            <img src={currentImage} alt="현재 이미지" className={css.previewImage} />
            <p className={css.imageNote}>새 이미지를 업로드하면 기존 이미지는 대체됩니다.</p>
          </>
        )}

        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor value={content} onChange={setContent} placeholder="내용을 입력해주세요" />
        </div>

        <button type="submit" disabled={isSubmitting} className={css.submitButton}>
          {isSubmitting ? '수정 중...' : '수정하기'}
        </button>
      </form>
    </main>
  );
}
