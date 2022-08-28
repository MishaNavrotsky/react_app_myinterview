import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { getById, GiphyImageData } from '../../api/giphy';
import { useAppSelector } from '../../app/hooks';
import styles from './ImageInfo.module.css'
import Image from '../Image'


export default function ImageInfo() {
  const [imageData, setImageData] = useState<GiphyImageData>()
  const imageScroller = useAppSelector(a => a.imageScroller);
  const { imageId } = useParams<{ imageId: string }>()

  useEffect(() => {
    const f = async () => {
      let img: GiphyImageData | undefined;
      imageScroller.chunks.forEach(c => {
        const image = c.data.find(d => d.id === imageId)
        if (image) img = image
      })

      if (!img && imageId) img = (await getById(imageId)).data.data
      setImageData(img)
    }
    f()
  }, [imageId])



  return (
    <div className={styles['container']}>
      <div className={styles['card']}>
        {imageData && <Image src={imageData.images.fixed_height.url} skeletonHeight={imageData.images.fixed_height.height + 'px'} skeletonWidth={imageData.images.fixed_height.width + 'px'} />}
        {!imageData && <Skeleton height={200} />}
        <div className={styles['cardText']}>
          {imageData &&
            <div>
              <h2>title: {imageData.title}</h2>
              <h4>width: {imageData.images.fixed_height.width}</h4>
              <h4>height: {imageData.images.fixed_height.height}</h4>
            </div>
          }
          {!imageData && <Skeleton count={16} />}
        </div>
      </div>
    </div>
  )
}