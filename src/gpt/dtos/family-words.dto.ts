import { IsInt, IsOptional, IsString } from 'class-validator';

export class FamilyWordsDto {
  @IsString()
  readonly word: string;

  @IsInt()
  @IsOptional()
  readonly maxTokens: number;
}
