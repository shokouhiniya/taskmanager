import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('pending')
  findPending() {
    return this.usersService.findPending();
  }

  @Get('approved')
  findApproved() {
    return this.usersService.findApproved();
  }

  @Post()
  async create(@Body() body: { username: string; password: string; phone: string; name: string; role: string }) {
    try {
      return await this.usersService.create(body.username, body.password, body.phone, body.name, body.role);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { phone: string; name: string; role: string; password?: string }) {
    return this.usersService.update(id, body.phone, body.name, body.role, body.password);
  }

  @Put(':id/role')
  updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.usersService.updateRole(id, body.role);
  }

  @Put(':id/approve')
  approveUser(@Param('id') id: string, @Body() body: { role?: string }) {
    return this.usersService.approveUser(id, body.role);
  }

  @Put(':id/reject')
  rejectUser(@Param('id') id: string) {
    return this.usersService.rejectUser(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
