import '@angular/compiler';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';
import { PhotoService } from './services/photo.service';
import { of } from 'rxjs';

describe('App Component', () => {
  let photoServiceMock: any;
  let component: App;

  beforeEach(() => {
    photoServiceMock = {
      getAll: () => of([]),
      upload: () => of({ id: 1, title: 'Test', imageUrl: 'data:image/png;base64,', createdAt: new Date().toISOString() }),
      delete: () => of(undefined),
    };
    component = new App(photoServiceMock as PhotoService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty photos or load photos', () => {
    component.ngOnInit();
    expect(component.photos()).toEqual([]);
  });

  it('should dismiss error message', () => {
    component.errorMsg.set('Test error');
    component.dismissError();
    expect(component.errorMsg()).toBe('');
  });
});
