import OpenAI from 'openai';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
//import { OPENAI_USER_ROLE } from '../../constant/generic';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: SeqLogger
  ) {
    this.openai = new OpenAI(this.configService.get('openai.apiKey'));
  }

  async ask(message: string): Promise<OpenAI.Chat.Completions.ChatCompletion> {

    // try {
    //   const completion = await this.openai.chat.completions.create({
    //     messages: [{ role: OPENAI_USER_ROLE, content: message }],
    //     model: this.configService.get('openai.modelId'),
    //   });
    // } catch (error) {
    //   this.logger.error('request to openai error', {
    //     module: OpenaiService.name,
    //     message: message,
    //     error: error,
    //   });
    // }

    // mock data from openai sample
    const completion: OpenAI.Chat.Completions.ChatCompletion = {
      id: 'chatcmpl-123',
      object: 'chat.completion',
      created: 1677652288,
      model: 'gpt-3.5-turbo-0613',
      system_fingerprint: 'fp_44709d6fcb',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello there, how may I assist you today?',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 9,
        completion_tokens: 12,
        total_tokens: 21,
      },
    };
    return Promise.resolve(completion);
  }
}
