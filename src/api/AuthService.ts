import { apiClient } from './ApiClient';
import { tokenStorage } from "@/auth/tokenStorage";
import { LoginDto } from '@/types';


export class AuthService {

  async login({ email, password, accountNumber }: LoginDto) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      accountNumber,
    });


    const data = response.data;

    return {
      token: data.access_token,
      accountNumber: accountNumber,
      role: data.role,
      meta: {
        fullName: data.full_name,
        accountCategory: data.account_category,
      },
    };
  }

  logout() {
    tokenStorage.clearAll();

  }
}