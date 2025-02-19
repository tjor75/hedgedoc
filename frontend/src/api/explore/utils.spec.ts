/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SortMode } from '../../components/explore-page/explore-notes-section/filters/sort-button'
import { NoteType } from '@hedgedoc/commons'
import { createURLSearchParams } from './utils'

describe('createURLSearchParams', () => {
  it('only sort is defined', () => {
    const sort = SortMode.TITLE_ASC
    const result = createURLSearchParams(sort, null, null)
    expect(result).toStrictEqual('sort=title_asc')
  })
  it('sort and search are defined', () => {
    const sort = SortMode.TITLE_ASC
    const search = 'test'
    const result = createURLSearchParams(sort, search, null)
    expect(result).toStrictEqual('sort=title_asc&search=test')
  })
  it('sort and type are defined', () => {
    const sort = SortMode.TITLE_ASC
    const type = NoteType.DOCUMENT
    const result = createURLSearchParams(sort, null, type)
    expect(result).toStrictEqual('sort=title_asc&type=document')
  })
  it('everything is defined', () => {
    const sort = SortMode.TITLE_ASC
    const search = 'test'
    const type = NoteType.DOCUMENT
    const result = createURLSearchParams(sort, search, type)
    expect(result).toStrictEqual('sort=title_asc&search=test&type=document')
  })
})
