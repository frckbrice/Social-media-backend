import { IsNotEmpty, IsString } from "class-validator";

export class DeleteRoomDto {
    @IsString()
    @IsNotEmpty()
    my_id: string
}