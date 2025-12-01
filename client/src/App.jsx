import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import RemoveObject from './pages/RemoveObject'
import WriteArticle from './pages/WriteArticle'
import RemoveBackground from './pages/RemoveBackground'
import {Toaster} from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-object" element={<RemoveObject />} /> 
          <Route path='remove-background' element={<RemoveBackground />} />
        </Route> 
      </Routes>
    </div>
  )
}

export default App