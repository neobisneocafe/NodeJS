import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListParamsDto } from 'src/base/dto/list-params.dto';

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
  async removeUser(@Param('id') user_id: number) {
    return await this.userService.deleteUser(user_id);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  async getProfile(@Req() req) {
    console.log(req.user);
    return this.userService.getProfile(req?.user?.id);
  }
}
