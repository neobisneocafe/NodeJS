import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';

@Injectable()
export class QrcodeService {
  async generateQRCode(uniqueCode: string) {
    const qrCodeDataUrl = await qrcode.toDataURL(uniqueCode);
    return await qrCodeDataUrl;
  }
}
