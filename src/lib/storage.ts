// Avance Law Partners. Storage & Media Helpers
import { supabase } from "./supabase"

export async function uploadMedia(file: File, folder: string = "uploads") {
  const fileExt = file.name.split(".").pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`

  const { error } = await supabase.storage
    .from("media")
    .upload(fileName, file)
  if (error) {
    throw error
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("media")
    .getPublicUrl(fileName)
  return {
    url: urlData.publicUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  }
}
