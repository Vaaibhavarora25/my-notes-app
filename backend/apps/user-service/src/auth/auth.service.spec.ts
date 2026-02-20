import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { of } from 'rxjs';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  password: 'hashed_pw',
};

describe('AuthService (user-service)', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: { sign: jest.Mock };
  let queueClient: { emit: jest.Mock };

  beforeEach(async () => {
    jwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };
    queueClient = { emit: jest.fn().mockReturnValue(of({})) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        { provide: JwtService, useValue: jwtService },
        { provide: 'QUEUE_SERVICE', useValue: queueClient },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('hashes the password, creates the user, and returns a JWT token', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.signup('test@example.com', 'plain_pw');

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );

      const callArg = usersService.create.mock.calls[0][0];
      expect(callArg.password).not.toBe('plain_pw');
      expect(await bcrypt.compare('plain_pw', callArg.password)).toBe(true);
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
    });

    it('throws if the user already exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signup('test@example.com', 'pw')).rejects.toThrow(
        'User exists',
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('emits a welcome-note event after signup', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      await service.signup('test@example.com', 'pw');

      expect(queueClient.emit).toHaveBeenCalledWith('notes.welcome.create', {
        userId: mockUser.id,
      });
    });
  });

  describe('login', () => {
    it('returns a JWT token for valid credentials', async () => {
      const hashed = await bcrypt.hash('correct_pw', 10);
      usersService.findByEmail.mockResolvedValue({ ...mockUser, password: hashed });

      const result = await service.login('test@example.com', 'correct_pw');

      expect(result).toEqual({ access_token: 'mock-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hashed = await bcrypt.hash('correct_pw', 10);
      usersService.findByEmail.mockResolvedValue({ ...mockUser, password: hashed });

      await expect(service.login('test@example.com', 'wrong_pw')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException for unknown email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login('unknown@example.com', 'pw')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('createToken', () => {
    it('signs a JWT with the user id as sub claim', () => {
      const result = service.createToken('user-42');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user-42' });
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
    });
  });
});
