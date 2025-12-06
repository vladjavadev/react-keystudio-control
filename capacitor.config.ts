import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vlad.beetle',
  appName: 'react-beetle',
  webDir: 'dist',
  "server":{
    "androidScheme": "http"
  }
};

export default config;
