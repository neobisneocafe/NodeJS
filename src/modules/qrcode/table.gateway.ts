import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TablesService } from './tables.service';
import { BookTableDto } from './dto/book-table.dto';
import { ReleaseTableDto } from './dto/release-table.dto';
import { UserRoleEnum } from './user-role.enum';
import { Roles } from './roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RoleGuard } from './role.guard';

@WebSocketGateway()
export class TablesGateway {
  constructor(private tablesService: TablesService) {}

  @WebSocketServer() server: Server;

  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SubscribeMessage('bookTable')
  async handleBookTable(
    client: any,
    { userId, bookTableDto }: { userId: number; bookTableDto: BookTableDto },
  ): Promise<void> {
    const table = await this.tablesService.bookTable(userId, bookTableDto);
    if (table) {
      this.server.emit('tableUpdated', table);
    }
  }

  @SubscribeMessage('releaseTable')
  async handleReleaseTable(
    client: any,
    {
      tableId,
      releaseTableDto,
    }: { tableId: number; releaseTableDto: ReleaseTableDto },
  ): Promise<void> {
    const table = await this.tablesService.releaseTable(
      tableId,
      releaseTableDto,
    );
    if (table) {
      this.server.emit('tableUpdated', table);
    }
  }
}
