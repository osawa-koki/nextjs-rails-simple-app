import React from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { isAbsent, isPresent } from '../src/util'

interface PaginationProps {
  setPage: (page: number) => void
  prevPage: number | null
  nextPage: number | null
  currentPage: number
  totalPages: number
  totalCount: number
  reload: () => void
}

export default function Pagination (props: PaginationProps): JSX.Element {
  const {
    setPage,
    prevPage,
    nextPage,
    currentPage,
    totalPages,
    totalCount,
    reload
  } = props

  return (
    <>
      <div className="mt-3 d-flex justify-content-between">
        <Button variant="success" onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (isPresent(prevPage)) setPage(prevPage!)
        }} className="d-block m-auto" size="sm" disabled={isAbsent(prevPage)}>前へ</Button>
        <Button variant="success" onClick={reload} className="d-block m-auto" size="sm">再読み込み</Button>
        <Button variant="success" onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (isPresent(nextPage)) setPage(nextPage!)
        }} className="d-block m-auto" size="sm" disabled={isAbsent(nextPage)}>次へ</Button>
      </div>
      <Table className="border mt-3">
        <tbody>
          <tr>
            <td>現在のページ</td>
            <td>
            <Form.Select value={currentPage} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setPage(parseInt(event.target.value))
            }}>
              {Array.from(Array(totalPages).keys()).map((i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </Form.Select>
            </td>
          </tr>
          <tr>
            <td>総ページ数</td>
            <td>{totalPages}</td>
          </tr>
          <tr>
            <td>総件数</td>
            <td>{totalCount}</td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}
