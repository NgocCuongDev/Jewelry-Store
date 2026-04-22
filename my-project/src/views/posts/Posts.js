import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CBadge,
  CAvatar,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilNotes, cilTag, cilSearch, cilInfo, cilSettings, cilImage, cilExternalLink } from '@coreui/icons'
import apiPost from '../../api/apiPost'
import '../../scss/Products.css'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [modal, setModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [activeTab, setActiveTab] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentPost, setCurrentPost] = useState({
    id: null,
    title: '',
    slug: '',
    content: '',
    thumbnail: '',
    type: 'post',
    topicId: 1,
    status: 1,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await apiPost.getAllPosts()
      setPosts(res)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handleAdd = () => {
    setCurrentPost({
      id: null,
      title: '',
      slug: '',
      content: '',
      thumbnail: '',
      type: 'post',
      topicId: 1,
      status: 1,
    })
    setSelectedFile(null)
    setImagePreview(null)
    setEditMode(false)
    setViewMode(false)
    setActiveTab(1)
    setModal(true)
  }

  const handleClose = () => {
    setModal(false)
  }

  const handleEdit = (post) => {
    setCurrentPost(post)
    setSelectedFile(null)
    setImagePreview(getImageUrl(post.thumbnail))
    setEditMode(true)
    setViewMode(false)
    setActiveTab(1)
    setModal(true)
  }

  const handleView = (post) => {
    setCurrentPost(post)
    setEditMode(false)
    setViewMode(true)
    setModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiPost.deletePost(id)
        fetchPosts()
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  const handleSave = async () => {
    try {
      let finalImageUrl = currentPost.thumbnail
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        const uploadRes = await apiPost.uploadImage(formData)
        finalImageUrl = uploadRes.imageUrl
      }
      const postDataToSave = { ...currentPost, thumbnail: finalImageUrl }

      if (editMode) {
        await apiPost.updatePost(currentPost.id, postDataToSave)
      } else {
        await apiPost.addPost(postDataToSave)
      }
      setModal(false)
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }

  const getImageUrl = (img) => {
    if (!img) return '/placeholder-post.png'
    return img.startsWith('http') ? img : `http://localhost:8900/api/post/${img}`
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 product-premium-card">
          <CCardHeader className="d-flex justify-content-between align-items-center premium-card-header">
            <div className="d-flex align-items-center gap-3">
              <div className="header-icon-wrapper" style={{ background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)' }}>
                <CIcon icon={cilNotes} className="header-icon" />
              </div>
              <div>
                <strong className="premium-header-title">Post Management</strong>
                <p className="premium-header-subtitle mb-0">Manage your blog articles and news pages</p>
              </div>
            </div>
            <CButton color="primary" className="premium-add-btn" onClick={handleAdd}>
              <CIcon icon={cilPlus} className="me-2" />
              New Post
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" className="mb-0 border premium-table" hover responsive>
              <CTableHead>
                <CTableRow className="premium-table-header">
                  <CTableHeaderCell className="bg-body-tertiary">Article</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Date</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {posts.map((post) => (
                  <CTableRow key={post.id} className="premium-table-row">
                    <CTableDataCell>
                      <div className="d-flex align-items-center">
                        <CAvatar
                          size="md"
                          src={getImageUrl(post.thumbnail)}
                          className="me-3 premium-avatar shadow-sm"
                        />
                        <div>
                          <div className="fw-semibold product-name text-truncate" style={{ maxWidth: '250px' }}>{post.title}</div>
                          <div className="small text-body-secondary">/{post.slug}</div>
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="light" className="category-badge text-uppercase border">
                        {post.type}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="small">
                      {new Date(post.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge
                        color={post.status === 1 ? 'success' : 'secondary'}
                        className="status-badge"
                      >
                        {post.status === 1 ? 'Published' : 'Draft'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center text-nowrap">
                      <CButton color="warning" size="sm" className="me-2 action-btn action-view" onClick={() => handleView(post)}>
                        <CIcon icon={cilSearch} />
                      </CButton>
                      <CButton color="info" size="sm" className="me-2 action-btn action-edit" onClick={() => handleEdit(post)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" className="action-btn action-delete" onClick={() => handleDelete(post.id)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modal} onClose={handleClose} size="xl" alignment="center" className="product-premium-modal">
        <CModalHeader className="border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="premium-icon-wrapper">
              <CIcon icon={viewMode ? cilSearch : (editMode ? cilPencil : cilPlus)} className="premium-modal-icon" />
            </div>
            <div className="flex-grow-1">
              <CModalTitle className="premium-modal-title">
                {viewMode ? 'Post View' : (editMode ? 'Edit Post' : 'Compose New Post')}
              </CModalTitle>
              <p className="premium-modal-subtitle mb-0">
                {viewMode ? 'Reading article metadata and content' : 'Create engaging content for your audience'}
              </p>
            </div>
          </div>
        </CModalHeader>

        {viewMode ? (
          <CModalBody className="p-4">
             <CRow className="g-4">
                <CCol md={4}>
                    <div className="main-image-container mb-3 shadow-sm">
                        <CImage src={getImageUrl(currentPost.thumbnail)} fluid className="rounded-4" />
                    </div>
                </CCol>
                <CCol md={8}>
                     <CCallout color="info" className="description-callout shadow-sm border-0 bg-white p-4">
                        <div className="category-tag mb-2">
                           <CIcon icon={cilNotes} className="me-1" /> {currentPost.type.toUpperCase()}
                        </div>
                        <h2 className="fw-bold mb-3">{currentPost.title}</h2>
                        <div className="d-flex gap-3 mb-4">
                             <CBadge color="light" className="text-muted"><CIcon icon={cilExternalLink} /> {currentPost.slug}</CBadge>
                             <CBadge color={currentPost.status === 1 ? 'success' : 'secondary'}>
                                {currentPost.status === 1 ? 'Published' : 'Draft'}
                             </CBadge>
                        </div>
                        <hr />
                        <div className="post-content-preview mt-4" style={{ whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>
                            {currentPost.content}
                        </div>
                     </CCallout>
                </CCol>
             </CRow>
          </CModalBody>
        ) : (
          <>
            <CNav variant="tabs" className="px-4 premium-tabs" layout="justified">
              <CNavItem>
                <CNavLink active={activeTab === 1} onClick={() => setActiveTab(1)} className="premium-tab-link">
                  <CIcon icon={cilTag} className="me-2" /> Basic Info
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 2} onClick={() => setActiveTab(2)} className="premium-tab-link">
                  <CIcon icon={cilNotes} className="me-2" /> Content
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 3} onClick={() => setActiveTab(3)} className="premium-tab-link">
                  <CIcon icon={cilImage} className="me-2" /> Media & SEO
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 4} onClick={() => setActiveTab(4)} className="premium-tab-link">
                  <CIcon icon={cilSettings} className="me-2" /> Settings
                </CNavLink>
              </CNavItem>
            </CNav>
            <CModalBody className="px-4 py-4">
              <CTabContent>
                <CTabPane visible={activeTab === 1}>
                  <CRow className="g-4">
                    <CCol md={12}>
                      <div className="form-floating-wrapper">
                        <CFormInput
                          value={currentPost.title}
                          onChange={(e) => {
                            const title = e.target.value
                            setCurrentPost({
                              ...currentPost, 
                              title: title,
                              slug: editMode ? currentPost.slug : generateSlug(title)
                            })
                          }}
                          className="premium-input"
                          placeholder=" "
                          required
                        />
                        <CFormLabel className="premium-label">Article Title</CFormLabel>
                        <div className="input-focus-border"></div>
                      </div>
                    </CCol>
                    <CCol md={12}>
                      <div className="form-floating-wrapper">
                        <CFormInput
                          value={currentPost.slug}
                          onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                          className="premium-input"
                          placeholder=" "
                        />
                        <CFormLabel className="premium-label">URL Slug</CFormLabel>
                        <div className="input-focus-border"></div>
                        <small className="form-hint">Unique identifier for the URL (e.g., my-awesome-post)</small>
                      </div>
                    </CCol>
                  </CRow>
                </CTabPane>
                <CTabPane visible={activeTab === 2}>
                    <div className="form-floating-wrapper textarea-wrapper">
                        <CFormTextarea
                            rows={12}
                            value={currentPost.content}
                            onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                            className="premium-textarea"
                            placeholder=" "
                        />
                        <CFormLabel className="premium-label">Article Content</CFormLabel>
                        <div className="input-focus-border"></div>
                    </div>
                </CTabPane>
                <CTabPane visible={activeTab === 3}>
                  <CRow className="g-4">
                    <CCol md={12}>
                        <div className="form-floating-wrapper">
                            <CFormInput
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setSelectedFile(e.target.files[0])
                                    setImagePreview(URL.createObjectURL(e.target.files[0]))
                                  }
                                }}
                                className="premium-input"
                                placeholder=" "
                            />
                            <CFormLabel className="premium-label">Upload Thumbnail</CFormLabel>
                            <div className="input-focus-border"></div>
                        </div>
                    </CCol>
                    <CCol md={12} className="text-center">
                        <div className="image-preview-large mx-auto mb-2" style={{ width: '100%', maxWidth: '400px', height: '200px' }}>
                             {imagePreview ? (
                               <CImage src={imagePreview} fluid className="rounded-3" />
                             ) : (
                               <div style={{width:'100%', height:'100%', background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center'}}>No Image Selected</div>
                             )}
                        </div>
                    </CCol>
                  </CRow>
                </CTabPane>
                <CTabPane visible={activeTab === 4}>
                  <CRow className="g-4">
                    <CCol md={6}>
                        <div className="form-floating-wrapper">
                            <CFormSelect
                                value={currentPost.type}
                                onChange={(e) => setCurrentPost({ ...currentPost, type: e.target.value })}
                                className="premium-select"
                            >
                                <option value="post">Standard Post</option>
                                <option value="page">Static Page</option>
                            </CFormSelect>
                            <CFormLabel className="premium-label">Post Type</CFormLabel>
                            <div className="input-focus-border"></div>
                        </div>
                    </CCol>
                    <CCol md={6}>
                        <div className="form-floating-wrapper">
                            <CFormSelect
                                value={currentPost.status}
                                onChange={(e) => setCurrentPost({ ...currentPost, status: parseInt(e.target.value) })}
                                className="premium-select"
                            >
                                <option value={1}>Published</option>
                                <option value={0}>Draft</option>
                            </CFormSelect>
                            <CFormLabel className="premium-label">Status</CFormLabel>
                            <div className="input-focus-border"></div>
                        </div>
                    </CCol>
                  </CRow>
                </CTabPane>
              </CTabContent>
            </CModalBody>
          </>
        )}
        <CModalFooter className="border-0 px-4 pb-4">
          <CButton color="secondary" onClick={handleClose} className="premium-cancel-btn">Cancel</CButton>
          {!viewMode && (
            <CButton color="primary" onClick={handleSave} className="premium-submit-btn">
              {editMode ? 'Update Post' : 'Publish Article'}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Posts
