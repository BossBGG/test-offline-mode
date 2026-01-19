import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SyncRequestDto } from './dto/sync.request.dto';


@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    findAll(@Query('clientId') clientId?: string){
        return this.tasksService.findAll(clientId);
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.tasksService.findOne(id);
    }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(id , updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }

    @Post('sync')
    sync(@Body() syncRequest: SyncRequestDto) {
        return this.tasksService.sync(syncRequest);
    }
}