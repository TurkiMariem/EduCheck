import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      wait: true,
    },
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          homepage: {
            title: {
              p1: "Seamless and Secure Certificate Verification",
              p2: "Tunisia's Trusted Network for Easy Verification",
              p3: "Tunisia's Top Online Platform for Certificate Verification",
              p4: "Reliable and Secure Certificate Verification Made Easy",
              p5: "Tunisia's Most Trusted Network for Certificate Verification"
            },
          sign:{
            conferencier_login: "Conference Director Login",
    password_placeholder: "Password",
    forgot_password: "Forgot your password?",
    sign_in_button: "Sign In",
    register_button: "Register",
    register_inst_button: "Register As Conference Director",
    dont_have_account: "Don't have an account? Register",
    institute_login: "Institute Login",
    institute_register: "Institute Register",
    university_dropdown: "Select your university",
    institute_name: "Institute Name",
    conference_name: "Conference Director Name",
    institute_acronym: "Institute Acronym",
    institute_ref: "Institute Ref",
    officer_email: "Officer Email",
    validator_email: "Validator Email",
    phone_contact: "Phone Contact",
    website: "Website",
    conference_email: "Conference Director Email",
    description: "Describe your self",
    change_password: "Change Password",
    confirm_password: "Confirm Password",
    forgot_password_text: "Forgot Password ?",
    submit_code: "Submit Code",
    organization:"organization",
    already_have_account: "Already have an account? Login",
    confPara: "Enter Your personal details and start your conference with us",
    instPara:"Connect your account to manage the certification of your diplomas !"
          }
        }
      }},
      fr: {
        translation: {
          homepage: {
            title: {
              p1: "Vérification des certificats facile et sécurisée",
              p2: "Réseau de vérification tunisien simple et sécurisé",
              p3: "Plateforme en ligne tunisienne de vérification des certificats",
              p4: "Vérification fiable et sécurisée des certificats",
              p5: "Réseau tunisien de vérification des certificats le plus fiable"
            },
          sign:{
            organization:"organization",
          conference_name: "Nom du Conferencier",
          conferencier_login: "Connexion Conferencier",
          password_placeholder: "Mot de passe",
          forgot_password: "Mot de passe oublié?",
          sign_in_button: "Se connecter",
          register_button: "S'inscrire",
          register_inst_button: "S'inscrire en tant que Conferencier",
          dont_have_account: "Pas encore de compte? S'inscrire",
          institute_login: "Connexion Institut",
          institute_register: "Inscription Institut",
          university_dropdown: "Sélectionnez votre université",
          institute_name: "Nom de l'institut",
          institute_acronym: "Acronyme de l'institut",
          institute_ref: "Référence de l'institut",
          officer_email: "Email de l'officier",
          conference_email: "Email du conferencier",
          validator_email: "Email du validateur",
          phone_contact: "Contact téléphonique",
          website: "Site Web",
          description: "Décrivez-vous",
          change_password: "Changer le mot de passe",
          confirm_password: "Confirmez le mot de passe",
          forgot_password_text: "Mot de passe oublié ?",
          submit_code: "Envoyer le code",
          already_have_account: "Déjà un compte? Se connecter",
          confPara:"Entrez vos coordonnées personnelles et gerer votre conférence avec nous.",
          instPara:"Connectez votre compte pour gérer la certification de vos diplômes !"
          }
        }
      }
  }
}
});
export default i18n;