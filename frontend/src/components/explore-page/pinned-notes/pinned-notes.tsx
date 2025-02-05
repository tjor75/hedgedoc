/*
 * SPDX-FileCopyrightText: 2025 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { NoteCardProps } from './pinned-note-card'
import { PinnedNoteCard } from './pinned-note-card'
import { Trans, useTranslation } from 'react-i18next'
import { NoteType } from '@hedgedoc/commons'
import { Caret } from './caret'
import styles from './pinned-notes.module.css'

const mockListPinnedNotes: NoteCardProps[] = [
  {
    id: '1',
    title: 'othermo Backend / Fullstack Dev',
    type: NoteType.DOCUMENT,
    pinned: true,
    lastVisited: new Date(2025, 0, 2, 14, 0, 0).toISOString(),
    created: new Date(2025, 0, 1, 12, 0, 0).toISOString(),
    tags: ['Arbeit', 'Ausschreibung'],
    primaryAddress: 'othermo'
  },
  {
    id: '2',
    title: 'HedgeDoc e.V.',
    type: NoteType.DOCUMENT,
    pinned: false,
    lastVisited: new Date(2025, 0, 13, 14, 0, 0).toISOString(),
    created: new Date(2025, 0, 12, 12, 0, 0).toISOString(),
    tags: ['HedgeDoc', 'Verein'],
    primaryAddress: 'ev'
  },
  {
    id: '3',
    title: 'Sister projects of HedgeDoc for the future',
    type: NoteType.DOCUMENT,
    pinned: false,
    lastVisited: new Date(2025, 0, 13, 14, 0, 0).toISOString(),
    created: new Date(2025, 0, 12, 12, 0, 0).toISOString(),
    tags: ['HedgeDoc', 'Funny'],
    primaryAddress: 'sister-projects'
  },
  {
    id: '4',
    title: 'HedgeDoc Keynote',
    type: NoteType.SLIDE,
    pinned: false,
    lastVisited: new Date(2025, 0, 13, 14, 0, 0).toISOString(),
    created: new Date(2025, 0, 12, 12, 0, 0).toISOString(),
    tags: [],
    primaryAddress: 'keynote'
  },
  {
    id: '5',
    title: 'KIF-Admin KIF 47,5',
    type: NoteType.DOCUMENT,
    pinned: false,
    lastVisited: new Date(2020, 2, 13, 14, 0, 0).toISOString(),
    created: new Date(2019, 10, 12, 12, 0, 0).toISOString(),
    tags: ['KIF-Admin', 'KIF 47,5'],
    primaryAddress: '5'
  },
  {
    id: '6',
    title: 'kif.rocks vs WifiOnICE/Bahn WLAN',
    type: NoteType.DOCUMENT,
    pinned: false,
    lastVisited: new Date(2020, 0, 13, 14, 0, 0).toISOString(),
    created: new Date(2020, 0, 12, 12, 0, 0).toISOString(),
    tags: ['Privat', 'Blogpost'],
    primaryAddress: 'wifionice'
  }
]

export const PinnedNotes: React.FC = () => {
  useTranslation()
  const scrollboxRef = useRef<HTMLDivElement>(null)
  const [enableScrollLeft, setEnableScrollLeft] = useState(false)
  const [enableScrollRight, setEnableScrollRight] = useState(true)

  const pinnedNotes = useMemo(() => {
    return mockListPinnedNotes
  }, [])

  const leftClick = useCallback(() => {
    if (!scrollboxRef.current) {
      return
    }
    scrollboxRef.current.scrollBy({
      left: -400,
      behavior: 'smooth'
    })
  }, [])
  const rightClick = useCallback(() => {
    if (!scrollboxRef.current) {
      return
    }
    scrollboxRef.current.scrollBy({
      left: 400,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    if (!scrollboxRef.current) {
      return
    }
    const scrollbox = scrollboxRef.current
    const scrollHandler = () => {
      setEnableScrollLeft(scrollbox.scrollLeft > 0)
      setEnableScrollRight(Math.ceil(scrollbox.scrollLeft + scrollbox.clientWidth) < scrollbox.scrollWidth)
    }
    scrollbox.addEventListener('scroll', scrollHandler)
    scrollHandler()
    return () => {
      scrollbox.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  return (
    <Fragment>
      <h2 className={'mb-2'}>
        <Trans i18nKey={'explore.pinnedNotes.title'} />
      </h2>
      <div className={'d-flex flex-row gap-2 align-items-center mb-4'}>
        <Caret active={enableScrollLeft} left={true} onClick={leftClick} />
        <div className={styles.scrollbox} ref={scrollboxRef}>
          {pinnedNotes.map((note: NoteCardProps) => (
            <PinnedNoteCard key={note.id} {...note} />
          ))}
        </div>
        <Caret active={enableScrollRight} left={false} onClick={rightClick} />
      </div>
    </Fragment>
  )
}
