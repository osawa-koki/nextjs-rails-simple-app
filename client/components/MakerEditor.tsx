import React, { useState } from 'react'
import Modal, { Styles } from 'react-modal'
import { Button, Form } from 'react-bootstrap'
import setting from '../setting'
import { type IMaker } from '../pages/maker'
import { isAbsent, isPresent } from '../src/util'
import dayjs, { type Dayjs } from 'dayjs'

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

interface MakerEditorProps {
  modalIsOpen: boolean
  closeModal: () => void
  afterSubmit: () => void
  targetMaker: IMaker | null
}

export default function MakerEditor (props: MakerEditorProps): JSX.Element {
  const {
    targetMaker,
    modalIsOpen,
    closeModal,
    afterSubmit
  } = props

  const [name, setName] = useState<string | null>(targetMaker?.name ?? null)
  const [country, setCountry] = useState<string | null>(targetMaker?.country ?? null)
  const [foundingDate, setFoundingDate] = useState<Dayjs>(dayjs(targetMaker?.founding_date) ?? null)

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <h2>#{' '}
        {
          isPresent(targetMaker)
            ? 'メーカー編集'
            : 'メーカー追加'
        }
      </h2>
      <Form>
        <Form.Group className="mt-3">
          <Form.Label>名前</Form.Label>
          <Form.Control type="text" placeholder="名前" value={name ?? ''} onChange={(e) => { setName(e.target.value) }} />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>国</Form.Label>
          <Form.Control type="text" placeholder="国" value={country ?? ''} onChange={(e) => { setCountry(e.target.value) }} />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>設立日</Form.Label>
          <Form.Control type="date" placeholder="設立日" value={foundingDate?.format('YYYY-MM-DD')} onChange={(e) => { setFoundingDate(dayjs(e.target.value)) }} />
        </Form.Group>
        <Button variant="primary" className="d-block mt-3 m-auto" onClick={() => {
          const isNew = isAbsent(targetMaker)
          const method = isNew ? 'POST' : 'PATCH'
          // @ts-ignore: `targetMaker`がnullでないことを保証。
          const uri = isNew ? `${setting.apiPath}/api/maker` : `${setting.apiPath}/api/maker/${targetMaker.id}`
          fetch(uri, {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: isNew ? null : targetMaker?.id,
              name,
              country,
              founding_date: foundingDate.format('YYYY-MM-DD')
            })
          }).then(async (response: Response) => {
            if (!response.ok) throw new Error((await response.json()).message)
            afterSubmit()
          }).catch((error: Error) => {
            alert(error)
          })
        }}>送信</Button>
      </Form>
    </Modal>
  )
}
