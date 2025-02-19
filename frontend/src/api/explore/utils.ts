/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { SortMode } from '../../components/explore-page/explore-notes-section/filters/sort-button'
import type { NoteType } from '@hedgedoc/commons'

/**
 * Create the necessary url parameters for the api calls of the explore page.
 * @param sort
 * @param searchFilter
 * @param typeFilter
 * @return a string representation of the search parameter
 */
export const createURLSearchParams = (
  sort: SortMode,
  searchFilter: string | null,
  typeFilter: NoteType | null
): string => {
  const params = new URLSearchParams()
  params.set('sort', sort)
  if (searchFilter) {
    params.set('search', searchFilter)
  }
  if (typeFilter) {
    params.set('type', typeFilter)
  }
  return params.toString()
}
