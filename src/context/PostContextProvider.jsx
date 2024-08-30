import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { getImageURL } from '../utils/supabaseStorage';
import { UserContext } from './UserContextProvider';

export const PostContext = createContext(null);

const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('DEV_POSTS').select('*');

    if (error) {
      console.log('🚀 ~ fetchPosts ~ error:', error);
    } else {
      setPosts(data);
    }
  };

  const addPosts = async ({ title, content, project_start_date, project_end_date, tech_stack, thumbnail }) => {
    tech_stack = tech_stack.split(' ');
    const thumbnail_url = await getImageURL(thumbnail, 'thumbnails');
    console.log('🚀 ~ addPosts ~ thumbnail_url:', thumbnail_url);

    // TODO: 민영 - 유효성검사 추가

    const { error: tableError } = await supabase.from('DEV_POSTS').insert({
      title,
      content,
      project_start_date,
      project_end_date,
      tech_stack,
      thumbnail_url,
      author_id: user.id
    });

    if (tableError) {
      console.log('🚀 ~ addPosts ~ tableError:', tableError);
    } else {
      fetchPosts();
      alert('프로젝트가 정상적으로 등록되었습니다.');
    }
  };

  return <PostContext.Provider value={{ posts, addPosts }}>{children}</PostContext.Provider>;
};

export default PostContextProvider;
