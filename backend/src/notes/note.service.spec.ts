/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { PermissionLevel } from '@hedgedoc/commons';
import { FieldNameNote, TableNote } from '@hedgedoc/database';
import { Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import type { Tracker } from 'knex-mock-client';

import { AliasService } from '../alias/alias.service';
import appConfigMock from '../config/mock/app.config.mock';
import databaseConfigMock from '../config/mock/database.config.mock';
import {
  createDefaultMockNoteConfig,
  registerNoteConfig,
} from '../config/mock/note.config.mock';
import { NoteConfig } from '../config/note.config';
import { expectBindings } from '../database/mock/expect-bindings';
import {
  mockDelete,
  mockInsert,
  mockSelect,
} from '../database/mock/mock-queries';
import { mockKnexDb } from '../database/mock/provider';
import {
  GenericDBError,
  MaximumDocumentLengthExceededError,
  NotInDBError,
} from '../errors/errors';
import { NoteEventMap } from '../events';
import { GroupsService } from '../groups/groups.service';
import { LoggerModule } from '../logger/logger.module';
import { PermissionService } from '../permissions/permission.service';
import { RealtimeNoteStore } from '../realtime/realtime-note/realtime-note-store';
import { RevisionsService } from '../revisions/revisions.service';
import { UsersService } from '../users/users.service';
import { NoteService } from './note.service';

describe('NoteService', () => {
  let service: NoteService;
  const noteMockConfig: NoteConfig = createDefaultMockNoteConfig();
  let aliasService: AliasService;
  let revisionService: RevisionsService;
  let groupsService: GroupsService;
  let permissionService: PermissionService;
  let tracker: Tracker;
  let knexProvider: Provider;

  const mockNoteId = 42;
  const mockOwnerUserId = 7;
  const mockNoteContent = 'Hello world!';
  const mockAliasCustom = 'my-alias';
  const mockAliasRandom = 'random-alias';
  const everyoneGroupId = 1;
  const loggedInGroupId = 1;

  beforeAll(async () => {
    [tracker, knexProvider] = mockKnexDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        knexProvider,
        GroupsService,
        RevisionsService,
        AliasService,
        PermissionService,
        RealtimeNoteStore,
        EventEmitter2<NoteEventMap>,
        UsersService,
      ],
      imports: [
        LoggerModule,
        await ConfigModule.forRoot({
          isGlobal: true,
          load: [
            appConfigMock,
            databaseConfigMock,
            registerNoteConfig(noteMockConfig),
          ],
        }),
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    aliasService = module.get<AliasService>(AliasService);
    revisionService = module.get<RevisionsService>(RevisionsService);
    groupsService = module.get<GroupsService>(GroupsService);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  afterEach(() => {
    tracker.reset();
    jest.restoreAllMocks();
  });

  describe('getUserNoteIds', () => {
    it('correctly returns the note ids', async () => {
      const rows = [
        {
          [FieldNameNote.id]: mockNoteId,
        },
      ];
      mockSelect(
        tracker,
        [FieldNameNote.id],
        TableNote,
        FieldNameNote.ownerId,
        rows,
      );
      const result = await service.getUserNoteIds(mockOwnerUserId);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockNoteId);
      expectBindings(tracker, 'select', [[mockOwnerUserId]]);
    });
  });

  describe('createNote', () => {
    it('throws a MaximumDocumentLengthExceededError', async () => {
      const tooLongContent = 'a'.repeat(noteMockConfig.maxDocumentLength + 1);
      await expect(
        service.createNote(tooLongContent, mockOwnerUserId),
      ).rejects.toThrow(MaximumDocumentLengthExceededError);
    });

    it('throws GenericDBError if insert fails', async () => {
      mockInsert(
        tracker,
        TableNote,
        [FieldNameNote.ownerId, FieldNameNote.version],
        [],
      );
      await expect(
        service.createNote(mockNoteContent, mockOwnerUserId, mockAliasCustom),
      ).rejects.toThrow(GenericDBError);
      expectBindings(tracker, 'insert', [[mockOwnerUserId, 2]]);
    });

    /* eslint-disable jest/no-conditional-expect */
    describe.each([
      [
        PermissionLevel.READ,
        PermissionLevel.WRITE,
        undefined,
        mockAliasRandom,
        'everyone read, loggedIn write, without alias',
      ],
      [
        PermissionLevel.DENY,
        PermissionLevel.READ,
        undefined,
        mockAliasRandom,
        'everyone denied, loggedIn read, without alias',
      ],
      [
        PermissionLevel.WRITE,
        PermissionLevel.DENY,
        undefined,
        mockAliasRandom,
        'everyone write, loggedIn denied, without alias',
      ],
      [
        PermissionLevel.READ,
        PermissionLevel.DENY,
        mockAliasCustom,
        mockAliasCustom,
        'everyone read, loggedIn denied, with alias',
      ],
    ])(
      'inserts a new note',
      (everyoneLevel, loggedInLevel, inputAlias, outputAlias, descr) => {
        let result: number;
        let mockEnsureAliasIsAvailable: jest.SpyInstance;
        let mockGenerateRandomAlias: jest.SpyInstance;
        let mockAddAlias: jest.SpyInstance;
        let mockCreateRevision: jest.SpyInstance;
        let mockGetGroupIdByName: jest.SpyInstance;
        let mockSetGroupPermission: jest.SpyInstance;
        beforeEach(() => {
          console.log('beforeEach');
          mockEnsureAliasIsAvailable = jest
            .spyOn(aliasService, 'ensureAliasIsAvailable')
            .mockImplementation(async () => {});
          mockGenerateRandomAlias = jest
            .spyOn(aliasService, 'generateRandomAlias')
            .mockImplementation(() => mockAliasRandom);
          mockAddAlias = jest
            .spyOn(aliasService, 'addAlias')
            .mockImplementation(async () => {});
          mockCreateRevision = jest
            .spyOn(revisionService, 'createRevision')
            .mockImplementation(async () => {});
          mockGetGroupIdByName = jest.spyOn(groupsService, 'getGroupIdByName');
          mockSetGroupPermission = jest
            .spyOn(permissionService, 'setGroupPermission')
            .mockImplementation(async () => {});
          mockInsert(
            tracker,
            TableNote,
            [FieldNameNote.ownerId, FieldNameNote.version],
            [{ [FieldNameNote.id]: mockNoteId }],
          );
        });
        afterEach(() => {
          expect(mockCreateRevision).toHaveBeenCalledWith(
            mockNoteId,
            mockNoteContent,
            true,
            expect.anything(),
          );
          expect(result).toBe(mockNoteId);
          expectBindings(tracker, 'insert', [[mockOwnerUserId, 2]]);
        });

        it(`with settings: ${descr}`, async () => {
          noteMockConfig.permissions.default.everyone = everyoneLevel as
            | PermissionLevel.DENY
            | PermissionLevel.READ
            | PermissionLevel.WRITE;
          noteMockConfig.permissions.default.loggedIn = loggedInLevel as
            | PermissionLevel.DENY
            | PermissionLevel.READ
            | PermissionLevel.WRITE;
          let numberOfGroupIdByNameCalls = 0;
          if (everyoneLevel !== PermissionLevel.DENY) {
            mockGetGroupIdByName.mockImplementationOnce(
              async () => everyoneGroupId,
            );
            numberOfGroupIdByNameCalls++;
          }
          if (loggedInLevel !== PermissionLevel.DENY) {
            mockGetGroupIdByName.mockImplementationOnce(
              async () => loggedInGroupId,
            );
            numberOfGroupIdByNameCalls++;
          }
          result = await service.createNote(
            mockNoteContent,
            mockOwnerUserId,
            inputAlias,
          );
          if (inputAlias === undefined) {
            expect(mockEnsureAliasIsAvailable).not.toHaveBeenCalled();
            expect(mockGenerateRandomAlias).toHaveBeenCalled();
          } else {
            expect(mockEnsureAliasIsAvailable).toHaveBeenCalledWith(
              outputAlias,
              expect.anything(),
            );
            expect(mockGenerateRandomAlias).not.toHaveBeenCalled();
          }
          expect(mockAddAlias).toHaveBeenCalledWith(
            mockNoteId,
            outputAlias,
            expect.anything(),
          );
          expect(mockGetGroupIdByName).toHaveBeenCalledTimes(
            numberOfGroupIdByNameCalls,
          );
          if (everyoneLevel !== PermissionLevel.DENY) {
            expect(mockSetGroupPermission).toHaveBeenCalledWith(
              mockNoteId,
              everyoneGroupId,
              everyoneLevel === PermissionLevel.WRITE,
              expect.anything(),
            );
          }
          if (loggedInLevel !== PermissionLevel.DENY) {
            expect(mockSetGroupPermission).toHaveBeenCalledWith(
              mockNoteId,
              loggedInGroupId,
              loggedInLevel === PermissionLevel.WRITE,
              expect.anything(),
            );
          }
        });
      },
    );
  });
  /* eslint-enable jest/no-conditional-expect */

  describe('deleteNote', () => {
    it('deletes a note by id', async () => {
      mockDelete(tracker, TableNote, [FieldNameNote.id], 1);
      service['eventEmitter'] = { emit: jest.fn() } as any;
      await service.deleteNote(mockNoteId);
      expectBindings(tracker, 'delete', [[mockNoteId]]);
    });

    it('throws NotInDBError if note not found', async () => {
      mockDelete(tracker, TableNote, [FieldNameNote.id], 0);
      service['eventEmitter'] = { emit: jest.fn() } as any;
      await expect(service.deleteNote(mockNoteId)).rejects.toThrow(
        NotInDBError,
      );
      expectBindings(tracker, 'delete', [[mockNoteId]]);
    });
  });

  describe('updateNote', () => {
    it('calls revisionsService.createRevision', async () => {
      service['eventEmitter'] = { emit: jest.fn() } as any;
      service['revisionsService'] = {
        createRevision: jest.fn().mockResolvedValue(undefined),
      } as any;
      await service.updateNote(mockNoteId, mockNoteContent);
      expect(service['revisionsService'].createRevision).toHaveBeenCalledWith(
        mockNoteId,
        mockNoteContent,
      );
    });
  });
});
