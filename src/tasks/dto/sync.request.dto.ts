import { IsString } from "class-validator";

export class SyncRequestDto {
    @IsString()
    clientId: string;
} 