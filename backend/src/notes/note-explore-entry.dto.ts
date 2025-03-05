/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { NoteType } from '@hedgedoc/commons';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsString } from 'class-validator';
import { BaseDto } from 'src/utils/base.dto';

export class NoteExploreEntryDto extends BaseDto {
  /**
   * Primary address of the note
   * @example my-note
   */
  @IsString()
  @ApiProperty()
  primaryAddress: string;

  /**
   * The title of the note
   * @example My Note
   */
  @IsString()
  @ApiProperty()
  title: string;

  /**
   * The type of the note (document or slide)
   * @example document
   */
  @IsString()
  @ApiProperty()
  type: NoteType;

  /**
   * List of tags assigned to this note
   * @example "['shopping', 'personal']
   */
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ isArray: true, type: String })
  tags: string[];

  /**
   * The owner of the note (or null)
   * @example John Doe
   */
  @IsString()
  @ApiProperty()
  owner: string | null;

  /**
   * If the note is pinned or not
   */
  @IsBoolean()
  @ApiProperty()
  isPinned: boolean;

  /**
   * Datestring of the time this note was last changed
   * @example "2020-12-01 12:23:34"
   */
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  lastChangedAt: Date;
}
