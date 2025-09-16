# @stardyn/angular-ui-upload

Angular UI Upload Package - File upload component with progress tracking and fine-uploader integration for Angular applications.

## Features

- **File Upload with Progress Tracking**: Real-time upload progress monitoring
- **Fine-Uploader Integration**: Built on the reliable fine-uploader library
- **Multiple File Support**: Configure for single or multiple file uploads
- **File Validation**: Size limits, extension filtering, and validation
- **Authentication Support**: Bearer token authentication for secure uploads
- **Event Callbacks**: Comprehensive callback system for upload events
- **TypeScript Support**: Full TypeScript support with type definitions
- **API Response Handling**: Structured API response parsing with UploadResponse class

## Installation

```bash
npm install @stardyn/angular-ui-upload
```

## Quick Start

### 1. Install Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install @angular/core @angular/common fine-uploader @types/fine-uploader
```

### 2. Basic Usage

```typescript
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Uploader, UploadResponse } from '@stardyn/angular-ui-upload';

@Component({
  selector: 'app-upload',
  template: `
    <button #uploadButton>Select Files</button>
    <div *ngIf="uploading">Uploading: {{progress}}%</div>
  `
})
export class UploadComponent {
  @ViewChild('uploadButton') uploadButton!: ElementRef;
  
  uploader = new Uploader();
  uploading = false;
  progress = 0;

  ngAfterViewInit() {
    this.setupUploader();
  }

  private setupUploader() {
    this.uploader.uploadButton = this.uploadButton.nativeElement;
    this.uploader.uploadEndPoint = 'https://your-api.com/upload';
    this.uploader.uploadFolder = 'uploads';
    this.uploader.maxFileSizeMb = 10;
    this.uploader.allowedExtensions = ['jpg', 'png', 'pdf'];

    // Event callbacks
    this.uploader.onFileUpload = (id, path, size) => {
      console.log('File started:', { id, path, size });
      this.uploading = true;
    };

    this.uploader.onFileUploadProgress = (id, percent, total) => {
      console.log('Progress:', percent + '%');
      this.progress = percent;
    };

    this.uploader.onFileCompleted = (id, response: UploadResponse) => {
      console.log('Upload completed:', response);
      this.uploading = false;
      
      if (response.success) {
        console.log('File uploaded successfully:', response.data);
      } else {
        console.error('Upload failed:', response.message);
      }
    };

    this.uploader.onFileError = (id, name, errorReason) => {
      console.error('Upload error:', { id, name, errorReason });
      this.uploading = false;
    };

    // Initialize the uploader
    this.uploader.init();
  }
}
```

### 3. Advanced Configuration

```typescript
export class AdvancedUploadComponent {
  private setupAdvancedUploader() {
    this.uploader.uploadButton = this.uploadButton.nativeElement;
    this.uploader.uploadEndPoint = 'https://your-api.com/upload';
    this.uploader.uploadFolder = 'documents';
    
    // File restrictions
    this.uploader.maxFileSizeMb = 50;
    this.uploader.allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'png'];
    
    // Upload settings
    this.uploader.isMultiple = true;
    this.uploader.isRandomName = true;
    this.uploader.isDebug = false;
    
    // Authentication
    this.uploader.isAuthHeader = true;
    this.uploader.authToken = 'your-jwt-token';

    this.uploader.init();
  }
}
```

## API Reference

### Uploader Class

Main upload handler class.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `uploadEndPoint` | `string` | `""` | Server endpoint for file upload |
| `uploadFolder` | `string` | `""` | Target folder on server |
| `maxFileSizeMb` | `number` | `50` | Maximum file size in MB |
| `allowedExtensions` | `string[]` | `['jpeg', 'jpg', 'png']` | Allowed file extensions |
| `isRandomName` | `boolean` | `false` | Generate random filenames |
| `isMultiple` | `boolean` | `false` | Allow multiple file selection |
| `isDebug` | `boolean` | `false` | Enable debug logging |
| `isAuthHeader` | `boolean` | `false` | Enable authentication header |
| `authToken` | `string` | `undefined` | Bearer token for authentication |
| `uploadButton` | `HTMLElement` | `undefined` | Upload trigger button element |

#### Event Callbacks

| Callback | Parameters | Description |
|----------|------------|-------------|
| `onFileUpload` | `(id: number, path: string, size: number) => void` | Called when upload starts |
| `onFileUploadProgress` | `(id: number, percent: number, total: number) => void` | Called during upload progress |
| `onFileCompleted` | `(id: number, res: UploadResponse) => void` | Called when upload completes |
| `onFileError` | `(id: number, name: string, errorReason: string) => void` | Called on upload error |

#### Methods

| Method | Description |
|--------|-------------|
| `init()` | Initialize the uploader with current configuration |

### UploadResponse Class

Response handler for API calls.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `code` | `number` | HTTP status code or custom code |
| `data` | `any` | Response data |
| `success` | `boolean` | Success status |
| `message` | `string` | Response message |
| `dataItems` | `any` | List items from response |
| `dataItemCount` | `number` | Count of items |

#### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `constructor` | `response: any` | Create UploadResponse from raw response |
| `create` | `params: object` | Static method to create UploadResponse manually |

### Type Definitions

```typescript
// Event callback types
export declare type OnFileUpload = (id: number, path: string, size: number) => void;
export declare type OnFileUploadProgress = (id: number, percent: number, total: number) => void;
export declare type OnFileCompleted = (id: number, res: UploadResponse) => void;
export declare type OnFileError = (id: number, name: string, errorReason: string) => void;
```

## Server Integration

### Expected Server Response Format

The server should return responses in this format:

```json
{
  "success": true,
  "code": 200,
  "message": "File uploaded successfully",
  "data": {
    "filename": "uploaded-file.jpg",
    "path": "/uploads/uploaded-file.jpg",
    "size": 1024000
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "code": 400,
  "message": "File size exceeds limit",
  "data": null
}
```

## Configuration Examples

### Image Upload Only

```typescript
this.uploader.allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
this.uploader.maxFileSizeMb = 5;
this.uploader.isMultiple = true;
```

### Document Upload

```typescript
this.uploader.allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
this.uploader.maxFileSizeMb = 25;
this.uploader.isMultiple = false;
```

### Authenticated Upload

```typescript
this.uploader.isAuthHeader = true;
this.uploader.authToken = localStorage.getItem('authToken');
```

## Error Handling

```typescript
this.uploader.onFileError = (id, name, errorReason) => {
  switch(errorReason) {
    case 'File is too large':
      this.showError('File size exceeds the maximum limit');
      break;
    case 'File has an invalid extension':
      this.showError('File type not supported');
      break;
    default:
      this.showError('Upload failed: ' + errorReason);
  }
};
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- `@angular/core`: Angular core framework
- `@angular/common`: Angular common utilities
- `fine-uploader`: File upload library
- `@types/fine-uploader`: TypeScript definitions

## License

MIT License - see LICENSE file for details.

## Repository

https://github.com/stardyn/angular-ui-upload