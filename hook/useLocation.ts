'use client'

import { useState, useEffect } from "react";
import { showToastMessage } from "@/utils/helper/index";

export const useLocation = () => {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)

  const onSuccess = (location: any) => {
    setLat(location.coords.latitude)
    setLng(location.coords.longitude)
  }

  const onError = (error: { code: number, message: string }) => {
    console.log('err', error)
    showToastMessage('Bạn phải bật location để có thể checkin', 'info')
  }

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      onError({
        code: 0,
        message: 'GeoLocation not supported'
      })
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }, [lat, lng])

  return { lat, lng }
}