import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { CreatePhotoDto } from './create-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photosRepo: Repository<Photo>,
  ) {}

  async findAll(): Promise<Photo[]> {
    return this.photosRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Photo> {
    const photo = await this.photosRepo.findOneBy({ id });
    if (!photo) throw new NotFoundException(`Photo #${id} not found`);
    return photo;
  }

  async create(dto: CreatePhotoDto, imageUrl: string): Promise<Photo> {
    const photo = this.photosRepo.create({ ...dto, imageUrl });
    return this.photosRepo.save(photo);
  }

  async remove(id: number): Promise<void> {
    const photo = await this.findOne(id);
    await this.photosRepo.remove(photo);
  }
}
