"use client";

import VideoCall from "../videoCall/VideoCallComponent";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BoxChat from "../chat/BoxChatComponent";


export default function RoomComponent() {

  return (
    <>
      <Row>
            <Col md={8}>
                <Card >
                    <Card.Body>
                        <VideoCall />
                     </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
              {/* <Card>
                <Card.Body>
                   <BoxChat />
                </Card.Body>
              </Card> */}
            </Col>
      </Row>
    </>
  )
}
