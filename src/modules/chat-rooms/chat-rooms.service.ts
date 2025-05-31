import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import {
    ChatRoom,
    ChatRoomDocument,
} from 'src/modules/chat-rooms/schemas/chat-room.schemas';
import { IUser } from 'src/modules/users/users.interface';
import {
    Message,
    MessageDocument,
} from 'src/modules/message/schemas/message.schemas';
import { MESSAGE_TYPES } from 'src/constants/schema.enum';
import { paginate } from 'src/helpers';
import { AppGateway } from 'src/gateway/app.gateway';

@Injectable()
export class ChatRoomsService {
    constructor(
        @InjectModel(ChatRoom.name)
        private chatRoomModel: SoftDeleteModel<ChatRoomDocument>,
        @InjectModel(Message.name)
        private messageModel: SoftDeleteModel<MessageDocument>,
        private readonly appGateway: AppGateway,
    ) {}

    private generateRoomKey(userId: string) {
        return `GROUP_OF_${userId}`;
    }

    private generateRoomName(userName: string) {
        return `Group of ${userName}`;
    }

    findAll({ currentPage, limit }) {
        return paginate<ChatRoom>(this.chatRoomModel, {
            currentPage,
            limit,
            population: [
                {
                    path: 'lastMessage',
                    populate: [{ path: 'sender', select: ['email', 'name'] }],
                },
                {
                    path: 'members',
                    select: ['email', 'name', 'avatar', 'role'],
                },
            ],
        });
    }

    async joinRoom(user: IUser, chatRoom: string) {
        const isExist = await this.chatRoomModel.exists({
            _id: chatRoom,
            members: user._id,
        });
        if (!isExist) {
            const newMessage = await this.messageModel.create({
                chatRoom,
                messageType: MESSAGE_TYPES.TEXT,
                content: `Admin ${user.name} đã tham gia cuộc trò chuyện`,
                isRead: true,
                isSystem: true,
            });

            await this.chatRoomModel.updateOne(
                { _id: chatRoom },
                {
                    $addToSet: { members: user._id },
                    lastMessage: newMessage._id,
                },
            );
        }
    }

    async clientGetChatRoom(user: IUser) {
        const roomKey = this.generateRoomKey(user._id);

        let chatRoom = await this.chatRoomModel.findOne({ roomKey });
        if (!chatRoom) {
            chatRoom = await this.chatRoomModel.create({
                roomKey,
                roomName: this.generateRoomName(user.name),
                members: [user._id],
            });
            const chatRoomPopulated = await chatRoom.populate('members', [
                'email',
                'name',
                'avatar',
                'role',
            ]);
            console.log(chatRoomPopulated);
            this.appGateway.server.emit(`new-chat-room`, chatRoomPopulated);

            const newMessage = await this.messageModel.create({
                chatRoom: chatRoom._id,
                messageType: MESSAGE_TYPES.TEXT,
                content: 'Xin chào! Sắc có thể hỗ trợ điều gì cho bạn?',
                isRead: true,
                isSystem: true,
            });

            await this.chatRoomModel.updateOne(
                { _id: chatRoom._id },
                { lastMessage: newMessage._id },
            );
        }

        return chatRoom;
    }

    findOne(id: number) {
        return `This action returns a #${id} chatRoom`;
    }

    // update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
    //     return `This action updates a #${id} chatRoom`;
    // }

    remove(id: number) {
        return `This action removes a #${id} chatRoom`;
    }
}
