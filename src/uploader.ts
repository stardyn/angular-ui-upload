/// <reference types="fine-uploader" />

import {FineUploaderBasic} from 'fine-uploader/lib/core';
import {UploadResponse} from "@/upload-response";

export declare type OnFileUpload = (id: number, path: string, size: number) => void;

export declare type OnFileUploadProgress = (id: number, percent: number, total: number) => void;

export declare type OnFileCompleted = (id: number, res: UploadResponse) => void;

export declare type OnFileError = (id: number, name: string, errorReason: string) => void;

export class Uploader {

  onFileCompleted?: OnFileCompleted;

  onFileUpload?: OnFileUpload;

  onFileError?: OnFileError;

  onFileUploadProgress?: OnFileUploadProgress;

  uploadEndPoint = "";

  uploadFolder = "";

  maxFileSizeMb = 50;

  allowedExtensions: string[] = ['jpeg', 'jpg', 'png'];

  isRandomName: boolean = false;

  isMultiple: boolean = false;

  isDebug: boolean = false;

  isAuthHeader: boolean = false;

  authToken?: string;

  uploadButton?: HTMLElement | null;

  private uploader?: FineUploaderBasic;

  init() {
    const self = this;

    let validation: any = {
      allowedExtensions: this.allowedExtensions,
      sizeLimit: 1024 * 1024 * this.maxFileSizeMb
    };

    //console.log("MaxFileSize -2", validation);

    if (this.uploadButton == null) {
      console.log("UPLOAD BUTTON INVALID")
      return
    }

    self.uploader = new FineUploaderBasic({
      button: this.uploadButton,
      debug: this.isDebug,
      multiple: this.isMultiple,
      request: {
        endpoint: this.uploadEndPoint,
        params: {
          folder: this.uploadFolder,
          randomize: this.isRandomName,
        },
      },
      cors: {
        expected: true
      },
      validation: validation,
      callbacks: {
        onStatusChange: (id: number, oldStatus: string, newStatus: string) => {
          if (self.isDebug) {
            console.log("onStatusChange", id, oldStatus, newStatus);
          }
        },

        onSubmit: (id: number, name: string) => {

          let size = self.uploader?.getSize(id);

          if (size == undefined) {
            size = 0
          }

          if (self.isDebug) {
            console.log("onSubmit", id, name, size);
          }

          if (self.onFileUpload) {
            self.onFileUpload(id, name, size);
          }
          return true;
        },

        onUpload: (id: number, name: string) => {
          const size = self.uploader?.getSize(id);

          if (self.isDebug) {
            console.log("OnUpload", id, name, size);
          }

          //instance.OnFileUpload(id, name, size);
        },

        onProgress: (id: number, name: string, uploadedBytes: number, totalBytes: number) => {
          const progressVal = Math.round(uploadedBytes / totalBytes * 100);
          const progressSize = Math.round(totalBytes / 1024);

          if (self.isDebug) {
            console.log("OnProgress", id, name, progressSize, progressVal);
          }

          if (self.onFileUploadProgress) {
            self.onFileUploadProgress(id, progressVal, progressSize);
          }
        },

        onComplete: (id: number, name: string, responseJson: any) => {

          const res = new UploadResponse(responseJson);

          if (self.isDebug) {
            console.log("onComplete", id, name, responseJson, res);
          }

          if (!res.success) {
            if (self.onFileCompleted) {
              self.onFileCompleted(id, res);
            }
            return false;
          }

          if (self.onFileCompleted) {
            self.onFileCompleted(id, res);
          }

          return true;
        },

        onError: (id: number, name: string, errorReason: string, xhr: any) => {
          if (self.isDebug) {
            console.log("OnError", id, name, errorReason, xhr);
          }

          if (self.onFileError) {
            self.onFileError(id, name, errorReason);
          }
        },
      }
    });

    if (this.isAuthHeader) {
      self.uploader.setCustomHeaders({"Authorization": `Bearer ${this.authToken}`})
    }
  }
}
