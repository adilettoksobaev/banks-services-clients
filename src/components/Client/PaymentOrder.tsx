import React, { useState } from 'react';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Button } from '@material-ui/core';
import ConfirmModal from '../bricks/ConfirmModal';
import { IPaymentOrders } from '../../api/ClientDocumentsAPI';
import Moment from 'react-moment';
import 'moment/locale/ru';
import { IUserInfo } from '../../api/SessionAPI';
import { SignedIcon } from '../../icons/icons';

type Props = {
    paymentOrder: IPaymentOrders;
    setPaymentDetail: React.Dispatch<React.SetStateAction<boolean>>;
    userInfo: IUserInfo
}

const PaymentOrder:React.FC<Props> = ({ paymentOrder, setPaymentDetail, userInfo }) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openConfirmReject, setOpenConfirmReject] = useState(false);
    const [documentStatus, setDocumentStatus] = useState(paymentOrder.documentStatus);

    const confirmClickOpen = () => {
        setOpenConfirm(true);
    }

    const confirmClickClose = () => {
        setOpenConfirm(false);
    }

    const confirmClickOpenReject = () => {
        setOpenConfirmReject(true);
    }

    const confirmClickCloseReject = () => {
        setOpenConfirmReject(false);
    }

    return (
        <div className="paymentOrder">
            <div className="cancel" onClick={() => setPaymentDetail(false)}><ArrowBackIosRoundedIcon /></div>
            <div className="title">Платежное поручение <br /> {documentStatus === "Signed" && <span>от <Moment format="DD MM YYYY">{paymentOrder.createdDate}</Moment></span>}</div>
            <div className="payment">
                <div className="payment__title">{paymentOrder.document.paymentRecipient.name}</div>
                <p>Сумма: {paymentOrder.document.paymentRecipient.amount} {paymentOrder.document.paymentRecipient.currency}</p>
                {/* <p><Moment format="D MMMM YYYY">{paymentOrder.document.date}</Moment></p> */}
            </div>
            <div className="payment">
                <div className="payment__title">Получатель</div>
                <p>{paymentOrder.document.paymentRecipient.target}</p>
                <p>{paymentOrder.document.paymentRecipient.bank}</p>
                <p>БИК: {paymentOrder.document.paymentRecipient.bik}</p>
                <p>Р/с: {paymentOrder.document.paymentRecipient.paymentAccount}</p>
                <p>{paymentOrder.document.paymentRecipient.paymentCode}</p>
            </div>
            <div className="payment borderNone">
                <div className="payment__title">Плательщик</div>
                <p>{userInfo.fullName}</p>
                <p>Р/с: {paymentOrder.document.payer.accountOfBank}</p>
            </div>
            {documentStatus === "Signed" &&
                <div className="signed">
                    <div className="signed__fullName">{userInfo.fullName}</div>
                    <div className="signed__signature">
                        Подписан: <span><Moment format="DD.MM.YYYY">{paymentOrder.createdDate}</Moment></span> в <span><Moment format="hh:mm:ss">{paymentOrder.createdDate}</Moment></span>
                    </div>
                    <div className="signed__item">
                        <div className="signed__icon"><SignedIcon /></div>
                        Подписано квалифициронной электронной подписью
                    </div>
                </div>
            }
            {documentStatus === "New" && 
                <div className="btnRow">
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="secondary" 
                        disableElevation
                        onClick={confirmClickOpenReject}>Отклонить</Button>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        disableElevation
                        onClick={confirmClickOpen}>Подписать</Button>
                </div>
            }
            <ConfirmModal 
                openConfirm={openConfirm}
                confirmClickClose={confirmClickClose}
                title="Подтверждение"
                text="Вы уверены, что хотите одобрить документ?"
                buttonText="Подтвердить" 
                cinfirm={true} 
                documentId={paymentOrder.documentId}
                setDocumentStatus={setDocumentStatus} />
            <ConfirmModal 
                openConfirm={openConfirmReject}
                confirmClickClose={confirmClickCloseReject}
                title="Заявка"
                text="Вы уверены, что хотите отклонить документ?"
                buttonText="Да" 
                cinfirm={false} 
                documentId={paymentOrder.documentId} 
                setDocumentStatus={setDocumentStatus} />
        </div>
    );
}

export default PaymentOrder;