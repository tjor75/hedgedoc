/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react'
import type { SortMode } from '../filters/sort-button'
import type { NoteType } from '@hedgedoc/commons'
import { useAsync } from 'react-use'
import { Mode } from '../../mode-selection/mode'
import { getMyNotes, getPublicNotes, getSharedNotes } from '../../../../api/explore'
import { AsyncLoadingBoundary } from '../../../common/async-loading-boundary/async-loading-boundary'
import { NoteListEntry } from './note-entry'

export interface NotesListProps {
  mode: Mode
  sort: SortMode
  searchFilter: string | null
  typeFilter: NoteType | null
}

export const NotesList: React.FC<NotesListProps> = ({ mode, sort, searchFilter, typeFilter }) => {
  const { value, loading, error } = useAsync(async () => {
    switch (mode) {
      case Mode.MY_NOTES:
        return await getMyNotes(sort, searchFilter, typeFilter)
      case Mode.SHARED_WITH_ME:
        return await getSharedNotes(sort, searchFilter, typeFilter)
      case Mode.PUBLIC:
        return await getPublicNotes(sort, searchFilter, typeFilter)
    }
  }, [mode, sort, searchFilter, typeFilter])

  const noteEntries = useMemo(() => {
    if (!value) {
      return []
    }
    return value.map((note) => {
      return <NoteListEntry {...note} key={note.primaryAddress} />
    })
  }, [value])

  return (
    <AsyncLoadingBoundary componentName={'NotesList'} loading={loading} error={error}>
      {noteEntries}
    </AsyncLoadingBoundary>
  )
}
