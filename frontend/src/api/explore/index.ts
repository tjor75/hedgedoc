/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { NoteEntry } from './types'
import { GetApiRequestBuilder } from '../common/api-request-builder/get-api-request-builder'
import type { SortMode } from '../../components/explore-page/explore-notes-section/filters/sort-button'
import type { NoteType } from '@hedgedoc/commons'
import { createURLSearchParams } from './utils'
import { mockNotes } from './mock'

/**
 * Fetches the pinned notes of a user
 *
 * @return A list of pinned notes.
 * @throws {Error} when the api request wasn't successful.
 */
export const getPinnedNotes = async (): Promise<NoteEntry[]> => {
  return mockNotes.filter((note) => note.isPinned)
  const response = await new GetApiRequestBuilder<NoteEntry[]>('explore/pinned').sendRequest()
  return response.asParsedJsonObject()
}

/**
 * Fetches the notes of the logged-in user for the explore page
 *
 * @return The notes of the logged-in user.
 * @throws {Error} when the api request wasn't successful.
 */
export const getMyNotes = async (
  sort: SortMode,
  searchFilter: string | null,
  typeFilter: NoteType | null
): Promise<NoteEntry[]> => {
  return mockNotes
  const params = createURLSearchParams(sort, searchFilter, typeFilter)
  const response = await new GetApiRequestBuilder<NoteEntry[]>(`explore/my?${params}`).sendRequest()
  return response.asParsedJsonObject()
}

/**
 * Fetches the notes shared with the logged-in user for the explore page
 *
 * @return The notes shared with the logged-in user.
 * @throws {Error} when the api request wasn't successful.
 */
export const getSharedNotes = async (
  sort: SortMode,
  searchFilter: string | null,
  typeFilter: NoteType | null
): Promise<NoteEntry[]> => {
  return mockNotes
  const params = createURLSearchParams(sort, searchFilter, typeFilter)
  const response = await new GetApiRequestBuilder<NoteEntry[]>(`explore/shared?${params}`).sendRequest()
  return response.asParsedJsonObject()
}

/**
 * Fetches the public notes of the instance
 *
 * @return A list of public notes.
 * @throws {Error} when the api request wasn't successful.
 */
export const getPublicNotes = async (
  sort: SortMode,
  searchFilter: string | null,
  typeFilter: NoteType | null
): Promise<NoteEntry[]> => {
  return mockNotes
  const params = createURLSearchParams(sort, searchFilter, typeFilter)
  const response = await new GetApiRequestBuilder<NoteEntry[]>(`explore/public?${params}`).sendRequest()
  return response.asParsedJsonObject()
}

/**
 *
 */
