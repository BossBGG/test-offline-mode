import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SyncRequestDto } from './dto/sync-request.dto';


@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(clientId?: string) {
    return this.prisma.task.findMany({
      where: {
        deletedAt: null,
        ...(clientId && { clientId }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.deletedAt) {
      throw new NotFoundException(`Task #${id} not found`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        lastSyncAt: new Date(),
      },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);

    // Version conflict check
    if (updateTaskDto.version && task.version !== updateTaskDto.version) {
      throw new ConflictException('Version conflict detected');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        version: { increment: 1 },
        lastSyncAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    // Check if task exists before soft delete
    await this.findOne(id);
    
    return this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });
  }

  // Sync endpoint
  async sync(syncRequest: SyncRequestDto) {
    const { clientId, lastSyncAt, changes } = syncRequest;

    // Process incoming changes from client
    const results: {
      created: Task[];
      updated: Task[];
      deleted: string[];
      conflicts: Array<{ id: string; error: string }>;
    } = {
      created: [],
      updated: [],
      deleted: [],
      conflicts: [],
    };

    if (changes) {
      // Handle created tasks
      for (const task of changes.created || []) {
        try {
          const created = await this.prisma.task.create({
            data: {
              ...task,
              clientId,
              lastSyncAt: new Date(),
            },
          });
          results.created.push(created);
        } catch (error) {
          results.conflicts.push({ id: task.id, error: error.message });
        }
      }

      // Handle updated tasks
      for (const task of changes.updated || []) {
        try {
          const existing = await this.prisma.task.findUnique({
            where: { id: task.id },
          });

          if (!existing) {
            results.conflicts.push({ id: task.id, error: 'Not found' });
            continue;
          }

          // Simple last-write-wins strategy
          const updated = await this.prisma.task.update({
            where: { id: task.id },
            data: {
              ...task,
              version: { increment: 1 },
              lastSyncAt: new Date(),
            },
          });
          results.updated.push(updated);
        } catch (error) {
          results.conflicts.push({ id: task.id, error: error.message });
        }
      }

      // Handle deleted tasks
      for (const taskId of changes.deleted || []) {
        try {
          await this.prisma.task.update({
            where: { id: taskId },
            data: {
              deletedAt: new Date(),
              version: { increment: 1 },
            },
          });
          results.deleted.push(taskId);
        } catch (error) {
          results.conflicts.push({ id: taskId, error: error.message });
        }
      }
    }

    // Get server changes since last sync
    const serverChanges = await this.prisma.task.findMany({
      where: {
        updatedAt: lastSyncAt ? { gt: new Date(lastSyncAt) } : undefined,
      },
      orderBy: { updatedAt: 'asc' },
    });

    return {
      clientChanges: results,
      serverChanges,
      timestamp: new Date().toISOString(),
    };
  }
}
