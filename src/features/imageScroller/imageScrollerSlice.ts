import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { GiphySearchResponse, search } from '../../api/giphy';
import { RootState, AppThunk } from '../../app/store';

export type ImageScrollerChunk = {
  data: GiphySearchResponse['data'],
  status: 'loaded' | 'loading' | 'failed' | 'idle',
}

export interface ImageScrollerState {
  query?: string,
  lastPage?: number,
  status: 'busy' | 'idle',
  chunks: ImageScrollerChunk[],
}

const initialState: ImageScrollerState = {
  query: undefined,
  lastPage: undefined,
  status: 'idle',
  chunks: [{ data: [], status: 'idle' }],
};


export const searchAsync = createAsyncThunk<GiphySearchResponse['data'], { page: number, query?: string }, { state: RootState }>(
  'imageScroller/search',
  async ({ page, query }, { signal }) => {
    const response = await search(page, query, signal);
    return response.data.data;
  }
);

export const searchNextAsync = createAsyncThunk<GiphySearchResponse['data'], { page: number }, { state: RootState }>(
  'imageScroller/searchNext',
  async ({ page }, { getState }) => {
    const { query } = getState().imageScroller
    const response = await search(page, query);
    return response.data.data;
  },
  {
    condition: ({ }, { getState }) => {
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
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.chunks = [{ data: action.payload, status: 'loaded' }]
      })
      .addCase(searchAsync.rejected, (state) => {
        state.chunks = [{ data: [], status: 'failed' }]
      })
      .addCase(searchNextAsync.pending, (state) => {
        state.chunks = [...state.chunks, { data: [], status: 'loading' }]
        state.status = 'busy'
      })
      .addCase(searchNextAsync.fulfilled, (state, action) => {
        const chunks = state.chunks.splice(0, state.chunks.length - 1)
        state.chunks = [...chunks, { data: action.payload, status: 'loaded' }]
        state.status = 'idle'
      })
      .addCase(searchNextAsync.rejected, (state) => {
        const chunks = state.chunks.splice(0, state.chunks.length - 1)
        state.chunks = [...chunks, { data: [], status: 'failed' }]
        state.status = 'idle'
      })
  },
});



export default imageScrollerSlice.reducer;
