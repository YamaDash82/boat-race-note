import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AppendNewUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === "body") {
      const paramNames = [
        "username", 
        "password"
      ];

      paramNames.forEach(paramName => {
        if (!(paramName in value) || !value[paramName]) throw new BadRequestException(`${paramName}がセットされていません。`);
      });
    }

    return value;
  }
}
