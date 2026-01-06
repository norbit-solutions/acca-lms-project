import React from 'react'

function CourseLayout({children}:{children : React.ReactNode }) {
  return (
    <main className="p-6 lg:p-8">
      {children}
    </main>
  )
}

export default CourseLayout
