import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Input, List, Button, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

const { Title } = Typography;

const PostList: React.FC = () => {
  const dispatch = useDispatch();
  const limit = 5; 
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);

  const posts = useSelector((state: RootState) => state.posts.posts);
  const totalPosts = useSelector((state: RootState) => state.posts.totalPosts);
  const users = useSelector((state: RootState) => state.users.users);
  const comments = useSelector((state: RootState) => state.comments.comments);

  useEffect(() => {
    dispatch({ type: 'FETCH_POSTS', payload: { limit, skip: 0, query: searchTerm } });
    dispatch({ type: 'FETCH_USERS'});
    dispatch({ type: 'FETCH_COMMENTS'});
  }, [dispatch, searchTerm]);

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );


  const loadMorePosts = useCallback(
    debounce(() => {
      if (posts.length >= totalPosts) {
        setHasMore(false); 
        return;
      }
      dispatch({ type: 'FETCH_MORE_POSTS', payload: { limit, skip: posts.length, query: searchTerm } });
    }, 300), 
    [dispatch, posts.length, totalPosts, searchTerm]
  );
  

  
  const toggleComments = (postId: string) => {
    setExpandedPostIds(prevIds =>
      prevIds.includes(postId) ? prevIds.filter(_id => _id !== postId) : [...prevIds, postId]
    );
  };
  return (
    <div>
      <Title level={2}>Bài viết</Title>
      <Input
        placeholder="Tìm kiếm bài viết theo tiêu đề"
        onChange={e => handleSearchChange(e.target.value)} 
      />
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts} 
        hasMore={hasMore}
        loader={<h4>Đang tải...</h4>}
        endMessage={<p style={{ textAlign: 'center' }}>Đã tải hết bài viết</p>}
      >
        <List
          itemLayout="vertical"
          size="large"
          dataSource={posts}
          renderItem={post => {
            const user = users.find(user => user._id === post.owner);
            const postComments = comments.filter(comment => comment.post === post._id);
            const isExpanded = expandedPostIds.includes(post._id);

            return (
              <List.Item
                key={post._id}
                actions={[
                  <span onClick={() => toggleComments(post._id)} style={{ cursor: 'pointer' }}>
                    {isExpanded ? 'Ẩn bình luận' : `${postComments.length} bình luận`}
                  </span>
                ]}
              >
                <List.Item.Meta
                  title={<Link to={`/posts/${post._id}`}>{post.title}</Link>}
                  description={`Bởi ${user ? user.name : 'Không rõ'} vào ${new Date(post.created_at).toLocaleDateString()}`}
                />
                <p>{post.content.substring(0, 100)}...</p>
                <Button type="link">
                  <Link to={`/posts/${post._id}`}>Đọc thêm</Link>
                </Button>

                {isExpanded && (
                  <div style={{ marginTop: 10 }}>
                    {postComments.map(comment => (
                      <p key={comment._id}>
                        <strong>{users.find(user => user._id === comment.owner)?.name || 'Không rõ'}:</strong> {comment.content}
                      </p>
                    ))}
                  </div>
                )}
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
