import { CreateUserDto } from './dto/create-user.dto';
import { BaseService } from 'src/base/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ListParamsDto } from 'src/base/dto/list-params.dto';
import { ListDto } from 'src/base/dto/list.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddBonusDto } from './dto/add-bonus.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async findOneByConfirmCode(confirmCode: string): Promise<User | null> {
    return this.userRepository.findOneBy({ confirm_code: confirmCode });
  }

  async addBonus(addBonusDto: AddBonusDto) {
    const user = await this.getProfile(addBonusDto.userId);
    await this.checkIfExcist(user, 'user', addBonusDto.userId);
    user.bonusPoints += addBonusDto.bonusPoints;
    return await this.save(user);
  }

  async findOne(phoneNumber: string) {
    return await this.userRepository.findOneBy({ phoneNumber });
  }
  async save(user) {
    return await this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findOne(createUserDto.phoneNumber);

    if (userExists) {
      if (userExists.confirmed) {
        throw new BadRequestException('User already exists');
      } else {
        await this.userRepository.remove(userExists);
      }
    }

    const user = new User();
    user.absorbFromDto(createUserDto);

    return this.userRepository.save(user);
  }

  async activateUser(id: number) {
    const user: User = await this.get(id);
    if (user && !user.confirmed) {
      user.confirmed = true;
      return this.userRepository.save(user);
    }
    throw new BadRequestException('Confirmation error');
  }

  async checkIfUserExists(phoneNumber: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.phoneNumber = :phoneNumber', { phoneNumber })
      .getOne();

    if (!user) {
      return false;
    } else if (!user.confirmed) {
      await this.userRepository.remove(user);
      return false;
    }

    return true;
  }

  async listOfUsers(listParamsDto: ListParamsDto) {
    const array = await this.userRepository
      .createQueryBuilder('user')
      .where('user.isDeleted != true')
      .limit(listParamsDto.limit)
      .offset(listParamsDto.countOffset())
      .orderBy(`user.${listParamsDto.getOrderedField()}`, listParamsDto.order)
      .getMany();
    const itemsCount = await this.repository.createQueryBuilder().getCount();
    return new ListDto(array, {
      page: listParamsDto.page,
      itemsCount,
      limit: listParamsDto.limit,
      order: listParamsDto.order,
      orderField: listParamsDto.orderField,
    });
  }

  async deleteUser(user_id: number) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (user) {
      user.isDeleted = true;
      await this.userRepository.save(user);
      return 'User is successfully removed!';
    }
    return 'User is not found!';
  }

  async getProfile(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['table'],
    });
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    return user;
  }

  async updateUsersProfile(id: number, updateDto: UpdateUserDto) {
    const { phoneNumber, dateOfBirth } = updateDto;
    const user = await this.get(id);
    if (phoneNumber) {
      const isPhoneNumberExists = await this.findOne(phoneNumber);
      if (isPhoneNumberExists) {
        throw new BadRequestException(
          `Phone number ${phoneNumber} is used by other user!`,
        );
      }
      user.absorbFromDto(updateDto);
      return this.userRepository.save(user);
    }
  }

  async deleteUsers(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (user) {
      return await this.userRepository.remove(user);
    }
    return 'User nor found!';
  }
}
