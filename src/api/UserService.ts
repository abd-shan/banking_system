// src/api/UserService.ts
import { apiClient } from './ApiClient';
import { User, CreateUserDto } from '@/types';

export class UserService {
  private readonly endpoint = '/users';

  /**
   * POST /users - Create a new user (Admin/Manager only).
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>(this.endpoint, dto);
    return response.data;
  }
}
