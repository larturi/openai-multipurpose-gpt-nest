import { Test, TestingModule } from '@nestjs/testing';
import { GptController } from '../../src/gpt/gpt.controller';
import { GptService } from '../../src/gpt/gpt.service';
import { Response } from 'express';
import { Readable } from 'stream';
import { HttpStatus } from '@nestjs/common';

describe('GptController', () => {
  let controller: GptController;
  let service: GptService;
  let mockResponseProsConsStream: Partial<Response>;
  let mockResponseTextToAudio: Partial<Response>;

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
});
