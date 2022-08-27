import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  searchAsync, searchNextAsync
} from './imageScrollerSlice';
import styles from './ImageScroller.module.css';
import Image from '../../components/Image';

export function ImageScroller() {
  const imageScrollerChunks = useAppSelector(a => a.imageScroller.chunks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(searchAsync({ page: 0 }))
    let i = 1;
    setInterval(() => {
      dispatch(searchNextAsync({ page: i++ }))
    }, 5000)
  }, [])

  return (
    <>
      {imageScrollerChunks.map(chunk =>
        <>
          {chunk.status === 'loading' && <Skeleton count={3} height={100} />}
          {chunk.status === 'loaded' &&
            <div className={styles['grid-container']}>
              {chunk.data.map(data => (
                <div className='grid-item' id={data.id}>
                  <Image src={data.images.fixed_height.url} skeletonHeight={200} />
                </div>))
              }
            </div>
          }
        </>
      )}
    </>
  );
}
