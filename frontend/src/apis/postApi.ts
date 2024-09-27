import axios from 'axios';
import {Post} from '../types/postType'

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get<Post[]>('http://localhost:3000/api/posts'); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};
