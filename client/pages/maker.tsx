import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// @ts-expect-error: No types available.
import { NotificationManager } from 'react-notifications'

import useSWR from 'swr'
import { Alert, Button, Table } from 'react-bootstrap'
import Layout from '../components/Layout'
import setting from '../setting'
import { isAbsent, isPresent } from '../src/util'
import { fetcher } from '../src/const'
import Pagination from '../components/Pagination'
import MakerEditor from '../components/MakerEditor'

export interface IMaker {
  id: number
  name: string
  country: string
  founding_date: Date
  created_at: Date
  updated_at: Date
}

export default function MakerPage (): JSX.Element {
  const [page, setPage] = useState(1)

  const router = useRouter()
  const [firstLock, setFirstLock] = useState(false)
  useEffect(() => {
    const _page = router.query.page
    const page = (typeof _page === 'string' ? _page : _page?.join('')) ?? null
    if (isPresent(page)) setPage(parseInt(page ?? '1'))
    setFirstLock(true)
  }, [router.query.page])
  useEffect(() => {
    if (!firstLock) return
    router.replace({
      pathname: '/maker',
      query: { page: page }
    }).then(() => {})
    .catch(() => {})
  }, [page])

  const [showEditor, setShowEditor] = useState(false)
  const [targetMaker, setTargetMaker] = useState<IMaker | null>(null)

  const { data, error, mutate }: {
    data: {
      makers: IMaker[]
      pagination: {
        current_page: number
        next_page: number | null
        prev_page: number | null
        total_pages: number
        total_count: number
      }
    }
    error: any
    mutate: any
  } = useSWR(`${setting.apiPath}/api/maker?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000
  })

  const Reload = (): void => {
    mutate()
  }

  return (
    <Layout>
      <div id="Maker">
        {
          isPresent(error)
            ? <Alert variant="danger" className="m-3">Error: {error.message}</Alert>
            : isAbsent(data)
              ? <Alert variant="warning" className="m-3">Loading...</Alert>
              : <>
                <div className="w-100 overflow-auto">
                  <Table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>country</th>
                        <th>founding_date</th>
                        <th>delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isPresent(data.makers) && Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          {isPresent(data.makers[index])
                            ? (
                            <>
                              <td>
                                <a onClick={(event: any) => {
                                  event.preventDefault()
                                  setTargetMaker(data.makers[index])
                                  setShowEditor(true)
                                }} href={`?target=${data.makers[index].id}`}>{data.makers[index].id}</a>
                              </td>
                              <td>{data.makers[index].name}</td>
                              <td>{data.makers[index].country}</td>
                              <td>{data.makers[index].founding_date.toString()}</td>
                              <td><Button variant="outline-danger" size="sm" onClick={() => {
                                if (!confirm('Delete???')) return
                                fetch(`${setting.apiPath}/api/maker/${data.makers[index].id}`, {
                                  method: 'DELETE'
                                }).then(() => {
                                  NotificationManager.success('データを削除しました。')
                                  mutate()
                                }).catch(() => {
                                  NotificationManager.error('データの削除に失敗しました。')
                                  mutate()
                                })
                              }}>削除</Button></td>
                            </>
                              )
                            : (
                            <td colSpan={4} className="invisible">Empty</td>
                              )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Pagination
                  setPage={setPage}
                  prevPage={data.pagination.prev_page}
                  nextPage={data.pagination.next_page}
                  currentPage={data.pagination.current_page}
                  totalPages={data.pagination.total_pages}
                  totalCount={data.pagination.total_count}
                  reload={Reload}
                />
                {
                  showEditor
                    ? (
                    <MakerEditor
                      modalIsOpen={showEditor}
                      closeModal={() => { setShowEditor(false) }}
                      afterSubmit={() => { mutate(); setShowEditor(false) }}
                      targetMaker={targetMaker}
                    />
                      )
                    : (
                    <Button variant="primary" className="d-block mt-3 m-auto w-100" onClick={() => {
                      setShowEditor(true)
                      setTargetMaker(null)
                    }}>新規作成</Button>
                      )
                }
                <Button variant="outline-danger" className="d-block mt-3 m-auto w-100" size="sm" onClick={() => {
                  if (!confirm('Delete All???')) return
                  fetch(`${setting.apiPath}/api/maker/-1`, {
                    method: 'DELETE'
                  }).then(() => {
                    mutate()
                    NotificationManager.success('すべてのデータを削除しました。')
                  }).catch(() => {
                    alert('Error')
                    NotificationManager.error('データの削除に失敗しました。')
                    mutate()
                  })
                }}>全削除</Button>
              </>
        }
      </div>
    </Layout>
  )
};
