import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  private messages: Message[] = [{ name: 'Robot', text: 'heyooo' }];
  private clientToUser = {};

  public create(createMessageDto: CreateMessageDto) {
    // TODO: to be improved
    const message = createMessageDto;
    this.messages.push(message);
    return message;
  }

  public findAll() {
    return this.messages;
  }

  public identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  public getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
