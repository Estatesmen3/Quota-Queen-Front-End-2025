
-- Function to log call events
CREATE OR REPLACE FUNCTION log_call_event(
  p_call_id UUID,
  p_log_type TEXT,
  p_message TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO call_logs (call_id, log_type, message)
  VALUES (p_call_id, p_log_type, p_message);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all calls for a user efficiently
CREATE OR REPLACE FUNCTION get_user_calls(user_id UUID)
RETURNS SETOF calls AS $$
BEGIN
  -- Return calls created by the user
  RETURN QUERY
  SELECT DISTINCT c.*
  FROM calls c
  LEFT JOIN call_participants cp ON c.id = cp.call_id
  WHERE c.created_by = user_id 
     OR c.host_id = user_id
     OR cp.user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle joining a call
CREATE OR REPLACE FUNCTION join_call(
  p_call_id UUID,
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_call calls;
  v_participant call_participants;
  v_action TEXT := 'none';
BEGIN
  -- Check if user is already a participant
  SELECT * INTO v_participant
  FROM call_participants
  WHERE call_id = p_call_id AND user_id = p_user_id;
  
  -- If not already a participant, add them
  IF v_participant IS NULL THEN
    INSERT INTO call_participants (call_id, user_id, role, joined_at)
    VALUES (p_call_id, p_user_id, 'participant', NOW())
    RETURNING * INTO v_participant;
    
    v_action := 'joined';
  ELSIF v_participant.joined_at IS NULL THEN
    -- If already a participant but haven't joined yet, update joined_at
    UPDATE call_participants
    SET joined_at = NOW()
    WHERE id = v_participant.id
    RETURNING * INTO v_participant;
    
    v_action := 'rejoined';
  ELSE
    v_action := 'already_joined';
  END IF;
  
  -- Get call details
  SELECT * INTO v_call
  FROM calls
  WHERE id = p_call_id;
  
  -- Update call status to in_progress if scheduled
  IF v_call.status = 'scheduled' THEN
    UPDATE calls
    SET status = 'in_progress', started_at = NOW()
    WHERE id = p_call_id
    RETURNING * INTO v_call;
  END IF;
  
  -- Return results
  RETURN jsonb_build_object(
    'action', v_action,
    'call', to_jsonb(v_call),
    'participant', to_jsonb(v_participant)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a call with participants
CREATE OR REPLACE FUNCTION create_call(
  p_title TEXT,
  p_description TEXT,
  p_scheduled_at TIMESTAMPTZ,
  p_call_type TEXT,
  p_user_id UUID,
  p_participants UUID[]
) RETURNS JSONB AS $$
DECLARE
  v_call calls;
  v_host_participant call_participants;
BEGIN
  -- Create the call entry
  INSERT INTO calls (
    title,
    description,
    scheduled_at,
    call_type,
    created_by,
    host_id,
    status
  )
  VALUES (
    p_title,
    p_description,
    p_scheduled_at,
    p_call_type,
    p_user_id,
    p_user_id,
    CASE WHEN p_scheduled_at IS NULL THEN 'in_progress' ELSE 'scheduled' END
  )
  RETURNING * INTO v_call;
  
  -- Add the creator as a participant with host role
  INSERT INTO call_participants (
    call_id,
    user_id,
    role,
    joined_at
  )
  VALUES (
    v_call.id,
    p_user_id,
    'host',
    CASE WHEN p_scheduled_at IS NULL THEN NOW() ELSE NULL END
  )
  RETURNING * INTO v_host_participant;
  
  -- Add additional participants if any
  IF array_length(p_participants, 1) > 0 THEN
    INSERT INTO call_participants (call_id, user_id, role)
    SELECT v_call.id, participant_id, 'participant'
    FROM unnest(p_participants) AS participant_id;
  END IF;
  
  -- Return the newly created call
  RETURN jsonb_build_object(
    'call', to_jsonb(v_call),
    'host_participant', to_jsonb(v_host_participant)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
