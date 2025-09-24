-- Add missing auth translations using correct column structure
INSERT INTO translations (key, en, et, ru, category) VALUES
('auth.create_account', 'Create Account', 'Loo konto', 'Создать аккаунт', 'auth'),
('auth.welcome_back', 'Welcome Back', 'Tere tulemast tagasi', 'Добро пожаловать обратно', 'auth'),
('auth.start_journey', 'Start your health journey today', 'Alusta oma tervise teekonda täna', 'Начните свой путь к здоровью сегодня', 'auth'),
('auth.continue_journey', 'Continue your health journey', 'Jätka oma tervise teekonda', 'Продолжите свой путь к здоровью', 'auth'),
('auth.email', 'Email', 'E-post', 'Электронная почта', 'auth'),
('auth.password', 'Password', 'Parool', 'Пароль', 'auth'),
('auth.creating_account', 'Creating Account...', 'Konto loomine...', 'Создание аккаунта...', 'auth'),
('auth.signing_in', 'Signing In...', 'Sisselogimine...', 'Вход в систему...', 'auth'),
('auth.sign_in', 'Sign In', 'Logi sisse', 'Войти', 'auth'),
('auth.already_have_account', 'Already have an account? Sign in', 'Kas teil on juba konto? Logige sisse', 'Уже есть аккаунт? Войти', 'auth'),
('auth.no_account', 'Need an account? Sign up', 'Vajate kontot? Registreeruge', 'Нужен аккаунт? Зарегистрируйтесь', 'auth')

ON CONFLICT (key) DO UPDATE SET 
en = EXCLUDED.en,
et = EXCLUDED.et,
ru = EXCLUDED.ru,
category = EXCLUDED.category,
updated_at = now();