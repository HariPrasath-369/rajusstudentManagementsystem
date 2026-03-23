import api, { uploadFile, downloadFile } from './api';

export const fileService = {
  // Upload file
  uploadFile: async (file, folder = null, onProgress) => {
    let url = '/files/upload';
    if (folder) {
      url += `?folder=${folder}`;
    }
    return await uploadFile(url, file, onProgress);
  },

  // Download file
  downloadFile: async (fileName, customName = null) => {
    const filename = customName || fileName;
    await downloadFile(`/files/download/${fileName}`, filename);
  },

  // View file (opens in new tab)
  viewFile: async (fileName) => {
    const token = localStorage.getItem('sms_auth_token');
    const url = `${process.env.REACT_APP_API_URL}/files/view/${fileName}`;
    window.open(url, '_blank');
  },

  // Delete file
  deleteFile: async (fileName) => {
    return await api.delete(`/files/${fileName}`);
  },

  // Get file info
  getFileInfo: async (fileName) => {
    return await api.get(`/files/info/${fileName}`);
  },

  // Get list of files in a folder
  getFilesInFolder: async (folder) => {
    return await api.get(`/files/folder/${folder}`);
  },

  // Upload study material (Teacher)
  uploadStudyMaterial: async (materialData, file, onProgress) => {
    const formData = new FormData();
    formData.append('title', materialData.title);
    formData.append('description', materialData.description);
    formData.append('type', materialData.type);
    formData.append('subjectId', materialData.subjectId);
    formData.append('classId', materialData.classId);
    if (file) {
      formData.append('file', file);
    }
    if (materialData.link) {
      formData.append('link', materialData.link);
    }
    
    return await api.post('/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Get study materials (Student)
  getStudyMaterials: async (subjectId) => {
    return await api.get(`/materials/subject/${subjectId}`);
  },

  // Get materials by teacher
  getMaterialsByTeacher: async (teacherId) => {
    return await api.get(`/materials/teacher/${teacherId}`);
  },

  // Delete study material (Teacher)
  deleteStudyMaterial: async (materialId) => {
    return await api.delete(`/materials/${materialId}`);
  },

  // Download study material
  downloadStudyMaterial: async (materialId, fileName) => {
    await downloadFile(`/materials/download/${materialId}`, fileName);
  },

  // Upload assignment (Student)
  uploadAssignment: async (assignmentId, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return await uploadFile(`/assignments/${assignmentId}/submit`, formData, onProgress);
  },

  // Download assignment template (Teacher)
  downloadAssignmentTemplate: async (assignmentId) => {
    await downloadFile(`/assignments/${assignmentId}/template`, `assignment_${assignmentId}_template.xlsx`);
  },

  // Upload bulk data via Excel (Admin/HOD)
  uploadBulkData: async (type, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return await uploadFile(`/bulk-upload/${type}`, formData, onProgress);
  },

  // Download bulk upload template
  downloadBulkTemplate: async (type) => {
    await downloadFile(`/bulk-upload/${type}/template`, `${type}_template.xlsx`);
  },
};