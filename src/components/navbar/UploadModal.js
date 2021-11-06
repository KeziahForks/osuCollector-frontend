import { useState, useCallback } from 'react';
import { Button, Card, Form, Row, Col, Spinner, Modal } from '../bootstrap-osu-collector';
import { useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { parseCollectionDb } from '../../utils/collectionsDb'
import * as api from '../../utils/api';
import './uploadModal.css'

// eslint-disable-next-line react/prop-types
function UploadModal({ uploadModalIsOpen, setUploadModalIsOpen }) {

    const [selected, setSelected] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [collections, setCollections] = useState([]);
    const history = useHistory();
    const onDrop = useCallback((acceptedFiles) => {
        let file = acceptedFiles[0];
        setFile(file);
        console.log(file);
        let reader = new FileReader();
        reader.onload = async () => {
            console.log('reader');
            setCollections(parseCollectionDb(reader.result));
            console.log('collections', collections);
        }
        reader.readAsArrayBuffer(file);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleChange = ({ target }) => {
        console.log('change');
        const { value, checked } = target;
        if (checked == true) {
            setSelected([value]);
        } else {
            setSelected([]);
        }
    }

    const submit = async () => {
        const selectedCollections = collections.filter((col, index) => selected.includes(index.toString()));
        if (selectedCollections.filter(coll => coll.beatmapChecksums.length > 2000).length > 0) {
            alert('This collection is too big (max collection size: 2000)')
            return
        }
        console.log(selectedCollections);
        setUploading(true);
        try {
            await api.uploadCollections(selectedCollections);
            alert(`${selectedCollections.length} collections uploaded!`);
            history.push(`/recent`);
        } catch (err) {
            alert(err.message + '\n\n' + 'If this is your first time seeing this, you can try uploading the collection again.');
        }
        setUploading(false);
        setUploadModalIsOpen(false);
    }

    return (
        <Modal
            // className="upload-modal"
            show={uploadModalIsOpen}
            onHide={() => setUploadModalIsOpen(false)}
            size='lg'
            centered
        >
            <Modal.Body className='px-5 py-4'>
                <h3>1. Open collection.db</h3>
                collection.db is a file that contains all of your osu! collections. It is located in your osu! install folder. Example:
                <pre className='bg-light my-2 py-1 px-3'><code>
                    C:\Users\jun\AppData\Local\osu!\collection.db
                </code></pre>
                <br></br>
                <Form>
                    <div className="dragon-drop" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            file != null ?
                                file.name
                                :
                                isDragActive ?
                                    <p>Drop the file here ...</p>
                                    :
                                    <p>Choose a file or drag it here.</p>
                        }
                    </div>
                    <br />
                    {collections.length > 0 &&
                        <div>
                            <h3>2. Select which collection to upload</h3>
                            <div style={{ height: 420, overflowY: 'scroll' }}>
                                {collections.map((collection, index) =>
                                    <Card key={index} className='shadow-sm mx-3 my-2 py-2 px-4'>
                                        <Row>
                                            <Col>
                                                {collection.name}
                                            </Col>
                                            <Col>
                                                {collection.beatmapChecksums.length} beatmaps
                                            </Col>
                                            <Col xs={1}>
                                                <Form.Check checked={selected.find(value => parseInt(value) == index) !== undefined} value={index} onChange={handleChange} />
                                            </Col>
                                        </Row>
                                    </Card>
                                )}
                            </div>
                            <br></br>
                            <div className='upload-buttons'>
                                <Button
                                    style={{ width: '11em' }}
                                    onClick={submit}>
                                    {uploading ?
                                        <>
                                            <Spinner
                                                as='span'
                                                animation='border'
                                                size='sm'
                                                role='status'
                                                className='mx-2'
                                                aria-hidden='true' />
                                            Uploading...
                                        </>
                                        :
                                        'Upload'
                                    }
                                </Button>
                            </div>
                        </div>
                    }
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default UploadModal
