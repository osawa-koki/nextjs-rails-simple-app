import React, { useState } from 'react'
// @ts-expect-error: No types available.
import { NotificationManager } from 'react-notifications'

import useSWR from 'swr'
import { Alert, Button, Table } from 'react-bootstrap'
import Layout from '../components/Layout'
import setting from '../setting'
import { isAbsent, isPresent } from '../src/util'
import { fetcher } from '../src/const'
import Pagination from '../components/Pagination'
import MerchandiseEditor from '../components/MerchandiseEditor'

export interface IMerchandise {
  id: number
  name: string
  price: number
  description: string
  is_available: boolean
  created_at: Date
  updated_at: Date
}

export default function MerchandisePage (): JSX.Element {
  const [page, setPage] = useState(1)

  const [showEditor, setShowEditor] = useState(false)
  const [targetMerchandise, setTargetMerchandise] = useState<IMerchandise | null>(null)

  const { data, error, mutate }: {
    data: {
      merchandises: IMerchandise[]
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
  } = useSWR(`${setting.apiPath}/api/merchandise?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000
  })

  const Reload = (): void => {
    mutate()
  }

  return (
    <Layout>
      <div id="Merchandise">
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
                        <th>price</th>
                        <th>delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isPresent(data.merchandises) && Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          {isPresent(data.merchandises[index])
                            ? (
                            <>
                              <td>
                                <a onClick={(event: any) => {
                                  event.preventDefault()
                                  setTargetMerchandise(data.merchandises[index])
                                  setShowEditor(true)
                                }} href={`?target=${data.merchandises[index].id}`}>{data.merchandises[index].id}</a>
                              </td>
                              <td>{data.merchandises[index].name}</td>
                              <td>$ {data.merchandises[index].price}</td>
                              <td><Button variant="outline-danger" size="sm" onClick={() => {
                                if (!confirm('Delete???')) return
                                fetch(`${setting.apiPath}/api/merchandise/${data.merchandises[index].id}`, {
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
                    <MerchandiseEditor
                      modalIsOpen={showEditor}
                      closeModal={() => { setShowEditor(false) }}
                      afterSubmit={() => { mutate(); setShowEditor(false) }}
                      targetMerchandise={targetMerchandise}
                    />
                      )
                    : (
                    <Button variant="primary" className="d-block mt-3 m-auto w-100" onClick={() => {
                      setShowEditor(true)
                      setTargetMerchandise(null)
                    }}>新規作成</Button>
                      )
                }
                <Button variant="outline-danger" className="d-block mt-3 m-auto w-100" size="sm" onClick={() => {
                  if (!confirm('Delete All???')) return
                  fetch(`${setting.apiPath}/api/merchandise/-1`, {
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
