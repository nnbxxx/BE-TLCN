import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/modules/users/users.service';

// video tham khao: https://www.youtube.com/watch?v=eEa3u3wyYu4
@WebSocketGateway(parseInt(process.env.PORT_SOCKET, 10) || 8811, {
  cors: { origin: "*" }, transports: ['websocket']
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;
  constructor(private readonly notificationsService: NotificationsService,
    private usersService: UsersService,


  ) { }
  async handleDisconnect(client: Socket) {
    // console.log("🚀 ~ NotificationsGateway ~ handleDisconnect ~ client:", client.id)
    const { _id } = client.handshake.headers
    if (_id) {
      this.usersService.updateSocketId(_id as any)
    }
  }
  afterInit(server: Server) {

  }
  handleConnection(client: Socket) {
    // console.log("🚀 ~ NotificationsGateway ~ handleConnection ~ client:", client.handshake.headers)
    const { _id } = client.handshake.headers
    if (_id) {
      this.usersService.updateSocketId(_id as any, client.id)
    }

  }
  // send all user or room
  sendNotification(message: any, room: string = null) {
    if (room != null)
      this.server.to(room).emit('new-notification', message); // Gửi thông báo tới tất cả các client
    else this.server.emit('new-notification', message); // Gửi thông báo tới tất cả các client
  }

  // cho admin


  //send all user
  @SubscribeMessage('createNotification')
  create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    this.server.emit('receiveNotification', createNotificationDto);
    return this.notificationsService.create(createNotificationDto);
  }
  // send to user have createNotificationDto.userid = x
  @SubscribeMessage('sendNotificationToUser')
  async sendNotificationToSpecificUser(@MessageBody() createNotificationDto: CreateNotificationDto) {
    const { message, title, userId, navigate } = createNotificationDto
    const user: any = await this.usersService.findOne(userId as any);
    const { socketId } = user
    if (socketId) {
      this.server.to(socketId).emit('receiveNotification', createNotificationDto);
    }
    return this.notificationsService.create(createNotificationDto);
  }


}
