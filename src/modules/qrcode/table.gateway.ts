import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TableService } from './table.service';

@WebSocketGateway()
export class TablesGateway {
  constructor(private tableService: TableService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('getAllTablesByBranch')
  async handleGetAllTablesByBranch(
    @MessageBody() payload: { branchId: number },
  ) {
    const tablesByBranch = await this.tableService.getAllTablesByBranch(
      payload.branchId,
    );
    return { event: 'tablesByBranch', data: tablesByBranch };
  }
}
