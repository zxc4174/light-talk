import { GenerateAnswerParams, Provider } from '../types';

export abstract class BaseProvider implements Provider {
  constructor(protected token: string, protected model: string) {}

  abstract generateAnswer(params: GenerateAnswerParams): Promise<{ cleanup?: () => void }>;
}

