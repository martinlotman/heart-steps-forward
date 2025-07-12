
-- Create a table for translations
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  en TEXT NOT NULL,
  et TEXT,
  ru TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(key)
);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to read translations (they're not user-specific)
CREATE POLICY "Anyone can view translations" 
  ON public.translations 
  FOR SELECT 
  TO public
  USING (true);

-- Create a policy for admins to manage translations (for now, allow authenticated users to insert/update)
CREATE POLICY "Authenticated users can manage translations" 
  ON public.translations 
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial translations for common UI elements
INSERT INTO public.translations (key, en, et, ru, category) VALUES
-- Auth page translations
('auth.welcome_back', 'Welcome Back', 'Tere tulemast tagasi', 'Добро пожаловать', 'auth'),
('auth.create_account', 'Create Account', 'Loo konto', 'Создать аккаунт', 'auth'),
('auth.start_journey', 'Start your health journey today', 'Alusta oma tervise teekonda täna', 'Начните свое путешествие к здоровью сегодня', 'auth'),
('auth.continue_journey', 'Sign in to continue your health journey', 'Logi sisse, et jätkata oma tervise teekonda', 'Войдите, чтобы продолжить путь к здоровью', 'auth'),
('auth.email', 'Email', 'E-post', 'Электронная почта', 'auth'),
('auth.password', 'Password', 'Parool', 'Пароль', 'auth'),
('auth.sign_in', 'Sign In', 'Logi sisse', 'Войти', 'auth'),
('auth.sign_up', 'Sign Up', 'Registreeru', 'Зарегистрироваться', 'auth'),
('auth.creating_account', 'Creating Account...', 'Konto loomine...', 'Создание аккаунта...', 'auth'),
('auth.signing_in', 'Signing In...', 'Sisselogimine...', 'Вход...', 'auth'),
('auth.already_have_account', 'Already have an account? Sign in', 'Kas sul on juba konto? Logi sisse', 'У вас уже есть аккаунт? Войти', 'auth'),
('auth.no_account', 'Don''t have an account? Sign up', 'Kas sul pole kontot? Registreeru', 'Нет аккаунта? Зарегистрироваться', 'auth'),
('auth.language', 'Language', 'Keel', 'Язык', 'auth'),

-- Navigation translations
('nav.dashboard', 'Dashboard', 'Armatuurlaud', 'Главная', 'navigation'),
('nav.medications', 'Medications', 'Ravimid', 'Лекарства', 'navigation'),
('nav.health', 'Health', 'Tervis', 'Здоровье', 'navigation'),
('nav.education', 'Education', 'Haridus', 'Образование', 'navigation'),
('nav.profile', 'Profile', 'Profiil', 'Профиль', 'navigation'),

-- Common UI elements
('common.loading', 'Loading...', 'Laadimine...', 'Загрузка...', 'common'),
('common.save', 'Save', 'Salvesta', 'Сохранить', 'common'),
('common.cancel', 'Cancel', 'Tühista', 'Отмена', 'common'),
('common.confirm', 'Confirm', 'Kinnita', 'Подтвердить', 'common'),
('common.back', 'Back', 'Tagasi', 'Назад', 'common'),
('common.next', 'Next', 'Edasi', 'Далее', 'common'),

-- Medical disclaimers
('medical.disclaimer_title', 'Medical Disclaimer', 'Meditsiiniline vastutusest vabastus', 'Медицинский отказ от ответственности', 'medical'),
('medical.disclaimer_text', 'This app is for informational purposes only and does not provide medical advice.', 'See rakendus on ainult informatiivsel eesmärgil ega anna meditsiinilisi nõuandeid.', 'Это приложение предназначено только для информационных целей и не предоставляет медицинских советов.', 'medical'),

-- Dashboard translations
('dashboard.good_morning', 'Good morning', 'Tere hommikust', 'Доброе утро', 'dashboard'),
('dashboard.heart_health_journey', 'Your heart health journey continues', 'Teie südametervislik teekond jätkub', 'Ваше путешествие к здоровью сердца продолжается', 'dashboard'),
('dashboard.emergency', 'Emergency', 'Hädaabi', 'Экстренная помощь', 'dashboard'),
('dashboard.next_medication', 'Next Medication', 'Järgmine ravim', 'Следующее лекарство', 'dashboard'),
('dashboard.daily_tasks', 'Daily Tasks', 'Igapäevased ülesanded', 'Ежедневные задачи', 'dashboard');

-- Add a user preferences table for language settings
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'et', 'ru')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);
