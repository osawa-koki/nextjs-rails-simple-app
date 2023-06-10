import React, { useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { isAbsent, isPresent } from '../src/util'

type PaginationProps = {
  set_page: (page: number) => void
  prev_page: number | null
  next_page: number | null
  current_page: number
  total_pages: number
  total_count: number
  reload: () => void
}

export default function Pagination(props: PaginationProps) {

  const {
    set_page,
    prev_page,
    next_page,
    current_page,
    total_pages,
    total_count,
    reload,
  } = props

  return (
    <>
      <div className="mt-3 d-flex justify-content-between">
        <Button variant="success" onClick={() => {
          if (isPresent(prev_page)) set_page(prev_page)
        }} className="d-block m-auto" size="sm" disabled={isAbsent(prev_page)}>前へ</Button>
        <Button variant="success" onClick={reload} className="d-block m-auto" size="sm">再読み込み</Button>
        <Button variant="success" onClick={() => {
          if (isPresent(next_page)) set_page(next_page)
        }} className="d-block m-auto" size="sm" disabled={isAbsent(next_page)}>次へ</Button>
      </div>
      <Table className="border mt-3">
        <tbody>
          <tr>
            <td>現在のページ</td>
            <td>{current_page}</td>
          </tr>
          <tr>
            <td>総ページ数</td>
            <td>{total_pages}</td>
          </tr>
          <tr>
            <td>総件数</td>
            <td>{total_count}</td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}
