import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import './Login.css'
import Login from './Login'
import Register from './Register'
import { useLanguage } from '../LanguageContext'

const LANGUAGES = ["Українська", "English", "Русский", "Italien", "Français", "Español", "Português", "العربية"];

const translations = {
  English: {
    "auth.welcome": "Hi! Welcome",
    "auth.loginTitle": "LOGIN",
    "auth.registerTitle": "REGISTER",
    "auth.userPlaceholder": "Username or Phone",
    "auth.passPlaceholder": "Password",
    "auth.loginBtn": "Login",
    "auth.noAccount": "Have no account?",
    "auth.registerLink": "Register",
    "auth.nicknamePlaceholder": "Nickname",
    "auth.regPassPlaceholder": "Login password",
    "auth.confirmPassPlaceholder": "Confirm Login password",
    "auth.secPinPlaceholder": "Security Pin",
    "auth.invitePlaceholder": "Invitation Code",
    "auth.registerBtn": "Register",
    "auth.hasAccount": "Already Have account?",
    "auth.loginLink": "Login",
    "login.fillCredentials": "Please enter your username or phone and password",
    "register.required": "Required: ",
    "register.passMin6": "Login password must be at least 6 characters",
    "register.passMismatch": "Passwords do not match",
    "register.pinMin4": "Security pin must be at least 4 characters",
    "common.unableToReachShort": "Unable to reach server",
  },
  "Українська": {
    "auth.welcome": "Привіт! Ласкаво просимо",
    "auth.loginTitle": "УХІД",
    "auth.registerTitle": "РЕЄСТРАЦІЯ",
    "auth.userPlaceholder": "Ім'я користувача або телефон",
    "auth.passPlaceholder": "Пароль",
    "auth.loginBtn": "Увійти",
    "auth.noAccount": "Немає облікового запису?",
    "auth.registerLink": "Реєстрація",
    "auth.nicknamePlaceholder": "Псевдонім",
    "auth.regPassPlaceholder": "Пароль для входу",
    "auth.confirmPassPlaceholder": "Підтвердіть пароль",
    "auth.secPinPlaceholder": "Пін-код безпеки",
    "auth.invitePlaceholder": "Код запрошення",
    "auth.registerBtn": "Зареєструватися",
    "auth.hasAccount": "Вже є акаунт?",
    "auth.loginLink": "Увійти",
    "login.fillCredentials": "Будь ласка, введіть ім'я користувача або телефон та пароль",
    "register.required": "Обов'язково: ",
    "register.passMin6": "Пароль входу має містити щонайменше 6 символів",
    "register.passMismatch": "Паролі не збігаються",
    "register.pinMin4": "Пін-код безпеки має містити щонайменше 4 символи",
    "common.unableToReachShort": "Неможливо зв'язатися із сервером",
  },
  "Русский": {
    "auth.welcome": "Привет! Добро пожаловать",
    "auth.loginTitle": "ВХОД",
    "auth.registerTitle": "РЕГИСТРАЦИЯ",
    "auth.userPlaceholder": "Имя пользователя или телефон",
    "auth.passPlaceholder": "Пароль",
    "auth.loginBtn": "Войти",
    "auth.noAccount": "Нет аккаунта?",
    "auth.registerLink": "Регистрация",
    "auth.nicknamePlaceholder": "Никнейм",
    "auth.regPassPlaceholder": "Пароль",
    "auth.confirmPassPlaceholder": "Подтвердите пароль",
    "auth.secPinPlaceholder": "Пин-код безопасности",
    "auth.invitePlaceholder": "Код приглашения",
    "auth.registerBtn": "Зарегистрироваться",
    "auth.hasAccount": "Уже есть аккаунт?",
    "auth.loginLink": "Войти",
    "login.fillCredentials": "Пожалуйста, введите имя пользователя или телефон и пароль",
    "register.required": "Обязательно: ",
    "register.passMin6": "Пароль должен содержать не менее 6 символов",
    "register.passMismatch": "Пароли не совпадают",
    "register.pinMin4": "Пин-код безопасности должен содержать не менее 4 символов",
    "common.unableToReachShort": "Невозможно связаться с сервером",
  },
  Italien: {
    "auth.welcome": "Ciao! Benvenuto",
    "auth.loginTitle": "ACCEDI",
    "auth.registerTitle": "REGISTRATI",
    "auth.userPlaceholder": "Nome utente o telefono",
    "auth.passPlaceholder": "Password",
    "auth.loginBtn": "Accedi",
    "auth.noAccount": "Non hai un account?",
    "auth.registerLink": "Registrati",
    "auth.nicknamePlaceholder": "Soprannome",
    "auth.regPassPlaceholder": "Password di accesso",
    "auth.confirmPassPlaceholder": "Conferma password",
    "auth.secPinPlaceholder": "PIN di sicurezza",
    "auth.invitePlaceholder": "Codice invito",
    "auth.registerBtn": "Registrati",
    "auth.hasAccount": "Hai già un account?",
    "auth.loginLink": "Accedi",
    "login.fillCredentials": "Inserisci nome utente o telefono e password",
    "register.required": "Obbligatorio: ",
    "register.passMin6": "La password di accesso deve contenere almeno 6 caratteri",
    "register.passMismatch": "Le password non coincidono",
    "register.pinMin4": "Il PIN di sicurezza deve contenere almeno 4 caratteri",
    "common.unableToReachShort": "Impossibile contattare il server",
  },
  "Français": {
    "auth.welcome": "Salut ! Bienvenue",
    "auth.loginTitle": "CONNEXION",
    "auth.registerTitle": "INSCRIPTION",
    "auth.userPlaceholder": "Nom d'utilisateur ou téléphone",
    "auth.passPlaceholder": "Mot de passe",
    "auth.loginBtn": "Connexion",
    "auth.noAccount": "Pas de compte ?",
    "auth.registerLink": "S'inscrire",
    "auth.nicknamePlaceholder": "Pseudo",
    "auth.regPassPlaceholder": "Mot de passe",
    "auth.confirmPassPlaceholder": "Confirmer le mot de passe",
    "auth.secPinPlaceholder": "PIN de sécurité",
    "auth.invitePlaceholder": "Code d'invitation",
    "auth.registerBtn": "S'inscrire",
    "auth.hasAccount": "Déjà un compte ?",
    "auth.loginLink": "Connexion",
    "login.fillCredentials": "Veuillez saisir votre nom d'utilisateur ou téléphone et votre mot de passe",
    "register.required": "Obligatoire : ",
    "register.passMin6": "Le mot de passe doit contenir au moins 6 caractères",
    "register.passMismatch": "Les mots de passe ne correspondent pas",
    "register.pinMin4": "Le PIN de sécurité doit contenir au moins 4 caractères",
    "common.unableToReachShort": "Impossible de joindre le serveur",
  },
  "Español": {
    "auth.welcome": "¡Hola! Bienvenido",
    "auth.loginTitle": "INICIAR SESIÓN",
    "auth.registerTitle": "REGISTRARSE",
    "auth.userPlaceholder": "Usuario o teléfono",
    "auth.passPlaceholder": "Contraseña",
    "auth.loginBtn": "Entrar",
    "auth.noAccount": "¿No tienes cuenta?",
    "auth.registerLink": "Regístrate",
    "auth.nicknamePlaceholder": "Apodo",
    "auth.regPassPlaceholder": "Contraseña de acceso",
    "auth.confirmPassPlaceholder": "Confirmar contraseña",
    "auth.secPinPlaceholder": "PIN de seguridad",
    "auth.invitePlaceholder": "Código de invitación",
    "auth.registerBtn": "Registrarse",
    "auth.hasAccount": "¿Ya tienes cuenta?",
    "auth.loginLink": "Iniciar sesión",
    "login.fillCredentials": "Ingrese su usuario o teléfono y contraseña",
    "register.required": "Obligatorio: ",
    "register.passMin6": "La contraseña de acceso debe tener al menos 6 caracteres",
    "register.passMismatch": "Las contraseñas no coinciden",
    "register.pinMin4": "El PIN de seguridad debe tener al menos 4 caracteres",
    "common.unableToReachShort": "No se pudo contactar con el servidor",
  },
  "Português": {
    "auth.welcome": "Olá! Bem-vindo",
    "auth.loginTitle": "ENTRAR",
    "auth.registerTitle": "REGISTAR",
    "auth.userPlaceholder": "Nome de utilizador ou telefone",
    "auth.passPlaceholder": "Palavra-passe",
    "auth.loginBtn": "Entrar",
    "auth.noAccount": "Não tem conta?",
    "auth.registerLink": "Registar",
    "auth.nicknamePlaceholder": "Alcunha",
    "auth.regPassPlaceholder": "Palavra-passe de acesso",
    "auth.confirmPassPlaceholder": "Confirmar palavra-passe",
    "auth.secPinPlaceholder": "PIN de segurança",
    "auth.invitePlaceholder": "Código de convite",
    "auth.registerBtn": "Registar",
    "auth.hasAccount": "Já tem conta?",
    "auth.loginLink": "Entrar",
    "login.fillCredentials": "Introduza o seu nome de utilizador ou telefone e palavra-passe",
    "register.required": "Obrigatório: ",
    "register.passMin6": "A palavra-passe de acesso deve ter pelo menos 6 caracteres",
    "register.passMismatch": "As palavras-passe não coincidem",
    "register.pinMin4": "O PIN de segurança deve ter pelo menos 4 caracteres",
    "common.unableToReachShort": "Não foi possível contactar o servidor",
  },
  "العربية": {
    "auth.welcome": "أهلاً بك",
    "auth.loginTitle": "تسجيل الدخول",
    "auth.registerTitle": "تسجيل حساب",
    "auth.userPlaceholder": "اسم المستخدم أو الهاتف",
    "auth.passPlaceholder": "كلمة المرور",
    "auth.loginBtn": "دخول",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.registerLink": "تسجيل",
    "auth.nicknamePlaceholder": "اللقب",
    "auth.regPassPlaceholder": "كلمة مرور الدخول",
    "auth.confirmPassPlaceholder": "تأكيد كلمة المرور",
    "auth.secPinPlaceholder": "الرقم السري للأمان",
    "auth.invitePlaceholder": "رمز الدعوة",
    "auth.registerBtn": "تسجيل",
    "auth.hasAccount": "لديك حساب بالفعل؟",
    "auth.loginLink": "تسجيل الدخول",
    "login.fillCredentials": "يرجى إدخال اسم المستخدم أو الهاتف وكلمة المرور",
    "register.required": "مطلوب: ",
    "register.passMin6": "يجب أن تتكون كلمة مرور الدخول من 6 أحرف على الأقل",
    "register.passMismatch": "كلمتا المرور غير متطابقتين",
    "register.pinMin4": "يجب أن يتكون الرقم السري من 4 أحرف على الأقل",
    "common.unableToReachShort": "تعذر الوصول إلى الخادم",
  },
};

