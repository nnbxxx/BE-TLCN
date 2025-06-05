import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/modules/users/users.interface';
import { paginate } from 'src/helpers';
import {
    ChatRoom,
    ChatRoomDocument,
} from 'src/modules/chat-rooms/schemas/chat-room.schemas';
import { AppGateway } from 'src/gateway/app.gateway';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private messageModel: SoftDeleteModel<MessageDocument>,
        @InjectModel(ChatRoom.name)
        private chatRoomModel: SoftDeleteModel<ChatRoomDocument>,
        private readonly appGateway: AppGateway,
    ) {}

    async create(
        user: IUser,
        { chatRoom, messageType, content, fileUrl, questionId }: CreateMessageDto,
    ) {
        await this.validateMember(user._id, chatRoom);
        const newMessage = await this.messageModel.create({
            sender: user._id,
            chatRoom,
            messageType,
            content,
            fileUrl,
        });
        await this.chatRoomModel.updateOne(
            { _id: chatRoom },
            { lastMessage: newMessage._id },
        );

        this.appGateway.server.emit(`chat-rooms/${chatRoom}`, {
            ...newMessage.toJSON(),
            questionId,
            sender: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }

    async findAll(user: IUser, { currentPage, limit, chatRoom }) {
        await this.validateMember(user._id, chatRoom);

        return paginate<Message>(this.messageModel, {
            currentPage,
            limit,
            query: { chatRoom },
            population: [{ path: 'sender', select: ['email', 'name'] }],
        });
    }

    private async validateMember(userId: string, chatRoom: string) {
        const isExist = await this.chatRoomModel.exists({
            _id: chatRoom,
            members: userId,
        });
        if (!isExist) {
            throw new ForbiddenException("You're not allow to access");
        }
    }
}
