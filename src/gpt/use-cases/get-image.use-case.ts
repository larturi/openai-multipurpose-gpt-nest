import * as path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

export const getImageUseCase = (fileName: string) => {
  const imageFile = path.resolve(__dirname, '../../../generated/images/', `${fileName}`);

  const fileExists = fs.existsSync(imageFile);

  if (!fileExists) throw new NotFoundException(`Image ${fileName} not found`);

  return imageFile;
};
