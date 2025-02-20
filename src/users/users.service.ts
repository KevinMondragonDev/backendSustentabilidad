import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async updateUser (updateUserdto: UpdateUserDto): Promise<User> {


      return this.userRepository.save(updateUserdto);
  }
  async updatePenalized (id: string, isPenalized: boolean): Promise<User> {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
          throw new NotFoundException('User not found');
      }

      if (user.isPenalized === isPenalized) {
        throw new BadRequestException('User penalized status is already set to the requested value');
      }

      user.isPenalized = isPenalized;
      return this.userRepository.save(user);
  }




}
