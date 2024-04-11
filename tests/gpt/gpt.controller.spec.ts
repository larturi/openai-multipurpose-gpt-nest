import { Test, TestingModule } from '@nestjs/testing';
import { GptController } from '../../src/gpt/gpt.controller';
import { GptService } from '../../src/gpt/gpt.service';
import { Response } from 'express';
import { Readable } from 'stream';
import { HttpStatus } from '@nestjs/common';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto } from 'src/gpt/dtos';

describe('GptController', () => {
  let controller: GptController;
  let service: GptService;
  let mockResponseProsConsStream: Partial<Response>;
  let mockResponseTextToAudio: Partial<Response>;
  let mockResponseGetImage: Partial<Response>;

  beforeEach(async () => {
    mockResponseProsConsStream = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      write: jest.fn(),
      end: jest.fn(),
    };

    mockResponseTextToAudio = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendFile: jest.fn(),
    };

    mockResponseGetImage = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GptController],
      providers: [
        {
          provide: GptService,
          useValue: {
            orthographyCheck: jest.fn().mockResolvedValue({}),
            prosConsDiscusser: jest.fn().mockResolvedValue({}),
            prosConsDiscusserStream: jest.fn().mockImplementation(() => {
              const chunks = [
                { choices: [{ delta: { content: 'Pro argumento 1' } }] },
                { choices: [{ delta: { content: 'Con argumento 1' } }] },
              ];
              return Readable.from(chunks);
            }),
            familyWords: jest.fn().mockResolvedValue({}),
            translate: jest.fn().mockResolvedValue({}),
            textToAudio: jest.fn().mockResolvedValue('/path/to/fake-audio.mp3'),
            audioToText: jest.fn().mockResolvedValue('Transcription result'),
            imageGeneration: jest.fn().mockResolvedValue({
              url: 'http://example.com/generated-image.png',
              openAIUrl: 'http://example.com/generated-image.png',
              revised_prompt: 'Revised prompt',
            }),
            getGeneratedImage: jest.fn().mockReturnValue('1712498822085.png'),
            gererateImageVariation: jest.fn().mockResolvedValue({
              url: `${process.env.SERVER_URL}/gpt/image-generation/1712585433163.png`,
              openAiUrl: 'https://oaidalleapiprodscus.blob.core.windows.net/private/mock',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<GptController>(GptController);
    service = module.get<GptService>(GptService);
  });

  it('should call orthographyCheck method', async () => {
    const dto = {
      prompt: 'Lo mas inportante en la vida es pazarla vien',
      maxTokens: 500,
    };
    await controller.orthographyCheck(dto);
    expect(service.orthographyCheck).toHaveBeenCalledWith(dto);
  });

  it('should call prosConsDiscusser method', async () => {
    const dto = {
      prompt: 'Que es mejor para nest, express o fastify?',
      maxTokens: 500,
    };
    await controller.prosConsDiscusser(dto);
    expect(service.prosConsDiscusser).toHaveBeenCalledWith(dto);
  });

  it('should stream data through Response object', async () => {
    const dto = {
      prompt: 'Que es mejor para nest, express o fastify?',
      maxTokens: 500,
    };

    await controller.prosConsDicusserStream(dto, mockResponseProsConsStream as Response);

    expect(service.prosConsDiscusserStream).toHaveBeenCalledWith(dto);
    expect(mockResponseProsConsStream.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json',
    );
    expect(mockResponseProsConsStream.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponseProsConsStream.write).toHaveBeenCalledWith('Pro argumento 1');
    expect(mockResponseProsConsStream.write).toHaveBeenCalledWith('Con argumento 1');
    expect(mockResponseProsConsStream.end).toHaveBeenCalled();
  });

  it('should call familyWords method', async () => {
    await controller.familyWords();
    expect(service.familyWords).toHaveBeenCalled();
  });

  it('should call translate method', async () => {
    const dto = {
      prompt: 'Es un placer conocerte',
      lang: 'ingles',
    };

    await controller.translate(dto);
    expect(service.translate).toHaveBeenCalled();
  });

  it('should call textToAudio method', async () => {
    const dto = {
      prompt: 'Saludos a todos, mi nombre es Leandro Arturi',
      voice: 'nova',
    };

    await controller.textToAudio(dto, mockResponseTextToAudio as Response);

    expect(service.textToAudio).toHaveBeenCalledWith(dto);
    expect(mockResponseTextToAudio.setHeader).toHaveBeenCalledWith('Content-Type', 'audio/mp3');
    expect(mockResponseTextToAudio.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponseTextToAudio.sendFile).toHaveBeenCalledWith('/path/to/fake-audio.mp3');
  });

  it('should process an audio file and return the transcription', async () => {
    const mockFileAudioToText: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'testaudio.mp3',
      encoding: '7bit',
      mimetype: 'audio/mp3',
      destination: './generated/uploads',
      filename: '1577836800000.mp3',
      path: './generated/uploads/1577836800000.mp3',
      size: 1024 * 1024,
      stream: new Readable(),
      buffer: undefined,
    };

    const audioToTextDto: AudioToTextDto = {
      prompt: 'prompt',
    };

    const result = await controller.audioToText(mockFileAudioToText, audioToTextDto);

    expect(service.audioToText).toHaveBeenCalledWith(mockFileAudioToText, audioToTextDto);
    expect(result).toEqual('Transcription result');
  });

  it('should call imageGeneration method and return image URL', async () => {
    const imageGenerationDto: ImageGenerationDto = {
      prompt: 'A beautiful landscape',
    };

    const result = await controller.imageGeneration(imageGenerationDto);

    expect(service.imageGeneration).toHaveBeenCalledWith(imageGenerationDto);

    expect(result).toEqual({
      url: 'http://example.com/generated-image.png',
      openAIUrl: 'http://example.com/generated-image.png',
      revised_prompt: 'Revised prompt',
    });
  });

  it('should send an image file: /image-generation/:fileName', async () => {
    const fileName = '1712498822085.png';
    await controller.getGeneratedImage(mockResponseGetImage as Response, fileName);

    expect(service.getGeneratedImage).toHaveBeenCalledWith(fileName);
    expect(mockResponseGetImage.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
    expect(mockResponseGetImage.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponseGetImage.sendFile).toHaveBeenCalledWith('1712498822085.png');
  });

  it('should call generateImageVariation method and return image URL', async () => {
    const imageVariationDto: ImageVariationDto = {
      baseImage: `${process.env.SERVER_URL}/gpt/image-generation/1712585433163.png`,
    };

    const result = await controller.imageVariation(imageVariationDto);

    expect(service.gererateImageVariation).toHaveBeenCalledWith(imageVariationDto);

    expect(result).toEqual({
      url: `${process.env.SERVER_URL}/gpt/image-generation/1712585433163.png`,
      openAiUrl: 'https://oaidalleapiprodscus.blob.core.windows.net/private/mock',
    });
  });
});
