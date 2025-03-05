/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Note } from 'src/notes/note.entity';

import { SessionGuard } from '../../../auth/session.guard';
import { ConsoleLoggerService } from '../../../logger/console-logger.service';
import { NoteExploreEntryDto } from '../../../notes/note-explore-entry.dto';
import { NotesService } from '../../../notes/notes.service';
import { User } from '../../../users/user.entity';
import { OpenApi } from '../../utils/openapi.decorator';
import { RequestUser } from '../../utils/request-user.decorator';

@UseGuards(SessionGuard)
@OpenApi(401, 403)
@ApiTags('explore')
@Controller('explore')
export class ExploreController {
  constructor(
    private readonly logger: ConsoleLoggerService,
    private notesService: NotesService,
  ) {
    this.logger.setContext(ExploreController.name);
  }

  @Get('my')
  @OpenApi(200)
  async getMyNotes(
    @RequestUser() user: User,
    @Query('sort') sort: string,
    @Query('search') search: string,
    @Query('type') type: string,
  ): Promise<NoteExploreEntryDto[]> {
    const entries = (await user.ownedNotes).map((aNote: Note) =>
      this.notesService.toNoteExploreEntryDto(aNote, user),
    );
    return await Promise.all(entries);
  }

  @Get('shared')
  @OpenApi(200)
  async getSharedNotes(
    @RequestUser() user: User,
    @Query('sort') sort: string,
    @Query('search') search: string,
    @Query('type') type: string,
  ): Promise<NoteExploreEntryDto[]> {
    return [];
  }

  @Get('public')
  @OpenApi(200)
  async getPublicNotes(
    @Query('sort') sort: string,
    @Query('search') search: string,
    @Query('type') type: string,
  ): Promise<NoteExploreEntryDto[]> {
    return [];
  }
}
