import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TableService } from './table.service';
import { BookTableDto } from './dto/book_table.dto';
import { ReleaseTableDto } from './dto/release_table.dto';
import { UserRoleEnum } from '../user/enums/user.role.enum';
import { Roles } from '../auth/roles/role.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tables')
@WebSocketGateway()
export class TablesGateway {
  constructor(private tableService: TableService) {}

  @WebSocketServer() server: Server;

  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SubscribeMessage('bookTable')
  @ApiOperation({ summary: 'Забронировать столик' })
  @ApiBearerAuth()
  async handleBookTable(
    client: any,
    { userId, bookTableDto }: { userId: number; bookTableDto: BookTableDto },
  ): Promise<void> {
    const table = await this.tableService.bookTable(userId, bookTableDto);
    if (table) {
      this.server.emit('tableUpdated', table);
    }
  }

  @SubscribeMessage('releaseTable')
  @ApiOperation({ summary: 'Освободить столик' })
  async handleReleaseTable(
    client: any,
    {
      tableId,
      releaseTableDto,
    }: { tableId: number; releaseTableDto: ReleaseTableDto },
  ): Promise<void> {
    const table = await this.tableService.releaseTable(
      tableId,
      releaseTableDto,
    );
    if (table) {
      this.server.emit('tableUpdated', table);
    }
  }
}
