import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('upload')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        return {
            url: `${baseUrl}/uploads/${file.filename}`,
        };
    }
}
