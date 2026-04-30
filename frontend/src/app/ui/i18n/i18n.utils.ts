export const getBrowserLanguage = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language?.split('-')[0];
  return ['fr', 'en'].includes(browserLang) ? browserLang : 'en';
};
