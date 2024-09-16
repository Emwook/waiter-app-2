import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import styles from './MessageBox.module.scss';
import { messages } from '../../../config/messages';
import { useDispatch, useSelector } from 'react-redux';
import { changeMessage, getMessageNumber } from '../../../store/reducers/messageReducer';
import clsx from 'clsx';


const MessageBox: React.FC = () => {
  const currentMessageNumber: number = useSelector(getMessageNumber);
  const message = messages.find(msg => msg.messageNumber === currentMessageNumber);
  const messageDetails = message?.messageDetails || '';
  const messageColor = message?.messageColor || 'primary';

  const dispatch = useDispatch();

   useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (message && currentMessageNumber !== 0) {
      timer = setTimeout(() => {
        dispatch(changeMessage(0) as any);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message, currentMessageNumber, dispatch]);

  const handleHide = () => {
    dispatch(changeMessage(0) as any);
  }

  return (
    <div className={clsx({[styles.showMessage]: currentMessageNumber !== 0})}>
      <Row  className={clsx(styles.bar, `text-${messageColor} border-${messageColor} mt-2`)}>
        <Col xs={10}>
          <p>{messageDetails}</p>
        </Col>
        <Col xs={1} className={styles.button}>
          <Button variant='clear' className={`bg-none text-${messageColor} px-1 my-0 py-0 mx-1`} onClick={handleHide}>
            <i className='bi bi-x'/>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default MessageBox;
