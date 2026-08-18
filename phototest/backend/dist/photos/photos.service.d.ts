import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { CreatePhotoDto } from './create-photo.dto';
export declare class PhotosService {
    private readonly photosRepo;
    constructor(photosRepo: Repository<Photo>);
    findAll(): Promise<Photo[]>;
    findOne(id: number): Promise<Photo>;
    create(dto: CreatePhotoDto, imageUrl: string): Promise<Photo>;
    remove(id: number): Promise<void>;
}
