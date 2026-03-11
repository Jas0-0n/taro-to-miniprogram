import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    async uploadImage(file: any): Promise<string> {
        // 模拟上传逻辑，实际开发中应集成阿里云 OSS 或腾讯云 COS
        console.log('Uploading file:', file.originalname);
        return `https://mock-storage.com/images/${Date.now()}-${file.originalname}`;
    }
}
