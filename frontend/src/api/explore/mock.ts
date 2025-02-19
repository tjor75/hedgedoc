/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// TODO Remove mock entries as soon as the backend is implemented
import type { NoteEntry } from './types'
import { NoteType } from '@hedgedoc/commons'

export const mockNotes: NoteEntry[] = [
  {
    primaryAddress: 'othermo',
    title: 'othermo Backend / Fullstack Dev',
    type: NoteType.DOCUMENT,
    isPinned: true,
    lastChangedAt: new Date(2025, 0, 2, 14, 0, 0).toISOString(),
    tags: ['Arbeit', 'Ausschreibung']
  },
  {
    primaryAddress: 'ev',
    title: 'HedgeDoc e.V.',
    type: NoteType.DOCUMENT,
    isPinned: false,
    lastChangedAt: new Date(2025, 0, 13, 14, 0, 0).toISOString(),
    tags: ['HedgeDoc', 'Verein']
  },
  {
    primaryAddress: 'sister-projects',
    title: 'Sister projects of HedgeDoc for the future',
    type: NoteType.DOCUMENT,
    isPinned: false,
    lastChangedAt: new Date(2025, 0, 13, 14, 0, 0).toISOString(),
    tags: ['HedgeDoc', 'Funny']
  },
  {
    primaryAddress: 'keynote',
    title: 'HedgeDoc Keynote',
    type: NoteType.SLIDE,
    isPinned: false,
    lastChangedAt: new Date(2025, 0, 13, 14, 0, 0).toISOString(),
    tags: []
  },
  {
    primaryAddress: '5',
    title: 'KIF-Admin KIF 47,5',
    type: NoteType.DOCUMENT,
    isPinned: false,
    lastChangedAt: new Date(2020, 2, 13, 14, 0, 0).toISOString(),
    tags: ['KIF-Admin', 'KIF 47,5']
  },
  {
    primaryAddress: 'wifionice',
    title: 'kif.rocks vs WifiOnICE/Bahn WLAN',
    type: NoteType.DOCUMENT,
    isPinned: false,
    lastChangedAt: new Date(2020, 0, 13, 14, 0, 0).toISOString(),
    tags: ['Privat', 'Blogpost']
  }
]
