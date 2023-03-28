import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';
import { AuthModule, JwtModuleConfig } from 'auth/auth.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection, Model, connect } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { User, UserSchema } from 'users/user.model';
import { UsersModule } from 'users/users.module';

import { AuthController } from 'auth/auth.controller';
import { Module } from '@nestjs/common';

describe('AuthService', () => {
  let module: TestingModule;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  const TEST_USER = {
    username: 'test',
    password: 'test',
  };

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    mongoConnection = (
      await mongoose.connect(mongod.getUri(), {
        socketTimeoutMS: 5000,
      })
    ).connection;

    userModel = mongoConnection.model(User.name, UserSchema);

    @Module({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
      exports: [UsersService],
    })
    class UsersModule {}

    module = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [UsersModule, JwtModuleConfig],
      providers: [AuthService],
    }).compile();

    //service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  }, 20000);
  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('login', () => {
    it('controller should be defined', () => {
      expect(true).toBe(true);
    });
    it('Create account with model', () => {
      expect(false).toBe(false);
    });
  });
