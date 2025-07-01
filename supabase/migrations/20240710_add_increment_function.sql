
-- Create a generic increment function
CREATE OR REPLACE FUNCTION increment(row_id UUID, table_name TEXT, column_name TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_value INTEGER;
  query TEXT;
BEGIN
  -- Build dynamic query
  query := 'SELECT ' || quote_ident(column_name) || ' FROM ' || quote_ident(table_name) || ' WHERE id = $1';
  
  -- Execute query and get current value
  EXECUTE query INTO current_value USING row_id;
  
  -- Return incremented value
  RETURN COALESCE(current_value, 0) + 1;
END;
$$;
