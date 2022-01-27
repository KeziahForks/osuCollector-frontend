import { useState } from 'react';
import { Card, Image, ListGroup, ListGroupItem } from '../bootstrap-osu-collector'
import { LinkContainer } from 'react-router-bootstrap'
import moment from 'moment'
import { useFallbackImg } from 'utils/misc';
import slimcoverfallback from '../common/slimcoverfallback.jpg'

export default function TournamentCard({ tournament }) {

    const [hovered, setHovered] = useState(false)

    const relativeDate = moment.unix(tournament.dateUploaded._seconds).fromNow()

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Card $lightbg className={`mx-3 ${hovered ? 'shadow' : 'shadow-sm'}`}>
                <LinkContainer to={`/tournaments/${tournament.id}`}>
                    <a className='nostyle'>
                        <img
                            className='card-img-top'
                            src={tournament.banner}
                            onError={ev => useFallbackImg(ev, slimcoverfallback)}
                            style={{ objectFit: 'cover', width: '100%', height: 140 }}
                        />
                        <Card.ImgOverlay className='collection-card-clickable pt-3'>
                            <div style={{ height: 76 }} />
                            <div className='justify-content-between align-items-top' >
                                <h3 className='img-overlay-text'> {tournament.name} </h3>
                            </div>
                        </Card.ImgOverlay>
                    </a>
                </LinkContainer>
                <ListGroup className='list-group-flush'>
                    <ListGroupItem $lightbg>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className='d-flex justify-content-start align-items-center my-1'>
                                <Image className='collection-card-uploader-avatar mr-2' src={`https://a.ppy.sh/${tournament.uploader.id}`} roundedCircle />
                                <LinkContainer to={`/users/${tournament.uploader.id}/uploads`}>
                                    <a> {tournament.uploader.username} </a>
                                </LinkContainer>
                                {tournament.uploader.rank > 0 &&
                                    <small className='text-muted ml-1'>
                                        #{tournament.uploader.rank}
                                    </small>
                                }
                            </div>
                            <small className='text-muted'>{relativeDate}</small>
                        </div>
                    </ListGroupItem>
                </ListGroup>
            </Card>
        </div>
    )
}
