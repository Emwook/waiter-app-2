import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import styles from './MessageBox.module.scss';
import { messages } from '../../config/messages';
import { useDispatch, useSelector } from 'react-redux';
import { changeMessage, getMessageNumber } from '../../store/reducers/messageReducer';
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


  return (
    <Col className={clsx({[styles.showMessage]: currentMessageNumber !== 0})}>
      <div  className={clsx(styles.bar, `text-${messageColor} border-${messageColor}`)}>
          <span>{messageDetails}</span>
      </div>
    </Col>
  );
};

export default MessageBox;
