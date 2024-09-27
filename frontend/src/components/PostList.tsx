import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Input, List, Button, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;

const PostList: React.FC = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts.posts);
  const users = useSelector((state: RootState) => state.users.users);
  const comments = useSelector((state: RootState) => state.comments.comments);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [hasMore, setHasMore] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(posts.slice(0, 5));
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]); // Thêm trạng thái để lưu ID bài viết mở rộng

  useEffect(() => {
    dispatch({ type: 'FETCH_POSTS' });
    dispatch({ type: 'FETCH_USERS' });
    dispatch({ type: 'FETCH_COMMENTS' });
  }, [dispatch]);

  useEffect(() => {
    setFilteredPosts(
      posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, posts]);

  const loadMorePosts = () => {
    const nextVisiblePosts = posts.slice(visiblePosts.length, visiblePosts.length + 5);
    setVisiblePosts([...visiblePosts, ...nextVisiblePosts]);

    if (nextVisiblePosts.length === 0) {
      setHasMore(false);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedPostIds(prevIds => 
      prevIds.includes(postId) ? prevIds.filter(id => id !== postId) : [...prevIds, postId]
    );
  };

  return (
    <div>
      <Title level={2}>Bài viết</Title>
      <Search
        placeholder="Tìm kiếm bài viết theo tiêu đề"
        onSearch={value => setSearchTerm(value)}
        enterButton
      />
      <InfiniteScroll
        dataLength={visiblePosts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<h4>Đang tải...</h4>}
      >
        <List
          itemLayout="vertical"
          size="large"
          dataSource={filteredPosts.length ? filteredPosts.slice(0, visiblePosts.length) : visiblePosts}
          renderItem={post => {
            const user = users.find(user => user._id === post.owner);
            const postComments = comments.filter(comment => comment.post === post._id);

            const isExpanded = expandedPostIds.includes(post._id); // Kiểm tra bài viết có đang mở rộng không

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
                      <p key={comment._id}><strong>{users.find(user => user._id === comment.owner)?.name || 'Không rõ'}:</strong> {comment.content}</p>
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
