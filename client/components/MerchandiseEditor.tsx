import React, { useState } from 'react'
import Modal, { type Styles } from 'react-modal'
import { Button, Form } from 'react-bootstrap'
import setting from '../setting'
import { type IMerchandise } from '../pages/merchandise'
import { isAbsent, isPresent } from '../src/util'
// @ts-expect-error: No types available.
import { NotificationManager } from 'react-notifications'

Modal.setAppElement('#Modal')

const customStyles: Styles = {
  overlay: {
    zIndex: 999
  },
  content: {
    position: 'relative',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '1000px',
    maxWidth: '95vw',
    height: '800px',
    maxHeight: '95vh'
  }
}

interface MerchandiseEditorProps {
  modalIsOpen: boolean
  closeModal: () => void
  afterSubmit: () => void
  targetMerchandise: IMerchandise | null
}

export default function MerchandiseEditor (props: MerchandiseEditorProps): JSX.Element {
  const {
    targetMerchandise,
    modalIsOpen,
    closeModal,
    afterSubmit
  } = props

  const [name, setName] = useState<string | null>(targetMerchandise?.name ?? null)
  const [price, setPrice] = useState<number | null>(targetMerchandise?.price ?? null)
  const [description, setDescription] = useState<string | null>(targetMerchandise?.description ?? null)

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2>#{' '}
          {
            isPresent(targetMerchandise)
              ? '商品編集'
              : '商品追加'
          }
        </h2>
        <Form>
          <Form.Group className="mt-3">
            <Form.Label>名前</Form.Label>
            <Form.Control type="text" placeholder="名前" value={name ?? ''} onChange={(e) => { setName(e.target.value) }} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>価格</Form.Label>
            <Form.Control type="number" placeholder="価格" value={price ?? ''} onChange={(e) => { setPrice(parseFloat(e.target.value)) }} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>説明</Form.Label>
            <Form.Control as="textarea" rows={5} placeholder="説明" value={description ?? ''} onChange={(e) => { setDescription(e.target.value) }} />
          </Form.Group>
          <Button variant="primary" className="d-block mt-3 m-auto" onClick={() => {
            const isNew = isAbsent(targetMerchandise)
            const method = isNew ? 'POST' : 'PATCH'
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const uri = isNew ? `${setting.apiPath}/api/merchandise` : `${setting.apiPath}/api/merchandise/${targetMerchandise!.id}`
            fetch(uri, {
              method,
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: isNew ? null : targetMerchandise?.id,
                name,
                price,
                description
              })
            }).then(async (response: Response) => {
              if (!response.ok) throw new Error((await response.json()).message)
              afterSubmit()
              NotificationManager.success(isNew
                ? '商品を作成しました。'
                : '商品を更新しました。')
            }).catch((error: Error) => {
              NotificationManager.error(error.message)
            })
          }}>送信</Button>
        </Form>
      </Modal>
    </>
  )
}
