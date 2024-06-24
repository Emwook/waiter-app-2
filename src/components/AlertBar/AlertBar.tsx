import React, { useState, useEffect } from 'react';
import { Alert, Col } from 'react-bootstrap';

interface AlertMessage {
  messageNumber: number;
  messageText: string;
}

const AlertBar: React.FC = () => {
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (alertMessage) {
      // Display the message for 5 seconds
      timer = setTimeout(() => {
        setAlertMessage(null); // Clear the message after 5 seconds
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer); // Clean up the timer if component unmounts or alert changes
    };
  }, [alertMessage]);

  const showMessage = (messageNumber: number) => {
    let messageText = '';

    switch (messageNumber) {
      case 1:
        messageText = 'Table successfully added.';
        break;
      case 2:
        messageText = 'Tables joined.';
        break;
      case 3:
        messageText = 'Cannot combine these tables.';
        break;
      default:
        messageText = 'Unknown message.';
        break;
    }

    setAlertMessage({ messageNumber, messageText });
  };

  return (
    <Col className="mx-5 mt-4 justify-content-center m-0 w-100">
      {alertMessage && (
        <Alert variant="info" onClose={() => setAlertMessage(null)} dismissible>
          <Alert.Heading>Message {alertMessage.messageNumber}</Alert.Heading>
          <p>{alertMessage.messageText}</p>
        </Alert>
      )}
    </Col>
  );
};

export default AlertBar;
