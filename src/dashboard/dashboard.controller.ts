import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto, DataRevenueDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';
import { TYPE_TIME_FILTER } from 'src/constants/schema.enum';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }


  @Get('/info')
  @Public()
  findOne() {
    return this.dashboardService.getDashboardCardInfo(TYPE_TIME_FILTER.WEEK);
  }
  // @Post('/revenue')
  // @Public()
  // getDataRevenue(@Body() dataRevenueDto: DataRevenueDto) {
  //   return this.dashboardService.getMonthlyTotal(dataRevenueDto.year);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDashboardDto: UpdateDashboardDto) {
  //   return this.dashboardService.update(+id, updateDashboardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dashboardService.remove(+id);
  // }
}
