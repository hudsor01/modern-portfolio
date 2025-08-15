import React from 'react'
import { notFound } from 'next/navigation'

// This is needed to handle any 404s that occur in this route group
const MainContentNotFound = React.memo(function MainContentNotFound() {
  notFound()
})

export default MainContentNotFound
