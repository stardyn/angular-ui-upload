// Main entry point for @stardyn/angular-ui-upload package

export { Uploader } from './uploader';
export { UploadResponse } from './upload-response';

export type {
    OnFileUpload,
    OnFileUploadProgress,
    OnFileCompleted,
    OnFileError
} from './uploader';

// Package metadata
declare const __VERSION__: string;
declare const __BUILD_TIME__: string;
declare const __BUILD_ENV__: string;

export const PACKAGE_INFO = {
    name: '@stardyn/angular-ui-upload',
    version: typeof __VERSION__ !== 'undefined' ? __VERSION__ : '2.0.9',
    buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString(),
    buildEnv: typeof __BUILD_ENV__ !== 'undefined' ? __BUILD_ENV__ : 'dev'
};