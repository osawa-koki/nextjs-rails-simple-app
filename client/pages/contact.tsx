import React, { useState } from "react";

import useSWR from 'swr';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import Layout from "../components/Layout";
import setting from "../setting";

type IContact = {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
};

const fetcher = url => fetch(url).then(r => r.json());

export default function ContactPage() {

  const [page, setPage] = useState(1);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: contacts, error, mutate }: {
    data: {
      contacts: IContact[];
      pagination: {
        current_page: number;
        next_page: number | null;
        prev_page: number | null;
        total_pages: number;
        total_count: number;
      };
    };
    error: any;
    mutate: any;
  } = useSWR(`${setting.apiPath}/api/contact?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const Reload = () => {
    mutate();
  };

  return (
    <Layout>
      <div id="Contact">
        {
          error ? <Alert variant="danger" className="m-3">Error: {error.message}</Alert> :
            !contacts ? <Alert variant="warning" className="m-3">Loading...</Alert> :
              <>
                <div className="w-100 overflow-auto">
                  <Table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>title</th>
                        <th>content</th>
                        <th>delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.contacts && Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          {contacts.contacts[index] ? (
                            <>
                              <td>{contacts.contacts[index].id}</td>
                              <td>{contacts.contacts[index].title}</td>
                              <td>{contacts.contacts[index].content}</td>
                              <td><Button variant="outline-danger" size="sm" onClick={async () => {
                                if (confirm('Delete???') === false) return;
                                await fetch(`${setting.apiPath}/api/contact/${contacts.contacts[index].id}`, {
                                  method: 'DELETE',
                                });
                                mutate();
                              }}>削除</Button></td>
                            </>
                          ) : (
                            <td colSpan={4} className="invisible">Empty</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="mt-3 d-flex justify-content-between">
                  <Button variant="success" onClick={() => {
                    if (contacts.pagination.prev_page) {
                      setPage(page - 1);
                    }
                  }} className="d-block m-auto" size="sm" disabled={contacts.pagination.prev_page === null}>前へ</Button>
                  <Button variant="success" onClick={Reload} className="d-block m-auto" size="sm">再読み込み</Button>
                  <Button variant="success" onClick={() => {
                    if (contacts.pagination.next_page) {
                      setPage(page + 1);
                    }
                  }} className="d-block m-auto" size="sm" disabled={contacts.pagination.next_page === null}>次へ</Button>
                </div>
                <Table className="border mt-3">
                  <tbody>
                    <tr>
                      <td>現在のページ</td>
                      <td>{contacts.pagination.current_page}</td>
                    </tr>
                    <tr>
                      <td>総ページ数</td>
                      <td>{contacts.pagination.total_pages}</td>
                    </tr>
                    <tr>
                      <td>総件数</td>
                      <td>{contacts.pagination.total_count}</td>
                    </tr>
                  </tbody>
                </Table>
                <div className="mt-3 p-3 border bg-light">
                  <Form>
                    <Form.Group className="mt-3">
                      <Form.Label>タイトル</Form.Label>
                      <Form.Control type="text" placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label>内容</Form.Label>
                      <Form.Control as="textarea" rows={3} placeholder="内容" value={content} onChange={(e) => setContent(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" className="d-block mt-3 m-auto" onClick={async () => {
                      await fetch(`${setting.apiPath}/api/contact`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          title: title,
                          content: content,
                        }),
                      });
                      mutate();
                    }}>送信</Button>
                  </Form>
                </div>
                <Button variant="outline-danger" className="d-block mt-3 m-auto w-100" size="sm" onClick={async () => {
                  if (confirm('Delete All???') === false) return;
                  await fetch(`${setting.apiPath}/api/contact/-1`, {
                    method: 'DELETE',
                  });
                  mutate();
                }}>全削除</Button>
              </>
        }
      </div>
    </Layout>
  );
};
