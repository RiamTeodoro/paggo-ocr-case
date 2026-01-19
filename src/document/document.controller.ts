import { Controller, Post, UseGuards, UseInterceptors, UploadedFile,Get, Param, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DocumentService } from './document.service'; 


@Controller('document')
export class DocumentController {
    constructor (private readonly documentService: DocumentService){}

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile()file: Express.Multer.File,@Req() req: any)  {
        const userId = req.user.sub;
        return this.documentService.uploadAndQueueOcr(file,userId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get()
    list(@Req()req:any){
        const userId = req.user.sub;
        return this.documentService.listMyDocuments(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getById(@Param('id')id:string,@Req() req: any) {
        const userId = req.user.sub;
        return this.documentService.getDocumentById(id, userId);
    }
}

