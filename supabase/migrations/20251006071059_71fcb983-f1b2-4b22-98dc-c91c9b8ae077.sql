-- Fix Critical Security Issues

-- 1. FIX TRANSLATIONS TABLE - Remove permissive write access
DROP POLICY IF EXISTS "Authenticated users can manage translations" ON public.translations;

-- Create admin-only write policy for translations
CREATE POLICY "Only admins can manage translations"
ON public.translations
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. CREATE AUDIT LOGS TABLE - Move from localStorage to secure database
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  resource_accessed text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (users should NOT see their own audit trail)
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- System can insert audit logs (security definer function will handle this)
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 3. CREATE USER CONSENTS TABLE - Move from localStorage to database
CREATE TABLE IF NOT EXISTS public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  consent_type text NOT NULL,
  consented boolean NOT NULL DEFAULT false,
  version text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, consent_type)
);

-- Enable RLS on user_consents
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Users can view their own consents
CREATE POLICY "Users can view their own consents"
ON public.user_consents
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own consents
CREATE POLICY "Users can create their own consents"
ON public.user_consents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own consents
CREATE POLICY "Users can update their own consents"
ON public.user_consents
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all consents
CREATE POLICY "Admins can view all consents"
ON public.user_consents
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_user_consents_updated_at
BEFORE UPDATE ON public.user_consents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. CREATE ADMIN IMPERSONATION SESSION TABLE - Server-side tracking
CREATE TABLE IF NOT EXISTS public.admin_impersonation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  impersonated_user_id uuid NOT NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '1 hour'),
  ended_at timestamp with time zone,
  reason text,
  CONSTRAINT valid_expiry CHECK (expires_at > started_at)
);

-- Enable RLS
ALTER TABLE public.admin_impersonation_sessions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage impersonation sessions
CREATE POLICY "Only admins can manage impersonation sessions"
ON public.admin_impersonation_sessions
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create index
CREATE INDEX idx_impersonation_admin_user ON public.admin_impersonation_sessions(admin_user_id);
CREATE INDEX idx_impersonation_expires ON public.admin_impersonation_sessions(expires_at);

-- Security definer function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  _user_id uuid,
  _action text,
  _resource_accessed text DEFAULT NULL,
  _ip_address text DEFAULT NULL,
  _user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id uuid;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource_accessed, ip_address, user_agent)
  VALUES (_user_id, _action, _resource_accessed, _ip_address, _user_agent)
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;