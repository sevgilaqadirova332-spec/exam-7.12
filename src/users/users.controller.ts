import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users — barcha foydalanuvchilar (admin)
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Barcha foydalanuvchilar (admin uchun)' })
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id — bitta foydalanuvchi
  @Get(':id')
  @ApiOperation({ summary: 'Foydalanuvchini ID bo\'yicha ko\'rish' })
  @ApiResponse({ status: 404, description: 'Topilmadi' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // PATCH /users/profile — o'z profilini yangilash
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'O\'z profilini yangilash' })
  updateProfile(@CurrentUser() user: User, @Body() data: Partial<User>) {
    // Parol va rolni bu yerda o'zgartirib bo'lmaydi
    const { password, role, ...safeData } = data;
    return this.usersService.update(user.id, safeData);
  }
}
