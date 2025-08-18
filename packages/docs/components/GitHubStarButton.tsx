'use client'
import React from 'react'

const ImoogleBrandButton = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md border border-gray-600 bg-white px-3 py-0.5 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 ${className}`}
      style={{ height: '28px', minWidth: '114px' }}
    >
      <span className="text-xs font-medium">Powered by imoogle</span>
    </div>
  )
}

export default ImoogleBrandButton
