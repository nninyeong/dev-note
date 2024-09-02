import { useContext, useEffect, useState } from 'react';
import { PostContext } from '../context/PostContextProvider';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../globalStyle.css';
import { UserContext } from '../context/UserContextProvider';

const DetailPost = () => {
  const { id } = useParams();
  const { posts, deletePosts } = useContext(PostContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // user 가 특정되면 주석 풀기
  // if (!user) {
  //   return <Navigate to="/signin" />;
  // }

  // 📝 TODO: 지금 접속한 유저가 detail 페이지의 post를 작성한 유저#와 일치할 때만 수정/삭제 버튼 보이도록 수정

  useEffect(() => {
    if (posts.length === 0) return;
    const post = posts.find((post) => post.post_id === Number(id));
    if (!post) {
      alert('일치하는 게시물이 없습니다! 홈 화면으로 이동합니다!');
      navigate('/');
    }
  }, [posts, id, navigate]);

  if (posts.length === 0) return <p>로딩중...</p>;

  const post = posts.find((post) => post.post_id === Number(id));

  if (!post) {
    return null;
  }

  const handleDelete = async () => {
    if (window.confirm('삭제하겠습니까?')) {
      await deletePosts(post.post_id);
      navigate('/');
    }
  };
  const isAuthor = post.author_id === user.id;
  console.log(id);
  console.log(user);
  console.log(post);

  return (
    <>
      <S_PostSectionWrapper>
        <S_PostSection>
          <S_TagSection>
            {post.tech_stack.map((tech, index) => (
              <S_Tag key={index}>#{tech}</S_Tag>
            ))}
          </S_TagSection>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              marginTop: '1rem'
            }}
          >
            {post.title}
          </h1>
          <S_PostInfoBarWrapper>
            <S_PostInfoBar>
              <S_PostInfo>{post.author_nickname}</S_PostInfo>
              {isAuthor && (
                <S_PostInfoActionBar>
                  <S_PostInfo>
                    <Link
                      to={`/auth/editpost/${post.post_id}`}
                      style={{ textDecoration: 'underline', color: 'grey', fontSize: 'small' }}
                    >
                      수정
                    </Link>
                  </S_PostInfo>

                  <S_PostInfo
                    onClick={handleDelete}
                    style={{ textDecoration: 'underline', color: 'grey', fontSize: 'small' }}
                  >
                    삭제
                  </S_PostInfo>
                </S_PostInfoActionBar>
              )}
            </S_PostInfoBar>
          </S_PostInfoBarWrapper>
          <img
            src={post.thumbnail_url ? post.thumbnail_url : '/no-img.png'}
            alt={post.title}
            style={{ fontSize: '0.8rem', maxWidth: '100%', height: 'auto', maxHeight: '400px', cursor: 'pointer' }}
            onClick={openModal}
          />
          {isModalOpen && (
            <S_ModalOverlay onClick={closeModal}>
              <StyledImage src={post.thumbnail_url} alt="썸네일 자세히보기" />
            </S_ModalOverlay>
          )}
          <S_PostInfoTimeWrapper>
            <p style={{ fontWeight: '200', fontSize: '0.8rem' }}>
              {post.project_start_date} ~ {post.project_end_date}
            </p>
          </S_PostInfoTimeWrapper>
          <p style={{ fontWeight: '400', fontSize: '1rem', lineHeight: '1.6' }}>{post.content}</p>
        </S_PostSection>
      </S_PostSectionWrapper>
    </>
  );
};

export default DetailPost;

const S_PostSectionWrapper = styled.section`
  margin-top: 3rem;
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const S_PostSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 80%;
`;

const S_TagSection = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;
const S_Tag = styled.span`
  font-size: 0.8rem;
  display: block;
  padding: 6px 10px;
  border: 1px solid #9f9f9f;
  border-radius: 100px;
  white-space: nowrap;
`;

const S_PostInfoBarWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #9f9f9f;
  width: 100%;
  margin-top: -0.5rem;
`;
const S_PostInfoBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 4px;
  justify-content: space-between;
  width: 100%;
`;
const S_PostInfoActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
`;
const S_PostInfo = styled.p`
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
`;
const S_ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const StyledImage = styled.img`
  min-width: 300px;
  max-width: 80vw;
  min-height: 400px;
  max-height: 80vh;
  height: auto;
  object-fit: contain;
`;

const S_PostInfoTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 100%;
`;
