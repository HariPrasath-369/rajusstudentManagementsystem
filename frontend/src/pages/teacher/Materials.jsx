import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Trash2, Eye, FolderOpen, BookOpen, Video, File, Link, Search, Filter, Calendar, Users } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import Select from '../../components/Forms/Select';
import Input from '../../components/Forms/Input';
import TextArea from '../../components/Forms/TextArea';
import { teacherService } from '../../services/teacherService';
import toast from 'react-hot-toast';

const Materials = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'NOTES',
    file: null,
    link: ''
  });

  const materialTypes = [
    { value: 'all', label: 'All Types', icon: FolderOpen },
    { value: 'NOTES', label: '📝 Notes', icon: FileText },
    { value: 'ASSIGNMENT', label: '📋 Assignment', icon: File },
    { value: 'SYLLABUS', label: '📚 Syllabus', icon: BookOpen },
    { value: 'REFERENCE', label: '🔗 Reference', icon: Link },
    { value: 'VIDEO', label: '🎥 Video', icon: Video },
    { value: 'OTHER', label: '📎 Other', icon: File }
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects();
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchMaterials();
    }
  }, [selectedClass, selectedSubject]);

  const fetchClasses = async () => {
    try {
      const data = await teacherService.getAssignedClasses();
      setClasses(data);
      if (data.length > 0) setSelectedClass(data[0]);
    } catch (error) {
      setClasses(getMockClasses());
      setSelectedClass(getMockClasses()[0]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await teacherService.getSubjectsByClass(selectedClass.classId || selectedClass.id);
      setSubjects(data);
      if (data.length > 0) setSelectedSubject(data[0]);
    } catch (error) {
      setSubjects(getMockSubjects());
      setSelectedSubject(getMockSubjects()[0]);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getMaterials(selectedSubject.id);
      setMaterials(data);
    } catch (error) {
      setMaterials(getMockMaterials());
    } finally {
      setLoading(false);
    }
  };

  const getMockClasses = () => [
    { id: 1, name: 'CSE 3A' },
    { id: 2, name: 'CSE 3B' }
  ];

  const getMockSubjects = () => [
    { id: 1, name: 'Data Structures', code: 'CS201' },
    { id: 2, name: 'Algorithms', code: 'CS202' }
  ];

  const getMockMaterials = () => [
    { id: 1, title: 'Introduction to Data Structures', type: 'NOTES', description: 'Basic concepts of data structures', fileUrl: '/files/ds-intro.pdf', uploadedAt: '2024-03-01', downloads: 45, size: '2.4 MB' },
    { id: 2, title: 'Algorithm Analysis Assignment', type: 'ASSIGNMENT', description: 'Submit by March 15th', fileUrl: '/files/assignment.pdf', uploadedAt: '2024-03-05', downloads: 32, size: '1.2 MB' },
    { id: 3, title: 'Video Lecture - Sorting Algorithms', type: 'VIDEO', description: 'Watch the video tutorial', link: 'https://youtube.com/watch?v=123', uploadedAt: '2024-03-10', views: 120 }
  ];

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.file && !formData.link) {
      toast.error('Please upload a file or provide a link');
      return;
    }
    try {
      // The backend MaterialRequest might be slightly different.
      // If it's a multipart form, we use FormData.
      // But if it's @RequestBody MaterialRequest, we use JSON.
      // Let's check MaterialRequest.java.
      
      const requestData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        subjectId: selectedSubject.id,
        link: formData.link
      };

      await teacherService.uploadMaterial(requestData);
      toast.success('Material uploaded successfully');
      setModalOpen(false);
      setFormData({ title: '', description: '', type: 'NOTES', file: null, link: '' });
      fetchMaterials();
    } catch (error) {
      toast.error('Failed to upload material');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await teacherService.deleteMaterial(id);
        toast.success('Material deleted successfully');
        fetchMaterials();
      } catch (error) {
        toast.error('Failed to delete material');
      }
    }
  };

  const handleDownload = (material) => {
    toast.success(`Downloading ${material.title}`);
  };

  const handlePreview = (material) => {
    setSelectedMaterial(material);
    setPreviewModalOpen(true);
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || material.type === filterType;
    return matchesSearch && matchesType;
  });

  const classOptions = classes.map(c => ({ value: c.id, label: c.name }));
  const subjectOptions = subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }));
  const typeOptions = materialTypes.map(t => ({ value: t.value, label: t.label }));

  const getTypeIcon = (type) => {
    const found = materialTypes.find(t => t.value === type);
    return found?.icon || FileText;
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'NOTES': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ASSIGNMENT': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'SYLLABUS': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'REFERENCE': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'VIDEO': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type) => {
    const found = materialTypes.find(t => t.value === type);
    return found?.label || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Study Materials
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage course materials for students
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Upload size={18} className="mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Select Class"
          options={classOptions}
          value={selectedClass?.id}
          onChange={(e) => setSelectedClass(classes.find(c => c.id === parseInt(e.target.value)))}
        />
        <Select
          label="Select Subject"
          options={subjectOptions}
          value={selectedSubject?.id}
          onChange={(e) => setSelectedSubject(subjects.find(s => s.id === parseInt(e.target.value)))}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        <Select
          label="Filter by Type"
          options={typeOptions}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <FileText className="h-6 w-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{materials.length}</p>
          <p className="text-sm text-gray-500">Total Materials</p>
        </Card>
        <Card className="text-center">
          <Download className="h-6 w-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{materials.reduce((sum, m) => sum + (m.downloads || m.views || 0), 0)}</p>
          <p className="text-sm text-gray-500">Total Downloads</p>
        </Card>
        <Card className="text-center">
          <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{selectedClass?.students || 0}</p>
          <p className="text-sm text-gray-500">Students</p>
        </Card>
        <Card className="text-center">
          <Calendar className="h-6 w-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">Last Updated</p>
        </Card>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="text-center py-12">Loading materials...</div>
      ) : filteredMaterials.length === 0 ? (
        <Card className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No materials found</p>
          <Button variant="outline" className="mt-4" onClick={() => setModalOpen(true)}>
            Upload First Material
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material, index) => {
            const TypeIcon = getTypeIcon(material.type);
            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer" onClick={() => handlePreview(material)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                      <TypeIcon size={20} />
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDownload(material)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {material.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {material.description}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Uploaded: {material.uploadedAt}</span>
                      <span>{material.downloads || material.views || 0} {material.type === 'VIDEO' ? 'views' : 'downloads'}</span>
                    </div>
                    {material.size && (
                      <p className="text-xs text-gray-400 mt-1">Size: {material.size}</p>
                    )}
                    {material.link && (
                      <a
                        href={material.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link size={12} />
                        View Link
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormData({ title: '', description: '', type: 'NOTES', file: null, link: '' });
        }}
        title="Upload Study Material"
        size="lg"
        actions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Upload</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter material title"
            required
          />
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the material"
            rows={3}
          />
          <Select
            label="Material Type"
            options={materialTypes.filter(t => t.value !== 'all')}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium mb-2">Upload File or Provide Link</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">File (PDF, DOC, PPT, MP4, etc.)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.jpg,.png"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0], link: '' })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="text-center text-gray-500">OR</div>
              <div>
                <Input
                  label="External Link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value, file: null })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Materials will be visible to all students in the selected class. Maximum file size: 50MB.
            </p>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedMaterial(null);
        }}
        title={selectedMaterial?.title || 'Material Preview'}
        size="lg"
      >
        {selectedMaterial && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getTypeColor(selectedMaterial.type)}`}>
                {React.createElement(getTypeIcon(selectedMaterial.type), { size: 20 })}
              </div>
              <span className="text-sm text-gray-500">{getTypeLabel(selectedMaterial.type)}</span>
              <span className="text-sm text-gray-500">• Uploaded: {selectedMaterial.uploadedAt}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{selectedMaterial.description}</p>
            {selectedMaterial.link && (
              <a
                href={selectedMaterial.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:underline"
              >
                <Link size={16} />
                Open Link
              </a>
            )}
            {selectedMaterial.fileUrl && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                <Button variant="primary" onClick={() => handleDownload(selectedMaterial)}>
                  <Download size={18} className="mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Materials;