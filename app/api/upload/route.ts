import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/gif',
  'application/zip'
]

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const file = formData.get('file') as File

    // Handle single or multiple files
    const filesToUpload = files.length > 0 ? files : (file ? [file] : [])

    if (filesToUpload.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadedFiles = []

    for (const fileToUpload of filesToUpload) {
      // Validate file size
      if (fileToUpload.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: `File ${fileToUpload.name} exceeds maximum size of 10MB` 
        }, { status: 400 })
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(fileToUpload.type)) {
        return NextResponse.json({ 
          error: `File type ${fileToUpload.type} is not allowed` 
        }, { status: 400 })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(7)
      const extension = fileToUpload.name.split('.').pop()
      const fileName = `${user.id}/${timestamp}-${randomString}.${extension}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(fileName, fileToUpload, {
          contentType: fileToUpload.type,
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ 
          error: `Failed to upload ${fileToUpload.name}` 
        }, { status: 500 })
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName)

      uploadedFiles.push({
        name: fileToUpload.name,
        url: publicUrl,
        size: fileToUpload.size,
        type: fileToUpload.type
      })
    }

    // Return appropriate response based on single or multiple files
    if (files.length > 0) {
      return NextResponse.json({ files: uploadedFiles })
    } else {
      return NextResponse.json({ file: uploadedFiles[0] })
    }

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
