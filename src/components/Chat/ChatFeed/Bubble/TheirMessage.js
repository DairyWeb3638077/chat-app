import React, { useState, useContext } from 'react'

import { ChatEngineContext } from 'react-chat-engine'

import { getFileName, isImage } from './file'

import FileView from './FileView'
import Thumbnail from './Thumbnail'

import { Avatar, Dot } from 'react-chat-engine'

import Body from './Body'

import { Row, Col, setConfiguration } from 'react-grid-system'

setConfiguration({ maxScreenClass: 'xl' })


const TheirMessage = props => {
    const { conn } = useContext(ChatEngineContext)
    const [hovered, setHovered] = useState(false)

    function renderReads() {
        const { chat, message } = props

        if (!chat) { return <div /> }

        return chat.people.map((person, index) => {
            if (message.id === person.last_read) {
                return (
                    <Dot
                        key={`read_${index}`}
                        avatar={person.person.avatar}
                        username={person.person.username}
                        style={{ float: 'left', marginLeft: '4px' }}
                    />
                )
            }
            return <div key={`read_${index}`} />
        })
    }
    function getDateTime(date, offset) {
        if (!date) return ''
        
        date = date.replace(' ', 'T')
        offset = offset ? offset : 0
    
        const year = date.substr(0,4)
        const month = date.substr(5,2)
        const day = date.substr(8,2)
        const hour = date.substr(11,2)
        const minute = date.substr(14,2)
        const second = date.substr(17,2)
        
        var d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
        d.setHours(d.getHours() + offset)
        return d
    }
    

    
     function formatTime(dateTime) {
        var time = dateTime.toLocaleString('en-US')
        return time.split(' ')[1].slice(0, -3) + ' ' + time.slice(-2)
    }
    function renderImages() {
        const { message } = props
        const attachments = message && message.attachments ? message.attachments : []

        return attachments.map((attachment, index) => {
            const fileName = getFileName(attachment.file)
            if (isImage(fileName)) {
                return <Thumbnail attachment={attachment} key={`attachment_${index}`} />
            } else {
                return <div key={`attachment${index}`} />
            }
        })
    }

    function renderFiles() {
        const { message } = props
        const attachments = message && message.attachments ? message.attachments : []

        return attachments.map((attachment, index) => {
            const fileName = getFileName(attachment.file)
            if (!isImage(fileName)) {
                return <FileView attachment={attachment} key={`attachment_${index}`} />
            } else {
                return <div key={`attachment${index}`} />
            }
        })
    }

    const { lastMessage, message, nextMessage } = props

    if (!message) { return <div /> }

    const attachments = message && message.attachments && message.attachments

    const topLeftRadius = !lastMessage || lastMessage.sender_username !== message.sender_username ? '1.3em' : '0.3em'
    const bottomLeftRadius = !nextMessage || nextMessage.sender_username !== message.sender_username ? '1.3em' : '0.3em'

    const borderRadius = `${topLeftRadius} 1.3em 1.3em ${bottomLeftRadius}`
    const paddingBottom = !nextMessage || nextMessage.sender_username !== message.sender_username ? '12px' : '2px'

    return (
        <div
            style={{ width: '100%', paddingBottom }}
            className='ce-message-row ce-their-message'
        >
            {
                (!lastMessage || lastMessage.sender_username !== message.sender_username) &&
                <div style={styles.nameText} className='ce-their-message-sender'>
                    {message.sender_username}
                </div>
            }

            <Row style={{ paddingLeft: '2px' }} className='ce-their-message-row'>
                <Col xs={12} sm={12} md={12}>
                    <div style={{ height: '0px' }} className='ce-their-message-avatar'>
                        {
                            (!nextMessage || nextMessage.sender_username !== message.sender_username) &&
                            <Avatar
                                show_online={false}
                                username={message.sender_username}
                                avatar={message.sender && message.sender.avatar}
                            />
                        }
                    </div>

                    <div
                        style={{ display: 'auto', paddingLeft: '50px' }}
                        className='ce-their-message-attachments-container ce-their-message-images-container'
                    >
                        {renderImages()}
                    </div>

                    <div
                        style={{ display: 'auto', paddingLeft: '50px' }}
                        className='ce-their-message-attachments-container ce-their-message-files-container'
                    >
                        {renderFiles()}
                    </div>

                    {
                        !attachments || (message.text &&
                        <div style={{ paddingLeft: '48px' }}>
                            <div
                                className='ce-message-bubble ce-their-message-bubble'
                                style={{ ...styles.theirMessage, ...{ borderRadius } }}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                <Body text={message.text} />
                            </div>
                        </div>)
                    }

                    {
                        hovered &&
                        <span style={{ position: 'relative', top: 'calc(50% - 12px)', left: '8px', fontSize: '14px', color: 'rgba(0, 0, 0, 0.4)' }}>
                            {formatTime(getDateTime(message.created, conn !== null && conn.offset))}
                        </span>
                    }
                </Col>

                {/* Col is 9 to not slipp into RHS */}
                <Col
                    xs={9}
                    style={{ marginLeft: '48px' }}
                    className='ce-reads-row ce-their-reads-row'
                >
                    {renderReads()}
                </Col>
            </Row>
        </div>
    )
}

export default TheirMessage

const styles = {
    theirMessage: {
        cursor: 'pointer',
        color: 'black',
        float: 'left',
        padding: '12px',
        fontSize: '15px',
        whiteSpace: 'pre-line',
        backgroundColor: '#f1f0f0',
        overflowWrap: 'anywhere',
        maxWidth: 'calc(100% - 100px)',
    },
    nameText: {
        paddingLeft: '62px',
        paddingBottom: '2px',
        color: 'rgba(0, 0, 0, .40)',
        fontSize: '15px'
    }
}