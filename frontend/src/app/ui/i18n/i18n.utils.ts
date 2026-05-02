export const getBrowserLanguage = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language?.split('-')[0];
  const supportedLangs = ['en', 'fr', 'es', 'zh', 'ar', 'pt', 'ru', 'ja', 'de', 'it'];
  return supportedLangs.includes(browserLang) ? browserLang : 'en';
};
