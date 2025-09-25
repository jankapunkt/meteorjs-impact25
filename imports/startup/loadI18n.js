import { i18n } from '../i18n/i18n'

export const loadI18n = async (options) => {
  const current = i18n.currentLocale.get();
  if (typeof options[current] !== 'function') {
    throw new Error(`No i18n loader for locale "${current}"`)
  }

  const translations = await options[current]();

  i18n.addl10n({
    [current]: translations.default ? translations.default : translations,
  });
}