const StartPage = ({ onLogin }) => {
  const location = useLocation();
  const inviteCode = new URLSearchParams(location.search).get('invite') || '';
  const [showLogin, setShowLogin] = useState(!inviteCode);
  const { lang, setLang } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(false);

  const t = useCallback((key) => {
    const obj = translations[lang] || translations['English'];
    return obj[key] || translations['English'][key] || key;
  }, [lang]);

  useEffect(() => {
    document.title = showLogin ? t('auth.loginTitle') : t('auth.registerTitle');
  }, [showLogin, t]);

  const handleLangSelect = (langName) => {
    setLang(langName);
    setShowLangModal(false);
  };

  return (
    <div className='main_page'>
        <div className='language_handle'>
            <div>
              <button className='language_btn' onClick={() => setShowLangModal(true)}>
                <i className="fa-solid fa-earth-americas"></i> {lang}
              </button>
            </div>
        </div>
        <div className='welcome_box'>
                <h2>{t('auth.welcome')}</h2>
        </div>
        <div className='auth_switcher'>
            {showLogin ? (
              <Login 
                onShowRegister={() => setShowLogin(false)} 
                onLogin={onLogin}
                t={t}
              />
            ) : (
              <Register 
                onShowLogin={() => setShowLogin(true)} 
                onLogin={onLogin}
                t={t}
                initialInvitationCode={inviteCode}
              />
            )}
        </div>

        {showLangModal && (
          <div className="lang_modal_overlay" onClick={() => setShowLangModal(false)}>
            <div className="lang_modal_content" onClick={(e) => e.stopPropagation()}>
              {LANGUAGES.map((langName, index) => (
                <div 
                  key={index} 
                  className="lang_item" 
                  onClick={() => handleLangSelect(langName)}
                >
                  {langName}
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

export default StartPage;