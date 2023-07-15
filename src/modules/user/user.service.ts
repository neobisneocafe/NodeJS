import { CreateUserDto } from './dto/create-user.dto';
import { BaseService } from 'src/base/base.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ListParamsDto } from 'src/base/dto/list-params.dto';
import { ListDto } from 'src/base/dto/list.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async findOne(phoneNumber: string) {
    return await this.userRepository.findOneBy({ phoneNumber });
  }
  async save(user) {
    return await this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findOne(createUserDto.phoneNumber);

    if (userExists && userExists.confirmed) {
      throw new BadRequestException('User already exists');
    }

    if (userExists && !userExists.confirmed) {
      await this.userRepository.remove(userExists);
    }

    const user = new User();
    user.phoneNumber = createUserDto.phoneNumber;
    user.firstName = createUserDto.firstName;

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
}
