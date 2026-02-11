import {of, Subject} from 'rxjs';

export const translateServiceMock = {
  instant: (key: string) => key,
  get: (key: string) => of(key),
  stream: (key: string) => of(key),
  onLangChange: new Subject(),
  onTranslationChange: new Subject(),
  onDefaultLangChange: new Subject()
};
