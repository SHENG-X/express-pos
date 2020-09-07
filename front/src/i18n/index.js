import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from './locales';

const languages = [
  {
    code: 'en-US',
    name: 'English (US)',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
  {
    code: 'zh-Hans',
    name: '简体中文',
  },
];

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en-US',
    fallbackLng: 'en-US',
  });

export { languages };

export default i18n;
