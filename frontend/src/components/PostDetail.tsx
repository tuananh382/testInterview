import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../redux/store';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const PostDetail: React.FC = () => {
  const { _id } = useParams<{ _id: string }>();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const post = posts.find(post => post._id.toString() === _id);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={2}>{post.title}</Title>
      <Paragraph>{post.content}</Paragraph>
      <Paragraph>
        <strong>By User {post.owner}</strong> on {new Date(post.created_at).toLocaleDateString()}
      </Paragraph>
    </div>
  );
};

export default PostDetail;
