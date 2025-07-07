import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * Upload service.
 * Handles uploading image files to Cloudinary.
 */
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private cloudName = 'dnyp5keim';
  private uploadPreset = 'images_preset';

  constructor(private http: HttpClient) {}
  /**
   * Uploads an image file to the configured Cloudinary account.
   *
   * @param file The image file to be uploaded.
   */
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'images_preset');


    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post(url, formData);
  }
}
