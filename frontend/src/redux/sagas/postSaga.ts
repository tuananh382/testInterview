import { call, put, takeLatest } from 'redux-saga/effects';
import { setPosts } from '../reducers/postReducer';
import { fetchPosts } from '../../apis/postApi';
import { Post } from '../../types/postType'

function* fetchPostsSaga() {
    try {
        const posts: Post[] = yield call(fetchPosts);
        yield put(setPosts(posts));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

export function* watchFetchPosts() {
    yield takeLatest('FETCH_POSTS', fetchPostsSaga);
}
