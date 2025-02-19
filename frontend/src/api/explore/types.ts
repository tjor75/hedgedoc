/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { NoteType } from '@hedgedoc/commons'

export interface NoteEntry {
  primaryAddress: string
  title: string
  type: NoteType
  tags: string[]
  owner: string | null
  isPinned: boolean
  lastChangedAt: string
}
