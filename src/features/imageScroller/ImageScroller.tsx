import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  searchAsync, searchNextAsync
} from './imageScrollerSlice';
import styles from './ImageScroller.module.css';
import Image from '../../components/Image';
import { useDebouncedCallback } from 'use-debounce';
import InfiniteScroll from 'react-infinite-scroll-component';
import _ from 'lodash';
import { Link } from 'react-router-dom';

export function ImageScroller() {
  const imageScroller = useAppSelector(a => a.imageScroller);
  const dispatch = useAppDispatch();

  const debouncedSearch = useDebouncedCallback((query) => dispatch(searchAsync(query)), 1000);

  useEffect(() => {
    dispatch(searchAsync())
  }, [])


  return (
    <>
      <div className={styles['input']}>
        <input
          defaultValue={imageScroller.query}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>
      <InfiniteScroll
        dataLength={imageScroller.chunks.filter(c => c.status === 'loaded').length}
        next={() => dispatch(searchNextAsync())}
        hasMore={imageScroller.status === 'busy' || imageScroller.hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className={styles['noMoreChunksMessage']}>
            <b>This is the end, you know.</b>
          </p>
        }
      >
        {imageScroller.chunks.map(chunk =>
          <>
            {chunk.status === 'loading' && <Skeleton count={3} height={200} />}
            {chunk.status === 'loaded' && !!chunk.data.length &&
              <div className={styles['grid-container']}>
                {chunk.data.map(data => (
                  <div className={styles['grid-item']} id={data.id}>
                    <Link to={`/${data.id}`}>
                      <Image src={data.images.fixed_height.url} skeletonHeight={data.images.fixed_height.height + 'px'} skeletonWidth={data.images.fixed_height.width + 'px'} />
                    </Link>
                  </div>))
                }
              </div>
            }
          </>
        )}
      </InfiniteScroll>
    </>
  );
}
