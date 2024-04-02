import * as path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

export const textToAudioGetterUseCase = async (idFile: string) => {
  const speechFile = path.resolve(__dirname, '../../../generated/audios/', `${idFile}.mp3`);

  const fileExists = fs.existsSync(speechFile);

  if (!fileExists) throw new NotFoundException(`File ${idFile} not found`);

  return speechFile;
};
