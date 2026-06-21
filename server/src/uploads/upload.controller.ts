import { Controller, Post, UseInterceptors, UploadedFiles, UseGuards, Logger, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('uploads')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = join(process.cwd(), 'uploads');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return callback(
            new BadRequestException('อนุญาตให้อัปโหลดเฉพาะไฟล์รูปภาพ (jpg, jpeg, png, webp) เท่านั้น'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    this.logger.log(`Received ${files?.length || 0} files`);
    if (!files || files.length === 0) {
      throw new BadRequestException('ไม่พบไฟล์ที่อัปโหลด');
    }
    const urls = files.map((file) => `/uploads/${file.filename}`);
    return { urls };
  }
}
