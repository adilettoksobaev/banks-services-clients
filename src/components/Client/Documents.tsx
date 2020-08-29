import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Tabs, Tab } from '@material-ui/core';
import { NextIcon, DesctopGreenIcon, DocumentIcon, EmptyIcon } from '../../icons/icons';
import { ClientDocumentsAPI, IPaymentOrders } from '../../api/ClientDocumentsAPI';
import { IUserInfo } from '../../api/SessionAPI';
import PaymentOrder from './PaymentOrder';
import Moment from 'react-moment';
import 'moment/locale/ru';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    userInfo: IUserInfo
}

const Documents:React.FC<Props> = ({ sessionId, userInfo, documentStatusSuccess }) =>  {
    const [value, setValue] = React.useState(0);
    const [paymentOrders, setPaymentOrders] = useState<IPaymentOrders[]>([]);
    const [paymentOrder, setPaymentOrder] = useState<IPaymentOrders | null>(null);
    const [paymentDetail, setPaymentDetail] = useState(false);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if(sessionId) {
            ClientDocumentsAPI.getPaymentOrders(sessionId, userInfo.userId).then(data => {
                setPaymentOrders(data);
            }).catch(({response}) => alert(response));
        }   
    }, [sessionId, userInfo.userId, documentStatusSuccess]);

    const paymentOrderClick = (paymentOrder: IPaymentOrders) => {
        setPaymentOrder(paymentOrder);
        setPaymentDetail(true);
    }

    const newPaymentOrders = paymentOrders.filter(paymentOrder => paymentOrder.documentStatus === "New");
    const historyPaymentOrders = paymentOrders.filter(paymentOrder => paymentOrder.documentStatus === "Signed");

    return (
        <>
        {!paymentDetail && 
            <div className="document">
                <div className="title">Платежные поручения</div>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    >
                    <Tab label="НОВЫЕ" {...a11yProps(0)} />
                    <Tab label="ИСТОРИЯ" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    {newPaymentOrders.length === 0 ?
                       <div className="empty">
                           <EmptyIcon />
                           <div className="empty__title">Для создания документа обратитесь к оператору</div>
                       </div> 
                    : <div className="tabPanel__date"><Moment format="D MMMM YYYY">{new Date()}</Moment></div> }
                    {newPaymentOrders.map(paymentOrder => (
                        <div key={'new-' + paymentOrder.documentId} className="documentBlock" onClick={() => paymentOrderClick(paymentOrder)}>
                            <div className="documentBlock__icon"><DocumentIcon /></div>
                            <div>
                                <div className="documentBlock__title">{paymentOrder.document.paymentRecipient.name}</div>
                                <div className="documentBlock__price">Сумма: {paymentOrder.document.paymentRecipient.amount} {paymentOrder.document.paymentRecipient.currency}</div>
                            </div>
                            <div className="documentBlock__endIcon"><NextIcon /></div>
                        </div>
                    ))}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {historyPaymentOrders.length === 0 ?
                       <div className="empty">
                           <EmptyIcon />
                           <div className="empty__title">Для создания документа обратитесь к оператору</div>
                       </div> 
                    : <div className="tabPanel__date"><Moment format="D MMMM YYYY">{new Date()}</Moment></div> }
                    {historyPaymentOrders.map(paymentOrder => (
                        <div key={'history-' + paymentOrder.documentId} className="documentBlock" onClick={() => paymentOrderClick(paymentOrder)}>
                            <div className="documentBlock__icon"><DesctopGreenIcon /></div>
                            <div>
                                <div className="documentBlock__title">{paymentOrder.document.paymentRecipient.name}</div>
                                <div className="documentBlock__price">Сумма: {paymentOrder.document.paymentRecipient.amount} {paymentOrder.document.paymentRecipient.currency}</div>
                            </div>
                            <div className="documentBlock__endIcon"><NextIcon /></div>
                        </div>
                    ))}
                </TabPanel>
            </div>
        }
        {paymentOrder &&  paymentDetail &&
            <PaymentOrder 
                paymentOrder={paymentOrder} 
                setPaymentDetail={setPaymentDetail}
                userInfo={userInfo} />
        }
        </>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
            >
            {value === index && (
                <div className="tabPanel">{children}</div>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.registration.sessionId,
    documentStatusSuccess: state.registration.documentStatusSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    logoutAction: () => dispatch(actions.registration.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Documents);