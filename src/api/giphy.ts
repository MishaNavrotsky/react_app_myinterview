import axios from 'axios';


const GIPHY_API_KEY = "BPQxDk7fvxwaFbNgBX9xOdvGpBDgEysB"
const GIPHY_API_URL = "https://api.giphy.com/v1"
export const GIPHY_PAGE_LIMIT = '9'


export type GiphyImageData = {
  id: string,
  title: string,
  images:
  Record<
    "original" | "downsized" | "downsized_large" | "downsized_medium" | "downsized_small" | "downsized_still" | "fixed_height" | "fixed_height_downsampled" | "fixed_height_small" | "fixed_height_small_still" | "fixed_height_still" | "fixed_width" | "fixed_width_downsampled" | "fixed_width_small" | "fixed_width_small_still" | "fixed_width_still" | "looping" | "original_still" | "original_mp4" | "preview" | "preview_gif" | "preview_webp" | "hd" | "480w_still",
    { url?: string, height: string, width: string }
  >
}

export type GiphySearchResponse = {
  data: GiphyImageData[],
  pagination: {
    count: number,
    offset: number,
    total_count: number,
  }
}

export const search = async (page: number, query?: string, signal?: AbortSignal) => {
  const url = new URL(query ? `${GIPHY_API_URL}/gifs/search` : `${GIPHY_API_URL}/gifs/trending`)
  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
    limit: GIPHY_PAGE_LIMIT,
    offset: (parseInt(GIPHY_PAGE_LIMIT) * page).toString()
  })
  if (query) params.append('q', query)
  url.search = params.toString();

  return axios.get<GiphySearchResponse>(url.toString(), { signal })
}

export const getById = async (imageId: string) => {
  const url = new URL(`${GIPHY_API_URL}/gifs/${imageId}`)
  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
  })
  url.search = params.toString();

  return axios.get<{data: GiphyImageData}>(url.toString())
}