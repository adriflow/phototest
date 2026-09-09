import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotoService } from './services/photo.service';
import { Photo } from './models/photo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styles: [],
})
export class App implements OnInit {
  photos = signal<Photo[]>([]);
  title = signal('');
  description = signal('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  uploading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  dragOver = signal(false);

  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.photoService.getAll().subscribe({
      next: (photos) => this.photos.set(photos),
      error: () => this.errorMsg.set('No se pudieron cargar las fotografías.'),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.setFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    if (event.dataTransfer?.files.length) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave() {
    this.dragOver.set(false);
  }

  private setFile(file: File) {
    if (!file.type.match(/image\/(jpeg|png|gif|webp)/)) {
      this.errorMsg.set('Solo se permiten imágenes JPG, PNG, GIF y WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMsg.set('El tamaño máximo de archivo es 5MB.');
      return;
    }
    this.selectedFile.set(file);
    this.errorMsg.set('');

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  upload() {
    if (!this.title() || !this.selectedFile()) return;

    this.uploading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.photoService
      .upload(this.title(), this.description(), this.selectedFile()!)
      .subscribe({
        next: () => {
          this.title.set('');
          this.description.set('');
          this.selectedFile.set(null);
          this.previewUrl.set(null);
          this.uploading.set(false);
          this.successMsg.set('¡Fotografía publicada exitosamente en la galería!');
          this.loadPhotos();

          setTimeout(() => this.successMsg.set(''), 4000);
        },
        error: () => {
          this.errorMsg.set('Error al subir la fotografía. Por favor intenta de nuevo.');
          this.uploading.set(false);
        },
      });
  }

  deletePhoto(id: number) {
    this.photoService.delete(id).subscribe({
      next: () => this.loadPhotos(),
      error: () => this.errorMsg.set('Error al eliminar la fotografía.'),
    });
  }

  dismissError() {
    this.errorMsg.set('');
  }
}
