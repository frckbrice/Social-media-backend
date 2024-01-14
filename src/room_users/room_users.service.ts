import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room_user.dto';
import { UpdateRoomUserDto } from './dto/update-room_user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RoomUser } from './schema/roomUser.schema';
import mongoose, { Model } from 'mongoose';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/interface/room.interface';
import { UnreadMessagesService } from 'src/unread_messages/unread_messages.service';

@Injectable()
export class RoomUsersService {
  constructor(
    @InjectModel(RoomUser.name) private roomUserModel: Model<RoomUser>,
    private roomService: RoomsService,
    private unreadMessage: UnreadMessagesService,
  ) {}

  // Post data in the roomUser table
  async create(createRoomUserDto: CreateRoomUserDto): Promise<RoomUser> {
    const createRoomUser = new this.roomUserModel(createRoomUserDto);
    console.log('this is roomuser from service', createRoomUser);
    const room_user = await createRoomUser.save();
    console.log('room user created', room_user);
    return room_user;
  }

  // get all roomUsers
  async findAll(): Promise<RoomUser[]> {
    const roomUsers = await this.roomUserModel.find();
    return roomUsers;
  }

  // find users per room
  async findAllUsers(id: string): Promise<RoomUser[]> {
    const participants = await this.roomUserModel.find({
      room_id: id,
    });

    return participants;
  }

  // find all groups in which a user belongs to
  async findAllGroupsOfASingleUser(userId: string): Promise<Room[]> {
    try {
      const groups = await this.roomUserModel.find({ user_id: userId }).exec();

      if (groups.length) {
        const allGrps = groups.map(async (group) => {
          const room = await this.roomService.fetchOneRoom(group.room_id);
          // console.log(room);
          if (room) {
            return room;
          }
        });
        if (allGrps.length) return Promise.all(allGrps);
        else {
          console.log('this user do not have a group');
          throw new HttpException('User does not have a group', 404);
        }
      }
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          'Error while fetching all groups of single user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  // Update roomUser
  update(id: number, updateRoomUserDto: UpdateRoomUserDto) {
    return `This action updates a #${id} roomUser`;
  }

  // remove a group participant
  async removeParticipant(id: string) {
    return await this.roomUserModel.findOneAndDelete({
      user_id: id,
    });
  }

  // find one room by id
  async getAllGroupMembers(id: string) {
    console.log('group id: ', id);
    const groupMembers = await this.roomUserModel.find({ room_id: id }).exec();
    if (!groupMembers.length) {
      console.log('no members for this group');
      throw new NotFoundException('this group does not have members');
    }
    // console.log('members of the group: ', groupMembers);
    const membersRoomObjects: Room[] = await Promise.all(
      groupMembers?.map(async (roomUser) => {
        const object = await this.roomService.getSingleRoom(roomUser.user_id);

        return {
          name: object?.name,
          image: object?.image,
          isGroup: object?.isGroup,
          user_id: object?.user_id,
          my_id: object?.my_id,
          createdAt: object?.createdAt,
          updatedAt: object?.updatedAt,
          id: object?.id,
          role: roomUser?.role,
          original_dm_roomID: object?.original_dm_roomID,
        };
      }),
    );
    if (!membersRoomObjects.length) {
      console.log('cannot find members room for this groups');
      throw new NotFoundException('cannot find members room for this groups');
    }

    return [membersRoomObjects?.map((member) => member.id), membersRoomObjects];
  }

  async getAllGroupAndDM(userId: string) {
    const [allUnreadMessages, myRoom, allGroupOfAMember, allRooms] =
      await Promise.all([
        await this.unreadMessage.findAll(),
        await this.roomService.getSingleRoom(userId),
        await this.findAllGroupsOfASingleUser(userId),
        await this.roomService.fetchAllRooms(userId),
      ]);

    let joinRoom: Room[] = [...allRooms];
    if (allGroupOfAMember?.length)
      joinRoom = [...allRooms, ...allGroupOfAMember];
    const chats = allUnreadMessages
      ?.reduce(
        (acc, curr) => {
          return acc?.map((item: any) => {
            if (
              (item?.original_dm_roomID &&
                item.original_dm_roomID === curr.sender_id.toString() &&
                curr?.receiver_room_id.toString() === myRoom.id.toString()) ||
              (item?.isGroup &&
                curr.receiver_room_id.toString() === item.id.toString())
            ) {
              return {
                ...item,
                unread_count: curr.unread_count,
                last_message: curr.last_message,
                updatedAt: curr?.updatedAt,
              };
            } else {
              return {
                ...item,
                unread_count: 0,
                last_message: '',
                updatedAt: item?.createdAt,
              };
            }
          });
        },
        [...joinRoom],
      )
      ?.map((item) => {
        if (item._doc)
          return {
            name: item?._doc.name,
            image: item?._doc.image,
            isGroup: item?._doc.isGroup,
            user_id: item?._doc.user_id,
            my_id: item?._doc.my_id,
            createdAt: item?._doc.createdAt,
            updatedAt: item?._doc.updatedAt,
            original_dm_roomID: item?._doc.original_dm_roomID,
            id: item?._doc._id,
            unread_count: item.unread_count,
            last_message: item.last_message,
          };
        else
          return {
            name: item?.name,
            image: item?.image,
            isGroup: item?.isGroup,
            user_id: item?.user_id,
            my_id: item?.my_id,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
            original_dm_roomID: item?.original_dm_roomID,
            id: item?.id,
            unread_count: item?.unread_count,
            last_message: item?.last_message,
          };
      })
      ?.filter((item) => item.name);

    // console.log('all chats', chats);
    return chats;
  }

  shuffleArr(array: any[]) {
    if (array.length <= 1) return array;
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  }
}
