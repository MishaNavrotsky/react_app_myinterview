import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { GiphySearchResponse, search } from '../../api/giphy';
import { RootState } from '../../app/store';

export type ImageScrollerChunk = {
  data: GiphySearchResponse['data'],
  status: 'loaded' | 'loading' | 'failed' | 'idle',
}

export interface ImageScrollerState {
  query?: string,
  page: number,
  status: 'busy' | 'idle',
  chunks: ImageScrollerChunk[],
  hasMore: boolean,
}

const initialState: ImageScrollerState = {
  query: undefined,
  page: 0,
  status: 'idle',
  chunks: [{ data: [], status: 'idle' }],
  hasMore: false,
};


export const searchAsync = createAsyncThunk(
  'imageScroller/search',
  async (query: string | undefined, { signal }) => {
    const response = await search(0, query, signal);
    return { response: response.data, query, page: 0 };
  }
);

export const searchNextAsync = createAsyncThunk<{response: GiphySearchResponse, page: number}, void, { state: RootState }>(
  'imageScroller/searchNext',
  async (v : void, { getState }) => {
    const { query, page } = getState().imageScroller
    const curPage = page + 1
    const response = await search(curPage, query);
    return { response: response.data, page: curPage };
  },
  {
    condition: (v : void, { getState }) => {
      const { status } = getState().imageScroller

      if (status === 'busy') return false
      if (status === 'idle') return true
    }
  }
)



export const imageScrollerSlice = createSlice({
  name: 'imageScroller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.chunks = [{ data: [], status: 'loading' }]
        state.status = 'busy'
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        const res = action.payload.response
        state.chunks = [{ data: res.data, status: 'loaded' }]
        state.query = action.payload.query
        state.page = action.payload.page
        state.status = 'idle'
        state.hasMore = res.pagination.total_count > res.pagination.offset + res.pagination.count
      })
      .addCase(searchAsync.rejected, (state) => {
        state.chunks = [{ data: [], status: 'failed' }]
        state.status = 'idle'
      })
      .addCase(searchNextAsync.pending, (state) => {
        state.chunks = [...state.chunks, { data: [], status: 'loading' }]
        state.status = 'busy'
      })
      .addCase(searchNextAsync.fulfilled, (state, action) => {
        const res = action.payload.response
        const chunks = state.chunks.splice(0, state.chunks.length - 1)
        state.chunks = [...chunks, { data: action.payload.response.data, status: 'loaded' }]
        state.status = 'idle'
        state.page = action.payload.page
        state.hasMore = res.pagination.total_count > res.pagination.offset + res.pagination.count
      })
      .addCase(searchNextAsync.rejected, (state) => {
        const chunks = state.chunks.splice(0, state.chunks.length - 1)
        state.chunks = [...chunks, { data: [], status: 'failed' }]
        state.status = 'idle'
      })
  },
});



export default imageScrollerSlice.reducer;
