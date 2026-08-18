import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/photos`);
  }

  upload(title: string, description: string, file: File): Observable<Photo> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    return this.http.post<Photo>(`${this.apiUrl}/photos`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/photos/${id}`);
  }
}
