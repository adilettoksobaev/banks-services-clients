import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { DocumentsAPI } from '../../api/DocumentsAPI';
import CalncelDilalog from '../bricks/CalncelDilalog';
import { RegistrationAPI } from '../../api/RegistrationAPI';

type Props = ReturnType<typeof mapStateToProps> & {
    guestRegistrationEnd: boolean;
}

interface Documents {
    documentType: string
    linkText: string
    text: string
}

const RegistrationEnd:React.FC<Props> = ({ regSessionId, guestRegistrationEnd }) => {
    let history = useHistory();
    const [title, setTitle] = useState('');
    const [documents, setDocuments] = useState<Documents[]>([]);
    const [openCancel, setOpenCancel] = useState(false);
    const [guestIdentification, setGuestIdentification] = useState(false);

    const cencelClickOpen = () => {
        setOpenCancel(true);
    }

    const cencelClickClose = () => {
        setOpenCancel(false);
    }

    const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
    };

    const linkTextClick = (documentType: string) => {
        if(regSessionId) {
            DocumentsAPI.getDocument(regSessionId, documentType).then(data => {
                console.log(data)
            })
        }
    }

    const confirmUserRegistrationClick = () => {
        if(guestRegistrationEnd) {
            if(regSessionId) {
                RegistrationAPI.startVideoModeration(regSessionId).then(data => {
                    if(data.status === 'fail') {
                        alert(data.message);
                    }
                    if(data.status === 'success') {
                        setGuestIdentification(true);
                    }
                }).catch(({response}) => alert(response.data.message));
            }
        } else {
            return history.push('/identification');
        }
    }

    useEffect(() => {
        if(regSessionId) {
            DocumentsAPI.getDocumentsForCompletingRegistration(regSessionId).then(data => {
                setTitle(data.result.title);
                setDocuments(data.result.documents);
            })
        }
    }, [regSessionId]);

    return (
        <div className="content registrationEnd" style={guestIdentification ? {display: 'none'} : {}}>
            <Button className="cancel" color="primary" onClick={cencelClickOpen}>Отмена</Button>
            <div className="title">Регистрация завершена</div>
            <div className="secretWord__desc">{title}</div>
            <ul className="registrationEnd__list">
                {documents.map(document => (
                    <li key={document.documentType}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={true}
                                    name={document.documentType}
                                    color="primary"
                                    onChange={checkedChange}
                                />
                            }
                            label={<span>{document.text} <span className="link" onClick={() => linkTextClick(document.documentType)}>{document.linkText}</span></span>}
                        />
                    </li>
                ))}
            </ul>
            <div className="btnRow">
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    onClick={confirmUserRegistrationClick}>Подтвердить</Button>
            </div>
            <CalncelDilalog 
                openCancel={openCancel}
                cencelClickClose={cencelClickClose} 
                backHistory="/stepIndividual" />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    regSessionId: state.registration.regSessionId,
});

export default connect(mapStateToProps)(RegistrationEnd);