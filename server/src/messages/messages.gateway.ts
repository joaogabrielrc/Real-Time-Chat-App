import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  private server!: Server;

  @SubscribeMessage('createMessage')
  public async create(
    @MessageBody() messageForm: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const message = await this.messagesService.create(
      messageForm,
      client.id
    );
    this.server.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  public async findAll() {
    return await this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  public async joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket
  ) {
    return await this.messagesService.identify(name, client.id);
  }

  @SubscribeMessage('typing')
  public async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket
  ) {
    const name = await this.messagesService.getClientName(client.id);
    client.broadcast.emit('typing', { name, isTyping });
  }
}
