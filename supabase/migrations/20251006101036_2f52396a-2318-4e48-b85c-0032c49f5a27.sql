-- Create missing profiles for existing users
INSERT INTO public.profiles (user_id)
SELECT u.id
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify all users now have profiles
DO $$
DECLARE
  user_count INT;
  profile_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  
  RAISE NOTICE 'Users: %, Profiles: %', user_count, profile_count;
  
  IF user_count != profile_count THEN
    RAISE EXCEPTION 'Mismatch: % users but % profiles', user_count, profile_count;
  END IF;
END $$;