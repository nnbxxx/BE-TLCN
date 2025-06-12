import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { IUser } from 'src/modules/users/users.interface';

// @WebSocketGateway(3006, { cors: true })
@WebSocketGateway({ cors: true })
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger(AppGateway.name);
    constructor(private jwtService: JwtService) { }

    afterInit(server: any): any {
        this.logger.log(server, 'Init socket server');
    }

    async handleConnection(client: Socket & { user: IUser }) {
        const token = client.handshake.headers['authorization']?.replace(
            'Bearer ',
            '',
        );
        if (token) {
            try {
                const decoded = this.jwtService.verify(token);
                client.user = decoded;
            } catch (error) {
                console.log(error);

                client.emit('error', {
                    message: 'Unauthorized',
                });
                // send error message to client
                client.disconnect();
            }
        } else {
            client.emit('error', {
                message: 'Unauthorized',
            });
            client.disconnect();
        }
        this.logger.log(client.id, 'Connected..............................');
    }

    handleDisconnect(client: any) {
        console.log(client, 'disconnected');
    }
}
