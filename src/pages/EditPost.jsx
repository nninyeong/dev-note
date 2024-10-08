import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { PostContext } from '../context/PostContextProvider.jsx';
import PostingForm from '../components/posting/PostingForm.jsx';
import validatePostForm from '../utils/validateForm.js';

const EditPost = () => {
  const { id } = useParams();
  const { getPostContents, editPost } = useContext(PostContext);
  const prevContents = getPostContents(+id);
  const setPrevThumbnail = (file) => {
    prevContents.thumbnail = file;
  };

  const [newPostContents, setNewPostContents] = useState({
    title: prevContents.title,
    content: prevContents.content,
    project_start_date: prevContents.project_start_date,
    project_end_date: prevContents.project_end_date,
    tech_stack: prevContents.tech_stack.join(' '),
    thumbnail: null
  });

  const [validErrors, setValidErrors] = useState([]);
  const navigate = useNavigate();
  const handleEditPost = async () => {
    const { isValid, errors } = validatePostForm(newPostContents);

    if (isValid) {
      await editPost(+id, prevContents, newPostContents);
      navigate(`/detailpost/${id}`, { replace: true });
    } else {
      setValidErrors(errors);
    }
  };

  return (
    <PostingForm
      type="editPost"
      postContents={newPostContents}
      setPostContents={setNewPostContents}
      handleSubmit={handleEditPost}
      prevThumbnailUrl={prevContents.thumbnail_url}
      setPrevThumbnail={setPrevThumbnail}
      validErrors={validErrors}
    />
  );
};

export default EditPost;
