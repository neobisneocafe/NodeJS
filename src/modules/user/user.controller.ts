import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Patch,
  Req,
  Body,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListParamsDto } from 'src/base/dto/list-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddBonusDto } from './dto/add-bonus.dto';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: 'Получить список пользователей' })
  async lisOfUsers(@Query() listParamsDto: ListParamsDto) {
    return await this.userService.listOfUsers(listParamsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя по его ID' })
  async removeUser(@Param('id') id: number) {
    return await this.userService.deleteUsers(id);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  async getProfile(@Req() req) {
    console.log(req.user);
    return this.userService.getProfile(req?.user?.id);
  }

  @Get('bonus')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получение бонусов пользователя' })
  async getBonuses(@Req() req) {
    console.log(req.user);
    const user = await this.userService.getProfile(req?.user?.id);
    return { bonusPoints: user.bonusPoints };
  }

  @ApiOperation({ summary: 'Начислить бонусы пользователю (максимум 1000)' })
  @Patch('bonus')
  async addBonus(@Body() addBonusDto: AddBonusDto) {
    return await this.userService.addBonus(addBonusDto);
  }

  @Patch('update/profile')
  @ApiOperation({ summary: 'Изменение данных в профиле' })
  async updateProfile(@Req() req: any, @Body() udpateDto: UpdateUserDto) {
    return await this.userService.updateUsersProfile(req.user?.id, udpateDto);
  }
}
