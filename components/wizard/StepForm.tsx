'use client'
import { useState } from 'react'
import { WizardStepConfig, FormField } from '@/types'
import { Upload, X, Link as LinkIcon } from 'lucide-react'

interface StepFormProps {
  stepConfig: WizardStepConfig
  formData: Record<string, any>
  onChange: (fieldName: string, value: any) => void
}

export function StepForm({ stepConfig, formData, onChange }: StepFormProps) {
  const [dragOver, setDragOver] = useState<string | null>(null)

  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="form-input"
            required={field.required}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="form-textarea"
            required={field.required}
            rows={4}
          />
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="form-input"
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange(field.name, [...selectedValues, option])
                    } else {
                      onChange(field.name, selectedValues.filter(v => v !== option))
                    }
                  }}
                  className="mr-3 rounded border-gray-300 text-bright-blue focus:ring-bright-blue"
                />
                <span className="text-charcoal">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'file':
        return (
          <FileUpload
            fieldName={field.name}
            value={value}
            onChange={onChange}
            dragOver={dragOver === field.name}
            onDragOver={() => setDragOver(field.name)}
            onDragLeave={() => setDragOver(null)}
            multiple={field.name === 'additional_assets'}
          />
        )

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="form-input"
            required={field.required}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {stepConfig.fields.map((field) => (
        <div key={field.name}>
          <label className="form-label">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {renderField(field)}
          
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      ))}
    </div>
  )
}

interface FileUploadProps {
  fieldName: string
  value: any
  onChange: (fieldName: string, value: any) => void
  dragOver: boolean
  onDragOver: () => void
  onDragLeave: () => void
  multiple?: boolean
}

function FileUpload({ 
  fieldName, 
  value, 
  onChange, 
  dragOver, 
  onDragOver, 
  onDragLeave,
  multiple = false 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const uploadedFiles = Array.isArray(value) ? value : (value ? [value] : [])

  const handleFileSelect = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    try {
      const formData = new FormData()
      
      if (multiple) {
        Array.from(files).forEach(file => {
          formData.append('files', file)
        })
      } else {
        formData.append('file', files[0])
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      
      if (multiple) {
        onChange(fieldName, [...uploadedFiles, ...result.files])
      } else {
        onChange(fieldName, result.file)
      }

    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    if (multiple) {
      const newFiles = uploadedFiles.filter((_, i) => i !== index)
      onChange(fieldName, newFiles)
    } else {
      onChange(fieldName, null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver ? 'border-bright-blue bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-bright-blue hover:bg-blue-50'}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          onDragOver()
        }}
        onDragLeave={onDragLeave}
        onDrop={(e) => {
          e.preventDefault()
          onDragLeave()
          handleFileSelect(e.dataTransfer.files)
        }}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-charcoal font-medium">
            {uploading ? 'Uploading...' : 'Drop files here or click to select'}
          </p>
          <p className="text-sm text-gray-500">
            Supports: PDF, DOC, DOCX, PNG, JPG, GIF, ZIP (max 10MB)
          </p>
        </div>
        
        <input
          type="file"
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          id={`file-input-${fieldName}`}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.zip"
        />
        
        {!uploading && (
          <label
            htmlFor={`file-input-${fieldName}`}
            className="inline-block mt-4 btn-secondary cursor-pointer"
          >
            Select Files
          </label>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-charcoal">Uploaded Files:</h4>
          {uploadedFiles.map((file: any, index: number) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-charcoal">
                  {typeof file === 'string' ? file.split('/').pop() : file.name}
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
