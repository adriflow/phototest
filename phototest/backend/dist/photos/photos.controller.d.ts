import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './create-photo.dto';
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
    findAll(): Promise<import("./photo.entity").Photo[]>;
    findOne(id: number): Promise<import("./photo.entity").Photo>;
    create(file: Express.Multer.File, dto: CreatePhotoDto): Promise<import("./photo.entity").Photo>;
    remove(id: number): Promise<void>;
}
