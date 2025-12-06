import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://fdxdpsdgcdcgiyijmqrl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGRwc2RnY2RjZ2l5aWptcXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzQ4MTMsImV4cCI6MjA4MDIxMDgxM30.qdhuXiczy3sxbPiAaMP1O0seSnIg9FC27TKYPCM9nr8'

console.log('Supabase Client Initialized with:', supabaseUrl)

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
