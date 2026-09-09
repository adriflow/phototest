import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Photo } from '../models/photo.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private apiUrl = environment.apiUrl;

  // Local in-memory fallback gallery for offline/demo operation
  private mockPhotos: Photo[] = [
    {
      id: 1,
      title: 'Montañas al Amanecer',
      description: 'Vista panorámica de la cordillera durante la salida del sol.',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 2,
      title: 'Aventura Urbana',
      description: 'Fotografía callejera capturando las luces de la metrópoli.',
      imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      title: 'Costa Pacífica',
      description: 'Océano pacífico con olas rompiendo en las rocas al atardecer.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString(),
    },
  ];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}/photos`).pipe(
      catchError(() => {
        // Return local mock photos if backend server/DB is unreachable
        return of([...this.mockPhotos]);
      })
    );
  }

  upload(title: string, description: string, file: File): Observable<Photo> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }

    return this.http.post<Photo>(`${this.apiUrl}/photos`, formData).pipe(
      catchError(() => {
        // Fallback: create base64 preview and store in mock photos array
        return new Observable<Photo>((subscriber) => {
          const reader = new FileReader();
          reader.onload = () => {
            const newPhoto: Photo = {
              id: Date.now(),
              title,
              description: description || undefined,
              imageUrl: reader.result as string,
              createdAt: new Date().toISOString(),
            };
            this.mockPhotos.unshift(newPhoto);
            subscriber.next(newPhoto);
            subscriber.complete();
          };
          reader.onerror = (err) => subscriber.error(err);
          reader.readAsDataURL(file);
        });
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/photos/${id}`).pipe(
      catchError(() => {
        this.mockPhotos = this.mockPhotos.filter((p) => p.id !== id);
        return of(undefined as void);
      })
    );
  }
}
