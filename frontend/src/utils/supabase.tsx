import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://inrnyartmickubjmvefw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlucm55YXJ0bWlja3Viam12ZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDg4NTgsImV4cCI6MjA1OTc4NDg1OH0.VQpniq5MHTwMLgMzrVZsiYH04rHYuXpqZRUrtTnNqfk'
)