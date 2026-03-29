-- Add updated_at column to session_requests
ALTER TABLE public.session_requests 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
DROP TRIGGER IF EXISTS set_updated_at ON public.session_requests;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.session_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Backfill updated_at with created_at for existing rows
UPDATE public.session_requests SET updated_at = created_at WHERE updated_at IS NULL;
