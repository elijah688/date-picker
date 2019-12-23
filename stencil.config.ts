import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'date-picker',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    }
    ,
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
