import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
    constructor (private readonly prisma:PrismaService) {}

    async uploadAndQueueOcr(file: Express.Multer.File,userId:string) {
        if(!file) {
            throw new BadRequestException('Arquivo não enviado');
        }

        const fakeOcrText = `Documento recebido com sucesso.
        Nome do Arquivo: ${file.originalname}
        Tipo: ${file.mimetype}`;

        const document = await this.prisma.document.create ({
            data: {
                originalName:file.originalname,
                mimeType:file.mimetype,
                size:file.size,
                status: 'UPLOADED',
                ocrText: fakeOcrText.trim(),
                filePath: file.path ?? '',
                userId,
            
            },
        });
        return document;

        }

        async listMyDocuments(userId: string) {
            return this.prisma.document.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
        }

        async getDocumentById(documentId: string, userId: string) {
            const doc = await this.prisma.document.findFirst({
                where: {id: documentId, userId },
            });

            if  (!doc) {
                throw new NotFoundException('Documento não encontrado');
            }
            return doc;
        }
}


