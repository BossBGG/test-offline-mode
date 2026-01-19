import { IsString, IsBoolean, IsOptional, IsEnum, isString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;

    @IsEnum(['low', 'medium', 'high'])
    @IsOptional()
    priority?: string;

    @IsString()
    @IsOptional()
    clientId?: string;
}