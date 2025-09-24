import { Template } from 'meteor/templating'
import I18N from 'meteor/ostrio:i18n';
import en from './en.json'

export const i18n = new I18N({
  i18n: {
    settings: {
      defaultLocale: "en",
      en: {
        code: "en",
        isoCode: "en-US",
        name: "English"
      }
    },
    en
  }
});

Template.registerHelper('i18n', function(key, options) {
  return i18n.get(key, options);
})
