import React, { useState } from 'react'

import useSWR from 'swr'
import { Alert, Button, Form, Table } from 'react-bootstrap'
import Layout from '../components/Layout'
import setting from '../setting'
import { isAbsent, isPresent } from '../src/util'
import { emptyFunction, fetcher } from '../src/const'

interface IMaker {
  id: number
  name: string
  country: string
  founding_date: Date
  created_at: Date
  updated_at: Date
}

export default function ContactPage (): JSX.Element {
  const [page, setPage] = useState(1)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

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
      <div id="Contact">
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
                              <td>{data.makers[index].id}</td>
                              <td>{data.makers[index].name}</td>
                              <td>{data.makers[index].country}</td>
                              <td>{data.makers[index].founding_date.toString()}</td>
                              <td><Button variant="outline-danger" size="sm" onClick={() => {
                                if (!confirm('Delete???')) return
                                fetch(`${setting.apiPath}/api/maker/${data.makers[index].id}`, {
                                  method: 'DELETE'
                                }).then(emptyFunction).catch(emptyFunction)
                                mutate()
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
                <div className="mt-3 d-flex justify-content-between">
                  <Button variant="success" onClick={() => {
                    if (isPresent(data.pagination.prev_page)) {
                      setPage(page - 1)
                    }
                  }} className="d-block m-auto" size="sm" disabled={isAbsent(data.pagination.prev_page)}>前へ</Button>
                  <Button variant="success" onClick={Reload} className="d-block m-auto" size="sm">再読み込み</Button>
                  <Button variant="success" onClick={() => {
                    if (isPresent(data.pagination.next_page)) {
                      setPage(page + 1)
                    }
                  }} className="d-block m-auto" size="sm" disabled={isAbsent(data.pagination.next_page)}>次へ</Button>
                </div>
                <Table className="border mt-3">
                  <tbody>
                    <tr>
                      <td>現在のページ</td>
                      <td>{data.pagination.current_page}</td>
                    </tr>
                    <tr>
                      <td>総ページ数</td>
                      <td>{data.pagination.total_pages}</td>
                    </tr>
                    <tr>
                      <td>総件数</td>
                      <td>{data.pagination.total_count}</td>
                    </tr>
                  </tbody>
                </Table>
                <div className="mt-3 p-3 border bg-light">
                  <Form>
                    <Form.Group className="mt-3">
                      <Form.Label>タイトル</Form.Label>
                      <Form.Control type="text" placeholder="タイトル" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>内容</Form.Label>
                      <Form.Control as="textarea" rows={3} placeholder="内容" value={content} onChange={(e) => { setContent(e.target.value) }} />
                    </Form.Group>
                    <Button variant="primary" className="d-block mt-3 m-auto" onClick={() => {
                      fetch(`${setting.apiPath}/api/maker`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          title,
                          content
                        })
                      }).then(emptyFunction).catch(emptyFunction)
                      mutate()
                    }}>送信</Button>
                  </Form>
                </div>
                <Button variant="outline-danger" className="d-block mt-3 m-auto w-100" size="sm" onClick={() => {
                  if (!confirm('Delete All???')) return
                  fetch(`${setting.apiPath}/api/maker/-1`, {
                    method: 'DELETE'
                  }).then(emptyFunction).catch(emptyFunction)
                  mutate()
                }}>全削除</Button>
              </>
        }
      </div>
    </Layout>
  )
};
