import React from "react";
import { Reservation } from "../../types/reservationTypes";
import { formatHour } from "../../utils/reservations/formatHour";
import { Row, Col } from "react-bootstrap";

interface SelectedResDetailsProps {
    selectedRes: Reservation;
}

const SelectedResDetails:React.FC<SelectedResDetailsProps> = ({selectedRes}) => {
    return(
        <>
        <Row className="px-3 py-auto mb-2 mx-2 border-dark border-bottom">
          <Col><h5 className=" pr-2">id</h5></Col>
          <Col><h5>Table</h5></Col>
          <Col><h5>date</h5></Col>
          <Col><h5>time</h5></Col>
          <Col><h5>repeating</h5></Col>
        </Row>
        <Row className="px-3 mx-2">
          <Col><h5 className="pr-2">{selectedRes?.id}</h5></Col>
          <Col><h5>{selectedRes?.tableNumber}</h5></Col>
          <Col><h5>{selectedRes?.dateStart}</h5></Col>
          <Col><h5>{formatHour(selectedRes?.hour)} - {formatHour(Number(selectedRes?.hour) + selectedRes?.duration)}</h5></Col>
          <Col><h5>{selectedRes?.repeat}</h5></Col>
        </Row>
      </>
    );
}
export default SelectedResDetails;