import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';


export default function Image(props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { skeletonLinesCount?: number, skeletonHeight?: string | number, skeletonWidth?: string | number }) {
  const [loading, setLoading] = useState(true)

  const { skeletonLinesCount, skeletonHeight, skeletonWidth, ...imageProps } = props

  return (
    <>
      <img
        {...imageProps}
        style={
          loading ? { ...(imageProps.style || {}), display: 'none' } : imageProps.style
        }
        onLoad={() => setLoading(false)}
      />
      {loading && <Skeleton height={skeletonHeight} count={skeletonLinesCount} width={skeletonWidth} />}
    </>
  )
}